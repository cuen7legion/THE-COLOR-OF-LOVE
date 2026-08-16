import { Link, useLocation } from "wouter";

const MODULES = [
  { path: "/chat", name: "Jaime", desc: "Guardian de conciencia", color: "#D4AF37", ready: true },
  { path: "/sombras", name: "Sombras del Ego", desc: "Tu espejo interior", color: "#A78BFA", ready: true },
  { path: "/diario", name: "Diario", desc: "Escribe tu voz", color: "#06B6D4", ready: true },
  { path: "/hawkins", name: "Escala Hawkins", desc: "17 niveles de conciencia", color: "#F59E0B", ready: true },
  { path: "/plutchik", name: "Rueda Plutchik", desc: "8 emociones basicas", color: "#EC4899", ready: true },
  { path: "/metas", name: "Metas", desc: "Lo que quieres construir", color: "#F59E0B", ready: true },
  { path: "/huella-del-alma", name: "Huella del Alma", desc: "Motor de conciencia", color: "#D4AF37", ready: true },
  { path: "/congruence", name: "Metodo CONGRUENCE", desc: "10 pilares", color: "#EC4899", ready: true },
  { path: "/coveia", name: "COVEIA", desc: "Comite etico IA", color: "#10B981", ready: true },
];

const PENDING = [
  "El Oraculo", "El Prisma", "Bitacora", "Year in Pixels", "Filosofia",
  "Test Congruencia 21q", "Espejo sin Juicio", "Letris", "Oximel", "Sala Mistica",
  "Reloj", "Libro Dorado", "Portal Cuantico", "Color del Planeta", "Empresarial",
  "Red Profesionales", "Wellness", "Frases", "Impacto IA", "Sincronicidades",
  "Ruleta de Sombras", "Memoria", "Pilares", "Jaime Guardian", "Cartas de mis Heridas",
  "Arbol de Creencias", "El Puente IFS", "Brujula de Valores", "Laboratorio del Perdon",
  "Constelacion de Vinculos", "El Legado"
];

export default function Menu() {
  const [, setLocation] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#D4AF37", fontSize: 16, fontWeight: 700 }}>Todos los Modulos</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Version 12.0 (base para Railway)</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ color: "#10B981", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Modulos activos ({MODULES.length})</div>
        {MODULES.map(m => (
          <Link key={m.path} href={m.path}>
            <div style={{ background: `${m.color}08`, border: `1px solid ${m.color}25`, borderRadius: 10, padding: 12, marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.color }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: "#EDE8F5", fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                <div style={{ color: "#8B7FAA", fontSize: 10 }}>{m.desc}</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={m.color} strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
          </Link>
        ))}

        <div style={{ color: "#F59E0B", fontSize: 12, fontWeight: 700, marginTop: 24, marginBottom: 10 }}>Pendientes de reconstruir ({PENDING.length})</div>
        <div style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 10, padding: 12, marginBottom: 10 }}>
          <div style={{ color: "#8B7FAA", fontSize: 11, lineHeight: 1.7, marginBottom: 8 }}>
            Estos modulos existian en v11.0 y se perdieron con el reset. Estan documentados en los PDFs de Gabriel. Alex puede agregarlos al codigo siguiendo la misma estructura que los actuales.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {PENDING.map(p => (
              <span key={p} style={{ fontSize: 10, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#F59E0B", padding: "3px 8px", borderRadius: 8 }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
