import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, User, Briefcase, Mail } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const COLORS = { primary: "#0F766E", background: "#FAFADB", card: "#FFFFFF", text: "#2F2E41", border: "#E5E7EB" };

export default function Perfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Estado para armazenar os dados do usuário
  const [dadosUsuario, setDadosUsuario] = useState({
    id: null,
    username: "",
    email: "",
    nome_negocio: "",
    nicho: "",
    nivel_assinatura: ""
  });

  useEffect(() => {
    // 1. Tenta pegar o ID do usuário salvo no login
    // IMPORTANTE: Por enquanto, se não tiver ID, vamos usar o ID 1 como fallback para teste
    const storedUser = JSON.parse(localStorage.getItem('user')); 
    const userId = storedUser?.id || 1; 

    fetch(`http://127.0.0.1:8000/projetos/api/usuarios/${userId}/`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar perfil");
        return res.json();
      })
      .then(data => {
        setDadosUsuario(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao carregar dados do usuário.");
        setLoading(false);
      });
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`http://127.0.0.1:8000/projetos/api/usuarios/${dadosUsuario.id}/`, {
            method: "PUT", // Ou PATCH para atualização parcial
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosUsuario)
        });

        if (response.ok) {
            alert("Perfil atualizado com sucesso!");
        } else {
            alert("Erro ao atualizar perfil.");
        }
    } catch (error) {
        console.error("Erro de conexão:", error);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Carregando perfil...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: COLORS.background, padding: "40px", display: "flex", justifyContent: "center", fontFamily: "sans-serif" }}>
      
      <div style={{ width: "100%", maxWidth: "600px", backgroundColor: COLORS.card, borderRadius: "16px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", overflow: "hidden", height: "fit-content" }}>
        
        {/* Header */}
        <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: "12px", backgroundColor: COLORS.primary, color: "white" }}>
          <button onClick={() => navigate('/dashboard')} style={{ background: "none", border: "none", cursor: "pointer", color: "white", padding: "5px" }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Meu Perfil</h1>
        </div>

        <form onSubmit={handleSalvar} style={{ padding: "30px" }}>
          
          {/* Seção Pessoal */}
          <h3 style={{ color: COLORS.primary, marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <User size={20}/> Dados da Conta
          </h3>
          
          <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
            <div>
                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>Usuário (Login)</label>
                <input 
                    type="text" 
                    value={dadosUsuario.username} 
                    disabled // Geralmente não mudamos o username fácil
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${COLORS.border}`, backgroundColor: "#f3f4f6", color: "#888" }} 
                />
            </div>
            <div>
                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>Email</label>
                <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 10, top: 12, color: "#999" }} />
                    <input 
                        type="email" 
                        value={dadosUsuario.email}
                        onChange={(e) => setDadosUsuario({...dadosUsuario, email: e.target.value})}
                        style={{ width: "100%", padding: "10px 10px 10px 35px", borderRadius: "8px", border: `1px solid ${COLORS.border}` }} 
                    />
                </div>
            </div>
          </div>

          {/* Seção Negócio */}
          <h3 style={{ color: COLORS.primary, marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Briefcase size={20}/> Sobre o Negócio
          </h3>

          <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
             <div>
                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>Nome do Negócio</label>
                <input 
                    type="text" 
                    value={dadosUsuario.nome_negocio}
                    onChange={(e) => setDadosUsuario({...dadosUsuario, nome_negocio: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${COLORS.border}` }} 
                />
            </div>
            <div>
                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>Nicho de Mercado</label>
                <input 
                    type="text" 
                    value={dadosUsuario.nicho}
                    onChange={(e) => setDadosUsuario({...dadosUsuario, nicho: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: `1px solid ${COLORS.border}` }} 
                />
            </div>
            <div>
                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "5px" }}>Plano Atual</label>
                <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "14px", fontWeight: "bold" }}>
                    {dadosUsuario.nivel_assinatura.toUpperCase()}
                </span>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
                width: "100%", padding: "14px", backgroundColor: COLORS.primary, color: "white", 
                border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
            }}
          >
            <Save size={20} /> Salvar Alterações
          </button>

        </form>
      </div>
    </div>
  );
}