import { useState } from "react";
import { useAuth } from "@/App";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const HAWKINS = [
  { level: 700, name: "Iluminacion", color: "#FEF3C7" },
  { level: 600, name: "Paz", color: "#C4B5FD" },
  { level: 540, name: "Alegria", color: "#F59E0B" },
  { level: 500, name: "Amor", color: "#EC4899" },
  { level: 400, name: "Razon", color: "#06B6D4" },
  { level: 350, name: "Aceptacion", color: "#10B981" },
  { level: 310, name: "Voluntad", color: "#84CC16" },
  { level: 250, name: "Neutralidad", color: "#A78BFA" },
  { level: 200, name: "Coraje", color: "#F97316" },
  { level: 175, name: "Orgullo", color: "#EF4444" },
  { level: 150, name: "Ira", color: "#DC2626" },
  { level: 125, name: "Deseo", color: "#B91C1C" },
  { level: 100, name: "Miedo", color: "#6B7280" },
  { level: 75, name: "Pena", color: "#4B5563" },
  { level: 50, name: "Apatia", color: "#374151" },
  { level: 30, name: "Culpa", color: "#1F2937" },
  { level: 20, name: "Verguenza", color: "#111827" },
];

export default function Hawkins() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: async (level: any) => {
      await apiRequest("POST", "/api/entries", {
        userId: user?.id, type: "hawkins", primaryValue: String(level.level), notes: level.name, intensity: 5,
      });
      return level;
    },
    onSuccess: () => { setSaved(true); setTimeout(() => setLocation("/"), 1200); },
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#D4AF37", fontSize: 16, fontWeight: 700 }}>Escala Hawkins</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Niveles de conciencia</div>
        </div>
      </div>

      {saved ? (
        <div style={{ textAlign: "center", padding: 40, color: "#10B981" }}>Registrado. Volviendo al inicio...</div>
      ) : (
        <div style={{ padding: "0 16px" }}>
          {HAWKINS.map(h => (
            <button
              key={h.level}
              onClick={() => save.mutate(h)}
              data-testid={`hawkins-${h.level}`}
              style={{ width: "100%", background: `${h.color}10`, border: `1px solid ${h.color}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 6, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "inherit" }}
            >
              <div style={{ minWidth: 40, color: h.color, fontSize: 14, fontWeight: 700 }}>{h.level}</div>
              <div style={{ color: "#EDE8F5", fontSize: 13, textAlign: "left" }}>{h.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
