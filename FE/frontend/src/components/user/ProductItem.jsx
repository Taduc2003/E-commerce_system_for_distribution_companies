import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { Link } from 'react-router-dom'

const ProductItem = ({ id, image, name, price }) => {

  const { currency, formatPrice } = useContext(ShopContext);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden">
        <img src={backendUrl + image} alt="" className="hover:scale-110 transition ease-in-out h-80 object-cover" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'> {formatPrice(price)} {currency}</p>
    </Link>
  )
}

export default ProductItem
