import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
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
import { sendWebSocketMessage } from "../socket"; 


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
  
    const messageToSend = JSON.stringify(values); // 👈 ¡enviar como JSON!
  
    sendWebSocketMessage(messageToSend);
  
    console.log("Mensaje JSON enviado al WebSocket:", messageToSend);
  
    setTimeout(() => {
      setIsSubmitting(false);
      reset();
    }, 500);
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{width:"100%"}}>
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
        </Grid>

        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
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
        </Grid>

        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
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
        </Grid>

        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
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
        </Grid>

        <Grid item xs={12} sx={{width:"100%"}}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" startIcon={<Refresh />} onClick={() => reset()}>
              Reiniciar
            </Button>
            <Button type="submit" variant="contained" color="primary" startIcon={<Send />} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar al tablero"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}

export default MessageForm;