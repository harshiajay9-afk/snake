/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { useState } from 'react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono antialiased">
      {/* Dark Neon Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}
      ></div>
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-12 items-center lg:items-stretch justify-center h-full my-auto">
         
         {/* Game Area */}
         <div className="flex-1 w-full max-w-[500px] flex flex-col items-center bg-[#0a0a0a]/80 backdrop-blur-md p-8 border border-white/5 rounded-3xl shadow-2xl relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#00ffff]/20 blur-3xl pointer-events-none rounded-full"></div>
            
            <h1 className="text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_#ffffff] mb-2 uppercase">
              Retro <span className="text-[#39ff14] drop-shadow-[0_0_15px_#39ff14]">Serpent</span>
            </h1>
            
            <div className="text-2xl font-bold text-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] mb-8 flex items-center justify-between w-full px-6 bg-black/40 py-3 rounded-xl border border-[#00ffff]/30">
               <span className="text-[10px] uppercase tracking-widest text-[#00ffff]/70">Score</span>
               <span className="tabular-nums">{score.toString().padStart(4, '0')}</span>
            </div>
            
            <SnakeGame onScoreChange={setScore} />
         </div>

         {/* Music Player Workspace */}
         <div className="w-full lg:w-96 flex flex-col">
            <MusicPlayer />
         </div>
      </div>
    </div>
  );
}
