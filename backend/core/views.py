import os
import json
import google.generativeai as genai
import base64
import io
import requests
from PIL import Image 
from dotenv import load_dotenv

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

# REST FRAMEWORK
from rest_framework import viewsets
from .models import Projeto, Usuario, Conteudo, TemplatePrompt, Analitico
from .serializers import (
    ProjetoSerializer, UsuarioSerializer, ConteudoSerializer, 
    TemplatePromptSerializer, AnaliticoSerializer
)

# 1. Carrega variáveis de ambiente
load_dotenv()

# --- CONFIGURAÇÃO DA IA (GEMINI) ---
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("⚠️ AVISO: Chave GEMINI_API_KEY não encontrada no arquivo .env")
else:
    genai.configure(api_key=api_key)

# NOTA: Removemos a definição global de 'model' aqui para evitar erros na inicialização.
# O modelo será escolhido dinamicamente dentro da função gemini_chat.

# --- VIEWS DA API ---

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ProjetoViewSet(viewsets.ModelViewSet):
    serializer_class = ProjetoSerializer

    def get_queryset(self):
        usuario_id = self.request.query_params.get('usuario')
        if usuario_id:
            return Projeto.objects.filter(usuario_id=usuario_id).order_by('-data_criacao')
        return Projeto.objects.none()

class ConteudoViewSet(viewsets.ModelViewSet):
    queryset = Conteudo.objects.all()
    serializer_class = ConteudoSerializer

class TemplatePromptViewSet(viewsets.ModelViewSet):
    queryset = TemplatePrompt.objects.all()
    serializer_class = TemplatePromptSerializer

class AnaliticoViewSet(viewsets.ModelViewSet):
    queryset = Analitico.objects.all()
    serializer_class = AnaliticoSerializer


# --- ENDPOINTS CUSTOMIZADOS ---

@csrf_exempt
def gemini_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')

            # --- SOLUÇÃO DEFINITIVA PARA ERRO 404 ---
            # Em vez de adivinhar o nome ("gemini-pro", "v1", "1.5"), 
            # perguntamos API quais modelos estão disponíveis para esta chave.
            
            modelo_escolhido = None
            
            try:
                for m in genai.list_models():
                    # Procura um modelo que suporte geração de texto ('generateContent')
                    if 'generateContent' in m.supported_generation_methods:
                        modelo_escolhido = m.name # Ex: 'models/gemini-1.5-flash-001'
                        print(f"Modelo encontrado e selecionado: {modelo_escolhido}")
                        break
            except Exception as e:
                 return JsonResponse({'response': f"Erro ao listar modelos: {str(e)}"}, status=200)

            if not modelo_escolhido:
                return JsonResponse({'response': "Erro: Nenhum modelo compatível encontrado na sua API Key."}, status=200)

            # Instancia o modelo com o nome exato que a API devolveu
            model = genai.GenerativeModel(modelo_escolhido)
            
            # Gera a resposta
            prompt = f"Você é um assistente de marketing. {user_message}"
            response = model.generate_content(prompt)
            
            return JsonResponse({'response': response.text})

        except Exception as e:
            return JsonResponse({'response': f"Erro interno na IA: {str(e)}"}, status=200)

    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            # 1. Autentica no sistema padrão
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                
                # 2. LÓGICA DE CORREÇÃO DE ID:
                # Tenta achar o perfil na tabela 'Usuario' (core_usuario)
                # Se achar, usa o ID desse perfil. Se não (ex: admin), usa o ID padrão.
                final_id = user.id 
                
                try:
                    perfil = Usuario.objects.get(username=user.username)
                    final_id = perfil.id # <--- PEGA O ID CERTO DA TABELA CERTA
                except Usuario.DoesNotExist:
                    # Se for um superuser que não tem perfil, mantém o ID do auth
                    pass

                return JsonResponse({
                    'success': True, 
                    'username': user.username, 
                    'id': final_id # Envia o ID corrigido para o React
                })
            else:
                return JsonResponse({'success': False, 'error': 'Usuário ou senha inválidos'}, status=401)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
            
    return JsonResponse({'error': 'Método não permitido'}, status=405)

@csrf_exempt
def api_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            nome_negocio = data.get('nome_negocio', 'Meu Negócio')

            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'error': 'Este usuário já existe.'}, status=400)

            # Cria no Auth do Django
            user = User.objects.create_user(username=username, email=email, password=password)
            
            # Cria no Perfil do App (Tabela Usuario)
            Usuario.objects.create(
                username=username,
                email=email,
                nome_negocio=nome_negocio,
                nicho="Geral",
                nivel_assinatura="gratuito"
            )

            return JsonResponse({'success': True, 'message': 'Usuário criado com sucesso!'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método não permitido'}, status=405)

@require_http_methods(["GET"])
def buscar_imagens(request):
    termo = request.GET.get('termo', '')
    
    if not termo:
        return JsonResponse({'error': 'Termo de busca não fornecido'}, status=400)

    url = f"https://api.pexels.com/v1/search?query={termo}&per_page=3&locale=pt-BR"
    
    headers = {
        "Authorization": os.environ.get("PEXELS_API_KEY")
    }

    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        
        imagens = []
        if 'photos' in data:
            for photo in data['photos']:
                imagens.append({
                    'id': photo['id'],
                    'url_pequena': photo['src']['medium'],
                    'url_grande': photo['src']['large'],
                    'fotografo': photo['photographer']
                })
        
        return JsonResponse({'sucesso': True, 'imagens': imagens})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def home(request): 
    return render(request, 'core/base.html')

def projeto_list(request): 
    return render(request, 'core/projeto_list.html', {'projetos': Projeto.objects.all()})