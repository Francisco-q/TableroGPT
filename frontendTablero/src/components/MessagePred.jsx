import { useState } from "react";
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
} from "@mui/material";
import { Refresh, Send } from "@mui/icons-material";
import { sendWebSocketMessage } from "../socket"; // 👈 IMPORTANTE

// Mensajes predefinidos
const initialMessages = [
  {
    id: 1,
    text: "No estoy",
    color: "red",
    effect: "scroll",
    timestamp: new Date(2025, 3, 14, 10, 30),
    status: "success",
  },
  {
    id: 2,
    text: "Vuelvo mañana",
    color: "green",
    effect: "blink",
    timestamp: new Date(2025, 3, 14, 11, 15),
    status: "success",
  },
  {
    id: 3,
    text: "En clases",
    color: "blue",
    effect: "static",
    timestamp: new Date(2025, 3, 14, 12, 0),
    status: "success",
  },
];

function MessagePred() {
  const [messages, setMessages] = useState(initialMessages);

  const resendMessage = (messageData) => {
    console.log("Enviando mensaje predefinido:", messageData);

    const payload = {
      message: messageData.text,
      color: messageData.color,
      effect: messageData.effect,
      speed: 5, // Puedes ajustar si quieres que algunos sean más lentos o rápidos
    };

    sendWebSocketMessage(JSON.stringify(payload));
  };

  const formatDate = (date) => {
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getColorChip = (color) => {
    const colorMap = {
      red: { bgcolor: "#ffebee", color: "#c62828" },
      green: { bgcolor: "#e8f5e9", color: "#2e7d32" },
      blue: { bgcolor: "#e3f2fd", color: "#1565c0" },
      yellow: { bgcolor: "#fffde7", color: "#f9a825" },
      white: { bgcolor: "#f5f5f5", color: "#424242" },
    };

    return colorMap[color] || colorMap.white;
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">Mensajes Predefinidos</Typography>
        <Button startIcon={<Refresh />} size="small" onClick={() => window.location.reload()}>
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
                    fontWeight: "bold",
                    color: getColorChip(message.color).color,
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
                  <Tooltip title="Enviar este mensaje al tablero">
                    <IconButton
                      size="small"
                      onClick={() => resendMessage(message)}
                      color="primary"
                    >
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
  );
}

export default MessagePred;
