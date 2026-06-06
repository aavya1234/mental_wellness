import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Quote, Heart, Loader2, Lightbulb } from 'lucide-react';

import MoodSelector from '@/components/MoodSelector';
import WellnessExercises from '@/components/WellnessExercises';
import { wellnessApi, MoodContent } from '@/services/wellnessApi';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState('');
  const [moodLevel, setMoodLevel] = useState(5);
  const [moodContentData, setMoodContentData] = useState<MoodContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  const handleMoodSelect = async (mood: string, level?: number) => {
    setSelectedMood(mood);
    const lvl = level ?? moodLevel;
    setMoodLevel(lvl);
    setContentLoading(true);

    try {
      const content = await wellnessApi.getMoodContent(mood, lvl);
      setMoodContentData(content);
    } catch (err) {
      toast({
        title: 'Could not load AI content',
        description: 'Showing default content instead.',
        variant: 'destructive',
      });
      // Fallback static content
      setMoodContentData({
        affirmations: ['I am doing the best I can right now.'],
        quotes: ['Every day is a second chance.'],
        tip: 'Take three slow deep breaths — inhale for 4, hold for 4, exhale for 6.',
      });
    } finally {
      setContentLoading(false);
    }
  };

  // Pick one random affirmation and one random quote
  const affirmation = moodContentData?.affirmations?.[
    Math.floor(Math.random() * (moodContentData.affirmations.length))
  ] ?? null;
  const quote = moodContentData?.quotes?.[
    Math.floor(Math.random() * (moodContentData.quotes.length))
  ] ?? null;
  const tip = moodContentData?.tip ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 space-y-8 bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Welcome */}
      <div className="text-center bg-gradient-to-br from-emerald-500 to-emerald-200 space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-200">
        <h1 className="text-4xl font-bold font-teal-600">
          Welcome back, {user?.name}! ✨
        </h1>
        <p className="text-emerald-800 text-lg">How are you feeling today?</p>
      </div>

      {/* Mood Selector */}
      <MoodSelector selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />

      {/* AI Content Cards */}
      {contentLoading ? (
        <div className="flex items-center justify-center py-12 gap-3 text-emerald-600">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xl font-medium">Generating personalised content just for you…</span>
        </div>
      ) : moodContentData ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Affirmation */}
            <Card className="group hover:shadow-emerald-300/50 hover:border-emerald-400 border-emerald-200 shadow-lg hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  <Heart className="h-5 w-5 text-emerald-500" />
                  AI Affirmation
                </CardTitle>
                <CardDescription>Personalised for your mood by Gemini AI ✨</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-emerald-700 bg-emerald-50 p-4 rounded-xl leading-relaxed">
                  {affirmation}
                </p>
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="group hover:shadow-cyan-300/50 hover:border-cyan-400 border-cyan-200 shadow-lg hover:-translate-y-2 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  <Quote className="h-5 w-5 text-cyan-500" />
                  AI Quote
                </CardTitle>
                <CardDescription>Chosen based on your current emotion</CardDescription>
              </CardHeader>
              <CardContent>
                <blockquote className="italic border-l-4 border-cyan-400 pl-4 bg-cyan-50 p-4 rounded-xl text-cyan-800 leading-relaxed">
                  "{quote}"
                </blockquote>
              </CardContent>
            </Card>
          </div>

          {/* Wellness Tip */}
          <Card className="border-amber-200 shadow-lg hover:shadow-amber-300/40 hover:-translate-y-1 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Wellness Tip for Today
              </CardTitle>
              <CardDescription>A practical step to support your wellbeing right now</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 bg-amber-50 p-4 rounded-xl text-lg leading-relaxed">
                💡 {tip}
              </p>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Heart className="h-5 w-5" /> AI Affirmation
              </CardTitle>
              <CardDescription>A gentle reminder for you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 italic">Select a mood to receive an AI-generated affirmation</p>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-600">
                <Quote className="h-5 w-5" /> AI Quote
              </CardTitle>
              <CardDescription>Personalised based on your mood</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 italic">Select a mood to see an AI-generated quote</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Wellness Exercises */}
      <WellnessExercises selectedMood={selectedMood} />
    </div>
  );
};

export default Dashboard;
