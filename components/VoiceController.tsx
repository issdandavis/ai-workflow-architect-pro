
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Command } from 'lucide-react';

const VoiceController: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const navigate = useNavigate();

  const processCommand = useCallback((transcript: string) => {
    const cmd = transcript.toLowerCase();
    setLastCommand(cmd);

    if (cmd.includes('dashboard')) navigate('/dashboard');
    else if (cmd.includes('workflow')) navigate('/workflow');
    else if (cmd.includes('analytics')) navigate('/analytics');
    else if (cmd.includes('settings')) navigate('/settings');
    else if (cmd.includes('agent')) navigate('/agent-dev');
    
    // Auto-stop after some time to simulate a command session
    setTimeout(() => setLastCommand(''), 3000);
  }, [navigate]);

  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        processCommand(transcript);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    }

    if (isListening && recognition) {
      recognition.start();
    } else if (recognition) {
      recognition.stop();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening, processCommand]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {lastCommand && (
        <div className="bg-slate-900 border border-indigo-500/50 px-4 py-2 rounded-lg shadow-2xl animate-bounce pointer-events-auto">
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Command Detected</p>
          <p className="text-sm font-medium italic">"{lastCommand}"</p>
        </div>
      )}
      
      <button 
        onClick={() => setIsListening(!isListening)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 pointer-events-auto group ${
          isListening 
            ? 'bg-red-600 animate-pulse scale-110' 
            : 'bg-indigo-600 hover:bg-indigo-500 scale-100'
        }`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {isListening ? 'Stop Listening' : 'Voice Command (Say "Go to Workflow")'}
        </div>
      </button>
    </div>
  );
};

export default VoiceController;
