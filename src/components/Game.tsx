import React from 'react';
import { GameCanvas } from './GameCanvas';
import { Zap, Gamepad2, Target, Crown } from 'lucide-react';

export const Game: React.FC = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="relative inline-block">
              <h1 className="text-7xl font-black tracking-wider mb-4 relative">
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 blur-sm">
                  SHADOW SWAP
                </span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  SHADOW SWAP
                </span>
              </h1>
              <div className="absolute -top-2 -right-2">
                <Crown className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-32"></div>
              <Zap className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold text-white tracking-widest">ULTIMATE EDITION</span>
              <Zap className="w-6 h-6 text-yellow-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-32"></div>
            </div>
          </div>

        <GameCanvas width={1200} height={800} />
        
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/80 p-6 rounded-2xl border border-purple-500/30">
                <Target className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
                <div className="text-3xl font-black text-white mb-1">10</div>
                <div className="text-purple-300 font-semibold">EPIC LEVELS</div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/80 p-6 rounded-2xl border border-blue-500/30">
                <Gamepad2 className="w-8 h-8 text-blue-400 mb-3 mx-auto" />
                <div className="text-3xl font-black text-white mb-1">3+</div>
                <div className="text-blue-300 font-semibold">HOURS GAMEPLAY</div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/80 p-6 rounded-2xl border border-yellow-500/30">
                <Crown className="w-8 h-8 text-yellow-400 mb-3 mx-auto" />
                <div className="text-3xl font-black text-white mb-1">55</div>
                <div className="text-yellow-300 font-semibold">KEYS TO FIND</div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-black/80 p-6 rounded-2xl border border-red-500/30">
                <Zap className="w-8 h-8 text-red-400 mb-3 mx-auto" />
                <div className="text-3xl font-black text-white mb-1">∞</div>
                <div className="text-red-300 font-semibold">EPIC CHALLENGES</div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full border border-purple-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
