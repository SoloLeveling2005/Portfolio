from rest_framework import status
from rest_framework.response import Response

from user.models import UserToken
from user.serializers import AuthorizationSerializer


def authorization(func):
    def wrapper(instance, *args, **kwargs):
        serializer = AuthorizationSerializer(data=instance.request.headers)
        serializer.is_valid(raise_exception=True)

        token = str(str(serializer.data['Authorization']).lower().split('token')[1]).replace(' ', '')
        token_model = UserToken.objects.filter(token=token)
        if not token_model.exists():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        token_model = token_model.first()

        user = token_model.get_user()

        instance.request.token_model = token_model
        instance.request.user = user

        result = func(instance, *args, **kwargs)
        return result

    return wrapper
