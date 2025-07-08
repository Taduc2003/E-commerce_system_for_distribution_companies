import React from 'react';
import Navbar from '../components/user/Navbar';
import SearchBar from '../components/user/SearchBar';
import Footer from '../components/user/Footer';
import { Outlet } from 'react-router-dom';

const LayoutUser = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 px-4 md:px-8 lg:px-16">
      <Navbar />
      <SearchBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default LayoutUser
