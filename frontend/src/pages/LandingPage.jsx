import { useEffect, useState } from 'react';
import {
  School,
  TrendingUp,
  WorkspacePremium,
  MonetizationOn,
  AutoStories,
  LocalFireDepartment,
  BarChart,
  Security,
  Login,
  ArrowForward,
  SentimentVeryDissatisfied,
  QueryStats,
  RocketLaunch,
  Favorite
} from '@mui/icons-material';

function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ── Pilares da Gamificação (Carrossel Principal) ──
  const carouselItems = [
    { 
      icon: <AutoStories sx={{ fontSize: '4.5rem', color: '#fbbf24' }} />, 
      title: "Trilha de Aprendizado", 
      text: "Fases interativas baseadas em consumo consciente, impostos e inflação. O aluno avança de nível conforme domina os conceitos fiscais práticos." 
    },
    { 
      icon: <MonetizationOn sx={{ fontSize: '4.5rem', color: '#fbbf24' }} />, 
      title: "Economia Baseada em CapiCoins", 
      text: "A teoria vira prática imediatamente. Responder aos desafios e manter a constância rende CapiCoins, a moeda oficial que simula o poder de compra e poupança." 
    },
    { 
      icon: <WorkspacePremium sx={{ fontSize: '4.5rem', color: '#fbbf24' }} />, 
      title: "Ranking Competitivo Saudável", 
      text: "Um Leaderboard em tempo real que engaja a sala de aula do 3º ano. A competição saudável estimula a colaboração e o debate sobre decisões financeiras." 
    },
    { 
      icon: <BarChart sx={{ fontSize: '4.5rem', color: '#fbbf24' }} />, 
      title: "Coleta de Dados de Desempenho", 
      text: "Foco científico total. O painel do administrador permite mapear em quais conceitos fiscais a turma tem mais facilidade ou dificuldade para gerar relatórios precisos." 
    }
  ];

  // ── Estatísticas de Impacto (Sincronizadas com o Carrossel) ──
  const floatingStatsLeft = [
    { num: "3º Ano", label: "Foco do Projeto", icon: <School sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" },
    { num: "Moeda", label: "CapiCoins Virtuais", icon: <MonetizationOn sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" },
    { num: "Ranking", label: "Leaderboard Escolar", icon: <WorkspacePremium sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" },
    { num: "Real-Time", label: "Métricas Prontas", icon: <BarChart sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" }
  ];

  // ── Top Tags (Badge list no topo do HERO)
  const topTags = [
    { label: "IA em Desenvolvimento", icon: <QueryStats sx={{ color: '#fbbf24', fontSize: 20 }} /> },
    { label: "Economia Interna", icon: <MonetizationOn sx={{ color: '#fbbf24', fontSize: 20 }} /> },
    { label: "Trilhas Gamificadas", icon: <AutoStories sx={{ color: '#fbbf24', fontSize: 20 }} /> },
    { label: "Ranking Escolar", icon: <WorkspacePremium sx={{ color: '#fbbf24', fontSize: 20 }} /> },
    { label: "Base Científica", icon: <School sx={{ color: '#fbbf24', fontSize: 20 }} /> },
    { label: "Monitoramento", icon: <TrendingUp sx={{ color: '#fbbf24', fontSize: 20 }} /> }
  ];

  const floatingStatsRight = [
    { num: "Prático", label: "Fases de Consumo", icon: <AutoStories sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" },
    { num: "Diário", label: "Streak Ativo (Foguinho)", icon: <LocalFireDepartment sx={{ fontSize: 24, color: '#ef4444' }} />, bg: "bg-red-500/10" },
    { num: "Admin", label: "Visão do Professor", icon: <Security sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" },
    { num: "100%", label: "Pesquisa Científica", icon: <QueryStats sx={{ fontSize: 24, color: '#f59e0b' }} />, bg: "bg-amber-500/10" }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Efeito de Revelação Dinâmica (Scroll Animation)
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    
    revealEls.forEach(el => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
      revealObserver.observe(el);
    });

    // Timer Automático do Carrossel (4.5 segundos)
    const sliderTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealEls.forEach(el => revealObserver.unobserve(el));
      clearInterval(sliderTimer);
    };
  }, [carouselItems.length]);

  return (
    <div className='w-full overflow-hidden bg-slate-950 text-slate-100 font-sans'>
      
      {/* ══════════════════════════════
          HEADER (BARRA DE NAVEGAÇÃO)
         ══════════════════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-zinc-800 py-3 shadow-lg' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center border-2 border-amber-400 rounded-full p-1 bg-slate-900">
              <span className="text-amber-400 font-black text-lg">$</span>
            </div>
            <span className="text-xl font-black tracking-wider text-white group-hover:text-amber-400 transition-colors uppercase">
              Money <span className="text-amber-400">Rank</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#problema" className="hover:text-amber-400 transition-colors">O Desafio</a>
            <a href="#solucao" className="hover:text-amber-400 transition-colors">A Solução</a>
            <a href="#diferenciais" className="hover:text-amber-400 transition-colors">Diferenciais</a>
            <a href="#quem-faz-acontecer" className="hover:text-amber-400 transition-colors">Nossa Pesquisa</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
              Entrar
            </a>
            <a href="/cadastro" className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md shadow-amber-400/10">
              <Login sx={{ fontSize: 16 }} />
              Acessar Sistema
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════
          HERO SECTION
         ══════════════════════════════ */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center px-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-slate-950 to-slate-950">
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-400/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Conteúdo Esquerda */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-xs font-bold text-amber-400 uppercase tracking-widest">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              Validação Aberta — Projeto de Pesquisa
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              Educação Fiscal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                Gamificada e Prática.
              </span>
            </h1>

            {/* TAGS ORGANIZADAS (Alinhamento à esquerda, em blocos limpos) */}
            <div className="flex flex-wrap gap-3 justify-start max-w-lg">
              {topTags.map((t, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-amber-400/20 shadow-sm">
                  <span className="flex items-center">{t.icon}</span>
                  <span className="text-amber-400 text-sm font-semibold tracking-wide">{t.label}</span>
                </div>
              ))}
            </div>

            <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
              Uma ferramenta laboratorial desenvolvida sob medida para turmas de Ensino Médio. Ensinando economia, cidadania fiscal e inteligência financeira através do jogo.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <a href="/cadastro" className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-amber-500/20 group w-max">
                Criar Minha Conta Aluno
                <ArrowForward sx={{ fontSize: 18 }} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Visual Direita (Carrossel Dinâmico) */}
          <div className="relative flex items-center justify-center py-10 lg:py-0">
            
            {/* Card Central */}
            <div className="w-full max-w-sm bg-zinc-900/90 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative z-30 backdrop-blur-sm min-h-[340px] flex flex-col justify-between">
              <div key={currentSlide} className="flex flex-col items-center text-center gap-4 animate-[fadeIn_0.4s_ease-in-out]">
                <div className="p-4 bg-amber-400/10 rounded-2xl border border-amber-400/20 shadow-inner">
                  {carouselItems[currentSlide].icon}
                </div>
                <h3 className="text-xl font-extrabold text-white">
                  {carouselItems[currentSlide].title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {carouselItems[currentSlide].text}
                </p>
              </div>

              {/* Indicadores */}
              <div className="flex justify-center gap-2 pt-6">
                {carouselItems.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-amber-400 w-5' : 'bg-zinc-700 w-1.5'}`}></span>
                ))}
              </div>
            </div>

            {/* CARDS FLUTUANTES CORRIGIDOS (Mais próximos do card central) */}
            <div className="absolute -left-2 md:-left-20 bottom-10 lg:bottom-16 z-40 flex items-center gap-3 bg-slate-900 border border-zinc-800 p-3 lg:p-4 rounded-2xl shadow-xl animate-[fadeIn_0.4s_ease-in-out]" key={`fl-${currentSlide}`}>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${floatingStatsLeft[currentSlide].bg}`}>
                {floatingStatsLeft[currentSlide].icon}
              </div>
              <div>
                <div className="text-sm lg:text-base font-black text-white">{floatingStatsLeft[currentSlide].num}</div>
                <div className="text-[10px] lg:text-xs text-slate-400 font-medium">{floatingStatsLeft[currentSlide].label}</div>
              </div>
            </div>

            <div className="absolute -right-2 md:-right-20 top-10 lg:top-16 z-40 flex items-center gap-3 bg-slate-900 border border-zinc-800 p-3 lg:p-4 rounded-2xl shadow-xl animate-[fadeIn_0.4s_ease-in-out]" key={`fr-${currentSlide}`}>
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${floatingStatsRight[currentSlide].bg}`}>
                {floatingStatsRight[currentSlide].icon}
              </div>
              <div>
                <div className="text-sm lg:text-base font-black text-white">{floatingStatsRight[currentSlide].num}</div>
                <div className="text-[10px] lg:text-xs text-slate-400 font-medium">{floatingStatsRight[currentSlide].label}</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          O CAOS DAS SOLUÇÕES TRADICIONAIS
         ══════════════════════════════ */}
      <section id="problema" className="py-24 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest">O Gargalo Atual</div>
            <h2 className="text-3xl font-black text-white">Por que Planilhas e Textos não Bastam?</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Ensinar economia para adolescentes exige ferramentas modernas que conversem diretamente com a linguagem digital deles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reveal flex flex-col items-center text-center p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800 shadow-md">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700 shadow-inner">
                <SentimentVeryDissatisfied className="text-red-400" sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Desinteresse Geral</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Textos longos afastam a atenção dos estudantes dos terceiros anos, gerando baixa absorção de conteúdo fiscal de cidadania.</p>
            </div>

            <div className="reveal flex flex-col items-center text-center p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800 shadow-md">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700 shadow-inner">
                <BarChart className="text-amber-400" sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ausência de Dados</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Professores não possuem ferramentas rápidas para mapear quais erros estruturais e dúvidas financeiras a turma comete com maior frequência.</p>
            </div>

            <div className="reveal flex flex-col items-center text-center p-8 bg-zinc-900/60 rounded-3xl border border-zinc-800 shadow-md">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700 shadow-inner">
                <MonetizationOn className="text-amber-400" sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Falta de Prática Real</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Sem simulações imediatas de escolhas (investir ou gastar), o conhecimento de sala de aula evapora rapidamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          A SOLUÇÃO: O SISTEMA MONEY RANK
         ══════════════════════════════ */}
      <section id="solucao" className="py-24 bg-slate-950 border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest">A Revolução Prática</div>
            <h2 className="text-3xl font-black text-white">A Engrenagem Completa do Jogo</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Unindo mecânicas consagradas de jogos com pilares sérios de economia de forma limpa, direta e sem fricção.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex gap-5 reveal hover:border-amber-400/30 transition-all">
               <div className="flex-shrink-0 w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20">
                  <AutoStories className="text-amber-400" sx={{ fontSize: 24 }} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-1">Trilha Modular</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Fases bloqueadas por cadeados garantem que os alunos sigam um progresso lógico de aprendizado cronológico.</p>
               </div>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex gap-5 reveal hover:border-amber-400/30 transition-all">
               <div className="flex-shrink-0 w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20">
                  <LocalFireDepartment className="text-red-400" sx={{ fontSize: 24 }} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-1">Motor de Constância</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">O contador de Streak ativa o senso de responsabilidade diária. Acessar com frequência bonifica o saldo do aluno.</p>
               </div>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex gap-5 reveal hover:border-amber-400/30 transition-all">
               <div className="flex-shrink-0 w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20">
                  <WorkspacePremium className="text-amber-400" sx={{ fontSize: 24 }} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-1">Leaderboard Classificatório</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">O ranking global da escola expõe quem são os maiores detentores de CapiCoins obtidas por puro mérito de acertos.</p>
               </div>
            </div>

            <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 flex gap-5 reveal hover:border-amber-400/30 transition-all">
               <div className="flex-shrink-0 w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center border border-amber-400/20">
                  <BarChart className="text-blue-400" sx={{ fontSize: 24 }} />
               </div>
               <div>
                  <h3 className="text-lg font-bold text-white mb-1">Painel Coletor (Admin)</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">A área exclusiva do professor exibe a métrica consolidada e tabulada para alimentar os artigos de pesquisa científica.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          DIFERENCIAIS E MERCADO CIENTÍFICO
         ══════════════════════════════ */}
      <section id="diferenciais" className="py-24 bg-gradient-to-br from-zinc-950 via-slate-900 to-zinc-950 text-white relative overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 reveal">
          
          <div className="text-center mb-16 space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 font-bold text-xs tracking-wider uppercase">
              Por que o Money Rank?
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Nossos Diferenciais Acadêmicos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl border border-zinc-800">
               <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-400"><School sx={{ fontSize: 20 }} /> Foco no Ensino Médio</h3>
               <p className="text-sm text-slate-400 leading-relaxed">Diferente de apps comerciais complexos, nossa linguagem e mecânica são inteiramente adaptadas para a realidade das salas de aula do 3º ano público e privado.</p>
            </div>
            <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl border border-zinc-800">
               <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-400"><MonetizationOn sx={{ fontSize: 20 }} /> Zero Dinheiro Real</h3>
               <p className="text-sm text-slate-400 leading-relaxed">Nenhum risco financeiro. Foco exclusivo em educação fiscal simulada, protegendo e blindando os menores de idade dentro de uma sandbox segura.</p>
            </div>
            <div className="bg-zinc-900/40 backdrop-blur-md p-8 rounded-2xl border border-zinc-800">
               <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-400"><Security sx={{ fontSize: 20 }} /> Alinhado à BNCC</h3>
               <p className="text-sm text-slate-400 leading-relaxed">Desenvolvido estritamente integrado aos temas contemporâneos transversais da BNCC (Educação Financeira e Cidadania Fiscal).</p>
            </div>
          </div>

          {/* DADOS COLETADOS/MÉTRICAS DO PROJETO */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl flex flex-col md:flex-row items-center justify-around gap-8 text-white">
             <div>
               <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1">Múltiplas</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Turmas Avaliadas em Paralelo</div>
             </div>
             
             <div className="hidden md:block w-px h-16 bg-zinc-800"></div>
             
             <div>
               <div className="text-3xl md:text-4xl font-black text-amber-300 mb-1">Estatísticas</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Exportáveis para Relatório</div>
             </div>

             <div className="hidden md:block w-px h-16 bg-zinc-800"></div>

             <div>
               <div className="text-3xl md:text-4xl font-black text-amber-400 mb-1">100%</div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Foco em Inovação Tecnológica Social</div>
             </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          QUEM FAZ ACONTECER (Equipe)
         ══════════════════════════════ */}
      <section id="quem-faz-acontecer" className="py-24 bg-slate-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-4 text-center md:text-left">Equipe Pesquisadora</div>
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 mb-12 shadow-lg shadow-amber-500/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 border-l-2 border-amber-400 pl-4">
                <div className="text-amber-400 font-black text-lg">Medalha de Ouro</div>
                <p className="text-slate-400 text-sm leading-relaxed">Conquistas notáveis em competições de elite de educação financeira: OLITEF, OBMF e Desafio Eu Quero Ser Economista.</p>
              </div>
              <div className="space-y-2 border-l-2 border-amber-400 pl-4">
                <div className="text-amber-400 font-black text-lg">O Ponto de Partida</div>
                <p className="text-slate-400 text-sm leading-relaxed">A ideia nasceu durante a Oficina de Educação Financeira criada pelo professor Syllas junto com os alunos Fábio, Maria Vitória e Maria Isabella.</p>
              </div>
              <div className="space-y-2 border-l-2 border-amber-400 pl-4">
                <div className="text-amber-400 font-black text-lg">Próximo Passo</div>
                <p className="text-slate-400 text-sm leading-relaxed">Implementar o Money Rank como ferramenta prática de intervenção durante a nova formação de Educação Fiscal.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Syllas (Professor) */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center shadow-md hover:border-amber-400/40 transition-colors">
              <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full overflow-hidden border-2 border-amber-400/20">
                <img src="/Syllas.jpeg" alt="Syllas" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-white font-bold text-lg">Syllas</div>
              <div className="text-amber-400 text-sm font-medium">Professor / Orientador</div>
            </div>

            {/* Fabio De Lima */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center shadow-md hover:border-amber-400/40 transition-colors">
              <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full overflow-hidden border-2 border-amber-400/20">
                <img src="/Fabio.jpeg" alt="Fabio De Lima" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-white font-bold text-lg">Fabio De Lima</div>
              <div className="text-slate-400 text-sm">Pesquisador / Dev</div>
            </div>

            {/* Maria Vitoria */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center shadow-md hover:border-amber-400/40 transition-colors">
              <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full overflow-hidden border-2 border-amber-400/20">
                <img src="/Vitoria.jpeg" alt="Maria Vitoria" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-white font-bold text-lg">Maria Vitoria</div>
              <div className="text-slate-400 text-sm">Pesquisadora</div>
            </div>

            {/* Maria Isabella */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center shadow-md hover:border-amber-400/40 transition-colors">
              <div className="w-24 h-24 mx-auto mb-4 bg-zinc-800 rounded-full overflow-hidden border-2 border-amber-400/20">
                <img src="/Isabella.jpeg" alt="Maria Isabella" className="w-full h-full object-cover" />
              </div>
              <div className="text-white font-bold text-lg">Maria Isabella</div>
              <div className="text-slate-400 text-sm">Pesquisadora</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FINAL CTA (ACESSAR OU AJUDAR)
         ══════════════════════════════ */}
      <section className="pb-20 pt-10 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="reveal bg-gradient-to-br from-zinc-900 to-slate-900 border border-zinc-800 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500"></div>
            <div className="flex justify-center">
              <RocketLaunch className="text-amber-400 animate-bounce" sx={{ fontSize: '3.5rem' }} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white">Pronto para rodar o Laboratório?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              Ajude nossa pesquisa sendo um dos primeiros a testar as funcionalidades acadêmicas do projeto.
            </p>
            <div className="pt-4 flex justify-center">
              <a href="" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-4 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-amber-400/20">
                Preencher Formulário de Validação
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
         ══════════════════════════════ */}
      <footer className="border-t border-zinc-900 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <span className="text-sm font-black tracking-wider text-white uppercase">
              Money <span className="text-amber-400">Rank</span>
            </span>
            <p className="leading-relaxed text-slate-400">
              Inovação social e gamificação aplicada à cidadania fiscal. Desenvolvido para transformar as dinâmicas de economia das salas de aula públicas e privadas.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Escopo Científico</h4>
            <ul className="space-y-2">
              <li>Mapeamento de Desempenho Escolar</li>
              <li>Prêmio Nacional de Educação Fiscal</li>
              <li>Submissão Jovem Cientista</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[10px]">Tecnologias</h4>
            <ul className="space-y-2">
              <li>React 18 & Tailwind CSS</li>
              <li>Node.js / Express Architecture</li>
              <li>Supabase Database Security (RLS Bypass)</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6 border-t border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <span>&copy; 2026 Money Rank — Todos os direitos reservados.</span>
          <span className="inline-flex items-center gap-1.5">
            Desenvolvido com <Favorite className="text-red-500" sx={{ fontSize: 14 }} /> para o Futuro da Educação Fiscal
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;