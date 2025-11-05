import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Configurations from './pages/Configurations'
import ConfigurationDetail from './pages/ConfigurationDetail'
import Comparisons from './pages/Comparisons'
import Security from './pages/Security'
import Templates from './pages/Templates'

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/configurations" element={<Configurations />} />
          <Route path="/configurations/:id" element={<ConfigurationDetail />} />
          <Route path="/comparisons" element={<Comparisons />} />
          <Route path="/security" element={<Security />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </Layout>
    </Box>
  )
}

export default App

