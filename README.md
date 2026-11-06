# SAYYAM.AI Portfolio (Next.js + Express + MongoDB)
sayyam-portfolio/
  client/  Next.js 15 site (SEO, blog, articles, projects, certificates, reviews, /admin dashboard)
  server/  Express API + MongoDB (content, reviews, contact, JWT auth)
NOTE: the site shows all your built-in data (projects, certificates, skills, experience) even if the API is off. Run the API + seed to enable the dashboard, reviews, contact form and new posts.
## Run locally
1. server: cd server && cp .env.example .env (add MONGODB_URI) && npm i && npm run seed && npm start   (port 5000)
2. client: cd client && cp .env.example .env.local && npm i && npm run dev   (port 3000)
3. Dashboard: http://localhost:3000/admin  login: sayyam / Sayyam@2026!   (CHANGE in server/.env before deploying)
## Deploy
- Database: MongoDB Atlas (free cluster) -> copy connection string into MONGODB_URI.
- API: Render or Railway. Env: MONGODB_URI, JWT_SECRET, ADMIN_USER, ADMIN_PASS, CLIENT_URL=https://your-site.com
- Site: Vercel (root dir = client). Env: NEXT_PUBLIC_API_URL=https://your-api/api, NEXT_PUBLIC_SITE_URL=https://your-site.com
## Add content later
Open /admin: add blog posts, articles, projects, certificates (paste Coursera verify link), skills (title=category, tags=items), client success stories (testimonial), approve visitor reviews, read contact messages.
