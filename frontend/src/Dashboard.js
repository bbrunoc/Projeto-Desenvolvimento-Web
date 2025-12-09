import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown'; 
import { PlusCircle, Search, Settings, User, MessageSquare, LogOut, Send, X, Paperclip, Image as ImageIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import logo from './logo-novo.png';

const COLORS = { primary: "#0F766E", background: "#FAFADB", text: "#2F2E41", white: "#FFFFFF", gray: "#E5E7EB" };

export default function Dashboard() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]); 
  const [loadingIA, setLoadingIA] = useState(false);
  
  const [imagemAnexo, setImagemAnexo] = useState(null); 
  const fileInputRef = useRef(null);
  
  const [isPexelsModalOpen, setIsPexelsModalOpen] = useState(false);
  const [termoPexels, setTermoPexels] = useState("");
  const [imagensPexels, setImagensPexels] = useState([]);
  const [loadingPexels, setLoadingPexels] = useState(false);
  
  const messagesEndRef = useRef(null);

  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");

  const [novoProjeto, setNovoProjeto] = useState({
    nome: "",
    descricao: "",
    publico_alvo: "", 
    tom_marca: "",    
    // REMOVIDO: usuario: 1 (Não deixamos mais valor padrão fixo)
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
        navigate('/');
    } else {
        carregarProjetos();
    }
  }, [navigate]);

  useEffect(() => {
    setHistorico([]); 
    setImagemAnexo(null);
    setImagensPexels([]); 
  }, [projetoSelecionado]);

  const rolarParaBaixo = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    rolarParaBaixo();
  }, [historico, loadingIA, imagemAnexo]);

  const carregarProjetos = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const userObj = JSON.parse(storedUser);
            // ATENÇÃO: Verifique se sua URL de produção está correta aqui
            fetch(`https://projeto-desenvolvimento-web-r1mz.onrender.com/projetos/api/projetos/?usuario=${userObj.id}`)
              .then((res) => res.json())
              .then((data) => {
                setProjetos(Array.isArray(data) ? data : []);
                setLoading(false);
              })
              .catch((err) => console.error("Erro:", err));
        } catch (e) { console.error(e); }
    }
  };

  const handleBuscarPexels = async (e) => {
    e.preventDefault();
    if (!termoPexels) return;

    setLoadingPexels(true);
    try {
        const response = await fetch(`https://projeto-desenvolvimento-web-r1mz.onrender.com/projetos/api/buscar-imagens/?termo=${termoPexels}`);
        const data = await response.json();

        if (data.sucesso) {
            setImagensPexels(data.imagens);
        } else {
            alert("Erro ao buscar imagens: " + (data.error || "Desconhecido"));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com API de Imagens.");
    } finally {
        setLoadingPexels(false);
    }
  };

  const selecionarImagemPexels = (url) => {
      setImagemAnexo(url); 
      setIsPexelsModalOpen(false); 
      setTermoPexels("");
      setImagensPexels([]);
  };

  const handleCriarProjeto = async (e) => {
    e.preventDefault();
    if (!novoProjeto.nome) { alert("Nome é obrigatório"); return; }

    // --- CORREÇÃO CRÍTICA DE USUÁRIO ---
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
        alert("Erro: Usuário não logado. Faça login novamente.");
        navigate('/');
        return;
    }

    const userObj = JSON.parse(storedUser);
    const userId = userObj.id; // Pega o ID REAL do localStorage

    console.log("Tentando criar projeto para Usuário ID:", userId); // DEBUG NO CONSOLE

    const payload = { 
        ...novoProjeto, 
        usuario: userId // Garante que envia o ID certo
    };

    try {
        const response = await fetch("https://projeto-desenvolvimento-web-r1mz.onrender.com/projetos/api/projetos/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const criado = await response.json();
            setProjetos([criado, ...projetos]); 
            setIsModalOpen(false);
            setNovoProjeto({ nome: "", descricao: "", publico_alvo: "", tom_marca: "" });
            alert("Projeto criado com sucesso!");
        } else {
            // Mostra o erro exato que veio do servidor
            const errorData = await response.json();
            console.error("Erro API:", errorData);
            alert("Erro ao criar: " + JSON.stringify(errorData));
        }
    } catch (error) { console.error(error); }
  };

  const handleArquivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemAnexo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnviarMensagem = async () => {
    if ((!mensagem.trim() && !imagemAnexo) || !projetoSelecionado) return;

    const textoUsuario = mensagem;
    
    setHistorico(prev => [...prev, { 
        remetente: 'eu', 
        texto: textoUsuario,
        imagem: imagemAnexo 
    }]);

    setMensagem("");
    setImagemAnexo(null);
    setLoadingIA(true);

    const contexto = `
      ATUE COMO ESPECIALISTA EM MARKETING.
      PROJETO: ${projetoSelecionado.nome}
      DESCRIÇÃO: ${projetoSelecionado.descricao}
      PÚBLICO: ${projetoSelecionado.publico_alvo}
      TOM DE VOZ: ${projetoSelecionado.tom_marca}
      
      PEDIDO: ${textoUsuario}
      ${imagemAnexo ? "[O USUÁRIO ENVIOU UMA IMAGEM PARA ANÁLISE]" : ""}
    `;

    try {
        const response = await fetch("https://projeto-desenvolvimento-web-r1mz.onrender.com/projetos/api/gemini-chat/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: contexto,
                image: imagemAnexo 
            })
        });
        const data = await response.json();

        if (data.response) {
            setHistorico(prev => [...prev, { remetente: 'ia', texto: data.response }]);
        } else {
            setHistorico(prev => [...prev, { remetente: 'ia', texto: "Erro na resposta da IA." }]);
        }
    } catch (error) {
        setHistorico(prev => [...prev, { remetente: 'ia', texto: "Erro de conexão." }]);
    } finally {
        setLoadingIA(false);
    }
  };

  const projetosFiltrados = projetos.filter(p => 
    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    (p.descricao && p.descricao.toLowerCase().includes(termoBusca.toLowerCase()))
  );

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: COLORS.background, color: COLORS.text, fontFamily: "sans-serif", overflow: "hidden" }}>
      
      <div style={{ width: "80px", backgroundColor: COLORS.primary, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0", gap: "30px", zIndex: 10 }}>
        <div style={{ marginBottom: "10px" }}>
            <img src={logo} alt="Logo" style={{ width: "50px", height: "auto", borderRadius: "8px" }} />
        </div>
        <div title="Novo Projeto" onClick={() => setIsModalOpen(true)} style={{ color: COLORS.white, cursor: "pointer" }}><PlusCircle size={32} /></div>
        <div title="Buscar" onClick={() => { setMostrarBusca(!mostrarBusca); if(mostrarBusca) setTermoBusca(""); }} style={{ color: mostrarBusca ? "#F59E0B" : COLORS.white, cursor: "pointer" }}>
            <Search size={28} />
        </div>
        <div title="Perfil" onClick={() => navigate('/perfil')} style={{ color: COLORS.white, cursor: "pointer" }}><User size={28} /></div>
        <div title="Configurações" onClick={() => navigate('/configuracoes')} style={{ marginTop: "auto", color: COLORS.white, cursor: "pointer" }}><Settings size={28} /></div>
        <div title="Sair" onClick={() => { localStorage.removeItem('user'); navigate('/'); }} style={{ color: "#ffcccc", cursor: "pointer", marginBottom: 20 }}><LogOut size={28} /></div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px", gap: "20px", overflow: "hidden" }}>
        
        <div style={{ height: "40%", display: "flex", flexDirection: "column", minHeight: "200px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h2 style={{ color: COLORS.primary, margin: 0 }}>{mostrarBusca ? "Filtrando..." : "Meus Projetos"}</h2>
            {mostrarBusca && (
                <div style={{ display: "flex", alignItems: "center", backgroundColor: "white", borderRadius: "8px", padding: "5px 10px" }}>
                    <Search size={16} color="#999" style={{ marginRight: 5 }}/>
                    <input autoFocus type="text" placeholder="Buscar..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} style={{ border: "none", outline: "none", width: "150px" }} />
                    <X size={16} color="#999" style={{ cursor: "pointer", marginLeft: 5 }} onClick={() => { setMostrarBusca(false); setTermoBusca(""); }} />
                </div>
            )}
          </div>

          {loading ? <p>Carregando...</p> : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "15px", overflowY: "auto", paddingBottom: "10px" }}>
              {projetosFiltrados.map((projeto) => (
                <div 
                    key={projeto.id} 
                    onClick={() => setProjetoSelecionado(projeto)}
                    style={{ 
                        backgroundColor: COLORS.white, padding: "15px", borderRadius: "10px", 
                        borderLeft: `5px solid ${projetoSelecionado?.id === projeto.id ? '#F59E0B' : COLORS.primary}`,
                        cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                    }}
                >
                  <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", fontWeight: "bold" }}>{projeto.nome}</h3>
                  <p style={{ fontSize: "12px", color: "#666" }}>{projeto.publico_alvo || "Geral"}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, backgroundColor: COLORS.white, borderRadius: "15px", padding: "20px", display: "flex", flexDirection: "column", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)", minHeight: "0" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "10px" }}>
            <MessageSquare color={COLORS.primary} />
            <span style={{ fontWeight: "bold", color: COLORS.primary, fontSize: "1.1rem" }}>
                {projetoSelecionado ? `Chat: ${projetoSelecionado.nome}` : "IA Assistente"}
            </span>
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "15px", overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
            {!projetoSelecionado && (
                <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>Selecione um projeto para começar.</p>
            )}
            
            {historico.map((msg, index) => (
                <div key={index} style={{ 
                    alignSelf: msg.remetente === 'eu' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.remetente === 'eu' ? COLORS.primary : '#f3f4f6',
                    color: msg.remetente === 'eu' ? 'white' : '#333',
                    padding: "12px 16px", 
                    borderRadius: "12px", 
                    maxWidth: "80%", 
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    textAlign: "left"
                }}>
                    {msg.imagem && (
                        <img src={msg.imagem} alt="Anexo" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: 10, display: 'block' }} />
                    )}
                    {msg.remetente === 'ia' ? (
                        <ReactMarkdown>{msg.texto}</ReactMarkdown>
                    ) : (
                        <span style={{ whiteSpace: "pre-wrap" }}>{msg.texto}</span>
                    )}
                </div>
            ))}
            
            {loadingIA && <p style={{ fontSize: "12px", color: "#999", fontStyle: "italic", marginLeft: 10 }}>IA digitando...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ display: "flex", flexDirection: 'column', gap: 5, marginTop: "auto" }}>
            
            {imagemAnexo && (
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f0fdf4', padding: '8px 12px', borderRadius: 8, alignSelf: 'flex-start', border: '1px solid #bbf7d0' }}>
                    <img src={imagemAnexo} alt="Preview" style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: 4, marginRight: 10 }} />
                    <span style={{ fontSize: 12, color: '#0F766E', fontWeight: 'bold' }}>Imagem anexada</span>
                    <X size={16} color="#0F766E" style={{ cursor: 'pointer', marginLeft: 10 }} onClick={() => setImagemAnexo(null)} />
                </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleArquivo} />

                <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={!projetoSelecionado || loadingIA}
                    style={{ backgroundColor: "#f3f4f6", border: "1px solid #ddd", padding: "0 15px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Anexar Imagem Local"
                >
                    <Paperclip size={20} color="#555" />
                </button>

                <button 
                    onClick={() => setIsPexelsModalOpen(true)}
                    disabled={!projetoSelecionado || loadingIA}
                    style={{ backgroundColor: "#f3f4f6", border: "1px solid #ddd", padding: "0 15px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Buscar no Pexels"
                >
                    <ImageIcon size={20} color="#555" />
                </button>

                <input 
                    type="text" 
                    placeholder={projetoSelecionado ? "Digite ou envie uma foto..." : "Selecione um projeto..."}
                    disabled={!projetoSelecionado || loadingIA}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                    style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none" }} 
                />
                <button 
                    onClick={handleEnviarMensagem}
                    disabled={(!mensagem && !imagemAnexo) || !projetoSelecionado || loadingIA}
                    style={{ backgroundColor: (projetoSelecionado && !loadingIA) ? COLORS.primary : "#ccc", color: "white", border: "none", padding: "0 20px", borderRadius: "8px", cursor: "pointer" }}
                >
                    <Send size={16}/>
                </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "450px", position: "relative" }}>
                <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" }}><X size={24} color="#666" /></button>
                <h2 style={{ color: COLORS.primary, marginBottom: "20px", textAlign: "center" }}>Novo Projeto</h2>
                <form onSubmit={handleCriarProjeto} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <input placeholder="Nome do Projeto *" required value={novoProjeto.nome} onChange={(e) => setNovoProjeto({...novoProjeto, nome: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    <input placeholder="Público Alvo" value={novoProjeto.publico_alvo} onChange={(e) => setNovoProjeto({...novoProjeto, publico_alvo: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    <input placeholder="Tom da Marca" value={novoProjeto.tom_marca} onChange={(e) => setNovoProjeto({...novoProjeto, tom_marca: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
                    <textarea rows="3" placeholder="Descrição" value={novoProjeto.descricao} onChange={(e) => setNovoProjeto({...novoProjeto, descricao: e.target.value})} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", resize: "none" }} />
                    <button type="submit" style={{ backgroundColor: COLORS.primary, color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Criar Projeto</button>
                </form>
            </div>
        </div>
      )}

      {isPexelsModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1100 }}>
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "700px", maxHeight: "80vh", display: 'flex', flexDirection: 'column', position: "relative" }}>
                <button onClick={() => setIsPexelsModalOpen(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", cursor: "pointer" }}><X size={24} color="#666" /></button>
                <h2 style={{ color: COLORS.primary, marginBottom: "20px", textAlign: "center", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <ImageIcon /> Banco de Imagens Grátis
                </h2>
                
                <form onSubmit={handleBuscarPexels} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input 
                        autoFocus
                        placeholder="Ex: Café, Escritório, Reunião..." 
                        value={termoPexels} 
                        onChange={(e) => setTermoPexels(e.target.value)} 
                        style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }} 
                    />
                    <button type="submit" disabled={loadingPexels} style={{ backgroundColor: COLORS.primary, color: "white", padding: "12px 20px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                        {loadingPexels ? "Buscando..." : "Buscar"}
                    </button>
                </form>

                <div style={{ flex: 1, overflowY: "auto", minHeight: "300px", border: "1px solid #eee", borderRadius: "8px", padding: "10px" }}>
                    {imagensPexels.length === 0 && !loadingPexels && (
                        <p style={{ textAlign: 'center', color: '#999', marginTop: 50 }}>Digite um termo para buscar imagens profissionais.</p>
                    )}
                    
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {imagensPexels.map((img) => (
                            <div key={img.id} style={{ position: 'relative', group: 'hover' }}>
                                <img 
                                    src={img.url_pequena} 
                                    alt={img.fotografo} 
                                    style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", cursor: "pointer", border: "2px solid transparent" }} 
                                    onClick={() => selecionarImagemPexels(img.url_grande)}
                                    title={`Foto por ${img.fotografo}`}
                                />
                                <div style={{ position: 'absolute', bottom: 5, right: 5, background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                                    {img.fotografo}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p style={{ fontSize: 12, color: '#999', marginTop: 10, textAlign: 'center' }}>Fotos fornecidas por Pexels API</p>
            </div>
        </div>
      )}
    </div>
  );
}