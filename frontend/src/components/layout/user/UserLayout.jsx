import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'

const UserLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/profile');

  return (
    <div className="app-wrapper">
      <UserNavbar /> 
      <main className="content">
        <Outlet /> 
      </main>
      {!hideFooter && <UserFooter />}
    </div>
  )
}

export default UserLayout