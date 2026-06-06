import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Heart, Wind, Brain, Palette } from 'lucide-react';

const Games = () => {
  const games = [
    {
      id: 'mindful-matching',
      title: 'Mindful Matching',
      description: 'A calming emoji matching game that improves focus and memory while promoting mindfulness.',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-500',
      benefits: ['Improves concentration', 'Reduces anxiety', 'Enhances memory'],
      path: '/games/mindful-matching'
    },
    {
      id: 'breathing-exercise',
      title: 'Breathing Exercise',
      description: 'Visual guided breathing exercises with customizable patterns to reduce stress and promote calm.',
      icon: <Wind className="h-6 w-6" />,
      color: 'from-teal-500 to-cyan-500',
      benefits: ['Reduces stress', 'Improves focus', 'Promotes relaxation'],
      path: '/games/breathing-exercise'
    },
    {
      id: 'positivity-trivia',
      title: 'Positivity Trivia',
      description: 'Uplifting multiple-choice questions about wellness, positivity, and mental health with encouraging feedback.',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-emerald-500 to-teal-500',
      benefits: ['Boosts mood', 'Builds knowledge', 'Increases positivity'],
      path: '/games/positivity-trivia'
    },
    {
      id: 'mood-color-picker',
      title: 'Mood Color Picker',
      description: 'Express your emotions through colors and create beautiful mood palettes while tracking your feelings.',
      icon: <Palette className="h-6 w-6" />,
      color: 'from-cyan-500 to-blue-500',
      benefits: ['Emotional expression', 'Self-awareness', 'Creative outlet'],
      path: '/games/mood-color-picker'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 bg-gradient-to-r from-emerald-600 via-teal-300 to-cyan-100 backdrop-blur-sm bg-white/60 rounded-2xl p-6 shadow-xl border border-emerald-200/50">
          <h1 className="text-4xl font-bold  drop-shadow-lg">
            Wellness Games 🎮
          </h1>
          <p className="text-base text-emerald-700 font-light max-w-2xl mx-auto leading-relaxed">
            Engage in mindful activities designed to reduce stress, improve focus, and promote emotional well-being
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card className="backdrop-blur-xl bg-white/70 shadow-xl border-emerald-200/50 hover:shadow-emerald-300/30 transition-all group h-24">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                4
              </div>
              <div className="text-sm font-semibold text-emerald-700">Mindfulness Games</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/70 shadow-xl border-teal-200/50 hover:shadow-teal-300/30 transition-all group h-24">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                ∞
              </div>
              <div className="text-sm font-semibold text-teal-700">Sessions Available</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-white/70 shadow-xl border-cyan-200/50 hover:shadow-cyan-300/30 transition-all group h-24">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="text-sm font-semibold text-cyan-700">Stress-Free Fun</div>
            </CardContent>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-xl hover:shadow-emerald-300/30 transition-all duration-300 border-emerald-200/50 backdrop-blur-xl bg-white/80 overflow-hidden hover:-translate-y-1"
            >
              <div className={`h-1.5 bg-gradient-to-r ${game.color} group-hover:h-2 transition-all duration-300`}></div>
              <CardHeader className="pb-4 p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${game.color} text-white shadow-lg group-hover:scale-105 transition-all duration-300`}>
                    {game.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">
                      {game.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4 pb-6">
                <p className="text-sm text-emerald-700 leading-relaxed font-medium">
                  {game.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2 ">
                  <h4 className="font-semibold text-sm text-emerald-800 flex items-center gap-1">
                    ✨ Benefits:
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {game.benefits.map((benefit, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-sm px-4 py-2 font-medium border border-emerald-200/50 shadow-md hover:shadow-emerald-200/50 transition-all group-hover:scale-105 rounded-lg"
                      >
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-3" />
                {/* Play Button */}
                <Link to={game.path}>
                  <Button 
                    className={`w-full h-10  text-base font-bold shadow-lg hover:shadow-emerald-400/50 bg-gradient-to-r ${game.color} hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 rounded-2xl`}
                  >
                    <Gamepad2 className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                    Start Playing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="backdrop-blur-xl bg-white/70 shadow-xl border-emerald-200/50 hover:shadow-emerald-300/30 transition-all">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              💡 Wellness Gaming Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Before Playing:
                </h4>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg border-l-2 border-emerald-400">
                    <span className="text-lg font-bold text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Find a quiet, comfortable space</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg border-l-2 border-emerald-400">
                    <span className="text-lg font-bold text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Take a few deep breaths</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg border-l-2 border-emerald-400">
                    <span className="text-lg font-bold text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Set an intention</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  During Play:
                </h4>
                <ul className="space-y-2 text-sm text-teal-700">
                  <li className="flex items-start gap-2 p-2 bg-teal-50/50 rounded-lg border-l-2 border-teal-400">
                    <span className="text-lg font-bold text-teal-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Focus on present moment</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-teal-50/50 rounded-lg border-l-2 border-teal-400">
                    <span className="text-lg font-bold text-teal-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Don't worry about scores</span>
                  </li>
                  <li className="flex items-start gap-2 p-2 bg-teal-50/50 rounded-lg border-l-2 border-teal-400">
                    <span className="text-lg font-bold text-teal-500 mt-0.5 flex-shrink-0">•</span>
                    <span>Notice how you feel</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Games;
