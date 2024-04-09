from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.analise, name = "analise"),
    path('seleciona_ano_mes', views.seleciona_ano_mes, name="seleciona_ano_mes")
    ]
