import React from 'react'
import NavBar from '../components/NavBar'
import { Outlet } from 'react-router-dom'
import CustomButton from '../components/CustomButton'

const DefaultLayout = () => {
  return (
    <div>
      <NavBar/>
      <main>
        <Outlet/>
      </main>
      <CustomButton variant="primary">Primario</CustomButton>
      <CustomButton variant="alert">Alerta</CustomButton>
      <CustomButton variant="warning">Advertencia</CustomButton>
    </div>
  )
}

export default DefaultLayout