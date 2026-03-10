# ExamForge

Platform latihan soal seleksi masuk perguruan tinggi — fokus Teknik Kimia & Bahasa Inggris.

Built with **Next.js 15**, **TypeScript**, **Prisma 6**, **PostgreSQL**, **NextAuth v4**, dan **TailwindCSS**.

---

## Fitur

- Autentikasi (register & login) dengan NextAuth + bcrypt
- Dashboard statistik: total latihan, rata-rata skor, streak harian
- Latihan soal per kategori (Teknik Kimia / Bahasa Inggris)
- Soal diacak setiap sesi
- Review jawaban lengkap: mana yang benar/salah + penjelasan
- Sistem streak harian otomatis
- Riwayat 10 latihan terakhir

---

## Prasyarat

- Node.js >= 18
- PostgreSQL (local atau cloud, misal Supabase / Neon)
- Docker & Docker Compose (opsional)

---

## Setup Lokal

### 1. Clone repo

```bash
git clone https://github.com/harismanciripto111/examforge.git
cd examforge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Konfigurasi environment

```bash
cp env.example .env
```

Edit `.env` dan isi:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/examforge"
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Setup database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Setup dengan Docker

```bash
cp env.example .env
# Edit .env sesuai kebutuhan

docker-compose up --build
```

Aplikasi berjalan di `http://localhost:55555`.

---

## Struktur Proyek

```
examforge/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # Dashboard & Quiz pages
│   ├── api/             # API routes (auth, questions, quiz, dashboard, streak)
│   └── layout.tsx
├── components/          # Navbar
├── lib/                 # Prisma singleton
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data soal
└── middleware.ts        # Route protection
```

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/register` | Register user baru |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |
| GET | `/api/questions?category=&limit=` | Ambil soal (diacak) |
| POST | `/api/quiz/submit` | Submit jawaban quiz |
| GET | `/api/dashboard` | Statistik user |
| GET | `/api/streak` | Data streak |

---

## Database Schema

- **User** — akun pengguna
- **Category** — kategori soal (teknik-kimia, english)
- **Question** — soal dengan 5 pilihan (A-E), jawaban, dan penjelasan
- **QuizAttempt** — riwayat latihan per user
- **Streak** — streak harian per user

---

## Deploy

### Vercel + Neon/Supabase

1. Push repo ke GitHub
2. Import ke [vercel.com](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Jalankan migration: `npx prisma migrate deploy`

### Railway

1. Connect repo di [railway.app](https://railway.app)
2. Tambah PostgreSQL plugin
3. Set `DATABASE_URL` dari plugin
4. Deploy otomatis dari main branch

---

## Kontribusi

Pull request welcome. Untuk perubahan besar, buka issue dulu untuk diskusi.
