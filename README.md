# Portfolio React + ReactBits-ready

Migrado a React (Vite) para poder integrar componentes de ReactBits con mas facilidad.

## Stack

- React + Vite
- GSAP (animaciones)
- CSS custom
- Contenido en JSON (`src/data/content.json`)

## Estructura

- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/components/OrbBackground.jsx`
- `src/styles.css`
- `src/data/content.json`
- `.github/workflows/deploy.yml`

## Ejecutar localmente (PowerShell)

Si `npm` da error de politica de ejecucion, usa `npm.cmd`.

```powershell
cd "C:\Users\ikdis\OneDrive\Документы\Codex"
npm.cmd install
npm.cmd run dev
```

Build de produccion:

```powershell
npm.cmd run build
```

## Personalizacion de contenido

Edita `src/data/content.json`:

- `meta`: nombre, rol, tagline, ubicacion, redes
- `about`: descripcion
- `skills`: categorias e items
- `education`: estudios
- `projects`: proyectos
- `contact`: datos de contacto y proveedor de formulario

## Configurar formulario

En `src/data/content.json`:

- Formspree (por defecto):
  - `"provider": "formspree"`
  - `"formspree": { "endpoint": "https://formspree.io/f/tuId" }`
- EmailJS:
  - `"provider": "emailjs"`
  - completa `serviceId`, `templateId`, `publicKey`

## Deploy automatico en GitHub Pages

1. Crea un repo en GitHub y sube este proyecto (branch `main`).
2. En GitHub ve a `Settings > Pages`.
3. En `Build and deployment`, selecciona `Source: GitHub Actions`.
4. Haz push a `main`.
5. El workflow `.github/workflows/deploy.yml` construye y publica automaticamente.

## Integrar mas ReactBits

Ya puedes crear componentes en `src/components/*` y usarlos dentro de `src/App.jsx`.