'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';

const GUARULHOS_NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
]

const SPECIALTIES_PT = [
  'Musculação', 'Emagrecimento', 'Hipertrofia', 'Funcional',
  'Reabilitação', 'Nutrição Esportiva', 'Nutrição Clínica', 'Diabetes'
]

export default function ProfessionalRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal_trainer',
    bio: '',
    specialties: [] as string[],
    yearsExperience: '',
    registrationNumber: '',
    registrationState: 'SP',
    residenceNeighborhood: '',
    serviceNeighborhoods: [] as string[],
    whatsapp: '',
    instagram: '',
  })

  const [step, setStep] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleNeighborhoodToggle = (neighborhood: string) => {
    setFormData(prev => ({
      ...prev,
      serviceNeighborhoods: prev.serviceNeighborhoods.includes(neighborhood)
        ? prev.serviceNeighborhoods.filter(n => n !== neighborhood)
        : [...prev.serviceNeighborhoods, neighborhood]
    }))
  }

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      setError('');
      setLoading(true);
      try {
        const { data, error: signUpError } = await signUp(formData.email, formData.phone, {
          name: formData.name,
          user_type: 'professional',
          professional_type: formData.type,
        });

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        if (data?.user) {
          const { error: dbError } = await supabase
            .from('professionals')
            .insert([{
              id: data.user.id,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              whatsapp: formData.whatsapp,
              instagram: formData.instagram,
              professional_type: formData.type,
              bio: formData.bio,
              years_experience: parseInt(formData.yearsExperience),
              registration_number: formData.registrationNumber,
              registration_state: formData.registrationState,
              residence_neighborhood: formData.residenceNeighborhood,
              specialties: formData.specialties,
              service_neighborhoods: formData.serviceNeighborhoods,
              verified: false,
            }]);

          if (dbError) {
            setError(dbError.message);
            setLoading(false);
            return;
          }
        }

        alert('Cadastro enviado com sucesso! Aguarde a validação do seu registro profissional.');
        router.push('/');
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Profissional</h1>
          <p className="text-gray-600 mb-4">
            Passo {step} de 3
          </p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-gray-300'}`}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Personal Data */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telefone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp *</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="@seu_instagram"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bairro de Residência *</label>
                    <select
                      name="residenceNeighborhood"
                      value={formData.residenceNeighborhood}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Selecione um bairro...</option>
                      {GUARULHOS_NEIGHBORHOODS.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Profissional *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="personal_trainer">💪 Personal Trainer</option>
                      <option value="nutritionist">🥗 Nutricionista</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Data */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dados Profissionais</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / Descrição Profissional *</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Descreva sua experiência e especialidades..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Anos de Experiência *</label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {formData.type === 'personal_trainer' ? 'Número do CREF' : 'Número do CRN'} *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="123456"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Especialidades *</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {SPECIALTIES_PT.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleSpecialtyToggle(spec)}
                        className={`p-3 rounded-lg border-2 font-medium transition text-left ${
                          formData.specialties.includes(spec)
                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {formData.specialties.includes(spec) ? '✓ ' : ''}{spec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Service Areas */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Bairros de Atendimento</h2>
                <p className="text-gray-600">Selecione os bairros onde você atende presencialmente</p>

                <div className="grid md:grid-cols-2 gap-3">
                  {GUARULHOS_NEIGHBORHOODS.map(neighborhood => (
                    <button
                      key={neighborhood}
                      type="button"
                      onClick={() => handleNeighborhoodToggle(neighborhood)}
                      className={`p-3 rounded-lg border-2 font-medium transition text-left ${
                        formData.serviceNeighborhoods.includes(neighborhood)
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {formData.serviceNeighborhoods.includes(neighborhood) ? '✓ ' : ''}{neighborhood}
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>ℹ️ Nota:</strong> Você poderá definir a prioridade de atendimento para cada bairro após o cadastro ser aprovado.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition"
                >
                  ← Voltar
                </button>
              )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg transition mt-6"
            >
              {loading ? 'Enviando...' : step === 3 ? 'Enviar Cadastro' : 'Próximo'}
            </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
