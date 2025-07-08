import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../context/ShopContext'
import { ProductContext } from '../../context/ProductContext'
import { assets } from '../../assets/assets'

const Product = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { fetchProductById } = useContext(ProductContext)
    const { products, addToCart, currency, formatPrice } = useContext(ShopContext)
    const [productData, setProductData] = useState(false)
    const [image, setImage] = useState('')
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const [token] = useState(localStorage.getItem('token'));

    const fetchProductData = async () => {
        const data = await fetchProductById(productId)
        if (data) {
            setProductData(data)
            setImage(data.image)
        } else {
            setProductData(null)
        }
    }

    const handleAddToCart = () => {
        if (!token) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
            navigate('/login')
            return
        }
        addToCart(productId)
    }

    useEffect(() => {
        fetchProductData();
    }, [productId])

    return productData ? (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacality-100'>
            {/* Product  */}
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
                {/* product image */}
                <div className='flex-1 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row'>
                    <img src={backendUrl + image} alt="" className='w-1/2 h-auto' />
                </div>
                {/* product details */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt="" className='w-3 5' />
                        <img src={assets.star_icon} alt="" className='w-3 5' />
                        <img src={assets.star_icon} alt="" className='w-3 5' />
                        <img src={assets.star_icon} alt="" className='w-3 5' />
                        <img src={assets.star_icon} alt="" className='w-3 5' />
                        <p className='pl-2'> (122)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{formatPrice(productData.price)} {currency}</p>
                    <p className='mt-5 text-gray-300 sm:w-4/5'>{productData.description}</p>
                    <div className='flex flex-col gap-4 my-8'></div>
                    <button
                        onClick={handleAddToCart}
                        className='bg-black text-white py-3 px-8 text-sm active:bg-gray-700'>THÊM VÀO GIỎ HÀNG</button>
                    <hr className='mt-8 sm:w-4/5' />
                </div>
            </div>
        </div>
    ) : <div className='opacity-0'></div>
}

export default Product
