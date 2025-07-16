import React, { useRef, useEffect, useState } from 'react';
import { GameEngine } from '../utils/gameEngine';
import { GameState } from '../types/game';
import { Heart, Key, Clock, Trophy, Home, Play, Lock, Star, Maximize, Minimize } from 'lucide-react';

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
    lives: 3,
    score: 0,
    timeRemaining: 120,
    keysCollected: 0,
    totalKeys: 0,
    gameMode: 'menu'
  });
  const [showMenuConfirm, setShowMenuConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.log('Error attempting to exit fullscreen:', err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getLevelStatus = (levelIndex: number) => {
    return 'unlocked';
  };

  const getLevelDifficulty = (levelIndex: number) => {
    const difficulties = ['easy', 'medium', 'hard', 'expert', 'expert', 'nightmare', 'nightmare', 'insane', 'insane', 'impossible'];
    return difficulties[levelIndex] || 'medium';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      case 'nightmare': return 'text-purple-400';
      case 'insane': return 'text-pink-400';
      case 'impossible': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyGlow = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'shadow-green-500/50';
      case 'medium': return 'shadow-yellow-500/50';
      case 'hard': return 'shadow-orange-500/50';
      case 'expert': return 'shadow-red-500/50';
      case 'nightmare': return 'shadow-purple-500/50';
      case 'insane': return 'shadow-pink-500/50';
      case 'impossible': return 'shadow-cyan-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <div 
      ref={gameContainerRef}
      className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : ''}`}
    >
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className={`border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ${
          isFullscreen ? 'max-w-[95vw] max-h-[95vh] w-auto h-auto' : ''
        }`}
        style={{ 
          imageRendering: 'pixelated',
          ...(isFullscreen && {
            width: 'auto',
            height: 'auto',
            maxWidth: '95vw',
            maxHeight: '95vh'
          })
        }}
      />

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-20 bg-black bg-opacity-70 text-white p-3 rounded-lg backdrop-blur-sm hover:bg-opacity-90 transition-all duration-200 group"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
        ) : (
          <Maximize className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
        )}
      </button>

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
          <div><span className="font-bold text-green-400">W</span> Jump</div>
          <div><span className="font-bold text-red-400">Wall Slide:</span> Auto</div>
          <div><span className="font-bold text-cyan-400">F11:</span> Fullscreen</div>
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
              Features: dash ability, wall sliding, moving platforms, crumbling floors
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleShowLevelSelect}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Select Level</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold flex items-center space-x-2"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState.gameMode === 'levelSelect' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8 rounded-2xl shadow-2xl max-w-7xl w-full mx-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  SELECT YOUR CHALLENGE
                </h2>
                <p className="text-gray-300 text-lg">Choose your path through the Shadow Realm</p>
              </div>
              <button
                onClick={handleMainMenu}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center space-x-2 shadow-lg"
              >
                <Home className="w-5 h-5" />
                <span className="font-semibold">Back</span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {Array.from({length: 10}, (_, i) => i).map((levelIndex) => {
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
                const timeLimits = [120, 180, 240, 300, 420, 480, 540, 600, 720, 900];
                const keyRequirements = [1, 2, 3, 3, 4, 4, 5, 5, 6, 8];
                
                return (
                  <div
                    key={levelIndex}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      isLocked 
                        ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-60' 
                        : `border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-blue-900/40 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/25 cursor-pointer backdrop-blur-sm`
                    }`}
                    onClick={() => !isLocked && handleStartLevel(levelIndex)}
                  >
                    <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isLocked ? 'bg-gray-600 text-gray-400' : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                    }`}>
                      {levelIndex + 1}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        Level {levelIndex + 1}
                      </h3>
                      {isLocked ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                      ) : (
                        <Play className={`w-6 h-6 ${levelIndex >= 8 ? 'text-cyan-400' : levelIndex >= 5 ? 'text-purple-400' : 'text-blue-400'}`} />
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 font-semibold ${isLocked ? 'text-gray-500' : 'text-purple-300'}`}>
                      {levelNames[levelIndex]}
                    </p>
                    
                    <div className="space-y-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${getDifficultyColor(difficulty)} ${
                        isLocked ? 'bg-gray-700' : 'bg-gray-800/70'
                      } shadow-sm`}>
                        {difficulty.toUpperCase()}
                      </span>
                      
                      {!isLocked && (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded ${isLocked ? 'text-gray-500' : 'text-cyan-400'} bg-cyan-900/30`}>
                              ⏱️ {Math.floor(timeLimits[levelIndex] / 60)}:{(timeLimits[levelIndex] % 60).toString().padStart(2, '0')}
                            </span>
                            <span className={`px-2 py-1 rounded ${isLocked ? 'text-gray-500' : 'text-yellow-400'} bg-yellow-900/30`}>
                              🗝️ {keyRequirements[levelIndex]}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-center space-x-1 mt-2">
                            {Array.from({length: Math.min(5, Math.floor(levelIndex / 2) + 1)}, (_, i) => (
                              <Star key={i} className={`w-3 h-3 ${
                                difficulty === 'impossible' ? 'text-cyan-400' :
                                difficulty === 'insane' ? 'text-pink-400' :
                                difficulty === 'nightmare' ? 'text-purple-400' :
                                difficulty === 'expert' ? 'text-red-400' : 'text-yellow-400'
                              }`} fill="currentColor" />
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {!isLocked && levelIndex >= 8 && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <h4 className="font-bold text-xl text-white mb-4 text-center">🎮 GAME FEATURES</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">• Form Switching</div>
                  <div className="text-blue-400 font-semibold">• Jumping</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 font-semibold">• Dash Attacks</div>
                  <div className="text-green-400 font-semibold">• Wall Sliding</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 font-semibold">• Moving Platforms</div>
                  <div className="text-orange-400 font-semibold">• Crumbling Floors</div>
                </div>
                <div className="text-center">
                  <div className="text-pink-400 font-semibold">• Switch Puzzles</div>
                  <div className="text-cyan-400 font-semibold">• Ghost Enemies</div>
                </div>
              </div>
              <div className="text-center mt-4 text-purple-300 font-semibold">
                💀 ADVANCED: Elemental Chaos • Gravity Defiance • Temporal Mechanics • Ultimate Challenges
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
