import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import HubRounded from '@mui/icons-material/HubRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import QuizRounded from '@mui/icons-material/QuizRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import TextFieldsRounded from '@mui/icons-material/TextFieldsRounded';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ACTIVITIES = [
  {
    key: 'verdadeiro-falso',
    title: 'Verdadeiro ou falso',
    description: 'Decida rapidamente se cada afirmação sobre tributos e cidadania fiscal é verdadeira.',
    Icon: FactCheckRounded,
  },
  {
    key: 'ligar-colunas',
    title: 'Ligar colunas',
    description: 'Relacione documentos, tributos, direitos e situações do cotidiano.',
    Icon: HubRounded,
  },
  {
    key: 'completar-frases',
    title: 'Completar frases',
    description: 'Preencha conceitos essenciais de educação fiscal, negócios e ciência.',
    Icon: TextFieldsRounded,
  },
  {
    key: 'quiz',
    title: 'Quiz Ciência Delas',
    description: 'Responda questões variadas e some CapiCoins a cada nova rodada.',
    Icon: QuizRounded,
  },
];

const CARD_OFFSETS = ['md:-translate-x-8', 'md:translate-x-8'];

function competitionIsOpen(workshop, teacherPreview, now = Date.now()) {
  if (teacherPreview) return true;
  const startsAt = Date.parse(workshop?.startsAt);
  const endsAt = Date.parse(workshop?.endsAt);
  return workshop?.eventStatus === 'ACTIVE'
    && ['SCHEDULED', 'ACTIVE'].includes(String(workshop?.periodStatus || '').toUpperCase())
    && Number.isFinite(startsAt)
    && Number.isFinite(endsAt)
    && startsAt <= now
    && now < endsAt;
}

export default function WorkshopTrail({ teacherPreview = false }) {
  const { aluno } = useAuth();
  const workshop = teacherPreview
    ? { teamName: 'Equipe de teste', teamCode: '00000000' }
    : aluno?.workshop;
  const competitionOpen = competitionIsOpen(workshop, teacherPreview);
  const activityBasePath = teacherPreview
    ? '/professor/visao-aluno/oficina/atividades'
    : '/trilha/oficina/atividades';

  return (
    <div className="py-3 text-[#f1f7fb]">
      <section className="overflow-hidden rounded-3xl border border-[#37464f] bg-[#1f2d33] shadow-2xl">
        <header className="bg-gradient-to-br from-[#1f2d33] via-[#183328] to-[#1f2d33] p-6 sm:p-8">
          {teacherPreview && (
            <div className="mb-5 rounded-2xl border border-[#49c0f8]/40 bg-[#49c0f8]/10 p-4 text-sm font-bold text-[#bfeaff]">
              Visão do aluno em modo de teste. As respostas ficam isoladas e não entram no ranking.
            </div>
          )}

          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-lg shadow-black/30">
              <ScienceRounded className="text-white" sx={{ fontSize: 29 }} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#58cc02]">
                Trilha exclusiva da oficina
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">Ciência Delas</h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[#b7c7cf]">
                Competição de educação fiscal no cotidiano, nos negócios e na ciência protagonizada por mulheres. Escolha qualquer atividade e faça quantas rodadas conseguir durante o período.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
            <span className="inline-flex items-center gap-2 rounded-xl border border-[#49c0f8]/30 bg-[#49c0f8]/10 px-3 py-2 text-[#8edcff]">
              <GroupsRounded /> {workshop?.teamName || 'Equipe'}
            </span>
            <span className="rounded-xl border border-[#ffc800]/30 bg-[#ffc800]/10 px-3 py-2 text-[#ffe16a]">
              Código {workshop?.teamCode || '—'}
            </span>
            <span className={`rounded-xl border px-3 py-2 ${competitionOpen ? 'border-[#58cc02]/30 bg-[#58cc02]/10 text-[#79e72e]' : 'border-[#ff9600]/30 bg-[#ff9600]/10 text-[#ffc36b]'}`}>
              {competitionOpen ? 'Competição aberta' : 'Competição aguardando ativação'}
            </span>
          </div>

          {!competitionOpen && (
            <p className="mt-4 rounded-2xl border border-[#ff9600]/30 bg-[#ff9600]/10 p-4 text-sm font-bold leading-6 text-[#ffd39a]" role="status">
              O professor precisa ativar o período da oficina antes de liberar as rodadas e a pontuação.
            </p>
          )}
        </header>

        <div className="border-t border-[#37464f] bg-[#131f24]/60 px-4 py-8 sm:px-8 sm:py-10">
          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <div className="absolute bottom-8 left-1/2 top-8 z-0 w-0.5 -translate-x-1/2 bg-white/[0.08]" aria-hidden="true" />
            <div className="relative z-10 flex w-full flex-col items-center gap-6">
              {ACTIVITIES.map((activity, index) => {
                const Icon = activity.Icon;
                return (
                  <article
                    className={`relative w-full max-w-sm rounded-3xl border border-[#37464f] bg-[#17262c] p-6 transition-all duration-300 hover:border-[#58cc02]/40 hover:shadow-2xl ${CARD_OFFSETS[index % CARD_OFFSETS.length]}`}
                    key={activity.key}
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-[#37464f] bg-[#1f2d33] text-lg font-black text-[#58cc02] shadow-md">
                        {index + 1}
                      </span>
                      <div>
                        <p className="mb-0.5 text-xs font-black uppercase tracking-wider text-[#78909c]">Atividade {index + 1}</p>
                        <h2 className="text-base font-black leading-tight text-white">{activity.title}</h2>
                      </div>
                    </div>
                    <p className="mb-5 text-xs leading-relaxed text-[#a5b7c2]">{activity.description}</p>
                    {competitionOpen ? (
                      <Link
                        className="flex w-full items-center gap-2 rounded-2xl bg-[#58cc02] px-4 py-3 text-left font-black text-[#131f24] shadow-[0_4px_0_#46a302] transition-all hover:bg-[#46a302] active:translate-y-1 active:shadow-none"
                        to={`${activityBasePath}/${activity.key}`}
                      >
                        <PlayArrowRounded sx={{ fontSize: 18 }} aria-hidden="true" />
                        <Icon sx={{ fontSize: 17 }} aria-hidden="true" />
                        <span className="text-xs font-black">Iniciar rodada</span>
                      </Link>
                    ) : (
                      <div className="flex w-full items-center gap-2 rounded-2xl border border-white/[0.05] bg-[#1f2d33] px-4 py-3 text-xs font-black text-[#78909c]">
                        <Icon sx={{ fontSize: 17 }} aria-hidden="true" />
                        Aguardando o professor
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
