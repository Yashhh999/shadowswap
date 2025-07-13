import React, { useRef, useEffect, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { GameState } from '../types/game';
import { Heart, Key, Clock, Trophy, Home, Play, Lock, Star } from 'lucide-react';

interface GameCanvasProps {
  width: number;
  height: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    currentLevel: 0,
    playerForm: 'physical',
    gameWon: false,
    gameOver: false,
    gameMode: 'menu'
  });
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      gameEngineRef.current = new GameEngine(canvasRef.current);
      
      const updateGameState = () => {
        if (gameEngineRef.current) {
          setGameState(gameEngineRef.current.getGameState());
        }
      };

      const gameStateInterval = setInterval(updateGameState, 100);
      
      return () => {
        clearInterval(gameStateInterval);
        if (gameEngineRef.current) {
          gameEngineRef.current.stop();
        }
      };
    }
  }, []);

  const handleShowLevelSelect = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.showLevelSelect();
    }
  };

  const handleStartLevel = (levelIndex: number) => {
    if (gameEngineRef.current) {
      gameEngineRef.current.startLevel(levelIndex);
    }
  };

  const handleMainMenu = () => {
    setShowMenuConfirm(false);
    if (gameEngineRef.current) {
      gameEngineRef.current.showMainMenu();
    }
  };

  const handleMenuClick = () => {
    setShowMenuConfirm(true);
  };

  const handleCancelMenu = () => {
    setShowMenuConfirm(false);
  };

  const handleRestart = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.restart();
    }
  };

  const handleStop = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.stop();
    }
  };

  const getLevelStatus = (levelIndex: number) => {
    return 'unlocked';
  };

  const getLevelDifficulty = (levelIndex: number) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert', 'expert'];
    return difficulties[levelIndex] || 'medium';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="border border-gray-300 rounded-lg shadow-lg"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {gameState.gameMode === 'playing' && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg backdrop-blur-sm min-w-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Game Status</h3>
            <button
              onClick={handleMenuClick}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors flex items-center space-x-1"
            >
              <Home className="w-3 h-3" />
              <span>Menu</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Level: <span className="font-bold text-yellow-400">{gameState.currentLevel + 1}</span></span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Lives: <span className="font-bold text-red-400">{gameState.lives}</span></span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Key className="w-4 h-4 text-yellow-400" />
                <span>Keys: <span className="font-bold text-yellow-400">{gameState.keysCollected}</span></span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Time: <span className="font-bold text-blue-400">{Math.ceil(gameState.timeRemaining / 60)}</span></span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-sm">
              Form: <span className={`font-bold ${gameState.playerForm === 'shadow' ? 'text-purple-400' : 'text-blue-400'}`}>
                {gameState.playerForm === 'shadow' ? 'Shadow' : 'Physical'}
              </span>
            </div>
            <div className="text-sm mt-1">
              Score: <span className="font-bold text-green-400">{gameState.score}</span>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg backdrop-blur-sm">
        <div className="text-xs space-y-1">
          <div><span className="font-bold text-blue-400">WASD/Arrows:</span> Move</div>
          <div><span className="font-bold text-purple-400">Space:</span> Switch Form</div>
          <div><span className="font-bold text-yellow-400">X:</span> Dash</div>
          <div><span className="font-bold text-green-400">W (double):</span> Double Jump</div>
          <div><span className="font-bold text-red-400">Wall Slide:</span> Auto</div>
        </div>
      </div>

      {showMenuConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Return to Main Menu?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to return to the main menu? Your current progress will be lost.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleMainMenu}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Yes, Return to Menu
              </button>
              <button
                onClick={handleCancelMenu}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(gameState.gameWon || gameState.gameOver) && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {gameState.gameWon ? '🎉 You Win!' : '💀 Game Over'}
            </h2>
            <p className="text-gray-600 mb-6">
              {gameState.gameWon 
                ? 'Congratulations! You mastered the shadow realm!'
                : 'Better luck next time, shadow walker!'
              }
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Play Again
            </button>
            <button
              onClick={handleMainMenu}
              className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Main Menu</span>
            </button>
          </div>
        </div>
      )}

      {gameState.gameMode === 'menu' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center shadow-2xl max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Shadow Swap</h2>
            <p className="text-gray-600 mb-6">
              Master the art of form-switching in this challenging puzzle platformer! 
              Navigate through bigger levels with unique obstacles, collect keys, and reach the portal.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-6">
              <div className="space-y-1">
                <div><span className="text-blue-500">■</span> Physical platforms</div>
                <div><span className="text-purple-500">■</span> Shadow platforms</div>
                <div><span className="text-gray-500">■</span> Universal platforms</div>
                <div><span className="text-green-500">■</span> Moving platforms</div>
              </div>
              <div className="space-y-1">
                <div><span className="text-red-500">■</span> Crumbling platforms</div>
                <div><span className="text-orange-500">■</span> Switch platforms</div>
                <div><span className="text-yellow-500">★</span> Keys & powerups</div>
                <div><span className="text-red-600">⚠</span> Deadly obstacles</div>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-4">
              Features: Double jump, dash ability, wall sliding, moving platforms, crumbling floors
            </div>
            <button
              onClick={handleShowLevelSelect}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Select Level
            </button>
          </div>
        </div>
      )}

      {gameState.gameMode === 'levelSelect' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Select Level</h2>
              <button
                onClick={handleMainMenu}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4].map((levelIndex) => {
                const levelNames = [
                  "Shadow Awakening",
                  "Shifting Realms", 
                  "Fragile Balance",
                  "Spectral Gauntlet",
                  "Shadow Master"
                ];
                const status = getLevelStatus(levelIndex);
                const difficulty = getLevelDifficulty(levelIndex);
                const isLocked = status === 'locked';
                
                return (
                  <div
                    key={levelIndex}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isLocked 
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                        : 'border-blue-300 bg-blue-50 hover:border-blue-500 hover:bg-blue-100 cursor-pointer'
                    }`}
                    onClick={() => !isLocked && handleStartLevel(levelIndex)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                        Level {levelIndex + 1}
                      </h3>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Play className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {levelNames[levelIndex]}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(difficulty)} bg-gray-200`}>
                        {difficulty.toUpperCase()}
                      </span>
                      {!isLocked && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <Star className="w-3 h-3 text-yellow-500" />
                          <Star className="w-3 h-3 text-gray-300" />
                        </div>
                      )}
                    </div>
                    
                    {!isLocked && (
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Time Limit: {[120, 180, 240, 300, 420][levelIndex]}s</div>
                        <div>Keys Required: {[1, 2, 3, 3, 4][levelIndex]}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Game Features:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                <div>• Form switching</div>
                <div>• Double jumping</div>
                <div>• Dash attacks</div>
                <div>• Wall sliding</div>
                <div>• Moving platforms</div>
                <div>• Crumbling floors</div>
                <div>• Switch puzzles</div>
                <div>• Ghost enemies</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};