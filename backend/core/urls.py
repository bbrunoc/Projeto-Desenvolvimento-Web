from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# --- Configuração do Roteador (API) ---
router = DefaultRouter()
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'projetos', views.ProjetoViewSet, basename='projeto')
router.register(r'conteudos', views.ConteudoViewSet)
router.register(r'templates', views.TemplatePromptViewSet)
router.register(r'analiticos', views.AnaliticoViewSet)

urlpatterns = [
    # 1. Rotas da API (Essenciais para o React)
    path('api/', include(router.urls)),

    # 2. Endpoints Especiais
    path('api/gemini-chat/', views.gemini_chat, name='gemini_chat'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/register/', views.api_register, name='api_register'),
    path('api/buscar-imagens/', views.buscar_imagens, name='buscar_imagens'),
    # --- APAGUE AS ROTAS LEGADAS ABAIXO SE ELAS ESTIVEREM DANDO ERRO ---
    # path('', views.projeto_list, name='projeto_list'),       <-- Apague ou comente
    # path('novo/', views.projeto_create, name='projeto_create'), <-- CAUSADOR DO ERRO
    # path('<int:pk>/editar/', views.projeto_edit, name='projeto_edit'), <-- Apague ou comente
    # path('<int:pk>/deletar/', views.projeto_delete, name='projeto_delete'), <-- Apague ou comente
]