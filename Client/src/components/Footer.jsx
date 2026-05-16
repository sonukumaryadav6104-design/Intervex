import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="px-1 pb-10">

      {/* Glow border wrapper */}
      <div className="relative rounded-3xl p-[1px] max-w-7xl mx-auto">

        {/* Gradient glow border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/50 via-blue-500/30 to-violet-500/10 -z-10" />

        <footer className="relative bg-black/80 backdrop-blur-xl rounded-3xl px-8 py-12">

          {/* Top Section */}
          <div className="grid md:grid-cols-4 gap-10">

            {/* Brand */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Intervex
              </h1>
              <p className="mt-4 text-sm text-white/38 leading-relaxed">
                AI-powered interview preparation platform to crack top tech companies.
              </p>

              {/* Social icons moved under brand */}
              <div className="flex gap-4 mt-6 text-white/40">
                <FaGithub className="hover:text-violet-400 cursor-pointer transition-colors duration-200 text-lg" />
                <FaLinkedin className="hover:text-blue-400 cursor-pointer transition-colors duration-200 text-lg" />
                <FaTwitter className="hover:text-sky-400 cursor-pointer transition-colors duration-200 text-lg" />
              </div>
            </div>

            {/* Product */}
            <div>
              <h2 className="text-[11px] font-mono tracking-widest text-white/30 uppercase mb-5">
                Product
              </h2>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Mock Interviews</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">AI Feedback</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Analytics</li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h2 className="text-[11px] font-mono tracking-widest text-white/30 uppercase mb-5">
                Resources
              </h2>
              <ul className="space-y-3 text-sm text-white/50">
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Blogs</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">Guides</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors duration-200">FAQs</li>
              </ul>
            </div>

            {/* Status / Badge column */}
            <div>
              <h2 className="text-[11px] font-mono tracking-widest text-white/30 uppercase mb-5">
                Status
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm text-white/45">All systems operational</span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-mono tracking-widest
                               bg-violet-500/10 border border-violet-500/20
                               text-violet-300/70 rounded-full px-3 py-1">
                v1.0 · Beta
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-violet-500/30 via-blue-500/15 to-transparent my-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/28">
            <p>© {new Date().getFullYear()} Intervex. All rights reserved.</p>
            <p className="mt-3 md:mt-0">
              Designed & Built by{" "}
              <span className="text-white/70 font-semibold hover:text-violet-400 transition-colors duration-200 cursor-pointer">
                Sonu Kumar
              </span>
            </p>
          </div>

        </footer>
      </div>
    </div>
  );
}