import { HashRouter, Routes, Route } from 'react-router'
import Layout from './layout'
import { ThemeProvider } from './components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
