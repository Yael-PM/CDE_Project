import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <div>
      <NavBar/>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default DefaultLayout