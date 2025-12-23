import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  MapPin, CloudSun, Plane, Hotel, Phone, Wallet, Calendar, Navigation,
  Utensils, Info, ChevronRight, Plus, Loader2, RefreshCw, LogOut, Trash2,
  X, AlertTriangle, ShoppingBag, Target, Flame, Home, Clock, ArrowUpRight,
  ArrowDownLeft, Timer, Sparkles, ChevronLeft, Key, Link as LinkIcon, Coins,
  Type
} from 'lucide-react';

// Firebase Modules
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, 
  query, setDoc, getDoc, updateDoc, Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged 
} from 'firebase/auth';

/**
 * --- 全域配置 ---
 */
const firebaseConfig = {
  apiKey: "AIzaSyAJ4hVK_rMk6Yqt9fu5fRJNgksA22vr-Gs",
  authDomain: "kittt-dae8a.firebaseapp.com",
  projectId: "kittt-dae8a",
  storageBucket: "kittt-dae8a.firebasestorage.app",
  messagingSenderId: "813328019366",
  appId: "1:813328019366:web:6b40f12221da1c19532967"
};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'osaka-trip-noir';

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const USERS = [
  { id: "pick", name: "Pick.lu", avatar: "P" },
  { id: "afred", name: "Afred.Lee", avatar: "A" },
  { id: "ting", name: "婷", avatar: "T" },
  { id: "hsien", name: "賢", avatar: "M" },
  { id: "yen", name: "燕", avatar: "Y" },
  { id: "uncle", name: "叔叔", avatar: "U" }
];

const INITIAL_TRIP_DATA = {
  title: "OSAKA NOIR",
  subtitle: "大阪滑雪買買買之旅",
  days: [
    {
      id: 1,
      date: "2026-01-16",
      label: "Day 1",
      location: "難波 / 心齋橋",
      schedule: [
        { id: 's1-1', type: "hotel", name: "Bande Hotel Osaka", description: "前往第一天的飯店寄放行李。", tags: ["重要行程"] },
        { id: 's1-2', type: "spot", name: "寄放行李", description: "辦理行李寄放。", tags: ["攻略"] },
        { id: 's1-3', type: "spot", name: "木津市場", description: "必吃美食：新鮮海產、在地早餐。", tags: ["必吃美食"] },
        { id: 's1-4', type: "restaurant", name: "天下一品 難波ウインズ前店", description: "極濃郁拉麵。 (11:30前會自動與難波公園對調)", tags: ["必吃美食"], isDynamic: true },
        { id: 's1-5', type: "shopping", name: "難波公園 (Namba Parks)", description: "最高優先事項：「購買HOKA」。地點：Alpen Outdoors Namba Parks Branch", tags: ["最高優先", "必買伴手禮"], isDynamic: true },
        { id: 's1-6', type: "shopping", name: "安利美特 大阪日本橋店", description: "動漫、小說、週邊巡禮。", tags: ["攻略"] },
        { id: 's1-7', type: "shopping", name: "駿河屋 大阪日本橋店", description: "模型、二手珍稀挖掘。", tags: ["攻略"] },
        { id: 's1-8', type: "shopping", name: "Bic Camera 難波店", description: "電器、伴手禮免稅採購。", tags: ["必買伴手禮"] },
        { id: 's1-9', type: "spot", name: "道頓堀 - 戎橋", description: "打卡 Glico 跑跑人。", tags: ["攻略"] },
        { id: 's1-10', type: "restaurant", name: "炭火燒寢床 心齋橋本店", description: "鰻魚飯、炭火串燒。", tags: ["必吃美食", "預約建議"] },
        { id: 's1-11', type: "transport", name: "回飯店", description: "返回 Bande Hotel Osaka 休息。", tags: ["休息"] }
      ]
    },
    {
      id: 2,
      date: "2026-01-17",
      label: "Day 2",
      location: "通天閣 / 新世界",
      schedule: [
        { id: 's2-1', type: "explore", name: "未定行程", description: "早晨悠閒時光。", tags: ["彈性"] },
        { id: 's2-2', type: "spot", name: "與 Afred.Lee & 婷 會合", description: "大家庭集合！", tags: ["重要行程"] },
        { id: 's2-3', type: "spot", name: "大阪通天閣", description: "新世界地標，俯瞰大阪街景。", tags: ["攻略"] },
        { id: 's2-4', type: "spot", name: "大阪新世界", description: "炸串發源地，體驗濃厚昭和氣氛。", tags: ["必吃美食"] },
        { id: 's2-5', type: "shopping", name: "心齋橋", description: "繁華街區巡禮。", tags: ["攻略"] },
        { id: 's2-6', type: "shopping", name: "大國藥妝 心齋橋店", description: "藥妝採購清單補完。", tags: ["必買伴手禮"] },
        { id: 's2-11', type: "transport", name: "回飯店", description: "返回住宿地點。", tags: ["休息"] }
      ]
    },
    {
      id: 3,
      date: "2026-01-18",
      label: "Day 3",
      location: "六甲山滑雪",
      schedule: [
        { id: 's3-1', type: "transport", name: "六甲山滑雪【8:00集合】", description: "集合地點：大阪｜難波OCAT．JR 難波站 OCAT大廈一樓。", tags: ["重要行程", "準時"] },
        { id: 's3-2', type: "explore", name: "六甲山雪地樂園", description: "一整天的滑雪與雪地體驗。", tags: ["最高優先"] },
        { id: 's3-11', type: "transport", name: "回飯店", description: "運動後的放鬆。", tags: ["休息"] }
      ]
    },
    {
      id: 4,
      date: "2026-01-19",
      label: "Day 4",
      location: "租車 / 移宿",
      schedule: [
        { id: 's4-1', type: "transport", name: "租車作業", description: "開始自駕行程。", tags: ["重要行程"] },
        { id: 's4-2', type: "explore", name: "自駕探險", description: "彈性探索周邊區域。", tags: ["彈性"] },
        { id: 's4-11', type: "hotel", name: "入住新飯店", description: "移往 CANDEO HOTELS Osaka The Tower。", tags: ["重要行程"] }
      ]
    },
    {
      id: 5,
      date: "2026-01-20",
      label: "Day 5",
      location: "歸途",
      schedule: [
        { id: 's5-1', type: "hotel", name: "飯店退房", description: "最晚 11:00 需辦理退房。", tags: ["重要行程"] },
        { id: 's5-11', type: "transport", name: "旅程結束", description: "前往機場，滿載而歸。", tags: ["攻略"] }
      ]
    }
  ],
  logistics: {
    flights: [
      { no: "GK50", route: "TPE → KIX", type: "去程", dep: "02:30", arr: "06:00", terminal: "T1", date: "2026/01/16" },
      { no: "IT 213", route: "KIX → TPE", type: "回程", dep: "18:55", arr: "21:15", terminal: "T1", date: "2026/01/20" }
    ],
    stays: [
      { 
        name: "Bande Hotel Osaka", 
        period: "01/16 - 01/19", 
        addr: "大阪府大阪市住之江区粉浜1-5-1",
        note: "1/16 15:00入住 | 1/19 10:00退房"
      },
      { 
        name: "CANDEO HOTELS Osaka The Tower", 
        period: "01/19 - 01/20", 
        addr: "大阪府大阪市北區堂島浜1-1-5",
        note: "1/19 15:00入住 | 1/20 11:00退房"
      }
    ]
  }
};

/**
 * --- 子組件：高亮文字 ---
 */
const HighlightedText = ({ text }) => {
  if (!text) return null;
  const keywords = ["必吃美食", "必點菜單", "必買伴手禮", "最高優先", "購買HOKA"];
  let parts = [text];
  keywords.forEach((keyword) => {
    let newParts = [];
    parts.forEach((part) => {
      if (typeof part !== "string") {
        newParts.push(part);
      } else {
        const split = part.split(new RegExp(`(${keyword})`, "g"));
        newParts.push(...split);
      }
    });
    parts = newParts;
  });

  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return (
            <span key={`hl-${part}-${i}`} className="text-rose-400 font-bold border-b border-rose-400/30">
              {part}
            </span>
          );
        }
        return <span key={`text-${i}`}>{part}</span>;
      })}
    </>
  );
};

/**
 * --- 子組件：登入介面 ---
 */
const LoginView = ({ apiKey, onSetApiKey, onSelectUser }) => {
  const [localKey, setLocalKey] = useState(apiKey);
  
  return (
    <div className="min-h-screen bg-black text-white p-12 flex flex-col justify-center items-center">
      <div className="w-full max-w-sm text-center space-y-16 animate-in">
        <header className="space-y-4">
          <p className="text-xs tracking-[0.5em] text-zinc-600 uppercase italic">Winter 2026 Edition</p>
          <h1 className="text-5xl font-extralight tracking-[0.2em]">OSAKA NOIR</h1>
        </header>
        <div className="space-y-6">
          <div className="relative group">
            <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" />
            <input 
              type="password" 
              placeholder="GEMINI API KEY" 
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              onBlur={() => onSetApiKey(localKey)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-6 pl-16 text-sm font-mono tracking-widest outline-none focus:border-rose-500/50 transition-all placeholder:text-zinc-800"
            />
          </div>
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest">輸入金鑰後點擊空白處以儲存</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          {USERS.map(u => (
            <button key={u.id} onClick={() => onSelectUser(u)} className="flex flex-col items-center space-y-4 group">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl text-zinc-500 group-hover:border-rose-500 transition-all shadow-xl">
                {u.avatar}
              </div>
              <span className="text-xs tracking-widest text-zinc-600 uppercase font-bold">{u.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * --- 主程式組件 ---
 */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [view, setView] = useState('main'); 
  const [expenses, setExpenses] = useState([]);
  const [customSchedules, setCustomSchedules] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem('osaka_gemini_key') || "");
  const [exchangeRates, setExchangeRates] = useState({ twd: 0.22, hkd: 0.051 });
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [jpyInput, setJpyInput] = useState("");
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const scrollRef = useRef(null);

  // 手動輸入行程狀態
  const [newManualLocation, setNewManualLocation] = useState({
    name: '',
    description: '',
    type: 'spot',
    tags: ''
  });

  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: '食' });

  // 偵測當前日期並設定初始天數
  useEffect(() => {
    if (currentUser) {
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      const foundIndex = INITIAL_TRIP_DATA.days.findIndex(day => day.date === today);
      if (foundIndex !== -1) {
        setSelectedDayIndex(foundIndex);
      } else {
        setSelectedDayIndex(0);
      }
    }
  }, [currentUser]);

  // API 補退機制
  const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(res => setTimeout(res, backoff));
        return fetchWithRetry(url, options, retries - 1, backoff * 2);
      }
      throw error;
    }
  };

  // 身份驗證初始化
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => {
      unsubscribe();
      clearInterval(timeTimer);
    };
  }, []);

  // 同步 Firestore 數據
  useEffect(() => {
    if (!user || !currentUser || !db) return;
    const expensesRef = collection(db, 'artifacts', appId, 'public', 'data', `expenses_${currentUser.id}`);
    const customRef = collection(db, 'artifacts', appId, 'public', 'data', `custom_itinerary`);
    
    const unsubExp = onSnapshot(expensesRef, (s) => {
      setExpenses(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Snapshot error:", err));

    const unsubCust = onSnapshot(customRef, (s) => {
      setCustomSchedules(s.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Snapshot error:", err));

    return () => { unsubExp(); unsubCust(); };
  }, [user, currentUser]);

  const handleSetApiKey = useCallback((val) => {
    setApiKey(val);
    localStorage.setItem('osaka_gemini_key', val);
  }, []);

  const fetchRates = async () => {
    if (!apiKey) return;
    setIsFetchingRates(true);
    try {
      const prompt = `獲取最新 JPY 兌 TWD 及 JPY 兌 HKD 匯率。回傳 JSON: {"twd": 數字, "hkd": 數字}`;
      const data = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{ "google_search": {} }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      const ratesText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const rates = JSON.parse(ratesText);
      if (rates.twd) setExchangeRates(prev => ({ ...prev, ...rates }));
    } catch (e) { console.error("Rates fetch failed", e); }
    finally { setIsFetchingRates(false); }
  };

  // 處理手動新增地點
  const handleAddManualLocation = async () => {
    if (!newManualLocation.name || !db || !currentUser) return;
    
    try {
      const customRef = collection(db, 'artifacts', appId, 'public', 'data', `custom_itinerary`);
      const tagsArray = newManualLocation.tags
        ? newManualLocation.tags.split(/[，,]/).map(t => t.trim()).filter(t => t)
        : [];
      
      await addDoc(customRef, { 
        name: newManualLocation.name, 
        description: newManualLocation.description || "手動紀錄的足跡。", 
        type: newManualLocation.type, 
        tags: tagsArray, 
        createdAt: Date.now(), 
        creator: currentUser.name 
      });

      setNewManualLocation({ name: '', description: '', type: 'spot', tags: '' });
      setView('main');
    } catch (e) { 
      console.error("Manual add error", e); 
    }
  };

  const handleConfirmExpense = async () => {
    if (!db || !currentUser || !user) return;
    if (!newExpense.title || !newExpense.amount) return;

    try {
      const expensesRef = collection(db, 'artifacts', appId, 'public', 'data', `expenses_${currentUser.id}`);
      await addDoc(expensesRef, { 
        title: newExpense.title,
        amount: Number(newExpense.amount), 
        category: newExpense.category,
        createdAt: Date.now() 
      });
      setNewExpense({ title: '', amount: '', category: '食' }); 
      setIsAddingExpense(false);
    } catch (err) {
      console.error("Expense error:", err);
    }
  };

  // 取得處理後的每日行程
  const getProcessedDaySchedule = (day) => {
    let base = [...day.schedule];
    
    // Day 1 特殊動態邏輯
    if (day.id === 1) {
      const isEarly = currentTime.getHours() < 11 || (currentTime.getHours() === 11 && currentTime.getMinutes() < 30);
      if (isEarly) {
        const rIdx = base.findIndex(i => i.name?.includes("天下一品")), pIdx = base.findIndex(i => i.name?.includes("難波公園"));
        if (rIdx !== -1 && pIdx !== -1) [base[rIdx], base[pIdx]] = [base[pIdx], base[rIdx]];
      }
      // 只有第一天會合併自定義行程
      return [...base, ...[...customSchedules].sort((a, b) => a.createdAt - b.createdAt)];
    }
    
    return base;
  };

  if (authLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <Loader2 className="text-rose-500 animate-spin" size={32} />
      <p className="text-[10px] tracking-[0.4em] text-zinc-700 uppercase">Synchronizing...</p>
    </div>
  );

  if (!currentUser) return <LoginView apiKey={apiKey} onSetApiKey={handleSetApiKey} onSelectUser={setCurrentUser} />;

  const currentDay = INITIAL_TRIP_DATA.days[selectedDayIndex];

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-rose-500/30">
      {/* 行程分頁 */}
      {activeTab === 'itinerary' && (
        <div className="pb-40 animate-in">
          {/* Header */}
          <div className="relative h-[50vh] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-10 left-8 space-y-4">
              <p className="text-sm tracking-[0.4em] text-zinc-500 uppercase italic font-bold">Bonjour, {currentUser.name}</p>
              <h1 className="text-5xl font-extralight text-white tracking-widest uppercase">{INITIAL_TRIP_DATA.subtitle}</h1>
              <div className="flex items-center text-xs tracking-widest text-zinc-400 gap-6">
                <span className="flex items-center gap-2 font-bold"><Calendar size={16}/> JAN 16 - 20</span>
                <span className="flex items-center gap-2 font-bold"><MapPin size={16}/> OSAKA</span>
              </div>
            </div>
          </div>

          {/* 橫向滑軌日期選單 */}
          <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-6">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 no-scrollbar pb-1"
            >
              {INITIAL_TRIP_DATA.days.map((day, idx) => {
                const isToday = day.date === new Date().toLocaleDateString('en-CA');
                return (
                  <button
                    key={`day-btn-${day.id}`}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex-shrink-0 px-8 py-4 rounded-3xl transition-all border-2 flex flex-col items-center ${
                      selectedDayIndex === idx 
                      ? 'bg-rose-600 border-rose-600 text-white shadow-lg scale-105' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className="text-[10px] tracking-widest uppercase font-black opacity-70 mb-1">{day.label}</span>
                    <span className="text-xl font-mono font-bold">{day.date.split('-')[2]}日</span>
                    {isToday && <div className="mt-1 w-1 h-1 rounded-full bg-white animate-pulse" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-8 mt-12 space-y-12">
            <div className="relative border-l-2 border-zinc-900 pl-10 ml-3">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
              <div className="mb-10">
                <p className="text-xs text-rose-500 uppercase tracking-widest font-black mb-2">{currentDay.label} • {currentDay.date}</p>
                <h2 className="text-4xl text-zinc-100 font-light tracking-tight">{currentDay.location}</h2>
              </div>
              
              <div className="space-y-6">
                {getProcessedDaySchedule(currentDay).map((item, idx) => (
                  <React.Fragment key={item.id || `sch-frag-${currentDay.id}-${idx}`}>
                    {/* 行程卡片 */}
                    <div className={`bg-zinc-900/40 border border-zinc-800/50 rounded-[40px] p-8 transition-all backdrop-blur-sm ${item.tags?.includes('最高優先') ? 'ring-2 ring-rose-500/30' : ''}`}>
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-[10px] tracking-[0.3em] text-zinc-700 uppercase font-black bg-zinc-800/50 px-3 py-1 rounded-lg">{item.type}</span>
                        <div className="flex gap-3">
                          {item.id?.length > 10 && <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', `custom_itinerary`, item.id))} className="p-3 text-zinc-700 hover:text-rose-500 transition-colors"><Trash2 size={20}/></button>}
                          <a href={`http://maps.apple.com/?q=${encodeURIComponent(item.name)}`} className="p-3 bg-zinc-800/50 rounded-2xl text-zinc-500 hover:text-rose-500 transition-colors"><Navigation size={20} /></a>
                        </div>
                      </div>
                      <h3 className="text-2xl text-zinc-100 mb-3 flex items-center font-bold">{item.name}{item.tags?.includes('最高優先') && <Flame size={20} className="ml-3 text-rose-500 animate-pulse" />}</h3>
                      <p className="text-lg text-zinc-500 font-light leading-relaxed mb-6"><HighlightedText text={item.description}/></p>
                      <div className="flex flex-wrap gap-3">
                        {item.tags?.map((t, tIdx) => <span key={`${item.id || idx}-tag-${tIdx}`} className={`text-xs px-4 py-1.5 border-2 rounded-full uppercase tracking-widest font-bold ${t === '最高優先' ? 'border-rose-500/50 text-rose-500' : 'border-zinc-800 text-zinc-700'}`}>{t}</span>)}
                      </div>
                    </div>

                    {/* 間隔中的新增按鈕 */}
                    <button 
                      onClick={() => setView('add-manual')} 
                      className="w-full py-5 border-2 border-dashed border-zinc-900/60 rounded-3xl flex items-center justify-center text-zinc-800 hover:text-rose-500 hover:border-rose-500/30 transition-all group"
                    >
                      <Plus size={24} className="group-hover:scale-125 transition-transform" />
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 資訊分頁 */}
      {activeTab === 'info' && (
        <div className="pt-24 px-10 pb-40 space-y-12 animate-in">
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-xs tracking-[0.5em] text-zinc-700 uppercase font-black">Flight Logs</h3>
              <button onClick={() => setCurrentUser(null)} className="text-xs text-rose-500 flex items-center gap-2 font-bold"><LogOut size={14}/> SWITCH USER</button>
            </div>
            {INITIAL_TRIP_DATA.logistics.flights.map((f, i) => (
              <div key={`flight-log-${f.no}-${i}`} className="bg-zinc-900/60 rounded-[40px] p-10 border border-zinc-800/50 relative overflow-hidden">
                 <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none"><Plane size={150}/></div>
                 <div className="flex justify-between items-center mb-10"><span className="text-4xl font-mono text-white tracking-tighter font-bold">{f.no}</span><span className="text-xs bg-zinc-800 px-4 py-2 rounded-full text-zinc-500 font-bold">{f.date}</span></div>
                 <div className="flex justify-between items-end">
                    <div><p className="text-[10px] text-zinc-700 uppercase mb-2 font-black">DEP</p><div className="text-3xl font-mono text-zinc-200">{f.dep}</div></div>
                    <div className="flex-1 px-6 mb-3"><div className="h-[2px] bg-zinc-800 w-full relative"><Plane size={16} className="absolute left-1/2 -translate-x-1/2 -top-[7px] text-zinc-800" /></div></div>
                    <div className="text-right"><p className="text-[10px] text-zinc-700 uppercase mb-2 font-black">ARR</p><div className="text-3xl font-mono text-zinc-200">{f.arr}</div></div>
                 </div>
              </div>
            ))}
          </section>
          <section className="space-y-8">
            <h3 className="text-xs tracking-[0.5em] text-zinc-700 uppercase font-black">Stay Info</h3>
            {INITIAL_TRIP_DATA.logistics.stays.map((s, i) => (
              <div key={`stay-card-${i}`} className="bg-zinc-900/40 p-10 rounded-[40px] border border-zinc-800/50 space-y-6">
                <div><h4 className="text-2xl text-zinc-100 font-bold">{s.name}</h4><p className="text-xs text-rose-500 font-black uppercase tracking-widest mt-1">{s.period}</p></div>
                <p className="text-lg text-zinc-600 font-light leading-relaxed">{s.addr}</p>
                <p className="text-sm text-zinc-500 italic font-medium">{s.note}</p>
                <div className="pt-6 border-t border-zinc-800/50 flex justify-end"><a href={`http://maps.apple.com/?q=${encodeURIComponent(s.addr)}`} className="text-xs text-zinc-700 font-black flex items-center gap-2 hover:text-white transition-colors"><Navigation size={14}/> OPEN MAP</a></div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* 匯率分頁 */}
      {activeTab === 'currency' && (
        <div className="pt-24 px-10 pb-40 space-y-10 animate-in">
          <div className="bg-zinc-900/50 border border-zinc-800 p-16 rounded-[60px] text-center space-y-8">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-black">JPY Amount</p>
            <input type="number" placeholder="0" value={jpyInput} onChange={e => setJpyInput(e.target.value)} className="w-full bg-transparent text-7xl font-mono text-center text-white outline-none focus:text-rose-500 transition-colors" />
            <button onClick={fetchRates} disabled={isFetchingRates} className="inline-flex items-center gap-3 text-xs text-zinc-700 hover:text-zinc-400 transition-colors font-bold uppercase tracking-widest">{isFetchingRates ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Update Yahoo Finance</button>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-zinc-900/30 border border-zinc-900 p-10 rounded-[40px] flex justify-between items-center">
              <p className="text-xs text-zinc-700 font-black uppercase tracking-widest">TWD 台幣</p>
              <div className="text-4xl font-mono text-zinc-200">≈ ${(Number(jpyInput) * exchangeRates.twd).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            <div className="bg-zinc-900/30 border border-zinc-900 p-10 rounded-[40px] flex justify-between items-center">
              <p className="text-xs text-zinc-700 font-black uppercase tracking-widest">HKD 港幣</p>
              <div className="text-4xl font-mono text-zinc-200">≈ ${(Number(jpyInput) * exchangeRates.hkd).toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>
      )}

      {/* 預算分頁 */}
      {activeTab === 'budget' && (
        <div className="pt-24 px-8 pb-40 space-y-10 animate-in">
          <div className="bg-zinc-900/50 border border-zinc-800 p-14 rounded-[60px] text-center space-y-4">
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-black">{currentUser.name}'s Total Spent</p>
            <h2 className="text-6xl font-mono text-white tracking-tighter font-bold">¥ {expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0).toLocaleString()}</h2>
          </div>
          <div className="space-y-4">
            {expenses.sort((a,b) => b.createdAt - a.createdAt).map(e => (
              <div key={`expense-item-${e.id}`} className="bg-zinc-900/40 p-8 rounded-[40px] flex justify-between items-center border border-zinc-900/50">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-zinc-800 rounded-3xl flex items-center justify-center text-sm font-black text-zinc-500">{e.category}</div>
                  <div><p className="text-xl text-zinc-200 font-bold">{e.title}</p></div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-mono text-xl text-white">¥{(e.amount || 0).toLocaleString()}</span>
                  <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', `expenses_${currentUser.id}`, e.id))} className="p-2 text-zinc-800 hover:text-rose-500 transition-colors"><Trash2 size={24}/></button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setIsAddingExpense(true)} className="fixed bottom-36 left-10 right-10 py-8 bg-white text-black rounded-full text-xs font-black tracking-[0.5em] uppercase shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-95 transition-all z-50">NEW TRANSACTION</button>
        </div>
      )}

      {/* 導航欄 - 加大字體與間距 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-3xl border-t border-zinc-900/80 pt-8 pb-14 px-10 flex justify-between items-center z-[60]">
        {[
          { id: 'itinerary', icon: Calendar, label: 'Trip' },
          { id: 'info', icon: Info, label: 'Logs' },
          { id: 'currency', icon: Coins, label: 'Exch' },
          { id: 'budget', icon: Wallet, label: 'Cash' }
        ].map(tab => (
          <button key={`nav-tab-${tab.id}`} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-3 group transition-all duration-300 ${activeTab === tab.id ? 'text-rose-500 scale-110' : 'text-zinc-800'}`}>
            <tab.icon size={32} strokeWidth={activeTab === tab.id ? 2.5 : 1.5} /><span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* 記帳 Modal */}
      {isAddingExpense && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex flex-col justify-end p-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[50px] p-10 space-y-10">
            <div className="flex justify-between items-center"><h3 className="text-2xl text-white uppercase tracking-widest font-bold">New Expense</h3><button onClick={() => setIsAddingExpense(false)} className="p-3 bg-zinc-800 rounded-full text-zinc-600"><X size={24}/></button></div>
            <div className="space-y-6">
              <input type="text" placeholder="項目名稱" className="w-full bg-black/50 border border-zinc-800 rounded-3xl p-6 text-lg text-white outline-none focus:border-rose-500" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
              <input type="number" placeholder="金額 (JPY)" className="w-full bg-black/50 border border-zinc-800 rounded-3xl p-6 text-lg font-mono text-white outline-none focus:border-rose-500" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
              <div className="flex gap-3">
                {['食', '交', '住', '購', '他'].map(cat => <button key={`cat-btn-${cat}`} onClick={() => setNewExpense({...newExpense, category: cat})} className={`flex-1 py-5 rounded-2xl text-sm font-black transition-all ${newExpense.category === cat ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-600'}`}>{cat}</button>)}
              </div>
            </div>
            <button onClick={handleConfirmExpense} className="w-full py-8 bg-rose-500 text-white rounded-3xl text-xs font-black uppercase tracking-[0.4em]">Confirm Transaction</button>
          </div>
        </div>
      )}

      {/* 手動新增地點視窗 */}
      {view === 'add-manual' && (
        <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] p-10 flex flex-col">
           <header className="flex justify-between items-center mb-16">
             <button onClick={() => setView('main')} className="p-4 bg-zinc-900 rounded-3xl text-zinc-600 hover:text-white transition-colors">
               <ChevronLeft size={32}/>
             </button>
             <h2 className="text-sm tracking-[0.5em] uppercase text-white font-extralight">Manual Destination</h2>
             <div className="w-16"/>
           </header>

           <div className="flex-1 space-y-10 max-w-xl mx-auto w-full">
             <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-xs text-zinc-600 uppercase tracking-widest ml-4 font-black">Location Name</label>
                 <input 
                   type="text" 
                   placeholder="地點名稱 (如: 阿倍野展望台)" 
                   value={newManualLocation.name} 
                   onChange={e => setNewManualLocation({...newManualLocation, name: e.target.value})} 
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-lg text-white outline-none focus:border-rose-500 transition-all shadow-inner" 
                 />
               </div>

               <div className="space-y-3">
                 <label className="text-xs text-zinc-600 uppercase tracking-widest ml-4 font-black">Description</label>
                 <textarea 
                   placeholder="簡短描述或備註" 
                   rows={3}
                   value={newManualLocation.description} 
                   onChange={e => setNewManualLocation({...newManualLocation, description: e.target.value})} 
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-lg text-white outline-none focus:border-rose-500 transition-all resize-none shadow-inner" 
                 />
               </div>

               <div className="space-y-3">
                 <label className="text-xs text-zinc-600 uppercase tracking-widest ml-4 font-black">Type</label>
                 <div className="grid grid-cols-3 gap-3">
                   {[
                     { id: 'spot', label: '景點' },
                     { id: 'restaurant', label: '美食' },
                     { id: 'shopping', label: '購物' },
                     { id: 'transport', label: '交通' },
                     { id: 'hotel', label: '住宿' },
                     { id: 'explore', label: '探險' }
                   ].map(cat => (
                     <button 
                       key={`manual-cat-${cat.id}`} 
                       onClick={() => setNewManualLocation({...newManualLocation, type: cat.id})} 
                       className={`py-5 rounded-2xl text-xs font-black transition-all border-2 ${newManualLocation.type === cat.id ? 'bg-rose-500/10 border-rose-500 text-rose-500' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}
                     >
                       {cat.label}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-xs text-zinc-600 uppercase tracking-widest ml-4 font-black">Tags (逗號分隔)</label>
                 <input 
                   type="text" 
                   placeholder="標籤，如: 必去, 需預約" 
                   value={newManualLocation.tags} 
                   onChange={e => setNewManualLocation({...newManualLocation, tags: e.target.value})} 
                   className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-lg text-white outline-none focus:border-rose-500 transition-all shadow-inner" 
                 />
               </div>
             </div>

             <button 
               onClick={handleAddManualLocation} 
               disabled={!newManualLocation.name}
               className="w-full py-8 bg-white text-black rounded-full text-xs font-black tracking-[0.5em] uppercase disabled:opacity-20 active:scale-95 transition-all shadow-2xl mt-10"
             >
               Add to Itinerary
             </button>
           </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        body { background: black; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}