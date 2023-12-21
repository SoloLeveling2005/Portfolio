from django.urls import path
from .views import RegisterViw, LoginView, LogoutView, UserView, BusinessUser

urlpatterns = [
    path('register/', RegisterViw.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('info', UserView.as_view(), name='user'),
    path('businessUser', BusinessUser.as_view())
]
