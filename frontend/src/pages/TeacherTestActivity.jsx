import { Navigate, useParams } from 'react-router-dom';
import AuthoritativeActivityRunner from '../components/trail/AuthoritativeActivityRunner';

const ACTIVITIES = Object.freeze({
  1: ['O Perigo Doce', 'amber'],
  2: ['O Custo do Vício', 'amber'],
  3: ['A Ilusão do Dinheiro', 'cyan'],
  4: ['A Engenharia do Desejo', 'cyan'],
});

export default function TeacherTestActivity() {
  const phase = Number(useParams().phase);
  const activity = ACTIVITIES[phase];
  if (!activity) return <Navigate replace to="/professor" />;
  return <AuthoritativeActivityRunner phaseNumber={phase} title={activity[0]} accent={activity[1]} testMode />;
}
