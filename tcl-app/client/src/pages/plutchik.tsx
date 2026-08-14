import { useState } from "react";
import { useAuth } from "@/App";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const PLUTCHIK = [
  { name: "Alegria", color: "#F59E0B" }, { name: "Confianza", color: "#10B981" },
  { name: "Miedo", color: "#6B7280" }, { name: "Sorpresa", color: "#06B6D4" },
  { name: "Tristeza", color: "#3B82F6" }, { name: "Aversion", color: "#7C3AED" },
  { name: "Enojo", color: "#EF4444" }, { name: "Anticipacion", color: "#F97316" },
];

export default function Plutchik() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [intensity, setIntensity] = useState(5);
  const [selected, setSelected] = useState<string>("");

  const save = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/entries", {
        userId: user?.id, type: "plutchik", primaryValue: selected, intensity,
      });
    },
    onSuccess: () => setLocation("/"),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#EC4899", fontSize: 16, fontWeight: 700 }}>Rueda de Plutchik</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>8 emociones basicas</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {PLUTCHIK.map(e => (
            <button key={e.name} onClick={() => setSelected(e.name)} data-testid={`emotion-${e.name}`}
              style={{ background: selected === e.name ? `${e.color}25` : `${e.color}10`, border: `1px solid ${selected === e.name ? e.color : `${e.color}30`}`, borderRadius: 12, padding: 14, color: e.color, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {e.name}
            </button>
          ))}
        </div>

        {selected && (
          <div className="fade-in" style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 12, padding: 14 }}>
            <div style={{ color: "#C4B5FD", fontSize: 12, marginBottom: 8 }}>Intensidad: <b style={{ color: "#D4AF37" }}>{intensity}</b>/10</div>
            <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} style={{ width: "100%", accentColor: "#D4AF37" }} />
            <button onClick={() => save.mutate()} data-testid="button-save" style={{ width: "100%", marginTop: 12, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Registrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
