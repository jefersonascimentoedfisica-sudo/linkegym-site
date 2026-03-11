'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-client';

const GUARULHOS_NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
];

const SPECIALTIES = [
  'Musculação', 'Emagrecimento', 'Hipertrofia', 'Funcional',
  'Reabilitação', 'Nutrição Esportiva', 'Nutrição Clínica', 'Diabetes'
];

export default function SearchProfessionals() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    neighborhood: '',
    type: '',
  });

  useEffect(() => {
    searchProfessionals();
  }, []);

  const searchProfessionals = async () => {
    setLoading(true);
    try {
      let query = supabase.from('professionals').select('*');

      if (filters.type) {
        query = query.eq('professional_type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter by specialty and neighborhood on client side
      let filtered = data || [];
      
      if (filters.specialty) {
        filtered = filtered.filter((prof: any) => 
          prof.specialties && prof.specialties.includes(filters.specialty)
        );
      }
      
      if (filters.neighborhood) {
        filtered = filtered.filter((prof: any) => 
          prof.service_neighborhoods && prof.service_neighborhoods.includes(filters.neighborhood)
        );
      }
      
      setProfessionals(filtered);
    } catch (err: any) {
      console.error('Error searching professionals:', err);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    searchProfessionals();
  };

  const handleReset = () => {
    setFilters({ specialty: '', neighborhood: '', type: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Search Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Buscar Profissionais</h1>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Profissional</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Todos</option>
                  <option value="personal_trainer">💪 Personal Trainer</option>
                  <option value="nutritionist">🥗 Nutricionista</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Especialidade</label>
                <select
                  name="specialty"
                  value={filters.specialty}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Todas</option>
                  {SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro</label>
                <select
                  name="neighborhood"
                  value={filters.neighborhood}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Todos</option>
                  {GUARULHOS_NEIGHBORHOODS.map(neighborhood => (
                    <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Buscar
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600">Buscando profissionais...</p>
          </div>
        ) : professionals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">Nenhum profissional encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-8">
              {professionals.length} profissional{professionals.length !== 1 ? 's' : ''} encontrado{professionals.length !== 1 ? 's' : ''}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map(prof => (
                <div key={prof.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{prof.name}</h3>
                    <p className="text-blue-100 text-sm">
                      {prof.professional_type === 'personal_trainer' ? '💪 Personal Trainer' : '🥗 Nutricionista'}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {/* Bio */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {prof.bio}
                    </p>

                    {/* Experience */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Experiência:</span> {prof.years_experience} anos
                      </p>
                      {prof.average_rating && prof.average_rating > 0 && (
                        <p className="text-sm text-yellow-600 font-semibold">
                          ⭐ {prof.average_rating.toFixed(1)} ({prof.review_count || 0} avaliações)
                        </p>
                      )}
                    </div>

                    {/* Specialties */}
                    {prof.specialties && prof.specialties.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Especialidades:</p>
                        <div className="flex flex-wrap gap-2">
                          {prof.specialties.slice(0, 3).map((spec: string) => (
                            <span key={spec} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                          {prof.specialties.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              +{prof.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Service Neighborhoods */}
                    {prof.service_neighborhoods && prof.service_neighborhoods.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Bairros:</p>
                        <div className="flex flex-wrap gap-2">
                          {prof.service_neighborhoods.slice(0, 2).map((neighborhood: string) => (
                            <span key={neighborhood} className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                              📍 {neighborhood}
                            </span>
                          ))}
                          {prof.service_neighborhoods.length > 2 && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              +{prof.service_neighborhoods.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/professional/${prof.id}`}
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                      >
                        Ver Perfil
                      </Link>
                      {prof.whatsapp && (
                        <a
                          href={`https://wa.me/${prof.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-center transition"
                        >
                          💬 WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
