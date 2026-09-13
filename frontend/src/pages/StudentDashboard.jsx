import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import LocalFireDepartmentRounded from '@mui/icons-material/LocalFireDepartmentRounded';
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import { LoadingState, ProgressBar, SectionHeader, Surface } from '../components/ui/DesignSystem';
import { useAuth } from '../contexts/AuthContext';

const PHASES = [1, 2, 3, 4];

export default function StudentDashboard() {
  const { aluno, loading } = useAuth();

  if (loading || !aluno) return <LoadingState label="Preparando sua jornada..." />;

  const currentPhase = Math.max(Number(aluno.fase_atual) || 0, 0);
  const progress = Math.min((currentPhase / PHASES.length) * 100, 100);
  const preferredName = aluno.nome_preferido || aluno.nome || '';

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <Surface className="relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#58cc02]/10 blur-3xl" aria-hidden="true" />
          <div className="relative flex flex-col gap-7">
            <div className="flex items-center gap-4">
              <ProfileAvatar
                avatarId={aluno.avatar_id}
                className="border-2 border-[#58cc02] bg-[#17262c]"
                name={preferredName}
                photoUrl={aluno.avatar_url}
                size="lg"
              />
              <div className="min-w-0">
                <span className="inline-flex rounded-lg bg-[#58cc02]/15 px-2.5 py-1 text-xs font-black text-[#58cc02]">
                  {aluno.turma || 'Turma não informada'}
                </span>
                <h1 className="mt-2 truncate text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Olá, {preferredName || 'estudante'}!
                </h1>
                <p className="mt-1 text-sm font-semibold text-[#a5b7c2]">Sua próxima decisão já está esperando.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#17262c] p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mr-eyebrow">Continuar aprendendo</p>
                  <h2 className="mt-1 text-2xl font-black text-white">Trilha de saúde e consumo</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#a5b7c2]">
                    Analise escolhas do cotidiano e descubra como consumo, saúde e cidadania se conectam.
                  </p>
                </div>
                <Link to="/trilha" className="mr-button-primary shrink-0">
                  Ir para a trilha <ArrowForwardRounded />
                </Link>
              </div>
              <div className="mt-6">
                <ProgressBar value={progress} label="Progresso geral" valueLabel={`Fase ${currentPhase} de ${PHASES.length}`} />
              </div>
            </div>
          </div>
        </Surface>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <Surface className="flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffc800]/15 text-[#ffc800]">
              <LocalFireDepartmentRounded sx={{ fontSize: 29 }} />
            </span>
            <div><p className="text-2xl font-black text-white">{aluno.streak_atual || 0}</p><p className="text-xs font-bold text-[#a5b7c2]">dias de sequência</p></div>
          </Surface>
          <Surface className="flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#58cc02]/15 text-[#58cc02]">
              <MonetizationOnRounded sx={{ fontSize: 30 }} />
            </span>
            <div><p className="text-2xl font-black text-white">{Number(aluno.capicoins || 0).toLocaleString('pt-BR')}</p><p className="text-xs font-bold text-[#a5b7c2]">CapiCoins virtuais</p></div>
          </Surface>
          <Surface className="flex items-center gap-4 p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#49c0f8]/15 text-[#49c0f8]">
              <StarRounded sx={{ fontSize: 29 }} />
            </span>
            <div><p className="text-2xl font-black text-white">Fase {currentPhase}</p><p className="text-xs font-bold text-[#a5b7c2]">posição na trilha</p></div>
          </Surface>
        </div>
      </section>

      <section>
        <SectionHeader title="Seu caminho" eyebrow="Aprendizado em etapas" action={<Link className="text-sm font-black text-[#49c0f8]" to="/trilha">Ver trilha completa</Link>} />
        <Surface className="overflow-hidden p-5 sm:p-8">
          <div className="relative grid grid-cols-4 gap-3">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 h-2 rounded-full bg-[#0c171c]" aria-hidden="true" />
            <div className="absolute left-[12.5%] top-7 h-2 max-w-[75%] rounded-full bg-[#58cc02] transition-[width]" style={{ width: `${Math.min(progress, 75)}%` }} aria-hidden="true" />
            {PHASES.map((phase) => {
              const complete = phase <= currentPhase;
              const current = phase === Math.min(currentPhase + 1, PHASES.length);
              return (
                <div key={phase} className="relative z-10 flex flex-col items-center text-center">
                  <span className={`flex h-16 w-16 items-center justify-center rounded-full border-[5px] text-xl font-black shadow-[0_5px_0_#0c1519] ${complete ? 'border-[#79e72e] bg-[#58cc02] text-[#13210f]' : current ? 'border-[#49c0f8] bg-[#1f2d33] text-[#49c0f8]' : 'border-[#37464f] bg-[#17262c] text-[#6f828c]'}`}>
                    {complete ? <StarRounded /> : phase}
                  </span>
                  <span className={`mt-3 text-xs font-black ${complete || current ? 'text-white' : 'text-[#6f828c]'}`}>Fase {phase}</span>
                </div>
              );
            })}
          </div>
        </Surface>
      </section>

      <section>
        <SectionHeader title="Explore a Money Rank" eyebrow="Aprender fazendo" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: AutoStoriesRounded, color: '#58cc02', title: 'Trilhas curtas', text: 'Conteúdos e desafios em uma sequência clara para avançar no seu ritmo.' },
            { Icon: EmojiEventsRounded, color: '#ffc800', title: 'Progresso visível', text: 'CapiCoins, sequência e ranking mostram a constância dos seus estudos.' },
            { Icon: SchoolRounded, color: '#49c0f8', title: 'Decisões reais', text: 'Situações do cotidiano conectam finanças, tributos e participação cidadã.' },
          ].map(({ Icon, color, title, text }) => (
            <Surface key={title} className="p-6 transition-transform hover:-translate-y-1">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ color, backgroundColor: `${color}1f` }}><Icon sx={{ fontSize: 30 }} /></span>
              <h3 className="mt-5 text-lg font-black text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#a5b7c2]">{text}</p>
            </Surface>
          ))}
        </div>
      </section>
    </div>
  );
}
