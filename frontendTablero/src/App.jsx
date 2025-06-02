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
import { connectWebSocket } from "./socket"; 
import WeeklyScheduler from "./components/WeeklyScheduler";
import { connectMQTT } from "./mqttClient";

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Validar solapamiento y agregar mensaje programado
  const handleAddSchedule = (newSchedule) => {
    const overlap = schedules.some(s =>
      s.day === newSchedule.day &&
      (
        (newSchedule.start < s.end && newSchedule.end > s.start)
      )
    );
    if (overlap) {
      alert("Ya existe un mensaje programado que se solapa con ese horario.");
      return;
    }
    setSchedules((prev) => [...prev, newSchedule]);
  };

  // Eliminar mensaje programado
  const handleDeleteSchedule = (idx) => {
    setSchedules(prev => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) {
      setEditIdx(null);
      setEditData({});
    }
  };

  // Guardar cambios editados
  const handleSaveEdit = (idx) => {
    // Validar solapamiento al guardar
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

  // Iniciar edición
  const handleStartEdit = (realIdx) => {
    setEditIdx(realIdx);
    setEditData({ ...schedules[realIdx] });
  };

  // Manejar cambios en los campos de edición
  const handleEditField = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Ordenar los mensajes por día y hora
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayDiff = daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.start.localeCompare(b.start);
  });

  useEffect(() => {
  connectMQTT("ws://34.56.58.198:9001"); // WebSocket MQTT sobre puerto 9001
  }, []);

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
            {/* Columna izquierda: Enviar Mensaje */}
            <Grid width={"65%"} item xs={12} md={8}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
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
                <WeeklyScheduler onSchedule={handleAddSchedule} />
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Mensajes programados:
                  </Typography>
                  {sortedSchedules.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No hay mensajes programados.
                    </Typography>
                  )}
                  {sortedSchedules.map((s, idx) => {
                    // Buscar el índice real en schedules
                    const realIdx = schedules.findIndex(
                      item =>
                        item.day === s.day &&
                        item.start === s.start &&
                        item.end === s.end &&
                        item.message === s.message
                    );
                    return (
                      <Paper key={idx} sx={{ p: 1, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        {editIdx === realIdx ? (
                          <>
                            <TextField
                              select
                              size="small"
                              value={editData.day}
                              onChange={e => handleEditField("day", e.target.value)}
                              sx={{ width: 120, mr: 1 }}
                            >
                              {daysOrder.map(day => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              type="time"
                              size="small"
                              value={editData.start}
                              onChange={e => handleEditField("start", e.target.value)}
                              sx={{ width: 90, mr: 1 }}
                              inputProps={{ step: 300 }}
                            />
                            <Typography sx={{ mx: 0.5 }}>-</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={editData.end}
                              onChange={e => handleEditField("end", e.target.value)}
                              sx={{ width: 90, mr: 1 }}
                              inputProps={{ step: 300 }}
                            />
                            <TextField
                              size="small"
                              value={editData.message}
                              onChange={e => handleEditField("message", e.target.value)}
                              sx={{ flex: 1, mr: 1 }}
                            />
                            <IconButton color="success" onClick={() => handleSaveEdit(realIdx)}>
                              <CheckIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteSchedule(realIdx)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <TextField
                              select
                              size="small"
                              value={s.day}
                              disabled
                              sx={{ width: 120, mr: 1 }}
                            >
                              {daysOrder.map(day => (
                                <MenuItem key={day} value={day}>{day}</MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              type="time"
                              size="small"
                              value={s.start}
                              disabled
                              sx={{ width: 90, mr: 1 }}
                              inputProps={{ step: 300 }}
                            />
                            <Typography sx={{ mx: 0.5 }}>-</Typography>
                            <TextField
                              type="time"
                              size="small"
                              value={s.end}
                              disabled
                              sx={{ width: 90, mr: 1 }}
                              inputProps={{ step: 300 }}
                            />
                            <TextField
                              size="small"
                              value={s.message}
                              disabled
                              sx={{ flex: 1, mr: 1 }}
                            />
                            <IconButton color="primary" onClick={() => handleStartEdit(realIdx)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDeleteSchedule(realIdx)}>
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>


            {/* Columna derecha: Estado del Sistema */}
            <Grid item xs={12} md={4} width={"32.9%"}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
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
            </Grid>       

            {/* Pestañas inferior */}
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
                <TabPanel value={tabValue} index={0}>
                  <MessagePred />
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <MessageHistory />
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
                  <Settings />
                </TabPanel>
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