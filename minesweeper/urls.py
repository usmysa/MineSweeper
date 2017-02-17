#-*- coding:utf-8 -*-

from django.conf.urls import url
from minesweeper import views

# 正規表現でルーティングを行っている
urlpatterns = [
    url(r'^$', views.game_view, name='game_view'),
    url(r'^data/$', views.data_list, name='data_list'),
    url(r'^newrecord', views.post_ajax)
]
