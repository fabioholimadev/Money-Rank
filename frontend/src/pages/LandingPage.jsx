import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white selection:bg-green-500 selection:text-slate-900">
      
      {/* NAVBAR */}
      <nav className="w-full bg-slate-900/90 backdrop-blur-md p-4 flex justify-between items-center fixed top-0 z-50 border-b border-slate-800">
        <div className="text-2xl font-black tracking-tighter">
          <span className="text-white">MONEY</span><span className="text-green-400">RANK</span>
        </div>
        <div>
          <Link to="/login" className="text-slate-300 font-bold hover:text-white mr-6 transition-colors">
            Entrar
          </Link>
          <Link
            to="/login"
            state={{ screen: 'register' }}
            className="bg-green-500 hover:bg-green-400 text-slate-900 font-extrabold py-2 px-6 rounded-full shadow-[0_4px_0_0_#15803d] transition-all active:translate-y-1 active:shadow-none"
          >
            Cadastrar
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="flex flex-col items-center justify-center text-center px-4 pt-36 pb-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="inline-block bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-8 shadow-sm">
          <span className="text-yellow-400 text-sm font-bold tracking-wide uppercase">🏆 O Jogo da Educação Financeira e Fiscal</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 max-w-4xl leading-tight text-white tracking-tight">
          Formando a próxima geração de jovens <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">financeiramente livres.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl leading-relaxed">
          Você sabia que a sua compra no mercado é exatamente o que banca os hospitais públicos e a sua escola? Aprenda na Money Rank como os seus impostos viram o SUS e assuma o poder de cobrar seus direitos!
        </p>

        <Link to="/login" className="bg-green-500 hover:bg-green-400 text-slate-900 text-xl font-extrabold py-4 px-12 rounded-full shadow-[0_6px_0_0_#15803d] transition-all active:translate-y-2 active:shadow-none transform hover:scale-105">
          Começar a Trilha Agora
        </Link>
      </main>

      {/* SEÇÃO DO PROBLEMA (Dados da Pesquisa Atualizados) */}
      <section className="py-20 px-4 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">O Sistema foi feito para você não entender.</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              A falta de educação fiscal custa qualidade de vida, sonhos adiados e poder de compra corroído diariamente por impostos invisíveis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - PISA / OCDE */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 hover:border-red-500 transition-colors">
              <div className="text-5xl font-black text-red-500 mb-4">46,7%</div>
              <h3 className="text-xl font-bold text-white mb-2">Analfabetismo Financeiro</h3>
              <p className="text-slate-400 text-sm mb-4">
                Quase metade dos jovens de 15 anos no Brasil estão no nível mais básico de letramento financeiro mundial.
              </p>
              <div className="text-xs text-slate-500 font-mono">Fonte: PISA 2022 / OCDE</div>
            </div>

            {/* Card 2 - CNDL / SPC */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 hover:border-orange-500 transition-colors">
              <div className="text-5xl font-black text-orange-500 mb-4">74%</div>
              <h3 className="text-xl font-bold text-white mb-2">Impostos Invisíveis</h3>
              <p className="text-slate-400 text-sm mb-4">
                Você faz parte dos 74% de brasileiros que pagam impostos todos os dias nas compras sem perceber? O seu dinheiro está sumindo.
              </p>
              <div className="text-xs text-slate-500 font-mono">Fonte: CNDL e SPC Brasil</div>
            </div>

            {/* Card 3 - EMPRAD */}
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 hover:border-yellow-500 transition-colors">
              <div className="text-5xl font-black text-yellow-500 mb-4">90%</div>
              <h3 className="text-xl font-bold text-white mb-2">Apagão Cidadão</h3>
              <p className="text-slate-400 text-sm mb-4">
                Dos jovens não sabem o que é sonegação fiscal — e é por isso que os serviços públicos continuam falhando e a conta sobra pra você.
              </p>
              <div className="text-xs text-slate-500 font-mono">Fonte: Pesquisa EMPRAD</div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DA SOLUÇÃO */}
      <section className="flex flex-wrap justify-center gap-8 px-4 py-24 bg-slate-900">
        
        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 max-w-sm text-center transform transition duration-500 hover:-translate-y-2 hover:border-blue-500">
          <div className="text-6xl mb-6">🗺️</div>
          <h3 className="text-2xl font-bold mb-3 text-white">Desvende a Nota Fiscal</h3>
          <p className="text-slate-400 leading-relaxed">6 em cada 10 estudantes não sabem para que serve uma nota. Jogue, desvende os impostos (ICMS, IBS, CBS) e suba de nível na vida real.</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 max-w-sm text-center transform transition duration-500 hover:-translate-y-2 hover:border-green-500">
          <div className="text-6xl mb-6">🪙</div>
          <h3 className="text-2xl font-bold mb-3 text-white">Domine o Jogo</h3>
          <p className="text-slate-400 leading-relaxed">Quem entende de finanças tem 72% mais chances de ver o dinheiro sobrar. Pare de agir por impulso e ganhe moedas na plataforma.</p>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 max-w-sm text-center transform transition duration-500 hover:-translate-y-2 hover:border-purple-500">
          <div className="text-6xl mb-6">🏆</div>
          <h3 className="text-2xl font-bold mb-3 text-white">Construa o Futuro</h3>
          <p className="text-slate-400 leading-relaxed">Entenda para onde vai a arrecadação, dispute rankings com seus colegas e torne-se um Mestre Fiscal preparado para transformar o Brasil.</p>
        </div>

      </section>

    </div>
  );
}