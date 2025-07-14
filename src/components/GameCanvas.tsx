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
    const difficulties = ['easy', 'medium', 'hard', 'expert', 'expert', 'expert', 'expert', 'expert', 'expert', 'expert'];
    return difficulties[levelIndex] || 'medium';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-orange-400 border-orange-400';
      case 'expert': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
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
            <h3 className="text-lg font-semibold text-purple-300">Game Status</h3>
            <button
              onClick={handleMenuClick}
              className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-1 shadow-lg"
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

      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-xl backdrop-blur-sm border border-purple-500/30">
        <h4 className="text-sm font-semibold text-purple-300 mb-2">Controls</h4>
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
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-12 rounded-2xl text-center shadow-2xl max-w-6xl border border-purple-500/30 backdrop-blur-sm">
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Shadow Swap
              </h1>
              <div className="text-xl text-gray-300 mb-2">Ultimate Puzzle Platformer</div>
              <div className="text-sm text-purple-300 font-semibold">10 Epic Levels • 2+ Hours of Gameplay</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-black/40 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-lg font-bold text-blue-400 mb-4">Core Mechanics</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span>Form Switching</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                    <span>Double Jump & Dash</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span>Wall Sliding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span>Advanced Movement</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-purple-500/30">
                <h3 className="text-lg font-bold text-purple-400 mb-4">Platform Types</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-blue-500 rounded"></span>
                    <span>Physical & Shadow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-green-500 rounded"></span>
                    <span>Moving Platforms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    <span>Crumbling Floors</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-orange-500 rounded"></span>
                    <span>Switch Activated</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-6 rounded-xl border border-cyan-500/30">
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Epic Features</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-red-600 rounded"></span>
                    <span>Elemental Obstacles</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-cyan-500 rounded"></span>
                    <span>Teleporters</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-purple-600 rounded"></span>
                    <span>Ghost Enemies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 bg-gray-400 rounded"></span>
                    <span>Mirror Blocks</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 p-6 rounded-xl border border-yellow-500/30 mb-8">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Epic Journey Awaits</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs text-gray-300">
                <div className="text-center">
                  <div className="text-green-400 font-bold">Levels 1-2</div>
                  <div>Tutorial & Basics</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-bold">Levels 3-4</div>
                  <div>Advanced Mechanics</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-400 font-bold">Levels 5-6</div>
                  <div>Elemental Chaos</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-bold">Levels 7-8</div>
                  <div>Master Challenges</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-bold">Levels 9-10</div>
                  <div>Ultimate Tests</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleShowLevelSelect}
                className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                🚀 Begin Epic Journey
              </button>
              <div className="text-xs text-gray-400">
                Master 10 levels • Collect 55 keys • Defeat elemental challenges • Become the Shadow Master
              </div>
            </div>
          </div>
        </div>
      )}

      {gameState.gameMode === 'levelSelect' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-8 rounded-2xl shadow-2xl max-w-7xl w-full mx-4 border border-purple-500/30 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Select Your Challenge</h2>
                <p className="text-gray-300 mt-2">Choose from 10 epic levels of increasing difficulty</p>
              </div>
              <button
                onClick={handleMainMenu}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((levelIndex) => {
                const levelNames = [
                  "Shadow Awakening",
                  "Shifting Realms", 
                  "Fragile Balance",
                  "Spectral Gauntlet",
                  "Shadow Master",
                  "Elemental Chaos",
                  "Gravity Defiance",
                  "Temporal Maze",
                  "Shadow Nexus",
                  "The Ultimate Challenge"
                ];
                const status = getLevelStatus(levelIndex);
                const difficulty = getLevelDifficulty(levelIndex);
                const isLocked = status === 'locked';
                const timeLimits = [120, 180, 240, 300, 420, 480, 540, 600, 660, 720];
                const keyRequirements = [1, 2, 3, 3, 4, 4, 5, 6, 7, 10];
                const mapSizes = ['Small', 'Medium', 'Large', 'Large', 'XL', 'XL', 'XXL', 'XXL', 'Epic', 'Massive'];
                
                return (
                  <div
                    key={levelIndex}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      isLocked 
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed' 
                        : 'border-purple-500/30 bg-black/40 hover:border-purple-400 hover:bg-black/60 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25'
                    } backdrop-blur-sm`}
                    onClick={() => !isLocked && handleStartLevel(levelIndex)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        Level {levelIndex + 1}
                      </h3>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Play className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 font-semibold ${isLocked ? 'text-gray-500' : 'text-purple-300'}`}>
                      {levelNames[levelIndex]}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${getDifficultyColor(difficulty)} ${
                        difficulty === 'easy' ? 'bg-green-900/50' :
                        difficulty === 'medium' ? 'bg-yellow-900/50' :
                        difficulty === 'hard' ? 'bg-orange-900/50' :
                        'bg-red-900/50'
                      }`}>
                        {difficulty.toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${isLocked ? 'text-gray-500' : 'text-cyan-400'} bg-cyan-900/30`}>
                        {mapSizes[levelIndex]}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {!isLocked && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Time Limit:</span>
                            <span className="text-blue-400 font-semibold">{Math.floor(timeLimits[levelIndex] / 60)}:{(timeLimits[levelIndex] % 60).toString().padStart(2, '0')}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Keys Required:</span>
                            <span className="text-yellow-400 font-semibold">{keyRequirements[levelIndex]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {!isLocked ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <Star className="w-3 h-3 text-yellow-500" />
                          <Star className="w-3 h-3 text-gray-600" />
                        </div>
                        <div className="text-xs text-green-400 font-semibold">
                          UNLOCKED
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-500 font-semibold">
                        LOCKED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 p-6 bg-black/40 rounded-xl border border-yellow-500/30">
              <h4 className="font-bold text-yellow-400 mb-4 text-lg">Epic Features Across All Levels:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Form switching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Double jumping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Dash attacks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>Wall sliding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span>Moving platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Crumbling floors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                  <span>Switch puzzles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <span>Ghost enemies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  <span>Elemental obstacles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>Teleporters</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span>Mirror blocks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  <span>Epic challenges</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600 text-center">
                <p className="text-gray-300 text-sm">
                  <span className="font-semibold text-purple-400">Total Playtime:</span> 2+ hours • 
                  <span className="font-semibold text-yellow-400"> 55 Keys to collect</span> • 
                  <span className="font-semibold text-cyan-400"> 10 Epic levels</span> • 
                  <span className="font-semibold text-red-400"> Ultimate challenges await!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};