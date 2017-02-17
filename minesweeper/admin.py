from django.contrib import admin
from minesweeper.models import ClearData

# Register your models here.
#admin.site.register(ClearData)

class ClearDataAdmin(admin.ModelAdmin):
    list_display = ('_id', 'username', 'cleartime')
    list_display_links = ('username', 'cleartime')
admin.site.register(ClearData, ClearDataAdmin)
