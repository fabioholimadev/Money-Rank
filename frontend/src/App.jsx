import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

// Páginas protegidas
import StudentDashboard from './pages/StudentDashboard';
import TrilhaHub from './pages/Trilha/TrilhaHub';
import ConteudoPerigoDoce from './pages/Trilha/SaudeConsumo/PerigoDoce/Conteudo';
import AtividadeQuiz from './pages/Trilha/SaudeConsumo/PerigoDoce/AtividadeQuiz';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';

// Infraestrutura de layout
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Rotas públicas (sem TopBar / BottomNav) ──────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ── Rotas protegidas (com Layout = TopBar + BottomNav + CapiMentor) ── */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/trilha" element={<TrilhaHub />} />
          <Route path="/trilha/saude-consumo/perigo-doce/conteudo" element={<ConteudoPerigoDoce />} />
          <Route path="/trilha/saude-consumo/perigo-doce/atividade" element={<AtividadeQuiz />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
