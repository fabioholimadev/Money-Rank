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
3. Confirme o redirecionamento para `/student`.
4. Recarregue a página e confirme que a sessão continua ativa.
5. Clique em **Sair** e confirme o retorno para `/login`.
6. Sem uma sessão ativa, acesse `/student` diretamente e confirme o
   redirecionamento para `/login`.
