import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import Favorite from './pages/Favorite'

import{Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Booking from './pages/Booking'
import Layout from './pages/admin/Layout'
import AddShows from './pages/admin/AddShows'
import ListBookings from './pages/admin/ListBookings'
import ListShows from './pages/admin/ListShows'
import Deshboard from './pages/admin/Deshboard'
import SyncUser from './components/users/SyncUser'


const App = () => {

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <>
    <Toaster />
    <SyncUser />
  
    {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<Booking />} />
        <Route path="/favorites" element={<Favorite />} />

        <Route path='/admin/*' element={<Layout/>}>
          <Route index element={<Deshboard/>} />
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="list-bookings" element={<ListBookings/>}/>

        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App