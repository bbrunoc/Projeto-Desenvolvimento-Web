import React from 'react';
import { Home, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFADB", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ 
          backgroundColor: "#FFFFFF", padding: "50px 40px", borderRadius: "12px", 
          boxShadow: "0 10px 25px -5px rgba(15, 118, 110, 0.1)", 
          textAlign: "center", borderTop: "5px solid #0F766E", maxWidth: "420px" 
      }}>
        <SearchX size={80} color="#0F766E" style={{ marginBottom: 20 }} />
        
        <h1 style={{ fontSize: "5rem", fontWeight: "800", margin: "0 0 16px 0", color: "#2F2E41", lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "12px", color: "#2F2E41" }}>Página não encontrada</h2>
        
        <p style={{ color: "#6B7280", marginBottom: "32px", lineHeight: "1.5" }}>
          Opa! Parece que o caminho que você tentou acessar não existe dentro do nosso sistema.
        </p>

        <button 
          onClick={() => navigate('/')}
          style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", width: "100%", 
              padding: "14px", backgroundColor: "#0F766E", color: "white", border: "none", 
              borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", gap: "8px"
          }}
        >
          <Home size={20} /> VOLTAR AO INÍCIO
        </button>
      </div>
    </div>
  );
}