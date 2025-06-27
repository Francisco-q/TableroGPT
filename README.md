# TableroGPT

Control de Tablero LED  para monitoreo y envío de mensajes en tiempo real.

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
