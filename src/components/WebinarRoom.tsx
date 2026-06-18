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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{id: any, user: string, text: string, isSystem: boolean, time: string}[]>([
    { id: 1, user: 'System', text: 'Welcome to the room!', isSystem: true, time: 'System' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [videoTime, setVideoTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(1); // avoid /0
  const [attendeeCount, setAttendeeCount] = useState(0);
  
  // Scripted Chat Processing
  const parsedChatScript = React.useMemo(() => {
    if (!webinar?.chatConfig?.messages) return [];
    
    // Parse to seconds and add jitter
    const namePoolStr = webinar?.namePool || FIRST_NAMES.join(',');
    const names = namePoolStr.split(',').map((n: string) => n.trim()).filter(Boolean);
    
    return webinar.chatConfig.messages.map((m: any, i: number) => {
      let msgSec = 0;
      if (m.time) {
        const parts = m.time.split(':');
        if (parts.length === 2) {
          msgSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        } else {
          msgSec = parseInt(m.time) || 0;
        }
      }
      // Add jitter (-2 to +5 seconds)
      const jitter = Math.random() * 7 - 2;
      const triggerTime = Math.max(0, msgSec + jitter);
      
      return {
        ...m,
        triggerTime,
        displayed: false,
        user: webinar.chatConfig.dynamicNames 
          ? names[Math.floor(Math.random() * names.length)]
          : "Attendee"
      };
    }).sort((a: any, b: any) => a.triggerTime - b.triggerTime);
  }, [webinar]);

  // Keep track of which scripted messages we've shown
  const [scriptedMsgIndex, setScriptedMsgIndex] = useState(0);

  // Rejoin/Refresh Time Calculation
  useEffect(() => {
    if (!slug) return;
    const entryKey = `azoma_entry_${slug}`;
    const now = Date.now();
    let entryTimeStr = localStorage.getItem(entryKey);
    let entryTime: number;

    if (!entryTimeStr) {
      entryTime = now;
      localStorage.setItem(entryKey, now.toString());
    } else {
      entryTime = parseInt(entryTimeStr, 10);
      if (isNaN(entryTime)) {
        entryTime = now;
        localStorage.setItem(entryKey, now.toString());
      }
    }

    const startSeconds = Math.max(0, Math.floor((now - entryTime) / 1000));
    
    if (videoRef.current) {
      // Seek video to computed start time
      // The browser might block autoplay, so we handle it below
      videoRef.current.currentTime = startSeconds;
      setVideoTime(startSeconds);
    }
  }, [slug, webinar?.isJitMode]); // We check isJitMode but logic holds: entry offsets zero

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setVideoTime(videoRef.current.currentTime);
      setVideoDuration(videoRef.current.duration || 1);
    }
  };

  useEffect(() => {
    // Process scripted chats against videoTime
    const newMsgs = [];
    let newIndex = scriptedMsgIndex;
    
    while (newIndex < parsedChatScript.length && parsedChatScript[newIndex].triggerTime <= videoTime) {
      const msg = parsedChatScript[newIndex];
      newMsgs.push({
        id: `script_${newIndex}_${msg.id}`,
        user: msg.user,
        text: msg.text,
        isSystem: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // simulated local time
      });
      newIndex++;
    }
    
    if (newMsgs.length > 0) {
      setMessages(prev => [...prev, ...newMsgs]);
      setScriptedMsgIndex(newIndex);
    }
  }, [videoTime, parsedChatScript, scriptedMsgIndex]);

  useEffect(() => {
    // Generate realistic attendee count curve
    const peak = webinar?.peakAttendees || 150;
    const progress = videoTime / videoDuration;
    
    // Smooth bell curve-ish approach
    // peak at 60% of video
    // base amount is 10% of peak, grows up to peak, tapers to 70% of peak
    let expectedCount = 0;
    if (progress < 0.1) {
      expectedCount = peak * 0.2 + (progress / 0.1) * (peak * 0.4);
    } else if (progress < 0.6) {
      expectedCount = peak * 0.6 + ((progress - 0.1) / 0.5) * (peak * 0.4);
    } else if (progress < 0.9) {
      expectedCount = peak - ((progress - 0.6) / 0.3) * (peak * 0.3);
    } else {
      expectedCount = peak * 0.7 - ((progress - 0.9) / 0.1) * (peak * 0.2);
    }
    
    // Add small jitter
    const jitter = Math.floor(Math.random() * 5) - 2; 
    setAttendeeCount(Math.max(1, Math.floor(expectedCount + jitter)));
  }, [videoTime, videoDuration, webinar]);

  const activeOffer = React.useMemo(() => {
    if (!webinar?.offersConfig?.enabled || !webinar?.offersConfig?.offers) return null;
    
    // Finds the offer that matches the current elapsed time
    const timeToSeconds = (timeStr: string) => {
      if (!timeStr) return 0;
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      }
      return parseInt(timeStr) || 0; // fallback to raw seconds if invalid format
    };

    return webinar.offersConfig.offers.find((offer: any) => {
      const startSec = timeToSeconds(offer.popUpTime);
      return videoTime >= startSec && videoTime < (startSec + (parseInt(offer.durationSeconds) || 60));
    });
  }, [webinar, videoTime]);

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
           <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-300">{attendeeCount.toLocaleString()}</span>
           </div>
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
        <div className="flex-1 relative flex flex-col bg-black group">
          <div className="flex-1 relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                src={webinar?.videoLink || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                autoPlay={isPlaying}
                playsInline
                className={cn("w-full h-full object-cover transition-opacity duration-500", isPlaying ? "opacity-100" : "opacity-40")}
                style={{ pointerEvents: 'none' }} // block scrub
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Fake Buffering Shimmer */}
              {isPlaying && Math.random() > 0.995 && (
                <div className="absolute inset-0 bg-white/5 animate-pulse z-10 pointer-events-none"></div>
              )}
              
              {/* Force Play Overlay if browser blocks autoplay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                  <button 
                    onClick={() => {
                        setIsPlaying(true);
                        videoRef.current?.play();
                    }}
                    className="w-20 h-20 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 pointer-events-auto"
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
                onClick={() => {
                   if (isPlaying) videoRef.current?.pause();
                   else videoRef.current?.play();
                   setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
              </button>
              <div className="text-xs font-mono text-slate-500">
                {isPlaying ? `LIVE (${Math.floor(videoTime / 60).toString().padStart(2, '0')}:${Math.floor(videoTime % 60).toString().padStart(2, '0')})` : "00:00"}
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

          {/* Active Offer Banner */}
          {activeOffer && (
            <div className="bg-indigo-600/10 border-b border-indigo-500/20 p-4 shrink-0 animate-in slide-in-from-top-2">
              <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-3 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <h4 className="font-bold text-sm text-white mb-1 mt-1">{activeOffer.title}</h4>
                <a 
                  href={activeOffer.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg mt-2 transition-colors block ${activeOffer.animation === 'pulse' ? 'animate-pulse' : activeOffer.animation === 'bounce' ? 'animate-bounce' : ''}`}
                >
                  {activeOffer.buttonText || 'Claim Offer'}
                </a>
              </div>
            </div>
          )}

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
