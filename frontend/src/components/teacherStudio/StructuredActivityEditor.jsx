import {
  inputClassName,
  StudioField,
  StudioSection,
  textareaClassName,
} from './StudioFields';

function replaceAt(items, index, value) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item));
}

function generatedId(prefix) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function RemoveButton({ disabled, onClick, label = 'Remover' }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-black text-red-300 hover:bg-red-500/10 disabled:opacity-40"
    >
      {label}
    </button>
  );
}

function PedagogicalApproval({ item, disabled, onChange }) {
  if (!item?.review) return null;
  const approved = item.review.pedagogical === 'teacher_approved';
  const needsResearch = item.review.technical === 'source_verified';
  return (
    <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
      <label className="flex items-start gap-3 text-sm font-bold text-amber-100">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-amber-400"
          checked={approved}
          disabled={disabled}
          onChange={(event) => onChange({
            ...item.review,
            pedagogical: event.target.checked
              ? 'teacher_approved'
              : 'pending_teacher_review',
          })}
        />
        <span>
          Confirmo a revisão pedagógica deste item.
          {needsResearch && (
            <span className="mt-1 block text-xs font-normal text-amber-200/75">
              A publicação também exige uma pesquisa aprovada com o mesmo
              identificador, afirmação e URL na aba Pesquisas.
            </span>
          )}
        </span>
      </label>
    </div>
  );
}

function PerigoDoceEditor({ payload, disabled, onChange }) {
  const facts = payload.knowledge ?? [];
  const updateFact = (index, nextFact) =>
    onChange({ ...payload, knowledge: replaceAt(facts, index, nextFact) });

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
        O quiz gera cinco perguntas usando somente esta base. Cada fato precisa
        de fonte HTTPS e três equívocos controlados.
      </p>
      {facts.map((fact, index) => (
        <StudioSection key={fact.id} title={`Fato ${index + 1} · ${fact.id}`}>
          <div className="flex justify-end">
            <RemoveButton
              disabled={disabled || facts.length <= 5}
              onClick={() =>
                onChange({
                  ...payload,
                  knowledge: facts.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            />
          </div>
          <PedagogicalApproval
            item={fact}
            disabled={disabled}
            onChange={(review) => updateFact(index, { ...fact, review })}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <StudioField label="Tema">
              <input
                className={inputClassName}
                value={fact.topic ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, { ...fact, topic: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Dificuldade">
              <select
                className={inputClassName}
                value={fact.difficulty ?? 'media'}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, { ...fact, difficulty: event.target.value })
                }
              >
                <option value="facil">Fácil</option>
                <option value="media">Média</option>
                <option value="desafiadora">Desafiadora</option>
              </select>
            </StudioField>
          </div>
          <StudioField label="Afirmação validada">
            <textarea
              className={textareaClassName}
              value={fact.claim ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateFact(index, { ...fact, claim: event.target.value })
              }
            />
          </StudioField>
          <StudioField label="Explicação">
            <textarea
              className={textareaClassName}
              value={fact.explanation ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateFact(index, { ...fact, explanation: event.target.value })
              }
            />
          </StudioField>
          <StudioField label="Abordagem pedagógica">
            <textarea
              className={textareaClassName}
              value={fact.teachingAngle ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateFact(index, { ...fact, teachingAngle: event.target.value })
              }
            />
          </StudioField>
          <StudioField label="Equívocos — um por linha">
            <textarea
              className={textareaClassName}
              value={(fact.misconceptions ?? []).join('\n')}
              disabled={disabled}
              onChange={(event) =>
                updateFact(index, {
                  ...fact,
                  misconceptions: event.target.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
          </StudioField>
          <div className="grid gap-4 md:grid-cols-2">
            <StudioField label="Instituição">
              <input
                className={inputClassName}
                value={fact.source?.publisher ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, {
                    ...fact,
                    source: { ...fact.source, publisher: event.target.value },
                  })
                }
              />
            </StudioField>
            <StudioField label="Título da fonte">
              <input
                className={inputClassName}
                value={fact.source?.title ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, {
                    ...fact,
                    source: { ...fact.source, title: event.target.value },
                  })
                }
              />
            </StudioField>
            <StudioField label="URL oficial">
              <input
                type="url"
                className={inputClassName}
                value={fact.source?.url ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, {
                    ...fact,
                    source: { ...fact.source, url: event.target.value },
                  })
                }
              />
            </StudioField>
            <StudioField label="Data de consulta">
              <input
                type="date"
                className={inputClassName}
                value={fact.source?.accessedAt ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateFact(index, {
                    ...fact,
                    source: { ...fact.source, accessedAt: event.target.value },
                  })
                }
              />
            </StudioField>
          </div>
        </StudioSection>
      ))}
      <button
        type="button"
        disabled={disabled || facts.length >= 40}
        onClick={() =>
          onChange({
            ...payload,
            knowledge: [
              ...facts,
              {
                id: generatedId('fato'),
                topic: 'Novo tema',
                difficulty: 'media',
                claim: 'Descreva aqui uma afirmação baseada na fonte oficial.',
                teachingAngle: 'Explique como este fato será trabalhado em aula.',
                explanation: 'Explique o fato com linguagem clara para os alunos.',
                misconceptions: [
                  'Primeiro equívoco controlado para a questão.',
                  'Segundo equívoco controlado para a questão.',
                  'Terceiro equívoco controlado para a questão.',
                ],
                source: {
                  publisher: 'Instituição oficial',
                  title: 'Título da fonte',
                  url: 'https://',
                  accessedAt: new Date().toISOString().slice(0, 10),
                },
                review: {
                  technical: 'source_verified',
                  pedagogical: 'pending_teacher_review',
                },
              },
            ],
          })
        }
        className="min-h-11 rounded-xl bg-amber-400 px-4 text-sm font-black text-slate-950 disabled:opacity-40"
      >
        Adicionar fato para futuras questões
      </button>
    </div>
  );
}

function createCaseTemplate() {
  const caseId = generatedId('personagem');
  return {
    id: caseId,
    name: 'Novo personagem',
    initials: 'NP',
    course: '3º DSA ou 3º DSB',
    habit: 'Descreva o comportamento recorrente',
    goal: 'Descreva a meta do personagem',
    story: 'Descreva a história do personagem, seu contexto e o conflito que será analisado.',
    simulatedBudget: {
      cadenceLabel: 'R$ 0 por semana',
      monthlyAmount: 0,
      goalMonths: 1,
      disclaimer: 'Valores fictícios para exercício pedagógico.',
    },
    sourceFactIds: ['fonte-validada'],
    decisions: Array.from({ length: 5 }, (_, index) => ({
      id: `${caseId}-decisao-${index + 1}`,
      moment: `${index + 1} · Momento da decisão`,
      narrative: 'Descreva o que aconteceu neste momento da história.',
      question: 'Qual análise considera melhor esta decisão?',
      sourceFactIds: ['fonte-validada'],
      options: [1, 2, 3].map((points, optionIndex) => ({
        id: String.fromCharCode(65 + optionIndex),
        points,
        insightLabel: ['Leitura inicial', 'Leitura financeira', 'Leitura sistêmica'][optionIndex],
        label: `Escreva a opção de análise ${points}.`,
        feedback: `Explique por que esta leitura recebe ${points} ponto(s).`,
        principle: 'princípio analisado',
      })),
    })),
  };
}

function CustoVicioEditor({ payload, disabled, onChange }) {
  const cases = payload.cases ?? [];
  const updateCase = (caseIndex, nextCase) =>
    onChange({ ...payload, cases: replaceAt(cases, caseIndex, nextCase) });

  return (
    <div className="space-y-4">
      {cases.map((caseItem, caseIndex) => (
        <StudioSection
          key={caseItem.id}
          title={`Personagem ${caseIndex + 1} · ${caseItem.name}`}
        >
          <div className="flex justify-end">
            <RemoveButton
              disabled={disabled || cases.length <= 3}
              onClick={() =>
                onChange({
                  ...payload,
                  cases: cases.filter((_, index) => index !== caseIndex),
                })
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StudioField label="Nome">
              <input
                className={inputClassName}
                value={caseItem.name ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, { ...caseItem, name: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Iniciais">
              <input
                className={inputClassName}
                value={caseItem.initials ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, { ...caseItem, initials: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Curso / contexto">
              <input
                className={inputClassName}
                value={caseItem.course ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, { ...caseItem, course: event.target.value })
                }
              />
            </StudioField>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <StudioField label="Hábito analisado">
              <input
                className={inputClassName}
                value={caseItem.habit ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, { ...caseItem, habit: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Meta financeira">
              <input
                className={inputClassName}
                value={caseItem.goal ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, { ...caseItem, goal: event.target.value })
                }
              />
            </StudioField>
          </div>
          <StudioField label="História">
            <textarea
              className={textareaClassName}
              value={caseItem.story ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateCase(caseIndex, { ...caseItem, story: event.target.value })
              }
            />
          </StudioField>
          <div className="grid gap-4 md:grid-cols-3">
            <StudioField label="Cadência do gasto">
              <input
                className={inputClassName}
                value={caseItem.simulatedBudget?.cadenceLabel ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, {
                    ...caseItem,
                    simulatedBudget: {
                      ...caseItem.simulatedBudget,
                      cadenceLabel: event.target.value,
                    },
                  })
                }
              />
            </StudioField>
            <StudioField label="Custo mensal simulado">
              <input
                type="number"
                className={inputClassName}
                value={caseItem.simulatedBudget?.monthlyAmount ?? 0}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, {
                    ...caseItem,
                    simulatedBudget: {
                      ...caseItem.simulatedBudget,
                      monthlyAmount: Number(event.target.value),
                    },
                  })
                }
              />
            </StudioField>
            <StudioField label="Prazo da meta (meses)">
              <input
                type="number"
                min="1"
                className={inputClassName}
                value={caseItem.simulatedBudget?.goalMonths ?? 1}
                disabled={disabled}
                onChange={(event) =>
                  updateCase(caseIndex, {
                    ...caseItem,
                    simulatedBudget: {
                      ...caseItem.simulatedBudget,
                      goalMonths: Number(event.target.value),
                    },
                  })
                }
              />
            </StudioField>
          </div>
          <StudioField label="Aviso da simulação">
            <textarea
              className={textareaClassName}
              value={caseItem.simulatedBudget?.disclaimer ?? ''}
              disabled={disabled}
              onChange={(event) =>
                updateCase(caseIndex, {
                  ...caseItem,
                  simulatedBudget: {
                    ...caseItem.simulatedBudget,
                    disclaimer: event.target.value,
                  },
                })
              }
            />
          </StudioField>
          <StudioField label="IDs das fontes do caso" hint="Separe os identificadores por linha.">
            <textarea
              className={textareaClassName}
              value={(caseItem.sourceFactIds ?? []).join('\n')}
              disabled={disabled}
              onChange={(event) =>
                updateCase(caseIndex, {
                  ...caseItem,
                  sourceFactIds: event.target.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
            />
          </StudioField>
          {(caseItem.decisions ?? []).map((decision, decisionIndex) => (
            <div
              key={decision.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-wider text-cyan-300">
                Decisão {decisionIndex + 1}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <StudioField label="Momento">
                  <input
                    className={inputClassName}
                    value={decision.moment ?? ''}
                    disabled={disabled}
                    onChange={(event) => {
                      const decisions = replaceAt(caseItem.decisions, decisionIndex, {
                        ...decision,
                        moment: event.target.value,
                      });
                      updateCase(caseIndex, { ...caseItem, decisions });
                    }}
                  />
                </StudioField>
                <StudioField label="Pergunta">
                  <input
                    className={inputClassName}
                    value={decision.question ?? ''}
                    disabled={disabled}
                    onChange={(event) => {
                      const decisions = replaceAt(
                        caseItem.decisions,
                        decisionIndex,
                        { ...decision, question: event.target.value },
                      );
                      updateCase(caseIndex, { ...caseItem, decisions });
                    }}
                  />
                </StudioField>
              </div>
              <StudioField label="Narrativa da decisão">
                <textarea
                  className={inputClassName}
                  value={decision.narrative ?? ''}
                  disabled={disabled}
                  onChange={(event) => {
                    const decisions = replaceAt(
                      caseItem.decisions,
                      decisionIndex,
                      { ...decision, narrative: event.target.value },
                    );
                    updateCase(caseIndex, { ...caseItem, decisions });
                  }}
                />
              </StudioField>
              <StudioField label="IDs das fontes da decisão" hint="Separe os identificadores por linha.">
                <textarea
                  className={textareaClassName}
                  value={(decision.sourceFactIds ?? []).join('\n')}
                  disabled={disabled}
                  onChange={(event) => {
                    const decisions = replaceAt(caseItem.decisions, decisionIndex, {
                      ...decision,
                      sourceFactIds: event.target.value
                        .split('\n')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    });
                    updateCase(caseIndex, { ...caseItem, decisions });
                  }}
                />
              </StudioField>
              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {decision.options.map((option, optionIndex) => (
                  <div key={option.id} className="space-y-3 rounded-xl border border-slate-800 p-3">
                    <p className="text-xs font-black uppercase tracking-wider text-amber-300">
                      Leitura {option.points} ponto(s)
                    </p>
                    <StudioField label="Texto da opção">
                    <textarea
                      className={textareaClassName}
                      value={option.label ?? ''}
                      disabled={disabled}
                      onChange={(event) => {
                        const options = replaceAt(decision.options, optionIndex, {
                          ...option,
                          label: event.target.value,
                        });
                        const decisions = replaceAt(caseItem.decisions, decisionIndex, {
                          ...decision,
                          options,
                        });
                        updateCase(caseIndex, { ...caseItem, decisions });
                      }}
                    />
                    </StudioField>
                    <StudioField label="Feedback ao aluno">
                      <textarea
                        className={textareaClassName}
                        value={option.feedback ?? ''}
                        disabled={disabled}
                        onChange={(event) => {
                          const options = replaceAt(decision.options, optionIndex, {
                            ...option,
                            feedback: event.target.value,
                          });
                          const decisions = replaceAt(caseItem.decisions, decisionIndex, {
                            ...decision,
                            options,
                          });
                          updateCase(caseIndex, { ...caseItem, decisions });
                        }}
                      />
                    </StudioField>
                    <StudioField label="Princípio analisado">
                      <input
                        className={inputClassName}
                        value={option.principle ?? ''}
                        disabled={disabled}
                        onChange={(event) => {
                          const options = replaceAt(decision.options, optionIndex, {
                            ...option,
                            principle: event.target.value,
                          });
                          const decisions = replaceAt(caseItem.decisions, decisionIndex, {
                            ...decision,
                            options,
                          });
                          updateCase(caseIndex, { ...caseItem, decisions });
                        }}
                      />
                    </StudioField>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </StudioSection>
      ))}
      <button
        type="button"
        disabled={disabled || cases.length >= 12}
        onClick={() => onChange({ ...payload, cases: [...cases, createCaseTemplate()] })}
        className="min-h-11 rounded-xl bg-amber-400 px-4 text-sm font-black text-slate-950 disabled:opacity-40"
      >
        Adicionar personagem com cinco decisões
      </button>
    </div>
  );
}

function IlusaoDinheiroEditor({ payload, disabled, onChange }) {
  const decisions = payload.decisions ?? [];
  return (
    <div className="space-y-4">
      <StudioSection title="Configuração da história">
        <StudioField label="Título da atividade">
          <input
            className={inputClassName}
            value={payload.title ?? ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...payload, title: event.target.value })}
          />
        </StudioField>
        <div className="grid gap-4 md:grid-cols-3">
          <StudioField label="Personagem">
            <input
              className={inputClassName}
              value={payload.characterName ?? ''}
              disabled={disabled}
              onChange={(event) => onChange({ ...payload, characterName: event.target.value })}
            />
          </StudioField>
          <StudioField label="Saldo inicial">
            <input
              type="number"
              className={inputClassName}
              value={payload.initialBalance ?? 0}
              disabled={disabled}
              onChange={(event) => onChange({ ...payload, initialBalance: Number(event.target.value) })}
            />
          </StudioField>
          <StudioField label="Custo da meta">
            <input
              type="number"
              className={inputClassName}
              value={payload.goalCost ?? 0}
              disabled={disabled}
              onChange={(event) => onChange({ ...payload, goalCost: Number(event.target.value) })}
            />
          </StudioField>
        </div>
        <StudioField label="Introdução">
          <textarea
            className={textareaClassName}
            value={payload.introduction ?? ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...payload, introduction: event.target.value })}
          />
        </StudioField>
        <StudioField label="Aviso da simulação">
          <textarea
            className={textareaClassName}
            value={payload.disclaimer ?? ''}
            disabled={disabled}
            onChange={(event) => onChange({ ...payload, disclaimer: event.target.value })}
          />
        </StudioField>
      </StudioSection>
      {decisions.map((decision, decisionIndex) => (
        <StudioSection key={decision.id} title={`Decisão ${decisionIndex + 1} · ${decision.title}`} accent="cyan">
          <StudioField label="Narrativa">
            <textarea
              className={textareaClassName}
              value={decision.narrative ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...payload,
                  decisions: replaceAt(decisions, decisionIndex, {
                    ...decision,
                    narrative: event.target.value,
                  }),
                })
              }
            />
          </StudioField>
          <div className="grid gap-3 lg:grid-cols-3">
            {decision.choices.map((choice, choiceIndex) => (
              <div key={choice.id} className="rounded-xl border border-slate-800 p-3">
                <p className="mb-2 text-xs font-black text-amber-300">
                  Caminho {choice.analysisPoints} ponto(s)
                </p>
                <textarea
                  className={textareaClassName}
                  value={choice.label ?? ''}
                  disabled={disabled}
                  onChange={(event) => {
                    const choices = replaceAt(decision.choices, choiceIndex, {
                      ...choice,
                      label: event.target.value,
                    });
                    onChange({
                      ...payload,
                      decisions: replaceAt(decisions, decisionIndex, {
                        ...decision,
                        choices,
                      }),
                    });
                  }}
                />
                <textarea
                  aria-label={`Consequência do caminho ${choice.analysisPoints}`}
                  className={`${textareaClassName} mt-2`}
                  value={choice.consequence ?? ''}
                  disabled={disabled}
                  onChange={(event) => {
                    const choices = replaceAt(decision.choices, choiceIndex, {
                      ...choice,
                      consequence: event.target.value,
                    });
                    onChange({
                      ...payload,
                      decisions: replaceAt(decisions, decisionIndex, {
                        ...decision,
                        choices,
                      }),
                    });
                  }}
                />
                <input
                  type="number"
                  aria-label="Variação do saldo"
                  className={`${inputClassName} mt-2`}
                  value={choice.balanceDelta ?? 0}
                  disabled={disabled}
                  onChange={(event) => {
                    const choices = replaceAt(decision.choices, choiceIndex, {
                      ...choice,
                      balanceDelta: Number(event.target.value),
                    });
                    onChange({
                      ...payload,
                      decisions: replaceAt(decisions, decisionIndex, {
                        ...decision,
                        choices,
                      }),
                    });
                  }}
                />
              </div>
            ))}
          </div>
        </StudioSection>
      ))}
    </div>
  );
}

function createAdTemplate() {
  const id = generatedId('publicidade');
  return {
    id,
    classification: 'INVENTED',
    title: 'Nova publicidade fictícia',
    advertiser: 'Marca fictícia criada para o Money Rank',
    scenario: 'Descreva a publicidade fictícia que o aluno deverá analisar.',
    channel: 'Peça simulada',
    location: 'Peça fictícia — não foi veiculada',
    observedAt: 'Não se aplica',
    explanation: 'Explique por que esta peça foi inventada e qual risco ela representa.',
    tactic: {
      label: 'Tática de persuasão',
      explanation: 'Explique a tática usada na peça.',
    },
    evidence: null,
    review: { technical: 'project_created', pedagogical: 'pending_teacher_review' },
  };
}

function EngenhariaDesejoEditor({ payload, disabled, onChange }) {
  const cards = payload.cards ?? [];
  const updateCard = (index, nextCard) =>
    onChange({ ...payload, cards: replaceAt(cards, index, nextCard) });
  return (
    <div className="space-y-4">
      {cards.map((card, index) => (
        <StudioSection key={card.id} title={`Peça ${index + 1} · ${card.title}`}>
          <div className="flex flex-wrap justify-between gap-3">
            <select
              className={`${inputClassName} max-w-xs`}
              value={card.classification}
              disabled={disabled}
              onChange={(event) => {
                const classification = event.target.value;
                updateCard(index, {
                  ...card,
                  classification,
                  evidence:
                    classification === 'REAL'
                      ? card.evidence ?? {
                          institution: 'Instituição responsável',
                          title: 'Título da evidência',
                          url: 'https://',
                          accessedAt: new Date().toISOString().slice(0, 10),
                          outcome: 'Aguardando validação',
                        }
                      : null,
                });
              }}
            >
              <option value="REAL">Publicidade real</option>
              <option value="INVENTED">Peça inventada</option>
            </select>
            <RemoveButton
              disabled={disabled || cards.length <= 6}
              onClick={() =>
                onChange({
                  ...payload,
                  cards: cards.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            />
          </div>
          <PedagogicalApproval
            item={card}
            disabled={disabled}
            onChange={(review) => updateCard(index, { ...card, review })}
          />
          <StudioField label="Título">
            <input
              className={inputClassName}
              value={card.title ?? ''}
              disabled={disabled}
              onChange={(event) => updateCard(index, { ...card, title: event.target.value })}
            />
          </StudioField>
          <StudioField label="Cenário da publicidade">
            <textarea
              className={textareaClassName}
              value={card.scenario ?? ''}
              disabled={disabled}
              onChange={(event) => updateCard(index, { ...card, scenario: event.target.value })}
            />
          </StudioField>
          <div className="grid gap-4 md:grid-cols-2">
            <StudioField label="Anunciante">
              <input
                className={inputClassName}
                value={card.advertiser ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, { ...card, advertiser: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Canal">
              <input
                className={inputClassName}
                value={card.channel ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, { ...card, channel: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Local / contexto">
              <input
                className={inputClassName}
                value={card.location ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, { ...card, location: event.target.value })
                }
              />
            </StudioField>
            <StudioField label="Data observada">
              <input
                className={inputClassName}
                value={card.observedAt ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, { ...card, observedAt: event.target.value })
                }
              />
            </StudioField>
          </div>
          <StudioField label="Explicação pedagógica">
            <textarea
              className={textareaClassName}
              value={card.explanation ?? ''}
              disabled={disabled}
              onChange={(event) => updateCard(index, { ...card, explanation: event.target.value })}
            />
          </StudioField>
          <div className="grid gap-4 md:grid-cols-2">
            <StudioField label="Técnica de persuasão">
              <input
                className={inputClassName}
                value={card.tactic?.label ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, {
                    ...card,
                    tactic: { ...card.tactic, label: event.target.value },
                  })
                }
              />
            </StudioField>
            <StudioField label="Análise da técnica">
              <textarea
                className={textareaClassName}
                value={card.tactic?.explanation ?? ''}
                disabled={disabled}
                onChange={(event) =>
                  updateCard(index, {
                    ...card,
                    tactic: { ...card.tactic, explanation: event.target.value },
                  })
                }
              />
            </StudioField>
          </div>
          {card.classification === 'REAL' && (
            <div className="grid gap-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 md:grid-cols-2">
              <StudioField label="Instituição da evidência">
                <input
                  className={inputClassName}
                  value={card.evidence?.institution ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    updateCard(index, {
                      ...card,
                      evidence: { ...card.evidence, institution: event.target.value },
                    })
                  }
                />
              </StudioField>
              <StudioField label="Título da evidência">
                <input
                  className={inputClassName}
                  value={card.evidence?.title ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    updateCard(index, {
                      ...card,
                      evidence: { ...card.evidence, title: event.target.value },
                    })
                  }
                />
              </StudioField>
              <StudioField label="URL da evidência oficial">
                <input
                  type="url"
                  className={inputClassName}
                  value={card.evidence?.url ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    updateCard(index, {
                      ...card,
                      evidence: { ...card.evidence, url: event.target.value },
                    })
                  }
                />
              </StudioField>
              <StudioField label="Data de consulta">
                <input
                  type="date"
                  className={inputClassName}
                  value={card.evidence?.accessedAt ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    updateCard(index, {
                      ...card,
                      evidence: { ...card.evidence, accessedAt: event.target.value },
                    })
                  }
                />
              </StudioField>
              <StudioField label="Resultado da verificação">
                <textarea
                  className={textareaClassName}
                  value={card.evidence?.outcome ?? ''}
                  disabled={disabled}
                  onChange={(event) =>
                    updateCard(index, {
                      ...card,
                      evidence: { ...card.evidence, outcome: event.target.value },
                    })
                  }
                />
              </StudioField>
            </div>
          )}
        </StudioSection>
      ))}
      <button
        type="button"
        disabled={disabled || cards.length >= 40}
        onClick={() => onChange({ ...payload, cards: [...cards, createAdTemplate()] })}
        className="min-h-11 rounded-xl bg-amber-400 px-4 text-sm font-black text-slate-950 disabled:opacity-40"
      >
        Adicionar publicidade fictícia
      </button>
    </div>
  );
}

export default function StructuredActivityEditor({
  activityKey,
  payload,
  disabled,
  onChange,
}) {
  switch (activityKey) {
    case 'perigo-doce-quiz':
      return <PerigoDoceEditor payload={payload} disabled={disabled} onChange={onChange} />;
    case 'custo-vicio':
      return <CustoVicioEditor payload={payload} disabled={disabled} onChange={onChange} />;
    case 'ilusao-dinheiro-caminhos-v1':
      return <IlusaoDinheiroEditor payload={payload} disabled={disabled} onChange={onChange} />;
    case 'engenharia-desejo-fato-fake-v1':
      return <EngenhariaDesejoEditor payload={payload} disabled={disabled} onChange={onChange} />;
    default:
      return <p className="text-sm text-red-300">Editor não disponível.</p>;
  }
}
