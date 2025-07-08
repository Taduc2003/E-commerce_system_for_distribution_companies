import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { ProductContext } from '../../context/ProductContext'
import { assets } from '../../assets/assets';
import ProductItem from '../../components/user/ProductItem';
import Title from '../../components/user/Title';

const Collection = () => {
    const { search, showSearch } = useContext(ShopContext);
    const { fetchAllProducts } = useContext(ProductContext);

    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [sortType, setSortType] = useState('default');
    

    // Lấy products từ ProductContext
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await fetchAllProducts();
            setProducts(data);
            setFilterProducts(data);
        };
        fetchProducts();
    }, [fetchAllProducts]);

    // Bộ lọc loại sản phẩm (theo categoryName)
    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }
    
    // Bộ lọc danh mục (theo supplier)
    const toggleSupplier = (e) => {
        if (supplier.includes(e.target.value)) {
            setSupplier(prev => prev.filter(item => item !== e.target.value))
        } else {
            setSupplier(prev => [...prev, e.target.value])
        }
    }

    // Áp dụng bộ lọc
    const applyFilter = () => {
        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item =>
                item.productName.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category.length > 0) {
            // productsCopy = productsCopy.filter(item => category.includes(item.categoryName));
            productsCopy = productsCopy.filter(item => item.category && category.includes(item.category.categoryName)
    );
        }
        if (supplier.length > 0) {
            productsCopy = productsCopy.filter(item => supplier.includes(item.supplier));
        }

        setFilterProducts(productsCopy);
    }

    // Sắp xếp sản phẩm
    const sortProducts = () => {
        let fpProducts = filterProducts.slice();
        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpProducts.sort((a, b) => a.price - b.price));
                break;
            case 'high-low':
                setFilterProducts(fpProducts.sort((a, b) => b.price - a.price));
                break;
            default:
                applyFilter();
                break;
        }
    }

    useEffect(() => {
        applyFilter();
        // eslint-disable-next-line
    }, [category, supplier, showSearch, search, products]);

    useEffect(() => {
        sortProducts();
        // eslint-disable-next-line
    }, [sortType]);

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>BỘ LỌC
                    <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
                </p>
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>DANH MỤC</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Acer'} onChange={toggleSupplier} />Acer
                        </p>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Dell'} onChange={toggleSupplier} />Dell
                        </p>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Apple'} onChange={toggleSupplier} />Apple
                        </p>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Sam Sung'} onChange={toggleSupplier} />Sam Sung
                        </p>
                    </div>
                </div>
                {/* SubCategories Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>LOẠI SẢN PHẨM</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Laptop'} onChange={toggleCategory} />Laptop
                        </p>
                        <p className='flex gap-2'>
                            <input type="checkbox" className='w-3' value={'Điện thoại'} onChange={toggleCategory} />Điện Thoại
                        </p>
                    </div>
                </div>
            </div>
            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'TẤT CẢ'} text2={'SẢN PHẨM'} />
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
                        <option value="default">Mặc định</option>
                        <option value="low-high">Sắp xếp: Giá thấp đến cao</option>
                        <option value="high-low">Sắp xếp: Giá cao đến thấp</option>
                    </select>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.map((item, index) => (
                        <ProductItem
                            key={item.productId || index}
                            id={item.productId}
                            image={item.image}
                            name={item.productName}
                            price={item.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Collection
