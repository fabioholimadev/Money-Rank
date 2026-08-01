# Modelo de materiais das fases

Este documento define o formato que deve ser seguido ao preparar o conteúdo de uma fase do Money Rank.

## Estrutura obrigatória

Cada fase deve possuir:

1. um vídeo publicado;
2. um espaço para slides;
3. um espaço para resumo ou documento.

O vídeo é obrigatório. Pelo menos um dos dois materiais extras, slides ou resumo/documento, também deve estar publicado. Um espaço ainda não preenchido permanece visível para deixar claro qual material pode ser adicionado depois, mas não bloqueia o aluno quando o outro material extra está disponível.

O Passo 0 é a única exceção: ele continua sendo uma introdução composta apenas por vídeo.

## Informações de cada material

Preencha os seguintes campos:

- **Título:** nome exibido ao aluno;
- **Descrição:** resumo de uma ou duas frases;
- **Objetivo pedagógico:** conhecimento que o aluno deve adquirir;
- **Formato:** YouTube, Google Slides, PDF, DOCX ou Google Docs;
- **URL:** endereço público ou link de incorporação;
- **Fonte e autoria:** instituição ou pessoa responsável;
- **Tempo estimado:** minutos necessários;
- **Versão:** versão do material;
- **Data de atualização:** data da última revisão;
- **Referências:** fontes usadas na produção.

## Modelo para preenchimento

```text
Fase:
Título do material:
Tipo: Vídeo | Slides | Resumo/Documento
Descrição:
Objetivo pedagógico:
Formato:
URL:
Fonte/autor:
Tempo estimado:
Versão:
Data de atualização:
Referências:
Observações para a atividade:
```

## Regra de conclusão no sistema

Para liberar a atividade, o aluno deve acessar o vídeo e pelo menos um material extra publicado. Depois disso, deve confirmar que concluiu o conteúdo.

A primeira conclusão concede 20 CapiCoins. Revisões continuam liberadas, mas não concedem uma nova recompensa.

## Ambiente local no Windows

Quando a política de Controle de Aplicativos do Windows bloquear o executável sem assinatura do emulador SQL Connect, inicie a versão Linux isolada pelo Docker:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-dataconnect-docker.ps1
```

O script expõe o emulador em `127.0.0.1:9399`, o mesmo endereço esperado pelo frontend. O terminal deve permanecer aberto durante o teste.
