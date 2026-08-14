import { useState, createContext, useContext, useEffect } from "react";
import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

import Intro from "./pages/intro";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Hawkins from "./pages/hawkins";
import Plutchik from "./pages/plutchik";
import Diario from "./pages/diario";
import Chat from "./pages/chat";
import Sombras from "./pages/sombras";
import Metas from "./pages/metas";
import Congruence from "./pages/congruence";
import HuellaDelAlma from "./pages/huella-del-alma";
import Coveia from "./pages/coveia";
import PanelDirector from "./pages/panel-director";
import Menu from "./pages/menu";
import NotFound from "./pages/not-found";

// Auth context
interface AuthContextType {
  user: any | null;
  login: (u: any) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>({ user: null, login: () => {}, logout: () => {} });
export function useAuth() { return useContext(AuthContext); }

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [stage, setStage] = useState<"intro"|"login"|"app">("intro");

  const login = (u: any) => { setUser(u); setStage("app"); };
  const logout = () => { setUser(null); setStage("intro"); };

  useEffect(() => {
    // No usar localStorage/session (bloqueado en iframe)
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {stage === "intro" && <Intro onContinue={() => setStage("login")} />}
        {stage === "login" && <Login onLogin={login} />}
        {stage === "app" && (
          <Router hook={useHashLocation}>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/hawkins" component={Hawkins} />
              <Route path="/plutchik" component={Plutchik} />
              <Route path="/diario" component={Diario} />
              <Route path="/chat" component={Chat} />
              <Route path="/sombras" component={Sombras} />
              <Route path="/metas" component={Metas} />
              <Route path="/congruence" component={Congruence} />
              <Route path="/huella-del-alma" component={HuellaDelAlma} />
              <Route path="/coveia" component={Coveia} />
              <Route path="/director" component={PanelDirector} />
              <Route path="/menu" component={Menu} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        )}
        <Toaster />
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}
