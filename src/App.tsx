import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  UserCheck, 
  BarChart3, 
  Mail, 
  MessageSquare, 
  PenTool, 
  Blocks, 
  CreditCard, 
  Settings, 
  User,
  Sun,
  Moon,
  Bell,
  Search,
  Menu,
  ChevronLeft,
  LogOut,
  MonitorPlay,
  LayoutTemplate
} from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import CreateWebinar from './components/CreateWebinar';
import WebinarsList from './components/WebinarsList';
import Registrations from './components/Registrations';
import Attendees from './components/Attendees';
import EmailCampaigns from './components/EmailCampaigns';
import Chat from './components/Chat';
import Integrations from './components/Integrations';
import Analytics from './components/Analytics';
import EvergreenCampaigns from './components/EvergreenCampaigns';
import TeamManagement from './components/TeamManagement';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import WebinarRoom from './components/WebinarRoom';
import PlatformSettings from './components/PlatformSettings';
import MarketerRegistration from './components/MarketerRegistration';
import { Repeat } from 'lucide-react';
import { useFirestore } from './hooks/useFirestore';

export type ViewState = 'dashboard' | 'webinars' | 'create-webinar' | 'registrations' | 'attendees' | 'analytics' | 'email' | 'evergreen' | 'chat' | 'integrations' | 'team' | 'settings';

export default function App() {
  const [user, setUser] = useState<{ role: 'admin' | 'marketer'; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [publicView, setPublicView] = useState<'login' | 'register' | 'register-marketer' | 'webinar-room'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: notifications, updateDocument } = useFirestore<any>('notifications');
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        const role = (tokenResult.claims.admin ? 'admin' : 'marketer') as 'admin' | 'marketer';
        
        setUser({
          role,
          email: currentUser.email || '',
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      setCurrentView('dashboard');
    } else if (user?.role === 'marketer') {
      setCurrentView('dashboard');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center relative">
         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center animate-pulse">
           <Video className="w-4 h-4 text-white" />
         </div>
      </div>
    );
  }

  if (!user) {
    if (publicView === 'register') {
      return <RegistrationForm onComplete={() => setPublicView('webinar-room')} />;
    }
    if (publicView === 'register-marketer') {
      return <MarketerRegistration onComplete={() => setPublicView('login')} onLogin={() => setPublicView('login')} />;
    }
    if (publicView === 'webinar-room') {
      return <WebinarRoom onLeave={() => setPublicView('login')} />;
    }
    return (
      <div className="relative min-h-screen">
        <Login onLogin={setUser} onNavigateRegister={() => setPublicView('register-marketer')} />
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <button 
            onClick={() => setPublicView('register')}
            className="px-4 py-2 bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Registration Form</span>
          </button>
        </div>
      </div>
    );
  }

  let navItems = [];
  if (user.role === 'admin') {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'team', label: 'User Management', icon: User },
      { id: 'integrations', label: 'Platform & SMTP', icon: Blocks },
      { id: 'settings', label: 'Global Settings', icon: Settings },
    ];
  } else {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'webinars', label: 'Evergreen Webinars', icon: Video },
      { id: 'registrations', label: 'Registrations', icon: Users },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'email', label: 'Automations', icon: Mail },
      { id: 'chat', label: 'Live Chat Simulant', icon: MessageSquare },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      {(user.role === 'admin' || user.role === 'marketer') && (
        <motion.aside 
          initial={false}
          animate={{ width: sidebarOpen ? 260 : 72 }}
          className="relative z-20 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 hidden md:flex flex-col transition-all duration-300"
        >
          <div className="flex h-16 items-center px-4 border-b border-slate-200 dark:border-zinc-800/60 relative">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
              <Video className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && <span className="font-display font-semibold text-lg tracking-tight">SaleCrib</span>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 z-50 shadow-sm"
          >
            <ChevronLeft className={cn("w-3 h-3 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'webinars' && currentView === 'create-webinar');
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewState)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group overflow-hidden whitespace-nowrap",
                  isActive 
                    ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
                )}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-zinc-300")} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-zinc-800/60">
          <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{user.name.substring(0, 2).toUpperCase()}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent">
        
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center gap-4">
            {(user.role === 'admin' || user.role === 'marketer') && (
              <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="relative group hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 pl-9 pr-4 py-1.5 text-sm bg-slate-100/80 dark:bg-zinc-900/80 border border-transparent focus:border-indigo-500/30 rounded-lg focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-zinc-500 hover:bg-slate-200/50 dark:hover:bg-zinc-800/80"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded shadow-sm">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100' : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-zinc-950"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-zinc-100">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => {
                            notifications.filter((n: any) => !n.read).forEach(async (n: any) => {
                              try {
                                await updateDocument(n.id, { read: true });
                              } catch (e) {
                                console.error(e);
                              }
                            });
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="flex flex-col">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-4 border-b border-slate-100 dark:border-zinc-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors ${!notification.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <p className={`text-sm font-medium ${!notification.read ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-700 dark:text-zinc-300'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">
                                    {notification.message}
                                  </p>
                                  <p className="text-[10px] font-medium text-slate-400 mt-2">
                                    {notification.time || (notification.createdAt ? new Date(notification.createdAt.toMillis ? notification.createdAt.toMillis() : notification.createdAt).toLocaleString() : 'Just now')}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-slate-500">
                          <Bell className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-zinc-700" />
                          <p className="text-sm">You have no new notifications.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="w-px h-4 bg-slate-200 dark:bg-zinc-800 mx-1"></div>

            <button
               onClick={handleLogout}
               className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
               title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {user.role === 'marketer' && (
              <button 
                onClick={() => setCurrentView('create-webinar')}
                className="ml-1 hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors border border-transparent focus:ring-4 focus:ring-indigo-500/20"
              >
                <Video className="w-4 h-4" />
                <span>New Auto-Webinar</span>
              </button>
            )}
          </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-auto relative custom-scrollbar bg-slate-50 dark:bg-zinc-950/50">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                {user.role === 'admin' ? (
                  <AdminDashboard onNavigate={setCurrentView} />
                ) : (
                  <Dashboard onNavigate={setCurrentView} />
                )}
              </motion.div>
            )}
            
            {currentView === 'webinars' && (
              <motion.div 
                key="webinars"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <WebinarsList onNavigate={setCurrentView} />
              </motion.div>
            )}

            {currentView === 'create-webinar' && (
               <motion.div 
                 key="create-webinar"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="h-full flex flex-col"
               >
                 <CreateWebinar onCancel={() => setCurrentView('webinars')} />
               </motion.div>
            )}

            {currentView === 'registrations' && (
              <motion.div 
                key="registrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Registrations />
              </motion.div>
            )}

            {currentView === 'attendees' && (
              <motion.div 
                key="attendees"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Attendees />
              </motion.div>
            )}
            
            {currentView === 'email' && (
               <motion.div 
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <EmailCampaigns />
              </motion.div>
            )}

            {currentView === 'evergreen' && (
               <motion.div 
                key="evergreen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <EvergreenCampaigns />
              </motion.div>
            )}

            {currentView === 'chat' && (
               <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Chat />
              </motion.div>
            )}
            
            {currentView === 'integrations' && (
               <motion.div 
                key="integrations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Integrations />
              </motion.div>
            )}

            {currentView === 'analytics' && (
               <motion.div 
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <Analytics />
              </motion.div>
            )}

            {currentView === 'team' && (
               <motion.div 
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <TeamManagement />
              </motion.div>
            )}

            {currentView === 'settings' && (
               <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full"
              >
                <PlatformSettings />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
