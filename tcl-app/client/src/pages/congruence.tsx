import { useLocation } from "wouter";

const PILLARS = [
  { letter: "C", name: "Core Self & Childhood", es: "Esencia e Infancia", color: "#D4AF37" },
  { letter: "O", name: "Origins & Family", es: "Origenes y Familia", color: "#A78BFA" },
  { letter: "N", name: "Narrative & Self-Esteem", es: "Narrativa y Autoestima", color: "#F59E0B" },
  { letter: "G", name: "Goals & Work", es: "Vocacion y Trabajo", color: "#06B6D4" },
  { letter: "R", name: "Relationships", es: "Relaciones y Vinculos", color: "#EC4899" },
  { letter: "U", name: "Underlying Body & Health", es: "Cuerpo y Salud", color: "#10B981" },
  { letter: "E", name: "Erotic & Sexual Energy", es: "Energia Erotica", color: "#EF4444" },
  { letter: "N", name: "Now Practices (Habits)", es: "Practicas y Habitos", color: "#8B5CF6" },
  { letter: "C", name: "Communication & Boundaries", es: "Comunicacion y Limites", color: "#F97316" },
  { letter: "E", name: "Expansion & Life Vision", es: "Expansion y Vision", color: "#14B8A6" },
];

export default function Congruence() {
  const [, setLocation] = useLocation();
  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#EC4899", fontSize: 16, fontWeight: 700 }}>Metodo CONGRUENCE</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Los 10 pilares del desarrollo humano</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <p style={{ color: "#C4B5FD", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
          Congruencia psicologica: que lo que piensas, sientes, dices y haces esten alineados.
          El metodo de Congruence Lab 53 integra estos 10 pilares como un mapa integral de desarrollo humano.
        </p>
        {PILLARS.map((p, i) => (
          <div key={i} style={{ background: `${p.color}08`, border: `1px solid ${p.color}25`, borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${p.color}20`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: p.color, flexShrink: 0 }}>
              {p.letter}
            </div>
            <div>
              <div style={{ color: "#EDE8F5", fontSize: 14, fontWeight: 700 }}>{p.es}</div>
              <div style={{ color: "#8B7FAA", fontSize: 11 }}>{p.name}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button onClick={() => setLocation("/huella-del-alma")} data-testid="button-huella" style={{ padding: "12px 24px", background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Aplicalo en tu Huella del Alma
          </button>
        </div>
      </div>
    </div>
  );
}
