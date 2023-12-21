# serializers.py
from rest_framework import serializers

from chat.models import Message, Room
from user.models import User


class CreateChatSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)


class DeleteChatSerializer(serializers.Serializer):
    room_slug = serializers.CharField(required=True)


class UpdateChatSerializer(serializers.Serializer):
    # type = serializers.BooleanField(required=True)
    room_slug = serializers.CharField(required=True)



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['login', 'created_at']


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Вложенный сериализатор для поля ForeignKey user
    room = RoomSerializer()  # Вложенный сериализатор для поля ForeignKey room

    class Meta:
        model = Message
        fields = '__all__'


# FindChat
class FindChatSerializer(serializers.Serializer):
    find_prompt = serializers.CharField(required=False)


class FindChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['login', 'created_at']


#
class RoomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['login', 'created_at']  # Укажите необходимые поля


class RoomMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class RoomRoomSerializer(serializers.ModelSerializer):
    user_1 = RoomUserSerializer()
    user_2 = RoomUserSerializer()
    messages = RoomMessageSerializer(many=True, read_only=True, source='messages.order_by("-created_at")')

    class Meta:
        model = Room
        fields = ['room_slug', 'user_1', 'user_2', 'created_at', 'messages', 'user_1_autoresponder', 'user_2_autoresponder']


# Messages
class MessagesRoomSerializer(serializers.Serializer):
    room_slug = serializers.CharField(required=True)