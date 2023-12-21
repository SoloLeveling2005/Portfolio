import secrets

from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from user.middlewares import authorization
from user.models import User as UserModel, UserToken as UserTokenModel
from user.serializers import RegisterLoginSerializer, RegisterSerializer, LoginSerializer


class RegisterViw(APIView):
    serializer = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        password = make_password(serializer.data['password'])
        login = serializer.data['login']

        if UserModel.objects.filter(login=login).exists():
            return Response(data={'message': 'Пользователь уже существует'}, status=status.HTTP_409_CONFLICT)

        user = UserModel()
        user.login = login
        user.password = password
        user.save()

        return Response(status=status.HTTP_201_CREATED)


class LoginView(APIView):
    serializer = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login = serializer.data['login']
        user = UserModel.objects.filter(login=login)

        if not user.exists():
            return Response(data={'message': 'Пользователя не существует'}, status=status.HTTP_403_FORBIDDEN)

        user = user.first()

        if not check_password(serializer.data['password'], user.password):
            return Response(data={'message': 'Пароль введен неверно'}, status=status.HTTP_400_BAD_REQUEST)

        token = secrets.token_hex(40)[40:]
        token_model = UserTokenModel()
        token_model.user = user
        token_model.token = token
        token_model.save()

        return Response(status=201, data={'message': 'Успешная авторизация', 'token': token})


class LogoutView(APIView):

    @authorization
    def post(self, request, *args, **kwargs):
        self.request.token_model.delete()
        return Response(status=status.HTTP_200_OK, data={'message': 'Успешный выход из системы'})

