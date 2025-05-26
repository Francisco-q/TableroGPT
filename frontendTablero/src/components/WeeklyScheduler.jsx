import { useState } from "react";
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";

const daysOfWeek = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

function WeeklyScheduler({ onSchedule }) {
  const [day, setDay] = useState("Lunes");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("09:00");
  const [message, setMessage] = useState("");

  const handleAdd = () => {
    if (message.trim()) {
      onSchedule({ day, start, end, message });
      setMessage("");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Programar mensaje semanal</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Select value={day} onChange={e => setDay(e.target.value)}>
            {daysOfWeek.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </Grid>
        <Grid item>
          <TextField
            type="time"
            label="Desde"
            value={start}
            onChange={e => setStart(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            type="time"
            label="Hasta"
            value={end}
            onChange={e => setEnd(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs>
          <TextField
            label="Mensaje"
            value={message}
            onChange={e => setMessage(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleAdd}>Agregar</Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default WeeklyScheduler;