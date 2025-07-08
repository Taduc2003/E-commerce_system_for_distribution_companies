import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Đăng Nhập');
  const { login, logout, register } = useContext(UserContext);
  const navigate = useNavigate();

  const onSubmitHandle = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (currentState === 'Đăng Nhập') {
      // Gọi API login
      const success = await login(data.email, data.password);
      console.log(success);
      if (success !== null) {
        alert('Đăng nhập thành công!');
        //Điều hướng theo role
        
        const userRole = success.role;

       
        if (userRole === 'ADMIN') {
          navigate('/admin/products');
        } else if (userRole === 'CUSTOMER') {
          navigate('/');
        } else if (userRole === 'STAFF') {
          navigate('/staff/products');
        } else if (userRole === 'SHIPPER') {
          navigate('/shipper/orders');
        }
      } else {
        alert('Đăng nhập thất bại!');
        logout();
      }
    } else {
      // Gọi API register
      if (!data.fullName || !data.password || !data.confirmPassword) {
        alert("Vui lòng điền đầy đủ tài khoản và mật khẩu");
        return;
      }

      if (data.password !== data.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }
      const success = await register({
        fullName: data['Họ và Tên'] || data.fullName,
        email: data.email,
        password: data.password,
        phone: data['Số Điện Thoại'] || data.phone,
        roleName: 'CUSTOMER'
      });
      if (success) {
        alert('Đăng ký thành công!');
        setCurrentState('Đăng Nhập');
      } else {
        alert('Đăng ký thất bại!');
      }
    }
    event.target.reset();
  };

  return (
    <form onSubmit={onSubmitHandle} className='flex flex-col items-center justify-center w-[90%] sm:max-w-96 m-auto mt-12 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState} </p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800 ' />
      </div>
      {currentState === 'Đăng Nhập' ? '' : <input name="fullName" type="text" placeholder='Họ và Tên' className='border border-gray-800 w-full py-2 px-3' required />}
      <input name="email" type="email" placeholder='Email' className='border border-gray-800 w-full py-2 px-3' required />
      {currentState === 'Đăng Nhập' ? '' : <input name="phone" type="text" placeholder='Số Điện Thoại' className='border border-gray-800 w-full py-2 px-3' required />}
      <input name="password" type="password" placeholder='Mật Khẩu' className='border border-gray-800 w-full py-2 px-3' required />
      {currentState === 'Đăng Nhập' ? '' : <input name="confirmPassword" type="password" placeholder='Xác Nhận Mật Khẩu' className='border border-gray-800 w-full py-2 px-3' required />}


      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Quên mật khẩu?</p>
        {
          currentState === 'Đăng Nhập' ?
            <p className='cursor-pointer' onClick={() => setCurrentState('Đăng Ký')}>Tạo Tài Khoản</p> :
            <p className='cursor-pointer' onClick={() => setCurrentState('Đăng Nhập')}>Đăng Nhập</p>
        }
      </div>
      <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4'>
        {currentState === 'Đăng Nhập' ? 'Đăng Nhập' : 'Đăng Ký'}
      </button>
    </form>
  );
};

export default Login;
