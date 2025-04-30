import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Grid,
  Slider,
  Typography,
  FormControlLabel,
  Switch,
  Paper,
  Divider,
} from "@mui/material";
import { Save, Refresh } from "@mui/icons-material";

function Settings() {
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      ipAddress: "",
      port: "",
      brightness: 5,
      autoReconnect: false,
      debugMode: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const brightness = watch("brightness");

  const onSubmit = (data) => {
    setIsSaving(true);
    console.log("Form Data:", data);
    // Simulate saving process
    setTimeout(() => setIsSaving(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} sx={{ width: "45%" }}>
          <Controller
            name="ipAddress"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="ipAddress"
                label="Dirección IP del Tablero"
                placeholder="192.168.1.100"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ width: "45%" }}>
          <Controller
            name="port"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="port"
                label="Puerto"
                placeholder="8080"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sx={{ width: "100%" }}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Opciones Avanzadas
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Controller
              name="autoReconnect"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} color="primary" />}
                  label="Reconexión Automática"
                />
              )}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Intentar reconectar automáticamente si se pierde la conexión
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Controller
              name="debugMode"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} color="primary" />}
                  label="Modo Debug"
                />
              )}
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Mostrar información de depuración en la consola
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sx={{width: "100%"}}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => reset()}
            >
              Restablecer
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Configuración"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default Settings;