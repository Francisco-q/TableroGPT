import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";

function SystemStatus() {
  const [minutos, setMinutos] = useState(null);

  const calcularMinutos = () => {
    const saved = localStorage.getItem("ultimaHoraMensaje");
    if (!saved) return null;
    const diferencia = Math.floor((Date.now() - new Date(saved)) / 60000);
    return diferencia === 0 ? "Hace menos de 1 minuto" : `Hace ${diferencia} min`;
  };

  useEffect(() => {
    const updateTiempo = () => {
      setMinutos(calcularMinutos());
    };

    updateTiempo(); // Actualiza al montar
    const interval = setInterval(updateTiempo, 30000); // Actualiza cada 30 seg
    return () => clearInterval(interval); // Limpieza
  }, []);

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <List disablePadding>
        <ListItem>
          <ListItemText
            sx={{ display: "flex", alignItems: "center" }}
            primary="Conexión al tablero"
            secondary={
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label="Conectado"
                size="small"
                color="success"
                sx={{ position: "absolute", right: 0, top: 13 }}
              />
            }
          />
        </ListItem>

        <Divider component="li" />

        <ListItem>
          <ListItemText
            primary="Raspberry Pi"
            secondary={
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label="En línea"
                size="small"
                color="success"
                sx={{ position: "absolute", right: 0, top: 13 }}
              />
            }
          />
        </ListItem>

        <Divider component="li" />

        <ListItem>
          <ListItemText
            primary="Último mensaje"
            secondary={
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {minutos || "Sin mensajes"}
                </Typography>
              </Box>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
}

export default SystemStatus;
