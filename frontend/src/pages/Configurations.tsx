import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import { configurationsApi } from '@/services/api'

const Configurations = () => {
  const navigate = useNavigate()

  const { data: configurations, isLoading } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationsApi.list().then((res) => res.data),
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Configurations</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/')}>
          Extract New Configuration
        </Button>
      </Box>

      {!configurations || configurations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              No configurations found. Extract one from GAM to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {configurations.map((config) => (
            <Grid item xs={12} md={6} lg={4} key={config.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/configurations/${config.id}`)}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {config.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {config.description || 'No description'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={config.config_type} size="small" />
                    {config.is_template && (
                      <Chip label="Template" size="small" color="primary" />
                    )}
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Created: {format(new Date(config.created_at), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

// Add date-fns helper
const format = (date: Date, formatStr: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[date.getMonth()]
  const day = date.getDate().toString().padStart(2, '0')
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month} ${day}, ${year} ${hours}:${minutes}`
}

export default Configurations

