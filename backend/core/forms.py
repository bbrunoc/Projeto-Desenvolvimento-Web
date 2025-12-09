from django import forms
from .models import Projeto

class ProjetoForm(forms.ModelForm):
    class Meta:
        model = Projeto
        fields = ['nome', 'descricao', 'publico_alvo', 'tom_marca', 'cores_primarias', 'ativo']
