import type { Server } from "http";
import express, { type Express } from "express";
import { storage } from "./storage";

// ===== TIMEZONE UTILS =====
function getUserDate(userId?: number): Date {
  let tz = "America/Mexico_City";
  if (userId) {
    try { const p = storage.getProfile(userId); if (p?.timezone) tz = p.timezone; } catch {}
  }
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: tz }));
}
function todayMX(): string {
  const d = getUserDate();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function timeMX(): string {
  const d = getUserDate();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ===== MOON PHASE (Conway) =====
function getMoonPhase(date: Date) {
  const y = date.getFullYear(), m = date.getMonth()+1, d = date.getDate();
  let r = y % 100; r %= 19; if (r > 9) r -= 19;
  r = (r * 11) % 30 + m + d;
  if (m < 3) r += 2;
  r -= (y < 2000) ? 4 : 8.3;
  r = Math.floor(r + 0.5) % 30;
  const age = r < 0 ? r + 30 : r;
  const phases = ["Luna Nueva","Creciente","Cuarto Creciente","Gibosa Creciente","Luna Llena","Gibosa Menguante","Cuarto Menguante","Menguante"];
  const idx = Math.floor(age / 3.7);
  const illumination = Math.round((1 - Math.cos((age / 29.5) * 2 * Math.PI)) / 2 * 100);
  return { phase: phases[Math.min(idx, 7)], illumination, age };
}

// ===== CLAUDE IA (llm-api) =====
async function callClaude(prompt: string, systemPrompt: string, maxTokens: number = 800): Promise<string> {
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.LLM_API_KEY || process.env.ANTHROPIC_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4",
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      }),
    });
    const data = await res.json() as any;
    return data.choices?.[0]?.message?.content || data.content?.[0]?.text || "Jaime esta reflexionando...";
  } catch (e: any) {
    return `(Jaime esta reconectando. Intenta de nuevo en un momento.)`;
  }
}

const JAIME_SYSTEM = `Eres Jaime, el guardian de conciencia de "The Color of Love" - la app de Congruence Lab 53 creada por Gabriel Hernandez.

Personalidad:
- Sabio pero directo, con calidez humana
- Nunca inventes datos del usuario que no conozcas. Si no sabes algo, dilo.
- Usa el metodo CONGRUENCE (10 pilares: Core, Origenes, Narrativa, Goals, Relaciones, Underlying body, Erotico, Now practices, Comunicacion, Expansion)
- Habla en español mexicano cotidiano
- Nunca uses emojis
- Se breve: maximo 3-4 parrafos por respuesta
- Ante la duda entre sonar profundo o ser honesto, elige honestidad

Filosofia: "El dolor que no transformas, lo transmites."`;

const SOMBRAS_SYSTEM = `Eres "Sombras del Ego", el espejo interior de la app. No dices lo que la persona quiere oir, dices lo que necesita ver.

Reglas:
- Confronta con compasion pero sin adornar
- Nombra el patron oculto detras de la queja
- No des consejos, haz preguntas que reflejen
- Maximo 2-3 parrafos
- Español mexicano
- Sin emojis

Frase guia: "Silencia tu ego y tu poder emergera."`;

export function registerRoutes(httpServer: Server, app: Express) {
  app.use(express.json({ limit: "5mb" }));

  // ===== AUTH =====
  app.post("/api/auth/login", (req, res) => {
    const { pin } = req.body;
    if (!pin) return res.status(400).json({ error: "PIN requerido" });
    const user = storage.getUserByPin(String(pin));
    if (!user) return res.status(401).json({ error: "PIN invalido" });
    return res.json(user);
  });

  app.get("/api/users/:id", (req, res) => {
    const user = storage.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "No encontrado" });
    return res.json(user);
  });

  // ===== WORLD CONTEXT =====
  app.get("/api/world-context/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    const local = getUserDate(userId);
    const moon = getMoonPhase(local);
    const profile = storage.getProfile(userId);
    return res.json({
      localDate: `${local.getFullYear()}-${String(local.getMonth()+1).padStart(2,"0")}-${String(local.getDate()).padStart(2,"0")}`,
      localTime: `${String(local.getHours()).padStart(2,"0")}:${String(local.getMinutes()).padStart(2,"0")}`,
      localDay: ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"][local.getDay()],
      moon,
      location: profile ? { city: profile.city, country: profile.country } : null,
      timezone: profile?.timezone || "America/Mexico_City",
    });
  });

  // ===== EMOTIONAL ENTRIES =====
  app.post("/api/entries", (req, res) => {
    try {
      const entry = storage.createEmotionalEntry({
        ...req.body, date: todayMX(), time: timeMX(),
      });
      // +5 puntos por registro
      const user = storage.getUserById(req.body.userId);
      if (user) storage.updateUserPoints(user.id, user.points + 5);
      return res.json(entry);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  });
  app.get("/api/entries/:userId", (req, res) => {
    return res.json(storage.getEmotionalEntries(Number(req.params.userId)));
  });

  // ===== DIARY =====
  app.post("/api/diary", (req, res) => {
    try {
      const entry = storage.createDiaryEntry({
        ...req.body, date: todayMX(), time: timeMX(),
      });
      const user = storage.getUserById(req.body.userId);
      if (user) storage.updateUserPoints(user.id, user.points + 10);
      return res.json(entry);
    } catch (e: any) { return res.status(500).json({ error: e.message }); }
  });
  app.get("/api/diary/:userId", (req, res) => {
    return res.json(storage.getDiaryEntries(Number(req.params.userId)));
  });

  // ===== CHAT (Jaime / Sombras) =====
  app.post("/api/chat", async (req, res) => {
    const { userId, agent = "jaime", content } = req.body;
    if (!content || !userId) return res.status(400).json({ error: "Datos incompletos" });

    // Guardar mensaje del usuario
    const nowIso = new Date().toISOString();
    storage.createChatMessage({ userId, agent, role: "user", content, createdAt: nowIso });

    // Contexto: ultimas 6 interacciones
    const history = storage.getChatMessages(userId, agent).slice(-12);
    const historyText = history.slice(0, -1).map((m: any) => `${m.role === "user" ? "Usuario" : agent === "jaime" ? "Jaime" : "Sombras"}: ${m.content}`).join("\n");

    const systemPrompt = agent === "sombras" ? SOMBRAS_SYSTEM : JAIME_SYSTEM;
    const fullPrompt = `${historyText ? `Contexto de la conversacion:\n${historyText}\n\n` : ""}Usuario dice: ${content}`;
    const reply = await callClaude(fullPrompt, systemPrompt, agent === "sombras" ? 500 : 700);

    storage.createChatMessage({ userId, agent, role: "assistant", content: reply, createdAt: new Date().toISOString() });
    return res.json({ reply });
  });
  app.get("/api/chat/:userId", (req, res) => {
    const agent = (req.query.agent as string) || "jaime";
    return res.json(storage.getChatMessages(Number(req.params.userId), agent));
  });

  // ===== GOALS =====
  app.post("/api/goals", (req, res) => {
    return res.json(storage.createGoal({ ...req.body, createdAt: todayMX() }));
  });
  app.get("/api/goals/:userId", (req, res) => {
    return res.json(storage.getGoals(Number(req.params.userId)));
  });
  app.patch("/api/goals/:id", (req, res) => {
    const data = { ...req.body };
    if (data.status === "completed" && !data.completedAt) data.completedAt = todayMX();
    return res.json(storage.updateGoal(Number(req.params.id), data));
  });

  // ===== SOUL FOOTPRINT =====
  const SOUL_DIMS = ["coreSelf","originsFamily","narrativeEsteem","goalsWork","relationships","bodyHealth","eroticEnergy","nowPractices","communication","expansionVision"];

  app.get("/api/soul-footprint/:userId", (req, res) => {
    return res.json(storage.getSoulFootprint(Number(req.params.userId)) || null);
  });
  app.post("/api/soul-footprint", (req, res) => {
    try {
      const fp = storage.createSoulFootprint({ ...req.body, lastUpdated: todayMX(), createdAt: todayMX() });
      return res.json(fp);
    } catch (e: any) {
      return res.json(storage.getSoulFootprint(req.body.userId));
    }
  });
  app.patch("/api/soul-footprint/:userId", (req, res) => {
    const userId = Number(req.params.userId);
    let fp = storage.getSoulFootprint(userId);
    if (!fp) fp = storage.createSoulFootprint({ userId, lastUpdated: todayMX(), createdAt: todayMX() });
    const merged: any = { ...fp, ...req.body };
    let filled = 0;
    if (merged.lifeNarrative) filled++;
    for (const d of SOUL_DIMS) if (merged[d] && merged[d] !== "{}") filled++;
    const completionPercent = Math.round((filled / 11) * 100);
    return res.json(storage.updateSoulFootprint(userId, { ...req.body, completionPercent }));
  });
  app.post("/api/soul-footprint/:userId/diagnose", async (req, res) => {
    const userId = Number(req.params.userId);
    const fp = storage.getSoulFootprint(userId);
    if (!fp) return res.status(404).json({ error: "Sin huella" });

    const dimSummary = SOUL_DIMS.map(d => {
      const val = (fp as any)[d];
      if (!val) return `${d}: (sin explorar)`;
      try { const p = JSON.parse(val); return `${d}: score ${p.score}/10 - ${p.text}`; } catch { return `${d}: ${val}`; }
    }).join("\n");

    const prompt = `Analiza esta Huella del Alma:\n\nNARRATIVA:\n${fp.lifeNarrative || "(no compartida)"}\n\nDIMENSIONES:\n${dimSummary}\n\nGenera JSON con esta estructura exacta y NADA mas:\n{"diagnosis":"parrafo 3-5 oraciones","strengths":["f1","f2","f3"],"wounds":["h1","h2"],"patterns":["p1","p2"],"growthAreas":["a1","a2","a3"],"recommendedModules":["m1","m2","m3"]}`;
    const raw = await callClaude(prompt, JAIME_SYSTEM + "\n\nCuando te pidan JSON, responde SOLO el JSON valido, nada mas.", 1200);
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return res.status(500).json({ error: "IA no genero JSON" });
      const parsed = JSON.parse(match[0]);
      const updated = storage.updateSoulFootprint(userId, {
        diagnosis: parsed.diagnosis,
        strengths: JSON.stringify(parsed.strengths),
        wounds: JSON.stringify(parsed.wounds),
        patterns: JSON.stringify(parsed.patterns),
        growthAreas: JSON.stringify(parsed.growthAreas),
        recommendedModules: JSON.stringify(parsed.recommendedModules),
      });
      return res.json(updated);
    } catch (e: any) {
      return res.status(500).json({ error: "Error procesando IA: " + e.message });
    }
  });

  // ===== COVEIA =====
  app.get("/api/coveia/certifications", (_req, res) => res.json(storage.getCoveiaCertifications()));
  app.post("/api/coveia/certifications", (req, res) => {
    const cert = storage.createCoveiaCertification({
      ...req.body,
      certifiedAt: todayMX(),
      expiresAt: new Date(Date.now() + 365*24*60*60*1000).toISOString().split("T")[0],
    });
    return res.json(cert);
  });
  app.get("/api/coveia/complaints", (_req, res) => res.json(storage.getPublicCoveiaComplaints()));
  app.get("/api/coveia/complaints/all", (_req, res) => res.json(storage.getAllCoveiaComplaints()));
  app.post("/api/coveia/complaints", (req, res) => {
    return res.json(storage.createCoveiaComplaint({ ...req.body, createdAt: todayMX() }));
  });
  app.patch("/api/coveia/complaints/:id", (req, res) => {
    return res.json(storage.updateCoveiaComplaint(Number(req.params.id), req.body));
  });
  app.get("/api/coveia/cert-requests", (_req, res) => res.json(storage.getCoveiaCertRequests()));
  app.post("/api/coveia/cert-requests", (req, res) => {
    return res.json(storage.createCoveiaCertRequest({ ...req.body, createdAt: todayMX() }));
  });
  app.patch("/api/coveia/cert-requests/:id", (req, res) => {
    return res.json(storage.updateCoveiaCertRequest(Number(req.params.id), req.body));
  });
  app.get("/api/coveia/stats", (_req, res) => res.json(storage.getCoveiaStats()));
}
