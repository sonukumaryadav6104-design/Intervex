import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import "../index.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

/* ── Global styles ─────────────────────────────────────────────────── */
const GLOBAL = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@500;600;700&display=swap');

:root {
  --bg0: #03050f;
  --bg1: #080d1c;
  --bg2: #0d1428;
  --panel: rgba(255,255,255,0.04);
  --panel-border: rgba(255,255,255,0.08);
  --blue: #3b82f6;
  --blue-dim: rgba(59,130,246,0.15);
  --emerald: #10b981;
  --emerald-dim: rgba(16,185,129,0.12);
  --text-hi: #f0f4ff;
  --text-mid: #8b98b8;
  --text-lo: #3d4a6a;
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

body { margin:0; }

.glass {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  backdrop-filter: blur(12px);
}

/* Custom tooltip */
.recharts-tooltip-wrapper .recharts-default-tooltip {
  background: #0d1428 !important;
  border: 1px solid rgba(59,130,246,0.25) !important;
  border-radius: 10px !important;
  color: #f0f4ff !important;
}

/* Scrollbar */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--text-lo); border-radius: 4px; }
`;

/* ── Custom tooltip for recharts ───────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0d1428", border: "1px solid rgba(59,130,246,0.3)",
      borderRadius: 10, padding: "10px 16px",
    }}>
      <p style={{ margin: 0, fontSize: 12, color: "#8b98b8" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 600, color: "#10b981" }}>
        {payload[0].value}<span style={{ fontSize: 12, color: "#8b98b8" }}>/10</span>
      </p>
    </div>
  );
};

/* ── Skill bar ─────────────────────────────────────────────────────── */
const SkillBar = ({ label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{ marginBottom: 20 }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: "#8b98b8", fontFamily: "var(--font-body)" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#10b981", fontFamily: "var(--font-body)" }}>
        {value}<span style={{ color: "#3d4a6a", fontWeight: 400 }}>/10</span>
      </span>
    </div>
    <div style={{
      height: 6, borderRadius: 6,
      background: "rgba(255,255,255,0.06)",
      overflow: "hidden",
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: "100%", borderRadius: 6,
          background: "linear-gradient(90deg, #10b981, #34d399)",
          boxShadow: "0 0 10px rgba(16,185,129,0.4)",
        }}
      />
    </div>
  </motion.div>
);

/* ── Main component ────────────────────────────────────────────────── */
function Step3Report({ report }) {
  const navigate = useNavigate();

  if (!report) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center",
        background: "#03050f",
        fontFamily: "var(--font-body)",
      }}>
        <p style={{ color: "#8b98b8", fontSize: 16 }}>Loading Report…</p>
      </div>
    );
  }

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((s, i) => ({
    name: `Q${i + 1}`,
    score: s.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";
  let scoreColor = "#ef4444";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses";
    scoreColor = "#10b981";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvements before interviews.";
    shortTagline = "Work on clarity and confidence";
    scoreColor = "#f59e0b";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence";
    scoreColor = "#ef4444";
  }

  const percentage = (finalScore / 10) * 100;

  /* ── PDF ── */
  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, y, { align: "center" });
    y += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 15;

    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, y, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, y + 12, { align: "center" });
    y += 30;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, y, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, y + 10);
    doc.text(`Communication: ${communication}`, margin + 10, y + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, y + 26);
    y += 45;

    let advice = "";
    if (finalScore >= 8)
      advice = "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    else if (finalScore >= 5)
      advice = "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    else
      advice = "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, y, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, y + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(advice, contentWidth - 20), margin + 10, y + 20);
    y += 50;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`, q.question, `${q.score}/10`, q.feedback,
      ]),
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, halign: "center" },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 55 },
        2: { cellWidth: 20, halign: "center" },
        3: { cellWidth: "auto" },
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  /* ── Render ── */
  return (
    <>
      <style>{GLOBAL}</style>

      {/* Page wrapper with deep blue-black gradient */}
      <div style={{
        minHeight: "100vh",
        background: `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(29,78,216,0.18) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 110%, rgba(16,185,129,0.08) 0%, transparent 55%),
          linear-gradient(160deg, #03050f 0%, #060c1e 40%, #0a1230 70%, #04090f 100%)
        `,
        fontFamily: "var(--font-body)",
        padding: "32px 24px 64px",
        boxSizing: "border-box",
      }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: 40,
            maxWidth: 1200, margin: "0 auto 40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => navigate("/history")}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#8b98b8",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >
              <FaArrowLeft size={14} />
            </button>

            <div>
              <h1 style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 700, color: "#f0f4ff",
                letterSpacing: "-0.02em",
              }}>
                Interview Analytics
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#8b98b8" }}>
                AI-powered performance insights
              </p>
            </div>
          </div>

          <motion.button
            onClick={downloadPDF}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: "linear-gradient(135deg, #059669, #10b981)",
              border: "none", color: "#fff",
              padding: "11px 24px", borderRadius: 12,
              fontSize: 14, fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
              letterSpacing: "0.02em",
            }}
          >
            Download PDF
          </motion.button>
        </motion.div>

        {/* ── Grid ── */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}>

          {/* ──── LEFT COLUMN ──── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass"
              style={{ borderRadius: 20, padding: "32px 24px", textAlign: "center" }}
            >
              {/* Score ring */}
              <div className="relative w-[140px] h-[140px] flex items-center justify-center mx-auto mb-5">
                <CircularProgressbar
                  value={percentage}
                  styles={buildStyles({
                    pathColor: scoreColor,
                    trailColor: "rgba(255,255,255,0.06)",
                  })}
                />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[20px] font-semibold"
                    style={{ color: scoreColor }}
                  >
                    {finalScore}/10
                  </span>
                </div>
              </div>

              {/* Score label */}
              <div style={{
                display: "inline-block",
                background: scoreColor === "#10b981" ? "rgba(16,185,129,0.12)"
                  : scoreColor === "#f59e0b" ? "rgba(245,158,11,0.12)"
                    : "rgba(239,68,68,0.12)",
                border: `1px solid ${scoreColor}30`,
                borderRadius: 20, padding: "4px 14px",
                fontSize: 12, fontWeight: 600,
                color: scoreColor, marginBottom: 14,
                letterSpacing: "0.05em",
              }}>
                {finalScore >= 8 ? "EXCELLENT" : finalScore >= 5 ? "GOOD" : "NEEDS WORK"}
              </div>

              <p style={{
                margin: "0 0 6px", fontSize: 14, fontWeight: 500,
                color: "#f0f4ff",
              }}>
                {performanceText}
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#8b98b8" }}>
                {shortTagline}
              </p>
            </motion.div>

            {/* Skill evaluation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass"
              style={{ borderRadius: 20, padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 6, height: 20, borderRadius: 3,
                  background: "linear-gradient(180deg, #3b82f6, #10b981)",
                }} />
                <h3 style={{
                  margin: 0, fontSize: 15, fontWeight: 600,
                  color: "#f0f4ff", fontFamily: "var(--font-display)",
                }}>
                  Skill Evaluation
                </h3>
              </div>

              {skills.map((s, i) => (
                <SkillBar key={i} label={s.label} value={s.value} delay={0.3 + i * 0.1} />
              ))}
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
            >
              {[
                { label: "Questions", value: questionWiseScore.length },
                {
                  label: "Avg Score", value: questionWiseScore.length
                    ? (questionWiseScore.reduce((a, q) => a + (q.score || 0), 0) / questionWiseScore.length).toFixed(1)
                    : 0
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="glass"
                  style={{ borderRadius: 14, padding: "16px 18px" }}
                >
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8b98b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {stat.label}
                  </p>
                  <p style={{
                    margin: 0, fontSize: 26, fontWeight: 700,
                    color: "#f0f4ff", fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
                  }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ──── RIGHT COLUMN (span 2) ──── */}
          <div style={{
            gridColumn: "span 2",
            display: "flex", flexDirection: "column", gap: 20,
          }}>

            {/* Performance trend chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass"
              style={{ borderRadius: 20, padding: "24px 24px 16px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 6, height: 20, borderRadius: 3,
                  background: "linear-gradient(180deg, #3b82f6, #10b981)",
                }} />
                <h3 style={{
                  margin: 0, fontSize: 15, fontWeight: 600,
                  color: "#f0f4ff", fontFamily: "var(--font-display)",
                }}>
                  Performance Trend
                </h3>
              </div>

              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#8b98b8", fontSize: 12 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fill: "#8b98b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#scoreGrad)"
                      dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: "#34d399", strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="glass"
              style={{ borderRadius: 20, padding: "24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 6, height: 20, borderRadius: 3,
                  background: "linear-gradient(180deg, #3b82f6, #10b981)",
                }} />
                <h3 style={{
                  margin: 0, fontSize: 15, fontWeight: 600,
                  color: "#f0f4ff", fontFamily: "var(--font-display)",
                }}>
                  Question Breakdown
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {questionWiseScore.map((q, i) => {
                  const s = q.score ?? 0;
                  const qColor = s >= 8 ? "#10b981" : s >= 5 ? "#f59e0b" : "#ef4444";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16,
                        padding: "20px",
                      }}
                    >
                      {/* Q header */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 12, marginBottom: 14,
                        flexWrap: "wrap",
                      }}>
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <p style={{
                            margin: "0 0 4px",
                            fontSize: 11, color: "#3d4a6a",
                            textTransform: "uppercase", letterSpacing: "0.1em",
                          }}>
                            Question {i + 1}
                          </p>
                          <p style={{
                            margin: 0, fontSize: 14, fontWeight: 500,
                            color: "#f0f4ff", lineHeight: 1.5,
                          }}>
                            {q.question || "Question not available"}
                          </p>
                        </div>

                        {/* Score badge */}
                        <div style={{
                          display: "flex", flexDirection: "column",
                          alignItems: "center", gap: 4, flexShrink: 0,
                        }}>
                          <div style={{
                            width: 52, height: 52,
                            borderRadius: "50%",
                            border: `2px solid ${qColor}40`,
                            background: `${qColor}12`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <span style={{
                              fontSize: 15, fontWeight: 700,
                              color: qColor, fontFamily: "var(--font-display)",
                            }}>
                              {s}
                            </span>
                          </div>
                          <span style={{ fontSize: 10, color: "#3d4a6a" }}>/10</span>
                        </div>
                      </div>

                      {/* Mini score bar */}
                      <div style={{
                        height: 3, borderRadius: 3,
                        background: "rgba(255,255,255,0.05)",
                        overflow: "hidden", marginBottom: 14,
                      }}>
                        <div style={{
                          height: "100%", borderRadius: 3,
                          width: `${s * 10}%`,
                          background: `linear-gradient(90deg, ${qColor}99, ${qColor})`,
                          transition: "width 0.8s ease",
                        }} />
                      </div>

                      {/* Feedback */}
                      <div style={{
                        background: "rgba(16,185,129,0.06)",
                        border: "1px solid rgba(16,185,129,0.15)",
                        borderRadius: 10, padding: "12px 14px",
                      }}>
                        <p style={{
                          margin: "0 0 6px", fontSize: 11,
                          fontWeight: 600, color: "#10b981",
                          textTransform: "uppercase", letterSpacing: "0.08em",
                        }}>
                          AI Feedback
                        </p>
                        <p style={{
                          margin: 0, fontSize: 13,
                          color: "#8b98b8", lineHeight: 1.65,
                        }}>
                          {q.feedback?.trim()
                            ? q.feedback
                            : "No feedback available for this question."}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Step3Report;