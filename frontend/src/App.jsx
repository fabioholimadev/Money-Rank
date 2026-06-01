import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações oficiais das nossas páginas
import LandingPage from './pages/LandingPage'; 
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import TrilhaHub from './pages/Trilha/TrilhaHub';
import ConteudoPerigoDoce from './pages/Trilha/SaudeConsumo/PerigoDoce/Conteudo';
import AtividadeQuiz from './pages/Trilha/SaudeConsumo/PerigoDoce/AtividadeQuiz';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import CapiMentor from './components/CapiMentor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/trilha" element={<ProtectedRoute><TrilhaHub /></ProtectedRoute>} />
        <Route path="/trilha/saude-consumo/perigo-doce/conteudo" element={<ProtectedRoute><ConteudoPerigoDoce /></ProtectedRoute>} />
        <Route path="/trilha/saude-consumo/perigo-doce/atividade" element={<ProtectedRoute><AtividadeQuiz /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      </Routes>
      <CapiMentor />
    </Router>
  );
}

export default App;