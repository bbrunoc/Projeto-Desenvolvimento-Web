// --- 1. A LÓGICA (O que estamos testando) ---
// Esta função simula uma validação simples antes de enviar para o backend
function validarFormulario(usuario, senha) {
    // Regra: Campos não podem ser vazios
    if (!usuario || !senha) {
        return { valido: false, erro: "Campos vazios" };
    }
    
    // Regra: Senha deve ter pelo menos 6 caracteres
    if (senha.length < 6) {
        return { valido: false, erro: "Senha curta demais" };
    }

    return { valido: true, erro: null };
}

// --- 2. O TESTE AUTOMATIZADO (O script que verifica a lógica) ---
console.log("🟦 Iniciando Teste Automatizado de Unidade...\n");

// Cenário 1: Testar dados corretos
const testeSucesso = validarFormulario("admin", "123456");

if (testeSucesso.valido === true) {
    console.log("✅ Teste 1 (Dados Válidos): PASSOU");
} else {
    console.error("❌ Teste 1 (Dados Válidos): FALHOU");
    process.exit(1); // Encerra com erro
}

// Cenário 2: Testar senha curta (deve falhar a validação)
const testeSenhaCurta = validarFormulario("admin", "123");

if (testeSenhaCurta.valido === false && testeSenhaCurta.erro === "Senha curta demais") {
    console.log("✅ Teste 2 (Senha Curta): PASSOU");
} else {
    console.error("❌ Teste 2 (Senha Curta): FALHOU");
    process.exit(1);
}

console.log("\n🎉 Todos os testes passaram com sucesso!");
