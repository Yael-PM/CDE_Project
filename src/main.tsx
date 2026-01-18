import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

//Layout
import DefaultLayout from './layouts/DefaultLayout'

//Pages
import LandingPage from './pages/LandingPage'
import Services from './pages/Services'
import Contact from './pages/Contact'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {index: true, element: <LandingPage/>},
      {path: '/services', element: <Services/>},
      {path: '/contact', element: <Contact/>}
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}>

    </RouterProvider>
  </StrictMode>,
)
