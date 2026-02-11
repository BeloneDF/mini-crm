import { QueryClientProvider } from '@tanstack/react-query'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { ThemeProvider } from './components/theme/theme-provider.tsx'
import { queryClient } from './lib/react-query.ts'

import { router } from './routes/routes.tsx'
import './styles/global.css'

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <HelmetProvider>
        <Helmet titleTemplate="%s | CRM" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  )
}
