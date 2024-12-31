import React, { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom"

import {
  EllipsisVertical,
  Search,
  LogOut,
  UserPen,
  Settings,
  ChartNoAxesCombined
} from "lucide-react";

import { Dropdown, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { persistor } from '../../store/store';
import { httpClient } from "../../lib/httpClient";


const Navbar = () => {
  const authSlice = useSelector((state) => state.authSlice);
 
  const token = authSlice.accessToken;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/")

  }

  const items = [
    {
      label: (
        <a className="flex gap-2 " href="#">
          <Settings size={18} />
          Setting
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a className="flex gap-2" href="#">
          <UserPen size={18} /> Profile
        </a>
      ),
      key: "1",
    },
    {
      label: (
        <Link className="flex gap-2" to="/myresult">
        <ChartNoAxesCombined size={18} /> Results
        </Link>
      ),
      key: "1",
    },
    {
      label: <Link className="flex gap-2" onClick={()=> dispatch(handleLogout())} >
     <LogOut size={18} /> Logout
    </Link> ,
      key: "3",
    },
  ];

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const res = await httpClient.post("/user/verify", { token }); // Pass the token correctly
  //       if (res.data.error === true) {
  //         await persistor.purge(); // Clear the persisted state
  //         dispatch(logout()); // Dispatch logout action to clear Redux state
  //         navigate("/"); // Redirect to the login page
  //       }
  //     } catch (error) {
  //       console.error("Token verification failed:", error);
  //       await persistor.purge(); // Purge persisted state in case of error
  //       dispatch(logout());
  //       navigate("/");
  //     }
  //   };

  //   if (token) {
  //     verifyToken();
  //   }
  // }, [token, dispatch, navigate]);

  useEffect(()=>{
    if(authSlice.user == null){
      navigate("/")
    }
  },[authSlice.user])
  

  return (
    <nav className="flex items-center justify-between bg-blue-600 p-4 shadow-md px-10">
      {/* Left section: Toggle and Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Icon */}
        <button className="p-2 focus:outline-none md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 12H7V9H4V7h3V4h2v3h3v2H9v3zm9 2V8a2 2 0 00-2-2h-3v1.586l2 2V14H8.414l2 2H16a2 2 0 002-2zM2 18h5l-2-2H4V6h2l-2-2H2a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span className="text-xl font-semibold text-white">Quiz Forms</span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex-grow max-w-lg mx-4">
        <div className="relative rounded-full bg-gray-100 p-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search />
          </div>
          <input
            type="text"
            className="bg-gray-100 w-full rounded-full pl-10 pr-4  text-gray-700 focus:outline-none"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Right section: Grid and Avatar */}
      <div className="flex items-center space-x-2">
        {/* User Avatar */}
        <img
          className="h-10 w-10 rounded-full object-cover"
          src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1727455327~exp=1727455927~hmac=62ec1977be6de3fa228aed2da9561b2279170414cf205e6ebf94388fcadf6a9b"
          alt="User Avatar"
        />

        {/* Grid Icon */}
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space className="text-white">
              {authSlice.user?.user.username}
              <EllipsisVertical color="white" />
            </Space>
          </a>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
