# Despliegue de CDE en Railway

Esta guía despliega tres servicios dentro del mismo proyecto de Railway:

```text
Frontend (React/Vite + Caddy) ──HTTPS──> Backend (Express)
                                           │
                                           └── red privada ──> MySQL
```

Cloudinary y Mailgun permanecen como servicios externos. Namecheap administra DNS y correo corporativo.

## 1. Preparación

Antes de desplegar:

```powershell
npm ci
$env:VITE_API_URL='https://api.example.com/api'
npm run lint
npm run build

Set-Location backend
npm ci
npm run build
```

No subas ningún `.env`. El repositorio solo debe contener los archivos `.env.example`.

## 2. Crear el proyecto y la base MySQL

1. En Railway crea un proyecto nuevo.
2. En el canvas selecciona `+ New` y agrega MySQL.
3. Renombra el servicio a `MySQL`; los ejemplos de referencias asumen ese nombre.
4. Activa Backups para el ambiente de producción.

Railway expone `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD` y `MYSQLDATABASE` desde el servicio MySQL.

### Base nueva

Importa `backend/database/schema.sql` usando el cliente MySQL y las credenciales públicas/TCP Proxy mostradas por Railway:

```powershell
mysql.exe -h HOST_PUBLICO -P PUERTO_PUBLICO -u USUARIO -p BASE_DE_DATOS
```

Dentro del cliente:

```sql
SOURCE C:/ruta/al/repositorio/backend/database/schema.sql;
```

### Migrar la base de XAMPP

1. Exporta `cde_db` desde phpMyAdmin o `mysqldump`.
2. Importa el archivo en MySQL de Railway.
3. Confirma que existen estas columnas:

```sql
SHOW COLUMNS FROM `user`;
SHOW COLUMNS FROM `note`;
```

4. Si `user.role` no existe, ejecuta `backend/database/upgrade-existing-database.sql` una sola vez.
5. Asigna el rol al administrador real:

```sql
UPDATE `user`
SET `role` = 'admin'
WHERE `email` = 'ADMIN_REAL@TU_DOMINIO.COM';
```

6. Comprueba que el email sea único y que existan `cloudinary_public_id`, `password_reset_token_hash` y `password_reset_expires_at`.

## 3. Desplegar primero el frontend temporal

Crear primero el frontend evita un ciclo de dependencias entre las URLs temporales.

1. Crea un servicio vacío llamado `Frontend`.
2. Conecta el repositorio de GitHub.
3. Deja Root Directory en `/`.
4. Railway detectará el `Dockerfile` de la raíz.
5. Agrega temporalmente:

```env
VITE_API_URL=https://placeholder.invalid/api
```

6. Despliega.
7. En Settings > Networking selecciona Generate Domain.
8. Configura el healthcheck del servicio como `/health` si Railway no lo detecta.
9. Guarda la URL `https://...up.railway.app` del frontend.

El `Caddyfile` sirve `dist/` y redirige las rutas SPA inexistentes a `index.html`, por lo que enlaces directos como `/reset-password?token=...` funcionan.

## 4. Desplegar el backend temporal

1. Crea otro servicio vacío llamado `Backend`.
2. Conecta el mismo repositorio.
3. En Settings configura Root Directory como `/backend`.
4. En Config File Path configura `/backend/railway.toml`.
5. Agrega las variables siguientes.

### Aplicación y frontend

```env
NODE_ENV=production
CLIENT_URL=https://FRONTEND_TEMPORAL.up.railway.app
CLIENT_URLS=https://FRONTEND_TEMPORAL.up.railway.app
FRONTEND_URL=https://FRONTEND_TEMPORAL.up.railway.app
ALLOW_PUBLIC_REGISTRATION=false
```

`CLIENT_URLS` acepta varias URLs separadas por comas. Esto permite mantener temporal y dominio final durante la transición.

### MySQL mediante referencias de Railway

Si el servicio se llama `MySQL`:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
```

No uses el host público para la conexión entre servicios; las referencias anteriores usan la red privada del proyecto.

### Sesión

Genera un secreto localmente:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Agrega:

```env
SESSION_SECRET=VALOR_GENERADO_DE_96_CARACTERES_HEX
SESSION_SECRET_PREVIOUS=
SESSION_NAME=cde.sid
SESSION_TABLE_NAME=sessions
SESSION_MAX_AGE_HOURS=8
```

Las sesiones se guardan en MySQL. El store crea `sessions` si no existe.

### Cloudinary

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Mailgun

```env
MAILGUN_API_KEY=...
MAILGUN_DOMAIN=mg.tu-dominio.com
MAILGUN_FROM=CDE <no-reply@mg.tu-dominio.com>
CONTACT_TO_EMAIL=contacto@tu-dominio.com
MAILGUN_REGION=US
```

Usa `EU` solamente cuando el dominio de Mailgun pertenezca a esa región.

6. No configures `PORT`; Railway la inyecta.
7. Despliega. El backend escucha en `0.0.0.0:$PORT`.
8. Genera un dominio temporal en Settings > Networking.
9. El healthcheck definido en código es `/api/health/ready` y valida también MySQL.

## 5. Conectar el frontend al backend temporal

En `Frontend`, cambia y despliega:

```env
VITE_API_URL=https://BACKEND_TEMPORAL.up.railway.app/api
```

La variable se incorpora al bundle durante el build; cambiarla exige un nuevo deploy del frontend.

## 6. Pruebas con dominios temporales

Prueba en este orden:

```text
GET  /api/health
GET  /api/health/ready
GET  /api/notes
GET  /api/notes/:id
POST /api/auth/login
GET  /api/auth/me
POST /api/notes              admin
PUT  /api/notes/:id          admin
DELETE /api/notes/:id        admin
POST /api/contact
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

Verifica además:

- `GET /api/notes` funciona sin sesión.
- Crear/editar/eliminar devuelve `401` sin sesión y `403` para un usuario sin rol admin.
- Una sesión continúa después de reiniciar el backend y aparece en `sessions`.
- Una imagen nueva aparece en Cloudinary y al sustituir/eliminar una nota no queda la referencia anterior.
- El enlace del correo abre la página pública `/reset-password`.

## 7. Dominios personalizados en Railway y Namecheap

Arquitectura recomendada:

```text
tu-dominio.com       -> Frontend
www.tu-dominio.com   -> Frontend o redirección al dominio raíz
api.tu-dominio.com   -> Backend
mg.tu-dominio.com    -> Mailgun
```

Para cada dominio web:

1. En el servicio Railway abre Settings > Networking > Custom Domain.
2. Agrega el dominio correspondiente.
3. Railway mostrará un CNAME y un TXT de verificación.
4. En Namecheap abre Domain List > Manage > Advanced DNS.
5. Crea ambos registros exactamente como los muestra Railway.
6. Espera la verificación y el indicador verde.

Railway genera y renueva su propio certificado TLS. No se instala en Railway el certificado SSL comprado por separado.

Para el dominio raíz, usa el registro que Railway indique para Namecheap. No mantengas un A/AAAA conflictivo para el mismo host.

## 8. Cambiar a las URLs finales

Backend:

```env
CLIENT_URL=https://tu-dominio.com
CLIENT_URLS=https://tu-dominio.com,https://www.tu-dominio.com
FRONTEND_URL=https://tu-dominio.com
```

Frontend:

```env
VITE_API_URL=https://api.tu-dominio.com/api
```

Despliega primero el backend y después el frontend. Prueba login, `/auth/me` y logout desde el navegador para confirmar la cookie segura.

## 9. DNS de correo

- Conserva Namecheap Private Email en el dominio raíz para buzones humanos.
- Verifica `mg.tu-dominio.com` en Mailgun con los valores SPF y DKIM que Mailgun entregue.
- Agrega DMARC inicialmente con política de monitoreo.
- No crees dos registros SPF para el mismo hostname.

## 10. Operación y rollback

Antes del corte final:

- crea un backup manual de MySQL;
- conserva las URLs temporales hasta completar las pruebas;
- revisa Deploy Logs y Application Logs de ambos servicios;
- sella en Railway las variables secretas después de comprobarlas;
- habilita alertas de uso/costo;
- conserva un despliegue anterior exitoso para rollback.

Si falla el dominio personalizado, vuelve temporalmente a las URLs `*.up.railway.app` sin cambiar la base ni los assets.

## Documentación oficial

- Railway monorepos: https://docs.railway.com/deployments/monorepo
- React en Railway: https://docs.railway.com/guides/react
- MySQL en Railway: https://docs.railway.com/databases/mysql
- Variables y referencias: https://docs.railway.com/variables
- Dominios y SSL: https://docs.railway.com/networking/domains/working-with-domains
- Healthchecks: https://docs.railway.com/deployments/healthchecks
