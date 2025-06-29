import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, RotateCcw, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Track } from '@/services/musicService';
import { toast } from "@/hooks/use-toast";
import { useMusicPlayerContext } from '@/contexts/MusicPlayerContext';

interface MusicPlayerProps {
  currentTrack?: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: MusicPlayerProps) => {
  const {
    volume,
    setVolume,
    currentTime,
    duration,
    handleSeek,
    skipForward,
    skipBackward
  } = useMusicPlayerContext();

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Default track for demo when no track is selected
  const displayTrack = currentTrack || {
    id: 'demo',
    title: 'Select a song to play',
    artist: 'No artist',
    album: 'No album',
    cover: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=150&h=150',
    audioUrl: '',
    duration: 0
  };

  // Volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // Get effective duration
  const effectiveDuration = duration > 0 ? duration : (currentTrack?.duration || 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-music-cardBg/95 backdrop-blur-lg border-t border-gray-800 px-3 sm:px-4 py-2 sm:py-3">
      <div className="flex flex-col h-full max-w-7xl mx-auto">
        {/* Mobile Layout (xs to sm screens) */}
        <div className="block md:hidden">
          {/* Track Info Row - Mobile */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center flex-1 min-w-0">
              <img 
                src={displayTrack.cover}
                alt={`${displayTrack.title} album art`}
                className="h-12 w-12 object-cover rounded-lg shadow-lg mr-3"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{displayTrack.title}</h4>
                <p className="text-xs text-gray-400 truncate">{displayTrack.artist}</p>
              </div>
            </div>
            
            {/* Play/Pause Button - Mobile */}
            <button 
              className={`bg-music-primary rounded-full p-3 text-black hover:bg-music-highlight transition-all active:scale-95 disabled:opacity-50 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
              onClick={onPlayPause}
              disabled={!currentTrack?.audioUrl}
            >
              {isPlaying ? 
                <Pause className="h-5 w-5" /> : 
                <Play className="h-5 w-5 ml-0.5" />
              }
            </button>
          </div>
          
          {/* Progress Bar Row - Mobile */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs w-10 text-right text-gray-400">{formatTime(currentTime)}</span>
            <div className="flex-1">
              <Slider 
                value={[currentTime]} 
                max={effectiveDuration}
                step={1}
                onValueChange={(values) => handleSeek(values[0])}
                className="cursor-pointer progress-slider"
                disabled={effectiveDuration === 0}
              />
            </div>
            <span className="text-xs w-10 text-gray-400">{formatTime(effectiveDuration)}</span>
          </div>
          
          {/* Controls Row - Mobile */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-6">
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-2"
                onClick={onPrevious}
                disabled={!onPrevious}
              >
                <SkipBack className="h-5 w-5" />
              </button>
              
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-2"
                onClick={skipBackward}
                disabled={!currentTrack?.audioUrl}
                title="Skip back 10 seconds"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-2"
                onClick={skipForward}
                disabled={!currentTrack?.audioUrl}
                title="Skip forward 10 seconds"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-2"
                onClick={onNext}
                disabled={!onNext}
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Volume Control - Mobile */}
            <div className="flex items-center space-x-2">
              <VolumeIcon className="h-5 w-5 text-gray-400" />
              <div className="w-20">
                <Slider 
                  value={[volume]} 
                  max={100}
                  step={1}
                  onValueChange={(values) => setVolume(values[0])}
                  className="cursor-pointer volume-slider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-row items-center h-full">
          {/* Track Info */}
          <div className="flex items-center w-1/4 min-w-[200px] max-w-[300px]">
            <img 
              src={displayTrack.cover}
              alt={`${displayTrack.title} album art`}
              className="h-10 w-10 lg:h-12 lg:w-12 object-cover rounded mr-3 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{displayTrack.title}</h4>
              <p className="text-xs text-gray-400 truncate">{displayTrack.artist}</p>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="flex flex-col flex-1 px-4 max-w-[800px] mx-auto">
            <div className="flex justify-center items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-1"
                onClick={onPrevious}
                disabled={!onPrevious}
              >
                <SkipBack className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
              
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-1"
                onClick={skipBackward}
                disabled={!currentTrack?.audioUrl}
                title="Skip back 10 seconds"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              
              <button 
                className={`bg-red-600 rounded-full p-2 text-white hover:scale-105 transition disabled:opacity-50 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                onClick={onPlayPause}
                disabled={!currentTrack?.audioUrl}
              >
                {isPlaying ? <Pause className="h-4 w-4 lg:h-5 lg:w-5" /> : <Play className="h-4 w-4 lg:h-5 lg:w-5" />}
              </button>
              
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-1"
                onClick={skipForward}
                disabled={!currentTrack?.audioUrl}
                title="Skip forward 10 seconds"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              
              <button 
                className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors p-1"
                onClick={onNext}
                disabled={!onNext}
              >
                <SkipForward className="h-4 w-4 lg:h-5 lg:w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <span className="w-10 text-right">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider 
                  value={[currentTime]} 
                  max={effectiveDuration}
                  step={1}
                  onValueChange={(values) => handleSeek(values[0])}
                  className="cursor-pointer progress-slider"
                  disabled={effectiveDuration === 0}
                />
              </div>
              <span className="w-10">{formatTime(effectiveDuration)}</span>
            </div>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center justify-end w-1/4 min-w-[120px] max-w-[200px] pl-4">
            <VolumeIcon className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 mr-2" />
            <div className="w-20 lg:w-24">
              <Slider 
                value={[volume]} 
                max={100}
                step={1}
                onValueChange={(values) => setVolume(values[0])}
                className="cursor-pointer volume-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
