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

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {index: true, element: <LandingPage/>},
      {path: '/services', element: <Services/>},
      {path: '/about-us', element: <AboutUs/>},
      {path: '/contact', element: <Contact/>},
      {path: '/manage-notes',element: <ManageNotes/>}
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router}>
      </RouterProvider>
    </Suspense>
  </StrictMode>,
)
