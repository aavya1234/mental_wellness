import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExercisePlayerProps {
  title: string;
  instructions: string[];
  duration: number; // seconds
  onClose: () => void;
}

const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  title,
  instructions,
  duration,
  onClose
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="list-disc pl-5 space-y-2 text-sm">
          {instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>

        <p className="text-center text-lg font-semibold">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </p>

        <div className="flex gap-2">
          <Button onClick={() => setIsRunning(true)} disabled={isRunning}>
            Start
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExercisePlayer;
