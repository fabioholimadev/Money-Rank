import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações oficiais das nossas páginas
import LandingPage from './pages/LandingPage'; 
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login';
import Trilha from './pages/Trilha';
import Ranking from './pages/Ranking';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/trilha" element={<Trilha />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;