import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function POST(req: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { categorySlug, answers } = await req.json()
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  const questionIds = Object.keys(answers)
  const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } })
  let score = 0
  const results: Record<string, { correct: boolean; correctAnswer: string }> = {}
  for (const q of questions) {
    const isCorrect = answers[q.id] === q.answer
    if (isCorrect) score++
    results[q.id] = { correct: isCorrect, correctAnswer: q.answer }
  }
  const attempt = await prisma.quizAttempt.create({
    data: { userId: user.id, categoryId: category.id, score, total: questions.length, answers },
  })
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const streak = await prisma.streak.findUnique({ where: { userId: user.id } })
  if (!streak) {
    await prisma.streak.create({ data: { userId: user.id, current: 1, longest: 1, lastDate: today } })
  } else {
    const last = streak.lastDate ? new Date(streak.lastDate) : null
    last?.setHours(0, 0, 0, 0)
    const diffDays = last ? Math.floor((today.getTime() - last.getTime()) / 86400000) : 999
    const newCurrent = diffDays === 1 ? streak.current + 1 : diffDays === 0 ? streak.current : 1
    await prisma.streak.update({
      where: { userId: user.id },
      data: { current: newCurrent, longest: Math.max(newCurrent, streak.longest), lastDate: today },
    })
  }
  return NextResponse.json({ attemptId: attempt.id, score, total: questions.length, results })
}
