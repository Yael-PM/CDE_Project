# CDE Project

Aplicación web de CDE con:

- frontend React 19 + TypeScript + Vite;
- API Express 5 + TypeScript;
- MySQL para usuarios, notas, recuperación de contraseña y sesiones;
- Cloudinary para imágenes de notas;
- Mailgun para contacto y recuperación de contraseña.

## Desarrollo local

Frontend:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Backend:

```powershell
Set-Location backend
Copy-Item .env.example .env
npm install
npm run build
npm start
```

La base nueva puede crearse con [backend/database/schema.sql](backend/database/schema.sql).

## Verificación

```powershell
npm run lint
npm run build
Set-Location backend
npm run build
```

## Producción

Consulta [DEPLOYMENT.md](DEPLOYMENT.md) para desplegar frontend, backend y MySQL en Railway y conectar los dominios administrados en Namecheap.
