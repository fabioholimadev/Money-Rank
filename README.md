# 🏆 Money Rank

> Formando a próxima geração de jovens financeiramente livres.

O **Money Rank** é uma plataforma educacional gamificada (estilo Duolingo) focada em ensinar Educação Financeira e Fiscal para a Geração Z. O projeto visa combater a "ilusão fiscal" brasileira, ensinando de forma prática e visual como os impostos sobre o consumo (ICMS, IBS, CBS) impactam o dia a dia e financiam serviços essenciais como o SUS e a educação.

## 🎯 O Problema que Resolvemos
* **46,7%** dos jovens de 15 anos no Brasil estão no nível mais básico de letramento financeiro mundial (PISA 2022).
* **74%** dos brasileiros não sabem o quanto pagam de impostos embutidos nas compras diárias.
* **90%** dos estudantes desconhecem o conceito de sonegação fiscal e o impacto disso nos serviços públicos.

## ✨ Funcionalidades (Features)
* **Trilhas Pedagógicas:** Aprenda sobre tributos e controle de gastos em missões curtas e interativas.
* **Sistema de Recompensas:** Ganhe moedas (XP) ao desvendar impostos ocultos em cupons fiscais.
* **Impacto Social Visível:** Mecânica que mostra o dinheiro dos impostos virtuais sendo convertido em infraestrutura de saúde e educação.
* **Autenticação Segura:** Acesso exclusivo com conta Google pelo Firebase Auth.

## 🚀 Tecnologias Utilizadas

**Front-end:**
* React (Vite)
* Tailwind CSS
* React Router DOM
* Firebase Authentication

**Back-end & Banco de Dados:**
* Node.js com Express
* Firebase SQL Connect (PostgreSQL, em migração)
* CORS & Dotenv

## 🔐 Configuração do Firebase Auth

O aplicativo Web `Money Rank Web` está registrado no projeto Firebase
`money-rank`. Para executar o login localmente:

1. Acesse o [Firebase Console do projeto Money Rank](https://console.firebase.google.com/project/money-rank/authentication/providers).
2. Abra **Authentication > Sign-in method**.
3. Ative o provedor **Google**.
4. Selecione o e-mail de suporte do projeto e salve.
5. Em **Authentication > Settings > Authorized domains**, confirme que
   `localhost` está autorizado.
6. No terminal, execute:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

O frontend usa a API modular do Firebase e observa a sessão pelo
`onAuthStateChanged`. Nenhuma senha do Google é recebida ou armazenada pelo
Money Rank.

### Teste local do login

1. Acesse `http://localhost:5173/login`.
2. Clique em **Continuar com o Google** e selecione uma conta.
3. Confirme o redirecionamento para `/completar-perfil` no primeiro acesso ou
   para `/student` quando o perfil já estiver completo.
4. Recarregue a página e confirme que a sessão continua ativa.
5. Clique em **Sair** e confirme o retorno para `/login`.
6. Sem uma sessão ativa, acesse `/student` diretamente e confirme o
   redirecionamento para `/login`.

## 👤 Fluxo de completar perfil

Depois do primeiro login com Google, o aluno é direcionado automaticamente para
`/completar-perfil`. Para liberar as áreas do jogo, ele deve:

1. Confirmar ou alterar o nome preferido.
2. Selecionar **3º DSA** ou **3º DSB** na caixa de turma.
3. Escolher uma Capi profissional ou enviar uma foto JPG, PNG ou WebP de até
   5 MB.
4. Clicar em **Concluir e começar**.

O nome preferido também é atualizado no perfil básico do Firebase Auth. Durante
a migração, turma, avatar, foto e estado de conclusão ficam no armazenamento
local, separados pelo `uid` do Firebase. A foto enviada é recortada, reduzida
para 320 × 320 pixels e convertida para JPEG antes de ser salva no navegador.
Esses campos serão migrados para o PostgreSQL e para o armazenamento definitivo
nas Tasks 2.1 e 2.2 do Firebase SQL Connect.

### Teste local do perfil

1. Entre com uma conta Google que ainda não tenha perfil local.
2. Confirme o redirecionamento de `/student` para `/completar-perfil`.
3. Tente enviar o formulário vazio e confirme as mensagens de validação.
4. Preencha o nome, selecione **3º DSA** e escolha uma Capi profissional.
5. Confirme o redirecionamento para `/student` e a Capi no dashboard.
6. Recarregue a página e confirme que o perfil continua completo.
7. Acesse `/perfil`, troque a turma para **3º DSB** e envie uma foto válida.
8. Confirme a prévia quadrada da foto, salve e recarregue a página.
9. Tente enviar um arquivo que não seja imagem ou uma imagem acima de 5 MB e
   confirme que o formulário exibe a validação sem perder o perfil atual.
