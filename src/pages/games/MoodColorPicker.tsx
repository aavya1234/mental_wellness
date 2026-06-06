import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Palette, Save, RotateCcw, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ColorMood {
  color: string;
  emotion: string;
  intensity: number;
  note?: string;
  timestamp: Date;
}

interface ColorPalette {
  name: string;
  colors: string[];
  mood: string;
  timestamp: Date;
}

const MoodColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#6B73FF');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [currentPalette, setCurrentPalette] = useState<string[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);
  const [paletteName, setPaletteName] = useState('');

  const emotions = [
    'Happy', 'Excited', 'Calm', 'Peaceful', 'Energetic',
    'Anxious', 'Sad', 'Stressed', 'Grateful', 'Hopeful',
    'Inspired', 'Content', 'Frustrated', 'Relaxed', 'Motivated'
  ];

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#10AC84', '#EE5A24', '#0984E3', '#6C5CE7', '#FD79A8'
  ];

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    try {
      const saved = localStorage.getItem('mood_color_palettes');
      if (saved) {
        setSavedPalettes(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Failed to load palettes');
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const addColorToPalette = () => {
    if (currentPalette.length < 6 && !currentPalette.includes(selectedColor)) {
      setCurrentPalette([...currentPalette, selectedColor]);
    }
  };

  const removeColorFromPalette = (colorToRemove: string) => {
    setCurrentPalette(currentPalette.filter(color => color !== colorToRemove));
  };

  const saveMoodColor = () => {
    if (!selectedEmotion) return;

    const moodColor: ColorMood = {
      color: selectedColor,
      emotion: selectedEmotion,
      intensity,
      note: note || undefined,
      timestamp: new Date()
    };

    try {
      const moodHistory = JSON.parse(localStorage.getItem('color_mood_history') || '[]');
      moodHistory.push(moodColor);
      localStorage.setItem('color_mood_history', JSON.stringify(moodHistory));

      const gameData = {
        game: 'mood-color-picker',
        color: selectedColor,
        emotion: selectedEmotion,
        intensity,
        timestamp: new Date().toISOString()
      };
      const gameHistory = JSON.parse(localStorage.getItem('game_history') || '[]');
      gameHistory.push(gameData);
      localStorage.setItem('game_history', JSON.stringify(gameHistory));
    } catch (error) {
      console.log('Save failed');
    }

    setSelectedEmotion('');
    setNote('');
    setIntensity(5);
  };

  const savePalette = () => {
    if (currentPalette.length === 0 || !paletteName.trim()) return;

    const newPalette: ColorPalette = {
      name: paletteName.trim(),
      colors: [...currentPalette],
      mood: selectedEmotion || 'Mixed',
      timestamp: new Date()
    };

    const updatedPalettes = [...savedPalettes, newPalette];
    setSavedPalettes(updatedPalettes);
    
    try {
      localStorage.setItem('mood_color_palettes', JSON.stringify(updatedPalettes));
    } catch (error) {
      console.log('Palette save failed');
    }

    setPaletteName('');
    setCurrentPalette([]);
  };

  const clearPalette = () => {
    setCurrentPalette([]);
  };

  const getColorName = (hex: string) => {
    const colorNames: { [key: string]: string } = {
      '#FF6B6B': 'Coral Red',
      '#4ECDC4': 'Turquoise',
      '#45B7D1': 'Sky Blue',
      '#96CEB4': 'Mint Green',
      '#FECA57': 'Sunshine Yellow',
      '#FF9FF3': 'Pink Blossom',
      '#54A0FF': 'Ocean Blue',
      '#5F27CD': 'Royal Purple',
      '#00D2D3': 'Cyan',
      '#FF9F43': 'Orange Sunset'
    };
    return colorNames[hex] || 'Custom Color';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/games">
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-500 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Games
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Mood Color Picker 🎨
          </h1>
          <div className="w-32" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Color Selection */}
          <div className="xl:col-span-2 space-y-6">
            {/* Current Color Display */}
            <Card className="border-emerald-200/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Palette className="h-5 w-5" />
                  Current Color
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div 
                    className="w-32 h-32 rounded-2xl shadow-2xl border-4 border-white/50 transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-emerald-800 mb-2 block">
                          Color Picker
                        </label>
                        <Input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="w-20 h-12 p-1 border-emerald-200 shadow-md"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-600 font-medium">
                          {getColorName(selectedColor)}
                        </p>
                        <p className="text-lg font-bold text-emerald-800">
                          {selectedColor.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preset Colors */}
            <Card className="border-emerald-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-700">Preset Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {presetColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`
                        w-16 h-16 rounded-xl shadow-lg border-4 transition-all duration-300 hover:scale-110 hover:shadow-emerald-300
                        ${selectedColor === color ? 'border-emerald-500 scale-110 shadow-emerald-400 ring-4 ring-emerald-200/50' : 'border-white hover:border-emerald-300'}
                      `}
                      style={{ backgroundColor: color }}
                      title={getColorName(color)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mood Association */}
            <Card className="border-teal-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-teal-700">Your Mood</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-teal-800 mb-3 block">
                    Select Emotion
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {emotions.map((emotion) => (
                      <button
                        key={emotion}
                        onClick={() => setSelectedEmotion(emotion)}
                        className={`
                          px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 hover:scale-105 shadow-md
                          ${selectedEmotion === emotion
                            ? 'border-teal-500 bg-teal-500/20 text-teal-700 shadow-teal-300 ring-2 ring-teal-200/50'
                            : 'border-emerald-200 hover:border-teal-400 hover:shadow-teal-200 text-emerald-700 hover:bg-teal-50/50'
                          }
                        `}
                      >
                        {emotion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-teal-800 mb-3 block">
                    Intensity: {intensity}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-3 bg-emerald-100 rounded-xl appearance-none cursor-pointer shadow-inner"
                    style={{
                      background: `linear-gradient(to right, ${selectedColor}20 0%, ${selectedColor}40 ${intensity * 10}%, #e0f2fe ${intensity * 10}%, #e0f2fe 100%)`
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-teal-800 mb-2 block">
                    Notes (Optional)
                  </label>
                  <Textarea
                    placeholder="What thoughts or feelings does this color evoke?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border-emerald-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 resize-vertical min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={saveMoodColor}
                  disabled={!selectedEmotion}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl hover:shadow-emerald-400/50 text-white font-bold h-12"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Mood Color
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Color Palette Builder */}
          <div className="space-y-6">
            {/* Current Palette */}
            <Card className="border-cyan-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-cyan-700">Build Palette</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 min-h-[140px] p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl">
                  {currentPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => removeColorFromPalette(color)}
                      className="aspect-square rounded-xl shadow-lg border-3 border-white hover:border-red-400 transition-all duration-300 hover:scale-105 relative group"
                      style={{ backgroundColor: color }}
                      title={`Remove ${getColorName(color)}`}
                    >
                      <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    </button>
                  ))}
                  {Array.from({ length: 6 - currentPalette.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-center shadow-sm hover:border-teal-400 transition-all"
                    >
                      <span className="text-xs text-emerald-500 font-medium">+ Add</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={addColorToPalette}
                    disabled={currentPalette.length >= 6 || currentPalette.includes(selectedColor)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg"
                  >
                    Add Color
                  </Button>
                  <Button
                    onClick={clearPalette}
                    variant="outline"
                    size="sm"
                    className="border-emerald-200 hover:bg-emerald-50 shadow-md"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {currentPalette.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-emerald-200/50">
                    <Input
                      placeholder="Palette name..."
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                      className="border-emerald-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200/50 shadow-sm"
                    />
                    <Button
                      onClick={savePalette}
                      disabled={!paletteName.trim() || currentPalette.length === 0}
                      size="sm"
                      className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 shadow-xl"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save Palette
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Palettes */}
            <Card className="border-emerald-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-emerald-700">Saved Palettes</CardTitle>
              </CardHeader>
              <CardContent>
                {savedPalettes.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {savedPalettes.slice(-5).reverse().map((palette, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl shadow-md hover:shadow-emerald-300 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-sm text-emerald-800">
                            {palette.name}
                          </span>
                          <Badge className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs shadow-md">
                            {palette.mood}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mb-2">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded-xl border-2 border-white shadow-md hover:scale-110 transition-all"
                              style={{ backgroundColor: color }}
                              title={getColorName(color)}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-emerald-600">
                          {new Date(palette.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-emerald-500">
                    <Palette className="h-12 w-12 mx-auto mb-4 opacity-60" />
                    <p className="text-lg font-medium">No saved palettes yet</p>
                    <p className="text-sm mt-1">Create your first mood palette!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Color Psychology Info */}
        <Card className="border-emerald-200/30 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 shadow-xl">
          <CardContent className="p-8">
            <h3 className="font-black text-2xl text-emerald-800 mb-6 flex items-center gap-3 justify-center">
              🎨 Color Psychology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-emerald-100/70 rounded-2xl border-l-4 border-emerald-500 hover:bg-emerald-100/90 transition-all shadow-lg">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-800 text-lg mb-1">Blue = Calm</div>
                    <div className="text-emerald-700">Peace, trust, serenity</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-emerald-100/70 rounded-2xl border-l-4 border-emerald-500 hover:bg-emerald-100/90 transition-all shadow-lg">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-emerald-800 text-lg mb-1">Green = Balance</div>
                    <div className="text-emerald-700">Growth, harmony, renewal</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-teal-100/70 rounded-2xl border-l-4 border-teal-500 hover:bg-teal-100/90 transition-all shadow-lg">
                  <div className="w-3 h-3 bg-teal-500 rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-teal-800 text-lg mb-1">Yellow = Joy</div>
                    <div className="text-teal-700">Optimism, energy, happiness</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-teal-100/70 rounded-2xl border-l-4 border-teal-500 hover:bg-teal-100/90 transition-all shadow-lg">
                  <div className="w-3 h-3 bg-teal-500 rounded-full mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-teal-800 text-lg mb-1">Purple = Creativity</div>
                    <div className="text-teal-700">Imagination, spirituality</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    );
  };

export default MoodColorPicker;
