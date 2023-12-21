from django.db import models
from django.db.models import Sum

from user.models import User


# Create your models here.


class Warehouse(models.Model):
    title = models.CharField(max_length=155)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Product(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    title = models.CharField(max_length=155)  # Название товара
    category = models.CharField(max_length=155)  # Категория
    measure_unit = models.CharField(max_length=155)  # Единица измерения
    minimum_stock_level = models.IntegerField()  # Минимальный уровень запасов
    maximum_stock_level = models.IntegerField()  # Максимальный уровень запасов
    date_of_last_receipt = models.DateTimeField(null=True)  # Дата последнего поступления
    created_at = models.DateTimeField(auto_now_add=True)

    def quantity_in_stock(self):
        """
            Количество в наличии

            Фильтрация реализаций:
            Используем self.realization_set.filter(realization_type=True), чтобы получить все записи о поступлениях (где realization_type равно True).
            Далее, с помощью aggregate(models.Sum('count'))['count__sum'] мы суммируем количество товаров во всех поступлениях.
            Фильтрация реализаций:
            Используем self.realization_set.filter(realization_type=False), чтобы получить все записи о реализациях (где realization_type равно False).
            Снова с помощью aggregate(models.Sum('count'))['count__sum'] суммируем количество товаров во всех реализациях.
            Вычисление остатка:
            После получения общего количества поступлений и реализаций, вычитаем количество реализаций из общего количества поступлений.
            Возвращение результата:
            Результат (остаток) возвращается из метода.
        """
        # Реализуй этот метод, используя информацию о поступлениях и реализациях товара
        total_receipts = self.realization_set.filter(realization_type=True).aggregate(models.Sum('realization_count'))[
                             'realization_count__sum'] or 0
        total_realizations = self.realization_set.filter(realization_type=False).aggregate(models.Sum('realization_count'))[
                                 'realization_count__sum'] or 0
        stock_quantity = total_receipts - total_realizations
        return stock_quantity


class Realization(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Идентификатор товара.
    client_information = models.CharField(max_length=255)  # Информация о поставщике/покупателе.
    realization_count = models.IntegerField()  # Количество реализации.
    realization_type = models.BooleanField()  # Тип реализации. Завоз или вывоз товара. То есть + или - товар.
    payment_method = models.CharField(max_length=100)  # Метод оплаты.
    date_of_shipment = models.DateTimeField()  # Дата отгрузки/погрузки.
    created_at = models.DateTimeField(auto_now_add=True)
