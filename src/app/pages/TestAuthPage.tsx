import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function TestAuthPage() {
  const [email, setEmail] = useState("test@monafrica.net");
  const [password, setPassword] = useState("TestPassword123!");
  const [name, setName] = useState("Test User");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    console.log(message);
  };

  const handleSignup = async () => {
    setLoading(true);
    setLogs([]);
    addLog("🔄 Début de l'inscription...");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      addLog(`📡 Réponse backend: ${response.status} ${response.statusText}`);

      const data = await response.json();
      addLog(`📦 Data reçue: ${JSON.stringify(data, null, 2)}`);

      if (!response.ok || data.error) {
        addLog(`❌ Erreur: ${data.error}`);
        setLoading(false);
        return;
      }

      addLog(`✅ Inscription réussie!`);
      addLog(`👤 User ID: ${data.data.user.id}`);
      addLog(`📧 Email: ${data.data.user.email}`);
      
      const token = data.data.session?.access_token;
      addLog(`🎫 Token reçu: ${token ? `${token.substring(0, 50)}...` : "AUCUN"}`);
      addLog(`🔍 Token est JWT?: ${token && token.split('.').length === 3 ? "OUI" : "NON"}`);
      
      if (token && token.split('.').length === 3) {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        addLog(`📋 JWT Payload sub: ${payload.sub}`);
        addLog(`📋 JWT Payload exp: ${payload.exp ? new Date(payload.exp * 1000).toISOString() : "NON DÉFINI"}`);
        addLog(`📋 JWT Payload email: ${payload.email}`);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('mona_member_token', token);
        localStorage.setItem('mona_member_user', JSON.stringify({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.profile.name,
          avatar: data.data.profile.avatar,
          memberSince: new Date(data.data.profile.memberSince).toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
          }),
          plan: data.data.profile.plan || 'free'
        }));
        addLog(`💾 Token et user sauvegardés dans localStorage`);
      }

    } catch (error) {
      addLog(`❌ Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setLogs([]);
    addLog("🔄 Début de la connexion...");

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      addLog(`📡 Réponse backend: ${response.status} ${response.statusText}`);

      const data = await response.json();
      addLog(`📦 Data reçue: ${JSON.stringify(data, null, 2)}`);

      if (!response.ok || data.error) {
        addLog(`❌ Erreur: ${data.error}`);
        setLoading(false);
        return;
      }

      addLog(`✅ Connexion réussie!`);
      addLog(`👤 User ID: ${data.data.user.id}`);
      addLog(`📧 Email: ${data.data.user.email}`);
      
      const token = data.data.session?.access_token;
      addLog(`🎫 Token reçu: ${token ? `${token.substring(0, 50)}...` : "AUCUN"}`);
      addLog(`🔍 Token est JWT?: ${token && token.split('.').length === 3 ? "OUI" : "NON"}`);
      
      if (token && token.split('.').length === 3) {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        addLog(`📋 JWT Payload sub: ${payload.sub}`);
        addLog(`📋 JWT Payload exp: ${payload.exp ? new Date(payload.exp * 1000).toISOString() : "NON DÉFINI"}`);
        addLog(`📋 JWT Payload email: ${payload.email}`);
        
        // Sauvegarder dans localStorage
        localStorage.setItem('mona_member_token', token);
        localStorage.setItem('mona_member_user', JSON.stringify({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.profile.name,
          avatar: data.data.profile.avatar,
          memberSince: new Date(data.data.profile.memberSince).toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
          }),
          plan: data.data.profile.plan || 'free'
        }));
        addLog(`💾 Token et user sauvegardés dans localStorage`);
      }

    } catch (error) {
      addLog(`❌ Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckLocalStorage = () => {
    setLogs([]);
    addLog("🔍 Vérification localStorage...");
    
    const storedToken = localStorage.getItem('mona_member_token');
    const storedUser = localStorage.getItem('mona_member_user');
    
    addLog(`🎫 Token stocké: ${storedToken ? `${storedToken.substring(0, 50)}...` : "AUCUN"}`);
    addLog(`🔍 Token est JWT?: ${storedToken && storedToken.split('.').length === 3 ? "OUI" : "NON"}`);
    
    if (storedToken && storedToken.split('.').length === 3) {
      try {
        const parts = storedToken.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        addLog(`📋 JWT Payload sub: ${payload.sub}`);
        addLog(`📋 JWT Payload exp: ${payload.exp ? new Date(payload.exp * 1000).toISOString() : "NON DÉFINI"}`);
        addLog(`📋 JWT Payload email: ${payload.email}`);
        addLog(`⏰ Token expiré?: ${payload.exp && payload.exp * 1000 < Date.now() ? "OUI" : "NON"}`);
      } catch (error) {
        addLog(`❌ Erreur décodage token: ${error}`);
      }
    }
    
    addLog(`👤 User stocké: ${storedUser || "AUCUN"}`);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        addLog(`📋 User ID: ${user.id}`);
        addLog(`📋 User email: ${user.email}`);
        addLog(`📋 User name: ${user.name}`);
      } catch (error) {
        addLog(`❌ Erreur parsing user: ${error}`);
      }
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem('mona_member_token');
    localStorage.removeItem('mona_member_user');
    setLogs([]);
    addLog("🗑️ localStorage nettoyé");
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#1A1A1A] mb-8">
          Test Authentification M.O.N.A
        </h1>

        <div className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6">
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">Credentials</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSignup}
              disabled={loading}
              className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Signup"}
            </button>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8B7155] transition-colors disabled:opacity-50"
            >
              {loading ? "Chargement..." : "Login"}
            </button>

            <button
              onClick={handleCheckLocalStorage}
              className="px-6 py-3 bg-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#C4B5A9] transition-colors"
            >
              Check localStorage
            </button>

            <button
              onClick={handleClearStorage}
              className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-serif mb-4">Logs</h2>
          <div className="font-mono text-sm space-y-1 max-h-[600px] overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-white/50">Aucun log pour le moment</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
