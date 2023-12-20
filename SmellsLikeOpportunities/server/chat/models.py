from django.db import models

from user.models import User


# Create your models here.


class Room(models.Model):
    room_slug = models.CharField(max_length=200)
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_user_1')
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_user_2')
    created_at = models.DateTimeField(auto_now_add=True)
    user_1_autoresponder = models.BooleanField(default=False)
    user_2_autoresponder = models.BooleanField(default=False)


class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)




