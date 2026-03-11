'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase-client'

const GUARULHOS_NEIGHBORHOODS = [
  'Centro', 'Vila Galvão', 'Maia', 'Picanço', 'Bonsucesso',
  'Cumbica', 'Taboão', 'Cocaia', 'Pimentas', 'São João',
  'Jardim Adriana', 'Gopoúva', 'Vila Augusta', 'Vila Rio',
  'Jardim Tranquilidade', 'Parque Cecap', 'Jardim São Paulo',
  'Vila Endres', 'Jardim Santa Mena', 'Parque Continental'
]

const SPECIALTIES_PT = [
  'Musculação', 'Hipertrofia', 'Emagrecimento', 'Funcional',
  'Yoga', 'Pilates', 'Mobilidade', 'Força', 'Powerlifting',
  'Resistência', 'Performance', 'Condicionamento', 'Esportes'
]

const SPECIALTIES_NUTRITIONIST = [
  'Emagrecimento', 'Nutrição Esportiva', 'Clínica', 'Funcional',
  'Bem-estar', 'Preventiva', 'Transtornos Alimentares', 'Saúde Mental',
  'Nutrição Infantil', 'Familiar', 'Educação Alimentar', 'Suplementação'
]

const SERVICE_LOCATIONS = [
  'Domicílio',
  'Academia',
  'Condomínio',
  'Online'
]

export default function RegisterProfessional() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    // Basic
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    professional_type: 'personal_trainer',
    profile_image_url: '',

    // Professional
    cref: '',
    crn: '',
    years_experience: '',
    bio: '',
    specialties: [] as string[],

    // Service
    service_type: 'ambos',
    service_neighborhoods: [] as string[],
    service_locations: [] as string[],

    // Personal Trainer Options
    offers_fixed_personal: false,
    offers_single_class: false,
    fixed_personal_price: '',
    single_class_price: '',

    // Values
    lesson_price: '',
    consultation_price: '',

    // Social
    instagram: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
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
      service_neighborhoods: prev.service_neighborhoods.includes(neighborhood)
        ? prev.service_neighborhoods.filter(n => n !== neighborhood)
        : [...prev.service_neighborhoods, neighborhood]
    }))
  }

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      service_locations: prev.service_locations.includes(location)
        ? prev.service_locations.filter(l => l !== location)
        : [...prev.service_locations, location]
    }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('professionals')
        .upload(fileName, file)

      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from('professionals')
        .getPublicUrl(fileName)

      setFormData(prev => ({ ...prev, profile_image_url: publicUrl.publicUrl }))
      setError(null)
    } catch (err: any) {
      setError(`Erro ao fazer upload da foto: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.whatsapp) {
          setError('Preencha todos os campos obrigatórios')
          return false
        }
        if (!formData.email.includes('@')) {
          setError('Email inválido')
          return false
        }
        return true
      case 2:
        if (formData.professional_type === 'personal_trainer' && !formData.cref) {
          setError('CREF é obrigatório para Personal Trainers')
          return false
        }
        if (formData.professional_type === 'nutritionist' && !formData.crn) {
          setError('CRN é obrigatório para Nutricionistas')
          return false
        }
        if (!formData.years_experience || !formData.bio || formData.specialties.length === 0) {
          setError('Preencha todos os campos obrigatórios')
          return false
        }
        return true
      case 3:
        if (formData.service_neighborhoods.length === 0) {
          setError('Selecione pelo menos um bairro')
          return false
        }
        // For Personal Trainers
        if (formData.professional_type === 'personal_trainer') {
          if (!formData.offers_fixed_personal && !formData.offers_single_class) {
            setError('Selecione pelo menos um tipo de serviço (Personal Fixo ou Aula Avulsa)')
            return false
          }
          if (formData.offers_single_class && !formData.single_class_price) {
            setError('Preço da aula avulsa é obrigatório')
            return false
          }
          if (formData.offers_fixed_personal && !formData.fixed_personal_price) {
            setError('Preço do personal fixo é obrigatório')
            return false
          }
        }
        // For Nutritionists
        if (formData.professional_type === 'nutritionist' && !formData.consultation_price) {
          setError('Preço da consulta é obrigatório')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNextStep = () => {
    setError(null)
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateStep(3)) return

    try {
      setLoading(true)

      const professionalData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        professional_type: formData.professional_type,
        profile_image_url: formData.profile_image_url,
        cref: formData.professional_type === 'personal_trainer' ? formData.cref : null,
        crn: formData.professional_type === 'nutritionist' ? formData.crn : null,
        years_experience: parseInt(formData.years_experience),
        bio: formData.bio,
        specialties: formData.specialties,
        service_type: formData.service_type,
        service_neighborhoods: formData.service_neighborhoods,
        service_locations: formData.service_locations,
        offers_fixed_personal: formData.professional_type === 'personal_trainer' ? formData.offers_fixed_personal : false,
        offers_single_class: formData.professional_type === 'personal_trainer' ? formData.offers_single_class : false,
        fixed_personal_price: formData.professional_type === 'personal_trainer' && formData.offers_fixed_personal ? parseFloat(formData.fixed_personal_price) : null,
        single_class_price: formData.professional_type === 'personal_trainer' && formData.offers_single_class ? parseFloat(formData.single_class_price) : null,
        lesson_price: formData.professional_type === 'personal_trainer' ? parseFloat(formData.single_class_price || '0') : null,
        consultation_price: formData.professional_type === 'nutritionist' ? parseFloat(formData.consultation_price) : null,
        instagram: formData.instagram,
        rating: 0,
        review_count: 0,
      }

      const { data, error } = await supabase
        .from('professionals')
        .insert([professionalData])
        .select()

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push(`/professional/${data[0].id}`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar profissional')
    } finally {
      setLoading(false)
    }
  }

  const isPT = formData.professional_type === 'personal_trainer'
  const specialties = isPT ? SPECIALTIES_PT : SPECIALTIES_NUTRITIONIST

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LinkeGym
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Voltar
          </Link>
        </div>
      </nav>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-4">
          <p className="font-bold">✅ Cadastro realizado com sucesso!</p>
          <p>Redirecionando para seu perfil...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 className="text-3xl font-bold">Cadastro de Profissional</h1>
            <p className="text-blue-100 mt-2">Passo {currentStep} de 3</p>
            <div className="mt-4 bg-blue-400 h-2 rounded-full w-full">
              <div 
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4">
              <p className="font-bold">✕ Erro</p>
              <p>{error}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dados Básicos</h2>

                {/* Professional Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de Profissional <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, professional_type: 'personal_trainer' }))}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                        formData.professional_type === 'personal_trainer'
                          ? 'bg-blue-600 text-white border-2 border-blue-600'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}
                    >
                      💪 Personal Trainer
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, professional_type: 'nutritionist' }))}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                        formData.professional_type === 'nutritionist'
                          ? 'bg-blue-600 text-white border-2 border-blue-600'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                      }`}
                    >
                      🥗 Nutricionista
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Foto de Perfil
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-500 transition"
                  >
                    📷 Escolher Foto
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {formData.profile_image_url && (
                    <p className="mt-2 text-sm text-green-600">✓ Foto selecionada</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Informações Profissionais</h2>

                {/* CREF/CRN */}
                {isPT ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CREF <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cref"
                      placeholder="Ex: 123456/SP"
                      value={formData.cref}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      CRN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="crn"
                      placeholder="Ex: 123456/SP"
                      value={formData.crn}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Anos de Experiência <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="years_experience"
                    placeholder="Ex: 5"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biografia <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="bio"
                    placeholder="Conte um pouco sobre você e sua experiência..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Especialidades <span className="text-red-500">*</span> (selecione pelo menos uma)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialties.map(specialty => (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => handleSpecialtyToggle(specialty)}
                        className={`py-2 px-3 rounded-lg font-semibold transition ${
                          formData.specialties.includes(specialty)
                            ? 'bg-blue-600 text-white border-2 border-blue-600'
                            : 'bg-yellow-100 text-gray-700 border-2 border-yellow-300'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Serviços e Valores</h2>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tipo de Atendimento <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {SERVICE_LOCATIONS.map(location => (
                      <button
                        key={location}
                        type="button"
                        onClick={() => handleLocationToggle(location)}
                        className={`py-2 px-4 rounded-lg font-semibold transition ${
                          formData.service_locations.includes(location)
                            ? 'bg-blue-600 text-white border-2 border-blue-600'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Neighborhoods */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bairros Atendidos <span className="text-red-500">*</span> (selecione pelo menos um)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {GUARULHOS_NEIGHBORHOODS.map(neighborhood => (
                      <button
                        key={neighborhood}
                        type="button"
                        onClick={() => handleNeighborhoodToggle(neighborhood)}
                        className={`py-2 px-3 rounded-lg font-semibold transition ${
                          formData.service_neighborhoods.includes(neighborhood)
                            ? 'bg-blue-600 text-white border-2 border-blue-600'
                            : 'bg-yellow-100 text-gray-700 border-2 border-yellow-300'
                        }`}
                      >
                        {neighborhood}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Trainer Options */}
                {isPT && (
                  <>
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Tipos de Serviço</h3>

                      {/* Offers Fixed Personal */}
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="offers_fixed_personal"
                            checked={formData.offers_fixed_personal}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="ml-3 font-semibold text-gray-900">
                            💪 Ofereço Personal Fixo (Acompanhamento Contínuo)
                          </span>
                        </label>
                        {formData.offers_fixed_personal && (
                          <div className="mt-3 ml-7">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Valor Mensal <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="fixed_personal_price"
                              placeholder="Ex: 500.00 ou 'sob consulta'"
                              value={formData.fixed_personal_price}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Offers Single Class */}
                      <div className="p-4 bg-green-50 rounded-lg">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="offers_single_class"
                            checked={formData.offers_single_class}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="ml-3 font-semibold text-gray-900">
                            🎯 Ofereço Aula Avulsa
                          </span>
                        </label>
                        {formData.offers_single_class && (
                          <div className="mt-3 ml-7">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Preço da Aula <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="single_class_price"
                              placeholder="Ex: 120.00"
                              value={formData.single_class_price}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Consultation Price for Nutritionists */}
                {!isPT && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preço da Consulta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="consultation_price"
                      placeholder="Ex: 180.00"
                      value={formData.consultation_price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram (opcional)
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    placeholder="@seu_instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 px-4 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  ← Anterior
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Próximo →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : '✓ Finalizar Cadastro'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
