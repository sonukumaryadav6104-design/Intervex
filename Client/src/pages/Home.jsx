import React from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsGraphUp,
  BsFileEarmarkText,
} from "react-icons/bs";
import AuthModal from "../components/AuthModal";
import { HiSparkles } from "react-icons/hi";
import hrImg from "../assets/HR.png";
import techimg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";
import "../index.css";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen premium-bg text-white flex flex-col overflow-hidden w-full">
      <Navbar />
      <div className="flex-1 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-6">
            <div
              className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 
              text-blue-300 text-sm px-4 py-2 rounded-full flex items-center gap-2   
              border border-blue-500/30 backdrop-blur-md"
            >
              <HiSparkles size={16} className="-50 text-green-600" />
              AI Powered Smart Interview Platform
            </div>
          </div>
          <div className="text-center mb-28">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="md:text-5xl font-semibold leading-tight max-w-4xl mx-auto text-white-1000 font-bold"
            >
              Practice Interviews with
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-2">
                  AI Intelligence
                </span>
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg font-bold"
            >
              “Turn practice into confidence—master real interview questions,
              get intelligent feedback, and grow with every attempt.”
            </motion.p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 text-white px-10 py-3 rounded-full hover:opacity-90 transition shadow-md"
              >
                Start Interview
              </motion.button>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{ opacity: 0.9, scale: 1.03 }}
                whileTap={{ opacity: 1, scale: 0.98 }}
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 text-white px-11 py-2 rounded-full hover:scale-105 transition shadow-md"
              >
                View History
              </motion.button>
            </div>
          </div>
          {/* Cards were stated here for desgning  */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real Interview pressure with the tracking.",
              },
              {
                icon: <BsBarChart size={24} />,
                step: "STEP 4",
                title: "AI Feedback & Scoring",
                desc: "Instant scores on every answer.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                intial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 + index * 0.2 }}
                whileHover={{ rotate: 0, scale: 1.06 }}
                className={`
                relative relative rounded-2xl p-5 bg-slate-950/70 rounded-3xl border-2 border-green-100 hover:border--500 
                p-10 w-full md:w-80 min-h-[280px]
                shadow-md hover:shadow-2xl transition-all duration-300
                flex flex-col justify-between
                
                 `}
              >
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 
                bg-white border-2 
                border-purple-500 text-purple-600 
                w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  {item.icon}
                </div>

                <div className="pt-10 text-center flex flex-col flex-grow justify-center">
                  <div
                    className="text-[10px] tracking-widest font-mono
                           text-violet-400/70 bg-violet-500/10
                           border border-violet-500/20 rounded-full px-1 py-1"
                  >
                    {item.step}
                  </div>

                  <h3 className="text-[18px] font-semibold text-white/95 tracking-tight mb-1.5 font-serif">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Capabilities */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Advanced AI{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-2">
                Capabilities
              </span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evalution",
                  desc: "Scores communication , technical accuracy and confidence.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on  your uploaded Resume.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  // viewport={{ once: true }}
                  className="bg-slate-950/70 border-gray-2 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/2 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-contain max-h-64"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-x1 flex items-center justify-center mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-[18px] font-semibold text-white/95 tracking-tight mb-1.5 font-serif">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-semibold text-center mb-16"
            >
              Multiple Interview{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent px-2">
                Modes
              </span>
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-10">
              {[
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and Communication based evalution",
                },
                {
                  image: techimg,
                  title: "Technical Interview Mode",
                  desc: "Deep technical question based on selected role.",
                },
                {
                  image: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },
               {
                  image: creditImg,
                  title: "Credit-Based Access",
                  desc: "Use credits to unlock interviews, AI feedback, and premium features.",
               }
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-slate-950/75  border-gray-2 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="w-1/2">
                      <h3 className="text-[18px] font-semibold text-white/95 tracking-tight mb-1.5 font-serif">
                        {mode.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>
                    <div className="w-1/2 flex justify-end">
                      <img
                        src={mode.image}
                        alt={mode.title}
                        className="w-28 h-28 object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Home;
