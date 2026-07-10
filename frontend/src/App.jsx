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

const App = () => {

  const isAdminRoute = window.location.pathname.startsWith('/admin');

  return (
    <>
    <Toaster />
    {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<Booking />} />
        <Route path="/favorites" element={<Favorite />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App