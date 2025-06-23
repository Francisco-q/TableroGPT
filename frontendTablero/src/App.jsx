import { useState, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import { red } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import MessagePred from "./components/MessagePred";
import MessageForm from "./components/MessageForm";
import MessageHistory from "./components/MessageHistory";
import Settings from "./components/Settings";
import SystemStatus from "./components/SystemStatus";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import WeeklyScheduler from "./components/WeeklyScheduler";
import { connectMQTT } from "./mqttClient";
import mqtt from "mqtt";

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

const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const publishToAllBoards = (mensaje) => {
    const tableros = JSON.parse(localStorage.getItem("tableros") || "[]");
    tableros.forEach(({ ip, port, topic }) => {
      const brokerUrl = `ws://${ip}:${port}`;
      const client = mqtt.connect(brokerUrl);

      client.on("connect", () => {
        client.publish(topic, JSON.stringify(mensaje), () => client.end());
      });

      client.on("error", (err) => {
        console.error(`❌ Error conectando a ${ip}:${port} -`, err.message);
      });
    });
  };

  const handleAddSchedule = (newSchedule) => {
    const overlap = schedules.some(s =>
      s.day === newSchedule.day &&
      (newSchedule.start < s.end && newSchedule.end > s.start)
    );
    if (overlap) {
      alert("Ya existe un mensaje programado que se solapa con ese horario.");
      return;
    }
    setSchedules((prev) => [...prev, newSchedule]);

    publishToAllBoards({
      message: newSchedule.message,
      color: "white",
      effect: "scroll",
      speed: 3,
    });
  };

  const handleDeleteSchedule = (idx) => {
    setSchedules(prev => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) {
      setEditIdx(null);
      setEditData({});
    }
  };

  const handleSaveEdit = (idx) => {
    const overlap = schedules.some((s, i) =>
      i !== idx &&
      s.day === editData.day &&
      (editData.start < s.end && editData.end > s.start)
    );
    if (overlap) {
      alert("Ya existe un mensaje programado que se solapa con ese horario.");
      return;
    }
    setSchedules(prev => prev.map((item, i) => i === idx ? { ...item, ...editData } : item));
    setEditIdx(null);
    setEditData({});
  };

  const handleStartEdit = (realIdx) => {
    setEditIdx(realIdx);
    setEditData({ ...schedules[realIdx] });
  };

  const handleEditField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.start.localeCompare(b.start);
  });

  useEffect(() => {
    connectMQTT("ws://34.61.188.47:9001");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = daysOrder[now.getDay() - 1];
      let messageSent = false;

      schedules.forEach((item, index) => {
        if (item.day === currentDay) {
          const [startHour, startMin] = item.start.split(":");
          const [endHour, endMin] = item.end.split(":");

          const startTime = new Date();
          const endTime = new Date();
          startTime.setHours(startHour, startMin, 0, 0);
          endTime.setHours(endHour, endMin, 0, 0);

          if (now >= startTime && now <= endTime) {
            if (activeMessageIndex !== index) {
              publishToAllBoards({
                message: item.message,
                color: "white",
                effect: "scroll",
                speed: 3,
              });
              setActiveMessageIndex(index);
            }
            messageSent = true;
          }
        }
      });

      if (!messageSent && activeMessageIndex !== null) {
        publishToAllBoards({
          message: "ESPERANDO MENSAJE...",
          color: "white",
          effect: "scroll",
          speed: 1,
        });
        setActiveMessageIndex(null);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [schedules, activeMessageIndex]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
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
            </Typography>
            <Typography variant="body2" color="inherit">
              Proyecto de Gestión Tecnológica
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{mb: 4, bgcolor: "#f5f5f5", p: 1, borderRadius: 1, boxShadow: 3}}>
          <Grid container spacing={3}>
            <Grid width={"65%"} item xs={12} md={8}>
              <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Enviar Mensaje
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <MessageForm />
                <WeeklyScheduler onSchedule={handleAddSchedule} />
                {/* Aquí mantienes el bloque de mensajes programados como lo tenías */}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} width={"32.9%"}>
              <Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h6" gutterBottom>Estado del Sistema</Typography>
                <Divider />
                <SystemStatus />
              </Paper>
            </Grid>

            <Grid item xs={12} mb={4} sx={{ width: "65%" }}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  centered
                >
                  <Tab label="Mensajes Predefinidos" />
                  <Tab label="Historial de Mensajes" />
                  <Tab label="Configuración" />
                </Tabs>
                <Divider />
                <TabPanel value={tabValue} index={0}><MessagePred /></TabPanel>
                <TabPanel value={tabValue} index={1}><MessageHistory /></TabPanel>
                <TabPanel value={tabValue} index={2}><Settings /></TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Container>

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
