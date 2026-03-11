'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Bem-vindo!</h1>
        <p className="text-gray-600 mb-8">Email: {user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/search" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">🔍 Buscar Profissionais</h2>
            <p className="text-gray-600">Encontre personal trainers e nutricionistas</p>
          </Link>

          <Link href="/register/professional" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">📝 Cadastro Profissional</h2>
            <p className="text-gray-600">Crie seu perfil como profissional</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
