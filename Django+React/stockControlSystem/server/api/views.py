from django.db.models import Sum, F, Subquery, OuterRef
from django.db.models.functions import Coalesce
from django.shortcuts import render
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Warehouse, Product, Realization
from api.serializers import WarehouseSerializers, WarehouseCreateSerializer, ProductCreateSerializer, \
    ProductSerializers, RealizationSerializer, RealizationSerializers, ProductChangeSerializer, ProductProductId, \
    ProductSerializer
from user.middlewares import authorization


# Create your views here.


class WarehouseView(APIView):
    warehouseCreateSerializer = WarehouseCreateSerializer

    @authorization
    def get(self, request, *args, **kwargs):
        """Получение списка складов"""

        user = self.request.user

        warehouse = Warehouse.objects.filter(
            user=user
        )

        return Response(data=WarehouseSerializers(warehouse, many=True).data, status=status.HTTP_200_OK)

    @authorization
    def post(self, request, *args, **kwargs):
        """Создание склада"""

        serializer = self.warehouseCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = serializer.data['title']

        Warehouse.objects.create(
            title=title,
            user=self.request.user,
        )

        return Response(status=status.HTTP_201_CREATED)


class ProductView(APIView):
    product_create_serializer = ProductCreateSerializer
    product_change_serializer = ProductChangeSerializer

    @authorization
    def get(self, request, warehouse_id, *args, **kwargs):
        """Получение списка товаров"""

        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        products = Product.objects.filter(warehouse=warehouse)

        return Response(ProductSerializers(products, many=True).data, status=status.HTTP_200_OK)

    @authorization
    def post(self, request, warehouse_id, *args, **kwargs):
        """Создание товара"""

        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        serializer = self.product_create_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        Product.objects.create(
            warehouse=warehouse,
            title=serializer.data['title'],
            category=serializer.data['category'],
            measure_unit=serializer.data['measure_unit'],
            minimum_stock_level=serializer.data['minimum_stock_level'],
            maximum_stock_level=serializer.data['maximum_stock_level']
        )

        return Response(status=status.HTTP_201_CREATED)

    @authorization
    def patch(self, request, warehouse_id, *args, **kwargs):
        """Обновление данных товара"""

        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        serializer = self.product_change_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.filter(id=serializer.data['product_id'], warehouse=warehouse)

        if not product.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        product = product.first()

        product.title = serializer.data['title']
        product.category = serializer.data['category']
        product.measure_unit = serializer.data['measure_unit']
        product.minimum_stock_level = serializer.data['minimum_stock_level']
        product.maximum_stock_level = serializer.data['maximum_stock_level']
        product.save()

        return Response(status=status.HTTP_200_OK)


class ProductDeleteView(APIView):
    product_product_id = ProductProductId

    @authorization
    def post(self, request, warehouse_id, *args, **kwargs):
        """Удаление товара"""

        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        if warehouse.user != self.request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = self.product_product_id(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = Product.objects.filter(id=serializer.data['product_id'], warehouse=warehouse)

        if not product.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        product = product.first()

        realization = Realization.objects.filter(product=product)
        realization.delete()

        product.delete()

        return Response(status=status.HTTP_200_OK)


class RealizationView(APIView):
    realization_serializer = RealizationSerializer

    @authorization
    def post(self, request, warehouse_id, product_id, *args, **kwargs):
        """Добавить реализацию товара"""

        serializer = self.realization_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        product = Product.objects.filter(id=product_id)

        if not product.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        product = product.first()

        quantity_in_stock = product.quantity_in_stock()

        if quantity_in_stock - serializer.data['realization_count'] < 0 \
                and serializer.data['realization_type'] == False:
            return Response(status=status.HTTP_409_CONFLICT)

        realization = Realization.objects.create(
            date_of_shipment=serializer.data['date_of_shipment'],
            product=product,
            realization_count=serializer.data['realization_count'],
            client_information=serializer.data['client_information'],
            payment_method=serializer.data['payment_method'],
            realization_type=serializer.data['realization_type']
        )

        return Response(status=status.HTTP_201_CREATED)

    @authorization
    def get(self, request, warehouse_id, product_id, *args, **kwargs):
        """Получаем все реализации"""
        warehouse = Warehouse.objects.filter(id=warehouse_id)

        if not warehouse.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        warehouse = warehouse.first()

        realizations = Realization.objects.filter(product__warehouse=warehouse)

        return Response(data=RealizationSerializers(realizations, many=True).data, status=status.HTTP_200_OK)


class RemainsView(APIView):
    @authorization
    def get(self, request, *args, **kwargs):
        """Получаем все реализации"""

        warehouses = Warehouse.objects.filter(user=self.request.user)

        serializer = WarehouseSerializers(warehouses, many=True)

        return Response(data=serializer.data, status=status.HTTP_200_OK)


class RealizationViews(APIView):
    @authorization
    def get(self, request, *args, **kwargs):
        user = self.request.user

        user_realizations = Realization.objects.filter(product__warehouse__user=user)

        return Response(data=RealizationSerializers(user_realizations, many=True).data, status=status.HTTP_200_OK)


class ProductViews(APIView):
    @authorization
    def get(self, request, *args, **kwargs):
        user = self.request.user

        user_products = Product.objects.filter(warehouse__user=user)

        return Response(data=ProductSerializers(user_products, many=True).data, status=status.HTTP_200_OK)

