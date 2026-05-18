const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Abre o cofre (.env) para pegar as senhas

const app = express();
const PORT = process.env.PORT || 3000;

// Pegando as chaves do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificando se as chaves existem para evitar erros
if (!supabaseUrl || !supabaseKey) {
  console.error("⚠️  Faltam as chaves do Supabase no arquivo .env!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configurações de segurança e comunicação
app.use(cors()); // Permite que o Front-end (porta 5174) fale com este Back-end (porta 3000)
app.use(express.json());

// Importando as nossas rotas e passando o Supabase para elas
const authRoutes = require('./routes/authRoutes')(supabase);
const gameRoutes = require('./routes/gameRoutes')(supabase);
const adminRoutes = require('./routes/adminRoutes')(supabase);

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('🚀 Servidor do Money Rank rodando perfeitamente!');
});

// Ligando o servidor
app.listen(PORT, () => {
  console.log(`Servidor do Back-end rodando em: http://localhost:${PORT}`);
});