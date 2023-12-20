# serializers.py
from rest_framework import serializers

from .models import User


# RegisterSerializer - регистрация пользователя
class RegisterSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()


# LoginSerializer - авторизации пользователя
class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()


# RegisterLoginSerializer - регистрация/авторизация пользователя
class RegisterLoginSerializer(serializers.Serializer):
    Authorization = serializers.CharField()
