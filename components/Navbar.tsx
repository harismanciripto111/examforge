'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-indigo-700">ExamForge</Link>
        <div className="flex items-center gap-4">
          {session?.user?.name && <span className="text-sm text-gray-600">Halo, {session.user.name}</span>}
          <button onClick={() => signOut({ callbackUrl: '/' })} className="text-sm text-red-500 hover:text-red-700 transition">Keluar</button>
        </div>
      </div>
    </nav>
  )
}
