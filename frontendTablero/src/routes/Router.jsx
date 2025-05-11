// filepath: c:\Users\augus\OneDrive\Escritorio\Tablero2.0\TableroGPT\frontendTablero\src\routes\Router.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../pages/App';
import Login from '../pages/Login';
import Register from '../pages/Register';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta para Login - página predeterminada */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta para Register */}
        <Route path="/register" element={<Register />} />
        
        {/* Ruta para la aplicación principal */}
        <Route path="/app" element={<App />} />
        
        {/* Redirección a Login desde la ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Redirección a Login para cualquier otra ruta no definida */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;