import { useState, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Container,
  Button,
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import { red } from "@mui/material/colors";
import MessageForm from "../components/MessageForm";
import MessageHistory from "../components/MessageHistory";
import Settings from "../components/Settings";
import SystemStatus from "../components/SystemStatus";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: red[600],
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        navigate('/login');
        return;
      }
      
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="h6">Cargando...</Typography>
        </Box>
      </ThemeProvider>
    );
  }
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* AppBar */}
        <AppBar position="static" color="primary">
          <Toolbar variant="dense">
            <Box
              sx={{
                bgcolor: "white",
                color: "primary.main",
                width: 36,
                height: 36,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <Typography variant="caption" fontWeight="bold">
                LED
              </Typography>
            </Box>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Control de Tablero LED - UTAL
            </Typography>            <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
              Proyecto de Gestión Tecnológica
            </Typography>
            {user && (
              <Typography variant="body2" color="inherit" sx={{ mr: 2 }}>
                {user.nombre || user.email}
              </Typography>
            )}
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              size="small"
            >
              Cerrar Sesión
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container
          maxWidth={isMobile ? "sm" : "lg"}
          sx={{
            mb: 4,
            bgcolor: "#f5f5f5",
            p: isMobile ? 2 : 3,
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {/* Left Column: Message Form */}
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 3,
            }}
          >
            <Box
              sx={{
                flex: isMobile ? "1 1 auto" : "2 1 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: isMobile ? 2 : 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Enviar Mensaje
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <MessageForm />
              </Paper>
            </Box>

            {/* Right Column: System Status */}
            <Box
              sx={{
                flex: "1 1 auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: isMobile ? 2 : 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Estado del Sistema
                </Typography>
                <Divider />
                <SystemStatus />
              </Paper>
            </Box>
          </Box>

          {/* Bottom Tabs */}
          <Box sx={{ mt: isMobile ? 2 : 3 }}>
            <Paper elevation={3} sx={{ p: isMobile ? 2 : 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                centered={!isMobile}
              >
                <Tab label="Historial de Mensajes" />
                <Tab label="Configuración" />
              </Tabs>
              <Divider />
              <TabPanel value={tabValue} index={0}>
                <MessageHistory />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Settings />
              </TabPanel>
            </Paper>
          </Box>
        </Container>

        {/* Footer */}
        <Box pt={4} mb={2}>
          <Typography variant="body2" color="text.secondary" align="center">
            Desarrollado por: Juan Farias, Nestor Ramirez, Francisco Quevedo, Augusto Fuenzalida - Universidad de
            Talca © 2025
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;