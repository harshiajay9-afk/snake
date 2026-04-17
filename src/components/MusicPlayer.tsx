import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Synthesis",
    artist: "AI-Gen Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "Neural Beatz",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Gen-Z Sound Engine",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];
  
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => {
        console.error("Audio play failed automatically - user interaction may be required first", e);
        // We do set isPlaying to false if autoplay is blocked by browser policies
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setProgress(dur > 0 ? (current / dur) * 100 : 0);
    }
  };
  
  const handleEnded = () => {
    handleNext();
  };
  
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = clickX / rect.width;
      audioRef.current.currentTime = newProgress * audioRef.current.duration;
      setProgress(newProgress * 100);
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#ff00ff]/50 shadow-[0_0_20px_rgba(255,0,255,0.15)] rounded-2xl p-6 w-full flex flex-col text-white backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-8 h-8 rounded-full bg-[#ff00ff]/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-[#ff00ff]" />
         </div>
         <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff]">AI Soundscape</h2>
         
         {isPlaying && (
            <div className="flex items-end gap-1 ml-auto h-4 w-6">
                <div className="w-1 bg-[#00ffff] animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: '100%' }}></div>
                <div className="w-1 bg-[#00ffff] animate-[bounce_1.2s_ease-in-out_infinite]" style={{ height: '60%' }}></div>
                <div className="w-1 bg-[#00ffff] animate-[bounce_1.0s_ease-in-out_infinite]" style={{ height: '80%' }}></div>
            </div>
         )}
      </div>
      
      <div className="flex flex-col items-center mb-6 mt-2">
         <div className="w-full text-center">
            <h3 className="text-xl font-bold text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] mb-1 truncate">{currentTrack.title}</h3>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 font-mono">{currentTrack.artist}</p>
         </div>
      </div>
      
      {/* Progress Bar */}
      <div 
        className="w-full h-1.5 bg-gray-800 rounded-full mb-8 cursor-pointer relative overflow-hidden"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-[#ff00ff] to-[#00ffff] transition-all duration-100 ease-linear shadow-[0_0_10px_#00ffff]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full text-gray-500 hover:text-[#00ffff] hover:bg-[#00ffff]/10 transition-colors cursor-pointer"
        >
          <SkipBack className="w-5 h-5" fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ff00ff] to-[#b026ff] text-white hover:scale-105 shadow-[0_0_15px_#ff00ff] transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" fill="currentColor" />
          ) : (
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          )}
        </button>
        
        <button 
          onClick={handleNext}
          className="p-3 rounded-full text-gray-500 hover:text-[#00ffff] hover:bg-[#00ffff]/10 transition-colors cursor-pointer"
        >
          <SkipForward className="w-5 h-5" fill="currentColor" />
        </button>
      </div>
      
      {/* Track List */}
      <div className="mt-8 pt-6 border-t border-gray-800/50">
         <h4 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 px-2">Playlist</h4>
         <div className="space-y-1 max-h-36 overflow-y-auto pr-2 custom-scrollbar">
            {TRACKS.map((t, i) => (
                <div 
                  key={t.id} 
                  onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                  className={`flex items-center p-3 rounded-md cursor-pointer transition-colors text-xs font-mono group ${i === currentTrackIndex ? 'bg-[#ff00ff]/10 text-[#ff00ff] border-l-2 border-[#ff00ff]' : 'hover:bg-gray-800/50 text-gray-400 border-l-2 border-transparent'}`}
                >
                  <span className="opacity-50 w-6">0{i+1}</span>
                  <span className="truncate w-full relative">
                     {t.title}
                  </span>
                  {i === currentTrackIndex && isPlaying && <Music className="w-3 h-3 ml-auto animate-pulse" />}
                </div>
            ))}
         </div>
      </div>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
