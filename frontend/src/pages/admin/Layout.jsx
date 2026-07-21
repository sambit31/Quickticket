import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";

const Layout = () => {

  const {isAdmin,fetchIsAdmin } = useAppContext()

  useEffect(()=>{
    fetchIsAdmin()
  },[])


  return isAdmin ? (
    <>
    <div className="min-h-screen  text-white">
      {/* Navbar */}
      <AdminNavbar />

      {/* Sidebar + Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  ) : <Loading />
};

export default Layout;