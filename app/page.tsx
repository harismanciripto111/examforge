import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-6">
        <h1 className="text-5xl font-bold text-indigo-700 mb-4">ExamForge</h1>
        <p className="text-xl text-gray-600 mb-8">
          Platform latihan soal seleksi masuk perguruan tinggi.
          Kuasai Teknik Kimia dan Bahasa Inggris dengan soal berkualitas.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
          >
            Daftar
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl mb-2">⚗️</div>
            <h3 className="font-semibold text-lg">Teknik Kimia</h3>
            <p className="text-gray-500 text-sm mt-1">Termodinamika, kinetika, transfer massa &amp; panas</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <div className="text-3xl mb-2">🌏</div>
            <h3 className="font-semibold text-lg">Bahasa Inggris</h3>
            <p className="text-gray-500 text-sm mt-1">Grammar, vocabulary, reading comprehension</p>
          </div>
        </div>
      </div>
    </main>
  )
}
