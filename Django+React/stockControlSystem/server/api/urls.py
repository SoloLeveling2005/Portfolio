from django.conf.urls.static import static
from django.urls import path

from api.views import ProductView, RealizationView, WarehouseView, ProductDeleteView, RemainsView, RealizationViews, ProductViews
from django_admin import settings
# from .views import

urlpatterns = [
    path('warehouse/', WarehouseView.as_view(), name='warehouse'),
    path('warehouse/<str:warehouse_id>/products/', ProductView.as_view(), name='products'),
    path('warehouse/<str:warehouse_id>/products/delete', ProductDeleteView.as_view(), name='product_delete'),
    path('warehouse/<str:warehouse_id>/products/<str:product_id>/', RealizationView.as_view(), name='warehouse'),
    path('warehouse/remains', RemainsView.as_view(), name='remains'),
    path('warehouse/realizations', RealizationViews.as_view()),
    path('warehouse/products', ProductViews.as_view()),
]
