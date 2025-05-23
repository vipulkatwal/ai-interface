import { Box, Button, Typography, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 5, borderRadius: 5, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
          <Box mb={3}>
            <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png" alt="AI Bot" width={64} height={64} />
          </Box>
          <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
            AI Chat Interface
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Your all-in-one AI assistant with plugins for weather, math, and more.
          </Typography>
          <Box textAlign="left" mb={4}>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>Features:</Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li><Typography variant="body1">💬 Modern, premium chat UI</Typography></li>
              <li><Typography variant="body1">🔌 Plugin system: Weather, Calculator, Dictionary</Typography></li>
              <li><Typography variant="body1">🕒 Chat history & persistence</Typography></li>
              <li><Typography variant="body1">✨ Extensible & open source</Typography></li>
            </ul>
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 3, px: 5, py: 1.5, fontSize: '1.2rem', fontWeight: 600, boxShadow: 3 }}
            onClick={() => navigate('/chat')}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}