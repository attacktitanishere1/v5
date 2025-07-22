import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface VoiceConfessionRecorderProps {
  onSubmit: (audioBlob: Blob, duration: number) => void;
  onCancel: () => void;
}

export default function VoiceConfessionRecorder({ onSubmit, onCancel }: VoiceConfessionRecorderProps) {
  const { userPreferences } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const MAX_DURATION = 90; // 1 minute 30 seconds

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return MAX_DURATION;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onSubmit(audioBlob, recordingTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-6 rounded-lg ${
      userPreferences.theme.isDark ? 'bg-gray-800' : 'bg-white'
    } transition-colors duration-200`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Record Voice Confession
      </h3>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        {/* Timer */}
        <div className={`text-2xl font-mono ${
          recordingTime >= MAX_DURATION ? 'text-red-500' : 
          userPreferences.theme.isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {formatTime(recordingTime)} / {formatTime(MAX_DURATION)}
        </div>

        {/* Recording Button */}
        {!audioBlob && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={recordingTime >= MAX_DURATION}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white disabled:bg-gray-400`}
          >
            {isRecording ? <Square size={32} /> : <Mic size={32} />}
          </button>
        )}

        {/* Playback Controls */}
        {audioBlob && (
          <div className="flex items-center space-x-4">
            <button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors duration-200"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <button
              onClick={deleteRecording}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-200"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}

        {/* Audio Element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}

        {/* Instructions */}
        <div className={`text-center text-sm ${
          userPreferences.theme.isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {!audioBlob && !isRecording && (
            <p>Tap the microphone to start recording your voice confession</p>
          )}
          {isRecording && (
            <p>Recording... Tap the square to stop</p>
          )}
          {audioBlob && (
            <p>Tap play to review your recording</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 w-full">
          <button
            onClick={onCancel}
            className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 ${
              userPreferences.theme.isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Cancel
          </button>
          
          {audioBlob && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Send size={16} />
              <span>Post Voice Confession</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning */}
      {recordingTime >= MAX_DURATION - 10 && recordingTime < MAX_DURATION && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-center">
          Recording will stop automatically in {MAX_DURATION - recordingTime} seconds
        </div>
      )}
    </div>
  );
}