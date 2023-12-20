import asyncio
import json
from pprint import pprint
import g4f
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from django.core import serializers
from rest_framework import status
from rest_framework.response import Response
from urllib.parse import unquote
from chat.models import Room, Message
from chat.serializers import MessageSerializer
from user.models import User, BusinessUser


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def check_room(self):
        self.room = await sync_to_async(Room.objects.filter)(room_slug=self.room_slug)
        if not self.room.exists():
            await self.send(text_data=json.dumps({
                "room_message": ""
            }))

    @async_to_sync()
    async def sendMessage(self, response, partner, message_id):
        self.login = partner.login
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "gpt_message",
                "message_id": message_id,
                "message": response,
            }
        )

    @sync_to_async()
    def sendMessageStart(self, login, room_slug, message, chat_type='chat'):
        room = Room.objects.get(room_slug=room_slug)
        print(f'Сообщение от пользователя {login}')
        if chat_type == 'chat':
            print('Сценарий 1')
            # Если сообщение пришло от первого пользователя, ответ делает второй если у него включен автоответчик
            if room.user_1.login == login:
                if room.user_2_autoresponder:
                    self.sendChatGptAutoresponder(room_slug, room.user_1.login)

            # Если сообщение пришло от второго пользователя, ответ делает первый если у него включен автоответчик
            elif room.user_2.login == login:
                if room.user_1_autoresponder:
                    self.sendChatGptAutoresponder(room_slug, room.user_2.login)
        else:
            print('Сценарий 2')
            if room.user_1.login == login:
                if room.user_2_autoresponder:
                    self.sendChatGptAutoresponder(room_slug, room.user_1.login)

            if room.user_2.login == login:
                if room.user_1_autoresponder:
                    self.sendChatGptAutoresponder(room_slug, room.user_2.login)

    def sendChatGptAutoresponder(self, room_slug, user_login):
        print("началась генерация ответа")
        room = Room.objects.filter(room_slug=room_slug)
        user = User.objects.filter(login=user_login)
        # print(user)
        try:
            room = room.first()
            user = user.first()
            partner = room.user_2 if room.user_1.login == user.login else room.user_1

            prompt = "Твои настройки следующие. Используй их для ответов на вопросы.\n"  # "Ты ведёшь беседу с чатботом, который представляет меня, и я постараюсь отвечать так, как если бы я был человеком. Если что-то неясно или нужно уточнение, дай мне знать!\n"
            business_user = BusinessUser.objects.filter(user=partner)
            if business_user.exists():
                business_user = business_user.first()
                print("business_user",business_user)
                prompt += business_user.setting_prompt
            print("prompt",prompt)

            messages_history = Message.objects.filter(room=room).order_by('created_at')[:10]
            last_10_messages = [
                {"role": ("assistant" if partner == message.user else 'user'), "content": message.message} for message
                in messages_history
            ]
            print([
                    {"role": "system", "content": prompt},
                    *last_10_messages
                ])
            response = g4f.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {"role": "system", "content": prompt},
                    *last_10_messages
                ],
            )
            data_model = Message.objects.create(room=room, user=partner, message=response)
            self.sendMessage(response, partner, data_model.id)


        except Exception as e:
            print(e)

    @sync_to_async()
    def getMessages(self, room):
        messages = Message.objects.filter(room=room)
        return MessageSerializer(messages, many=True).data

    @sync_to_async()
    def myMessage(self, message_id):
        message = Message.objects.filter(id=message_id).first()
        return MessageSerializer(message).data

    async def get_messages(self, room_slug):
        room = await sync_to_async(Room.objects.get)(room_slug=room_slug)
        messages = Message.objects.filter(room=room)
        serialized_data = await self.getMessages(room)
        return serialized_data

    def get_login(self, data):
        # print('chat_message', str(data.decode('utf-8')).split('=')[1])
        return unquote(str(data.decode('utf-8')).split('=')[1])

    def get_login_gpt(self, data, room_slug):
        user_login = unquote(str(data.decode('utf-8')).split('=')[1])
        room = Room.objects.filter(room_slug=room_slug)
        user = User.objects.filter(login=user_login)
        room = room.first()
        user = user.first()

        if room.user_1 == user:
            user_login = room.user_2.login
        else:
            user_login = room.user_1.login

        # print('chat_message', str(data.decode('utf-8')).split('=')[1])
        return user_login

    async def connect(self):

        # Получаем название комнаты
        self.room_slug = self.scope['url_route']['kwargs']['room_slug']
        self.login = await sync_to_async(self.get_login)(self.scope['query_string'])

        self.room_group_name = f'chat_{self.room_slug}'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        mess = await self.get_messages(self.room_slug)
        await self.send(text_data=json.dumps({
            "room_messages": mess,
        }))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        method_ = data["method"]


        if method_ == 'post':
            message = data["message"]
            login = await sync_to_async(self.get_login)(self.scope['query_string'])
            room_slug = self.scope['url_route']['kwargs']['room_slug']

            # await sync_to_async(print)(f"Пришло сообщениие от {login} : {message}")

            message_id = await self.save_message(login, room_slug, message)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_id": message_id,
                    "message": message,
                }
            )
        if method_ == 'gpt':
            message = data["message"]
            room_slug = self.scope['url_route']['kwargs']['room_slug']
            login = await sync_to_async(self.get_login)(self.scope['query_string'])

            await sync_to_async(print)(f"Пришло сообщениие от gpt {login} : {message}")

            await self.sendMessageStart(
                login=login,
                room_slug=self.scope['url_route']['kwargs']['room_slug'],
                message=message,
                chat_type='gpt'
            )

    async def chat_message(self, event):
        message = event["message"]
        message_id = event["message_id"]
        login = await sync_to_async(self.get_login)(self.scope['query_string'])
        message_data = await self.myMessage(message_id)

        print('chat_message')

        await self.send(text_data=json.dumps({
            "message": message,
            "login": message_data['user']['login'],
            "message_id": message_id,
            'gpt': False
        }))

        if message_data['user']['login'] == login:

            await self.sendMessageStart(
                login=login,
                room_slug=self.scope['url_route']['kwargs']['room_slug'],
                message=message
            )


    # Не используется
    async def gpt_message(self, event):
        message = event["message"]
        message_id = event["message_id"]
        login = await sync_to_async(self.get_login)(self.scope['query_string'])

        message_data = await self.myMessage(message_id)
        await self.send(text_data=json.dumps({
            "message": message,
            "login": message_data['user']['login'],
            "message_id": message_id,
            'gpt': True
        }))

    @sync_to_async
    def save_message(self, login, room_slug, message):
        user = User.objects.get(login=login)
        room = Room.objects.get(room_slug=room_slug)
        data_model = Message.objects.create(room=room, user=user, message=message)

        return data_model.id

    @sync_to_async
    def delete_message(self, id_):
        message_ = Message.objects.get(id=id_)
        message_.delete()
