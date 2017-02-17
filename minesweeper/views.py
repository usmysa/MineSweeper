#-*- coding:utf-8 -*-

import json
# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import render_to_response

from minesweeper.models import ClearData

def game_view(request):
    best_time_query = ClearData.objects.all().order_by("cleartime")
    best_time = best_time_query[0].cleartime
    objects = { 'lifes': range(8), 'widths': range(19), 'heights': range(34), 'best_time': best_time }
    return render(request,
                  'minesweeper/game_view.html',
                  objects)

def data_list(request):
    # return HttpResponse('クリアデータの一覧')
    data_list = ClearData.objects.all().order_by('username')
    return render(request,
                  'minesweeper/data_list.html',
                  {'data_list': data_list})

def post_ajax(request):
    if request.method == 'POST':
        username = request.POST['user_name']
        cleartime = request.POST["clear_time"]
        insert_data = ClearData(username=username, cleartime=cleartime)
        insert_data.save()
    return HttpResponse("")
