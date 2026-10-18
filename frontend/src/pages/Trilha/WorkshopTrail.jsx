import AutoStoriesRounded from '@mui/icons-material/AutoStoriesRounded';
import FactCheckRounded from '@mui/icons-material/FactCheckRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import ScienceRounded from '@mui/icons-material/ScienceRounded';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ACTIVITIES = [
  {
    key: 'verdadeiro-falso',
    title: 'Verdadeiro ou falso',
    description: 'Decida rapidamente se cada afirmação sobre tributos e cidadania fiscal é verdadeira.',
  },
  {
    key: 'ligar-colunas',
    title: 'Ligar colunas',
    description: 'Relacione documentos, tributos, direitos e situações do cotidiano.',
  },
  {
    key: 'completar-frases',
    title: 'Completar frases',
    description: 'Preencha conceitos essenciais de educação fiscal, negócios e ciência.',
  },
  {
    key: 'quiz',
    title: 'Quiz Ciência Delas',
    description: 'Responda questões variadas e some CapiCoins a cada nova rodada.',
  },
];

export default function WorkshopTrail() {
  const { aluno } = useAuth();
  const [tab, setTab] = useState('atividades');
  const workshop = aluno?.workshop;

  return (
    <div className="space-y-6 py-3 text-[#f1f7fb]">
      <header className="overflow-hidden rounded-3xl border border-[#37464f] bg-gradient-to-br from-[#1f2d33] via-[#183328] to-[#1f2d33] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#58cc02]">
          <ScienceRounded /> Trilha exclusiva da oficina
        </div>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">Ciência Delas</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#b7c7cf]">
          Educação fiscal no cotidiano, nos negócios e na ciência protagonizada por mulheres. Os conteúdos são opcionais durante a competição: você pode iniciar qualquer atividade imediatamente.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
          <span className="inline-flex items-center gap-2 rounded-xl border border-[#49c0f8]/30 bg-[#49c0f8]/10 px-3 py-2 text-[#8edcff]">
            <GroupsRounded /> {workshop?.teamName || 'Equipe'}
          </span>
          <span className="rounded-xl border border-[#ffc800]/30 bg-[#ffc800]/10 px-3 py-2 text-[#ffe16a]">
            Código {workshop?.teamCode || '—'}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#37464f] bg-[#17262c] p-2">
        {[
          ['atividades', 'Atividades', FactCheckRounded],
          ['conteudos', 'Conteúdos', AutoStoriesRounded],
        ].map(([value, label, Icon]) => (
          <button
            className={`flex min-h-12 items-center justify-center gap-2 rounded-xl text-sm font-black transition ${tab === value ? 'bg-[#58cc02] text-[#13210f]' : 'text-[#b7c7cf] hover:bg-[#1f2d33]'}`}
            key={value}
            onClick={() => setTab(value)}
            type="button"
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {tab === 'atividades' ? (
        <section className="grid gap-4 md:grid-cols-2">
          {ACTIVITIES.map((activity, index) => (
            <article className="flex flex-col rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6" key={activity.key}>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#49c0f8]">Atividade {index + 1}</span>
              <h2 className="mt-2 text-xl font-black text-white">{activity.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-[#a5b7c2]">{activity.description}</p>
              <Link
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#58cc02] px-4 font-black text-[#13210f] shadow-[0_4px_0_#46a302] active:translate-y-1 active:shadow-none"
                to={`/trilha/oficina/atividades/${activity.key}`}
              >
                Iniciar rodada
              </Link>
            </article>
          ))}
        </section>
      ) : (
        <section className="space-y-4">
          {[
            ['Tributos no dia a dia', 'Notas fiscais, orçamento público, consumo consciente e como acompanhar a aplicação dos recursos.'],
            ['Mulheres e empreendedorismo', 'Formalização, preço, fluxo de caixa, obrigações e decisões que fortalecem negócios liderados por mulheres.'],
            ['Mulheres na ciência e tecnologia', 'Financiamento público, bolsas, inovação e participação feminina na produção científica.'],
            ['Cidadania fiscal', 'Transparência, controle social e escolhas responsáveis que conectam arrecadação e direitos.'],
          ].map(([title, description], index) => (
            <article className="rounded-2xl border border-[#37464f] bg-[#1f2d33] p-5" key={title}>
              <span className="text-xs font-black text-[#58cc02]">CONTEÚDO {index + 1}</span>
              <h2 className="mt-1 text-lg font-black text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#a5b7c2]">{description}</p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
