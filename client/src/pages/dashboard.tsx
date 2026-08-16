import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

const QUICK_ACCESS = [
  { path: "/chat", label: "Jaime", color: "#D4AF37", icon: "M12 2a10 10 0 0110 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z" },
  { path: "/sombras", label: "Sombras", color: "#A78BFA", icon: "M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.4 5.4 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" },
  { path: "/diario", label: "Diario", color: "#06B6D4", icon: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" },
  { path: "/huella-del-alma", label: "Huella", color: "#D4AF37", icon: "M12 2v20M2 12h20" },
  { path: "/congruence", label: "CONGRUENCE", color: "#EC4899", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" },
  { path: "/coveia", label: "COVEIA", color: "#10B981", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
];

const CHECKIN_OPTIONS = [
  { key: "paz", label: "Paz", color: "#C4B5FD" },
  { key: "amor", label: "Amor", color: "#EC4899" },
  { key: "alegria", label: "Alegria", color: "#F59E0B" },
  { key: "razon", label: "Razon", color: "#06B6D4" },
  { key: "coraje", label: "Coraje", color: "#EF4444" },
  { key: "enojo", label: "Enojo", color: "#DC2626" },
  { key: "miedo", label: "Miedo", color: "#6B7280" },
  { key: "apatia", label: "Apatia", color: "#4B5563" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: world } = useQuery<any>({
    queryKey: ["/api/world-context", user?.id],
    queryFn: () => apiRequest("GET", `/api/world-context/${user?.id}`).then(r => r.json()),
    enabled: !!user,
  });

  const handleCheckin = async (emotion: string) => {
    await apiRequest("POST", "/api/entries", {
      userId: user.id, type: "checkin", primaryValue: emotion, intensity: 5,
    });
    setLocation("/hawkins");
  };

  if (!user) return null;

  const isDirector = user.role === "director";

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 100px" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        <div>
          <div className="font-serif" style={{ color: "#EDE8F5", fontSize: 18, fontWeight: 600 }}>Hola, {user.name.split(" ")[0]}</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>{world?.localDay} {world?.localDate?.split("-").reverse().slice(0,2).join("/")} · {world?.localTime}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isDirector && (
            <Link href="/director">
              <button data-testid="button-director" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer" }}>
                Director
              </button>
            </Link>
          )}
          <button onClick={logout} data-testid="button-logout" style={{ background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.15)", color: "#8B7FAA", padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px", position: "relative", zIndex: 2 }}>
        {/* Jaime card */}
        <Link href="/chat">
          <div data-testid="card-jaime" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(167,139,250,0.08))", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 16, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(212,175,55,0.3)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="3" fill="#D4AF37" opacity="0.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#D4AF37", fontSize: 13, fontWeight: 700 }}>Jaime, su mayordomo</div>
              <div style={{ color: "#8B7FAA", fontSize: 11 }}>Servidor activo. Todo en orden.</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </Link>

        {/* Check-in emocional */}
        <div style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ color: "#8B7FAA", fontSize: 11, marginBottom: 10 }}>¿Como estas ahora? (toca uno)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {CHECKIN_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => handleCheckin(opt.key)}
                data-testid={`button-emotion-${opt.key}`}
                style={{ background: `${opt.color}12`, border: `1px solid ${opt.color}30`, color: opt.color, padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#D4AF37" strokeWidth="1.5"/><path d="M12 6v6l4 2" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <div>
                <div style={{ color: "#D4AF37", fontSize: 18, fontWeight: 800 }}>{user.points}</div>
                <div style={{ color: "#8B7FAA", fontSize: 10 }}>puntos</div>
              </div>
            </div>
          </div>
          <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z" stroke="#A78BFA" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              <div>
                <div style={{ color: "#A78BFA", fontSize: 18, fontWeight: 800 }}>Nivel {user.level}</div>
                <div style={{ color: "#8B7FAA", fontSize: 10 }}>{user.level === 5 ? "Sol" : user.level === 4 ? "Hoguera" : user.level === 3 ? "Antorcha" : user.level === 2 ? "Llama" : "Chispa"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Luna + ubicacion */}
        {world?.moon && (
          <div style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, fontSize: 11, color: "#8B7FAA", display: "flex", justifyContent: "space-between" }}>
            <span>Luna {world.moon.phase} · {world.moon.illumination}%</span>
            {world.location && <span>{world.location.city}, {world.location.country}</span>}
          </div>
        )}

        {/* Acceso rapido */}
        <div style={{ color: "#D4AF37", fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#D4AF37" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          Acceso rapido
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {QUICK_ACCESS.map(item => (
            <Link key={item.path} href={item.path}>
              <div data-testid={`card-${item.label.toLowerCase()}`} style={{ background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: 12, padding: "12px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d={item.icon} stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ flex: 1, color: "#EDE8F5", fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={item.color} strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Menu completo */}
        <Link href="/menu">
          <button data-testid="button-menu-completo" style={{ width: "100%", background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.15)", color: "#C4B5FD", padding: "12px", borderRadius: 12, fontSize: 13, cursor: "pointer" }}>
            Ver todos los modulos
          </button>
        </Link>

        {/* Frase filosofica */}
        <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(196,181,253,0.4)", fontStyle: "italic", lineHeight: 1.7 }}>
          "El dolor que no transformas,<br/>lo transmites."<br/>
          <span style={{ color: "rgba(212,175,55,0.5)", fontSize: 10 }}>Gabriel Hernandez — Congruence Lab 53</span>
        </div>
      </div>
    </div>
  );
}
