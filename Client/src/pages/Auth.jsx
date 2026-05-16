import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion }  from "motion/react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import {signInWithPopup} from 'firebase/auth';
import { auth , provider} from '../utils/firebase';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import { useDispatch } from 'react-redux'

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;

      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      dispatch(setUserData(null));
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.367 }}
        className={`
          w-full
          ${
            isModel
              ? "max-w-md p-8 bg-black-100 rounded-3xl bg-white shadow-xl"
              : "max-w-lg p-10 rounded-[28px] bg-black-100 shadow-xl"
          }
        `}
      >
        <div className="flex items-center justify-center gap-3">
          
          <h2 className=" bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-2 font-bold">Intervex</h2>
        </div>

        <h1 className="text-2xl md:text-3xl text-center mb-2 text-[#E5E7EB]  font-bold">
          Continue with
          <span className="text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2">
            <IoSparkles size={18} />
            AI Smart Interview
          </span>
        </h1>

        <p className="text-[#E5E7EB] text-center text-sm mb-6 font-bold">
          Sign in to start AI-powered mock interviews and track your progress.
        </p>

        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ scale: 1.03 }}
          className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-m text-white rounded-full shadow-md"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
export default Auth