from django.conf.urls.static import static
from django.urls import path

from django_admin import settings
from .views import RegisterViw, LoginView, LogoutView

urlpatterns = [
    # register
    # login
    # logout
    path('register', RegisterViw.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
]
