import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Login({ onLogin }: { onLogin: (u: any) => void }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (pin.length < 4) return;
    setLoading(true); setError("");
    try {
      const res = await apiRequest("POST", "/api/auth/login", { pin });
      const user = await res.json();
      if (user.id) onLogin(user);
      else setError(user.error || "PIN invalido");
    } catch (e: any) {
      setError("Error de conexion");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="fade-in" style={{ width: "100%", maxWidth: 340, textAlign: "center", zIndex: 2 }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto", display: "block" }}>
            <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="1.2" opacity="0.6"/>
            <circle cx="12" cy="12" r="4" stroke="#D4AF37" strokeWidth="1.2"/>
            <circle cx="12" cy="12" r="1.5" fill="#D4AF37"/>
          </svg>
        </div>

        <h1 className="font-serif" style={{ fontSize: 26, color: "#D4AF37", marginBottom: 8, fontWeight: 700 }}>Tu Codigo de Entrada</h1>
        <p style={{ color: "rgba(196,181,253,0.6)", fontSize: 12, marginBottom: 32 }}>Ingresa tu PIN personal de 6 digitos</p>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
          placeholder="000000"
          data-testid="input-pin"
          style={{ textAlign: "center", fontSize: 22, letterSpacing: "0.4em", marginBottom: 12, fontWeight: 700, background: "rgba(196,181,253,0.05)", border: "1px solid rgba(196,181,253,0.15)", color: "#D4AF37", borderRadius: 12, padding: "16px" }}
        />

        {error && <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>{error}</div>}

        <button
          onClick={handleLogin}
          disabled={loading || pin.length < 4}
          data-testid="button-login"
          style={{ width: "100%", background: pin.length >= 4 ? "linear-gradient(135deg, #A78BFA, #C4B5FD)" : "rgba(196,181,253,0.1)", border: "none", color: pin.length >= 4 ? "#1A1530" : "#8B7FAA", padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: pin.length >= 4 ? "pointer" : "default" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p style={{ color: "rgba(196,181,253,0.35)", fontSize: 11, marginTop: 24, fontStyle: "italic", lineHeight: 1.6 }}>
          "El dolor que no transformas, lo transmites."
        </p>
      </div>
    </div>
  );
}
