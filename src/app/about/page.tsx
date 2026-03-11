import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-blue-600">LinkeGym</Link>
          <div className="flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/about" className="text-blue-600 font-medium">Sobre</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contato</Link>
          </div>
          <Link href="/register" className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            Cadastro
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre LinkeGym</h1>
          <p className="text-xl text-blue-100">
            Conectando você à saúde e performance
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Mission */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              LinkeGym é um marketplace digital que conecta alunos a profissionais de saúde e fitness qualificados. 
              Nosso objetivo é facilitar o acesso a serviços de qualidade, permitindo que qualquer pessoa encontre 
              o profissional ideal para seus objetivos de saúde e performance.
            </p>
          </div>

          {/* Vision */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Visão</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Ser a plataforma mais confiável e acessível para conectar alunos a profissionais de saúde e fitness 
              em todo o Brasil, transformando a forma como as pessoas buscam e contratam serviços de bem-estar.
            </p>
          </div>

          {/* Values */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossos Valores</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '✅', title: 'Confiança', desc: 'Todos os profissionais são verificados e registrados' },
                { icon: '🎯', title: 'Qualidade', desc: 'Oferecemos apenas profissionais qualificados' },
                { icon: '💪', title: 'Saúde', desc: 'Comprometidos com a saúde e bem-estar dos nossos usuários' },
                { icon: '🤝', title: 'Transparência', desc: 'Comunicação clara e honesta com todos' },
              ].map((value, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Como Funciona</h2>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Busque Profissionais', desc: 'Procure por personal trainers ou nutricionistas no seu bairro' },
                { step: 2, title: 'Veja Perfis', desc: 'Conheça a experiência, especialidades e avaliações' },
                { step: 3, title: 'Entre em Contato', desc: 'Comunique-se via WhatsApp ou redes sociais' },
                { step: 4, title: 'Contrate o Serviço', desc: 'Acerte os detalhes e comece suas aulas' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Professionals */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Para Profissionais</h2>
            <p className="text-gray-700 mb-6">
              Se você é um Personal Trainer ou Nutricionista, LinkeGym é a plataforma ideal para expandir seu negócio 
              e conquistar novos clientes. Cadastre-se gratuitamente e comece a receber contatos de alunos interessados 
              em seus serviços.
            </p>
            <div className="space-y-3 mb-6">
              <p className="text-gray-700">✓ Cadastro simples e rápido</p>
              <p className="text-gray-700">✓ Perfil profissional completo</p>
              <p className="text-gray-700">✓ Comissão justa (20%)</p>
              <p className="text-gray-700">✓ Suporte dedicado</p>
            </div>
            <Link
              href="/register?type=professional"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Cadastre-se como Profissional
            </Link>
          </div>

          {/* For Students */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Para Alunos</h2>
            <p className="text-gray-700 mb-6">
              Procurando um Personal Trainer ou Nutricionista? LinkeGym facilita sua busca com profissionais 
              verificados e próximos de você. Encontre o profissional ideal para seus objetivos de saúde.
            </p>
            <div className="space-y-3 mb-6">
              <p className="text-gray-700">✓ Busca por bairro e especialidade</p>
              <p className="text-gray-700">✓ Profissionais verificados</p>
              <p className="text-gray-700">✓ Avaliações reais de clientes</p>
              <p className="text-gray-700">✓ Contato direto via WhatsApp</p>
            </div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition"
            >
              Começar a Buscar
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-2xl">LinkeGym</h3>
              <p className="text-sm">Conectando você à saúde e performance.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/about" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Usuários</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/register?type=student" className="hover:text-white">Cadastro Aluno</Link></li>
                <li><Link href="/register?type=professional" className="hover:text-white">Cadastro Profissional</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link href="/terms" className="hover:text-white">Termos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 LinkeGym. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
