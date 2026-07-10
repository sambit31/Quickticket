import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { MenuIcon, XIcon, SearchIcon, TicketPlus } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()

  const handleLinkClick = () => {
    window.scrollTo(0, 0)
    setIsMenuOpen(false)
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">

      <Link className="max-md:flex-1" to="/">
        <img src={assets.logo} alt="Logo" className="w-36 h-auto" />
      </Link>

      <div
        className={`max-md:absolute max-md:top-0 max-md:w-full max-md:h-screen max-md:px-9 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-10 md:px-6 py-3 md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-md:left-0' : 'max-md:left-full'
        }`}
      >
        <XIcon
          onClick={() => setIsMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer"
        />

        <Link onClick={handleLinkClick} to="/">Home</Link>
        <Link onClick={handleLinkClick} to="/movies">Movies</Link>
        <Link onClick={handleLinkClick} to="/theaters">Theaters</Link>
        <Link onClick={handleLinkClick} to="/releases">Releases</Link>
        <Link onClick={handleLinkClick} to="/favorites">Favorites</Link>

      </div>

      <div className="flex items-center gap-5">

        <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />

        {!user ? (
          <button
            onClick={() => openSignIn()}
            className="px-4 py-1 sm:px-7 sm:py-2 bg-pink-600 hover:opacity-90 transition rounded-full font-medium cursor-pointer"
          >
            Login
          </button>
        ) : (
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Bookings"
                labelIcon={<TicketPlus size={15} />}
                onClick={() => navigate('/my-bookings')}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}

      </div>

      <MenuIcon
        onClick={() => setIsMenuOpen(true)}
        className="md:hidden w-8 h-8 cursor-pointer"
      />

    </div>
  )
}

export default Navbar