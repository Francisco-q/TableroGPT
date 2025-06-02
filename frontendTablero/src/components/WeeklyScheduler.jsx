import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { publishMessage } from "../mqttClient";

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function WeeklyScheduler() {
  const [day, setDay] = useState("Lunes");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");
  const [message, setMessage] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrEdit = () => {
    if (message.trim()) {
      const newItem = { day, start, end, message };

      if (editIndex !== null) {
        const updatedList = [...scheduleList];
        updatedList[editIndex] = newItem;
        setScheduleList(updatedList);
        setEditIndex(null);
      } else {
        setScheduleList([...scheduleList, newItem]);
      }

      // Publicar mensaje inmediatamente al agregar
      publishMessage("panel/mensaje", {
        message,
        color: "white",
        effect: "scroll",
        speed: 3,
      });

      localStorage.setItem("ultimaHoraMensaje", new Date().toISOString());
      sessionStorage.setItem("lastScheduledMessage", message);

      setMessage("");
    }
  };

  const handleEdit = (index) => {
    const item = scheduleList[index];
    setDay(item.day);
    setStart(item.start);
    setEnd(item.end);
    setMessage(item.message);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = [...scheduleList];
    updatedList.splice(index, 1);
    setScheduleList(updatedList);
  };

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const nowDay = now.toLocaleDateString("es-CL", { weekday: "long" });

      const matched = scheduleList.find((item) => {
        if (item.day.toLowerCase() !== nowDay.toLowerCase()) return false;

        const [sh, sm] = item.start.split(":");
        const [eh, em] = item.end.split(":");
        const startDate = new Date(now);
        const endDate = new Date(now);

        startDate.setHours(sh, sm, 0, 0);
        endDate.setHours(eh, em, 0, 0);

        return now >= startDate && now <= endDate;
      });

      const alreadySent = sessionStorage.getItem("lastScheduledMessage");
      const stillValid = matched && alreadySent === matched.message;

      if (matched && !stillValid) {
        // Enviar nuevo mensaje
        publishMessage("panel/mensaje", {
          message: matched.message,
          color: "white",
          effect: "scroll",
          speed: 2,
        });
        localStorage.setItem("ultimaHoraMensaje", new Date().toISOString());
        sessionStorage.setItem("lastScheduledMessage", matched.message);
      }

      if (!matched && alreadySent) {
        // Finalizar mensaje
        publishMessage("panel/mensaje", {
          message: "ESPERANDO MENSAJE...",
          color: "white",
          effect: "scroll",
          speed: 1,
        });
        localStorage.setItem("ultimaHoraMensaje", new Date().toISOString());
        sessionStorage.removeItem("lastScheduledMessage");
      }
    };

    const interval = setInterval(checkSchedule, 10000); // cada 10s
    return () => clearInterval(interval);
  }, [scheduleList]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Programar mensaje semanal</Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Select value={day} onChange={(e) => setDay(e.target.value)}>
            {daysOfWeek.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <TextField
            type="time"
            label="Desde"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="time"
            label="Hasta"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Mensaje"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleAddOrEdit}>
            {editIndex !== null ? "Guardar" : "Agregar"}
          </Button>
        </Grid>
      </Grid>

      {scheduleList.length > 0 && (
        <Paper variant="outlined">
          <List>
            {scheduleList.map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${item.day} ${item.start} - ${item.end}`}
                  secondary={item.message}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEdit(index)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default WeeklyScheduler;
