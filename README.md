# Aplicación para Entrenamiento de Habilidades Sociales (MVP Accesible)

Este proyecto es una versión mínima viable (MVP) desarrollada en Lovable que simula una aplicación para practicar habilidades sociales mediante conversaciones con IA, optimizada para **máxima accesibilidad** cumpliendo con los estándares WCAG 2.1 nivel AA.

## Objetivo

Validar el flujo de usuario, diseño y usabilidad antes de integrar funciones reales de inteligencia artificial, garantizando que la aplicación sea completamente accesible para personas con diferentes discapacidades.

## Características de Accesibilidad Implementadas

### ✅ RNF-01: Compatibilidad con lectores de pantalla
- Etiquetas ARIA completas en todos los elementos interactivos
- Roles semánticos (main, header, nav, section, article)
- Orden lógico de tabulación
- Anuncios en vivo con aria-live para estados dinámicos

### ✅ RNF-02: Alto contraste y texto escalable
- Modo de alto contraste WCAG AAA (7:1 ratio)
- Tres tamaños de texto (Normal, Grande, Muy grande)
- Diseño responsive que no se rompe al escalar

### ✅ RNF-03: Subtítulos en tiempo real
- Transcripción visible durante conversaciones
- Toggle de subtítulos en configuración
- Persistencia de preferencias

### ✅ RNF-04: Entrada de texto alternativa
- Campo de texto para responder sin micrófono
- Mismo flujo que entrada de voz
- Atajo Enter para enviar

### ✅ RNF-05: Navegación por teclado
- 100% navegable con Tab/Enter/Espacio
- Estados de foco visibles
- Sin dependencia del mouse

## Tecnologías

- React 18 + TypeScript + Vite
- Tailwind CSS + Shadcn/ui
- Web Speech API
- React Router v6

## Instalación

```bash
npm install
npm run dev
```

## Próximos pasos: Integración de IA

Al integrar funciones reales, conservar todas las características de accesibilidad implementadas.

## Licencia

Proyecto educativo desarrollado con Lovable AI.
