import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  FormHelperText,
} from "@mui/material";
import { Send, Refresh } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";

function MessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
      color: "red",
      effect: "scroll",
      speed: 5,
    },
  });

  const onSubmit = (values) => {
    setIsSubmitting(true);

    // Simulación de envío al tablero LED
    console.log("Enviando mensaje al tablero LED:", values);

    setTimeout(() => {
      setIsSubmitting(false);
      reset();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Campo de mensaje */}
        <Box>
          <Controller
            name="message"
            control={control}
            rules={{
              required: "El mensaje es obligatorio",
              maxLength: { value: 100, message: "El mensaje no puede exceder los 100 caracteres" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="message"
                label="Mensaje"
                placeholder="Ingresa el texto a mostrar en el tablero LED"
                multiline
                rows={2}
                error={!!errors.message}
                helperText={errors.message?.message}
              />
            )}
          />
        </Box>

        {/* Selección de color */}
        <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ width:"33%" }}>
              <FormControl fullWidth error={!!errors.color}>
                <InputLabel id="color-label">Color</InputLabel>
                <Controller
                  name="color"
                  control={control}
                  rules={{ required: "Selecciona un color" }}
                  render={({ field }) => (
                    <Select {...field} labelId="color-label" id="color" label="Color">
                      <MenuItem value="red">Rojo</MenuItem>
                      <MenuItem value="green">Verde</MenuItem>
                      <MenuItem value="blue">Azul</MenuItem>
                      <MenuItem value="yellow">Amarillo</MenuItem>
                      <MenuItem value="white">Blanco</MenuItem>
                    </Select>
                  )}
                />
                {errors.color && <FormHelperText>{errors.color.message}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Selección de efecto */}
            <Box sx={{ width:"33%" }}>
              <FormControl fullWidth error={!!errors.effect}>
                <InputLabel id="effect-label">Efecto</InputLabel>
                <Controller
                  name="effect"
                  control={control}
                  rules={{ required: "Selecciona un efecto" }}
                  render={({ field }) => (
                    <Select {...field} labelId="effect-label" id="effect" label="Efecto">
                      <MenuItem value="scroll">Desplazamiento</MenuItem>
                      <MenuItem value="blink">Parpadeo</MenuItem>
                      <MenuItem value="static">Estático</MenuItem>
                      <MenuItem value="wave">Onda</MenuItem>
                    </Select>
                  )}
                />
                {errors.effect && <FormHelperText>{errors.effect.message}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Slider de velocidad */}
            <Box sx={{ width:"33%" }}>
              <Typography id="speed-slider" gutterBottom>
                Velocidad
              </Typography>
              <Controller
                name="speed"
                control={control}
                rules={{
                  required: "Selecciona una velocidad",
                  min: { value: 1, message: "Mínimo 1" },
                  max: { value: 10, message: "Máximo 10" },
                }}
                render={({ field }) => (
                  <Slider
                    {...field}
                    aria-labelledby="speed-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                  />
                )}
              />
              {errors.speed && <FormHelperText error>{errors.speed.message}</FormHelperText>}
            </Box>
        </Box>
        

        {/* Botones de acción */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => reset()}>
            Reiniciar
          </Button>
          <Button type="submit" variant="contained" color="primary" startIcon={<Send />} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar al tablero"}
          </Button>
        </Box>
      </Box>
    </form>
  );
}

export default MessageForm;