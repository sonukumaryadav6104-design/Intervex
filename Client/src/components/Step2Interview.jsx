import React, { useState, useRef, useEffect } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import { motion, AnimatePresence } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight, BsCheckCircleFill } from "react-icons/bs";
import axios from "axios";
import { ServerUrl } from "../App";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');`;

export default function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase]   = useState(true);
  const [isMicOn, setIsMicOn]             = useState(true);
  const [isAIPlaying, setIsAIPlaying]     = useState(false);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [answer, setAnswer]               = useState("");
  const [feedback, setFeedback]           = useState("");
  const [timeLeft, setTimeLeft]           = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [voiceGender, setVoiceGender]     = useState("female");
  const [subtitle, setSubtitle]           = useState("");
  const [micLevel, setMicLevel]           = useState(0);

  const recognitionRef = useRef(null);
  const videoRef       = useRef(null);
  const micIntervalRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const totalTime       = currentQuestion?.timeLimit ?? 60;
  const pct             = Math.max(0, Math.min(100, ((totalTime - timeLeft) / totalTime) * 100));
  const isLastQuestion  = currentIndex + 1 >= questions.length;

  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find(v =>
        ["zira","samantha","female"].some(k => v.name.toLowerCase().includes(k)));
      if (female) { setSelectedVoice(female); setVoiceGender("female"); return; }
      const male = voices.find(v =>
        ["david","mark","sonu","male"].some(k => v.name.toLowerCase().includes(k)));
      if (male) { setSelectedVoice(male); setVoiceGender("male"); return; }
      setSelectedVoice(voices[0]); setVoiceGender("female");
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speakText = (text) => new Promise((resolve) => {
    if (!text || !window.speechSynthesis || !selectedVoice) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(
      text.replace(/,/g, ", ...").replace(/\./g, ". ...")
    );
    utt.voice = selectedVoice; utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1;
    utt.onstart = () => { setIsAIPlaying(true); stopMic(); videoRef.current?.play(); };
    utt.onend = () => {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
      setIsAIPlaying(false);
      if (isMicOn) startMic();
      setTimeout(() => { setSubtitle(""); resolve(); }, 300);
    };
    utt.onerror = () => resolve();
    setSubtitle(text);
    window.speechSynthesis.speak(utt);
  });

  useEffect(() => {
    if (!selectedVoice) return;
    (async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Just answer naturally and take your time. Let's begin.");
        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1)
          await speakText("Alright, this one might be a bit more challenging.");
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    })();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion || isSubmitting) return;
    const t = setInterval(() =>
      setTimeLeft(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, [isIntroPhase, currentIndex, isSubmitting]);

  useEffect(() => { if (currentQuestion) setTimeLeft(currentQuestion.timeLimit || 60); }, [currentIndex]);
  useEffect(() => {
    if (!isIntroPhase && currentQuestion && timeLeft === 0 && !isSubmitting && !feedback)
      submitAnswer();
  }, [timeLeft]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const r = new window.webkitSpeechRecognition();
    r.lang = "en-US"; r.continuous = true; r.interimResults = false;
    r.onresult = (e) =>
      setAnswer(p => p + " " + e.results[e.results.length - 1][0].transcript);
    recognitionRef.current = r;
  }, []);

  useEffect(() => {
    if (isMicOn && !isAIPlaying) {
      micIntervalRef.current = setInterval(() => setMicLevel(Math.floor(Math.random() * 5) + 1), 150);
    } else {
      clearInterval(micIntervalRef.current);
      setMicLevel(0);
    }
    return () => clearInterval(micIntervalRef.current);
  }, [isMicOn, isAIPlaying]);

  const startMic = () => { try { recognitionRef.current?.start(); } catch {} };
  const stopMic  = () => { try { recognitionRef.current?.stop(); }  catch {} };
  const toggleMic = () => { if (isMicOn) stopMic(); else startMic(); setIsMicOn(p => !p); };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    if (!answer.trim()) await speakText("No answer was provided.");
    stopMic(); setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${ServerUrl}/api/interview/submit-answer`,
        { interviewId, questionIndex: currentIndex,
          answer: answer.trim() || "No answer provided", timeTaken: totalTime - timeLeft },
        { withCredentials: true });
      setFeedback(data.feedback);
      await speakText(data.feedback);
    } catch (e) { console.error(e); }
    setIsSubmitting(false);
  };

  const handleNext = async () => {
    setAnswer(""); setFeedback("");
    if (isLastQuestion) { finishInterview(); return; }
    await speakText("Alright, let's move to the next question.");
    const next = currentIndex + 1;
    setCurrentIndex(next);
    setTimeLeft(questions[next]?.timeLimit || 60);
    setTimeout(() => { if (isMicOn) startMic(); }, 500);
  };

  const finishInterview = async () => {
    stopMic(); setIsMicOn(false);
    try {
      const { data } = await axios.post(`${ServerUrl}/api/interview/finish`,
        { interviewId }, { withCredentials: true });
      onFinish(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => () => {
    try { recognitionRef.current?.stop(); recognitionRef.current?.abort(); } catch {}
    window.speechSynthesis.cancel();
  }, []);

  const timerColor  = timeLeft <= 15 ? "#ef4444" : timeLeft <= 30 ? "#f59e0b" : "#16a34a";
  const timerBg     = timeLeft <= 15 ? "#fef2f2" : timeLeft <= 30 ? "#fffbeb" : "#f0fdf4";
  const timerBorder = timeLeft <= 15 ? "#fecaca" : timeLeft <= 30 ? "#fde68a" : "#bbf7d0";

  const disabled = isSubmitting || isAIPlaying || isIntroPhase;

  return (
    <>
      <style>{FONTS}</style>

      <div style={{
        position: "fixed", inset: 0,
        background: "#0b214c",
        display: "flex", flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>

        {/* Top nav bar */}
        <div style={{
          height: 56, background: "#110415",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 16, flexShrink: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="4" r="2.5" fill="#fff" />
                <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5"
                  stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, color: "#e8eaf0" }}>Intervex</span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isAIPlaying ? "#f59e0b" : "#22c55e",
              boxShadow: isAIPlaying ? "0 0 0 3px #fef3c7" : "0 0 0 3px #b9d5c3",
            }} />
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              {isAIPlaying ? "AI is speaking…" : isIntroPhase ? "Preparing…" : "Your turn"}
            </span>
          </div>

          <div style={{ height: 20, width: 1, background: "#2653ad", margin: "0 4px" }} />

          <div style={{ display: "flex", gap: 4 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: 24, height: 6, borderRadius: 3,
                background: i < currentIndex ? "#4f46e5" : i === currentIndex ? "#818cf8" : "#e5e7eb",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1, display: "flex", gap: 16,
          padding: 16, overflow: "hidden",
          maxWidth: 1280, width: "100%",
          margin: "0 auto", alignSelf: "stretch",
          boxSizing: "border-box",
        }}>

          {/* LEFT column */}
          <div style={{
            width: 300, flexShrink: 0,
            display: "flex", flexDirection: "column", gap: 12,
          }}>

            {/* Video */}
            <div style={{
              background: "#111827", borderRadius: 16,
              overflow: "hidden", position: "relative",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}>
              <video
                src={voiceGender === "female" ?  femaleVideo : maleVideo}
                key={voiceGender}
                ref={videoRef}
                muted playsInline preload="auto"
                style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />

              {/* Name tag */}
              <div style={{
                position: "absolute", bottom: 10, left: 10,
                background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                borderRadius: 8, padding: "4px 10px",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                {isAIPlaying && (
                  <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 14 }}>
                    {[3, 5, 7, 5, 3].map((h, i) => (
                      <div key={i} style={{
                        width: 2.5, height: h,
                        background: "#657ae3", borderRadius: 2,
                        animation: `eq ${0.4 + i * 0.08}s ease-in-out infinite alternate`,
                      }} />
                    ))}
                  </div>
                )}
                <span style={{ fontSize: 12, color: "#eeeded", fontWeight: 500 }}>AI Interviewer</span>
              </div>

              {/* REC */}
              <div style={{
                position: "absolute", top: 10, right: 10,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                borderRadius: 6, padding: "3px 8px",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#e42f0f",
                  animation: "blink 1.4s ease-in-out infinite",
                }} />
                <span style={{ fontSize: 11, color: "#fff", letterSpacing: "0.05em" }}>REC</span>
              </div>
            </div>

            {/* Subtitle bubble */}
            <AnimatePresence>
              {subtitle && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 12, padding: "12px 14px",
                    fontSize: 13, color: "#374151", lineHeight: 1.6,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <circle cx="4" cy="2.5" r="1.5" fill="#fff" />
                        <path d="M1 7c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>AI Interviewer</span>
                  </div>
                  <p style={{ margin: 0, color: "#1f2937" }}>{subtitle}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            <div style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <p style={{
                margin: "0 0 10px", fontSize: 12, color: "#9ca3af",
                fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Time remaining
              </p>
              <div style={{
                height: 6, background: "#8a9bbe", borderRadius: 6,
                overflow: "hidden", marginBottom: 12,
              }}>
                <div style={{
                  height: "100%", borderRadius: 6, width: `${pct}%`,
                  background: timerColor, transition: "width 1s linear, background 0.5s",
                }} />
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: timerBg, border: `1px solid ${timerBorder}`,
                borderRadius: 8, padding: "6px 12px",
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                  stroke={timerColor} strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
                <span style={{
                  fontVariantNumeric: "tabular-nums", fontSize: 18,
                  fontWeight: 600, color: timerColor, letterSpacing: "-0.02em",
                }}>
                  {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Candidate card */}
            <div style={{
              background: "#ebf4ff", border: "1px solid #e5e7eb",
              borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#18d989", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600, color: "#7c3aed",
              }}>
                {userName?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "#111827" }}>{userName}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Candidate</p>
              </div>
              <div style={{
                marginLeft: "auto", display: "flex",
                gap: 3, alignItems: "flex-end", height: 18,
              }}>
                {[1, 2, 3, 4, 5].map(bar => (
                  <div key={bar} style={{
                    width: 3,
                    height: (isMicOn && !isAIPlaying && micLevel >= bar) ? bar * 3 + 3 : 4,
                    background: (isMicOn && !isAIPlaying && micLevel >= bar) ? "#4f46e5" : "#e5e7eb",
                    borderRadius: 2, transition: "height 0.1s, background 0.1s",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT column */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0,
          }}>

            {/* Question card */}
            <AnimatePresence mode="wait">
              {!isIntroPhase && currentQuestion ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "#d3d2e2", border: "1px solid #e5e7eb",
                    borderRadius: 12, padding: "20px 24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{
                      background: "#1ae3cb", color: "#6d28d9",
                      fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20,
                    }}>
                      Q{currentIndex + 1}
                    </span>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>
                      {isLastQuestion ? "Final question" : `${questions.length - currentIndex - 1} more after this`}
                    </span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 17, fontWeight: 500,
                    color: "#111827", lineHeight: 1.6,
                  }}>
                    {currentQuestion.question}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 12, padding: "20px 24px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", background: "#818cf8",
                      animation: "blink 1.2s ease-in-out infinite",
                    }} />
                    <p style={{ margin: 0, fontSize: 15, color: "#6b7280" }}>Interview starting…</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer area */}
            <div style={{
              flex: 1, background: "#ffff", border: "1px solid #e5e7eb",
              borderRadius: 12, display: "flex", flexDirection: "column",
              overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                padding: "12px 16px", borderBottom: "1px solid #f3f4f6",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
                  stroke="#9ca3af" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af" }}>Your response</span>
                {isMicOn && !isAIPlaying && (
                  <span style={{
                    marginLeft: "auto", fontSize: 11, color: "#4f46e5",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#4f46e5",
                      animation: "blink 1s ease-in-out infinite",
                    }} />
                    Listening
                  </span>
                )}
              </div>
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder="Speak freely or type your answer here…"
                style={{
                  flex: 1, resize: "none", border: "none", outline: "none",
                  padding: "16px", fontSize: 15, lineHeight: 1.7, color: "#1f2937",
                  fontFamily: "'Inter', system-ui, sans-serif", background: "transparent",
                }}
              />
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    background: "#f0fdf4", border: "1px solid #bbf7d0",
                    borderRadius: 12, padding: "16px 20px", flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <BsCheckCircleFill size={14} color="#16a34a" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>Feedback</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, color: "#15803d", lineHeight: 1.6 }}>
                    {feedback}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div style={{
              display: "flex", gap: 10, alignItems: "center", flexShrink: 0,
            }}>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: isMicOn ? "#ede9fe" : "#f3f4f6",
                  border: `1px solid ${isMicOn ? "#c4b5fd" : "#e5e7eb"}`,
                  color: isMicOn ? "#7c3aed" : "#9ca3af",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                {isMicOn ? <FaMicrophone size={16} /> : <FaMicrophoneSlash size={16} />}
              </motion.button>

              {!feedback ? (
                <motion.button
                  onClick={submitAnswer}
                  disabled={disabled}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, height: 44, borderRadius: 10,
                    background: disabled ? "#f3f4f6" : "#4f46e5",
                    border: "none",
                    color: disabled ? "#9ca3af" : "#fff",
                    fontSize: 14, fontWeight: 500,
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    transition: "background 0.2s",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: 14, height: 14, border: "2px solid #d1d5db",
                        borderTopColor: "#4f46e5", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Evaluating…
                    </>
                  ) : "Submit answer"}
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleNext}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    flex: 1, height: 44, borderRadius: 10,
                    background: "#4f46e5", border: "none",
                    color: "#fff", fontSize: 14, fontWeight: 500,
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {isLastQuestion ? "Finish interview" : "Next question"}
                  <BsArrowRight size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes eq    { from{transform:scaleY(0.5)} to{transform:scaleY(1.4)} }
        textarea::placeholder { color: #d1d5db; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>
    </>
  );
}
