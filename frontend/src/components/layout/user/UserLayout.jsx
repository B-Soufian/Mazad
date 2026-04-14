import React from 'react'
import { Outlet } from 'react-router-dom' // This is the most important part!
import UserNavbar from './UserNavbar'
import UserFooter from './UserFooter'

const UserLayout = () => {
  return (
    <div className="app-wrapper">
      <UserNavbar /> 
      <main className="content">
        <Outlet /> 
      </main>
      <UserFooter />
    </div>
  )
}

export default UserLayout