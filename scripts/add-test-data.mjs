import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestData() {
  try {
    console.log('Adding test professionals...');

    // Add test professional 1
    const { data: prof1, error: err1 } = await supabase
      .from('professionals')
      .insert([
        {
          name: 'Carlos Silva',
          professional_type: 'personal_trainer',
          email: 'carlos@example.com',
          phone: '11999999999',
          whatsapp: '11999999999',
          instagram: '@carlossilva_pt',
          bio: 'Personal trainer com 10 anos de experiência em musculação e emagrecimento. Especializado em transformação corporal.',
          years_experience: 10,
          cref: '123456/SP',
          specialties: ['Musculação', 'Emagrecimento', 'Hipertrofia'],
          service_neighborhoods: ['Vila Galvão', 'Maia', 'Picanço'],
        },
      ])
      .select();

    if (err1) throw err1;
    console.log('✓ Professional 1 added:', prof1?.[0]?.id);

    // Add test professional 2
    const { data: prof2, error: err2 } = await supabase
      .from('professionals')
      .insert([
        {
          name: 'Ana Costa',
          professional_type: 'nutritionist',
          email: 'ana@example.com',
          phone: '11988888888',
          whatsapp: '11988888888',
          instagram: '@anacosta_nutri',
          bio: 'Nutricionista especializada em performance e emagrecimento saudável.',
          years_experience: 8,
          crn: '654321/SP',
          specialties: ['Emagrecimento', 'Nutrição Esportiva'],
          service_neighborhoods: ['Vila Galvão', 'Centro'],
        },
      ])
      .select();

    if (err2) throw err2;
    console.log('✓ Professional 2 added:', prof2?.[0]?.id);

    // Add test reviews for professional 1
    if (prof1 && prof1[0]) {
      const { error: revErr1 } = await supabase
        .from('reviews')
        .insert([
          {
            professional_id: prof1[0].id,
            student_name: 'João Silva',
            student_email: 'joao@example.com',
            rating: 5,
            comment: 'Excelente profissional! Muito atencioso e dedicado. Recomendo!',
          },
          {
            professional_id: prof1[0].id,
            student_name: 'Maria Santos',
            student_email: 'maria@example.com',
            rating: 4,
            comment: 'Muito bom, alcancei meus objetivos em pouco tempo.',
          },
          {
            professional_id: prof1[0].id,
            student_name: 'Pedro Oliveira',
            student_email: 'pedro@example.com',
            rating: 5,
            comment: 'Profissional de primeira qualidade!',
          },
        ]);

      if (revErr1) throw revErr1;
      console.log('✓ Reviews for professional 1 added');
    }

    // Add test reviews for professional 2
    if (prof2 && prof2[0]) {
      const { error: revErr2 } = await supabase
        .from('reviews')
        .insert([
          {
            professional_id: prof2[0].id,
            student_name: 'Lucia Ferreira',
            student_email: 'lucia@example.com',
            rating: 5,
            comment: 'Ótima nutricionista! Plano alimentar muito bem estruturado.',
          },
          {
            professional_id: prof2[0].id,
            student_name: 'Roberto Costa',
            student_email: 'roberto@example.com',
            rating: 4,
            comment: 'Muito profissional e dedicada. Perdi 5kg em um mês!',
          },
        ]);

      if (revErr2) throw revErr2;
      console.log('✓ Reviews for professional 2 added');
    }

    console.log('\n✅ Test data added successfully!');
  } catch (err) {
    console.error('Error adding test data:', err);
  }
}

addTestData();
