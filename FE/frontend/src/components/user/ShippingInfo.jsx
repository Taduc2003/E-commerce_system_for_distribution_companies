import React from 'react';
import Title from './Title';
import DeliveryMethod from './DeliveryMethod';
import CustomerInfoForm from './CustomerInfoForm';
import AddressSelector from './AddressSelector';

const ShippingInfo = ({
    deliveryMethod,
    setDeliveryMethod,
    formData,
    handleInputChange,
    branches,
    selectedProducts,
    selectedBranch,
    setSelectedBranch
}) => {
    return (
        <div className='border rounded-lg p-6 bg-white shadow-sm'>
            <div className='text-xl sm:text-2xl mb-6'>
                <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'} />
            </div>

            <DeliveryMethod
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
            />

            <CustomerInfoForm
                formData={formData}
                handleInputChange={handleInputChange}
            />

            <AddressSelector
                deliveryMethod={deliveryMethod}
                formData={formData}
                handleInputChange={handleInputChange}
                branches={branches}
                selectedProducts={selectedProducts}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
            />
        </div>
    );
};

export default ShippingInfo;