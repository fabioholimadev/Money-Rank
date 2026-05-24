import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações oficiais das nossas páginas
import LandingPage from './pages/LandingPage'; 
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Trilha from './pages/Trilha';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/trilha" element={<ProtectedRoute><Trilha /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;