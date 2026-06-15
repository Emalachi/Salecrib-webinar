import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, MessageSquare, Send, Users, Hand, Maximize, Settings, Pause } from 'lucide-react';
import { cn } from '../lib/utils';
import { useFirestore } from '../hooks/useFirestore';

const FIRST_NAMES = ['Alex', 'Sarah', 'Mike', 'Emily', 'Chris', 'Jessica', 'David', 'Ashley', 'James', 'Amanda'];
const LAST_INITIALS = ['A.', 'B.', 'C.', 'D.', 'S.', 'M.', 'T.', 'W.', 'L.', 'R.'];
const COMMENTS = [
  'Wow, this is exactly what I needed to hear.',
  'Can you clarify that last point?',
  'I have been struggling with this for months!',
  'Does this apply to B2B as well?',
  'Mind blown 🤯',
  'Taking so many notes right now.',
  'Will there be a replay?',
  'I am definitely going to implement this tomorrow.',
  'What tool are you using for that?',
  'This is the best training I have attended all year.',
  'Where can I find the link to the templates?',
  'Love the actionable advice.',
  'Is it possible to automate that part?',
  'Ha, I made that same mistake last week.',
  'So true!'
];

export default function WebinarRoom({ onLeave, slug }: { onLeave: () => void, slug?: string | null }) {
  const { data: webinars } = useFirestore<any>('webinars');
  const webinar = webinars?.find((w: any) => w.slug === slug) || null;
  const title = webinar?.title || '10x Your Marketing Strategy Using Automated Funnels';

  const [isPlaying, setIsPlaying] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: 'System', text: 'Welcome to the room!', isSystem: true, time: '10:00 AM' },
    { id: 2, user: 'Sarah J.', text: 'Excited for this!', isSystem: false, time: '10:01 AM' },
    { id: 3, user: 'Mike T.', text: 'Audio is coming through perfectly from my end.', isSystem: false, time: '10:02 AM' },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (Math.random() > 0.2) {
           const user = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)]}`;
           const text = COMMENTS[Math.floor(Math.random() * COMMENTS.length)];
           
           setMessages(prev => [...prev, {
             id: Date.now() + Math.random(),
             user,
             text,
             isSystem: false,
             time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
           }]);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      user: 'You',
      text: chatMessage,
      isSystem: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatMessage('');
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Top Bar */}
      <header className="h-14 flex items-center justify-between px-4 sm:px-6 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
            Simulated Live
          </div>
          <h1 className="text-sm font-medium text-slate-100 hidden sm:block">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={onLeave}
             className="text-sm text-slate-400 hover:text-white transition-colors"
           >
             Leave Room
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Player Area */}
        <div className="flex-1 relative flex flex-col bg-black">
          <div className="flex-1 relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Wistia iframe with controls disabled to simulate live event. */}
              {/* Replace 'f013dcbz0w' with actual dynamic video ID when backend is connected. */}
              <iframe
                src={`https://fast.wistia.net/embed/iframe/f013dcbz0w?autoPlay=${isPlaying ? 'true' : 'false'}&playbar=false&smallPlayButton=false&volumeControl=false&fullscreenButton=false&controlsVisibleOnLoad=false&playButton=false`}
                allow="autoplay; fullscreen"
                allowTransparency={true}
                frameBorder="0"
                scrolling="no"
                className={cn("w-full h-full transition-opacity duration-500", isPlaying ? "opacity-100" : "opacity-40")}
                style={{ pointerEvents: 'none' }}
              ></iframe>
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="w-20 h-20 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  >
                    <PlayCircle className="w-10 h-10" />
                  </button>
                </div>
              )}

              {/* Lower Third / Banner overlay */}
              {isPlaying && (
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-4 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
                    <img src="https://i.pravatar.cc/100?img=47" className="w-12 h-12 rounded-full border border-white/20" alt="Host" />
                    <div>
                      <div className="font-medium text-white">Alex Morgan</div>
                      <div className="text-xs text-indigo-300">Chief Marketing Officer</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </button>
              <div className="text-xs font-mono text-slate-500">
                {isPlaying ? "LIVE" : "00:00:00"}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm">
                <Hand className="w-4 h-4" />
                <span className="hidden sm:inline">Raise Hand</span>
              </button>
              <div className="w-px h-4 bg-slate-700 mx-2"></div>
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat / Tools Sidebar */}
        <div className="w-full lg:w-80 border-l border-slate-800 flex flex-col bg-slate-900/50 h-[400px] lg:h-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-1 shrink-0">
            <button className="flex-1 py-1.5 px-3 rounded-md bg-slate-800 text-indigo-400 text-sm font-medium flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button className="flex-1 py-1.5 px-3 rounded-md hover:bg-slate-800/50 text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Polls
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex flex-col text-sm", msg.isSystem ? "items-center" : "items-start")}>
                {msg.isSystem ? (
                  <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">{msg.text}</span>
                ) : (
                  <div className="max-w-[90%]">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={cn("font-medium", msg.user === 'You' ? "text-indigo-400" : "text-slate-300")}>{msg.user}</span>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                    <div className="text-slate-300 leading-relaxed bg-slate-800/30 border border-slate-700/50 p-2.5 rounded-lg rounded-tl-none">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Say something..." 
                className="w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 rounded-md transition-colors disabled:opacity-50"
                disabled={!chatMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
