import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  const streak = await prisma.streak.findUnique({ where: { userId: user.id } })
  const totalAttempts = await prisma.quizAttempt.count({ where: { userId: user.id } })
  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.total) * 100, 0) / attempts.length)
    : 0
  return NextResponse.json({
    user: { name: user.name, email: user.email },
    streak: streak || { current: 0, longest: 0 },
    totalAttempts,
    avgScore,
    recentAttempts: attempts,
  })
}
