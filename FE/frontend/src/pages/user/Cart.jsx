import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import Title from '../../components/user/Title';
import CartTotal from '../../components/user/CartTotal';
import { assets } from '../../assets/assets'


const Cart = () => {
    const {
        cartList,
        updateQuantity,
        removeCartItem,
        selectedItems,
        toggleSelectItem,
        getSelectedTotal,
        formatPrice,
        currency,
        navigate
    } = useContext(ShopContext);
    
    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    console.log(cartList);
 
    return (
        <div className='border-t pt-15'>
            <div className='text-2xl mb-3'>
                <Title text1={"GIỎ HÀNG"} text2={"CỦA BẠN"} />

            </div>
            <div>
                {cartList.map((item) => (
                    <div key={item.cartDetailId} className='py-4 border-t border-b text-gray-700 grid grid-cols-[0.5fr_4fr_0.5fr_0.5fr] items-center gap-4'>
                        <input
                            type="checkbox"
                            checked={selectedItems.includes(item.cartDetailId)}
                            onChange={() => toggleSelectItem(item.cartDetailId)}
                        />
                        <div className='flex items-start gap-6'>
                            <img src={backendUrl + item.productImage} alt="" className='w-16 sm:w-20' />
                            <div>
                                <p className='text:xs sm:text-lg font-medium'>{item.productName}</p>
                                <div className='flex items-center gap-5 mt-2'>
                                    <p>{formatPrice(item.price)} {currency}</p>
                                </div>
                            </div>
                        </div>
                        <input
                            onChange={e => {
                                const val = Number(e.target.value);
                                if (val > 0) updateQuantity(item.cartDetailId, val);
                            }}
                            type="number"
                            min={1}
                            value={item.quantity}
                            className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                        />
                        <img
                            className='w-4 mr-4 sm:w-5 cursor-pointer'
                            onClick={() => removeCartItem(item.cartDetailId)}
                            src={assets.bin_icon}
                            alt=""
                        />
                    </div>
                ))}
            </div>
            <div className='flex justify-end my-20'>
                <div className='w:full sm:w-[450px]'>
                    <CartTotal total={getSelectedTotal()} />
                    <div className='w-full text-end'>
                        <button
                            onClick={() => {
                                if (selectedItems.length === 0) {
                                    alert('Vui lòng chọn sản phẩm muốn mua!');
                                    return;
                                }
                                navigate('/place-order', { state: { selectedItems } });
                            }}
                            className='bg-black text-white py-3 px-8 text-sm my-8'
                        >
                            MUA NGAY
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Cart
