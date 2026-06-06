import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { wellnessApi, MoodEntry } from '@/services/wellnessApi';
import { useToast } from '@/hooks/use-toast';
import { TrendingUp, Calendar, Heart, Plus } from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodTracker = () => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const emotions = [
    { name: 'happy', emoji: '😊', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'excited', emoji: '🤩', color: 'bg-orange-100 text-orange-700' },
    { name: 'calm', emoji: '😌', color: 'bg-teal-100 text-teal-700' },
    { name: 'peaceful', emoji: '☮️', color: 'bg-emerald-100 text-emerald-700' },
    { name: 'energetic', emoji: '⚡', color: 'bg-cyan-100 text-cyan-700' },
    { name: 'anxious', emoji: '😰', color: 'bg-orange-100 text-orange-700' },
    { name: 'sad', emoji: '😢', color: 'bg-blue-100 text-blue-700' },
    { name: 'stressed', emoji: '😤', color: 'bg-red-100 text-red-700' },
  ];

  const moodLevels = [
    { value: 1, label: 'Very Low', color: 'bg-gradient-to-r from-red-500 to-red-600' },
    { value: 2, label: 'Low', color: 'bg-gradient-to-r from-red-400 to-red-500' },
    { value: 3, label: 'Poor', color: 'bg-gradient-to-r from-orange-400 to-orange-500' },
    { value: 4, label: 'Below Average', color: 'bg-gradient-to-r from-orange-300 to-orange-400' },
    { value: 5, label: 'Neutral', color: 'bg-gradient-to-r from-yellow-400 to-yellow-500' },
    { value: 6, label: 'Above Average', color: 'bg-gradient-to-r from-emerald-300 to-emerald-400' },
    { value: 7, label: 'Good', color: 'bg-gradient-to-r from-emerald-400 to-emerald-500' },
    { value: 8, label: 'Very Good', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
    { value: 9, label: 'Excellent', color: 'bg-gradient-to-r from-teal-500 to-cyan-500' },
    { value: 10, label: 'Amazing', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  ];

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const loadMoodHistory = async () => {
    try {
      const history = await wellnessApi.getMoodHistory(30);
      setMoodHistory(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load mood history",
        variant: "destructive"
      });
    }
  };

  const handleSubmitMood = async () => {
    if (!selectedEmotion) {
      toast({
        title: "Please select an emotion",
        description: "Choose how you're feeling today",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await wellnessApi.logMood({
        mood: selectedMood,
        emotion: selectedEmotion,
        note: note.trim() || undefined
      });

      toast({
        title: "Mood logged successfully!",
        description: "Thank you for sharing how you're feeling",
      });

      setSelectedMood(5);
      setSelectedEmotion('');
      setNote('');
      loadMoodHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: moodHistory.slice(-14).map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Mood Level',
        data: moodHistory.slice(-14).map(entry => entry.mood),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your Mood Trend (Last 14 Days)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const emotionCounts = emotions.map(emotion => ({
    emotion: emotion.name,
    count: moodHistory.filter(entry => entry.emotion === emotion.name).length,
    emoji: emotion.emoji
  })).filter(item => item.count > 0);

  const emotionChartData = {
    labels: emotionCounts.map(item => `${item.emoji} ${item.emotion}`),
    datasets: [
      {
        label: 'Frequency',
        data: emotionCounts.map(item => item.count),
        backgroundColor: [
          '#10B981',
          '#14B8A6',
          '#0EA5E9',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ].map(color => color + '80'),
        borderColor: [
          '#10B981',
          '#14B8A6',
          '#0EA5E9',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 bg-gradient-to-r from-emerald-600 via-teal-300 to-cyan-100 backdrop-blur-sm bg-white/60 rounded-3xl p-3 shadow-xl border border-emerald-200/50">
          <h1 className="text-4xl font-black  bg-clip-text  drop-shadow-2xl">
            Mood Tracker 
          </h1>
          <p className="text-xl text-emerald-800 font-light max-w-xl mx-auto leading-relaxed">
            Monitor your emotional wellness journey and discover patterns
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Mood Logging Form */}
          <Card className="xl:col-span-1 backdrop-blur-xl bg-white/70 shadow-2xl border-emerald-200/50 hover:shadow-emerald-300/30 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                <Plus className="h-7 w-7" />
                Log Today's Mood
              </CardTitle>
              <CardDescription className="text-emerald-600 font-medium">Record how you're feeling right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Level Selector */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-emerald-800">Mood Level (1-10)</Label>
                <div className="grid grid-cols-5 gap-3">
                  {moodLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setSelectedMood(level.value)}
                      className={`
                        w-full h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:-translate-y-1
                        ${level.color} ${selectedMood === level.value ? 'ring-4 ring-emerald-400/50 shadow-2xl shadow-emerald-300/50 scale-105' : ''}
                      `}
                    >
                      {level.value}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-emerald-700 font-medium text-center bg-emerald-50 p-3 rounded-xl">
                  {moodLevels.find(l => l.value === selectedMood)?.label}
                </p>
              </div>

              {/* Emotion Selector */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-emerald-800">Current Emotion</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.name}
                      onClick={() => setSelectedEmotion(emotion.name)}
                      className={`
                        p-4 rounded-2xl border-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 hover:-translate-y-1
                        ${selectedEmotion === emotion.name 
                          ? `border-emerald-800 bg-gradient-to-br from-emerald-500/10 shadow-emerald-300/30 ring-4 ring-emerald-400/30` 
                          : `${emotion.color} border-emerald-200/50 hover:border-emerald-700`
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">{emotion.emoji}</div>
                        <div className={`text-sm capitalize ${selectedEmotion === emotion.name ? 'text-emerald-800' : 'text-gray-700'}`}>
                          {emotion.name}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-emerald-800">Share your emotions..</Label>
                <Textarea
                  placeholder="What's happening today? Any specific thoughts or events?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] resize-none border-2 border-emerald-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 shadow-lg hover:shadow-emerald-200/50 transition-all p-5 rounded-2xl text-lg"
                />
              </div>

              <Button
                onClick={handleSubmitMood}
                disabled={loading || !selectedEmotion}
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 rounded-2xl"
              >
                {loading ? 'Logging...' : 'Log Mood '}
                <Heart className="h-5 w-5 ml-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Charts & Stats */}
          <div className="xl:col-span-2 space-y-8">
            {/* Mood Trend Chart */}
            <Card className="backdrop-blur-xl bg-white/70 shadow-2xl border-emerald-200/50 hover:shadow-emerald-300/30 transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  <TrendingUp className="h-7 w-7" />
                  Mood Trend
                </CardTitle>
                <CardDescription className="text-teal-600 font-medium">Your mood levels over the past 14 days</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {moodHistory.length > 0 ? (
                  <Line data={chartData} options={chartOptions} />
                ) : (
                  <div className="text-center py-16 text-emerald-500/60">
                    <Calendar className="h-20 w-20 mx-auto mb-6 opacity-50" />
                    <p className="text-2xl font-semibold">No mood data yet</p>
                    <p className="text-lg mt-2">Start logging to see your trends!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Emotion Frequency & Recent Entries */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Emotion Frequency Chart */}
              {emotionCounts.length > 0 && (
                <Card className="backdrop-blur-xl bg-white/70 shadow-2xl border-cyan-200/50 hover:shadow-cyan-300/30 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      <Heart className="h-7 w-7" />
                      Emotion Patterns
                    </CardTitle>
                    <CardDescription className="text-cyan-600 font-medium">How often you experience different emotions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <Bar data={emotionChartData} options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: {
                          display: true,
                          text: 'Emotion Frequency',
                          font: { size: 18, weight: 'bold' as const },
                        },
                      },
                      scales: {
                        y: {
                          
                          beginAtZero: true,
                          max:10,
                          ticks: { stepSize: 1 },
                        },
                      },
                    }} />
                  </CardContent>
                </Card>
              )}

              {/* Recent Entries */}
              <Card className="backdrop-blur-xl bg-white/70 shadow-2xl border-emerald-200/50 hover:shadow-emerald-300/30 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    <Calendar className="h-7 w-7" />
                    Recent Entries
                  </CardTitle>
                  <CardDescription className="text-emerald-600 font-medium">Your latest mood logs</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {moodHistory.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {moodHistory.slice(-5).reverse().map((entry, index) => {
                        const emotion = emotions.find(e => e.name === entry.emotion);
                        return (
                          <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all shadow-sm border border-emerald-200/30">
                            <div className="flex items-center gap-4">
                              <div className="text-3xl">{emotion?.emoji || '😊'}</div>
                              <div>
                                <div className="font-bold text-lg capitalize text-emerald-800">{entry.emotion}</div>
                                <div className="text-sm text-emerald-600">{new Date(entry.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-4 py-2 text-lg">
                              {entry.mood}/10
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-emerald-500/60">
                      <p className="text-xl font-semibold">No entries yet</p>
                      <p className="text-lg mt-2">Start tracking your emotions!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
