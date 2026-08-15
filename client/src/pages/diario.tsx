import { useState } from "react";
import { useAuth } from "@/App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const MOODS = ["Paz","Amor","Alegria","Enojo","Miedo","Tristeza","Confusion","Gratitud"];

export default function Diario() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [writing, setWriting] = useState(false);

  const { data: entries = [] } = useQuery<any[]>({
    queryKey: ["/api/diary", user?.id],
    queryFn: () => apiRequest("GET", `/api/diary/${user?.id}`).then(r => r.json()),
    enabled: !!user,
  });

  const save = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/diary", { userId: user?.id, title, content, mood });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/diary", user?.id] });
      setTitle(""); setContent(""); setMood(""); setWriting(false);
    },
  });

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 100px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} data-testid="button-back" style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#06B6D4", fontSize: 16, fontWeight: 700 }}>Diario</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Tu voz escrita</div>
        </div>
        {!writing && (
          <button onClick={() => setWriting(true)} data-testid="button-new-entry" style={{ marginLeft: "auto", background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.3)", color: "#06B6D4", padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer" }}>+ Nueva</button>
        )}
      </div>

      <div style={{ padding: "0 16px" }}>
        {writing && (
          <div className="fade-in" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 14, padding: 14, marginBottom: 16 }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo (opcional)" data-testid="input-title" style={{ marginBottom: 10 }} />
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Que pasa en tu interior hoy..." rows={8} data-testid="input-content" style={{ marginBottom: 10 }} />
            <div style={{ fontSize: 11, color: "#8B7FAA", marginBottom: 6 }}>¿Como te sientes?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)} data-testid={`button-mood-${m}`} style={{ background: mood === m ? "rgba(6,182,212,0.2)" : "rgba(196,181,253,0.05)", border: `1px solid ${mood === m ? "#06B6D4" : "rgba(196,181,253,0.15)"}`, color: mood === m ? "#06B6D4" : "#C4B5FD", padding: "4px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer" }}>{m}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setWriting(false)} data-testid="button-cancel" style={{ flex: 1, background: "rgba(196,181,253,0.06)", border: "1px solid rgba(196,181,253,0.15)", color: "#8B7FAA", padding: 10, borderRadius: 10, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => save.mutate()} disabled={!content.trim() || save.isPending} data-testid="button-save" style={{ flex: 2, background: content.trim() ? "rgba(6,182,212,0.15)" : "rgba(196,181,253,0.05)", border: `1px solid ${content.trim() ? "#06B6D4" : "rgba(196,181,253,0.1)"}`, color: content.trim() ? "#06B6D4" : "#8B7FAA", padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: content.trim() ? "pointer" : "default" }}>{save.isPending ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        )}

        {entries.length === 0 && !writing && (
          <div style={{ textAlign: "center", color: "#8B7FAA", fontSize: 13, padding: 40 }}>Tu diario esta en blanco. Escribe la primera pagina.</div>
        )}

        {entries.map((e: any) => (
          <div key={e.id} data-testid={`entry-${e.id}`} style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 12, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              {e.title && <div style={{ color: "#EDE8F5", fontSize: 14, fontWeight: 600 }}>{e.title}</div>}
              {e.mood && <span style={{ background: "rgba(6,182,212,0.12)", color: "#06B6D4", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{e.mood}</span>}
            </div>
            <div style={{ color: "#C4B5FD", fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{e.content}</div>
            <div style={{ color: "rgba(196,181,253,0.3)", fontSize: 10, marginTop: 6 }}>{e.date} · {e.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
