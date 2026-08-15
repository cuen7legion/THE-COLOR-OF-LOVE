import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Chat({ agent = "jaime" }: { agent?: "jaime" | "sombras" }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [input, setInput] = useState("");
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const isJaime = agent === "jaime";
  const color = isJaime ? "#D4AF37" : "#A78BFA";
  const name = isJaime ? "Jaime" : "Sombras del Ego";
  const subtitle = isJaime ? "Guardian de Conciencia" : "Tu Espejo Interior";

  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ["/api/chat", user?.id, agent],
    queryFn: () => apiRequest("GET", `/api/chat/${user?.id}?agent=${agent}`).then(r => r.json()),
    enabled: !!user,
  });

  const send = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/chat", { userId: user?.id, agent, content });
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/chat", user?.id, agent] }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send.mutate(input.trim());
    setInput("");
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${color}20` }}>
        <button onClick={() => setLocation("/")} data-testid="button-back" style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${color}15`, border: `1px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="3" fill={color} opacity="0.5"/>
          </svg>
        </div>
        <div>
          <div style={{ color, fontSize: 15, fontWeight: 700 }}>{name}</div>
          <div style={{ color: "#8B7FAA", fontSize: 10 }}>{subtitle}</div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 120px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#8B7FAA", fontSize: 13, marginTop: 40, lineHeight: 1.8, padding: "0 20px" }}>
            {isJaime
              ? "Cuentame que sientes. Estoy aqui para escucharte y guiarte."
              : "Soy tu espejo. No te dire lo que quieres oir, sino lo que necesitas ver."}
          </div>
        )}
        {messages.map((m: any) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "80%", background: m.role === "user" ? "rgba(196,181,253,0.1)" : `${color}12`, border: m.role === "user" ? "1px solid rgba(196,181,253,0.2)" : `1px solid ${color}25`, borderRadius: 14, padding: "10px 14px", color: "#EDE8F5", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}
        {send.isPending && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: `${color}12`, borderRadius: 14, padding: "10px 14px", color, fontSize: 13, fontStyle: "italic" }}>
              {name} esta reflexionando...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(26,21,48,0.95)", borderTop: "1px solid rgba(196,181,253,0.1)", padding: "12px 16px", display: "flex", gap: 8, backdropFilter: "blur(10px)" }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Escribe..."
          rows={1}
          data-testid="input-message"
          style={{ flex: 1, resize: "none", background: "rgba(196,181,253,0.05)", border: "1px solid rgba(196,181,253,0.15)", borderRadius: 12, padding: "10px 12px", color: "#EDE8F5", fontSize: 14, fontFamily: "inherit" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || send.isPending}
          data-testid="button-send"
          style={{ background: input.trim() ? `${color}25` : "rgba(196,181,253,0.06)", border: `1px solid ${input.trim() ? color : "rgba(196,181,253,0.15)"}`, color: input.trim() ? color : "#8B7FAA", padding: "10px 16px", borderRadius: 12, cursor: input.trim() ? "pointer" : "default", fontSize: 13, fontWeight: 700 }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
