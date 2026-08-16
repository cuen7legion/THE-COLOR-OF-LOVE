import { useState, useEffect } from "react";
import { useAuth } from "@/App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const DIMS = [
  { key: "coreSelf", letter: "C", name: "Esencia e Infancia", color: "#D4AF37" },
  { key: "originsFamily", letter: "O", name: "Origenes y Familia", color: "#A78BFA" },
  { key: "narrativeEsteem", letter: "N", name: "Narrativa y Autoestima", color: "#F59E0B" },
  { key: "goalsWork", letter: "G", name: "Vocacion y Trabajo", color: "#06B6D4" },
  { key: "relationships", letter: "R", name: "Relaciones y Vinculos", color: "#EC4899" },
  { key: "bodyHealth", letter: "U", name: "Cuerpo y Salud", color: "#10B981" },
  { key: "eroticEnergy", letter: "E", name: "Energia Erotica", color: "#EF4444" },
  { key: "nowPractices", letter: "N", name: "Practicas y Habitos", color: "#8B5CF6" },
  { key: "communication", letter: "C", name: "Comunicacion y Limites", color: "#F97316" },
  { key: "expansionVision", letter: "E", name: "Expansion y Vision", color: "#14B8A6" },
];

const QUESTIONS = [
  { dim: "lifeNarrative", q: "Cuentame tu historia. ¿Como llegaste hasta aqui?" },
  { dim: "coreSelf", q: "¿Como fue tu infancia? ¿Que creencias sobre ti se formaron ahi?" },
  { dim: "originsFamily", q: "¿Como es o fue tu familia? ¿Que patrones se repiten?" },
  { dim: "narrativeEsteem", q: "¿Como te hablas a ti mismo?" },
  { dim: "goalsWork", q: "¿Tu trabajo te llena o te vacia?" },
  { dim: "relationships", q: "¿Como son tus relaciones? ¿Que patron se repite?" },
  { dim: "bodyHealth", q: "¿Como esta tu cuerpo?" },
  { dim: "eroticEnergy", q: "¿Como vives tu sexualidad?" },
  { dim: "nowPractices", q: "¿Que habitos sostienen tu vida?" },
  { dim: "communication", q: "¿Sabes poner limites?" },
  { dim: "expansionVision", q: "¿Que quieres construir?" },
];

export default function HuellaDelAlma() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [view, setView] = useState<"mapa"|"construir"|"diagnostico">("mapa");
  const [q, setQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(5);

  const { data: fp } = useQuery<any>({
    queryKey: ["/api/soul-footprint", user?.id],
    queryFn: () => apiRequest("GET", `/api/soul-footprint/${user?.id}`).then(r => r.json()),
    enabled: !!user,
  });

  useEffect(() => { if (user && fp === null) apiRequest("POST", "/api/soul-footprint", { userId: user.id }); }, [user, fp]);

  const save = useMutation({
    mutationFn: async () => {
      const body: any = {};
      const question = QUESTIONS[q];
      if (question.dim === "lifeNarrative") body.lifeNarrative = answer;
      else body[question.dim] = JSON.stringify({ text: answer, score });
      await apiRequest("PATCH", `/api/soul-footprint/${user?.id}`, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/soul-footprint", user?.id] });
      if (q < QUESTIONS.length - 1) { setQ(q+1); setAnswer(""); setScore(5); } else setView("mapa");
    },
  });

  const diagnose = useMutation({
    mutationFn: async () => await apiRequest("POST", `/api/soul-footprint/${user?.id}/diagnose`, {}).then(r => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/soul-footprint", user?.id] }); setView("diagnostico"); },
  });

  const parseArr = (s: string) => { try { return JSON.parse(s); } catch { return []; } };
  const getDim = (k: string) => { try { return JSON.parse(fp?.[k] || "{}"); } catch { return {}; } };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#D4AF37", fontSize: 16, fontWeight: 700 }}>Huella del Alma</div>
          <div style={{ color: "#8B7FAA", fontSize: 10 }}>Motor de Conciencia</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(196,181,253,0.04)", borderRadius: 10, padding: 3 }}>
          {[["mapa","Mi Mapa"],["construir","Construir"],["diagnostico","Diagnostico"]].map(([k,l]) => (
            <button key={k} onClick={() => setView(k as any)} data-testid={`tab-${k}`} style={{ flex: 1, padding: "9px", background: view === k ? "rgba(212,175,55,0.12)" : "transparent", border: view === k ? "1px solid rgba(212,175,55,0.3)" : "1px solid transparent", borderRadius: 8, color: view === k ? "#D4AF37" : "#8B7FAA", fontSize: 12, fontWeight: view === k ? 700 : 400, cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        {view === "mapa" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#D4AF37" }}>{fp?.completionPercent || 0}%</div>
              <div style={{ fontSize: 11, color: "#8B7FAA" }}>Huella completa</div>
            </div>
            {DIMS.map((d, i) => {
              const data = getDim(d.key);
              return (
                <div key={d.key} onClick={() => { setQ(i+1); setView("construir"); }} style={{ background: data.text ? `${d.color}08` : "rgba(196,181,253,0.03)", border: `1px solid ${data.text ? `${d.color}25` : "rgba(196,181,253,0.08)"}`, borderRadius: 10, padding: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${d.color}15`, border: `2px solid ${data.text ? d.color : "rgba(196,181,253,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: data.text ? d.color : "rgba(196,181,253,0.3)" }}>{d.letter}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: data.text ? "#EDE8F5" : "#8B7FAA" }}>{d.name}</div>
                    {data.text && <div style={{ fontSize: 10, color: d.color }}>Score {data.score}/10</div>}
                  </div>
                </div>
              );
            })}
            <button onClick={() => diagnose.mutate()} disabled={diagnose.isPending} data-testid="button-diagnose" style={{ width: "100%", marginTop: 20, padding: 14, background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 12, color: "#D4AF37", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {diagnose.isPending ? "Jaime esta analizando..." : "Pedir diagnostico a Jaime"}
            </button>
          </>
        )}

        {view === "construir" && (
          <div>
            <div style={{ color: "#D4AF37", fontSize: 12, marginBottom: 6 }}>Pregunta {q+1} de {QUESTIONS.length}</div>
            <div style={{ color: "#EDE8F5", fontSize: 15, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>{QUESTIONS[q].q}</div>
            {q > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#8B7FAA", marginBottom: 4 }}>Del 1 al 10: <b style={{ color: "#D4AF37" }}>{score}</b></div>
                <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            )}
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8} placeholder="Comparte con Jaime..." data-testid="input-answer" />
            <button onClick={() => save.mutate()} disabled={!answer.trim() || save.isPending} data-testid="button-save-dim" style={{ width: "100%", marginTop: 12, padding: 12, background: answer.trim() ? "rgba(212,175,55,0.15)" : "rgba(196,181,253,0.05)", border: `1px solid ${answer.trim() ? "rgba(212,175,55,0.3)" : "rgba(196,181,253,0.1)"}`, borderRadius: 10, color: answer.trim() ? "#D4AF37" : "#8B7FAA", fontSize: 13, fontWeight: 700, cursor: answer.trim() ? "pointer" : "default" }}>
              {save.isPending ? "Guardando..." : q < QUESTIONS.length - 1 ? "Siguiente" : "Completar"}
            </button>
          </div>
        )}

        {view === "diagnostico" && (
          fp?.diagnosis ? (
            <div>
              <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
                <div style={{ color: "#D4AF37", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Lectura de Jaime</div>
                <div style={{ color: "#EDE8F5", fontSize: 13, lineHeight: 1.8 }}>{fp.diagnosis}</div>
              </div>
              {[["strengths","Lo que te nutre","#10B981"],["wounds","Lo que te duele","#EF4444"],["patterns","Patrones","#F59E0B"],["growthAreas","Crecimiento","#06B6D4"],["recommendedModules","Modulos sugeridos","#A78BFA"]].map(([k,l,c]) => {
                const arr = parseArr(fp[k]);
                if (!arr.length) return null;
                return (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ color: c, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{l}</div>
                    {arr.map((item: string, i: number) => (
                      <div key={i} style={{ color: "#C4B5FD", fontSize: 12, padding: "6px 10px", background: `${c}08`, borderLeft: `2px solid ${c}`, marginBottom: 4 }}>{item}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#8B7FAA", fontSize: 13 }}>Aun no tienes diagnostico. Ve a "Construir" y comparte con Jaime.</div>
          )
        )}
      </div>
    </div>
  );
}
