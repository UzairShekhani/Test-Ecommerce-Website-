import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.jsx'
import { RoutesRoot } from './routes/RoutesRoot.jsx'

const router = createBrowserRouter(RoutesRoot)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="bottom-right" richColors closeButton duration={2200} />
  </StrictMode>,
)
