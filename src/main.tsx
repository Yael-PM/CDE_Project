import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import '../i18n'

//Layout
import DefaultLayout from './layouts/DefaultLayout'

//Pages
import LandingPage from './pages/LandingPage'
import Services from './pages/Services'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import ManageNotes from './pages/ManageNotes'
import Blog from './pages/Blog'
import Login from './pages/Login'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyNotice from './pages/PrivacyNotice'
import CreateNote from './pages/CreateNote'
import { AuthProvider } from './contexts/auth.provider'

import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      // Rutas Públicas
      {index: true, element: <LandingPage/>},
      {path: '/services', element: <Services/>},
      {path: '/about-us', element: <AboutUs/>},
      {path: '/contact', element: <Contact/>},
      {path: '/blog', element: <Blog/>},
      {path: '/login', element: <Login/>},
      {path: '/terms-and-conditions', element: <TermsAndConditions/>},
      {path: '/privacy-notice', element: <PrivacyNotice/>},
      
      // Rutas Protegidas (Envueltas en el ProtectedRoute)
      {
        element: <ProtectedRoute />,
        children: [
          {path: '/manage-notes', element: <ManageNotes/>},
          {path: '/create-note', element: <CreateNote/>}
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </StrictMode>,
)