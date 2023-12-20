from django.db import models


class User(models.Model):
    login = models.CharField(max_length=155, unique=True)
    password = models.CharField(max_length=155)
    created_at = models.DateTimeField(auto_now_add=True)


class UserToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_user(self):
        return self.user

