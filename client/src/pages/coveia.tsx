import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const CHAMBERS = [
  { name: "Ciudadanos", color: "#D4AF37", desc: "Experiencia real de usuarios finales" },
  { name: "Expertos", color: "#A78BFA", desc: "Psicologos, medicos, juristas" },
  { name: "Desarrolladores", color: "#06B6D4", desc: "Seguridad tecnica y privacidad" },
  { name: "Neurodivergencia", color: "#10B981", desc: "TDAH, autismo, dislexia" },
];

export default function Coveia() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"inicio"|"directorio">("inicio");

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/coveia/stats"],
    queryFn: () => apiRequest("GET", "/api/coveia/stats").then(r => r.json()),
  });
  const { data: certs = [] } = useQuery<any[]>({
    queryKey: ["/api/coveia/certifications"],
    queryFn: () => apiRequest("GET", "/api/coveia/certifications").then(r => r.json()),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#10B981", fontSize: 16, fontWeight: 700 }}>COVEIA</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Comite de Validacion Etica de IA</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(196,181,253,0.04)", borderRadius: 10, padding: 3 }}>
          {[["inicio","Inicio"],["directorio","Directorio"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k as any)} style={{ flex: 1, padding: "9px", background: tab === k ? "rgba(16,185,129,0.12)" : "transparent", border: tab === k ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent", borderRadius: 8, color: tab === k ? "#10B981" : "#8B7FAA", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        {tab === "inicio" && (
          <>
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
              <div style={{ color: "#EDE8F5", fontSize: 14, lineHeight: 1.7 }}>
                COVEIA es el organo validador etico creado por Congruence Lab 53 para certificar herramientas de IA que respetan la dignidad humana.
              </div>
            </div>

            {stats && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>{stats.totalCertified}</div>
                  <div style={{ fontSize: 10, color: "#8B7FAA" }}>Certificadas</div>
                </div>
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#EF4444" }}>{stats.totalComplaints}</div>
                  <div style={{ fontSize: 10, color: "#8B7FAA" }}>Quejas</div>
                </div>
                <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{stats.resolutionRate}%</div>
                  <div style={{ fontSize: 10, color: "#8B7FAA" }}>Resolucion</div>
                </div>
              </div>
            )}

            <div style={{ color: "#10B981", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>4 Camaras de Validacion</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {CHAMBERS.map(c => (
                <div key={c.name} style={{ background: `${c.color}08`, border: `1px solid ${c.color}25`, borderRadius: 10, padding: 12 }}>
                  <div style={{ color: c.color, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ color: "#8B7FAA", fontSize: 10, lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "directorio" && (
          <div>
            {certs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#8B7FAA" }}>Sin certificaciones aun</div>}
            {certs.map((c: any) => (
              <div key={c.id} style={{ background: "rgba(196,181,253,0.04)", border: `1px solid ${c.level === "gold" ? "#D4AF37" : c.level === "silver" ? "#A8A8A8" : "#CD7F32"}30`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#EDE8F5", fontSize: 14, fontWeight: 700 }}>{c.toolName}</span>
                  <span style={{ background: `${c.level === "gold" ? "#D4AF37" : c.level === "silver" ? "#A8A8A8" : "#CD7F32"}20`, color: c.level === "gold" ? "#D4AF37" : c.level === "silver" ? "#A8A8A8" : "#CD7F32", fontSize: 10, padding: "2px 8px", borderRadius: 10, textTransform: "uppercase", fontWeight: 700 }}>{c.level}</span>
                </div>
                <div style={{ color: "#8B7FAA", fontSize: 11 }}>{c.developer}</div>
                {c.score > 0 && <div style={{ color: "#D4AF37", fontSize: 10, marginTop: 3 }}>{c.score}/120 puntos</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
