import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='flex justify-between p-5'>
        <div className='text-4xl font-semibold cursor-pointer mx-5'>CDE</div>
        <div>
            <ul className='flex gap-4 [&>li]:cursor-pointer [&>li]:hover:scale-105'>
                <li><Link to={'/'}>INICIO</Link></li>
                <li><Link to={'/services'}>SERVICIOS</Link></li>
                <li>NOSOTROS</li>
                <li>BLOG</li>
                <li><Link to={'/contact'}>CONTACTO</Link></li>
            </ul>
        </div>
        <div className='mx-5 bg-pollito-600 p-2 rounded-2xl text-white' >AGENDAR CITA</div>
    </div>
  )
}

export default NavBar