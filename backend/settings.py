"""
Django settings for chatbot project.
"""
import dj_database_url
import os
from pathlib import Path
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env (chave do Gemini, Pexels, etc)
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# --- CONFIGURAÇÕES DE SEGURANÇA ---

# Em produção, a chave deve vir do ambiente. Localmente usa essa padrão.
SECRET_KEY = os.environ.get('SECRET_KEY', '0rd(n2(&j45!apedle%+dt^=sj^d)pue*l%**a8+_*g!yc%7e9')

# DEBUG deve ser True apenas no seu computador. Na nuvem (Render) será False.
# Se a variável 'RENDER' existir, desligamos o DEBUG.
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    DEBUG = False
else:
    DEBUG = True

# Permite que o Render (e localhost) acesse o site
ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Apps de terceiros
    'rest_framework',
    'corsheaders',
    'bootstrap4',
    
    # Seus Apps
    'backend.core', 
]

MIDDLEWARE = [
    # CORS deve ser o primeiro para evitar bloqueios do React
    'corsheaders.middleware.CorsMiddleware',
    
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Recomendado para arquivos estáticos no Render
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configuração do CORS (Permite conexão do React)
CORS_ALLOW_ALL_ORIGINS = True 

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# --- BANCO DE DADOS (LOCAL vs NUVEM) ---

DATABASES = {
    'default': dj_database_url.config(
        # Procura por uma variável DATABASE_URL (do Neon/Render).
        # Se não achar, usa o SQLite local automaticamente.
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]


# Internationalization
LANGUAGE_CODE = 'pt-br' # Mudei para Português
TIME_ZONE = 'America/Sao_Paulo' # Ajustei o fuso
USE_I18N = True
USE_L10N = True
USE_TZ = True


# --- ARQUIVOS ESTÁTICOS (CSS, JS, IMAGENS) ---
# Necessário para o admin funcionar no Render

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Configuração do WhiteNoise para servir arquivos em produção
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Redirecionamentos de Login (opcional, já que estamos usando API)
LOGIN_REDIRECT_URL = '/projetos/'        
LOGOUT_REDIRECT_URL = '/accounts/login/'