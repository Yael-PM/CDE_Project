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
      <CustomButton variant="primary" route='/services' >Ir a servicios</CustomButton>
      <CustomButton variant="alert" onClick={() => alert("Hola")}>Alerta</CustomButton>
      <CustomButton variant="warning">Cancelar</CustomButton>
      <CustomButton disabled>Deshabilitado</CustomButton>
    </div>
  )
}

export default DefaultLayout