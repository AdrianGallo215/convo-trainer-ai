# ConvoTrainer AI - Plataforma de Entrenamiento de Habilidades Sociales

## 📋 Descripción General

**ConvoTrainer AI** es una aplicación web fullstack para practicar habilidades sociales mediante conversaciones con inteligencia artificial. La plataforma simula escenarios del mundo real (entrevistas laborales, conversaciones casuales, presentaciones públicas) y proporciona análisis detallado del desempeño del usuario con métricas de voz en tiempo real.

### Características Principales
- 🎯 **3 Escenarios de Práctica**: Entrevista laboral, conversación casual y presentación pública
- 🎤 **Conversación por Voz en Tiempo Real**: Integración con ElevenLabs para agentes de IA conversacionales
- 📊 **Análisis Avanzado con IA**: Evaluación de confianza, fluidez y tono usando Groq (Llama 3.3)
- 🎮 **Sistema de Gamificación**: XP, niveles, logros y rachas para motivar el aprendizaje
- ♿ **Accesibilidad Máxima**: Cumple WCAG 2.1 AA con alto contraste, subtítulos y navegación por teclado
- 👨‍⚕️ **Panel de Psicólogo**: Monitoreo de progreso de pacientes con estadísticas detalladas
- 📈 **Métricas de Voz Detalladas**: Captura de WPM, volumen, muletillas, tiempos de respuesta

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

**Frontend:**
- ⚛️ React 18 + TypeScript
- ⚡ Vite (build tool)
- 🎨 Tailwind CSS + Shadcn UI (componentes)
- 🧭 React Router v6 (navegación)
- 🔄 TanStack Query (gestión de estado servidor)

**Backend (Lovable Cloud / Supabase):**
- 🗄️ PostgreSQL (base de datos)
- 🔐 Supabase Auth (autenticación)
- ⚡ Edge Functions (Deno runtime)
- 🔄 Row Level Security (RLS)

**IA y Servicios Externos:**
- 🤖 Groq API (Llama 3.3-70B) - Conversación y análisis
- 🎙️ ElevenLabs - Agentes conversacionales por voz
- 🗣️ Web Speech API - Text-to-Speech y Speech-to-Text

### Diagrama de Flujo de Datos

```
┌─────────────────┐
│   Usuario       │
│  (Navegador)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  - Captura de voz (Web Speech API)     │
│  - UI/UX con Tailwind + Shadcn          │
│  - Estado local (useState, useContext)  │
└────────┬────────────────────────────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│  ElevenLabs  │   │  Supabase Cloud  │
│  (Agentes    │   │  - Auth          │
│   de Voz)    │   │  - PostgreSQL    │
└──────────────┘   │  - Edge Functions│
                   └────────┬─────────┘
                            │
                            ▼
                   ┌────────────────────┐
                   │   Groq API         │
                   │   (Llama 3.3-70B)  │
                   │   - Chat responses │
                   │   - Análisis       │
                   └────────────────────┘
```

---

## 📂 Estructura del Proyecto

```
convotrainer-ai/
├── src/
│   ├── components/          # Componentes React reutilizables
│   │   ├── ui/             # Componentes UI de Shadcn
│   │   ├── Header.tsx      # Barra de navegación principal
│   │   ├── ThemeToggle.tsx # Selector dark/light mode
│   │   ├── VoiceInput.tsx  # Componente de entrada de voz
│   │   └── ProtectedRoute.tsx # HOC para rutas autenticadas
│   │
│   ├── pages/              # Páginas principales de la app
│   │   ├── Index.tsx       # Landing page
│   │   ├── Auth.tsx        # Login/Registro
│   │   ├── Escenarios.tsx  # Selección de escenario
│   │   ├── Simulacion.tsx  # Conversación con IA
│   │   ├── Feedback.tsx    # Resultados post-sesión
│   │   ├── Progress.tsx    # Panel de progreso del usuario
│   │   ├── Psychologist.tsx # Panel del psicólogo
│   │   ├── Moderator.tsx   # Panel del moderador (legacy)
│   │   ├── Configuracion.tsx # Ajustes de accesibilidad
│   │   └── NotFound.tsx    # Página 404
│   │
│   ├── contexts/           # Context API de React
│   │   └── AuthContext.tsx # Estado global de autenticación
│   │
│   ├── hooks/              # Custom React Hooks
│   │   ├── use-speech-to-text.ts  # Transcripción con Groq Whisper
│   │   ├── use-text-to-speech.ts  # Síntesis con ElevenLabs
│   │   ├── useVoiceInteraction.tsx # Abstracción voz bidireccional
│   │   ├── useGamefication.ts     # Lógica de XP y logros
│   │   └── use-chat.tsx           # Gestión de conversaciones (legacy)
│   │
│   ├── lib/                # Utilidades y clientes externos
│   │   ├── groq.ts         # Cliente Groq API
│   │   ├── elevenlabs.ts   # Cliente ElevenLabs
│   │   └── utils.ts        # Funciones helper
│   │
│   ├── integrations/       # Auto-generado por Supabase
│   │   └── supabase/
│   │       ├── client.ts   # Cliente Supabase
│   │       └── types.ts    # Tipos TypeScript de DB
│   │
│   ├── types/              # Definiciones de tipos
│   │   └── audioMetrics.ts # Tipos para métricas de voz
│   │
│   ├── index.css           # Estilos globales + design system
│   ├── App.tsx             # Componente raíz con routing
│   └── main.tsx            # Entry point de la app
│
├── supabase/
│   ├── functions/          # Edge Functions (Deno)
│   │   ├── groq-chat/     # Genera respuestas de IA
│   │   └── groq-analyze/  # Analiza conversaciones
│   ├── migrations/         # Migraciones de base de datos
│   └── config.toml         # Configuración de Supabase
│
├── public/                 # Archivos estáticos
├── seed.js                 # Script para crear usuarios de prueba
└── package.json            # Dependencias del proyecto
```

---

## 🗄️ Base de Datos (PostgreSQL)

### Tablas Principales

#### `profiles`
Información extendida del usuario
```sql
- id: uuid (PK, FK → auth.users)
- full_name: text
- username: text
- avatar_url: text
- xp: integer (default: 0)
- level: integer (default: 1)
- streak_days: integer (default: 0)
- total_sessions: integer (default: 0)
- last_practice_date: date
- created_at: timestamptz
- updated_at: timestamptz
```

#### `user_roles`
Sistema de roles multirol
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- role: app_role (enum: 'user', 'psychologist', 'moderator', 'admin')
- created_at: timestamptz

UNIQUE(user_id, role) -- Un usuario puede tener múltiples roles
```

#### `user_sessions`
Registro de cada sesión de práctica
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- scenario_type: text ('entrevista', 'casual', 'presentacion')
- confidence_score: integer (0-100)
- fluency_score: integer (0-100)
- tone_score: integer (0-100)
- duration_seconds: integer
- xp_earned: integer
- completed_at: timestamptz
- created_at: timestamptz
```

#### `user_statistics`
Estadísticas agregadas por usuario
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users, UNIQUE)
- avg_confidence: numeric
- avg_fluency: numeric
- avg_tone: numeric
- total_practice_time: integer (segundos)
- total_xp_earned: integer
- best_scenario: text
- updated_at: timestamptz
```

#### `achievements`
Definición de logros disponibles
```sql
- id: uuid (PK)
- code: text (UNIQUE, ej: 'first_session')
- title: text
- description: text
- icon: text (emoji)
- requirement_type: text ('sessions', 'streak', 'score')
- requirement_value: integer
- xp_reward: integer
- created_at: timestamptz
```

#### `user_achievements`
Logros desbloqueados por cada usuario
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- achievement_id: uuid (FK → achievements)
- unlocked_at: timestamptz

UNIQUE(user_id, achievement_id)
```

### Funciones de Base de Datos

#### `has_role(user_id uuid, role app_role) → boolean`
Verifica si un usuario tiene un rol específico. Se usa en políticas RLS.
```sql
SECURITY DEFINER  -- Ejecuta con privilegios del creador
SET search_path = public
```

#### `xp_for_level(level integer) → integer`
Calcula el XP necesario para alcanzar el siguiente nivel.
```sql
Formula: (level * 100) + ((level - 1) * 50)
Ejemplo: Nivel 5 → 700 XP
```

#### `update_user_level() → trigger`
Trigger que automáticamente sube el nivel del usuario cuando alcanza el XP necesario.

#### `handle_new_user() → trigger`
Trigger ejecutado al crear un usuario en `auth.users`. Crea automáticamente:
- Registro en `profiles`
- Rol 'user' en `user_roles`
- Registro en `user_statistics`

---

## 🔐 Seguridad y RLS (Row Level Security)

Todas las tablas tienen RLS activado y políticas específicas:

### Políticas Comunes

**profiles:**
- ✅ Todos pueden ver perfiles (SELECT)
- ✅ Usuarios pueden actualizar su propio perfil (UPDATE)
- ✅ Psicólogos pueden ver todos los perfiles (SELECT)

**user_sessions:**
- ✅ Usuarios pueden ver solo sus sesiones (SELECT)
- ✅ Usuarios pueden crear sus sesiones (INSERT)
- ✅ Psicólogos pueden ver todas las sesiones (SELECT)
- ✅ Admins pueden ver todas las sesiones (SELECT)

**user_achievements:**
- ✅ Usuarios pueden ver solo sus logros (SELECT)
- ✅ Usuarios pueden desbloquear sus logros (INSERT)
- ✅ Psicólogos pueden ver todos los logros (SELECT)

**achievements:**
- ✅ Todos pueden ver logros disponibles (SELECT)
- ✅ Solo admins pueden gestionar logros (ALL)

---

## 🎮 Sistema de Gamificación

### Cálculo de XP

Cada sesión otorga XP basado en el desempeño:

```javascript
baseXP = Math.round(avgScore * 0.5)  // Max 50 XP
bonus = avgScore >= 90 ? 20 : avgScore >= 75 ? 10 : 0

XP total = baseXP + bonus  // Max 70 XP por sesión
```

**Ejemplo:**
- Scores: Confianza 80, Fluidez 85, Tono 90
- Promedio: 85%
- Base XP: 42.5 → 43
- Bonus: +10 (por estar entre 75-90)
- **Total: 53 XP**

### Sistema de Niveles

```
Nivel 1: 0-150 XP
Nivel 2: 150-350 XP
Nivel 3: 350-600 XP
Nivel 4: 600-900 XP
Nivel 5: 900-1250 XP
...
```

Fórmula general: `xpForLevel(N) = (N * 100) + ((N-1) * 50)`

### Racha de Días (Streak)

- ✅ Mantiene la racha si practicas días consecutivos
- ❌ Reinicia a 1 si dejas pasar >1 día
- 🎯 Desbloquea logros especiales (ej: racha de 7 días)

### Logros Disponibles

Los logros se verifican después de cada sesión:

**Por Sesiones:**
- 🏆 Primera Sesión (1 sesión) - 50 XP
- 🏆 Practicante (10 sesiones) - 100 XP
- 🏆 Dedicado (50 sesiones) - 300 XP

**Por Racha:**
- 🔥 Racha de 7 días - 150 XP
- 🔥 Racha de 30 días - 500 XP

**Por Desempeño:**
- 💎 Perfeccionista (90+ en todos los scores) - 200 XP
- 💪 Confiado (85+ confianza) - 100 XP
- 🗣️ Fluido (85+ fluidez) - 100 XP
- 🎯 Tono Perfecto (85+ tono) - 100 XP

---

## 🤖 Integración con IA

### 1. ElevenLabs - Agentes Conversacionales

Cada escenario tiene su propio agente de IA configurado:

```typescript
const agentIdByScenario = {
  entrevista: "agent_0701kb0eptdyebnsvs72wcpdy7nv",
  casual: "agent_1801kb0ezy2aeebb1ahwx3txtn3y",
  presentacion: "agent_8101kb0f45ysefz979b6c9khy4pv"
};
```

**Flujo de conversación:**
1. Usuario hace clic en "Comenzar Conversación"
2. Se establece conexión WebSocket con ElevenLabs
3. Usuario habla → Audio se envía al agente
4. Agente responde con voz sintetizada en tiempo real
5. Transcripciones se muestran como subtítulos

### 2. Groq API - Análisis y Chat

#### Edge Function: `groq-chat`

Genera respuestas contextuales durante la conversación (fallback si no se usa ElevenLabs).

**System Prompts por Escenario:**

```typescript
entrevista: "Eres un entrevistador profesional de RH..."
casual: "Eres un amigo en conversación casual..."
presentacion: "Eres una audiencia atenta en presentación..."
```

**Parámetros:**
- Modelo: `llama-3.3-70b-versatile`
- Temperature: 0.7
- Max tokens: 500

#### Edge Function: `groq-analyze`

Analiza la conversación completa al finalizar la sesión.

**Métricas Evaluadas:**

**1. Confianza (0-100):**
- 50% contenido (seguridad en respuestas)
- 25% volumen de voz (bajo = inseguridad)
- 25% muletillas (muchas = nerviosismo)

**2. Fluidez (0-100):**
- 40% naturalidad del contenido
- 30% velocidad de habla (ideal: 120-150 WPM en español)
- 30% % de silencio (>25% indica problemas)

**3. Tono (0-100):**
- 70% apropiado para el contexto
- 30% tiempo de respuesta (<2s reactivo, >4s inseguro)

**Entrada de Métricas de Audio:**

```typescript
interface AudioMetrics {
  durationMs: number;           // Duración de la respuesta
  wordCount: number;            // Palabras en transcripción
  wordsPerMinute: number;       // Velocidad de habla
  averageVolume: number;        // Volumen 0-1
  silencePercentage: number;    // % de tiempo en silencio
  fillerWords: string[];        // ["eh", "este", "mmm"]
  fillerWordCount: number;      // Total de muletillas
  responseTimeMs: number;       // Latencia de respuesta
}
```

**Salida del Análisis:**

```json
{
  "confidence": 82,
  "fluency": 75,
  "tone": 88,
  "explanations": {
    "confidence": "Volumen promedio de 0.4 indica algo de inseguridad...",
    "fluency": "Velocidad de 135 WPM está en rango óptimo...",
    "tone": "Tiempo de respuesta de 1.8s muestra reactividad..."
  },
  "recommendations": [
    "Habla con más volumen para proyectar confianza",
    "Reduce el uso de 'eh' y 'este' (detectadas 8 veces)",
    "Mantén la velocidad actual (135 WPM es ideal)"
  ]
}
```

---

## 🎤 Captura y Análisis de Voz

### Speech-to-Text (use-speech-to-text.ts)

**Proceso:**
1. Solicita permiso de micrófono
2. Crea `MediaRecorder` para capturar audio
3. Monitorea volumen en tiempo real con `AnalyserNode`
4. Al detener, envía audio a **Groq Whisper Large V3**
5. Extrae transcripción y calcula métricas

**Métricas Calculadas:**

```typescript
// Detección de muletillas en español
const fillerWordPatterns = [
  '\\beh\\b', '\\beste\\b', '\\bmmm+\\b', 
  '\\bpues\\b', '\\bbueno\\b', '\\bo sea\\b',
  '\\bentonces\\b', '\\bcomo que\\b'
];

// Cálculo de velocidad
wordsPerMinute = (wordCount / durationMs) * 60000;

// Análisis de silencio
silencePercentage = (silentSamples / totalSamples) * 100;
```

### Text-to-Speech (use-text-to-speech.ts)

Usa ElevenLabs para síntesis de voz:

```typescript
const audioStream = await elevenLabs.textToSpeech.convert(
  '1SM7GgM6IMuvQlz2BwM3',  // Voice ID (Rachel)
  {
    text,
    model_id: 'eleven_multilingual_v2',
    output_format: 'mp3_44100_128'
  }
);
```

---

## 🎨 Sistema de Diseño y Accesibilidad

### Modos Visuales

#### 1. Light Mode (Default)
```css
--background: hsl(210 40% 98%);      /* Casi blanco */
--primary: hsl(199 89% 48%);         /* Azul calmante */
--accent: hsl(168 74% 85%);          /* Teal suave */
```

#### 2. Dark Mode
```css
--background: hsl(222 47% 11%);      /* Slate oscuro */
--primary: hsl(199 89% 48%);         /* Mantiene azul */
--card: hsl(222 47% 14%);            /* Slate más claro */
```

#### 3. High Contrast (WCAG AAA)
```css
--background: hsl(0 0% 0%);          /* Negro puro */
--foreground: hsl(60 100% 50%);      /* Amarillo brillante */
--border: hsl(60 100% 50%);          /* Sin grises */

/* Ratio de contraste: 7:1+ */
```

### Características de Accesibilidad

✅ **ARIA Labels Completos**
```tsx
<Button aria-label="Volver a escenarios">
  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
</Button>
```

✅ **Focus Visible**
```css
*:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2;
}
```

✅ **Escalado de Texto**
```css
html { font-size: 16px; }
html.text-large { font-size: 18px; }
html.text-xlarge { font-size: 20px; }
```

✅ **Subtítulos en Tiempo Real**
```tsx
{showSubtitles && (
  <span className="sr-only" aria-live="polite">
    {transcription}
  </span>
)}
```

✅ **Navegación por Teclado**
- Tab: Navegar entre elementos
- Enter/Space: Activar botones
- Escape: Cerrar modales

---

## 🔄 Flujo de Usuario Completo

### 1. Registro e Inicio de Sesión

```
[Auth.tsx]
   │
   ├─► Usuario completa formulario (email, password, full_name)
   │
   ├─► Validación con Zod schemas
   │
   ├─► supabase.auth.signUp()
   │
   └─► Trigger handle_new_user()
        ├─► Crea profile
        ├─► Asigna rol 'user'
        └─► Inicializa statistics
```

### 2. Selección de Escenario

```
[Escenarios.tsx]
   │
   ├─► Usuario ve 3 tarjetas (entrevista, casual, presentación)
   │
   └─► Click en "Practicar"
        │
        └─► Navigate to /simulacion/{tipo}
```

### 3. Sesión de Conversación

```
[Simulacion.tsx]
   │
   ├─► Pantalla de inicio con avatar
   │
   ├─► Click "Comenzar Conversación"
   │    │
   │    └─► startSession({ agentId })
   │         │
   │         └─► Conexión WebSocket a ElevenLabs
   │
   ├─► Usuario habla (micrófono captura audio)
   │    │
   │    ├─► Análisis en tiempo real de volumen
   │    ├─► Transcripción con Groq Whisper
   │    └─► Cálculo de métricas (WPM, muletillas, etc.)
   │
   ├─► IA responde con voz sintetizada
   │    │
   │    └─► Transcripción mostrada como subtítulo
   │
   ├─► Conversación continúa...
   │
   └─► Click "Finalizar"
        │
        └─► handleFinish()
```

### 4. Análisis de Conversación

```
handleFinish()
   │
   ├─► Recopila todos los mensajes + métricas
   │
   ├─► Invoca supabase.functions.invoke('groq-analyze')
   │    │
   │    └─► Edge Function analiza con Groq
   │         │
   │         ├─► Calcula scores (confidence, fluency, tone)
   │         ├─► Genera explicaciones detalladas
   │         └─► Crea recomendaciones personalizadas
   │
   └─► Retorna análisis al frontend
```

### 5. Gamificación y Persistencia

```
[useGamefication.ts - saveSession()]
   │
   ├─► Calcula XP ganado basado en scores
   │
   ├─► Inserta en user_sessions
   │    └─► { user_id, scenario_type, scores, duration, xp_earned }
   │
   ├─► Actualiza profiles
   │    ├─► xp += xpEarned
   │    ├─► total_sessions += 1
   │    ├─► Actualiza streak_days
   │    └─► Trigger update_user_level() → nivel automático
   │
   ├─► Actualiza user_statistics (promedios)
   │    ├─► avg_confidence
   │    ├─► avg_fluency
   │    └─► total_practice_time
   │
   └─► checkAchievements()
        │
        ├─► Itera todos los achievements
        ├─► Verifica requisitos
        └─► Inserta en user_achievements si desbloqueado
             └─► Otorga XP adicional del achievement
```

### 6. Pantalla de Feedback

```
[Feedback.tsx]
   │
   ├─► Muestra XP ganado (animación)
   │
   ├─► Muestra nuevos logros desbloqueados
   │
   ├─► Muestra barras de progreso con scores
   │
   ├─► Muestra recomendaciones personalizadas
   │
   └─► Links a:
        ├─► Repetir sesión
        ├─► Ver progreso completo
        └─► Volver a inicio
```

---

## 👨‍⚕️ Panel de Psicólogo

### Acceso

Solo usuarios con rol `psychologist` en la tabla `user_roles` pueden acceder a `/psychologist`.

### Funcionalidades

**1. Búsqueda de Pacientes**
```sql
SELECT id, full_name, username 
FROM profiles 
WHERE full_name ILIKE '%query%' OR username ILIKE '%query%'
LIMIT 50
```

**2. Vista Detallada del Paciente**

Al seleccionar un paciente, se muestra:

- **Perfil:**
  - Nivel y XP actual
  - Racha de días consecutivos
  - Total de sesiones completadas
  - Minutos totales de práctica

- **Estadísticas:**
  - Confianza promedio (%)
  - Fluidez promedio (%)
  - Tono promedio (%)
  - Mejor escenario del paciente

- **Logros:**
  - Grid de todos los achievements
  - Destacados: desbloqueados vs bloqueados
  - Fecha de desbloqueo

### RLS para Psicólogos

```sql
CREATE POLICY "Psychologists can view all profiles"
ON profiles FOR SELECT
USING (has_role(auth.uid(), 'psychologist'));

CREATE POLICY "Psychologists can view all sessions"
ON user_sessions FOR SELECT
USING (has_role(auth.uid(), 'psychologist'));
```

---

## 🔧 Variables de Entorno

### Variables Requeridas (AUTO-GENERADAS POR LOVABLE)

```env
# Supabase (generadas automáticamente)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
VITE_SUPABASE_PROJECT_ID=xxx

# Secrets del Servidor (configurados en Lovable Cloud)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_DB_URL=postgresql://...
SUPABASE_ANON_KEY=eyJhbGc...
```

### Secrets Adicionales (CONFIGURAR MANUALMENTE)

```env
# Groq (para transcripción y análisis)
GROQ_API_KEY=gsk_xxx

# ElevenLabs (para agentes de voz)
VITE_ELEVENLABS_API_KEY=xxx
```

**Configuración en Lovable:**
1. Ve a Settings → Cloud → Secrets
2. Agrega `GROQ_API_KEY` y `VITE_ELEVENLABS_API_KEY`

---

## 📦 Instalación y Desarrollo

### Prerequisitos

- Node.js 18+ o Bun
- Cuenta en Lovable (con proyecto Cloud activado)
- API Keys de Groq y ElevenLabs

### Setup Local

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd convotrainer-ai

# 2. Instalar dependencias
npm install
# o
bun install

# 3. Configurar variables de entorno
# Las variables de Supabase ya están en .env (auto-generadas)
# Agrega manualmente en Lovable Settings → Secrets:
#   - GROQ_API_KEY
#   - VITE_ELEVENLABS_API_KEY

# 4. Iniciar servidor de desarrollo
npm run dev
# o
bun dev

# La app estará en http://localhost:5173
```

### Seed de Datos (Crear Psicólogo)

```bash
# 1. Configurar SERVICE_ROLE_KEY en .env local
SUPABASE_SERVICE_ROLE_KEY=xxx  # Obtener de Lovable Settings

# 2. Ejecutar script de seed
node seed.js

# Esto crea:
# - Email: psicologo@gmail.com
# - Password: Psicologo_123
# - Rol: psychologist
```

**Alternativa Manual:**
1. Registra usuario en la app
2. Ejecuta SQL en la consola de Lovable Cloud:
```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'psychologist'::app_role 
FROM auth.users 
WHERE email = 'tu-email@ejemplo.com';
```

---

## 🚀 Deployment

### Deploy Automático con Lovable

**Frontend:**
1. Click en "Publish" en la interfaz de Lovable
2. La app se publica automáticamente en `https://tu-proyecto.lovable.app`
3. Cualquier cambio en `main` dispara un nuevo deploy

**Backend (Edge Functions):**
- Edge Functions se despliegan automáticamente al guardar cambios
- No requiere acción manual

### Deploy Manual (Alternativa)

```bash
# Build de producción
npm run build
# o
bun run build

# Los archivos compilados estarán en ./dist/
# Puedes subirlos a:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Cualquier hosting de archivos estáticos
```

**⚠️ Importante:** Si haces deploy fuera de Lovable, necesitas configurar tu propia instancia de Supabase y actualizar las variables de entorno.

---

## 🧪 Testing

### Testing Manual

**Flujo Completo:**
1. ✅ Registra usuario nuevo
2. ✅ Verifica creación de profile y rol
3. ✅ Selecciona escenario "entrevista"
4. ✅ Inicia conversación con ElevenLabs
5. ✅ Habla al micrófono (mínimo 3 intercambios)
6. ✅ Finaliza y verifica análisis
7. ✅ Revisa XP ganado y logros
8. ✅ Accede a /progress
9. ✅ (Como psicólogo) Accede a /psychologist

### Verificación de Métricas de Voz

Abre la consola del navegador durante una sesión:

```javascript
// Después de cada respuesta, verás:
=== MÉTRICAS DE AUDIO ===
Duración: 4523ms
Palabras: 12
Palabras por minuto: 159
Volumen promedio: 0.453
Silencio: 12.4%
Muletillas: eh, este, mmm (3)
Tiempo de respuesta: 1847ms
========================
```

### Testing de RLS (Seguridad)

```sql
-- Como usuario normal, intenta acceder a sesiones de otros
SELECT * FROM user_sessions WHERE user_id != auth.uid();
-- Debería retornar 0 filas

-- Como psicólogo, intenta ver todas las sesiones
SELECT * FROM user_sessions;
-- Debería retornar todas las filas
```

---

## 🐛 Errores Conocidos y Limitaciones

### Errores Menores

1. **Import no usado en Simulacion.tsx**
   ```typescript
   import { send } from "process"; // Línea 13
   ```
   No causa problemas en desarrollo pero puede fallar en build de producción.

2. **Console logging de API keys**
   En `src/lib/elevenlabs.ts` se imprime parte de la API key (primeros 5 caracteres). 
   Debería removerse en producción.

3. **404 logging excesivo**
   Cada 404 genera un `console.error`. No es crítico pero puede llenar logs.

### Limitaciones Técnicas

1. **Groq API Key expuesta en el cliente**
   `src/lib/groq.ts` usa `dangerouslyAllowBrowser: true`. 
   **Riesgo:** La API key es visible en el código del cliente.
   **Solución recomendada:** Mover toda la lógica de Groq a Edge Functions.

2. **Métricas de audio no se persisten**
   Las métricas detalladas (WPM, muletillas, volumen) se calculan pero no se guardan en la base de datos. Solo se usan para el análisis de Groq.
   **Mejora futura:** Agregar tabla `user_session_metrics` para análisis histórico.

3. **Sin rate limiting en Edge Functions**
   Las funciones `groq-chat` y `groq-analyze` no tienen protección contra abuse.
   **Mejora futura:** Implementar rate limiting con Redis o Supabase.

4. **Validación de roles solo en UI**
   La ruta `/psychologist` está protegida en el componente, pero no hay verificación a nivel de ruta.
   **Mejora:** Agregar middleware de validación de roles en ProtectedRoute.

5. **Archivo duplicado**
   Existe `src/hooks/use-chat copy.tsx` que parece ser un backup no usado.

---

## 📚 Recursos y Referencias

### Documentación Externa

- **Supabase:** https://supabase.com/docs
- **ElevenLabs API:** https://elevenlabs.io/docs/api-reference/conversational-ai
- **Groq API:** https://console.groq.com/docs
- **Shadcn UI:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **WCAG 2.1 Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/

### Agentes de ElevenLabs

Los agentes están preconfigurados en la consola de ElevenLabs con prompts específicos para cada escenario:

- **Entrevista:** Comportamiento de reclutador profesional
- **Casual:** Amigo interesado en conversar
- **Presentación:** Audiencia atenta y colaborativa

---

## 🤝 Contribuciones

### Flujo de Desarrollo

1. Crea una rama desde `main`
2. Realiza cambios y prueba localmente
3. Haz commit con mensajes descriptivos
4. Abre Pull Request con descripción detallada
5. Espera revisión y aprobación

### Convenciones de Código

- **TypeScript:** Siempre tipar explícitamente parámetros y retornos
- **React:** Componentes funcionales con hooks
- **CSS:** Usar solo Tailwind + variables del design system
- **Naming:**
  - Componentes: `PascalCase`
  - Hooks: `useCamelCase`
  - Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

---

## 📄 Licencia

Este proyecto es educativo y fue desarrollado como parte del curso de Interacción Humano-Computador 2025-2.

Universidad Nacional de Ingeniería - Lima, Perú

---

## 📞 Soporte

Para preguntas o problemas:
- Email: soporte@convotrainer.ai
- Discord: [Lovable Community](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0
**Desarrollado con:** ❤️ y Lovable AI
