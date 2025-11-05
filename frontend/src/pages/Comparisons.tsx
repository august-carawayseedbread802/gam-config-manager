import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material'
import { ExpandMore, CheckCircle, Warning } from '@mui/icons-material'
import { comparisonsApi } from '@/services/api'

const Comparisons = () => {
  const { data: comparisons, isLoading } = useQuery({
    queryKey: ['comparisons'],
    queryFn: () => comparisonsApi.list().then((res) => res.data),
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
      <Typography variant="h4" sx={{ mb: 4 }}>
        Configuration Comparisons
      </Typography>

      {!comparisons || comparisons.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="textSecondary" align="center">
              No comparisons yet. Compare configurations from the detail page.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comparisons.map((comparison) => (
            <Card key={comparison.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">
                      Comparison #{comparison.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Source: Config #{comparison.source_config_id} vs Target: Config #{comparison.target_config_id}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {comparison.drift_detected ? (
                      <>
                        <Warning color="warning" />
                        <Chip label="Drift Detected" color="warning" />
                      </>
                    ) : (
                      <>
                        <CheckCircle color="success" />
                        <Chip label="No Drift" color="success" />
                      </>
                    )}
                  </Box>
                </Box>

                {comparison.summary && (
                  <Alert severity={comparison.drift_detected ? 'warning' : 'success'} sx={{ mb: 2 }}>
                    {comparison.summary}
                  </Alert>
                )}

                {comparison.differences?.items && comparison.differences.items.length > 0 && (
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>
                        View {comparison.differences.items.length} Difference(s)
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {comparison.differences.items.map((diff, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2">{diff.path}</Typography>
                              <Chip label={diff.type} size="small" />
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Source Value:
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {JSON.stringify(diff.source_value)}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="textSecondary">
                                  Target Value:
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {JSON.stringify(diff.target_value)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default Comparisons

