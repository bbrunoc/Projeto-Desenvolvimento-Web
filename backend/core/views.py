import os
import json
import google.generativeai as genai
import base64
import io
import requests
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
import os
from PIL import Image # <--- Importante para manipular imagens
from dotenv import load_dotenv
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

# REST FRAMEWORK
from rest_framework import viewsets
from .models import Projeto, Usuario, Conteudo, TemplatePrompt, Analitico
from .serializers import (
    ProjetoSerializer, UsuarioSerializer, ConteudoSerializer, 
    TemplatePromptSerializer, AnaliticoSerializer
)
from .forms import ProjetoForm 

# 1. Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# --- CONFIGURAÇÃO DA IA (GEMINI) ---
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("⚠️ AVISO: Chave GEMINI_API_KEY não encontrada no arquivo .env")
else:
    genai.configure(api_key=api_key)

# Instancia o modelo (Use 'gemini-1.5-flash' para respostas rápidas)
model = genai.GenerativeModel("gemini-2.5-flash")

# --- VIEWS DA API (As importantes para o React) ---

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class ProjetoViewSet(viewsets.ModelViewSet):
    serializer_class = ProjetoSerializer

    def get_queryset(self):
        # Filtra projetos pelo ID do usuário passado na URL
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


# --- ENDPOINTS CUSTOMIZADOS (Login, Registro e Chat) ---

@csrf_exempt
def gemini_chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            image_data = data.get('image') # Pega a imagem se houver

            # Contexto básico
            prompt = f"Você é um assistente especialista em marketing. {user_message}"

            inputs = [prompt] # Lista de coisas para mandar pro Gemini

            # Se tiver imagem, decodifica e adiciona na lista
            if image_data:
                try:
                    # Remove o cabeçalho "data:image/png;base64," se existir
                    if "base64," in image_data:
                        image_data = image_data.split("base64,")[1]

                    # Converte texto -> imagem real
                    image_bytes = base64.b64decode(image_data)
                    image = Image.open(io.BytesIO(image_bytes))
                    inputs.append(image) # Adiciona a imagem ao pedido
                    print("Imagem processada com sucesso!")
                except Exception as img_err:
                    print(f"Erro na imagem: {img_err}")

            # Envia a lista (Texto + Imagem) para o Gemini
            response = model.generate_content(inputs)
            return JsonResponse({'response': response.text})

        except Exception as e:
            print(f"Erro geral: {e}")
            return JsonResponse({'response': f"Erro: {str(e)}"}, status=200)

    return JsonResponse({'error': 'Método não permitido'}, status=405)
@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                # Retorna ID e Username para o React salvar
                return JsonResponse({'success': True, 'username': user.username, 'id': user.id})
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

            # Verifica se usuário já existe no Django Auth
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'error': 'Este usuário já existe.'}, status=400)

            # 1. Cria usuário no sistema de autenticação do Django
            user = User.objects.create_user(username=username, email=email, password=password)
            
            # 2. Cria o perfil detalhado na tabela Usuario do seu modelo
            Usuario.objects.create(
                username=username,
                email=email,
                nome_negocio=nome_negocio,
                nicho="Geral",
                nivel_assinatura="gratuito"
            )

            return JsonResponse({'success': True, 'message': 'Usuário criado com sucesso!'})

        except Exception as e:
            print(f"ERRO NO CADASTRO: {e}")
            return JsonResponse({'success': False, 'error': str(e)}, status=500)

    return JsonResponse({'error': 'Método não permitido'}, status=405)

@require_http_methods(["GET"])
def buscar_imagens(request):
    termo = request.GET.get('termo', '') # Ex: ?termo=cafe
    
    if not termo:
        return JsonResponse({'error': 'Termo de busca não fornecido'}, status=400)

    # URL da API do Pexels
    url = f"https://api.pexels.com/v1/search?query={termo}&per_page=3&locale=pt-BR"
    
    headers = {
        "Authorization": os.environ.get("PEXELS_API_KEY") # Sua chave aqui
    }

    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # Limpando o retorno para enviar só o que o front precisa
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
# --- VIEWS LEGADAS (HTML) ---
def home(request): 
    return render(request, 'core/base.html')

def projeto_list(request): 
    return render(request, 'core/projeto_list.html', {'projetos': Projeto.objects.all()})