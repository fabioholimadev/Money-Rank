import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Olha a diferença aqui: agora avisamos que eles estão dentro da pasta "pages"
import LandingPage from './pages/LandingPage'; 
import StudentDashboard from './pages/StudentDashboard';

// Componentes simples (placeholders) que ainda vamos criar
const Login = () => <div className="p-10 text-xl text-blue-600">🔑 Tela de Login/Cadastro</div>;
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