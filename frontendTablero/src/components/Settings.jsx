import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import mqtt from "mqtt";

function Settings() {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("9001");
  const [topic, setTopic] = useState("panel/mensaje");
  const [boards, setBoards] = useState([]);
  const [messages, setMessages] = useState({}); // para manejar los mensajes por tablero

  useEffect(() => {
    const saved = localStorage.getItem("tableros");
    if (saved) setBoards(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (ip && topic) {
      const newList = [...boards, { ip, port, topic }];
      setBoards(newList);
      localStorage.setItem("tableros", JSON.stringify(newList));
      setIp("");
      setPort("9001");
      setTopic("panel/mensaje");
    }
  };

  const handleDelete = (index) => {
    const newList = boards.filter((_, i) => i !== index);
    setBoards(newList);
    localStorage.setItem("tableros", JSON.stringify(newList));
  };

  const handleSendMessage = (index) => {
    const { ip, port, topic } = boards[index];
    const message = messages[index];

    if (!message) return alert("Ingresa un mensaje antes de enviarlo");

    const brokerUrl = `ws://${ip}:${port}`;
    const client = mqtt.connect(brokerUrl);

    client.on("connect", () => {
      client.publish(topic, JSON.stringify({
        message,
        color: "white",
        effect: "scroll",
        speed: 3,
      }), () => client.end());
    });

    client.on("error", (err) => {
      console.error(`❌ Error conectando a ${ip}:${port} -`, err.message);
    });
  };

  const handleInputChange = (index, value) => {
    setMessages((prev) => ({ ...prev, [index]: value }));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Configurar Tableros
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={4}>
          <TextField label="IP" fullWidth value={ip} onChange={(e) => setIp(e.target.value)} />
        </Grid>
        <Grid item xs={3}>
          <TextField label="Puerto" fullWidth value={port} onChange={(e) => setPort(e.target.value)} />
        </Grid>
        <Grid item xs={5}>
          <TextField label="Tópico MQTT" fullWidth value={topic} onChange={(e) => setTopic(e.target.value)} />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "right" }}>
          <Button variant="contained" onClick={handleAdd}>Agregar</Button>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle1">Tableros Configurados:</Typography>

      <Paper variant="outlined">
        {boards.map((b, i) => (
          <List key={i}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(i)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${b.ip}:${b.port}`}
                secondary={`Tópico: ${b.topic}`}
              />
            </ListItem>

            <Box sx={{ px: 2, pb: 2, display: "flex", gap: 1 }}>
              <TextField
                label="Mensaje"
                fullWidth
                value={messages[i] || ""}
                onChange={(e) => handleInputChange(i, e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => handleSendMessage(i)}
              >
                Enviar
              </Button>
            </Box>
            <Divider />
          </List>
        ))}
      </Paper>
    </Box>
  );
}

export default Settings;
