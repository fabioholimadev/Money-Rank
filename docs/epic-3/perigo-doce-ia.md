# Task 3.5 — Base científica e Firebase AI Logic

## Objetivo

O quiz **O Perigo Doce** usa o Gemini para criar cinco questões de múltipla
escolha a partir de uma base científica controlada. O modelo não decide
pontuação, aprovação, streak ou CapiCoins. Essas regras continuam no Firebase
SQL Connect.

Se a IA estiver desativada, sem App Check, sem autenticação, indisponível ou
retornar um formato inválido, a atividade entra automaticamente no **modo local
seguro**. Esse modo monta questões com os mesmos fatos e equívocos controlados,
sem consultar conhecimento externo.

## Fluxo de pesquisa e validação do professor

O professor não precisa começar fornecendo toda a pesquisa. O fluxo acordado é:

1. Codex e Gemini ajudam a localizar e organizar informações em fontes
   primárias ou institucionais.
2. O desenvolvedor registra cada afirmação com fonte, URL, data de acesso e
   objetivo pedagógico em `frontend/src/data/perigoDoceKnowledge.js`.
3. A validação técnica confere se a afirmação é sustentada pela fonte.
4. O professor valida linguagem, nível de dificuldade e adequação à aula.
5. Somente após essa revisão o status pedagógico muda de
   `pending_teacher_review` para `teacher_approved`.

O Gemini não pesquisa a internet durante a tentativa do aluno. Ele recebe uma
base já revisada e deve usar estritamente os fatos enviados no prompt. Isso
evita que conteúdo novo e não aprovado apareça no quiz.

## Fontes da versão 2026-08-01

- Organização Mundial da Saúde: recomendação de ingestão de açúcares livres e
  diretrizes de políticas fiscais para dietas saudáveis.
- Anvisa: regras e objetivos da rotulagem nutricional frontal.
- Ministério da Saúde: Guia Alimentar para a População Brasileira.
- Câmara dos Deputados: Lei Complementar nº 214/2025 e Imposto Seletivo.
- Organização Pan-Americana da Saúde: efeitos sanitários e econômicos da
  tributação de bebidas açucaradas.
- Banco Mundial: indicadores para avaliar e desenhar impostos sobre bebidas
  açucaradas.

Os endereços completos e as datas de acesso ficam junto de cada fato no arquivo
da base, permitindo auditoria e atualização sem procurar referências em outros
lugares.

## Segurança e privacidade

- O projeto usa o Gemini Developer API por meio do SDK Web `firebase/ai`.
- O provedor do Firebase AI Logic está ativado no projeto `money-rank`.
- A configuração remota `security.auth-only` está ativa: somente usuários
  autenticados podem solicitar uma geração.
- A geração ao vivo exige Firebase App Check. A pré-produção usa token debug e
  a produção usará reCAPTCHA Enterprise.
- Durante a pré-produção local, o App Check usa um token de depuração
  registrado no Firebase; esse token nunca entra no Git.
- Nome, e-mail, UID, turma e foto não entram no prompt.
- O contexto contém apenas fase atual, saldo, streak e status recentes da
  trilha.
- O JSON retornado passa por schema estruturado e por uma segunda validação no
  cliente antes de ser renderizado.
- Falhas nunca liberam moedas; a recompensa depende do resultado salvo pelo SQL
  Connect.

## Variáveis locais

Durante o desenvolvimento, as opções são mantidas em um arquivo local ignorado
pelo Git:

```dotenv
VITE_FIREBASE_AI_ENABLED=true
VITE_FIREBASE_AI_MODEL=gemini-3.6-flash
VITE_FIREBASE_APPCHECK_DEBUG=true
VITE_FIREBASE_APPCHECK_DEBUG_TOKEN=TOKEN_SECRETO_REGISTRADO
```

`VITE_FIREBASE_APPCHECK_DEBUG=true` e o token só podem ser usados localmente.
Em produção, o deploy precisa definir `VITE_FIREBASE_APPCHECK_DEBUG=false` e
usar `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` com uma chave pública registrada.

Não é necessário adicionar uma chave da Gemini API ao `.env.local`: a chamada
é mediada pelo Firebase AI Logic e protegida por Auth e App Check.

## Testes

Validação automatizada da base e do fallback:

```powershell
cd frontend
npm run test:perigo-doce-ai
npm run lint
npm run build
```

Teste manual em modo local seguro:

1. Mantenha `VITE_FIREBASE_AI_ENABLED=false`.
2. Execute `npm run dev` e entre com Google.
3. Conclua os conteúdos da Fase 1 e abra o quiz.
4. Confirme o selo **Modo local seguro**, cinco questões e quatro alternativas
   por questão.
5. Recarregue a atividade e confira que a seleção pode variar.
6. Conclua com três ou mais acertos e confira tentativa, saldo e streak no SQL
   Connect.

Teste manual com IA:

1. Confirme que o token local está registrado no App Check e que as variáveis
   de desenvolvimento estão ativas.
2. Reinicie o Vite e abra o quiz com um usuário autenticado.
3. Confirme o selo **Gerado pela IA com fontes validadas**.
4. Verifique que as cinco questões possuem uma resposta correta e explicação.
5. Simule indisponibilidade desativando a rede antes de recarregar; o quiz deve
   continuar no modo local seguro.

As ações obrigatórias antes da publicação ficam registradas em
`docs/deploy/checklist-producao.md`.
