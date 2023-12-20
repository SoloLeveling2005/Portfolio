import secrets

from django.contrib.auth.hashers import make_password, check_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from user.middlewares import authorization
from user.models import User as UserModel, UserToken as UserTokenModel, BusinessUser as BusinessUserModel
from user.serializers import AuthSerializer, LoginResponseSerializer, LogoutSerializer, UpdateLoginSerializer, \
    UserSerializer, BusinessUserUpdateSerializer, BusinessUserGetSerializer



class RegisterViw(APIView):
    serializer_class = AuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        password = make_password(serializer.data['password'])
        login = serializer.data['login']

        if UserModel.objects.filter(login=login).exists():
            return Response(status=status.HTTP_409_CONFLICT)

        user = UserModel()
        user.login = login
        user.password = password
        user.save()

        return Response(status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    Коды ошибок:
        403 - пользователя не существует
        400 - неправильный логин или пароль
    """
    auth_serializer = AuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.auth_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        login = serializer.data['login']
        user = UserModel.objects.filter(login=login)

        if not user.exists():
            return Response(status=status.HTTP_403_FORBIDDEN)

        user = user.first()

        if not check_password(serializer.data['password'], user.password):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        token = secrets.token_hex(40)[40:]
        token_model = UserTokenModel()
        token_model.user = user
        token_model.token = token
        token_model.save()

        return Response(status=201, data=LoginResponseSerializer({'token': token}).data)


class LogoutView(APIView):
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.headers)
        serializer.is_valid(raise_exception=True)

        token = str(str(serializer.data['Authorization']).lower().split('token')[1]).replace(' ', '')
        token_model = UserTokenModel.objects.filter(token=token)

        if not token_model.exists():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        token_model.delete()

        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    update_login_serializer = UpdateLoginSerializer
    user_serializer = UserSerializer

    @authorization
    def get(self, request, *args, **kwargs):
        return Response(data=UserSerializer({"login":self.request.user.login, "token":self.request.token_model.token}).data,
                        status=status.HTTP_200_OK)

    @authorization
    def update(self, request, *args, **kwargs):
        serializer = self.update_login_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_login = serializer.data['login']
        user = self.request.user
        user.login = new_login
        user.save()

        return Response(status=status.HTTP_201_CREATED)


class BusinessUser(APIView):
    business_user_update_serializer = BusinessUserUpdateSerializer

    @authorization
    def get(self, request, *args, **kwargs):
        business_user_model = BusinessUserModel.objects.filter(user=self.request.user)

        if not business_user_model.exists():
            return Response(status=status.HTTP_204_NO_CONTENT)
        business_user_model = business_user_model.first()

        return Response(data=BusinessUserGetSerializer({"prompt": business_user_model.setting_prompt}).data)

    @authorization
    def post(self, request, *args, **kwargs):
        business_user_model_exists = BusinessUserModel.objects.filter(user=self.request.user)
        if business_user_model_exists.exists():
            return Response(status=status.HTTP_409_CONFLICT)

        business_user_model = BusinessUserModel()
        business_user_model.user = self.request.user
        business_user_model.save()

        return Response(status=status.HTTP_201_CREATED)

    @authorization
    def patch(self, request, *args, **kwargs):
        serializer = self.business_user_update_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        prompt = serializer.data['prompt']
        business_user_model = BusinessUserModel.objects.filter(user=self.request.user)

        if not business_user_model.exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        business_user_model = business_user_model.first()

        business_user_model.setting_prompt = prompt
        business_user_model.save()

        return Response(status=status.HTTP_200_OK)

    @authorization
    def delete(self, request, *args, **kwargs):
        business_user_model = BusinessUserModel.objects.filter(user=self.request.user)
        if business_user_model.exists():
            business_user_model.delete()

        return Response(status=status.HTTP_200_OK)
