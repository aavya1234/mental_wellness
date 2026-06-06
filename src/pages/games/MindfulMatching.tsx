import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MindfulMatching = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const matchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['🧘', '🌸', '🍃', '🌈', '☀️', '🌙', '⭐', '💙', '🕊️', '🦋'];

  const initializeGame = useCallback(() => {
    const gameEmojis = emojis.slice(0, 8);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameCompleted(false);
    setMatchedPairs(0);
    
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Fixed timer effect
  useEffect(() => {
    if (gameStarted && !gameCompleted && !timeIntervalRef.current) {
      timeIntervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
    };
  }, [gameStarted, gameCompleted]);

  // Fixed matching logic - no dependency loop
  useEffect(() => {
    if (flippedCards.length === 2) {
      const first = flippedCards[0];
      const second = flippedCards[1];
      
      matchTimeoutRef.current = setTimeout(() => {
        setFlippedCards([]);
        
        if (cards[first]?.emoji === cards[second]?.emoji) {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
        } else {
          setCards(prev => prev.map((card, index) => 
            index === first || index === second 
              ? { ...card, isFlipped: false }
              : card
          ));
        }
        setMoves(prev => prev + 1);
      }, 800);

      return () => {
        if (matchTimeoutRef.current) {
          clearTimeout(matchTimeoutRef.current);
        }
      };
    }
  }, [flippedCards.length]); // Only length triggers

  // Game completion
  useEffect(() => {
    if (matchedPairs === 8 && gameStarted && !gameCompleted) {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
      
      try {
        const gameData = {
          game: 'mindful-matching',
          score: Math.max(1000 - moves * 10 - time, 100),
          moves,
          time,
          timestamp: new Date().toISOString()
        };
        const gameHistory = JSON.parse(localStorage.getItem('game_history') || '[]');
        gameHistory.push(gameData);
        localStorage.setItem('game_history', JSON.stringify(gameHistory));
      } catch (error) {
        console.log('LocalStorage save failed');
      }
      
      setGameCompleted(true);
    }
  }, [matchedPairs, gameStarted]);

  const handleCardClick = (index: number) => {
    if (index < 0 || index >= cards.length) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (
      cards[index]?.isFlipped || 
      cards[index]?.isMatched || 
      flippedCards.length === 2 ||
      gameCompleted
    ) {
      return;
    }

    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScore = () => {
    return Math.max(1000 - moves * 10 - time, 100);
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
            Mindful Matching 🧘
          </h1>
          <Button onClick={initializeGame} variant="outline" className="border-emerald-200 hover:bg-emerald-100">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Game
          </Button>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="text-center border-emerald-200/30 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Time</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatTime(time)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-teal-200/30 bg-teal-50/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-teal-700 mb-2">Moves</div>
              <div className="text-2xl font-bold text-teal-600">{moves}</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-cyan-200/30 bg-cyan-50/50">
            <CardContent className="p-4">
              <div className="text-sm font-medium text-cyan-700 mb-2">Pairs</div>
              <div className="text-2xl font-bold text-cyan-600">{matchedPairs}/8</div>
            </CardContent>
          </Card>
          
          <Card className="text-center border-emerald-200/30 bg-emerald-50/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Score</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {gameStarted ? getScore() : 1000}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Completion */}
        {gameCompleted && (
          <Card className="border-emerald-200/30 bg-gradient-to-r from-emerald-50/20 to-teal-50/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-emerald-600 font-bold">
                🎉 Congratulations! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div>
                  <div className="text-lg font-bold text-emerald-600">{formatTime(time)}</div>
                  <div className="text-xs text-emerald-500">Time</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-teal-600">{moves}</div>
                  <div className="text-xs text-teal-500">Moves</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">{getScore()}</div>
                  <div className="text-xs text-emerald-500">Score</div>
                </div>
              </div>
              <p className="text-sm text-emerald-700 font-medium">
                Great job practicing mindfulness and focus! 🧘‍♀️
              </p>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <Card className="border-emerald-200/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-emerald-700 font-bold">
              Find the matching pairs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {cards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square rounded-2xl border-3 text-4xl flex items-center justify-center
                    transition-all duration-500 hover:scale-105 relative overflow-hidden shadow-lg
                    ${card.isMatched 
                      ? 'border-emerald-400 bg-emerald-100 shadow-emerald-300 text-emerald-600' 
                      : card.isFlipped 
                        ? 'border-emerald-500 bg-emerald-500/20 shadow-emerald-200 text-emerald-700' 
                        : 'border-emerald-200/50 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 hover:border-emerald-400 hover:bg-emerald-200/70'
                    }
                  `}
                  disabled={card.isFlipped || card.isMatched || flippedCards.length === 2 || gameCompleted}
                >
                  <div className={`
                    transition-all duration-500 
                    ${card.isFlipped || card.isMatched ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                  `}>
                    {card.emoji}
                  </div>
                  {!card.isFlipped && !card.isMatched && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 flex items-center justify-center rounded-2xl">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400/50 to-teal-400/50 shadow-lg animate-pulse"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-teal-200/30 bg-gradient-to-r from-emerald-50/30 to-teal-50/30">
          <CardContent className="p-6">
            <h3 className="font-bold text-xl text-emerald-800 mb-4">How to Play:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-3 text-emerald-700">
                <li className="flex items-start gap-3 p-3 bg-emerald-100/60 rounded-xl border-l-4 border-emerald-400 hover:bg-emerald-100/80 transition-all">
                  <span className="text-emerald-500 font-bold mt-1 min-w-[1.5rem]">1.</span>
                  <span>Click any card to flip</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-emerald-100/60 rounded-xl border-l-4 border-emerald-400 hover:bg-emerald-100/80 transition-all">
                  <span className="text-emerald-500 font-bold mt-1 min-w-[1.5rem]">3.</span>
                  <span>Matches stay flipped</span>
                </li>
              </ul>
              <ul className="space-y-3 text-teal-700">
                <li className="flex items-start gap-3 p-3 bg-teal-100/60 rounded-xl border-l-4 border-teal-400 hover:bg-teal-100/80 transition-all">
                  <span className="text-teal-500 font-bold mt-1 min-w-[1.5rem]">2.</span>
                  <span>Find matching pair</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-teal-100/60 rounded-xl border-l-4 border-teal-400 hover:bg-teal-100/80 transition-all">
                  <span className="text-teal-500 font-bold mt-1 min-w-[1.5rem]">✨</span>
                  <span>Stay present & mindful</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    );
  };

export default MindfulMatching;
