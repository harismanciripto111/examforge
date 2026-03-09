import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user?.email) redirect('/login')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Halo, {session.user?.name?.split(' ')[0]} \uD83D\uDC4B
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang di ExamForge!</p>
        </div>
        <Link href="/quiz" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
          Mulai Latihan
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg mb-4">Kategori Latihan</h2>
          <div className="space-y-3">
            <Link href="/quiz?category=teknik-kimia" className="block p-4 border rounded-lg hover:bg-indigo-50 transition">
              <div className="font-medium">Teknik Kimia</div>
              <div className="text-sm text-gray-500">Termodinamika, kinetika, transfer massa & panas</div>
            </Link>
            <Link href="/quiz?category=english" className="block p-4 border rounded-lg hover:bg-indigo-50 transition">
              <div className="font-medium">Bahasa Inggris</div>
              <div className="text-sm text-gray-500">Grammar, vocabulary, reading comprehension</div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="font-semibold text-lg mb-4">Statistik Kamu</h2>
          <p className="text-gray-400 text-sm">Mulai latihan untuk melihat statistik kamu di sini.</p>
        </div>
      </div>
    </div>
  )
}
