import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5">
      <Link className="max-md:flex-1" to="/" >
        <img src={assets.logo} alt="Logo" className="w-36 h-auto" />

      </Link>

      <div className="max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center gap-8 max-md:justify-center max-md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-grey-300/20 overflow-hidden transition-[width] duration-300">
        <XMIcon className="max-md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer" />
        <Link to='/'>Home</Link>
        <Link to='/movies'>Movies</Link>
        <Link to='/'>Theaters</Link>
        <Link to='/'>Releases</Link>
        <Link to='/favorites'>Favorites</Link>
      </div>
      <div>
        <searchIcon className="max-md:ml-4 md:hidden w-6 h-6 cursor-pointer" />
        <button classname="px-4 py-1 sm:px-7 sm:py-2 bg-pimary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">Login</button>
      </div>

      <MenuIcon className="max-md:ml-4 md:hidden w-8 h-8 cursor-pointer" />
    </div>
  )
}

export default Navbar