/**
 * BIBLIOTECA DE COMPONENTES INTERATIVOS - MONEY RANK
 * Documentação de Uso para Trilhas Gamificadas
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
 * 1. InfograficoLata.jsx (Trilha 1 - O Perigo Doce)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PROPÓSITO:
 * Raio-X interativo mostrando a composição de custos/impostos de um energético
 * 
 * PROPS:
 * - onComplete(resultado): Callback executado quando aluno clica em "Avançar"
 *   Returns: { tipo: 'infografico_lata', revelado: true }
 * 
 * FLUXO:
 * 1. Aluno vê a silhueta da lata (visual clicável)
 * 2. Ao clicar, a composição é revelada em 4 categorias com cores
 * 3. Mostra % de açúcar, impostos, custo de produção, margem comercial
 * 4. Exibe insight educativo sobre impostos embutidos
 * 5. Botão "Avançar" dispara onComplete()
 * 
 * EXEMPLO:
 * import InfograficoLata from '@/components/InfograficoLata';
 * <InfograficoLata onComplete={(r) => handleFaseCompleta(r)} />
 * 
 */

/*
 * 2. VideoPlayerEmbed.jsx (Trilhas 1 e 4)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PROPÓSITO:
 * Player de vídeo responsivo em formato vertical (9/16) com confirmação
 * 
 * PROPS:
 * - url (string): URL do YouTube ou arquivo de vídeo
 *   Exemplos: 
 *   YouTube: "https://www.youtube.com/embed/VIDEO_ID"
 *   Local: "/videos/aula.mp4"
 * - onComplete(resultado): Executado após assistir todo vídeo
 *   Returns: { tipo: 'video_player', visualizado: true }
 * 
 * FLUXO:
 * 1. Exibe container vertical com sobreposição "Play"
 * 2. Ao clicar play, inicia reprodução
 * 3. Após 2 segundos de reprodução, marca como "Visualizado"
 * 4. Botão "Confirmar Visualização" ativa onComplete()
 * 
 * EXEMPLO:
 * <VideoPlayerEmbed 
 *   url="https://www.youtube.com/embed/dQw4w9WgXcQ"
 *   onComplete={(r) => handleVideoAssistido(r)}
 * />
 * 
 */

/*
 * 3. CaixaQuiz.jsx (Trilhas 1 e 4)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PROPÓSITO:
 * Quiz de múltipla escolha com feedback visual instantâneo
 * 
 * PROPS:
 * - pergunta (string): Texto da questão
 * - alternativas (array): Lista de opções
 *   Formato: [
 *     { 
 *       texto: "Opção A",
 *       justificativa: "Explicação detalhada..."
 *     },
 *     ...
 *   ]
 * - respostaCorreta (number): Índice da resposta correta (0, 1, 2, 3...)
 * - onComplete(resultado): Callback ao responder
 *   Returns: { tipo: 'quiz', resposta: 0, acertou: true, pergunta: "..." }
 * 
 * FLUXO:
 * 1. Exibe pergunta e 4 alternativas como botões clicáveis
 * 2. Ao clicar, desabilita seleção e mostra feedback:
 *    - Resposta correta: borda verde + CheckCircle + justificativa
 *    - Resposta errada: borda vermelha + X + justificativa
 * 3. Botão "Próxima Etapa" dispara onComplete()
 * 
 * EXEMPLO:
 * <CaixaQuiz
 *   pergunta="Qual é a principal função do imposto ICMS?"
 *   alternativas={[
 *     { 
 *       texto: "Aumentar o preço dos produtos", 
 *       justificativa: "ICMS é um imposto sobre vendas que..." 
 *     },
 *     ...
 *   ]}
 *   respostaCorreta={2}
 *   onComplete={(r) => console.log(r)}
 * />
 * 
 */

/*
 * 4. CardDecisao.jsx (Trilhas 1, 2 e 3)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PROPÓSITO:
 * Dilema moral/financeiro com impacto visual em CapiCoins
 * 
 * PROPS:
 * - cenario (string): Título do dilema (ex: "O Dilema do Sextou")
 * - descricao (string): Contexto da situação
 * - opcaoA (string): Texto da primeira opção
 * - opcaoB (string): Texto da segunda opção
 * - impactoA (number): Ganho/perda de CapiCoins da opção A (pode ser negativo)
 * - impactoB (number): Ganho/perda de CapiCoins da opção B
 * - onComplete(resultado): Callback após escolher
 *   Returns: { tipo: 'decisao', escolha: 'A'|'B', impacto: 50 ou -150 }
 * 
 * FLUXO:
 * 1. Exibe cenário e descrita da situação
 * 2. Dois botões grandes lado a lado (mobile: empilhados)
 * 3. Cada botão mostra impacto em CapiCoins com ícone trending
 * 4. Ao clicar, botão fica destacado com border colorida
 * 5. Exibe feedback "Ótima escolha" ou "Essa decisão custou caro"
 * 6. Botão "Continuar Trilha" dispara onComplete()
 * 
 * EXEMPLO:
 * <CardDecisao
 *   cenario="O Dilema do Sextou"
 *   descricao="Você recebeu R$ 100 de mesada. Um amigo quer brincar na máquina caça-níqueis."
 *   opcaoA="Gastar tudo na máquina"
 *   opcaoB="Poupar e investir em renda fixa"
 *   impactoA={-100}
 *   impactoB={50}
 *   onComplete={(r) => handleDecisao(r)}
 * />
 * 
 */

/*
 * 5. AnalisadorPropaganda.jsx (Trilhas 3 e 4)
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PROPÓSITO:
 * Análise interativa de propaganda com hotspots para encontrar pegadinhas
 * 
 * PROPS:
 * - imagemUrl (string): URL da imagem de propaganda
 * - titulo (string): Título da análise
 * - descricao (string): Contexto/instruções
 * - hotspots (array): Lista de pontos clicáveis
 *   Formato: [
 *     { 
 *       id: 1,
 *       x: 25,           // Posição em % (horizontal)
 *       y: 40,           // Posição em % (vertical)
 *       label: "Letras Miúdas",
 *       explicacao: "Informações importantes escondidas em font pequeno..."
 *     },
 *     ...
 *   ]
 * - onComplete(resultado): Callback ao encontrar todos os hotspots
 *   Returns: { tipo: 'analisador_propaganda', hotspots_encontrados: 3, total: 3, completo: true }
 * 
 * FLUXO:
 * 1. Exibe imagem com hotspots invisíveis (botões subtis)
 * 2. Aluno clica nos pontos dourados espalhados na imagem
 * 3. Cada clique revela um card com label + explicação
 * 4. Barra de progresso mostra quantos hotspots foram encontrados
 * 5. Ao encontrar todos, exibe botão "Análise Completa! Avançar"
 * 6. onComplete() é disparado
 * 
 * EXEMPLO:
 * <AnalisadorPropaganda
 *   imagemUrl="/propaganda-aposta.jpg"
 *   titulo="Análise: Propaganda de Apostas Online"
 *   descricao="Encontre 3 técnicas de neuromarketing usadas nesta propaganda"
 *   hotspots={[
 *     { 
 *       id: 1, x: 15, y: 20, 
 *       label: "Gatilho de Urgência",
 *       explicacao: "Frases como 'Faltam 5 minutos' criam pressão psicológica..."
 *     },
 *     { 
 *       id: 2, x: 85, y: 60,
 *       label: "Letras Miúdas",
 *       explicacao: "Os termos e condições estão em fonte diminuta..."
 *     },
 *     { 
 *       id: 3, x: 50, y: 80,
 *       label: "Celebridade/Influencer",
 *       explicacao: "Usar celebridades cria confiança artificial..."
 *     }
 *   ]}
 *   onComplete={(r) => handleAnaliseConcluida(r)}
 * />
 * 
 */

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * GUIA DE INTEGRAÇÃO EM Trilha.jsx
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PASSO 1: Importar componentes no topo do arquivo
 * 
 * import InfograficoLata from '@/components/InfograficoLata';
 * import VideoPlayerEmbed from '@/components/VideoPlayerEmbed';
 * import CaixaQuiz from '@/components/CaixaQuiz';
 * import CardDecisao from '@/components/CardDecisao';
 * import AnalisadorPropaganda from '@/components/AnalisadorPropaganda';
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PASSO 2: Criar estado para rastrear progresso
 * 
 * const [etapaAtual, setEtapaAtual] = useState(0);
 * const [resultados, setResultados] = useState([]);
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PASSO 3: Criar função callback para cada componente
 * 
 * const handleComponentComplete = (resultado) => {
 *   console.log('Componente concluído:', resultado);
 *   setResultados([...resultados, resultado]);
 *   setEtapaAtual(etapaAtual + 1);
 *   
 *   // Enviar para backend se necessário
 *   if (resultado.acertou !== undefined) {
 *     // É um quiz
 *     chamarAPIGamificacao('quiz', resultado);
 *   }
 * };
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * PASSO 4: Renderizar componentes condicionalmente
 * 
 * {etapaAtual === 0 && (
 *   <InfograficoLata onComplete={handleComponentComplete} />
 * )}
 * 
 * {etapaAtual === 1 && (
 *   <CaixaQuiz
 *     pergunta="Qual é o imposto mais importante..."
 *     alternativas={[...]}
 *     respostaCorreta={2}
 *     onComplete={handleComponentComplete}
 *   />
 * )}
 * 
 * {etapaAtual === 2 && (
 *   <CardDecisao
 *     cenario="O Dilema do Sextou"
 *     descricao="..."
 *     opcaoA="..." opcaoB="..."
 *     impactoA={-100} impactoB={50}
 *     onComplete={handleComponentComplete}
 *   />
 * )}
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * DESIGN SYSTEM:
 * - Cores de Fundo: bg-slate-950, bg-zinc-900/80, bg-zinc-900/40
 * - Bordas: border-zinc-800
 * - Destaques Dourados: text-amber-400, bg-amber-400/10, border-amber-400/30
 * - Acertos: border-green-500, bg-green-500/10, text-green-300
 * - Erros: border-red-500, bg-red-500/10, text-red-300
 * - Cantos: rounded-2xl, rounded-3xl
 * - Sombras: shadow-lg, shadow-amber-500/20
 * 
 */
