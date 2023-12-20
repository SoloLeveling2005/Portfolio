# serializers.py
from rest_framework import serializers


class AuthSerializer(serializers.Serializer):
    login = serializers.CharField(required=True, max_length=255)
    password = serializers.CharField(required=True, max_length=255)


class LogoutSerializer(serializers.Serializer):
    Authorization = serializers.CharField(required=True, max_length=255)


class LoginResponseSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)


class UpdateLoginSerializer(serializers.Serializer):
    login = serializers.CharField(required=True)


class UserSerializer(serializers.Serializer):
    login = serializers.CharField()
    token = serializers.CharField()


class BusinessUserUpdateSerializer(serializers.Serializer):
    prompt = serializers.CharField(required=True)


class BusinessUserGetSerializer(serializers.Serializer):
    prompt = serializers.CharField(required=True)

class AuthorizationSerializer(serializers.Serializer):
    Authorization = serializers.CharField(required=True, max_length=255)