import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import InsightsRounded from '@mui/icons-material/InsightsRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import BrandIdentity from '../components/BrandIdentity';

const NAV_ITEMS = [
  ['Como funciona', '#como-funciona'],
  ['O que você aprende', '#conteudos'],
  ['Nossa trajetória', '#trajetoria'],
  ['Equipe', '#equipe'],
];

const LEARNING_TOPICS = [
  ['Organização financeira', 'Planejamento, orçamento, prioridades, reserva e decisões de curto e longo prazo.'],
  ['Consumo, crédito e dívida', 'Preço, juros, publicidade, consumo consciente e consequências do endividamento.'],
  ['Tributos no cotidiano', 'Por que existem tributos, como afetam escolhas e qual é sua função socioeconômica.'],
  ['Serviços públicos e cidadania', 'Direitos, deveres, transparência, participação social e a relação com a arrecadação.'],
  ['Riscos e informação', 'Apostas, produtos nocivos, falsas promessas financeiras e verificação de informações.'],
];

const JOURNEY = [
  ['Ponto de partida', 'Oficinas de educação financeira e experiências em desafios de economia inspiram a proposta inicial.'],
  ['Diagnóstico e roda de conversa', 'Estudantes discutem consumo, riscos, tributos, fiscalização e transparência.'],
  ['Oficina O Perigo Doce', 'Atividades orientadas conectam escolhas de consumo, saúde pública e efeitos coletivos.'],
  ['Oficina O Custo do Vício', 'Um estudo de caso leva os grupos a ler, argumentar e socializar conclusões sobre riscos e impactos.'],
  ['Plataforma Money Rank', 'As aprendizagens se transformam em trilhas, vídeos, desafios, simulações e progressão.'],
  ['Protótipos físico-digitais', 'O projeto avança para tabuleiro em MDF, peças 3D e estudos de integração com o sistema digital.'],
];

const TEAM = [
  ['S', 'Syllas', 'Professor coordenador', '/landing/equipe/syllas.webp'],
  ['FL', 'Fabio de Lima', 'Programador', '/landing/equipe/fabio-de-lima.webp'],
  ['MV', 'Maria Vitória', 'Programadora', '/landing/equipe/maria-vitoria.webp'],
  ['DM', 'Diógenes Melo', 'Programador', '/landing/equipe/diogenes-melo.webp'],
  ['LN', 'Laura Nislyne', 'Designer', '/landing/equipe/laura-nislyne.webp'],
  ['GH', 'Gabriel Holanda', 'Designer', '/landing/equipe/gabriel-holanda.webp'],
  ['VG', 'Vitor Gabriel', 'Designer', '/landing/equipe/vitor-gabriel.webp'],
];

const FAQ = [
  ['Para quem é a Money Rank?', 'A plataforma foi pensada principalmente para estudantes do ensino médio e educadores que desejam trabalhar educação financeira e fiscal de forma prática.'],
  ['A Money Rank usa dinheiro real?', 'Não. CapiCoins, pontuações e recompensas são virtuais e existem somente dentro da experiência educativa.'],
  ['O que os estudantes aprendem?', 'Planejamento financeiro, consumo, crédito, dívida, tributos, serviços públicos, transparência, riscos e participação cidadã.'],
  ['Professores podem acompanhar as turmas?', 'Sim. A área do professor apresenta progresso, participação e resultados para apoiar intervenções e conversas em sala.'],
  ['A plataforma já está disponível?', 'O acesso de validação está disponível para participantes autorizados do projeto.'],
];

function Brand() {
  return (
    <a href="#inicio" className="flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#49c0f8]">
      <BrandIdentity />
    </a>
  );
}

function SectionTitle({ eyebrow, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#58cc02]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-[#a5b7c2] sm:text-lg">{description}</p>}
    </div>
  );
}

function VisualPlaceholder({ label, description, src }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  if (src && !imageUnavailable) {
    return (
      <figure className="min-h-64 overflow-hidden rounded-3xl border-2 border-[#37464f] bg-[#17262c]">
        <img
          src={src}
          alt={label}
          className="h-full min-h-64 w-full object-cover"
          onError={() => setImageUnavailable(true)}
        />
      </figure>
    );
  }

  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#536670] bg-[#17262c] p-7 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1f2d33] text-[#49c0f8]"><InsightsRounded sx={{ fontSize: 30 }} /></span>
      <p className="mt-4 font-black text-white">{label}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#a5b7c2]">{description}</p>
      <span className="mt-5 rounded-xl border-2 border-[#37464f] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-wider text-[#78909c]">Imagem será adicionada em /public</span>
    </div>
  );
}

function Portrait({ initials, name, src }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);

  if (src && !imageUnavailable) {
    return <img src={src} alt={`Retrato de ${name}`} className="mx-auto aspect-square w-24 rounded-3xl border-2 border-[#536670] object-cover" onError={() => setImageUnavailable(true)} />;
  }

  return <div className="mx-auto flex aspect-square max-w-24 items-center justify-center rounded-3xl border-2 border-dashed border-[#536670] bg-[#17262c] text-xl font-black text-[#49c0f8]" aria-label={`Espaço para retrato de ${name}`}>{initials}</div>;
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="inicio" className="min-h-screen bg-[#131f24] text-[#f1f7fb]">
      <header className="sticky top-0 z-50 border-b-2 border-[#37464f] bg-[#131f24]/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Brand />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação da landing page">
            {NAV_ITEMS.map(([label, href]) => <a key={href} href={href} className="text-sm font-black text-[#dbe7ed] transition-colors hover:text-[#49c0f8]">{label}</a>)}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <Link to="/login" className="font-black text-[#dbe7ed] hover:text-white">Entrar</Link>
            <Link to="/login" className="rounded-2xl bg-[#58cc02] px-5 py-3 font-black text-[#13210f] shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none">Acessar plataforma</Link>
          </div>
          <button type="button" className="rounded-xl border-2 border-[#37464f] p-2 text-white lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>{menuOpen ? <CloseRounded /> : <MenuRounded />}</button>
        </div>
        {menuOpen && (
          <nav className="border-t-2 border-[#37464f] bg-[#17262c] px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {NAV_ITEMS.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-black hover:bg-[#1f2d33]">{label}</a>)}
              <Link to="/login" className="mt-2 rounded-2xl bg-[#58cc02] px-5 py-3 text-center font-black text-[#13210f] shadow-[0_4px_0_#46a302]">Acessar plataforma</Link>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section className="border-b-2 border-[#37464f] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#49c0f8]">Educação financeira e fiscal para o ensino médio</p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.06] text-white sm:text-6xl lg:text-7xl">Aprenda finanças. Entenda os tributos. <span className="text-[#58cc02]">Pratique jogando.</span></h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[#a5b7c2] sm:text-xl">A Money Rank transforma decisões do cotidiano em trilhas, desafios e simulações para estudantes, com uma experiência gamificada e acompanhamento para educadores.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/login" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#58cc02] px-7 font-black text-[#13210f] shadow-[0_5px_0_#46a302] active:translate-y-1 active:shadow-none">Acessar a plataforma <ArrowForwardRounded /></Link>
              <a href="#como-funciona" className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-[#37464f] bg-[#1f2d33] px-7 font-black text-white hover:border-[#49c0f8]">Ver como funciona</a>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle centered eyebrow="Uma experiência prática" title="Finanças fazem parte da vida. Aprender também pode fazer parte do jogo." description="Da organização do dinheiro aos tributos que ajudam a financiar serviços públicos, a Money Rank aproxima conceitos financeiros e fiscais da realidade dos estudantes." />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[['Aprendizado em etapas', SchoolRounded], ['Decisões práticas', TaskAltRounded], ['Progresso visível', EmojiEventsRounded]].map(([label, Icon]) => <div key={label} className="rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] p-7 shadow-[0_5px_0_#0d171b]"><Icon className="text-[#49c0f8]" sx={{ fontSize: 34 }} /><h3 className="mt-5 text-xl font-black text-white">{label}</h3></div>)}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-y-2 border-[#37464f] bg-[#17262c] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Como funciona" title="Aprenda em pequenas etapas. Evolua a cada decisão." />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {[
                ['1', 'Explore uma trilha', 'Avance por conteúdos organizados em uma sequência clara, do essencial às decisões mais complexas.'],
                ['2', 'Coloque em prática', 'Resolva desafios e analise situações do cotidiano em um ambiente educativo, sem usar dinheiro real.'],
                ['3', 'Acompanhe sua evolução', 'Receba retorno, conquiste CapiCoins virtuais, mantenha sua sequência e visualize o progresso.'],
              ].map(([number, title, text]) => <article key={number} className="rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] p-7"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#58cc02] text-xl font-black text-[#13210f] shadow-[0_4px_0_#46a302]">{number}</span><h3 className="mt-6 text-xl font-black text-white">{title}</h3><p className="mt-3 leading-relaxed text-[#a5b7c2]">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Produto em ação" title="Veja como a Money Rank transforma conteúdo em experiência" description="Os espaços abaixo estão preparados para receber capturas reais, sem sobreposições promocionais ou dados pessoais." />
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <VisualPlaceholder src="/landing/produto-trilha.webp" label="Tela da trilha" description="Caminho de aprendizagem, etapas concluídas e próximo desafio." />
              <VisualPlaceholder src="/landing/produto-desafio.webp" label="Desafio e feedback" description="Situação prática, opções e explicação para o estudante." />
              <VisualPlaceholder src="/landing/produto-progresso.webp" label="Progresso e turma" description="Sequência, conquistas, ranking ou painel do professor." />
            </div>
          </div>
        </section>

        <section id="conteudos" className="border-y-2 border-[#37464f] bg-[#17262c] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="O que você aprende" title="Conhecimento para decidir melhor, individual e coletivamente" />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {LEARNING_TOPICS.map(([title, text]) => <article key={title} className="flex gap-4 rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] p-6"><CheckCircleRounded className="mt-0.5 shrink-0 text-[#58cc02]" /><div><h3 className="font-black text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#a5b7c2]">{text}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle centered eyebrow="Para a comunidade escolar" title="Uma experiência para quem aprende e para quem ensina" />
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border-2 border-[#49c0f8] bg-[#1f2d33] p-8"><SchoolRounded className="text-[#49c0f8]" sx={{ fontSize: 38 }} /><h3 className="mt-5 text-2xl font-black">Para estudantes</h3><p className="mt-3 leading-relaxed text-[#a5b7c2]">Aprenda no seu ritmo, pratique com situações próximas da sua realidade e entenda o motivo por trás de cada decisão.</p></article>
              <article className="rounded-3xl border-2 border-[#58cc02] bg-[#1f2d33] p-8"><GroupsRounded className="text-[#58cc02]" sx={{ fontSize: 38 }} /><h3 className="mt-5 text-2xl font-black">Para educadores</h3><p className="mt-3 leading-relaxed text-[#a5b7c2]">Use as trilhas como apoio às atividades, acompanhe o progresso da turma e transforme resultados em novas conversas em sala.</p></article>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-[#37464f] bg-[#17262c] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Por que a Money Rank" title="Feita para aprender fazendo" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {['Financeiro e fiscal no mesmo caminho', 'Feita para o contexto escolar', 'Aprender fazendo', 'Sem dinheiro real', 'Construída e testada em pesquisa-ação'].map((item) => <div key={item} className="rounded-2xl border-2 border-[#37464f] bg-[#1f2d33] p-5 font-black text-white">{item}</div>)}
            </div>
          </div>
        </section>

        <section id="trajetoria" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle eyebrow="Nossa trajetória" title="Do primeiro debate à construção da Money Rank" description="A Money Rank nasceu dentro da escola e evolui com pesquisa, oficinas, protótipos e testes. As etapas abaixo não inventam datas ou resultados ainda não publicados." />
            <ol className="mt-12 grid gap-5 lg:grid-cols-2">
              {JOURNEY.map(([title, text], index) => <li key={title} className="grid gap-5 rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] p-6 sm:grid-cols-[auto_1fr]"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#49c0f8] font-black text-[#10252d]">{index + 1}</span><div><h3 className="text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#a5b7c2]">{text}</p><div className="mt-5 rounded-2xl border-2 border-dashed border-[#536670] bg-[#17262c] p-4 text-xs font-black uppercase tracking-wider text-[#78909c]">Espaço para registro real da etapa</div></div></li>)}
            </ol>
          </div>
        </section>

        <section className="border-y-2 border-[#37464f] bg-[#17262c] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl rounded-3xl border-2 border-[#37464f] bg-gradient-to-br from-[#1f2d33] to-[#183328] p-8 sm:p-10">
            <SectionTitle eyebrow="Pesquisa e fundamento" title="Educação financeira e fiscal conectada à vida cidadã" description="Educação financeira ajuda o estudante a analisar recursos, necessidades, riscos e escolhas. Educação fiscal amplia essa visão ao relacionar tributos, direitos, deveres, serviços públicos, transparência e participação social." />
            <p className="mt-6 text-sm font-bold text-[#dbe7ed]">Conteúdos concebidos em diálogo com referências oficiais de educação financeira e cidadania fiscal.</p>
          </div>
        </section>

        <section id="equipe" className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionTitle centered eyebrow="Equipe" title="Quem constrói a Money Rank" description="Um projeto desenvolvido por estudantes e educadores, reunindo programação, design e pesquisa para aproximar finanças e cidadania da realidade escolar." />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {TEAM.map(([initials, name, role, src]) => <article key={name} className="rounded-3xl border-2 border-[#37464f] bg-[#1f2d33] p-5 text-center"><Portrait initials={initials} name={name} src={src} /><h3 className="mt-4 font-black text-white">{name}</h3><p className="mt-1 text-xs font-bold text-[#a5b7c2]">{role}</p></article>)}
            </div>
          </div>
        </section>

        <section className="border-y-2 border-[#37464f] bg-[#17262c] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionTitle centered eyebrow="Perguntas frequentes" title="Antes de começar" />
            <div className="mt-10 space-y-3">{FAQ.map(([question, answer]) => <details key={question} className="group rounded-2xl border-2 border-[#37464f] bg-[#1f2d33] p-5"><summary className="cursor-pointer font-black text-white marker:text-[#58cc02]">{question}</summary><p className="mt-3 leading-relaxed text-[#a5b7c2]">{answer}</p></details>)}</div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] border-2 border-[#58cc02] bg-gradient-to-br from-[#1f2d33] to-[#183328] p-9 text-center shadow-[0_7px_0_#0d171b] sm:p-14">
            <h2 className="text-3xl font-black text-white sm:text-4xl">Pronto para aprender finanças e cidadania fiscal de um jeito mais prático?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#a5b7c2]">Explore as trilhas, enfrente desafios e acompanhe sua evolução na Money Rank.</p>
            <Link to="/login" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#58cc02] px-7 font-black text-[#13210f] shadow-[0_5px_0_#46a302] active:translate-y-1 active:shadow-none">Acessar a plataforma <ArrowForwardRounded /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-[#37464f] bg-[#17262c] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center text-sm text-[#a5b7c2] sm:flex-row sm:text-left"><Brand /><p>Projeto educacional em desenvolvimento para o ensino médio.</p></div>
      </footer>
    </div>
  );
}
