import { Box, Typography, List, ListItem, ListItemText, Chip, Divider } from "@mui/material"
import { CheckCircle as CheckCircleIcon, AccessTime as AccessTimeIcon } from "@mui/icons-material"

function SystemStatus() {
  return (
    <Box sx={{ height: "100%" ,width:"100%"}}>
      <List disablePadding>
        <ListItem>
          <ListItemText
            sx={{ display:"flex", alignItems: "center" }}
            primary="Conexión al tablero"
            secondary={
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label="Conectado"
                size="small"
                color="success"
                sx={{  position:"absolute", right: 0, top: 13 }}
              />
            }
          />
        </ListItem>

        <Divider component="li" />

        <ListItem >
          <ListItemText
            primary="Raspberry Pi"
            secondary={
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label="En línea"
                size="small"
                color="success"
                sx={{  position:"absolute", right: 0, top: 13 }}
              />
            }
          />
        </ListItem>

        <Divider component="li" />

        <ListItem>
          <ListItemText
            primary="Último mensaje"
            secondary={
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  Hace 5 minutos
                </Typography>
              </Box>
            }
          />
        </ListItem>
      </List>
    </Box>
  )
}

export default SystemStatus