'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  optionE: string
  answer: string
  categoryId: string
}

function QuizContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || ''
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return
    fetch(`/api/questions?category=${category}&limit=10`)
      .then(r => r.json())
      .then(data => { setQuestions(data); setLoading(false) })
  }, [category])

  async function handleSubmit() {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorySlug: category, answers }),
    })
    const data = await res.json()
    setResult({ score: data.score, total: data.total })
    setSubmitted(true)
  }

  if (!category) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Pilih kategori dari <Link href="/dashboard" className="text-indigo-600 hover:underline">dashboard</Link>.</p>
    </div>
  )

  if (loading) return <div className="text-center py-12"><p className="text-gray-500">Memuat soal...</p></div>

  if (submitted && result) return (
    <div className="max-w-xl mx-auto text-center py-12">
      <div className="bg-white rounded-2xl shadow p-8">
        <div className="text-5xl mb-4">{result.score / result.total >= 0.7 ? '\u{1F3C6}' : '\u{1F4DA}'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hasil Latihan</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-2">{result.score}/{result.total}</p>
        <p className="text-gray-500 mb-6">{Math.round((result.score / result.total) * 100)}% benar</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setAnswers({}); setLoading(true); }} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Coba Lagi
          </button>
          <Link href="/dashboard" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Dashboard</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Latihan Soal</h1>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">Kembali</Link>
      </div>
      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl shadow p-6">
            <p className="font-medium text-gray-900 mb-4">{i + 1}. {q.text}</p>
            <div className="space-y-2">
              {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => {
                const text = q[`option${opt}` as keyof Question] as string
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition ${
                      answers[q.id] === opt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}. {text}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Kumpulkan Jawaban
        </button>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center py-12"><p className="text-gray-500">Memuat...</p></div>}>
      <QuizContent />
    </Suspense>
  )
}
