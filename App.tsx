
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Bell, 
  User, 
  Plus, 
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Zap
} from 'lucide-react';
import { AppSection, Task, AIResponse } from './types';
import { generateSmartPlan } from './services/geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

// --- Mock Data ---
const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'مراجعة أوراق المشروع', duration: '45 دقيقة', category: 'work', startTime: '09:00', completed: true },
  { id: '2', title: 'وقت التركيز: كتابة الكود', duration: '2 ساعة', category: 'focus', startTime: '10:00', completed: false },
  { id: '3', title: 'اجتماع الفريق الأسبوعي', duration: '30 دقيقة', category: 'work', startTime: '13:00', completed: false },
  { id: '4', title: 'قراءة كتاب تقني', duration: '60 دقيقة', category: 'personal', startTime: '16:00', completed: false },
];

const ANALYTICS_DATA = [
  { name: 'الأحد', hours: 6 },
  { name: 'الاثنين', hours: 8 },
  { name: 'الثلاثاء', hours: 5 },
  { name: 'الأربعاء', hours: 9 },
  { name: 'الخميس', hours: 7 },
  { name: 'الجمعة', hours: 3 },
  { name: 'السبت', hours: 4 },
];

const CATEGORY_DATA = [
  { name: 'عمل', value: 40, color: '#3b82f6' },
  { name: 'تركيز', value: 35, color: '#8b5cf6' },
  { name: 'شخصي', value: 15, color: '#10b981' },
  { name: 'راحة', value: 10, color: '#f59e0b' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.Dashboard);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIResponse | null>(null);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAiPlan = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      const result = await generateSmartPlan(aiInput);
      setAiFeedback(result);
      // Optional: Auto-add to schedule
      // setTasks(prev => [...prev, ...result.suggestedSchedule]);
    } catch (error) {
      alert("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي");
    } finally {
      setIsAiLoading(false);
    }
  };

  const SidebarItem = ({ section, icon: Icon, label }: { section: AppSection, icon: any, label: string }) => (
    <button
      onClick={() => setActiveSection(section)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeSection === section 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-arabic" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-slate-200 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BrainCircuit size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">زمني AI</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem section={AppSection.Dashboard} icon={LayoutDashboard} label="لوحة التحكم" />
          <SidebarItem section={AppSection.Planner} icon={Calendar} label="المخطط الذكي" />
          <SidebarItem section={AppSection.Analytics} icon={BarChart3} label="التحليلات" />
          <SidebarItem section={AppSection.Chat} icon={MessageSquare} label="المساعد الشخصي" />
        </nav>

        <div className="mt-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">أحمد محمد</p>
              <p className="text-xs text-slate-500">خطة برو</p>
            </div>
          </div>
          <button className="w-full text-xs font-semibold py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-800">أهلاً بك، أحمد 👋</h2>
            <p className="text-sm text-slate-500">اليوم هو الثلاثاء، 24 أكتوبر</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-100 transition-all">
              <Plus size={18} />
              <span>مهمة جديدة</span>
            </button>
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeSection === AppSection.Dashboard && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'إجمالي الساعات', val: '32h', icon: Clock, color: 'blue' },
                  { label: 'ساعات التركيز', val: '12h', icon: Zap, color: 'purple' },
                  { label: 'المهام المنجزة', val: '85%', icon: CheckCircle2, color: 'green' },
                  { label: 'مستوى الإنتاجية', val: 'عالي', icon: Sparkles, color: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.val}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Tasks List */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-slate-800">جدولك لليوم</h3>
                      <button className="text-blue-600 text-sm font-semibold hover:underline">عرض الكل</button>
                    </div>
                    <div className="space-y-4">
                      {tasks.map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => toggleTask(task.id)}
                          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                            task.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              task.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                            }`}>
                              {task.completed && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <div>
                              <p className={`font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><Clock size={12}/> {task.startTime}</span>
                                <span>•</span>
                                <span>{task.duration}</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-md ${
                                  task.category === 'work' ? 'bg-blue-50 text-blue-600' :
                                  task.category === 'focus' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {task.category === 'work' ? 'عمل' : task.category === 'focus' ? 'تركيز' : 'شخصي'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus size={20} className="rotate-45" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm h-80">
                     <h3 className="text-xl font-bold text-slate-800 mb-6">نشاطك الأسبوعي</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ANALYTICS_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={32}>
                            {ANALYTICS_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 3 ? '#3b82f6' : '#e2e8f0'} />
                            ))}
                          </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: AI Assistant */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <BrainCircuit size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>ذكاء اصطناعي</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">خطط لمشروعك بذكاء</h3>
                      <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                        أخبرني عن مشروعك أو أهدافك، وسأقوم بجدولتها فوراً بناءً على ساعات ذروتك.
                      </p>
                      <textarea 
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder="مثال: عندي مشروع يحتاج 10 ساعات، أبغى أخلصه قبل الخميس ولا أشتغل بعد الساعة 8."
                        className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm placeholder:text-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/30 mb-4 h-32 resize-none"
                      />
                      <button 
                        onClick={handleAiPlan}
                        disabled={isAiLoading}
                        className="w-full bg-white text-blue-600 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all disabled:opacity-50"
                      >
                        {isAiLoading ? (
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Zap size={18} />
                            <span>توليد الخطة الذكية</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* AI Output / Suggestions */}
                  {aiFeedback && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in zoom-in-95 duration-300">
                      <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        الخطة المقترحة
                      </h4>
                      <div className="space-y-3 mb-6">
                        {aiFeedback.suggestedSchedule.map((s, i) => (
                          <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                            <span className="font-bold text-slate-700">{s.title}</span>
                            <span className="text-slate-500 block text-xs">المدة: {s.duration}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 p-4 rounded-2xl">
                        <h5 className="text-xs font-bold text-blue-600 uppercase mb-2">نصيحة ذكية</h5>
                        <p className="text-sm text-blue-800 leading-relaxed italic">
                          "{aiFeedback.tips[0]}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">توزيع الوقت</h3>
                    <div className="h-48 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                           <Pie
                             data={CATEGORY_DATA}
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="value"
                           >
                             {CATEGORY_DATA.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                           </Pie>
                           <Tooltip />
                         </PieChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {CATEGORY_DATA.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                          <span className="text-xs text-slate-500">{cat.name}: {cat.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection !== AppSection.Dashboard && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
               <div className="bg-blue-50 p-6 rounded-full text-blue-600">
                 <Sparkles size={48} />
               </div>
               <h2 className="text-2xl font-bold text-slate-800">قيد التطوير</h2>
               <p className="text-slate-500 max-w-sm">
                 هذا القسم متاح حصرياً لمشتركي باقة "التميز". شكراً لثقتك بـ زمني AI.
               </p>
               <button 
                onClick={() => setActiveSection(AppSection.Dashboard)}
                className="text-blue-600 font-bold hover:underline"
               >
                 العودة للوحة التحكم
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
