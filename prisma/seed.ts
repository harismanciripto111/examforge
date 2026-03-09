import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed categories
  const kimia = await prisma.category.upsert({
    where: { slug: 'teknik-kimia' },
    update: {},
    create: {
      name: 'Teknik Kimia',
      slug: 'teknik-kimia',
      description: 'Soal seleksi masuk Teknik Kimia'
    }
  })

  const english = await prisma.category.upsert({
    where: { slug: 'english' },
    update: {},
    create: {
      name: 'English',
      slug: 'english',
      description: 'Soal Bahasa Inggris untuk seleksi masuk'
    }
  })

  // Demo user
  const hashedPw = await bcrypt.hash('demo123', 10)
  await prisma.user.upsert({
    where: { email: 'demo@examforge.id' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@examforge.id',
      password: hashedPw
    }
  })

  // ---- TEKNIK KIMIA QUESTIONS ----
  const kimiaQuestions = [
    {
      text: 'Hukum pertama termodinamika menyatakan bahwa...',
      optionA: 'Energi tidak dapat diciptakan atau dimusnahkan',
      optionB: 'Entropi sistem terisolasi selalu meningkat',
      optionC: 'Panas mengalir dari benda panas ke dingin',
      optionD: 'Tekanan berbanding terbalik dengan volume',
      optionE: 'Semua jawaban salah',
      answer: 'A',
      explanation: 'Hukum pertama termodinamika adalah hukum kekekalan energi.',
      difficulty: 'easy'
    },
    {
      text: 'Pada proses isobarik, variabel yang konstan adalah...',
      optionA: 'Suhu',
      optionB: 'Tekanan',
      optionC: 'Volume',
      optionD: 'Entropi',
      optionE: 'Entalpi',
      answer: 'B',
      explanation: 'Isobarik = tekanan konstan.',
      difficulty: 'easy'
    },
    {
      text: 'Persamaan Arrhenius digunakan untuk menghitung...',
      optionA: 'Konstanta kesetimbangan',
      optionB: 'Konstanta laju reaksi terhadap suhu',
      optionC: 'Entalpi pembentukan',
      optionD: 'Kapasitas panas',
      optionE: 'Tekanan uap',
      answer: 'B',
      explanation: 'k = A·exp(-Ea/RT), menggambarkan pengaruh suhu terhadap laju reaksi.',
      difficulty: 'medium'
    },
    {
      text: 'Bilangan Reynolds (Re) digunakan untuk menentukan...',
      optionA: 'Tegangan permukaan fluida',
      optionB: 'Viskositas dinamis',
      optionC: 'Jenis aliran fluida (laminar/turbulen)',
      optionD: 'Kapasitas panas fluida',
      optionE: 'Densitas fluida',
      answer: 'C',
      explanation: 'Re < 2100 = laminar, Re > 4000 = turbulen.',
      difficulty: 'medium'
    },
    {
      text: 'Distilasi fraksionasi memanfaatkan perbedaan...',
      optionA: 'Kelarutan',
      optionB: 'Densitas',
      optionC: 'Titik didih',
      optionD: 'Titik lebur',
      optionE: 'Viskositas',
      answer: 'C',
      explanation: 'Distilasi memisahkan komponen berdasarkan perbedaan titik didih.',
      difficulty: 'easy'
    }
  ]

  for (const q of kimiaQuestions) {
    await prisma.question.create({
      data: { categoryId: kimia.id, ...q }
    })
  }

  // ---- ENGLISH QUESTIONS ----
  const englishQuestions = [
    {
      text: 'Choose the correct sentence:',
      optionA: 'She go to school every day.',
      optionB: 'She goes to school every day.',
      optionC: 'She going to school every day.',
      optionD: 'She gone to school every day.',
      optionE: 'She goed to school every day.',
      answer: 'B',
      explanation: 'Third person singular uses -s/es for simple present tense.',
      difficulty: 'easy'
    },
    {
      text: 'The word "benevolent" most nearly means...',
      optionA: 'Hostile',
      optionB: 'Indifferent',
      optionC: 'Generous',
      optionD: 'Cautious',
      optionE: 'Strict',
      answer: 'C',
      explanation: 'Benevolent means well-meaning and generous.',
      difficulty: 'medium'
    },
    {
      text: 'She has been working here _____ 2019.',
      optionA: 'for',
      optionB: 'since',
      optionC: 'during',
      optionD: 'from',
      optionE: 'until',
      answer: 'B',
      explanation: '"Since" is used with a specific point in time.',
      difficulty: 'easy'
    }
  ]

  for (const q of englishQuestions) {
    await prisma.question.create({
      data: { categoryId: english.id, ...q }
    })
  }

  console.log('Seed completed!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
