import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext';
import { ProductContext } from '../../context/ProductContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { fetchAllProducts } = useContext(ProductContext);
    const [products, setProducts] = useState([]);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            const data = await fetchAllProducts();
            console.log('Fetched products:', data);
            setProducts(data);
        };
        getProducts();
    }, [fetchAllProducts]);

    useEffect(() => {
        const bestProducts = products.filter((item) => (item.supplier === 'Apple'));
        setBestSeller(bestProducts.slice(0, 5));
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'Sản Phẩm'} text2={'Bán Chạy'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Khám phá bộ sưu tập công nghệ hàng đầu của chúng tôi bao gồm laptop, điện thoại thông minh và các thiết bị điện tử cao cấp từ những thương hiệu uy tín như Apple, Dell, Acer và Samsung.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {
                    bestSeller.map((item, index) => (
                        <ProductItem key={index} id={item.productId} image={item.image} name={item.productName} price={item.price} />
                    ))
                }
            </div>
        </div>
    )
}

export default BestSeller
