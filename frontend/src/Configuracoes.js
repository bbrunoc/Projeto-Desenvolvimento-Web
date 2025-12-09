import React from 'react';
import { ArrowLeft, Save, Trash2, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = { primary: "#0F766E", background: "#FAFADB", card: "#FFFFFF", text: "#2F2E41", danger: "#EF4444", border: "#E5E7EB" };

export default function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.background, padding: "40px", display: "flex", justifyContent: "center", fontFamily: "sans-serif" }}>
      
      <div style={{ width: "100%", maxWidth: "600px", backgroundColor: COLORS.card, borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", overflow: "hidden", height: "fit-content" }}>
        
        {/* Header */}
        <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.text, padding: "5px" }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: "1.25rem", color: COLORS.text, fontWeight: "bold", margin: 0 }}>Configurações</h1>
        </div>

        {/* Seção Conta */}
        <div style={{ padding: "24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", color: "#6B7280", fontWeight: "600", marginBottom: "16px" }}>Conta</h3>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", marginBottom: "6px", color: COLORS.text }}>Nome de Usuário</label>
            <input type="text" defaultValue="Estudante Padrão" style={{ width: "100%", padding: "10px", border: `1px solid ${COLORS.border}`, borderRadius: "8px", fontSize: "0.95rem" }} />
          </div>

          <div style={{ marginBottom: "16px" }}>
             <label style={{ display: "block", fontSize: "0.9rem", fontWeight: "500", marginBottom: "6px", color: COLORS.text }}>Nova Senha</label>
            <input type="password" placeholder="********" style={{ width: "100%", padding: "10px", border: `1px solid ${COLORS.border}`, borderRadius: "8px", fontSize: "0.95rem" }} />
          </div>

          <button style={{ backgroundColor: COLORS.primary, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <Save size={18} /> Salvar
          </button>
        </div>

        {/* Seção Aparência */}
        <div style={{ padding: "24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", color: "#6B7280", fontWeight: "600", marginBottom: "16px" }}>Preferências</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}><Moon size={18}/> Modo Escuro</div>
              <p style={{ fontSize: "0.85rem", color: "#6B7280", marginTop: "2px" }}>Visualização noturna (Em breve)</p>
            </div>
            {/* Toggle Switch Simulado */}
            <div style={{ width: "44px", height: "24px", backgroundColor: "#ccc", borderRadius: "34px", position: "relative", cursor: "pointer" }}>
                <div style={{ width: "18px", height: "18px", backgroundColor: "white", borderRadius: "50%", position: "absolute", top: "3px", left: "3px" }}></div>
            </div>
          </div>
        </div>

        {/* Seção Perigo */}
        <div style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "0.875rem", textTransform: "uppercase", color: COLORS.danger, fontWeight: "600", marginBottom: "16px" }}>Zona de Perigo</h3>
          <button style={{ width: "100%", padding: "12px", backgroundColor: "#FEE2E2", color: COLORS.danger, border: "1px solid #FECACA", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Trash2 size={18} /> Apagar Dados Locais
          </button>
        </div>

      </div>
    </div>
  );
}