import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square, X } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  moods: string[];
  category: string;
}

interface ExerciseDetail {
  title: string;
  duration: number;
  steps: string[];
}

const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: '4-7-8 breathing technique to calm your nervous system',
    duration: '5 minutes',
    moods: ['anxious', 'calm'],
    category: 'Breathing'
  },
  {
    id: '2',
    title: 'Gratitude Practice',
    description: "Write down 3 things you're grateful for today",
    duration: '10 minutes',
    moods: ['sad', 'happy'],
    category: 'Mindfulness'
  },
  {
    id: '3',
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and release muscle groups to reduce tension',
    duration: '15 minutes',
    moods: ['frustrated'],
    category: 'Relaxation'
  },
  {
    id: '4',
    title: 'Mindful Walking',
    description: 'Take a slow, mindful walk focusing on your senses',
    duration: '20 minutes',
    moods: ['tired', 'happy'],
    category: 'Movement'
  },
  {
    id: '5',
    title: 'Body Scan Meditation',
    description: 'Gentle meditation to connect with your body',
    duration: '12 minutes',
    moods: ['anxious', 'calm'],
    category: 'Meditation'
  },
  {
    id: '6',
    title: 'Loving Kindness Practice',
    description: 'Send positive thoughts to yourself and others',
    duration: '8 minutes',
    moods: ['sad', 'anxious'],
    category: 'Compassion'
  }
];

const exerciseDetails: Record<string, ExerciseDetail> = {
  'Deep Breathing': {
    title: 'Deep Breathing',
    duration: 300,
    steps: [
      'Sit comfortably and relax your shoulders.',
      'Inhale through your nose for 4 seconds.',
      'Hold for 7 seconds.',
      'Exhale slowly for 8 seconds.',
      'Repeat calmly.'
    ]
  },
  'Gratitude Practice': {
    title: 'Gratitude Practice',
    duration: 600,
    steps: [
      'Sit quietly.',
      'Think of 3 things you are grateful for.',
      'Reflect on why they matter.',
      'Feel appreciation.'
    ]
  },
  'Progressive Muscle Relaxation': {
    title: 'Progressive Muscle Relaxation',
    duration: 900,
    steps: [
      'Sit or lie comfortably.',
      'Tense muscles for 5 seconds.',
      'Release slowly.',
      'Move upward through the body.'
    ]
  },
  'Mindful Walking': {
    title: 'Mindful Walking',
    duration: 1200,
    steps: [
      'Walk slowly.',
      'Notice each step.',
      'Focus on breathing.',
      'Stay present.'
    ]
  },
  'Body Scan Meditation': {
    title: 'Body Scan Meditation',
    duration: 720,
    steps: [
      'Sit or lie down.',
      'Focus on toes.',
      'Move awareness upward.',
      'Observe sensations calmly.'
    ]
  },
  'Loving Kindness Practice': {
    title: 'Loving Kindness Practice',
    duration: 480,
    steps: [
      'Close your eyes.',
      'Repeat kind phrases.',
      'Extend wishes to others.',
      'Feel compassion.'
    ]
  }
};

interface WellnessExercisesProps {
  selectedMood?: string;
}

const WellnessExercises: React.FC<WellnessExercisesProps> = ({ selectedMood }) => {
  const [active, setActive] = useState<ExerciseDetail | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const filtered = selectedMood
    ? exercises.filter(e => e.moods.includes(selectedMood))
    : [];

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = (title: string) => {
    const data = exerciseDetails[title];
    setActive(data);
    setTimeLeft(data.duration);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setActive(null);
    setTimeLeft(0);
  };

  const progress =
    active ? ((active.duration - timeLeft) / active.duration) * 100 : 0;

  return (
    <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-emerald-200">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Recommended Exercises
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(ex => (
          <Card 
            key={ex.id} 
            className="group hover:shadow-emerald-300/50 hover:border-emerald-400 border-emerald-200 shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer"
            onClick={() => start(ex.title)}
          >
            <CardHeader>
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-2 group-hover:scale-105 transition-transform">
                {ex.category}
              </Badge>
              <CardTitle className="text-xl font-bold text-emerald-700 group-hover:text-emerald-800">
                {ex.title}
              </CardTitle>
              <CardDescription className="text-gray-600">{ex.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <Clock className="h-4 w-4" /> {ex.duration}
                </span>
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-emerald-300/50">
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ACTIVE EXERCISE PLAYER */}
      {active && (
  <Card className="max-w-md mx-auto py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-xl border-2 border-emerald-200/50">
    <CardHeader className="flex justify-between items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-t-xl -mx-4 -mt-4 mb-4">
      <CardTitle className="text-xl font-bold">{active.title}</CardTitle>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={stop}
        className="hover:bg-white/20 h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </CardHeader>

    <CardContent className="space-y-4 p-4">
      {/* Steps - Compact */}
      <div className="max-h-32 overflow-y-auto space-y-2">
        {active.steps.slice(0, 3).map((s, i) => (
          <div key={i} className="flex items-start gap-2 p-2 bg-white/40 rounded-lg text-xs">
            <div className="w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">{i+1}</div>
            <span className="text-emerald-800">{s}</span>
          </div>
        ))}
        {active.steps.length > 3 && (
          <div className="text-xs text-gray-500 text-center pt-1">+{active.steps.length - 3} more</div>
        )}
      </div>

      {/* Progress & Timer - Compact */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Progress</span>
          <span>{Math.floor(progress)}%</span>
        </div>
        <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full shadow-md"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-mono font-bold text-emerald-600">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Compact Controls */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <Button
          size="sm"
          className="h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold"
          onClick={() => setIsRunning(true)}
          disabled={isRunning}
        >
          <Play className="h-3 w-3 mr-1" />
          Start
        </Button>

        <Button
          size="sm"
          className="h-10 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-xs font-bold"
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          <Pause className="h-3 w-3 mr-1" />
          Pause
        </Button>

        <Button
          size="sm"
          className="h-10 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-xs font-bold"
          onClick={stop}
        >
          <Square className="h-3 w-3 mr-1" />
          Stop
        </Button>
      </div>
    </CardContent>
  </Card>
)}
</div>
  );
};

export default WellnessExercises;
