from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(models.Model):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128, default='12345')
    nome_negocio = models.CharField(max_length=200)
    usuario_instagram = models.CharField(max_length=100, blank=True, null=True)
    nicho = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    nivel_assinatura = models.CharField(max_length=50, default='gratuito')

    def __str__(self):
        return f"{self.username} - {self.nome_negocio}"
      
class Projeto(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='projetos')
    nome = models.CharField(max_length=200)
    descricao = models.TextField(blank=True, null=True)
    publico_alvo = models.CharField(max_length=200, blank=True, null=True)
    tom_marca = models.CharField(max_length=100, blank=True, null=True)
    cores_primarias = models.TextField(blank=True, null=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return self.nome
    
    def cores_primarias_to_list(self):
        if not self.cores_primarias:
            return []
        return [cor.strip() for cor in self.cores_primarias.split(',')]

    
class Conteudo(models.Model):
    TIPO_CHOICES = [
        ('legenda', 'Legenda'),
        ('promocional', 'Promocional'),
        ('story', 'Story'),
        ('reel', 'Reel'),
    ]

    projeto = models.ForeignKey(Projeto, on_delete=models.CASCADE, related_name='conteudos')
    tipo_conteudo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=200)
    texto_gerado = models.TextField()
    hashtags = models.JSONField(default=list, blank=True)
    modelo_ia = models.CharField(max_length=100)
    data_criacao = models.DateTimeField(auto_now_add=True)
    data_alteracao = models.DateTimeField(auto_now=True)
    favorito = models.BooleanField(default=False)
    id_post_instagram = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.titulo} ({self.get_tipo_conteudo_display()})"

class TemplatePrompt(models.Model):
    nome = models.CharField(max_length=200)
    categoria = models.CharField(max_length=100)
    texto_template = models.TextField()
    variaveis = models.JSONField(default=list, blank=True)
    publico = models.BooleanField(default=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True, blank=True, related_name='templates')
    contador_uso = models.IntegerField(default=0)
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nome

class Analitico(models.Model):
    conteudo = models.ForeignKey(Conteudo, on_delete=models.CASCADE, related_name='analises')
    impressoes = models.IntegerField(default=0)
    alcance = models.IntegerField(default=0)
    taxa_engajamento = models.FloatField(default=0.0)
    curtidas = models.IntegerField(default=0)
    comentarios = models.IntegerField(default=0)
    compartilhamentos = models.IntegerField(default=0)
    salvos = models.IntegerField(default=0)
    data_sincronizacao = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Análise do conteúdo {self.conteudo.titulo} em {self.data_sincronizacao:%Y-%m-%d}"  


    
