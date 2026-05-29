import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import InterviewPage from './pages/InterviewPage'
import axios from 'axios'
import { setUserData } from './redux/userSlice'
import { useDispatch } from 'react-redux'
import Pricing from './pages/Pricing.jsx'
import InterviewHistory from './pages/InterviewHistory'
import InterviewReport from './pages/InterviewReport'


export const ServerUrl = "https://intervex-ai-6.onrender.com"

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/user/current-user",
          { withCredentials: true }
        )
        dispatch(setUserData(result.data))
      } catch (error) {
        console.log(error)
        dispatch(setUserData(null))
      }
    }
    getUser()
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth' element={<Auth />} />
      <Route path='/interview' element={<InterviewPage/>} />
      <Route path='/history' element={<InterviewHistory/>} />
      
      <Route path='/pricing' element={<Pricing/>} />
      <Route path='/report/:id' element={<InterviewReport/>} />
      


    </Routes>
  )
}

export default App
