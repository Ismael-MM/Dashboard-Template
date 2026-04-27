import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider} from 'react-router'
import { router } from '@/router/index'
import './index.css'
import { AuthProvider } from './features/auth/AuthContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
