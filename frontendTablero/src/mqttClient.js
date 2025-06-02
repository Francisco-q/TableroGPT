// src/mqttClient.js
import mqtt from "mqtt";

let client = null;

export const connectMQTT = (brokerUrl) => {
  client = mqtt.connect(brokerUrl);

  client.on("connect", () => {
    console.log("✅ Conectado al broker MQTT");
  });

  client.on("error", (err) => {
    console.error("❌ Error MQTT:", err);
  });

  client.on("close", () => {
    console.log("🔌 Conexión MQTT cerrada");
  });
};

export const publishMessage = (topic, messageObj) => {
  if (client && client.connected) {
    client.publish(topic, JSON.stringify(messageObj));
    console.log("📤 Mensaje enviado:", messageObj);
  } else {
    console.error("❗ MQTT no conectado");
  }
};
