import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importações oficiais das nossas páginas
import LandingPage from './pages/LandingPage'; 
import StudentDashboard from './pages/StudentDashboard';
import Login from './pages/Login'; // ← A PEÇA QUE FALTAVA AQUI!

// Componentes simples (placeholders) que ainda vamos criar
const AdminDashboard = () => <div className="p-10 text-xl text-purple-600">⚙️ Dashboard do Admin (Controle)</div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;