import { useAuth } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function PanelDirector() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery<any>({
    queryKey: ["/api/coveia/stats"],
    queryFn: () => apiRequest("GET", "/api/coveia/stats").then(r => r.json()),
  });

  if (!user || user.role !== "director") {
    return (
      <div style={{ minHeight: "100vh", background: "#1A1530", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ color: "#EF4444", textAlign: "center" }}>Acceso restringido.</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#D4AF37", fontSize: 16, fontWeight: 700 }}>Panel Director</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Jaime a sus ordenes, {user.name.split(" ")[0]}</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ color: "#D4AF37", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Sistema</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
            <div><span style={{ color: "#8B7FAA" }}>Version:</span> <b style={{ color: "#EDE8F5" }}>v12.0</b></div>
            <div><span style={{ color: "#8B7FAA" }}>Estado:</span> <b style={{ color: "#10B981" }}>Activo</b></div>
            <div><span style={{ color: "#8B7FAA" }}>Rol:</span> <b style={{ color: "#EDE8F5" }}>Director</b></div>
            <div><span style={{ color: "#8B7FAA" }}>Nivel:</span> <b style={{ color: "#EDE8F5" }}>{user.level}</b></div>
          </div>
        </div>

        {stats && (
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <div style={{ color: "#10B981", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>COVEIA</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#D4AF37" }}>{stats.totalCertified}</div>
                <div style={{ fontSize: 10, color: "#8B7FAA" }}>Certificadas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#EF4444" }}>{stats.totalComplaints}</div>
                <div style={{ fontSize: 10, color: "#8B7FAA" }}>Quejas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{stats.resolutionRate}%</div>
                <div style={{ fontSize: 10, color: "#8B7FAA" }}>Resolucion</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 14, padding: 14 }}>
          <div style={{ color: "#C4B5FD", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Accesos rapidos</div>
          {[["/coveia","COVEIA","#10B981"],["/huella-del-alma","Huella del Alma","#D4AF37"],["/congruence","Metodo CONGRUENCE","#EC4899"],["/menu","Todos los modulos","#C4B5FD"]].map(([path,label,color]) => (
            <button key={path} onClick={() => setLocation(path)} data-testid={`btn-${path}`} style={{ width: "100%", background: `${color}08`, border: `1px solid ${color}20`, color, padding: 10, borderRadius: 10, fontSize: 12, marginBottom: 6, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
