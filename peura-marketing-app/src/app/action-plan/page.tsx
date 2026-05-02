'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Zap, 
  ChevronRight, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Target, 
  ShieldAlert,
  ArrowRight,
  Plus
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { ACTION_PLAN_DATA, Week, Day, Task } from './tasks';

export default function ActionPlanPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeWeek, setActiveWeek] = useState(1);
  const [tasks, setTasks] = useState<Week[]>(ACTION_PLAN_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://peurabackend.onrender.com';

  // Persistence
  useEffect(() => {
    fetch(`${API_URL}/api/action-plan/demo-user`)
      .then(res => res.json())
      .then(data => {
        if (data && data.completedTaskIds) {
          const newTasks = [...ACTION_PLAN_DATA];
          // Restore completion state from task IDs
          newTasks.forEach(w => w.days.forEach(d => d.tasks.forEach(t => {
            t.completed = data.completedTaskIds.includes(t.id);
          })));
          setTasks(newTasks);
        }
      })
      .catch(e => console.error("Failed to load plan from backend:", e))
      .finally(() => {
        setHydrated(true);
        setLoading(false);
      });
  }, []);

  const saveToBackend = async (currentTasks: Week[]) => {
    const completedTaskIds: string[] = [];
    currentTasks.forEach(w => w.days.forEach(d => d.tasks.forEach(t => {
      if (t.completed) completedTaskIds.push(t.id);
    })));

    try {
      await fetch(`${API_URL}/api/action-plan/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user', completedTaskIds })
      });
    } catch (e) {
      console.error("Failed to save plan to backend:", e);
    }
  };

  const toggleTask = (weekIndex: number, dayIndex: number, taskIndex: number) => {
    const newTasks = [...tasks];
    newTasks[weekIndex].days[dayIndex].tasks[taskIndex].completed = !newTasks[weekIndex].days[dayIndex].tasks[taskIndex].completed;
    setTasks(newTasks);
    saveToBackend(newTasks);
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    tasks.forEach(w => w.days.forEach(d => d.tasks.forEach(t => {
      total++;
      if (t.completed) completed++;
    })));
    return Math.round((completed / total) * 100);
  };

  const calculateWeekProgress = (week: Week) => {
    let total = 0;
    let completed = 0;
    week.days.forEach(d => d.tasks.forEach(t => {
      total++;
      if (t.completed) completed++;
    }));
    return Math.round((completed / total) * 100);
  };

  const getLackingActions = () => {
    const criticalLacking: Task[] = [];
    tasks.forEach(w => w.days.forEach(d => d.tasks.forEach(t => {
      if (t.priority === 'Critical' && !t.completed) {
        criticalLacking.push(t);
      }
    })));
    return criticalLacking;
  };

  const handleSyncToCalendar = async () => {
    const contentTasks: Task[] = [];
    tasks.forEach(w => w.days.forEach(d => d.tasks.forEach(t => {
      const lower = t.title.toLowerCase();
      if (lower.includes('reel') || lower.includes('carousel') || lower.includes('post')) {
        contentTasks.push(t);
      }
    })));

    alert(`Syncing ${contentTasks.length} content tasks to your Smart Calendar...`);

    for (const task of contentTasks) {
      try {
        // Find which day/week this task belongs to to estimate a date
        let scheduledDate = new Date();
        tasks.forEach((w, wi) => w.days.forEach((d, di) => d.tasks.forEach(t => {
          if (t.id === task.id) {
            // Estimate date based on week/day (Day 1 = Today, etc.)
            scheduledDate.setDate(scheduledDate.getDate() + (wi * 7) + di);
          }
        })));

        const contentType = task.title.toLowerCase().includes('reel') ? 'Video' : 
                          task.title.toLowerCase().includes('carousel') ? 'Carousel' : 'Post';

        await fetch(`${API_URL}/api/idea/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.title,
            contentType,
            scheduledDate: scheduledDate.toISOString(),
            status: 'draft',
            script: { hook: task.description || task.title, storyline: 'Planned via 30-Day Launch Plan' }
          })
        });
      } catch (e) {
        console.error("Sync failed for task:", task.title, e);
      }
    }
    alert('Sync complete! Check your Smart Calendar.');
  };

  const currentProgress = calculateProgress();
  const lackingActions = getLackingActions();

  if (!hydrated) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 p-5 lg:p-10 overflow-y-auto mt-16 lg:mt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-accent/20">
                Launch Phase
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">30-Day Execution Plan</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight dark:text-white flex items-center gap-4">
              Peura Launch <span className="text-accent">Strategy</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Progress</span>
              <span className="text-2xl font-black text-slate-800 dark:text-white">{currentProgress}%</span>
            </div>
            <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out"
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
          </div>
        </header>

        {/* Gap Analysis / Lacking Actions Section */}
        {lackingActions.length > 0 && (
          <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-[32px] p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-rose-900 dark:text-rose-100">Critical Gaps Identified</h3>
                    <p className="text-sm text-rose-700 dark:text-rose-400 font-medium">These actions are lacking and will hinder your launch success.</p>
                  </div>
                </div>
                <div className="hidden md:block bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full">
                  {lackingActions.length} Lacking Actions
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lackingActions.slice(0, 6).map((task, idx) => (
                  <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-rose-200 dark:border-rose-900/20 p-4 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-all group">
                    <div className="mt-1">
                      <Zap size={18} className="text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-rose-600 transition-colors">{task.title}</p>
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{task.timeEstimate}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        // Find the task and toggle it
                        tasks.forEach((w, wi) => w.days.forEach((d, di) => d.tasks.forEach((t, ti) => {
                          if (t.id === task.id) toggleTask(wi, di, ti);
                        })));
                      }}
                      className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
          {/* Main Task Area */}
          <div className="space-y-8">
            {/* Week Selection Tabs */}
            <div className="flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
              {tasks.map((week) => (
                <button
                  key={week.week}
                  onClick={() => setActiveWeek(week.week)}
                  className={`flex-1 min-w-[120px] py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 ${activeWeek === week.week ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-accent'}`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${activeWeek === week.week ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>W{week.week}</span>
                  Week {week.week}
                  <span className={`text-[10px] font-black ${activeWeek === week.week ? 'opacity-60' : 'text-slate-300'}`}>{calculateWeekProgress(week)}%</span>
                </button>
              ))}
            </div>

            {/* Current Week Header */}
            <div className="relative overflow-hidden rounded-[32px] bg-slate-900 p-8 lg:p-10 text-white shadow-2xl">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <Target size={120} />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Week {activeWeek}: {tasks[activeWeek-1].title}</h2>
                <p className="text-slate-400 font-medium text-lg mb-6 max-w-xl">{tasks[activeWeek-1].focus}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                    <BarChart3 size={18} className="text-accent" />
                    <span className="text-sm font-bold tracking-wide">Focus: High Impact Growth</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/10 flex items-center gap-3">
                    <CalendarIcon size={18} className="text-accent" />
                    <span className="text-sm font-bold tracking-wide">7 Days Active Execution</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Tasks List */}
            <div className="space-y-10">
              {tasks[activeWeek-1].days.map((day, dayIdx) => (
                <div key={dayIdx} className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-4">
                    {day.label}
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.tasks.map((task, taskIdx) => (
                      <div 
                        key={taskIdx}
                        onClick={() => toggleTask(activeWeek-1, dayIdx, taskIdx)}
                        className={`group cursor-pointer bg-white dark:bg-slate-900 border transition-all p-5 rounded-[24px] flex items-start gap-4 shadow-sm hover:shadow-md ${task.completed ? 'opacity-60 border-green-200 dark:border-green-900/30' : 'border-slate-100 dark:border-slate-800 hover:border-accent/50'}`}
                      >
                        <div className="mt-1">
                          {task.completed ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                              <CheckCircle2 size={16} />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-accent transition-colors" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              task.priority === 'Critical' ? 'text-rose-500' :
                              task.priority === 'Important' ? 'text-amber-600' : 'text-sky-600'
                            }`}>
                              {task.priority}
                            </span>
                            <div className="flex items-center gap-1 text-slate-400 font-medium text-[10px]">
                              <Clock size={10} />
                              {task.timeEstimate}
                            </div>
                          </div>
                          <h4 className={`font-bold text-[15px] leading-tight mb-2 ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                            {task.title}
                          </h4>
                          <div className={`text-[11px] font-medium p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 ${task.completed ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="font-black uppercase tracking-tighter mr-2 text-[9px] opacity-40">Deliverable:</span>
                            {task.deliverable}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Quick Stats & Automation */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                <BarChart3 size={20} className="text-accent" />
                Plan Analytics
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Critical Completion</span>
                    <span className="text-rose-500">
                      {Math.round((tasks.reduce((acc, w) => acc + w.days.reduce((acc2, d) => acc2 + d.tasks.filter(t => t.priority === 'Critical' && t.completed).length, 0), 0) / 
                       tasks.reduce((acc, w) => acc + w.days.reduce((acc2, d) => acc2 + d.tasks.filter(t => t.priority === 'Critical').length, 0), 0)) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[45%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-500">Estimated Effort</span>
                    <span className="text-slate-800 dark:text-slate-200">92 Hours Total</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[30%]"></div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Daily Non-Negotiables</h4>
                  <ul className="space-y-4">
                    {[
                      { icon: Circle, text: "Check analytics (GA, IG)" },
                      { icon: Circle, text: "Respond to all DMs/Comments" },
                      { icon: Circle, text: "Post 1 story (minimum)" },
                      { icon: Circle, text: "Engage with 20 accounts" }
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <item.icon size={14} className="text-accent" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent to-amber-600 rounded-[32px] p-8 text-white shadow-xl shadow-accent/20 relative overflow-hidden group">
              <Zap className="absolute -bottom-6 -right-6 text-white/10 w-32 h-32 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <h3 className="text-xl font-black mb-2 relative z-10">Smart Automation</h3>
              <p className="text-white/80 text-sm font-medium mb-6 relative z-10">Sync your marketing tasks directly to the Smart Growth Calendar.</p>
              <button 
                onClick={handleSyncToCalendar}
                className="w-full bg-white text-accent py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 relative z-10"
              >
                <Plus size={18} />
                Sync to Calendar
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                <AlertTriangle size={20} className="text-amber-500" />
                Troubleshooting
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">No sales yet?</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Offer "First 50 customers: 30% off" to build momentum.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">Feeling Overwhelmed?</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Do only Day 1-7 first. Then repeat Week 1 tasks better.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
