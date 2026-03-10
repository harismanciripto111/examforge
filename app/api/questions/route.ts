import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '10')

  const where = categorySlug ? { category: { slug: categorySlug } } : {}

  // Ambil lebih banyak lalu acak, sehingga setiap sesi berbeda
  const questions = await prisma.question.findMany({
    where,
    include: { category: true },
    take: limit * 3, // ambil 3x lebih banyak untuk pool
  })

  const shuffled = shuffle(questions).slice(0, limit)
  return NextResponse.json(shuffled)
}
