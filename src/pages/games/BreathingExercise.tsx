import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  description: string;
}

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const patterns: BreathingPattern[] = [
    {
      name: '4-4-4 (Box Breathing)',
      inhale: 4,
      hold: 4,
      exhale: 4,
      description: 'Equal timing for calm focus'
    },
    {
      name: '4-7-8 (Relaxing)',
      inhale: 4,
      hold: 7,
      exhale: 8,
      description: 'Promotes deep relaxation'
    },
    {
      name: '6-2-6 (Energizing)',
      inhale: 6,
      hold: 2,
      exhale: 6,
      description: 'Gentle energizing breath'
    },
    {
      name: '5-5-5 (Balanced)',
      inhale: 5,
      hold: 5,
      exhale: 5,
      description: 'Balanced breathing pattern'
    }
  ];

  const currentPattern = patterns[selectedPattern];

  // Fix useEffect dependency issue
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime > 1) {
            return prevTime - 1;
          } else {
            const nextPhase = currentPhase === 'inhale' ? 'hold' : 
                            currentPhase === 'hold' ? 'exhale' : 'inhale';
            setCurrentPhase(nextPhase);
            
            const nextTime = nextPhase === 'inhale' ? currentPattern.inhale :
                           nextPhase === 'hold' ? currentPattern.hold : currentPattern.exhale;
            
            if (nextPhase === 'inhale') {
              setCycleCount(prev => prev + 1);
            }
            
            return nextTime;
          }
        });
        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]); // Removed problematic dependencies

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(currentPattern.inhale);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setTotalTime(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(currentPattern.inhale);
    setCycleCount(0);
    setTotalTime(0);
  };

  const handlePatternChange = (index: number) => {
    setSelectedPattern(index);
    if (!isActive) {
      setTimeLeft(patterns[index].inhale);
      setCurrentPhase('inhale');
    }
  };

  // Save to localStorage when session ends
  useEffect(() => {
    if (!isActive && totalTime > 0) {
      try {
        const sessionData = {
          game: 'breathing-exercise',
          pattern: currentPattern.name,
          cycles: cycleCount,
          duration: totalTime,
          timestamp: new Date().toISOString()
        };
        const gameHistory = JSON.parse(localStorage.getItem('game_history') || '[]');
        gameHistory.push(sessionData);
        localStorage.setItem('game_history', JSON.stringify(gameHistory));
      } catch (error) {
        console.log('LocalStorage save failed:', error);
      }
    }
  }, [isActive]); // Simplified dependency

  const getCircleScale = () => {
    const totalPhaseTime = currentPhase === 'inhale' ? currentPattern.inhale : 
                          currentPhase === 'hold' ? currentPattern.hold : currentPattern.exhale;
    const progress = (totalPhaseTime - timeLeft) / totalPhaseTime;
    
    if (currentPhase === 'inhale') return 0.5 + (progress * 0.5);
    if (currentPhase === 'exhale') return 1 - (progress * 0.5);
    return 1;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-emerald-400 to-teal-400';
      case 'hold': return 'from-emerald-500 to-teal-500';
      case 'exhale': return 'from-teal-500 to-cyan-500';
      default: return 'from-emerald-500 to-teal-500';
    }
  };

  const getInstructions = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Get Ready';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/games">
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-500 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Breathing Exercise 🌬️
          </h1>
          <div className="w-32" />
        </div>

        {/* Pattern Selection */}
        <Card className="border-emerald-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Settings className="h-5 w-5" />
              Choose Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {patterns.map((pattern, index) => (
                <button
                  key={index}
                  onClick={() => handlePatternChange(index)}
                  className={`
                    p-3 rounded-lg border-2 text-left transition-all hover:scale-105 disabled:opacity-50
                    ${selectedPattern === index 
                      ? 'border-emerald-500 bg-emerald-100 shadow-md text-emerald-800' 
                      : 'border-emerald-200 hover:border-emerald-400 bg-white/70 hover:bg-emerald-50'
                    }
                  `}
                  disabled={isActive}
                >
                  <div className="font-bold text-sm mb-1">{pattern.name}</div>
                  <div className="text-xs text-gray-600 mb-1">{pattern.description}</div>
                  <div className="text-xs font-semibold text-emerald-700">
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}s
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Breathing Interface */}
        <Card className="border-emerald-200/30 shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6 text-center">
              {/* Breathing Circle */}
              <div className="relative w-64 h-64 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200/40 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                
                <div 
                  className={`absolute inset-4 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl flex items-center justify-center transition-all duration-[1200ms] ease-in-out`}
                  style={{
                    transform: `scale(${getCircleScale()})`,
                    opacity: isActive ? 1 : 0.6
                  }}
                >
                  <div className="text-white font-black text-4xl drop-shadow-lg">{timeLeft}</div>
                </div>

                {/* Phase Dots */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentPhase === 'inhale' ? 'bg-emerald-400 scale-150 shadow-md' : 'bg-emerald-200'}`}></div>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentPhase === 'hold' ? 'bg-emerald-500 scale-150 shadow-md' : 'bg-emerald-200'}`}></div>
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className={`w-2.5 h-2.5 rounded-full transition-all ${currentPhase === 'exhale' ? 'bg-teal-400 scale-150 shadow-md' : 'bg-emerald-200'}`}></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-emerald-800 tracking-tight">
                  {getInstructions()}
                </h2>
                <p className="text-emerald-600 text-sm font-medium">
                  {isActive ? `Follow the circle • ${getInstructions().toLowerCase()}` : 'Click START to begin'}
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                {!isActive ? (
                  <Button 
                    onClick={handleStart}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-emerald-400/50 text-white font-bold h-14 text-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    START
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePause}
                    variant="outline"
                    className="flex-1 border-emerald-400 hover:bg-emerald-500 hover:text-white font-bold h-14 text-lg"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    PAUSE
                  </Button>
                )}
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-emerald-300 hover:bg-emerald-50 font-semibold h-14"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-emerald-200/50 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-emerald-600 mb-1">{cycleCount}</div>
              <div className="text-sm text-emerald-700 font-medium">Cycles</div>
            </CardContent>
          </Card>
          <Card className="border-teal-200/50 text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-teal-600 mb-1">{formatTime(totalTime)}</div>
              <div className="text-sm text-teal-700 font-medium">Time</div>
            </CardContent>
          </Card>
          <Card className="border-cyan-200/50 text-center">
            <CardContent className="p-6">
              <div className="text-xl font-bold text-cyan-600 mb-1">{currentPattern.name.split(' ')[0]}</div>
              <div className="text-sm text-cyan-700 font-medium">Pattern</div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
  <CardContent className="p-6">
    <h3 className="font-bold text-xl text-emerald-800 mb-6">Benefits of Controlled Breathing:</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ul className="space-y-3 text-emerald-700">
        <li className="flex items-start gap-3 p-3 bg-emerald-100/50 rounded-xl border-l-4 border-emerald-400 hover:bg-emerald-100/70 transition-all">
          <span className="text-emerald-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Reduces stress and anxiety</span>
        </li>
        <li className="flex items-start gap-3 p-3 bg-emerald-100/50 rounded-xl border-l-4 border-emerald-400 hover:bg-emerald-100/70 transition-all">
          <span className="text-emerald-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Improves focus and concentration</span>
        </li>
        <li className="flex items-start gap-3 p-3 bg-emerald-100/50 rounded-xl border-l-4 border-emerald-400 hover:bg-emerald-100/70 transition-all">
          <span className="text-emerald-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Promotes better sleep</span>
        </li>
      </ul>
      <ul className="space-y-3 text-teal-700">
        <li className="flex items-start gap-3 p-3 bg-teal-100/50 rounded-xl border-l-4 border-teal-400 hover:bg-teal-100/70 transition-all">
          <span className="text-teal-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Lowers blood pressure</span>
        </li>
        <li className="flex items-start gap-3 p-3 bg-teal-100/50 rounded-xl border-l-4 border-teal-400 hover:bg-teal-100/70 transition-all">
          <span className="text-teal-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Increases mindfulness</span>
        </li>
        <li className="flex items-start gap-3 p-3 bg-teal-100/50 rounded-xl border-l-4 border-teal-400 hover:bg-teal-100/70 transition-all">
          <span className="text-teal-500 font-bold mt-1 flex-shrink-0 min-w-[1rem]">•</span>
          <span>Enhances emotional regulation</span>
        </li>
      </ul>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default BreathingExercise;
