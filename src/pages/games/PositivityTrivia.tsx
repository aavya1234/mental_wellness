import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const PositivityTrivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the practice of focusing on the present moment called?",
      options: ["Meditation", "Mindfulness", "Reflection", "Concentration"],
      correct: 1,
      explanation: "Mindfulness is the practice of purposefully paying attention to the present moment without judgment.",
      category: "Mindfulness"
    },
    {
      id: 2,
      question: "Which hormone is often called the 'happiness hormone'?",
      options: ["Cortisol", "Adrenaline", "Serotonin", "Insulin"],
      correct: 2,
      explanation: "Serotonin is a neurotransmitter that contributes to feelings of well-being and happiness.",
      category: "Science"
    },
    {
      id: 3,
      question: "What is the recommended amount of sleep for most adults?",
      options: ["5-6 hours", "7-9 hours", "10-12 hours", "4-5 hours"],
      correct: 1,
      explanation: "Most adults need 7-9 hours of quality sleep per night for optimal health and well-being.",
      category: "Health"
    },
    {
      id: 4,
      question: "Which activity has been scientifically proven to boost mood?",
      options: ["Watching TV", "Exercise", "Shopping", "Eating sweets"],
      correct: 1,
      explanation: "Regular exercise releases endorphins, which are natural mood boosters and stress relievers.",
      category: "Wellness"
    },
    {
      id: 5,
      question: "What is gratitude practice?",
      options: ["Saying thank you", "Acknowledging good things in life", "Paying bills", "Being polite"],
      correct: 1,
      explanation: "Gratitude practice involves regularly acknowledging and appreciating the positive aspects of life.",
      category: "Positive Psychology"
    },
    {
      id: 6,
      question: "Which breathing technique is known for reducing anxiety?",
      options: ["Fast breathing", "Shallow breathing", "Deep breathing", "Irregular breathing"],
      correct: 2,
      explanation: "Deep, slow breathing activates the parasympathetic nervous system, which promotes calm and reduces anxiety.",
      category: "Wellness"
    },
    {
      id: 7,
      question: "What does the acronym 'SMART' stand for in goal setting?",
      options: ["Simple, Meaningful, Achievable, Realistic, Timely", "Specific, Measurable, Achievable, Relevant, Time-bound", "Strong, Motivating, Accurate, Reliable, Thoughtful", "Strategic, Memorable, Actionable, Reasonable, Trackable"],
      correct: 1,
      explanation: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound, making them more likely to be accomplished.",
      category: "Personal Development"
    },
    {
      id: 8,
      question: "Which of these is a sign of good mental health?",
      options: ["Never feeling sad", "Being able to cope with stress", "Always being happy", "Avoiding all challenges"],
      correct: 1,
      explanation: "Good mental health includes the ability to cope with normal stresses of life, not the absence of all negative emotions.",
      category: "Mental Health"
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setGameCompleted(true);
      // Save to game history with error handling
      try {
        const finalScore = score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0);
        const gameData = {
          game: 'positivity-trivia',
          score: finalScore,
          totalQuestions: questions.length,
          percentage: Math.round((finalScore / questions.length) * 100),
          timestamp: new Date().toISOString()
        };
        const gameHistory = JSON.parse(localStorage.getItem('game_history') || '[]');
        gameHistory.push(gameData);
        localStorage.setItem('game_history', JSON.stringify(gameHistory));
      } catch (error) {
        console.log('Game history save failed');
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You're a wellness expert! 🌟";
    if (percentage >= 60) return "Great job! You know a lot about wellness! 😊";
    if (percentage >= 40) return "Good effort! Keep learning about wellness! 👍";
    return "Keep exploring wellness - every step counts! 💪";
  };

  const getEncouragement = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      return [
        "Fantastic! You're building great wellness knowledge! 🎉",
        "Excellent! You're on the right track! ⭐",
        "Perfect! Your wellness wisdom is growing! 🌱",
        "Amazing! You really know your stuff! 💫"
      ][Math.floor(Math.random() * 4)];
    } else {
      return [
        "Not quite, but that's okay! Learning is a journey! 🌈",
        "Close! Every question helps you learn something new! 🌟",
        "That's alright! Now you know something valuable! ✨",
        "Good try! This knowledge will help you grow! 🌸"
      ][Math.floor(Math.random() * 4)];
    }
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link to="/games">
              <Button variant="outline" className="border-emerald-200 hover:bg-emerald-500 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Games
              </Button>
            </Link>
            <div />
          </div>

          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-2xl">
            Quiz Complete! 🎉
          </h1>
          
          <Card className="max-w-2xl mx-auto border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-emerald-700 flex items-center justify-center gap-3 mb-4">
                <Star className="h-8 w-8 text-emerald-500 animate-pulse" />
                Your Results
                <Star className="h-8 w-8 text-emerald-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-10">
              <div className="space-y-4">
                <div className="text-7xl font-black text-emerald-600 mb-4 drop-shadow-lg">
                  {score}/{questions.length}
                </div>
                <div className="text-2xl font-bold text-teal-600 mb-6">
                  {Math.round((score / questions.length) * 100)}% Correct
                </div>
                <p className="text-xl text-emerald-800 font-semibold bg-emerald-100/80 p-6 rounded-2xl shadow-lg">
                  {getScoreMessage()}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  onClick={resetGame}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-400/50 text-white font-bold px-12 py-6 text-lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Play Again
                </Button>
                <Link to="/games">
                  <Button variant="outline" className="border-emerald-200 hover:bg-emerald-500 hover:text-white px-12 py-6 text-lg shadow-lg">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Games
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4 space-y-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/games">
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-500 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-lg">
            Positivity Trivia 💝
          </h1>
          <Button onClick={resetGame} variant="outline" className="border-emerald-200 hover:bg-emerald-100">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>

        {/* Progress */}
        <Card className="border-emerald-200/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold text-emerald-800">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-4 py-2 shadow-md">
                {questions[currentQuestion].category}
              </Badge>
            </div>
            <div className="w-full bg-emerald-100/50 rounded-2xl h-3 shadow-inner overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-2xl shadow-lg transition-all duration-700 ease-out"
                style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-4 text-sm font-medium text-emerald-700">
              <span>Score: {score}/{questions.length}</span>
              <span>{Math.round(((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100)}% Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="border-emerald-200/50 shadow-2xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-emerald-800 text-center leading-tight">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-8">
            {/* Answer Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`
                    group p-6 text-left rounded-2xl border-3 font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden
                    ${selectedAnswer === index 
                      ? showResult 
                        ? index === questions[currentQuestion].correct
                          ? 'border-emerald-500 bg-emerald-100/80 text-emerald-800 shadow-emerald-300 ring-4 ring-emerald-200/50'
                          : 'border-red-400 bg-red-50/80 text-red-800 shadow-red-200 ring-4 ring-red-200/50'
                        : 'border-emerald-400 bg-emerald-500/20 text-emerald-800 shadow-emerald-200 ring-2 ring-emerald-200/30'
                      : showResult && index === questions[currentQuestion].correct
                        ? 'border-emerald-500 bg-emerald-100/80 text-emerald-800 shadow-emerald-300 ring-4 ring-emerald-200/50'
                        : 'border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:border-emerald-400 hover:bg-emerald-100/70 shadow-lg'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-lg">{option}</span>
                    {showResult && (
                      <div className="flex items-center gap-2">
                        {index === questions[currentQuestion].correct ? (
                          <CheckCircle className="h-6 w-6 text-emerald-600 animate-bounce" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="h-6 w-6 text-red-600 animate-shake" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                </button>
              ))}
            </div>
<div className='pt-4'>
            {/* Result Feedback */}
            {showResult && (
              <Card className={`
                border-4 shadow-2xl backdrop-blur-sm transition-all duration-500
                ${selectedAnswer === questions[currentQuestion].correct 
                  ? 'border-emerald-300 bg-emerald-50/80 shadow-emerald-300' 
                  : 'border-teal-300 bg-teal-50/80 shadow-teal-300'
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    {selectedAnswer === questions[currentQuestion].correct ? (
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border-4 border-emerald-400/50 p-2">
                        <CheckCircle className="h-8 w-8 text-emerald-600 animate-bounce" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center border-4 border-teal-400/50 p-2">
                        <span className="text-2xl animate-pulse">💡</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-xl text-emerald-800 mb-4 leading-relaxed">
                        {getEncouragement()}
                      </p>
                      <p className="text-emerald-700 leading-relaxed bg-gradient-to-r from-emerald-100/80 to-teal-100/80 p-4 rounded-xl shadow-inner">
                        {questions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
</div>
            {/* Action Buttons */}
            <div className="flex justify-center pt-8">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-400/50 text-white font-bold px-16 py-8 text-xl rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-xl hover:shadow-teal-400/50 text-white font-bold px-16 py-8 text-xl rounded-2xl transition-all duration-300"
                >
                  {currentQuestion === questions.length - 1 ? '🎉 See Results' : '➡️ Next Question'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
<div className='pt-4'>
        {/* Tips */}
        <Card className="border-emerald-200/30 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 shadow-xl backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-black text-2xl text-emerald-800 mb-6 flex items-center gap-3">
              💡 Wellness Learning Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-emerald-100/60 rounded-2xl border-l-4 border-emerald-500 hover:bg-emerald-100/80 transition-all shadow-lg hover:shadow-emerald-300">
                <span className="text-2xl mb-3 block">⏰</span>
                <p className="font-semibold text-emerald-800 mb-2">No Time Pressure</p>
                <p className="text-emerald-700 text-sm">Take your time to think through each question</p>
              </div>
              <div className="p-6 bg-teal-100/60 rounded-2xl border-l-4 border-teal-500 hover:bg-teal-100/80 transition-all shadow-lg hover:shadow-teal-300">
                <span className="text-2xl mb-3 block">📚</span>
                <p className="font-semibold text-teal-800 mb-2">Every Question Teaches</p>
                <p className="text-teal-700 text-sm">Right or wrong, you're building wellness knowledge</p>
              </div>
              <div className="p-6 bg-cyan-100/60 rounded-2xl border-l-4 border-cyan-500 hover:bg-cyan-100/80 transition-all shadow-lg hover:shadow-cyan-300">
                <span className="text-2xl mb-3 block">✨</span>
                <p className="font-semibold text-cyan-800 mb-2">Read Explanations</p>
                <p className="text-cyan-700 text-sm">Each explanation grows your positivity knowledge</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      </div>
    );
  };

export default PositivityTrivia;
