'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { getErrorMessage } from '@/lib/client-utils';
import type { Professional } from '@/lib/domain-types';

const GUARULHOS_NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
];

export default function ProfessionalDashboard() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Professional>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfessional();
  }, [user, router]);

  const loadProfessional = async () => {
    try {
      const { data, error: err } = await supabase
        .from('professionals')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (err) throw err;
      const professionalRow = data as Professional;
      setProfessional(professionalRow);
      setFormData(professionalRow);
      setLoading(false);
    } catch (err: unknown) {
      console.error('Error loading professional:', err);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const { error: err } = await supabase
        .from('professionals')
        .update({
          whatsapp: formData.whatsapp,
          instagram: formData.instagram,
          bio: formData.bio,
        })
        .eq('id', user?.id);

      if (err) throw err;
      setProfessional(prev => prev ? { ...prev, ...formData } : prev);
      setEditing(false);
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao salvar perfil'));
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
            <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700">Sair</button>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 mb-4">Perfil não encontrado</p>
          <Link href="/register/professional" className="text-blue-600 hover:text-blue-700 font-semibold">
            Criar perfil profissional
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <button onClick={handleLogout} className="text-blue-600 hover:text-blue-700 font-medium">
            Sair
          </button>
        </div>
      </nav>

      {/* Dashboard */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard Profissional</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Informações Profissionais</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Editar
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData(professional);
                      }}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                  <p className="text-gray-900 font-medium">{professional.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900 font-medium">{professional.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Profissional</label>
                  <p className="text-gray-900 font-medium">
                    {professional.professional_type === 'personal_trainer' ? '💪 Personal Trainer' : '🥗 Nutricionista'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {professional.professional_type === 'personal_trainer' ? 'CREF' : 'CRN'}
                  </label>
                  <p className="text-gray-900 font-medium">{professional.registration_number}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Anos de Experiência</label>
                  <p className="text-gray-900 font-medium">{professional.years_experience} anos</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição Profissional</label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  ) : (
                    <p className="text-gray-900">{professional.bio}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                    {editing ? (
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : professional.whatsapp ? (
                      <a
                        href={`https://wa.me/${professional.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {professional.whatsapp}
                      </a>
                    ) : (
                      <p className="text-gray-500">Não informado</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                    {editing ? (
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    ) : professional.instagram ? (
                      <a
                        href={`https://instagram.com/${professional.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {professional.instagram}
                      </a>
                    ) : (
                      <p className="text-gray-500">Não informado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div>
            {/* Specialties */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Especialidades</h3>
              <div className="space-y-2">
                {professional.specialties && professional.specialties.length > 0 ? (
                  professional.specialties.map((spec: string) => (
                    <div key={spec} className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                      ✓ {spec}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Nenhuma especialidade cadastrada</p>
                )}
              </div>
            </div>

            {/* Service Neighborhoods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bairros de Atendimento</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {professional.service_neighborhoods && professional.service_neighborhoods.length > 0 ? (
                  professional.service_neighborhoods.map((neighborhood: string) => (
                    <div key={neighborhood} className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium">
                      📍 {neighborhood}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-sm">Nenhum bairro cadastrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
