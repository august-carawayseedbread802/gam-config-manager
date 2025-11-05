import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material'
import {
  CloudDownload,
  CompareArrows,
  Security,
  Description,
} from '@mui/icons-material'
import { configurationsApi, comparisonsApi, templatesApi, gamApi } from '@/services/api'
import { ConfigType } from '@/types'

const Dashboard = () => {
  const navigate = useNavigate()
  const [extractDialogOpen, setExtractDialogOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<ConfigType[]>([
    ConfigType.USER,
    ConfigType.GROUP,
  ])
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')

  // Fetch stats
  const { data: configs } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationsApi.list().then((res) => res.data),
  })

  const { data: comparisons } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => comparisonsApi.list().then((res) => res.data),
  })

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.list().then((res) => res.data),
  })

  // Extract mutation
  const extractMutation = useMutation({
    mutationFn: gamApi.extract,
    onSuccess: (response) => {
      setExtractDialogOpen(false)
      if (response.data.configuration_id) {
        navigate(`/configurations/${response.data.configuration_id}`)
      }
    },
  })

  const handleExtract = () => {
    extractMutation.mutate({
      config_types: selectedTypes,
      save_as_template: saveAsTemplate,
      template_name: saveAsTemplate ? templateName : undefined,
    })
  }

  const handleTypeToggle = (type: ConfigType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    )
  }

  const statsCards = [
    {
      title: 'Total Configurations',
      value: configs?.length || 0,
      icon: <CloudDownload fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Comparisons',
      value: comparisons?.length || 0,
      icon: <CompareArrows fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Templates',
      value: templates?.length || 0,
      icon: <Description fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Drift Detected',
      value: comparisons?.filter((c) => c.drift_detected).length || 0,
      icon: <Security fontSize="large" />,
      color: '#d32f2f',
    },
  ]

  const recentConfigs = configs?.slice(0, 5) || []

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<CloudDownload />}
          onClick={() => setExtractDialogOpen(true)}
        >
          Extract Configuration
        </Button>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">{card.value}</Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>{card.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Configurations */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Configurations
          </Typography>
          {recentConfigs.length === 0 ? (
            <Typography color="textSecondary">
              No configurations yet. Extract one from GAM to get started.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentConfigs.map((config) => (
                <Box
                  key={config.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate(`/configurations/${config.id}`)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1">{config.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {config.description || 'No description'}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip label={config.config_type} size="small" sx={{ mr: 1 }} />
                      {config.is_template && <Chip label="Template" size="small" color="primary" />}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Extract Dialog */}
      <Dialog open={extractDialogOpen} onClose={() => setExtractDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Extract GAM Configuration</DialogTitle>
        <DialogContent>
          {extractMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to extract configuration. Please check your GAM setup.
            </Alert>
          )}

          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Configuration Types</FormLabel>
            <FormGroup>
              {Object.values(ConfigType).map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                    />
                  }
                  label={type.replace('_', ' ').toUpperCase()}
                />
              ))}
            </FormGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={saveAsTemplate}
                onChange={(e) => setSaveAsTemplate(e.target.checked)}
              />
            }
            label="Save as template"
          />

          {saveAsTemplate && (
            <TextField
              fullWidth
              label="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtractDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleExtract}
            disabled={selectedTypes.length === 0 || extractMutation.isPending}
            startIcon={extractMutation.isPending && <CircularProgress size={20} />}
          >
            Extract
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard

