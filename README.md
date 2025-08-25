# YouTube Dashboard — Demo (Datos simulados)

Panel interactivo para **demostración en video** con datos 100% simulados. Incluye:
- Tarjetas KPI (vistas, ingresos, CTR, suscriptores)
- Gráficos (línea y barras) con **Recharts**
- Animaciones suaves con **Framer Motion** (base ya lista)
- Pestaña de **Proyecciones (Estimaciones)** con ajuste de crecimiento
- **Tailwind CSS** para estilos

> ⚠️ Todo el contenido es simulado. Las proyecciones se muestran como **estimaciones**.

## Ejecutar en local
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Desplegar en Vercel (rápido)
1. Sube este repo a GitHub.
2. Ve a https://vercel.com/new y elige tu repo.
3. Acepta la detección de Vite.
4. **Deploy**. Obtendrás `https://tu-app.vercel.app`.

## Estructura
```
src/
  App.jsx
  main.jsx
  simData.js
  styles.css
public/
  favicon.svg
```

## Notas
- El proyecto no usa enrutador (SPA simple). Si quisieras rutas, agrega React Router y un `vercel.json` con rewrites.
- Ajusta el intervalo de actualización en `App.jsx` (por defecto ~900ms).
- Puedes personalizar colores en `tailwind.config.js`.
