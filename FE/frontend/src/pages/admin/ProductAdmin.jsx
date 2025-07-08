import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from '../../context/ProductContext';
import Title from '../../components/user/Title';

const ProductAdmin = () => {
    const { fetchAllProducts, deleteProduct, updateProduct, createProduct, uploadImage } = useContext(ProductContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = import.meta.env.VITE_API_BASE_URL;

    // State cho popup
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        supplier: 'Acer',
        price: '',
        description: '',
        image: '',
        categoryName: 'Điện thoại',
        imageFile: null,
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            const data = await fetchAllProducts();
            console.log('Fetched products:', data);
            setProducts(data);
            setLoading(false);
        };
        getProducts();
    }, [fetchAllProducts]);

    // Xử lý upload ảnh riêng biệt
    const handleUploadImage = async () => {
        if (!formData.imageFile) {
            alert('Vui lòng chọn file ảnh!');
            return;
        }
        setUploading(true);
        const imagePath = await uploadImage(formData.imageFile);
        setUploading(false);
        if (imagePath) {
            setFormData({ ...formData, image: imagePath });
            alert('Upload ảnh thành công!');
        } else {
            alert('Upload ảnh thất bại!');
        }
    };

    // Xóa sản phẩm
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        const result = await deleteProduct(id);
        if (result) {
            setProducts(products.filter(product => product.productId !== id));
        } else {
            alert('Xóa sản phẩm thất bại!');
        }
    };

    // Mở popup thêm mới
    const handleAdd = () => {
        setEditMode(false);
        setFormData({
            productId: '',
            productName: '',
            supplier: 'Acer',
            price: '',
            description: '',
            image: '',
            quantitySold: '',
            categoryName: 'Điện thoại',
            imageFile: null,
        });
        setShowModal(true);
    };

    // Mở popup sửa
    const handleEdit = (product) => {
        setEditMode(true);
        setFormData({
            ...product,
            categoryName: product.category.categoryName,
            imageFile: null, // reset file khi sửa
        });
        setShowModal(true);
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Đảm bảo đã upload ảnh trước khi submit
        // if (!formData.image) {
        //     alert('Vui lòng upload ảnh sản phẩm trước!');
        //     return;
        // }
        if (editMode) {
            const result = await updateProduct(formData);
            if (result) {
                console.log('Cập nhật thành công:', result);
                setProducts(products.map(p => p.productId === formData.productId ? result : p));
                setShowModal(false);
            } else {
                alert('Cập nhật thất bại!');
            }
        } else {
            const result = await createProduct(formData);
            if (result) {
                setProducts([...products, result]);
                setShowModal(false);
            } else {
                alert('Thêm sản phẩm thất bại!');
            }
        }
    };

    return (
        <div className="p-6">
            {/* ✅ Thống nhất: Title ở đầu, không có flex justify-between */}
            <div className='text-2xl mb-8'>
                <Title text1={'QUẢN LÝ'} text2={'SẢN PHẨM'} />
            </div>

            {/* ✅ Button riêng biệt */}
            <div className="flex justify-end mb-6">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={handleAdd}
                >
                    Thêm Sản Phẩm Mới
                </button>
            </div>

            {loading ? (
                <div>Đang tải sản phẩm...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={backendUrl + product.image}
                                alt={product.productName}
                                className="w-full h-80 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                                <p className="text-gray-600 font-medium mt-2">{product.price}đ</p>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleDelete(product.productId)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        Sửa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Popup Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <form
                        className="bg-white p-6 rounded-lg w-[90vw] max-w-md max-h-[90vh] overflow-y-auto"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <h3 className="text-xl font-bold mb-4">{editMode ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h3>
                        <div className="mb-3">
                            <label className="block mb-1">Tên sản phẩm</label>
                            <input
                                type="text"
                                className="border px-3 py-2 w-full"
                                value={formData.productName}
                                onChange={e => setFormData({ ...formData, productName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Nhà cung cấp</label>
                            <select
                                className="border px-3 py-2 w-full"
                                value={formData.supplier}
                                onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                                required
                            >
                                <option value="Acer">Acer</option>
                                <option value="Dell">Dell</option>
                                <option value="Sam Sung">Sam Sung</option>
                                <option value="Apple">Apple</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Giá</label>
                            <input
                                type="number"
                                className="border px-3 py-2 w-full"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Mô tả</label>
                            <textarea
                                className="border px-3 py-2 w-full"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Danh mục</label>
                            <select
                                className="border px-3 py-2 w-full"
                                value={formData.categoryName}
                                onChange={e => setFormData({ ...formData, categoryName: e.target.value })}
                                required
                            >
                                <option value="Điện thoại">Điện thoại</option>
                                <option value="Laptop">Laptop</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="block mb-1">Ảnh sản phẩm</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="border px-3 py-2 w-full"
                                onChange={e => {
                                    setFormData({
                                        ...formData,
                                        imageFile: e.target.files[0],

                                        image: ''
                                    });
                                }}
                            />
                            <button
                                type="button"
                                className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                                onClick={handleUploadImage}
                                disabled={uploading || !formData.imageFile}
                            >
                                {uploading ? 'Đang upload...' : 'Upload ảnh'}
                            </button>
                            {formData.image && (
                                <img src={backendUrl + formData.image} alt="preview" className="mt-2 w-32 h-32 object-cover" />
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                {editMode ? 'Lưu' : 'Thêm'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductAdmin;
