import { Box, Button, Typography, Container, Paper, Fade } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Sora, Inter, system-ui, sans-serif',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* SVG Wave Background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }}>
        <svg viewBox="0 0 1440 320" width="100%" height="180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#fff" fillOpacity="0.18" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
      </Box>
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Fade in={show} timeout={900}>
          <Paper elevation={8} sx={{
            p: { xs: 3, sm: 6 },
            borderRadius: 6,
            textAlign: 'center',
            bgcolor: 'rgba(255,255,255,0.55)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            transition: 'box-shadow 0.3s',
          }}>
            <Box mb={3}>
              <img src="/logo192.png" alt="AI Bot" width={72} height={72} style={{ filter: 'drop-shadow(0 2px 8px #1976d2aa)' }} />
            </Box>
            <Typography variant="h2" fontWeight={700} color="primary.main" gutterBottom sx={{ fontFamily: 'Sora, Inter, system-ui, sans-serif' }}>
              AI Chat Interface
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3} sx={{ fontWeight: 400 }}>
              Your all-in-one AI assistant with plugins for weather, math, and more.
            </Typography>
            <Box textAlign="left" mb={4}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Features:</Typography>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '1.1rem', fontWeight: 500 }}>
                <li>💬 Modern, premium chat UI</li>
                <li>🔌 Plugin system: Weather, Calculator, Dictionary</li>
                <li>🕒 Chat history & persistence</li>
                <li>✨ Extensible & open source</li>
              </ul>
            </Box>
            <Button
              variant="contained"
              size="large"
              endIcon={<RocketLaunchIcon />}
              sx={{
                borderRadius: 3,
                px: 5,
                py: 1.5,
                fontSize: '1.2rem',
                fontWeight: 700,
                boxShadow: 4,
                background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                color: 'white',
                letterSpacing: 1,
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate('/chat')}
            >
              Get Started
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}