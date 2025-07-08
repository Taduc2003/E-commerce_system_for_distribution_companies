import React from 'react'

const OrderShipper = () => {
   const { products, currency, formatPrice } = useContext(ShopContext);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'ĐỐN HÀNG'} text2={'CỦA TÔI'} />
      </div>

      <div>
        {
          products.slice(1, 4).map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row justify-between items-center gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img src={item.image[0]} alt="" className='w-16 sm:w-20' />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>{formatPrice(item.price)} {currency}</p>
                    <p>Số lượng: 1</p>
                  </div>
                  <p className='mt-2'> Ngày: <span className='text-gray-400'> 10, tháng 6</span> </p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'> </p>
                  <p className='text-sm md:text-base'> Đang xử lý </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default OrderShipper
