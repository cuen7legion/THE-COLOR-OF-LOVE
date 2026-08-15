import { useState } from "react";
import { useAuth } from "@/App";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Metas() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("personal");

  const { data: goals = [] } = useQuery<any[]>({
    queryKey: ["/api/goals", user?.id],
    queryFn: () => apiRequest("GET", `/api/goals/${user?.id}`).then(r => r.json()),
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/goals", { userId: user?.id, title, category, status: "active" });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/api/goals", user?.id] }); setTitle(""); },
  });

  const toggle = useMutation({
    mutationFn: async (g: any) => {
      await apiRequest("PATCH", `/api/goals/${g.id}`, { status: g.status === "completed" ? "active" : "completed" });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/goals", user?.id] }),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#1A1530", padding: "0 0 40px" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setLocation("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4B5FD" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div>
          <div style={{ color: "#F59E0B", fontSize: 16, fontWeight: 700 }}>Metas</div>
          <div style={{ color: "#8B7FAA", fontSize: 11 }}>Lo que quiero construir</div>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nueva meta..." data-testid="input-goal" />
          <button onClick={() => title.trim() && create.mutate()} data-testid="button-add" style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B", padding: "0 16px", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>+</button>
        </div>

        {goals.length === 0 && <div style={{ textAlign: "center", color: "#8B7FAA", padding: 40 }}>Sin metas aun</div>}
        {goals.map((g: any) => (
          <div key={g.id} onClick={() => toggle.mutate(g)} data-testid={`goal-${g.id}`} style={{ background: "rgba(196,181,253,0.04)", border: "1px solid rgba(196,181,253,0.1)", borderRadius: 10, padding: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${g.status === "completed" ? "#10B981" : "#8B7FAA"}`, background: g.status === "completed" ? "#10B981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {g.status === "completed" && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#1A1530" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div style={{ color: g.status === "completed" ? "#8B7FAA" : "#EDE8F5", fontSize: 14, textDecoration: g.status === "completed" ? "line-through" : "none" }}>{g.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
