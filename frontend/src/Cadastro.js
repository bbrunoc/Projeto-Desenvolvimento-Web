import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Briefcase } from 'lucide-react';

// 1. IMPORTANTE: Importe sua logo aqui
import logo from './logo.png';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    nome_negocio: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://projeto-desenvolvimento-web-r1mz.onrender.com/projetos/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Conta criada com sucesso! Faça login agora.");
        navigate('/'); // Redireciona para o Login
      } else {
        alert(data.error || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#FAFADB" }}>
        <form onSubmit={handleRegister} style={{ backgroundColor: "white", padding: 40, borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", width: 400 }}>
            
            {/* 2. LOGO ADICIONADA AQUI (Centralizada) */}
            <img 
              src={logo} 
              alt="Logo" 
              style={{ display: "block", margin: "0 auto 15px auto", width: "80px" }} 
            />

            <h2 style={{ textAlign: "center", color: "#0F766E", marginBottom: 10 }}>Crie sua conta</h2>
            <p style={{ textAlign: "center", color: "#666", marginBottom: 30, fontSize: "14px" }}>Comece a usar a IA no seu negócio hoje.</p>
            
            {/* Campo Usuário */}
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555", fontSize: "14px" }}>Usuário</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <User size={18} color="#888" style={{ marginRight: 10 }} />
                    <input name="username" required type="text" placeholder="Ex: joaosilva" onChange={handleChange} style={{ border: "none", outline: "none", width: "100%" }} />
                </div>
            </div>

            {/* Campo Email */}
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555", fontSize: "14px" }}>E-mail</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <Mail size={18} color="#888" style={{ marginRight: 10 }} />
                    <input name="email" required type="email" placeholder="seu@email.com" onChange={handleChange} style={{ border: "none", outline: "none", width: "100%" }} />
                </div>
            </div>
            
            {/* Campo Nome do Negócio */}
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555", fontSize: "14px" }}>Nome do Negócio</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <Briefcase size={18} color="#888" style={{ marginRight: 10 }} />
                    <input name="nome_negocio" required type="text" placeholder="Ex: Padaria do João" onChange={handleChange} style={{ border: "none", outline: "none", width: "100%" }} />
                </div>
            </div>

            {/* Campo Senha */}
            <div style={{ marginBottom: 25 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555", fontSize: "14px" }}>Senha</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <Lock size={18} color="#888" style={{ marginRight: 10 }} />
                    <input name="password" required type="password" placeholder="******" onChange={handleChange} style={{ border: "none", outline: "none", width: "100%" }} />
                </div>
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: "#0F766E", color: "white", padding: 12, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                Cadastrar <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: "14px" }}>
                <span style={{ color: "#666" }}>Já tem conta? </span>
                <span onClick={() => navigate('/')} style={{ color: "#0F766E", fontWeight: "bold", cursor: "pointer" }}>Faça Login</span>
            </div>
        </form>
    </div>
  );
}