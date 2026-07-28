import {
  MonetizationOn,
  Map,
  LocalFireDepartment,
  EmojiEvents,
  Bolt,
  TrendingUp,
  WorkspacePremium,
  Recycling,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';

export default function StudentDashboard() {
  const { aluno, loading } = useAuth();

  const stats = {
    nome: aluno?.nome || '',
    capicoins: aluno?.capicoins || 0,
    fase_atual: aluno?.fase_atual ?? 0,
    streak_atual: aluno?.streak_atual || 0,
    avatar_url: aluno?.avatar_url || null,
    avatar_id: aluno?.avatar_id || null,
  };

  if (loading || !aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const statusCards = [
    {
      label: 'CapiCoins',
      value: stats.capicoins,
      sub: 'Moeda oficial do Money Rank',
      icon: <MonetizationOn sx={{ fontSize: 28 }} />,
      color: 'text-amber-400',
    },
    {
      label: 'Fase Atual',
      value: stats.fase_atual,
      sub: 'Você está progredindo!',
      icon: <Map sx={{ fontSize: 28 }} />,
      color: 'text-amber-400',
    },
    {
      label: 'Dias Seguidos',
      value: stats.streak_atual,
      sub: 'Mantenha a sequência!',
      icon: <LocalFireDepartment sx={{ fontSize: 28 }} />,
      color: 'text-red-400',
    },
  ];

  const comoFunciona = [
    {
      icone: <MonetizationOn sx={{ fontSize: 28 }} />,
      corIcone: 'text-amber-400',
      bgIcone: 'bg-amber-400/10 border-amber-400/20',
      titulo: 'CapiCoins',
      corTitulo: 'text-amber-400',
      texto:
        'A moeda oficial do jogo. Ganhe resolvendo Quizzes, assistindo aulas e tomando boas decisões financeiras. Quanto mais você estuda, mais rico fica no ranking!',
    },
    {
      icone: <LocalFireDepartment sx={{ fontSize: 28 }} />,
      corIcone: 'text-red-400',
      bgIcone: 'bg-red-400/10 border-red-400/20',
      titulo: 'Streak — Dias Seguidos',
      corTitulo: 'text-red-400',
      texto:
        'Conclua ao menos uma atividade por dia para aumentar seu Streak. Mais de uma atividade no mesmo dia mantém a sequência sem inflar o contador.',
    },
    {
      icone: <EmojiEvents sx={{ fontSize: 28 }} />,
      corIcone: 'text-yellow-300',
      bgIcone: 'bg-yellow-300/10 border-yellow-300/20',
      titulo: 'Ranking & Ligas',
      corTitulo: 'text-yellow-300',
      texto:
        'Suas moedas somam pontos para você no ranking individual e para a sua Turma no ranking de equipes. A liga mais alta recebe premiações especiais no fim do período!',
    },
    {
      icone: <Map sx={{ fontSize: 28 }} />,
      corIcone: 'text-emerald-400',
      bgIcone: 'bg-emerald-400/10 border-emerald-400/20',
      titulo: 'Trilhas de Aprendizado',
      corTitulo: 'text-emerald-400',
      texto:
        'Cada Trilha é um módulo temático com Conteúdo (vídeo + slides) e Atividade (Quiz, Estudo de Caso, Simulação). Complete tudo para desbloquear a próxima fase.',
    },
    {
      icone: <Recycling sx={{ fontSize: 28 }} />,
      corIcone: 'text-purple-400',
      bgIcone: 'bg-purple-400/10 border-purple-400/20',
      titulo: 'Farming Diário',
      corTitulo: 'text-purple-400',
      texto:
        'Refazer atividades no mesmo dia garante moedas de Farm (recompensa reduzida). Use isso para subir no ranking durante períodos de competição intensa!',
    },
    {
      icone: <WorkspacePremium sx={{ fontSize: 28 }} />,
      corIcone: 'text-cyan-400',
      bgIcone: 'bg-cyan-400/10 border-cyan-400/20',
      titulo: 'Premiações',
      corTitulo: 'text-cyan-400',
      texto:
        'Os top alunos e turmas do semestre recebem reconhecimento oficial. Fique de olho no calendário de ligas e organize sua turma para vencer em equipe.',
    },
  ];

  return (
    <div className="text-white flex flex-col gap-10">

      {/* ── Background Grid ───────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── WELCOME BLOCK ──────────────────────────────────────────────── */}
      <section className="relative bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <ProfileAvatar
            avatarId={stats.avatar_id}
            className="border-2 border-amber-400/50 shadow-amber-500/10"
            name={stats.nome}
            photoUrl={stats.avatar_url}
            size="lg"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400 mb-2">
              Olá, {stats.nome} 👋
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
              Bem-vindo ao{' '}
              <span className="text-white font-semibold">
                laboratório prático de Educação Fiscal
              </span>
              . Complete missões, tome decisões e ajude sua turma a liderar o ranking!
            </p>
          </div>
        </div>
      </section>

      {/* ── STATUS CARDS ───────────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
          Sua Situação Atual
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statusCards.map((card) => (
            <div
              key={card.label}
              className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-xs font-semibold">{card.label}</span>
                <span className={card.color}>{card.icon}</span>
              </div>
              <p className={`text-4xl font-black ${card.color}`}>{card.value}</p>
              <p className="text-slate-500 text-xs mt-3">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Bolt sx={{ fontSize: 22 }} className="text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
            Como Funciona
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {comoFunciona.map((item) => (
            <div
              key={item.titulo}
              className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all"
            >
              {/* Ícone MUI envolto em container estilizado */}
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${item.bgIcone}`}>
                <span className={item.corIcone}>{item.icone}</span>
              </div>
              <strong className={`${item.corTitulo} block mb-2 text-sm font-black`}>
                {item.titulo}
              </strong>
              <p className="text-slate-400 text-xs leading-relaxed">{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PREMIAÇÕES ─────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
        <EmojiEvents sx={{ fontSize: 56 }} className="text-amber-400 shrink-0" />
        <div>
          <h3 className="text-xl font-black text-white mb-2">
            Lidere o Ranking e Ganhe Prêmios
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Os alunos e turmas no topo do pódio ao fim de cada semestre recebem{' '}
            <span className="text-amber-400 font-semibold">reconhecimento oficial</span> e
            prêmios definidos pelo professor. Organize sua estratégia, mantenha o Streak e
            arraste sua turma junto para o primeiro lugar!
          </p>
        </div>
        <TrendingUp sx={{ fontSize: 48 }} className="text-emerald-400 shrink-0 hidden sm:block" />
      </section>

    </div>
  );
}
