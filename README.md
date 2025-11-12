# Aplicación para Entrenamiento de Habilidades Sociales (MVP)

Este proyecto es una versión mínima viable (MVP) desarrollada en Lovable que simula una aplicación para practicar habilidades sociales mediante conversaciones con IA.

## Objetivo

Validar el flujo de usuario, diseño y usabilidad antes de integrar funciones reales de inteligencia artificial.

## Flujo de usuario

1. **Pantalla de Inicio**: Introducción y acceso rápido a configuración
2. **Selección de Escenario**: Tres tipos de práctica disponibles
   - Entrevista laboral
   - Conversación casual
   - Presentación pública
3. **Simulación de conversación**: Interacción con IA simulada
4. **Resultados y feedback**: Análisis de rendimiento con métricas visuales
5. **Configuración**: Ajustes de micrófono, idioma y modo de voz

## Características del MVP

- ✅ Interfaz de usuario completa y responsiva
- ✅ Navegación fluida entre pantallas
- ✅ Diseño profesional con sistema de colores coherente
- ✅ Simulación de respuestas de IA (predefinidas)
- ✅ Simulación de entrada de voz
- ✅ Feedback visual con métricas de rendimiento
- ✅ Sistema de configuración básico

## Tecnologías utilizadas

- **Frontend**: React + TypeScript + Vite
- **Estilos**: Tailwind CSS con sistema de diseño personalizado
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Notificaciones**: Sonner

## Próximos pasos: Integración de IA

### 1. Reconocimiento de voz

**Opciones recomendadas:**
- **Web Speech API**: Solución nativa del navegador (gratis, limitada)
- **Whisper API (OpenAI)**: Alta precisión, múltiples idiomas
- **Google Cloud Speech-to-Text**: Escalable, soporte multiidioma

**Implementación sugerida:**
```javascript
// Ejemplo con Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.lang = 'es-ES';
recognition.continuous = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Enviar transcript a la IA
};
```

### 2. IA conversacional

**Opciones recomendadas:**
- **OpenAI GPT-4**: Conversaciones naturales y contextuales
- **Anthropic Claude**: Excelente para diálogos largos
- **Google Gemini**: Multimodal, análisis de contexto

**Implementación sugerida:**
```javascript
// Ejemplo con OpenAI API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: conversationHistory,
    temperature: 0.7
  })
});
```

### 3. Análisis emocional y feedback

**Opciones recomendadas:**
- **Hume AI**: Análisis emocional de voz
- **Azure Cognitive Services**: Análisis de sentimiento
- **Custom NLP**: Análisis de pausas, muletillas, velocidad

**Métricas a implementar:**
- Confianza vocal (volumen, firmeza)
- Fluidez (pausas, velocidad)
- Tono emocional (análisis de sentimiento)
- Claridad (pronunciación, articulación)
- Uso de muletillas

### 4. Persistencia de datos

**Backend recomendado:**
- **Supabase**: Base de datos PostgreSQL, autenticación
- **Firebase**: Tiempo real, fácil configuración
- **Custom API**: Flask/FastAPI + PostgreSQL

**Datos a persistir:**
- Perfil de usuario
- Historial de sesiones
- Métricas de progreso
- Configuraciones personalizadas

## Estructura de archivos

```
src/
├── pages/
│   ├── Index.tsx          # Pantalla de inicio
│   ├── Escenarios.tsx     # Selección de escenario
│   ├── Simulacion.tsx     # Práctica interactiva
│   ├── Feedback.tsx       # Resultados y análisis
│   └── Configuracion.tsx  # Ajustes de la app
├── components/
│   └── ui/                # Componentes de shadcn/ui
├── index.css              # Sistema de diseño
└── App.tsx                # Configuración de rutas
```

## Instalación y desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Próximas funcionalidades sugeridas

1. **Sistema de autenticación**: Registro y login de usuarios
2. **Dashboard de progreso**: Visualización de mejoras a lo largo del tiempo
3. **Más escenarios**: Negociación, resolución de conflictos, networking
4. **Modo multiplayer**: Práctica con otros usuarios
5. **Grabación de sesiones**: Reproducir y analizar sesiones anteriores
6. **Gamificación**: Logros, niveles, desafíos diarios

## Consideraciones de privacidad

Al implementar la versión completa con IA real:
- Informar a los usuarios sobre el uso de IA
- Obtener consentimiento para grabación de voz
- Encriptar datos sensibles
- Cumplir con GDPR y regulaciones locales
- Opción de eliminar datos personales

## Autor

Proyecto generado con Lovable AI. Adaptado para desarrollo académico y de prototipo.

## Licencia

Este es un proyecto educativo y de demostración.
