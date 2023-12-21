from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from .views import Chat, FindChat, Message, Room

urlpatterns = [
    # path('home', views.home, name='home'),
    path('chat', Chat.as_view(), name='chat'),
    path('messages', Message.as_view(), name='messages'),
    path('search', FindChat.as_view(), name='search'),
    path('room', Room.as_view(), name='room')
]
