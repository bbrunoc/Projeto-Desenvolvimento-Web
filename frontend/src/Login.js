import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';

// 1. IMPORTANTE: Importe sua logo aqui
import logo from './logo.png';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/projetos/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const usuarioParaSalvar = {
            id: data.id,
            username: data.username
        };
        
        localStorage.setItem('user', JSON.stringify(usuarioParaSalvar));
        navigate('/dashboard');
      } else {
        alert(data.error || 'Erro ao entrar');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#FAFADB" }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: "white", padding: 40, borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.1)", width: 350 }}>
            
            {/* 2. LOGO ADICIONADA AQUI (Centralizada) */}
            <img 
              src={logo} 
              alt="Logo" 
              style={{ display: "block", margin: "0 auto 20px auto", width: "80px" }} 
            />

            <h2 style={{ textAlign: "center", color: "#0F766E", marginBottom: 30 }}>Entrar</h2>
            
            <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555" }}>Usuário</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <User size={18} color="#888" style={{ marginRight: 10 }} />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Seu usuário"
                        style={{ border: "none", outline: "none", width: "100%" }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: 25 }}>
                <label style={{ display: "block", marginBottom: 5, color: "#555" }}>Senha</label>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 8, padding: "10px" }}>
                    <Lock size={18} color="#888" style={{ marginRight: 10 }} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        style={{ border: "none", outline: "none", width: "100%" }}
                    />
                </div>
            </div>

            <button type="submit" style={{ width: "100%", backgroundColor: "#0F766E", color: "white", padding: 12, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                Acessar Sistema <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: "14px" }}>
                <span style={{ color: "#666" }}>Novo por aqui? </span>
                <span onClick={() => navigate('/cadastro')} style={{ color: "#0F766E", fontWeight: "bold", cursor: "pointer" }}>
                    Crie sua conta
                </span>
            </div>

        </form>
    </div>
  );
}