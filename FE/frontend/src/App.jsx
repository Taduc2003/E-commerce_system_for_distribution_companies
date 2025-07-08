import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Product from './pages/user/Product';
import PlaceOrder from './pages/user/PlaceOrder';
import Home from './pages/user/Home';
import Collection from './pages/user/Collection';
import Cart from './pages/user/Cart';
import Orders from './pages/user/Orders';
import Login from './pages/Login';
import Navbar from './components/user/Navbar';
import Footer from './components/user/Footer';
import SearchBar from './components/user/SearchBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutUser from './layout/LayoutUser';
import LayoutAdmin from './layout/LayoutAdmin';
import ProductAdmin from './pages/admin/ProductAdmin';
import Employees from './pages/admin/Employees';
import LayoutStaff from './layout/LayoutStaff';
import Discount from './pages/staff/Discount';
import OrdersStaff from './pages/staff/OrdersStaff';
import Inventory from './pages/staff/Inventory';
import LayoutShipper from './layout/LayoutShipper';
import OrderShipper from './pages/shipper/OrderShipper';
import Report from './pages/admin/Report';
import ProfileStaff from './pages/staff/ProfileStaff';
import Profile from './pages/user/Profile';


const App = () => {
  return (
    <div >
      <ToastContainer />
      <Routes>
        {/* User layout */}
        <Route element={<LayoutUser />}>
          <Route path='/' element={<Home />} />
          <Route path='/filter' element={<Collection />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/profile' element={<Profile />} />
        </Route>


        {/* Admin layout */}
        <Route path='/admin' element={<LayoutAdmin />}>
          <Route path='products' element={<ProductAdmin />} />
          <Route path='employees' element={<Employees />} />
          <Route path='report' element={<Report />} />
          <Route path='profile' element={<Profile />} />
          <Route path='branches' element={<div>Branches Page</div>} />
          <Route path='inventory/:branchId' element={<Inventory />} />

        </Route>

        {/* Staff layout */}
        <Route path='/staff' element={<LayoutStaff />}>
          <Route path='products' element={<ProductAdmin />} />
          <Route path='discounts' element={<Discount />} />
          <Route path='orders' element={<OrdersStaff />} />
          <Route path='inventory/:branchId' element={<Inventory />} />
          <Route path='profile' element={<ProfileStaff />} />
        </Route>

        {/* Shipper layout */}
        <Route path='/shipper' element={<LayoutShipper />}>
          <Route path='orders' element={<OrdersStaff />} />
        </Route>
      </Routes>
    </div>
  );
}


export default App;

