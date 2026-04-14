import { Route, Routes } from 'react-router-dom'
import UserLayout from '../components/layout/user/UserLayout'
import Home from '../pages/user/Home'
import Catalog from '../pages/user/Catalog'
import Profile from '../pages/user/Profile'
import Contact from '../pages/user/Contact'
import About from '../pages/user/About'
import AuctionPage from '../pages/user/AuctionDetails'
import CreateAuction from '../pages/user/CreateAuction'

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/auction/:id" element={<AuctionPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/About" element={<About />} />
        <Route path="/create-auction" element={<CreateAuction />} />
      </Route>
    </Routes>
  )
}

export default UserRoutes