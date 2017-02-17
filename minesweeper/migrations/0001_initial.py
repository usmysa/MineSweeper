# -*- coding: utf-8 -*-
# Generated by Django 1.10.2 on 2016-10-14 05:42
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ClearData',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('_id', models.IntegerField(unique=True, verbose_name='id')),
                ('username', models.CharField(max_length=255, verbose_name='UserName')),
                ('cleartime', models.IntegerField(verbose_name='ClearTime')),
            ],
        ),
    ]