import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Refresh, Send } from "@mui/icons-material"

// Datos de ejemplo
const initialMessages = [
  {
    id: 1,
    text: "Bienvenidos a UTAL",
    color: "red",
    effect: "scroll",
    timestamp: new Date(2025, 3, 14, 10, 30),
    status: "success",
  },
  {
    id: 2,
    text: "Gestión de Proyectos",
    color: "green",
    effect: "blink",
    timestamp: new Date(2025, 3, 14, 11, 15),
    status: "success",
  },
  {
    id: 3,
    text: "Tablero LED Funcionando",
    color: "blue",
    effect: "static",
    timestamp: new Date(2025, 3, 14, 12, 0),
    status: "success",
  },
]

function MessageHistory() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    };
    fetchMessages();
  }, []);

  const resendMessage = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/messages/${id}`);
      console.log("Mensaje reenviado:", id);
    } catch (error) {
      console.error("Error al reenviar mensaje:", error);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getColorChip = (color) => {
    const colorMap = {
      red: { bgcolor: "#ffebee", color: "#c62828" },
      green: { bgcolor: "#e8f5e9", color: "#2e7d32" },
      blue: { bgcolor: "#e3f2fd", color: "#1565c0" },
      yellow: { bgcolor: "#fffde7", color: "#f9a825" },
      white: { bgcolor: "#f5f5f5", color: "#424242" },
    }

    return colorMap[color] || colorMap.white
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Mensajes Recientes</Typography>
        <Button startIcon={<Refresh />} size="small">
          Actualizar
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Mensaje</TableCell>
              <TableCell>Propiedades</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {message.text}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    <Chip
                      label={message.color}
                      size="small"
                      sx={{
                        bgcolor: getColorChip(message.color).bgcolor,
                        color: getColorChip(message.color).color,
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                    <Chip
                      label={message.effect}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: "0.7rem",
                        height: 20,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{formatDate(message.timestamp)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Reenviar mensaje">
                    <IconButton size="small" onClick={() => resendMessage(message.id)} color="primary">
                      <Send fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default MessageHistory