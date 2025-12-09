from django.contrib import admin
from .models import Usuario, Projeto, Conteudo, TemplatePrompt, Analitico
admin.site.register(Usuario)
admin.site.register(Projeto)
admin.site.register(Conteudo)
admin.site.register(TemplatePrompt)
admin.site.register(Analitico)

