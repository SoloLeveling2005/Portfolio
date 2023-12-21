# serializers.py
from rest_framework import serializers

from .models import Warehouse, Product, Realization


class ProductSerializers(serializers.ModelSerializer):
    quantity_in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    @staticmethod
    def get_quantity_in_stock(obj):
        return obj.quantity_in_stock()


class WarehouseSerializers(serializers.ModelSerializer):
    product = ProductSerializers

    class Meta:
        model = Warehouse
        fields = '__all__'


class RealizationSerializers(serializers.ModelSerializer):
    class Meta:
        model = Realization
        fields = '__all__'


class WarehouseCreateSerializer(serializers.Serializer):
    title = serializers.CharField()


class ProductCreateSerializer(serializers.Serializer):
    title = serializers.CharField()
    category = serializers.CharField()
    measure_unit = serializers.CharField()
    minimum_stock_level = serializers.IntegerField()
    maximum_stock_level = serializers.IntegerField()


class ProductChangeSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    title = serializers.CharField()
    category = serializers.CharField()
    measure_unit = serializers.CharField()
    minimum_stock_level = serializers.IntegerField()
    maximum_stock_level = serializers.IntegerField()


class RealizationSerializer(serializers.Serializer):
    date_of_shipment = serializers.DateTimeField()
    realization_count = serializers.IntegerField()
    client_information = serializers.CharField()
    payment_method = serializers.CharField()
    realization_type = serializers.BooleanField()
    

class ProductProductId(serializers.Serializer):
    product_id = serializers.IntegerField()


class ProductSerializer(serializers.ModelSerializer):
    warehouse = WarehouseSerializers

    class Meta:
        model = Product
        fields = '__all__'
