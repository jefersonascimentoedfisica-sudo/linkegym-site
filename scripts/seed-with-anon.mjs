import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tttypwipemjeacygljlz.supabase.co';
const supabaseKey = 'sb_publishable_NRFI9sVumNTJS689qtluWg_VlgTQ4mw';

const supabase = createClient(supabaseUrl, supabaseKey);

const professionals = [
  // Personal Trainers
  {
    name: 'Carlos Silva',
    professional_type: 'personal_trainer',
    email: 'carlos.silva@linkegym.com',
    phone: '11987654321',
    whatsapp: '11987654321',
    cref: '123456/SP',
    bio: 'Personal Trainer especializado em musculação e hipertrofia. 8 anos de experiência. Transforme seu corpo com treinos personalizados.',
    years_experience: 8,
    specialties: ['Musculação', 'Hipertrofia', 'Emagrecimento'],
    service_neighborhoods: ['Centro', 'Vila Galvão', 'Maia'],
    lesson_price: 120.00,
    rating: 4.8,
    review_count: 45,
  },
  {
    name: 'Ana Costa',
    professional_type: 'personal_trainer',
    email: 'ana.costa@linkegym.com',
    phone: '11988776655',
    whatsapp: '11988776655',
    cref: '234567/SP',
    bio: 'Personal Trainer focada em funcional e emagrecimento. Metodologia comprovada com resultados em 30 dias.',
    years_experience: 6,
    specialties: ['Funcional', 'Emagrecimento', 'Resistência'],
    service_neighborhoods: ['Picanço', 'Pimentas', 'Centro'],
    lesson_price: 100.00,
    rating: 4.9,
    review_count: 52,
  },
  {
    name: 'Rafael Mendes',
    professional_type: 'personal_trainer',
    email: 'rafael.mendes@linkegym.com',
    phone: '11989998877',
    whatsapp: '11989998877',
    cref: '345678/SP',
    bio: 'Especialista em treino de força e powerlifting. Atendo iniciantes e atletas avançados.',
    years_experience: 10,
    specialties: ['Força', 'Powerlifting', 'Musculação'],
    service_neighborhoods: ['Vila Galvão', 'Maia', 'Picanço'],
    lesson_price: 150.00,
    rating: 4.7,
    review_count: 38,
  },
  {
    name: 'Juliana Oliveira',
    professional_type: 'personal_trainer',
    email: 'juliana.oliveira@linkegym.com',
    phone: '11991112222',
    whatsapp: '11991112222',
    cref: '456789/SP',
    bio: 'Personal Trainer com foco em yoga, pilates e mobilidade. Ideal para recuperação e flexibilidade.',
    years_experience: 7,
    specialties: ['Yoga', 'Pilates', 'Mobilidade'],
    service_neighborhoods: ['Centro', 'Pimentas', 'Vila Galvão'],
    lesson_price: 110.00,
    rating: 4.9,
    review_count: 61,
  },
  {
    name: 'Bruno Ferreira',
    professional_type: 'personal_trainer',
    email: 'bruno.ferreira@linkegym.com',
    phone: '11992223333',
    whatsapp: '11992223333',
    cref: '567890/SP',
    bio: 'Treinador de atletas e preparador físico. Especializado em performance e condicionamento.',
    years_experience: 9,
    specialties: ['Performance', 'Condicionamento', 'Esportes'],
    service_neighborhoods: ['Maia', 'Picanço', 'Pimentas'],
    lesson_price: 140.00,
    rating: 4.8,
    review_count: 42,
  },

  // Nutricionistas
  {
    name: 'Dra. Mariana Santos',
    professional_type: 'nutritionist',
    email: 'mariana.santos@linkegym.com',
    phone: '11993334444',
    whatsapp: '11993334444',
    crn: '123456/SP',
    bio: 'Nutricionista clínica especializada em emagrecimento e nutrição esportiva. Consultório e atendimento online.',
    years_experience: 12,
    specialties: ['Emagrecimento', 'Nutrição Esportiva', 'Clínica'],
    service_neighborhoods: ['Centro', 'Vila Galvão', 'Maia', 'Picanço'],
    consultation_price: 180.00,
    service_type: 'ambos',
    rating: 4.9,
    review_count: 78,
  },
  {
    name: 'Dra. Fernanda Lima',
    professional_type: 'nutritionist',
    email: 'fernanda.lima@linkegym.com',
    phone: '11994445555',
    whatsapp: '11994445555',
    crn: '234567/SP',
    bio: 'Especialista em nutrição para atletas e performance. Atendimento presencial em Guarulhos.',
    years_experience: 8,
    specialties: ['Nutrição Esportiva', 'Performance', 'Suplementação'],
    service_neighborhoods: ['Vila Galvão', 'Maia', 'Pimentas'],
    consultation_price: 150.00,
    service_type: 'presencial',
    rating: 4.8,
    review_count: 55,
  },
  {
    name: 'Dra. Patricia Gomes',
    professional_type: 'nutritionist',
    email: 'patricia.gomes@linkegym.com',
    phone: '11995556666',
    whatsapp: '11995556666',
    crn: '345678/SP',
    bio: 'Nutricionista funcional com foco em saúde preventiva e bem-estar. Consultório moderno.',
    years_experience: 10,
    specialties: ['Nutrição Funcional', 'Bem-estar', 'Preventiva'],
    service_neighborhoods: ['Centro', 'Picanço', 'Pimentas'],
    consultation_price: 200.00,
    service_type: 'presencial',
    rating: 4.9,
    review_count: 89,
  },
  {
    name: 'Dra. Beatriz Costa',
    professional_type: 'nutritionist',
    email: 'beatriz.costa@linkegym.com',
    phone: '11996667777',
    whatsapp: '11996667777',
    crn: '456789/SP',
    bio: 'Nutricionista com especialização em transtornos alimentares e saúde mental. Atendimento online.',
    years_experience: 9,
    specialties: ['Transtornos Alimentares', 'Saúde Mental', 'Clínica'],
    service_neighborhoods: ['Centro', 'Vila Galvão'],
    consultation_price: 220.00,
    service_type: 'online',
    rating: 4.7,
    review_count: 43,
  },
  {
    name: 'Dra. Camila Rocha',
    professional_type: 'nutritionist',
    email: 'camila.rocha@linkegym.com',
    phone: '11997778888',
    whatsapp: '11997778888',
    crn: '567890/SP',
    bio: 'Nutricionista infantil e familiar. Especializada em educação alimentar para crianças.',
    years_experience: 7,
    specialties: ['Nutrição Infantil', 'Familiar', 'Educação Alimentar'],
    service_neighborhoods: ['Maia', 'Picanço', 'Pimentas', 'Centro'],
    consultation_price: 160.00,
    service_type: 'ambos',
    rating: 4.9,
    review_count: 67,
  },
];

async function seedProfessionals() {
  try {
    console.log('🌱 Iniciando seed de profissionais...');
    console.log(`Total de profissionais a inserir: ${professionals.length}`);

    const { data, error } = await supabase
      .from('professionals')
      .insert(professionals)
      .select();

    if (error) {
      console.error('❌ Erro ao inserir profissionais:', error);
      process.exit(1);
    }

    console.log(`✅ ${data.length} profissionais inseridos com sucesso!`);
    console.log('✨ Seed concluído!');
  } catch (err) {
    console.error('❌ Erro geral:', err);
    process.exit(1);
  }
}

seedProfessionals();
