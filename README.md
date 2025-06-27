# TableroGPT

<!-- Badges -->
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.2%2B-informational?logo=flask)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/react-18%2B-blue?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-4%2B-purple?logo=vite)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/material--ui-5%2B-blue?logo=mui)](https://mui.com/)
[![React Router](https://img.shields.io/badge/react_router-6%2B-blue?logo=reactrouter)](https://reactrouter.com/)
[![Node.js](https://img.shields.io/badge/node.js-16%2B-green?logo=node.js)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-8%2B-red?logo=npm)](https://npmjs.com/)

Control de Tablero LED para monitoreo y envío de mensajes en tiempo real.

## 📖 Descripción
Este proyecto es una aplicación web full-stack que permite controlar y monitorear un tablero de LEDs desde una interfaz React/Vite, apoyada por una API REST construida con Python y Flask. Incluye autenticación de usuarios, historial de mensajes, configuración del sistema y estado en tiempo real.

## 🗂 Estructura del proyecto

```
TableroGPT/
├── Backend/             # API REST en Flask
│   ├── app.py           # Punto de entrada de la aplicación
│   └── requirements.txt # Dependencias de Python
├── frontendTablero/     # Interfaz de usuario en React (Vite)
│   ├── public/          # Archivos estáticos
│   ├── src/             # Código fuente React
│   ├── package.json
│   └── vite.config.js
├── LICENSE              # Licencia del proyecto
└── README.md            # Documentación principal
```

## 🚀 Tecnologías
- **Backend**: Python, Flask, python-dotenv
- **Frontend**: React, Vite, Material UI, React Router
- **Autenticación**: LocalStorage (token JWT)

## 🔧 Prerrequisitos
- Python 3.8 o superior
- Node.js 16 o superior
- npm o yarn

## ⚙️ Instalación y uso

### 1. Configuración del backend
```powershell
cd Backend
python -m venv venv
venv\Scripts\Activate
pip install -r requirements.txt
# Crear un archivo .env con SECRET_KEY
# Ejemplo:
# SECRET_KEY=tu_clave_secreta
python app.py
```
El servidor Flask correrá en http://127.0.0.1:5000

### 2. Configuración del frontend
```powershell
cd frontendTablero
npm install
npm run dev   # o `npm run build` para producción
```
La aplicación React estará disponible en http://localhost:5173

## 🖥️ Uso
1. Acceder al login y autenticarse.
2. Enviar mensajes personalizados al tablero LED.
3. Visualizar el historial de mensajes y estado del sistema.
4. Ajustar la configuración desde la pestaña 'Configuración'.

## 🤝 Contribuciones
¡Las contribuciones son bienvenidas! Abre un issue o envía un pull request.

## 📄 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

Desarrollado por Juan Farias, Nestor Ramirez, Francisco Quevedo y Augusto Fuenzalida - Universidad de Talca © 2025
