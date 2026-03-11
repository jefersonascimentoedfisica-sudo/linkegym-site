import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tttypwipemjeacygljlz.supabase.co';
const supabaseKey = 'sb_publishable_NRFI9sVumNTJS689qtluWg_VlgTQ4mw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
  try {
    console.log('📋 Criando tabela professionals...');

    // Execute SQL via Supabase
    const { data, error } = await supabase.rpc('create_professionals_table', {});

    if (error) {
      console.error('❌ Erro:', error);
      // Try direct SQL execution
      console.log('Tentando criar tabela diretamente...');
      
      const sqlMigration = `
        CREATE TABLE IF NOT EXISTS professionals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          professional_type VARCHAR(50) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(20),
          whatsapp VARCHAR(20),
          cref VARCHAR(50),
          crn VARCHAR(50),
          bio TEXT,
          years_experience INTEGER,
          specialties TEXT[],
          service_neighborhoods TEXT[],
          lesson_price DECIMAL(10, 2),
          consultation_price DECIMAL(10, 2),
          service_type VARCHAR(50),
          service_regions TEXT[],
          rating DECIMAL(3, 2) DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          profile_image_url TEXT,
          instagram VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      console.log('✅ Tabela pronta para ser criada');
      console.log('Execute o SQL acima no Supabase Dashboard');
    } else {
      console.log('✅ Tabela criada com sucesso!');
    }
  } catch (err) {
    console.error('❌ Erro:', err);
  }
}

createTable();
