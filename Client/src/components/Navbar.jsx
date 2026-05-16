import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs"
import { HiOutlineLogout } from "react-icons/hi"
import { FaUserAstronaut } from "react-icons/fa"
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice'
import AuthModal from './AuthModal';          //
import { IntervexIcon } from './intervexicon'
function Navbar() {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/Logout", { withCredentials: true })
      dispatch(setUserData(null))
      setShowCreditPopup(false)
      setShowUserPopup(false)
      navigate("/")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className=' w-full bg-[#020617]/60 backdrop-blur-xl backdrop-saturate-180 border-b border-white/[0.08] flex justify-center shadow-[0_0_10px] '>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}

        className='w-full  bg-[#020617] rounded-[3px] shadow-sm border-gray-500 px-9 py-5 flex justify-between items-center relative'
      >
        <div className=' w-full flex items-center gap-3 cursor-pointer'>
          <div className=' text-white p-2 rounded-lg '>
            {/* <BsRobot size={18} /> */}
            <IntervexIcon />
          </div>
          <h1 className="text-2xl margin:-4 font-bold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent font-family: 'Inter', sans-serif gap : -4px ;">
            Intervex
          </h1>
        </div>

        <div className='flex items-center gap-6 relative'>
          <div className='relative'>
            <button

              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className='flex items-center gap-6 bg-gradient-to-r from-indigo-400 to-purple-600  px-3 py-1 rounded-full text-md hover:bg-gray-50 transition'
            >
              <BsCoin size={20} />
              {userData?.credits || 0}
            </button>
            {showCreditPopup && (
              <div className='absolute right-[-50px] mt-3 w-64 bg-black shadow-xl border border-gray-200 rounded p-5 z-50'>
                <p className='text-sm text-white-600 mb-4'>
                  Need more credits to continue interview?
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className='w-full bg-gradient-to-r 
  from-red-500 to-orange-500 text-white py-2 rounded-lg text-sm'
                >
                  Buy More Credits
                </button>
              </div>
            )}
          </div>

          <div className='relative'>
            <button
              onClick={() => {
                if (!userData) { setShowAuth(true); return; }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className='w-9 h-9 bg-gradient-to-r from-indigo-400 to-purple-600  text-white rounded-full flex items-center justify-center font-semibold'
            >
              {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
            </button>
            {showUserPopup && (
              <div className='absolute right-0 mt-3 w-48 bg-black shadow-xl border border-gray-200 rounded-xl p-4 z-40'>
                <p className='text-md font-medium mb-1'>{userData?.name}</p>
                <br />
                {/* <button onClick={() => navigate("/history")} className='w-full text-left text-sm py-2 hover:text-black text-gray-600'>
                  Interview History
                </button> */}
                <button onClick={handleLogout} className="px-12 py-1 rounded-full bg-gradient-to-r 
  from-red-500 to-orange-500 text-white font-semibold
  shadow-[0_0_20px_rgba(239,68,68,0.5)]
  hover:scale-105 transition-all duration-300">
                  <HiOutlineLogout size={20} />
                  <div className='bgblack text-white-1000'>
                    Logout


                  </div>

                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>


      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}

export default Navbar