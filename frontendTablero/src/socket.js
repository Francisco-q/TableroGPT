// src/socket.js
let socket;

export const connectWebSocket = (ip) => {
  socket = new WebSocket(`ws://${ip}/ws`);

  socket.onopen = () => {
    console.log("WebSocket conectado");
  };

  socket.onclose = () => {
    console.log("WebSocket desconectado");
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.error("WebSocket no está abierto");
  }
};

export const isWebSocketConnected = () => {
  return socket && socket.readyState === WebSocket.OPEN;
};
