
import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SignIn, useUser } from "@clerk/react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SyncUser from "./components/users/SyncUser";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import Favorite from "./pages/Favorite";
import Booking from "./pages/Booking";

import Layout from "./pages/admin/Layout";
import AddShows from "./pages/admin/AddShows";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import Deshboard from "./pages/admin/Deshboard";
import { useAppContext } from "./context/AppContext";
import Loading from "./components/Loading";


const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { user } = useUser();
  const { isAdmin,loadingAdmin } = useAppContext();
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
        <Route path="/loading/:nextUrl" element={<Loading />} />
        <Route path="/favorites" element={<Favorite />} />

<Route
  path="/admin/*"
  element={
    !user ? (
    <div className="min-h-screen flex justify-center items-center">
        <SignIn fallbackRedirectUrl="/admin" />
    </div>
    ) : loadingAdmin ? (
      <div className="min-h-screen flex justify-center items-center">Loading...</div>
    ) : isAdmin ? (
      <Layout />
    ) : (
      <Navigate to="/" replace />
    )
  }
>
          <Route index element={<Deshboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;







