import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MoodOption {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { emoji: '😊', label: 'Happy', value: 'happy', color: 'emerald-500' },
  { emoji: '😌', label: 'Calm', value: 'calm', color: 'emerald-500' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: 'emerald-500' },
  { emoji: '🤯', label: 'Anxious', value: 'anxious', color: 'emerald-500' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: 'emerald-500' },
  { emoji: '😴', label: 'Tired', value: 'tired', color: 'emerald-500' },
];

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onMoodSelect, selectedMood }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          How are you feeling right now?
        </h2>
        <p className="text-muted-foreground">
          Select your current mood to help us provide personalized support
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {moodOptions.map((mood) => (
          <Card
            key={mood.value}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 ${
              selectedMood === mood.value 
                ? `bg-gradient-to-br from-${mood.color} to-${mood.color}/100 text-white shadow-2xl shadow-${mood.color}/30 border-${mood.color}/30 scale-105 ring-4 ring-${mood.color}/30`
                : 'hover:bg-gray-50 border-gray-200'
            }`}
            onClick={() => onMoodSelect(mood.value)}
          >
            <CardContent className="p-6 text-center">
              <div className={`text-4xl mb-3 transition-all ${selectedMood === mood.value ? 'scale-110 drop-shadow-lg' : ''}`}>
                {mood.emoji}
              </div>
              <div className={`text-sm font-bold transition-all ${
                selectedMood === mood.value 
                  ? `drop-shadow-lg text-white`
                  : 'text-foreground'
              }`}>
                {mood.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
