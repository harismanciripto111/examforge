import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const categorySlug = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '10')
  const where = categorySlug ? { category: { slug: categorySlug } } : {}
  const questions = await prisma.question.findMany({
    where,
    include: { category: true },
    take: limit,
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(questions)
}
