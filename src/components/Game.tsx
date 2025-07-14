import React from 'react';
import { GameCanvas } from './GameCanvas';

export const Game: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Shadow Swap</h1>
        <p className="text-gray-300 mb-8">Master the ultimate puzzle platformer challenge</p>
        <GameCanvas width={1200} height={800} />
        
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Advanced Mechanics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-400">Platform Types</h4>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-blue-500 rounded"></span>
                  <span>Physical platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-purple-500 rounded"></span>
                  <span>Shadow platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-green-500 rounded"></span>
                  <span>Moving platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span>Crumbling platforms</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-yellow-400">Obstacles & Hazards</h4>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-red-600 rounded"></span>
                  <span>Spikes & saws</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-red-400 rounded"></span>
                  <span>Laser beams</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-purple-600 rounded"></span>
                  <span>Ghost enemies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-black rounded border border-white"></span>
                  <span>Void zones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-orange-500 rounded"></span>
                  <span>Fireballs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-cyan-400 rounded"></span>
                  <span>Ice & Wind zones</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-400">Collectibles & Powers</h4>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                  <span>Keys & coins</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-green-400 rounded"></span>
                  <span>Health pickups</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-purple-400 rounded"></span>
                  <span>Power-ups</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-orange-500 rounded"></span>
                  <span>Switches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-cyan-500 rounded"></span>
                  <span>Teleporters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-400 rounded"></span>
                  <span>Mirror blocks</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600 text-center">
              <p className="text-gray-300">
                <span className="font-semibold">Epic Features:</span> 10 massive levels, elemental obstacles, teleporters, 
                wind/ice zones, mirror blocks, and ultimate challenges that will test every skill!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};