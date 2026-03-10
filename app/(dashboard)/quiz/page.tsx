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
  explanation: string | null
}

interface QuizResult {
  score: number
  total: number
  results: Record<string, { correct: boolean; correctAnswer: string; explanation: string | null; userAnswer: string }>
  questions: Question[]
}

function QuizContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || ''
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    setQuestions([])
    fetch(`/api/questions?category=${category}&limit=10`)
      .then(r => r.json())
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
  }, [category, retryCount])

  async function handleSubmit() {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categorySlug: category, answers }),
    })
    const data = await res.json()
    setResult({
      score: data.score,
      total: data.total,
      results: data.results,
      questions: data.questions,
    })
    setSubmitted(true)
    setShowReview(false)
  }

  function handleRetry() {
    setSubmitted(false)
    setAnswers({})
    setResult(null)
    setShowReview(false)
    setRetryCount(c => c + 1)
  }

  if (!category) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Pilih kategori dari <Link href="/dashboard" className="text-indigo-600 hover:underline">dashboard</Link>.</p>
    </div>
  )

  if (loading) return <div className="text-center py-12"><p className="text-gray-500">Memuat soal...</p></div>

  if (submitted && result) return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow p-8 text-center mb-6">
        <div className="text-5xl mb-4">{result.score / result.total >= 0.7 ? '\u{1F3C6}' : '\u{1F4DA}'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hasil Latihan</h2>
        <p className="text-4xl font-bold text-indigo-600 mb-2">{result.score}/{result.total}</p>
        <p className="text-gray-500 mb-6">{Math.round((result.score / result.total) * 100)}% benar</p>

        {/* Summary pills */}
        <div className="flex gap-4 justify-center mb-6">
          <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            &#x2713; {result.score} Benar
          </span>
          <span className="px-4 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            &#x2717; {result.total - result.score} Salah
          </span>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowReview(r => !r)}
            className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            {showReview ? 'Sembunyikan Review' : 'Lihat Review Jawaban'}
          </button>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Coba Lagi
          </button>
          <Link href="/dashboard" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Review Section */}
      {showReview && result.questions && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Review Jawaban</h3>
          {result.questions.map((q, i) => {
            const r = result.results[q.id]
            const isCorrect = r?.correct
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl p-6 shadow border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <span className={`text-sm font-bold px-2 py-0.5 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isCorrect ? '\u2713 Benar' : '\u2717 Salah'}
                  </span>
                  <p className="font-medium text-gray-900">{i + 1}. {q.text}</p>
                </div>

                <div className="space-y-1 mb-3">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => {
                    const optVal = q[`option${opt}` as keyof typeof q] as string
                    const isUserAnswer = r?.userAnswer === opt
                    const isCorrectAnswer = q.answer === opt
                    let cls = 'p-2 rounded text-sm '
                    if (isCorrectAnswer) cls += 'bg-green-100 text-green-800 font-medium'
                    else if (isUserAnswer && !isCorrectAnswer) cls += 'bg-red-100 text-red-800'
                    else cls += 'text-gray-600'
                    return (
                      <div key={opt} className={cls}>
                        {opt}. {optVal}
                        {isCorrectAnswer && <span className="ml-2 text-xs">(Jawaban Benar)</span>}
                        {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-xs">(Jawaban Kamu)</span>}
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800"><span className="font-semibold">Penjelasan:</span> {q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
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
          <div key={q.id} className="bg-white rounded-xl p-6 shadow">
            <p className="font-medium mb-4">{i + 1}. {q.text}</p>
            <div className="space-y-2">
              {(['A', 'B', 'C', 'D', 'E'] as const).map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    answers[q.id] === opt
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {opt}. {q[`option${opt}` as keyof typeof q]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 mb-12">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
        >
          Kumpulkan Jawaban ({Object.keys(answers).length}/{questions.length})
        </button>
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="text-center py-12"><p>Memuat...</p></div>}>
      <QuizContent />
    </Suspense>
  )
}
