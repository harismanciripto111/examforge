import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'

interface DashboardData {
  streak: { current: number; longest: number }
  totalAttempts: number
  avgScore: number
  recentAttempts: Array<{
    id: string
    score: number
    total: number
    createdAt: string
    categoryId: string
  }>
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const headersList = await headers()
    const host = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const res = await fetch(`${protocol}://${host}/api/dashboard`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login')

  const data = await getDashboardData()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Halo, {session.user?.name?.split(' ')[0]} \u{1F44B}
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang di ExamForge!</p>
        </div>
        <Link
          href="/quiz"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Mulai Latihan
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow text-center">
          <p className="text-3xl font-bold text-indigo-600">{data?.totalAttempts ?? 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Latihan</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow text-center">
          <p className="text-3xl font-bold text-indigo-600">{data?.avgScore ?? 0}%</p>
          <p className="text-sm text-gray-500 mt-1">Rata-rata Skor</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow text-center">
          <p className="text-3xl font-bold text-indigo-600">{data?.streak?.current ?? 0} \u{1F525}</p>
          <p className="text-sm text-gray-500 mt-1">Streak Hari Ini</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kategori */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg mb-4">Kategori Latihan</h2>
          <div className="space-y-3">
            <Link
              href="/quiz?category=teknik-kimia"
              className="block p-4 border rounded-lg hover:bg-indigo-50 transition"
            >
              <div className="font-medium">Teknik Kimia</div>
              <div className="text-sm text-gray-500">Termodinamika, kinetika, transfer massa &amp; panas</div>
            </Link>
            <Link
              href="/quiz?category=english"
              className="block p-4 border rounded-lg hover:bg-indigo-50 transition"
            >
              <div className="font-medium">Bahasa Inggris</div>
              <div className="text-sm text-gray-500">Grammar, vocabulary, reading comprehension</div>
            </Link>
          </div>
        </div>

        {/* Riwayat Latihan */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg mb-4">Riwayat Latihan</h2>
          {!data || data.recentAttempts.length === 0 ? (
            <p className="text-gray-400 text-sm">Belum ada latihan. Mulai sekarang!</p>
          ) : (
            <div className="space-y-2">
              {data.recentAttempts.slice(0, 5).map((attempt, i) => {
                const pct = Math.round((attempt.score / attempt.total) * 100)
                return (
                  <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">
                      Latihan #{data.recentAttempts.length - i}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{attempt.score}/{attempt.total} soal</span>
                      <span className={`text-sm font-semibold px-2 py-0.5 rounded ${pct >= 70 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                )
              })}
              {data.streak.longest > 0 && (
                <p className="text-xs text-gray-400 mt-2">Streak terpanjang: {data.streak.longest} hari \u{1F3C6}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
