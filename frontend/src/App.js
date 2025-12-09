// 1. ADICIONAMOS 'React' e 'useEffect' AQUI
import React, { useEffect } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { clarity } from "react-microsoft-clarity";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Configuracoes from "./Configuracoes"; 
import NotFound from "./NotFound";
import Perfil from "./Perfil";
import Cadastro from "./Cadastro";

// --- SUAS CORES ---
const COLORS = {
  primary: "#0F766E", // Verde Petróleo
  background: "#FAFADB", // Creme
  text: "#2F2E41", // Escuro
  white: "#FFFFFF",
};

export default function App() {
  
  // 2. ADICIONAMOS ESTE BLOCO PARA INICIAR O CLARITY
  useEffect(() => {
    // Substitua 'SEU_ID_AQUI' pelo código estranho que você pegou no site
    clarity.init('uhwri62jmx'); 
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Inicial (Login) */}
        <Route path="/" element={<Login />} />
        
        {/* Rota Principal (Dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rota de Configurações */}
        <Route path="/configuracoes" element={<Configuracoes />} />

        {/* Rota de Perfil */}
        <Route path="/perfil" element={<Perfil />} />

        {/* Rota de Cadastro */}
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rota Coringa (404) - Mantenha sempre por último */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}