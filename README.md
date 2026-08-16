# TCL App

A modern web application for the TCL platform.

## Tecnologías utilizadas
- React.js con Vite
- Tailwind CSS  
- TypeScript

## Instalación y ejecución
1. Clonar el repositorio: `git clone <repository-url>`
2. Ejecutar en entorno de desarrollo: `npm install && npm run dev`
3. Construir para producción: `npm run build`

## Estructura del proyecto
```
src/ - Código fuente React/Vite
client/ - Carpeta con archivos HTML, JS y CSS
shared/ - Esquemas y datos comunes

```

## Despliegue a GitHub Actions → Railway
1. Añadir variables de entorno en el repositorio: `RAILWAY_ACCOUNT_ID`, `RAILWAY_PROJECT_ID`
2. El workflow `.github/workflows/deploy.yml` se ejecutará al hacer push a la rama `main`
3. Dockerfile está configurado para producción
4. Al completar el despliegue, verás el sitio en https://<tu-dominio>.railway.app

## Licencia
MIT