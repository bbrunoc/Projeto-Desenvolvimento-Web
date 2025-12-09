import google.generativeai as genai

# --- COLE SUA CHAVE AQUI DENTRO DAS ASPAS ---
api_key = "AIzaSyDfEn4eCE8BEugBHtPJ-ZyVM99pknemwFI" 
# --------------------------------------------

genai.configure(api_key=api_key)

print(f"--- CONECTANDO AO GOOGLE... ---")

try:
    print("Modelos disponíveis para sua chave:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ {m.name}")
except Exception as e:
    print(f"❌ ERRO: {e}")