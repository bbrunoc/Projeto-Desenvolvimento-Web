from rest_framework import serializers
from .models import Usuario, Projeto, Conteudo, TemplatePrompt, Analitico

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'nome_negocio', 'nicho', 'nivel_assinatura']

class ProjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projeto
        fields = [
            'id', 'usuario', 'nome', 'descricao', 
            'publico_alvo', 'tom_marca', 'cores_primarias', 
            'ativo', 'data_criacao'
        ]

class ConteudoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteudo
        fields = '__all__'

class TemplatePromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemplatePrompt
        fields = '__all__'

class AnaliticoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analitico
        fields = '__all__'