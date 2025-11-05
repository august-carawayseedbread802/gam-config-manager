import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
} from '@mui/material'
import { configurationsApi, securityApi } from '@/services/api'
import { SecurityScore } from '@/types'
import { useEffect, useState } from 'react'

const Security = () => {
  const [scores, setScores] = useState<Record<number, SecurityScore>>({})

  const { data: configurations, isLoading } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configurationsApi.list().then((res) => res.data),
  })

  useEffect(() => {
    if (configurations) {
      const fetchScores = async () => {
        await Promise.all(
          configurations.map(async (config) => {
            try {
              const scoreRes = await securityApi.getScore(config.id)
              setScores((prev) => ({ ...prev, [config.id]: scoreRes.data }))
            } catch (error) {
              // Ignore errors for configs without security analysis
            }
          })
        )
      }
      fetchScores()
    }
  }, [configurations])

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success.main'
    if (score >= 60) return 'warning.main'
    return 'error.main'
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Security Overview
      </Typography>

      {!configurations || configurations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              No configurations to analyze. Extract one from GAM to get started.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {configurations.map((config) => {
            const score = scores[config.id]
            return (
              <Grid item xs={12} md={6} lg={4} key={config.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {config.name}
                    </Typography>
                    <Chip label={config.config_type} size="small" sx={{ mb: 2 }} />

                    {score ? (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h3" color={getScoreColor(score.security_score)}>
                            {score.security_score}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Security Score
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {score.critical_findings > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Chip label="Critical" color="error" size="small" />
                              <Typography variant="body2">{score.critical_findings}</Typography>
                            </Box>
                          )}
                          {score.high_findings > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Chip label="High" color="warning" size="small" />
                              <Typography variant="body2">{score.high_findings}</Typography>
                            </Box>
                          )}
                          {score.medium_findings > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Chip label="Medium" color="info" size="small" />
                              <Typography variant="body2">{score.medium_findings}</Typography>
                            </Box>
                          )}
                          {score.low_findings > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Chip label="Low" color="success" size="small" />
                              <Typography variant="body2">{score.low_findings}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No security analysis available. Run analysis from the configuration detail page.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}

export default Security

