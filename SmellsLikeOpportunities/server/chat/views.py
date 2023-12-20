from django.db.models import Q
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from chat.models import Room as RoomModel, Message as MessageModel
from chat.serializers import CreateChatSerializer, DeleteChatSerializer, FindChatSerializer, \
    RoomRoomSerializer, FindChatUserSerializer, MessagesRoomSerializer, MessageSerializer, UpdateChatSerializer
from user.middlewares import authorization
from user.models import User, BusinessUser

import random
import string


def generate_random_string(length):
    # Вы можете изменить символы в строке, если хотите включить другие символы
    characters = string.ascii_letters + string.digits
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string


# Create your views here.

class Message(APIView):
    messages_room_serializer = MessagesRoomSerializer

    @authorization
    def post(self, request, *args, **kwargs):
        serializer = self.messages_room_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        room_slug = serializer.data['room_slug']

        room = RoomModel.objects.filter(room_slug=room_slug)
        if not room.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        room = room.first()

        messages = MessageModel.objects.filter(room=room)

        return Response(data=MessageSerializer(messages, many=True).data, status=status.HTTP_200_OK)


class Room(APIView):
    chat_serializer = UpdateChatSerializer

    @authorization
    def post(self, request, *args, **kwargs):
        serializer = self.chat_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        room_slug = serializer.data['room_slug']
        room = RoomModel.objects.filter(room_slug=room_slug)
        if not room.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(data=RoomRoomSerializer(room.first()).data, status=status.HTTP_200_OK)


class Chat(APIView):
    create_chat_serializer = CreateChatSerializer
    delete_chat_serializer = DeleteChatSerializer
    update_chat_serializer = UpdateChatSerializer

    @authorization
    def get(self, request, *args, **kwargs):
        rooms = []
        rooms += RoomModel.objects.filter(Q(user_2=self.request.user))
        rooms += RoomModel.objects.filter(Q(user_1=self.request.user))

        return Response(data=RoomRoomSerializer(rooms, many=True).data, status=status.HTTP_200_OK)

    @authorization
    def post(self, request, *args, **kwargs):
        serializer = self.create_chat_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        partner_login = serializer.data['login']
        partner = User.objects.filter(login=partner_login)
        if not partner.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        partner = partner.first()
        business_partner = BusinessUser.objects.filter(user=partner)
        user = self.request.user

        room_exists = RoomModel.objects.filter(Q(user_1=user, user_2=partner) or Q(user_1=partner, user_2=user))
        if room_exists.exists():
            room = room_exists.first()
            return Response(data={'slug': room.room_slug}, status=status.HTTP_409_CONFLICT)

        room = RoomModel()
        room.room_slug = generate_random_string(30)
        room.user_1 = user
        room.user_2 = partner
        if business_partner.exists():
            room.user_2_autoresponder = True
        room.save()

        return Response(data={'slug': room.room_slug}, status=status.HTTP_201_CREATED)

    @authorization
    def delete(self, request, *args, **kwargs):
        serializer = self.delete_chat_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        room_slug = serializer.data['room_slug']
        user = self.request.user

        room = RoomModel.objects.filter(room_slug=room_slug)
        if not room.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        room = room.first()

        if room.user_1 != user and room.user_2 != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        room.delete()

        return Response(status=status.HTTP_200_OK)

    @authorization
    def patch(self, request, *args, **kwargs):
        serializer = self.update_chat_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        room_slug = serializer.data['room_slug']
        autoresponder_type = False
        user = self.request.user

        room = RoomModel.objects.filter(room_slug=room_slug)
        if not room.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        room = room.first()

        if room.user_1 == user:
            room.user_1_autoresponder = False if room.user_1_autoresponder else True
            room.save()
            autoresponder_type = True if room.user_1_autoresponder else False
        else:
            room.user_2_autoresponder = False if room.user_2_autoresponder else True
            room.save()
            autoresponder_type = True if room.user_2_autoresponder else False

        return Response(data={"autoresponder_type": autoresponder_type}, status=status.HTTP_200_OK)


class FindChat(APIView):
    find_chat_serializer = FindChatSerializer

    @authorization
    def post(self, request, *args, **kwargs):
        serializer = self.find_chat_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        userR = self.request.user
        find_prompt = serializer.data['find_prompt']

        users = User.objects.filter(Q(login__contains=find_prompt))

        return Response(data=FindChatUserSerializer([user for user in users if user != userR], many=True).data,
                        status=status.HTTP_200_OK)
