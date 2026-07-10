import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import {BlurCircle} from "../components/BlurCircle.jsx"

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const [bookings, setbookings] = useState([])
  const [isLoading,setisLoading] = useState(true)

  const getMyBookings = async()=>{
     setbookings(dummyBookingData)
     setisLoading(false)
  }

  useEffect(()=>{
    getMyBookings()
  })
  
  return !isLoading ? (
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 d:pt-40 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px"/>

      <div>
        <BlurCircle top="0px" left="600px"/>
      </div>
      <h1 className='text-lg font-semibold mb-4'>My Bookings</h1>
    </div>
  ) : <Loading />
}

export default MyBooking