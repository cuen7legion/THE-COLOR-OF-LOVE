================================================================================
THE COLOR OF LOVE — Congruence Lab 53
Version 12.0 — Base para Railway
================================================================================

Este es el codigo fuente de "The Color of Love", la app de bienestar integral
con IA creada por Gabriel Hernandez Hernandez (Congruence Lab 53).

Esta version es la RECONSTRUCCION del 30 de junio de 2026 tras la perdida del
codigo original en el reset del sandbox de Perplexity Computer del 2 de junio.

Contiene la BASE FUNCIONAL con 9 modulos activos. Los 30+ modulos adicionales
de v11.0 (El Oraculo, Bitacora, Test Congruencia 21q, etc.) estan documentados
en los PDFs oficiales y se pueden reconstruir siguiendo la misma estructura.

--------------------------------------------------------------------------------
QUE INCLUYE
--------------------------------------------------------------------------------

BACKEND (100% funcional):
  - Express + Drizzle ORM + SQLite
  - 11 tablas: users, profiles, emotional_entries, diary_entries, 
    chat_messages, goals, soul_footprint, coveia_certifications, 
    coveia_complaints, coveia_cert_requests
  - Auth por PIN
  - Timezone America/Mexico_City
  - Integracion Claude IA (Anthropic) para Jaime, Sombras y diagnostico Huella
  - COVEIA completo (certificaciones, quejas, solicitudes)
  - Seed automatico: PIN Director 460046 + 10 PINs de prueba

FRONTEND (9 paginas activas):
  1. Intro (Heart of Light animado)
  2. Login (PIN 6 digitos)
  3. Dashboard (Jaime card, check-in emocional, stats, luna, timezone)
  4. Chat con Jaime (IA)
  5. Sombras del Ego (IA confrontativa)
  6. Diario personal con moods
  7. Escala Hawkins (17 niveles de conciencia)
  8. Rueda de Plutchik (8 emociones)
  9. Metas
  10. Metodo CONGRUENCE (10 pilares — informacional)
  11. Huella del Alma (Motor de Conciencia — 3 vistas + IA)
  12. COVEIA (Comite validador etico + directorio)
  13. Panel Director (solo PIN 460046)
  14. Menu de modulos

DISENIO:
  - Paleta oscura mistica (#1A1530 fondo, #D4AF37 dorado, #C4B5FD lila)
  - Fuentes: DM Sans + Playfair Display + UnifrakturMaguntia
  - Mobile-first, testeado en 375px
  - Sin emojis, todo SVG iconografia
  - Espanol nativo

DEPLOY:
  - Dockerfile listo para Railway
  - railway.json configurado
  - .env.example con todas las variables necesarias

--------------------------------------------------------------------------------
QUE NO INCLUYE (pendientes de reconstruir por el equipo de Alex)
--------------------------------------------------------------------------------

MODULOS AVANZADOS DE V11.0:
  - El Oraculo (cartas del alma con IA)
  - El Prisma (descomponer emocion en colores)
  - Bitacora (registro diario estructurado)
  - Year in Pixels
  - Filosofia
  - Test Congruencia 21q
  - Espejo sin Juicio
  - Letris (Tetris de palabras emocionales)
  - Oximel (receta ancestral con imagenes)
  - Sala Mistica
  - Reloj
  - Libro Dorado
  - Portal Cuantico
  - Color del Planeta
  - Empresarial + Red Profesionales
  - Wellness
  - Frases originales
  - Impacto IA
  - Sincronicidades
  - Ruleta de Sombras
  - Cartas de mis Heridas
  - Arbol de Creencias
  - El Puente (IFS)
  - Brujula de Valores
  - Laboratorio del Perdon
  - Constelacion de Vinculos
  - El Legado
  - Jaime Guardian avanzado
  - Memoria comprimida
  - Pilares

IMAGENES:
  - Avatar de Gabriel como Jaime
  - Avatar de Sombras del Ego (Buda alien con paloma)
  - Fotos de Oximel (cielo dorado, ingredientes)
  - Avatar La Paloma
  - Logo sonoro (mp3)
  
Estos assets estan referenciados en los PDFs institucionales de Gabriel.
Se pueden regenerar con Anthropic + Sora/Midjourney o adjuntar imagenes propias.

--------------------------------------------------------------------------------
COMO DESPLEGAR EN RAILWAY (PASO A PASO PARA ALEX)
--------------------------------------------------------------------------------

REQUISITOS PREVIOS:
  1. Cuenta en Railway (railway.app) — gratis para empezar
  2. Cuenta en Anthropic (console.anthropic.com) para el API key de Claude
  3. Git instalado en la maquina
  4. Node.js 20+ instalado (para pruebas locales)

--------------------------------------------------------------------------------
PASO 1: PROBAR LOCALMENTE (opcional pero recomendado)
--------------------------------------------------------------------------------

  # Extraer el zip
  unzip tcl-app.zip
  cd tcl-app

  # Instalar dependencias
  npm install

  # Configurar variables
  cp .env.example .env
  # Editar .env y poner tu ANTHROPIC_API_KEY

  # Correr en modo dev
  npm run dev

  # Abrir http://localhost:5000
  # Login con PIN: 460046 (Director Gabriel)

--------------------------------------------------------------------------------
PASO 2: SUBIR A GITHUB
--------------------------------------------------------------------------------

  cd tcl-app
  git init
  git add .
  git commit -m "The Color of Love v12.0 — base para Railway"
  
  # Crear repo en GitHub (github.com/new)
  # Nombre sugerido: the-color-of-love
  # Privado
  
  git remote add origin https://github.com/TU_USUARIO/the-color-of-love.git
  git branch -M main
  git push -u origin main

--------------------------------------------------------------------------------
PASO 3: DESPLEGAR EN RAILWAY
--------------------------------------------------------------------------------

  1. Ir a railway.app y hacer login
  2. Click "New Project" > "Deploy from GitHub repo"
  3. Autorizar Railway y seleccionar el repo the-color-of-love
  4. Railway detecta el Dockerfile automaticamente
  5. En la seccion "Variables" del proyecto, agregar:
     - ANTHROPIC_API_KEY = sk-ant-XXX  (tu API key real)
     - NODE_ENV = production
     - TZ = America/Mexico_City

  6. Agregar un VOLUMEN persistente para SQLite:
     - Click "Data" > "New Volume"
     - Mount path: /data
     - Y agregar variable: DATABASE_URL = /data/tcl.db

  7. Railway construira e iniciara automaticamente
  8. En "Settings" > "Networking" > "Generate Domain" 
     para obtener URL publica (algo como tcl-app-production.up.railway.app)

--------------------------------------------------------------------------------
PASO 4: VERIFICAR
--------------------------------------------------------------------------------

  Abrir la URL de Railway en el navegador.
  Debe cargar la pantalla "The Color of Love" con boton Comenzar.
  
  Login con PIN Director: 460046
  Login con PINs de prueba (nivel 5): 
    126072, 119894, 127600, 121599, 115564, 
    130805, 102377, 123919, 110769, 106832

  Probar cada modulo. En especial:
  - Chat con Jaime (verifica que Claude responde)
  - Sombras del Ego (misma verificacion)
  - Huella del Alma > Construir > Pedir diagnostico
  - COVEIA > Directorio (debe mostrar The Color of Love certificada Bronze)

--------------------------------------------------------------------------------
PASO 5: DOMINIO CUSTOM (opcional)
--------------------------------------------------------------------------------

  En Railway > Settings > Networking > Custom Domain
  Ejemplo: colordelamor.congruencelab53.com
  Configurar CNAME en el registrar del dominio.

--------------------------------------------------------------------------------
COSTO ESTIMADO EN RAILWAY
--------------------------------------------------------------------------------

  Plan Hobby: $5 USD/mes (con creditos gratuitos iniciales)
  Recursos tipicos:
    - CPU: ~0.5 vCPU
    - RAM: ~512 MB
    - Storage: ~1 GB
  
  Costo real por uso: aprox $3-8 USD/mes para 10-50 usuarios activos.
  
  Claude API (Anthropic):
    - Sonnet 4: aprox $3 USD per million input tokens
    - Estimacion: $10-30 USD/mes para 50 usuarios chateando activamente

--------------------------------------------------------------------------------
BACKUPS Y SEGURIDAD
--------------------------------------------------------------------------------

  Railway hace snapshots automaticos del volumen /data. 
  
  Recomendaciones adicionales:
  1. Descargar backup manual del data.db semanalmente:
     railway run --service=tcl-app cat /data/tcl.db > backup-YYYYMMDD.db
  
  2. Habilitar 2FA en la cuenta Railway
  
  3. Rotar el ANTHROPIC_API_KEY cada 3-6 meses

--------------------------------------------------------------------------------
COMO AGREGAR MODULOS NUEVOS (PARA ALEX)
--------------------------------------------------------------------------------

  Para cada modulo pendiente:
  
  1. Si necesita datos persistentes, agregar tabla en shared/schema.ts
     - Seguir el patron de las tablas existentes (soul_footprint es buen ejemplo)
  
  2. Agregar CRUD en server/storage.ts
  
  3. Crear endpoints en server/routes.ts
     - Seguir el patron de /api/soul-footprint
  
  4. Crear pagina en client/src/pages/nombre-modulo.tsx
     - Ejemplo mas simple: hawkins.tsx
     - Ejemplo con IA: huella-del-alma.tsx
     - Ejemplo con formularios: diario.tsx
  
  5. Registrar en client/src/App.tsx:
     import NuevoModulo from "./pages/nombre-modulo";
     <Route path="/nombre-modulo" component={NuevoModulo} />
  
  6. Agregar al menu en client/src/pages/menu.tsx
  
  7. Commit + push (Railway redesplega automaticamente)

--------------------------------------------------------------------------------
DOCUMENTACION INSTITUCIONAL DE REFERENCIA
--------------------------------------------------------------------------------

  Todos estos PDFs estan en la cuenta de Perplexity de Gabriel:
  
  - lineamiento-unificado-cl53.pdf (17pp) — referencia obligatoria
  - manos-conscientes-manifiesto.pdf (20pp)
  - lineamientos-eticos-coveia.pdf (18pp)
  - coveia-organo-validador-fusion.pdf (con neurodivergencia)
  - manual-congruence-completo.pdf (200pp) — manual del facilitador
  - acronimo-congruence.pdf (12pp) — descripcion de los 10 pilares
  - the-color-of-love-direccion.pdf (15pp) — presentacion ejecutiva

--------------------------------------------------------------------------------
CONTACTO Y PROXIMOS PASOS
--------------------------------------------------------------------------------

  Owner: Gabriel Hernandez Hernandez
  Ubicacion: Guadalajara, Mexico
  Proyecto: Congruence Lab 53 — For Live Happiness
  
  Filosofia: "El dolor que no transformas, lo transmites."
  Frase de la app: "Nunca te sientas solo con lo que sientes."
  Dia sagrado: Miercoles (reuniones de equipo, hitos, lanzamientos)

--------------------------------------------------------------------------------
STACK COMPLETO
--------------------------------------------------------------------------------

  Backend:  Node.js 20 + Express + TypeScript
  DB:       SQLite (better-sqlite3) + Drizzle ORM
  Frontend: React 18 + TypeScript + Vite
  Styling:  Tailwind CSS v3 + custom CSS mistico
  Routing:  Wouter con hash routing
  Estado:   TanStack Query v5
  IA:       Anthropic Claude Sonnet 4
  Build:    esbuild (backend) + Vite (frontend)
  Deploy:   Railway (Dockerfile)

================================================================================
Fin del README. Contacto para dudas tecnicas: el equipo de Alex.
================================================================================
