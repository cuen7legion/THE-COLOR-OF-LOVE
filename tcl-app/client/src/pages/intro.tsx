import { useEffect, useState } from "react";

export default function Intro({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState<"welcome"|"heart">("welcome");

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {phase === "welcome" && (
        <div className="fade-in" style={{ textAlign: "center", maxWidth: 380, zIndex: 2 }}>
          <div className="heart-beat" style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none">
              <defs>
                <radialGradient id="heartGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.15"/>
                </radialGradient>
              </defs>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" fill="url(#heartGrad)" stroke="#D4AF37" strokeWidth="1.2"/>
            </svg>
          </div>

          <h1 className="font-serif" style={{ fontSize: 32, color: "#D4AF37", marginBottom: 8, fontWeight: 700 }}>
            The Color of Love
          </h1>
          <p style={{ color: "#C4B5FD", fontSize: 12, letterSpacing: "0.15em", marginBottom: 32, textTransform: "uppercase" }}>
            Congruence Lab 53 — For Live Happiness
          </p>

          <p style={{ color: "#EDE8F5", fontSize: 15, lineHeight: 1.8, marginBottom: 12, fontStyle: "italic" }}>
            Eso no lo hace una linea de codigo.<br/>
            Lo hace la intencion detras.
          </p>
          <p style={{ color: "rgba(196,181,253,0.6)", fontSize: 13, marginBottom: 40, lineHeight: 1.7 }}>
            Una app creada por IA con toda la intencion<br/>
            de un humano. Alquimia pura para tu bienestar.
          </p>

          <button
            onClick={() => setPhase("heart")}
            data-testid="button-comenzar"
            style={{ background: "linear-gradient(135deg, #A78BFA, #C4B5FD)", border: "none", color: "#1A1530", padding: "14px 40px", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Comenzar
          </button>
        </div>
      )}

      {phase === "heart" && (
        <div style={{ textAlign: "center", zIndex: 2 }}>
          <div className="heart-beat" style={{ marginBottom: 32 }}>
            <svg width="200" height="200" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" fill="rgba(212,175,55,0.15)" stroke="#D4AF37" strokeWidth="1"/>
            </svg>
          </div>
          <p className="fade-in" style={{ color: "#EDE8F5", fontSize: 18, fontFamily: "'Playfair Display', serif", marginBottom: 6 }}>
            Nunca te sientas solo
          </p>
          <p className="fade-in" style={{ color: "#D4AF37", fontSize: 18, fontFamily: "'Playfair Display', serif", marginBottom: 32 }}>
            con lo que sientes.
          </p>
          <button
            onClick={onContinue}
            data-testid="button-entrar"
            style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37", padding: "12px 32px", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Entrar
          </button>
        </div>
      )}
    </div>
  );
}
