import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

// Páginas públicas
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';

// Páginas protegidas
import StudentDashboard from './pages/StudentDashboard';
import TrilhaHub from './pages/Trilha/TrilhaHub';
import ConteudoIntroducao from './pages/Trilha/SaudeConsumo/Introducao/Conteudo';
import ConteudoPerigoDoce from './pages/Trilha/SaudeConsumo/PerigoDoce/Conteudo';
import AtividadeQuiz from './pages/Trilha/SaudeConsumo/PerigoDoce/AtividadeQuiz';
import ConteudoCustoVicio from './pages/Trilha/SaudeConsumo/CustoVicio/Conteudo';
import AtividadeCaso from './pages/Trilha/SaudeConsumo/CustoVicio/AtividadeCaso';
import ConteudoIlusaoDinheiro from './pages/Trilha/SaudeConsumo/IlusaoDinheiro/Conteudo';
import AtividadeCaminhos from './pages/Trilha/SaudeConsumo/IlusaoDinheiro/AtividadeCaminhos';
import ConteudoEngenhariaDesejo from './pages/Trilha/SaudeConsumo/EngenhariaDesejo/Conteudo';
import AtividadeFatoFake from './pages/Trilha/SaudeConsumo/EngenhariaDesejo/AtividadeFatoFake';
import Ranking from './pages/Ranking';
import Perfil from './pages/Perfil';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherStudio from './pages/TeacherStudio';
import TeacherTestActivity from './pages/TeacherTestActivity';

// Infraestrutura de layout
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { USER_ROLES } from './lib/roleAccess';

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Rotas públicas (sem TopBar / BottomNav) ──────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/completar-perfil"
          element={
            <ProtectedRoute requireCompleteProfile={false}>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/cadastro" element={<Navigate to="/login" replace />} />
        <Route path="/esqueci-senha" element={<Navigate to="/login" replace />} />
        <Route path="/redefinir-senha" element={<Navigate to="/login" replace />} />

        {/* ── Rotas protegidas (com Layout = TopBar + BottomNav + CapiMentor) ── */}
        <Route
          element={
            <ProtectedRoute requiredRole={USER_ROLES.STUDENT}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/trilha" element={<TrilhaHub />} />
          <Route
            path="/trilha/saude-consumo/introducao/conteudo"
            element={<ConteudoIntroducao />}
          />
          <Route path="/trilha/saude-consumo/perigo-doce/conteudo" element={<ConteudoPerigoDoce />} />
          <Route path="/trilha/saude-consumo/perigo-doce/atividade" element={<AtividadeQuiz />} />
          <Route
            path="/trilha/saude-consumo/custo-vicio/conteudo"
            element={<ConteudoCustoVicio />}
          />
          <Route
            path="/trilha/saude-consumo/custo-vicio/atividade"
            element={<AtividadeCaso />}
          />
          <Route
            path="/trilha/saude-consumo/ilusao-dinheiro/conteudo"
            element={<ConteudoIlusaoDinheiro />}
          />
          <Route
            path="/trilha/saude-consumo/ilusao-dinheiro/atividade"
            element={<AtividadeCaminhos />}
          />
          <Route
            path="/trilha/saude-consumo/engenharia-desejo/conteudo"
            element={<ConteudoEngenhariaDesejo />}
          />
          <Route
            path="/trilha/saude-consumo/engenharia-desejo/atividade"
            element={<AtividadeFatoFake />}
          />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        <Route
          path="/professor"
          element={
            <ProtectedRoute requiredRole={USER_ROLES.TEACHER}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/estudio"
          element={
            <ProtectedRoute requiredRole={USER_ROLES.TEACHER}>
              <TeacherStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/teste/:phase"
          element={
            <ProtectedRoute requiredRole={USER_ROLES.TEACHER}>
              <TeacherTestActivity />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
