import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { assets } from '../../assets/assets'
import { useLocation } from 'react-router-dom'

const SearchBar = () => {

  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext)
  const [visible, setVisible] = useState(false)
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('filter')) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [location.pathname])

  return showSearch && visible ? (
    <div className='border-t border-b bg-gray-50 h-15 text-center flex items-center justify-center'>
      <div className='flex items-center justify-center border border-gray-400 px-5 py-2 rounded-full w-3/4 sm:w-1/2'>
        <input className='flex-1 outline-none bg-inherit text-sm' type="text" placeholder='Tìm kiếm sản phẩm...' value={search} onChange={(e) => setSearch(e.target.value)} />
        <img src={assets.search_icon} alt="" className='w-4' />
      </div>

      <img className='inline w-3 cursor-pointer ml-2' src={assets.cross_icon} alt="" onClick={() => setShowSearch(false)} />
    </div>
  ) : null
}

export default SearchBar
