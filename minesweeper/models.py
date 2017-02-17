from __future__ import unicode_literals

from django.db import models

# Create your models here.
class ClearData(models.Model):
    _id = models.AutoField('id', primary_key=True)
    username = models.CharField('UserName', max_length=255)
    cleartime = models.IntegerField('ClearTime')

    def __str__(self):
        return self.username
