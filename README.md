# BookStore Web Frontend

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) for the BookStore application frontend.

## Getting Started

### Local Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Docker Development

### 🐳 Available Docker Commands

| Comando | Descripción | Uso |
|---------|-------------|-----|
| `npm run docker:build` | Construye la imagen Docker sin ejecutar | Para preparar la imagen después de cambios en Dockerfile |
| `npm run docker:dev` | Ejecuta el contenedor en primer plano | Para desarrollo con logs visibles en consola |
| `npm run docker:dev:build` | Construye y ejecuta en primer plano | Para desarrollo forzando reconstrucción |
| `npm run docker:dev:detached` | Ejecuta el contenedor en segundo plano | Para desarrollo sin bloquear la terminal |
| `npm run docker:down` | Detiene y elimina contenedores | Para parar el desarrollo con Docker |
| `npm run docker:down:clean` | Detiene y limpia volúmenes/redes | Para reset completo del entorno |
| `npm run docker:logs` | Muestra logs del contenedor web | Para debug y monitoreo |
| `npm run docker:status` | Muestra estado de contenedores | Para verificar qué está ejecutándose |
| `npm run docker:restart` | Reinicia solo el contenedor web | Para aplicar cambios sin rebuild |
| `npm run docker:clean` | Limpieza completa de Docker | Para resolver problemas de red/espacio |
| `npm run docker:shell` | Accede al shell del contenedor | Para debug interno del contenedor |
| `npm run docker:exec:build` | Ejecuta build dentro del contenedor | Para probar build en entorno Docker |
| `npm run docker:exec:lint` | Ejecuta linting dentro del contenedor | Para verificar código en entorno Docker |

### 🚀 Flujos de Trabajo Comunes

**Desarrollo inicial:**
```bash
npm run docker:dev:build    # Primera vez o tras cambios mayores
```

**Desarrollo diario:**
```bash
npm run docker:dev:detached # Ejecutar en background
npm run docker:logs         # Ver logs cuando necesites
```

**Solución de problemas:**
```bash
npm run docker:clean        # Limpiar todo
npm run docker:dev:build    # Reconstruir desde cero
```

**Debug interno:**
```bash
npm run docker:shell        # Acceder al contenedor
npm run docker:exec:build   # Probar build interno
```

### 📋 Requisitos

- Docker y Docker Compose instalados
- Puerto 3001 disponible
- Variables de entorno configuradas (ver `.env.example`)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
