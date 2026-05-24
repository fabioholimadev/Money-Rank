import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowBack, Map } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function Trilha() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/student')}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Voltar ao Dashboard
        </Button>

        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Map sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Trilhas Dinâmicas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Este módulo será reconstruído com o novo sistema de Gamificação.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}