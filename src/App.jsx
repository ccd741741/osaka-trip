import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, CloudSun, Plane, Hotel, Calendar, Navigation,
  Flame, Info, Phone, ShieldAlert, LifeBuoy, 
  Coins, X, Car, Utensils, ShoppingBag, Map, AlertCircle,
  Palette, Check, Users, Eye, ArrowUp, Calculator
} from 'lucide-react';

// --- 1. 主題配色定義 ---
const THEMES = {
  rose: {
    name: "Rose Noir",
    primary: "text-rose-500",      
    light: "text-rose-400",        
    bg: "bg-rose-600",             
    bgHover: "hover:bg-rose-500",  
    border: "border-rose-500",     
    softBg: "bg-rose-900/10",      
    glow: "shadow-[0_0_15px_-3px_rgba(225,29,72,0.6)]", 
    selection: "selection:bg-rose-500/30" 
  },
  blue: {
    name: "Cyber Blue",
    primary: "text-blue-500",
    light: "text-blue-400",
    bg: "bg-blue-500",
    bgHover: "hover:bg-blue-400",
    border: "border-blue-500",
    softBg: "bg-blue-900/10",
    glow: "shadow-[0_0_15px_-3px_rgba(59,130,246,0.6)]",
    selection: "selection:bg-blue-500/30"
  }
};

// --- 2. 輔助函式：產生 Google Maps 連結 ---
const getMapLink = (query) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

// --- 旅行資料配置 ---
const TRAVEL_DATA = {
  title: "OSAKA NOIR",
  subtitle: "大阪滑雪買買買之旅",
  duration: "2026/01/16 — 01/20",
  emergency: [
    { name: "警察局 (Police)", tel: "110", icon: <ShieldAlert size={18} /> },
    { name: "救護車 (Ambulance)", tel: "119", icon: <LifeBuoy size={18} /> },
    { 
      name: "台灣駐大阪辦事處", 
      tel: "+81-6-6443-8481", 
      desc: "緊急專線: 090-8794-4568",
      address: "大阪市北區中之島 2-3-18",
      mapQuery: "台北駐大阪經濟文化辦事處"
    }
  ],
  flightGroups: [
    {
      id: 'tpe',
      label: "TPE Group (Pick)",
      currency: "TWD",
      rate: 0.205,
      outbound: { code: "GK50", desc: "TPE ➔ KIX", time: "02:30 - 06:00" },
      inbound: { code: "IT213", desc: "KIX ➔ TPE", time: "19:55 - 22:30" }
    },
    {
      id: 'hkg',
      label: "HKG Group (Alfred)",
      currency: "HKD",
      rate: 0.0498,
      outbound: { code: "HX614", desc: "HKG ➔ KIX", time: "09:35 - 14:05" },
      inbound: { code: "HX613", desc: "KIX ➔ HKG", time: "20:05 - 23:40" }
    }
  ],
  accommodations: [
    { 
      name: "Bande Hotel Osaka", 
      tel: "+81-6-6651-1200",
      checkIn: "2026-01-16 15:00", 
      checkOut: "2026-01-19 10:00",
      address: "大阪府大阪市住之江區粉浜1-5-1",
      mapQuery: "Bande Hotel Osaka"
    },
    { 
      name: "Candeo Hotels Osaka The Tower", 
      tel: "+81-6-6136-3330",
      checkIn: "2026-01-19 15:00", 
      checkOut: "2026-01-20 11:00",
      address: "大阪府大阪市北區堂島浜1-1-5",
      mapQuery: "Candeo Hotels Osaka The Tower"
    }
  ],
  days: [
    { 
      id: 1, date: "2026-01-16", label: "Day 1", location: "難波 / 日本橋",
      schedule: [
        { type: "spot", name: "尚未出發", description: "期待明日 (01/17) 出發前往大阪！", time: "00:00", group: "hkg" },
        { type: "hotel", name: "Bande Hotel Osaka", description: "前往飯店寄放行李", time: "09:00", group: "tpe" },
        { type: "spot", name: "木津市場", description: "體驗當地海鮮與市場文化", time: "10:30", group: "tpe" },
        // 加入 ID 以供邏輯識別
        { id: "noodle_spot", type: "restaurant", name: "天下一品 難波店", description: "極濃郁拉麵 (若超過11:30將與難波公園互換)", time: "11:00", group: "tpe" },
        { id: "park_spot", type: "shopping", name: "難波公園 (Alpen Outdoors)", description: "購買 HOKA 鞋款 (3F)", tags: ["最高優先", "必買"], time: "12:30", group: "tpe" },
        { type: "shopping", name: "安利美特 大阪日本橋店", description: "小說周邊巡禮", time: "14:30", group: "tpe" },
        { type: "shopping", name: "駿河屋 大阪日本橋店", description: "模型與遊戲尋寶", time: "16:00", group: "tpe" },
        { type: "shopping", name: "Bic Camera 難波店", description: "電器與 3C 用品", time: "17:30", group: "tpe" },
        { type: "spot", name: "道頓堀 - 戎橋", description: "固力果跑跑人打卡", time: "19:00", group: "tpe" },
        { type: "restaurant", name: "炭火燒寢床 心齋橋本店", description: "晚餐：精緻炭火燒肉", tags: ["尚未預約"], time: "20:00", group: "tpe" },
        { type: "hotel", name: "回飯店", description: "休息並整理戰利品", time: "22:00", group: "tpe" }
      ]
    },
    { 
      id: 2, date: "2026-01-17", label: "Day 2", location: "新世界 / 心齋橋",
      schedule: [
        { type: "spot", name: "未定行程", description: "早晨自由活動", time: "09:00", group: "tpe" },
        { type: "spot", name: "等待會合", description: "等待香港組抵達飯店", tags: ["會合"], time: "14:30", group: "tpe" },
        { type: "plane", name: "抵達關西機場", description: "HX614 (14:05) 降落", tags: ["Arrival"], time: "14:05", group: "hkg" },
        { type: "hotel", name: "前往飯店 Check-in", description: "前往 Bande Hotel 放行李/入住", time: "15:15", group: "hkg" },
        { type: "spot", name: "兩組大會合", description: "TPE & HKG 全員集合！", tags: ["重要"], time: "15:30" },
        { type: "spot", name: "大阪通天閣", description: "俯瞰大阪街景", time: "16:00" }, 
        { type: "spot", name: "大阪新世界", description: "體驗昭和氣息炸串", time: "17:00" },
        { type: "shopping", name: "心齋橋筋商店街", description: "藥妝與流行服飾", time: "18:30" },
        { type: "shopping", name: "大國藥妝 心齋橋店", description: "採買藥妝補貨", time: "19:30" },
        { type: "hotel", name: "回飯店", description: "回 Bande Hotel", time: "21:30" }
      ]
    },
    { 
      id: 3, date: "2026-01-18", label: "Day 3", location: "六甲山滑雪",
      schedule: [
        { type: "explore", name: "六甲山滑雪集合", description: "【8:00集合】JR 難波站 OCAT 大廈 1F", tags: ["最高優先", "準時"], time: "08:00" },
        { type: "explore", name: "六甲山雪地樂園", description: "一整天的滑雪與雪地體驗", time: "10:00" },
        { type: "hotel", name: "回飯店", description: "滑雪後放鬆休息", time: "19:00" }
      ]
    },
    { 
      id: 4, date: "2026-01-19", label: "Day 4", location: "市區自駕移防",
      schedule: [
        { type: "explore", name: "租車自駕", description: "領取租賃車輛", time: "10:00" },
        { type: "hotel", name: "Candeo Hotels 入住", description: "15:00 進房，享受露天浴池", time: "15:00" }
      ]
    },
    { 
      id: 5, date: "2026-01-20", label: "Day 5", location: "返程",
      schedule: [
        { type: "hotel", name: "飯店退房", description: "11:00 前完成退房", time: "10:00" },
        { type: "explore", name: "最後採買/午餐", description: "前往機場前最後巡禮", time: "12:00" },
        { type: "plane", name: "旅程結束 (TPE)", description: "IT213 (19:55 起飛)", tags: ["Go Home"], time: "17:00", group: "tpe" },
        { type: "plane", name: "旅程結束 (HKG)", description: "HX613 (20:05 起飛)", tags: ["Go Home"], time: "17:00", group: "hkg" }
      ]
    }
  ]
};

const TypeIcon = ({ type }) => {
  switch (type) {
    case 'hotel': return <Hotel size={14} />;
    case 'restaurant': return <Utensils size={14} />;
    case 'shopping': return <ShoppingBag size={14} />;
    case 'explore': return <Car size={14} />;
    case 'plane': return <Plane size={14} />;
    default: return <Map size={14} />;
  }
};

export default function TravelApp() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [jpyInput, setJpyInput] = useState("");
  const [isMorning, setIsMorning] = useState(true);
  
  const inputRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState('tpe'); 
  const [currentTheme, setCurrentTheme] = useState('blue');
  const theme = THEMES[currentTheme];

  const [weatherState, setWeatherState] = useState({
    current: null, max: null, min: null, loading: true, error: null
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo'
        );
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        setWeatherState({
          current: Math.round(data.current_weather.temperature),
          max: Math.round(data.daily.temperature_2m_max[0]),
          min: Math.round(data.daily.temperature_2m_min[0]),
          loading: false, error: null
        });
      } catch (e) {
        setWeatherState({ current: null, max: null, min: null, loading: false, error: "連線異常" });
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const now = new Date();
    // 判斷是否為上午 (Demo 邏輯)
    if (now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 30)) {
      setIsMorning(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'currency' && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // --- 優化後：處理行程 (Robust Swap Logic) ---
  const processSchedule = (schedule) => {
    // 1. 先過濾群組
    const filteredSchedule = schedule.filter(item => !item.group || item.group === activeGroup);

    // 2. 處理特定行程交換 (使用 ID 識別，安全性提升)
    if (selectedDayIndex === 0 && activeGroup === 'tpe') {
      const noodleIdx = filteredSchedule.findIndex(i => i.id === "noodle_spot");
      const parkIdx = filteredSchedule.findIndex(i => i.id === "park_spot");

      // 只有當兩個 ID 都存在且現在不是早上時，才進行交換
      if (noodleIdx !== -1 && parkIdx !== -1 && !isMorning) {
        // 建立新陣列以避免修改原始資料
        const newSchedule = [...filteredSchedule];
        
        // 交換位置
        [newSchedule[noodleIdx], newSchedule[parkIdx]] = [newSchedule[parkIdx], newSchedule[noodleIdx]];
        
        // 更新註記 (找到換位置後的拉麵行程)
        const newNoodleItem = newSchedule.find(i => i.id === "noodle_spot");
        if(newNoodleItem) {
             // 這裡使用 map 來產生新物件，避免汙染原始 TRAVEL_DATA
             return newSchedule.map(item => {
                 if (item.id === "noodle_spot") {
                     return { ...item, note: "⚠️ 時間已過 11:30，行程已自動與難波公園對調" };
                 }
                 return item;
             });
        }
        return newSchedule;
      }
    }
    return filteredSchedule;
  };

  const currentDay = TRAVEL_DATA.days[selectedDayIndex];
  const displayedSchedule = processSchedule(currentDay.schedule);
  const displayedFlightGroups = TRAVEL_DATA.flightGroups.filter(g => g.id === activeGroup);

  const currentGroupData = TRAVEL_DATA.flightGroups.find(g => g.id === activeGroup);
  const homeCurrency = currentGroupData ? currentGroupData.currency : 'TWD';
  const exchangeRate = currentGroupData ? currentGroupData.rate : 0.205;
  const convertedHome = jpyInput ? (Number(jpyInput) * exchangeRate) : 0;
  const quickAmounts = [1000, 3000, 5000, 10000, 30000];

  const handleClear = (e) => {
    e.preventDefault(); 
    setJpyInput("");
    if (inputRef.current) {
        inputRef.current.focus();
    }
  };

  const NAV_BUTTON_STYLE = `w-8 h-8 ${theme.bg} rounded-xl flex items-center justify-center text-white ${theme.glow} ${theme.bgHover} hover:scale-105 transition-all flex-shrink-0`;

  return (
    <div className={`w-full h-screen bg-black text-zinc-400 font-sans flex justify-center overflow-hidden ${theme.selection}`}>
      
      <div className="w-full max-w-[430px] h-full bg-[#050505] shadow-2xl relative border-x border-zinc-900/50 flex flex-col">
        
        {/* === Header === */}
        <div className="relative h-[15vh] shrink-0 overflow-hidden group">
          <img 
            src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/482205903_938142135190508_1121977906483293071_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CGlaI56rhMsQ7kNvwFqrezy&_nc_oc=AdltyA2jW0CoUD-8GGmG-VkwVMNUN6LB7gqV4Tm5bO5q1npPGp1jChWjNK94fqwYW6o&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=7g5YMdxB-VutVBsbXwOLEQ&oh=00_AfmMbdwlhPkqm1MN-2Dy2IIncpWSD8T0sQHeAfLvJ0wVUA&oe=69514801" 
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 brightness-[0.4]" 
            alt="Osaka" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
          
          <div className="absolute bottom-3 left-6 right-6">
            <div className="flex justify-between items-end">
              <div>
                <p className={`text-[9px] tracking-[0.3em] ${theme.light} font-bold mb-1 uppercase`}>Winter 2026 for Pick</p>
                <h1 className="text-2xl font-light text-white tracking-widest uppercase">{TRAVEL_DATA.title}</h1>
                <p className="text-[10px] text-zinc-400 mt-0.5 tracking-wider">{TRAVEL_DATA.subtitle}</p>
              </div>
              
              <div className="text-right flex flex-col items-end">
                 {weatherState.error ? (
                   <>
                     <AlertCircle size={18} className={`${theme.primary} mb-1`} />
                     <p className={`text-[9px] font-mono ${theme.primary} tracking-wider whitespace-nowrap`}>
                       {weatherState.error}
                     </p>
                   </>
                 ) : weatherState.loading ? (
                    <div className="flex items-center gap-2">
                      <CloudSun size={18} className="text-zinc-400 animate-pulse" />
                      <span className="text-xs font-mono text-zinc-400">...</span>
                    </div>
                 ) : (
                   <>
                     <div className="flex items-center gap-2 text-zinc-400 mb-0.5">
                       <CloudSun size={18} />
                       <span className="text-xl font-light text-white font-mono tracking-tighter">
                         {weatherState.current}°
                       </span>
                     </div>
                     <div className="flex gap-2 text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center">
                          <span className="text-orange-400 mr-0.5">H</span> {weatherState.max}°
                        </span>
                        <span className="flex items-center">
                          <span className="text-blue-400 mr-0.5">L</span> {weatherState.min}°
                        </span>
                     </div>
                   </>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* === Tab 1: 行程表 === */}
        {activeTab === 'itinerary' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-32 animate-in">
            <div className="sticky top-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-zinc-900/50 pt-3 pb-2">
              <div className="px-4 mb-2 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 opacity-60">
                   <Eye size={10} className={theme.light} />
                   <span className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                     View: <span className={theme.light}>{activeGroup.toUpperCase()} Group</span>
                   </span>
                 </div>
              </div>
              <div className="flex overflow-x-auto no-scrollbar px-4 gap-2 pb-1">
                {TRAVEL_DATA.days.map((day, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedDayIndex(idx)} 
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${selectedDayIndex === idx ? 'bg-white text-black border-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'}`}>
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                 <MapPin size={14} className={theme.primary} />
                 <h2 className="text-lg text-white font-light tracking-wide">{currentDay.location}</h2>
                 <span className="text-[10px] text-zinc-600 font-mono ml-auto">{currentDay.date}</span>
              </div>
              
              <div className="relative space-y-6 before:absolute before:left-[6px] before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
                {displayedSchedule.length > 0 ? (
                  displayedSchedule.map((item, idx) => (
                    <div key={idx} className="relative pl-6 group">
                      <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-[#050505] z-10 ${item.tags?.includes('最高優先') ? theme.bg : 'bg-zinc-700'}`} />
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-start items-baseline">
                          {item.tags && (
                            <div className="flex gap-1">
                              {item.tags.map(tag => (
                                <span key={tag} className={`text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded ${theme.light} border border-zinc-800`}>{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-xl p-4 hover:border-zinc-700 transition-all">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                               <TypeIcon type={item.type} />
                               <h3 className="text-sm text-zinc-200 font-bold">{item.name}</h3>
                               {item.tags?.includes('最高優先') && <Flame size={12} className="text-orange-500 fill-orange-500" />}
                            </div>
                            
                            {item.name !== "尚未出發" && (
                              <a 
                                // 修正後的 Maps 連結
                                href={getMapLink(item.name + " 大阪")} 
                                target="_blank" 
                                rel="noreferrer" 
                                className={NAV_BUTTON_STYLE} 
                              >
                                <Navigation size={14}/>
                              </a>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-light">{item.description}</p>
                          {item.note && (
                             <p className="mt-2 text-[10px] text-orange-400 bg-orange-900/20 p-2 rounded border border-orange-900/30">{item.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pl-6 pt-4">
                     <p className="text-xs text-zinc-600 font-mono">No events scheduled.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === Tab 2: 匯率 === */}
        {activeTab === 'currency' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pt-6 px-6 pb-20 animate-in flex flex-col justify-between h-full">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-zinc-100 font-light text-2xl tracking-[0.2em] uppercase">Currency</h2>
                <div className={`px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full flex items-center gap-2`}>
                   <div className={`w-2 h-2 rounded-full ${theme.bg} animate-pulse`}></div>
                   <span className="text-[10px] font-bold text-zinc-300">JPY to {homeCurrency}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <div className="relative">
                  <label className={`text-[10px] font-bold ${theme.primary} uppercase tracking-widest mb-1 block`}>
                    {homeCurrency === 'TWD' ? 'Taiwan Dollar' : 'Hong Kong Dollar'}
                  </label>
                  <div className={`text-6xl font-thin ${theme.light} font-sans`}>
                    {convertedHome === 0 ? "0" : convertedHome.toLocaleString(undefined, { maximumFractionDigits: homeCurrency === 'HKD' ? 1 : 0 })}
                  </div>
                  <span className={`absolute right-0 bottom-4 ${theme.primary} text-sm font-light`}>{homeCurrency}</span>
                </div>

                <div className="flex items-center gap-4 opacity-30">
                  <div className="h-[1px] bg-zinc-700 flex-1"></div>
                  <ArrowUp size={16} />
                  <div className="h-[1px] bg-zinc-700 flex-1"></div>
                </div>

                <div className="group relative">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Japanese Yen (Input)</label>
                  <div className="flex items-center relative">
                    <input 
                      ref={inputRef}
                      type="number" // 保持 number 方便計算
                      inputMode="decimal" // 手機彈出數字鍵盤
                      enterKeyHint="done" // 鍵盤顯示「完成」
                      value={jpyInput} 
                      onChange={e => setJpyInput(e.target.value)} 
                      placeholder="0"
                      // 加入 no-spinner class 隱藏預設箭頭
                      className="w-full bg-transparent text-6xl font-thin text-white outline-none placeholder:text-zinc-800 font-sans pr-12 no-spinner" 
                    />
                    
                    {jpyInput && (
                      <button 
                        onMouseDown={handleClear}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-700 hover:text-white transition-all`}
                        aria-label="Clear"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <span className="absolute right-12 bottom-4 text-zinc-700 text-sm font-light mr-2">JPY</span>
                </div>

              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 opacity-70">
                 <Calculator size={14} className={theme.primary} />
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Quick Price Look</span>
              </div>
              
              <div className="space-y-3">
                {quickAmounts.map(amt => (
                  <div key={amt} className="flex justify-between items-center text-sm border-b border-zinc-800/50 last:border-0 pb-2 last:pb-0">
                    <span className="text-zinc-500 font-mono">¥{amt.toLocaleString()}</span>
                    <span className="text-zinc-300 font-bold font-mono">
                      {(amt * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: homeCurrency === 'HKD' ? 1 : 0 })}
                      <span className="text-[9px] text-zinc-600 ml-1">{homeCurrency}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* === Tab 3: 資訊 & 設定 === */}
        {activeTab === 'info' && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32 animate-in space-y-8">
            {/* 緊急電話 */}
            <section className="space-y-4">
              <h2 className={`text-xs font-black ${theme.primary} tracking-[0.3em] uppercase flex items-center gap-2`}>
                <ShieldAlert size={14} /> Emergency
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {TRAVEL_DATA.emergency.slice(0, 2).map((item, idx) => (
                  <a key={idx} href={`tel:${item.tel}`} className={`${theme.softBg} border ${theme.border} border-opacity-20 p-4 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-transform`}>
                    <span className={theme.primary}>{item.icon}</span>
                    <span className="text-white font-black text-lg">{item.tel}</span>
                    <span className={`text-[9px] ${theme.primary} opacity-70 font-bold uppercase`}>{item.name.split(' ')[0]}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* Group Toggle */}
            <section className="bg-zinc-900/40 border border-zinc-800 p-2 rounded-2xl flex items-center justify-between relative overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bg}`} />
               <div className="flex items-center gap-3 px-3">
                 <Users size={16} className={theme.primary} />
                 <span className="text-xs font-bold text-zinc-300 tracking-wider uppercase">View Group</span>
               </div>
               <div className="flex bg-black/40 rounded-xl p-1 gap-1">
                 {['tpe', 'hkg'].map((group) => (
                   <button
                    key={group}
                    onClick={() => setActiveGroup(group)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1
                      ${activeGroup === group 
                        ? `${theme.bg} text-white` 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                    `}
                   >
                     {activeGroup === group && <Check size={10} strokeWidth={4} />}
                     {group.toUpperCase()}
                   </button>
                 ))}
               </div>
            </section>

            {/* Theme Style */}
            <section className="bg-zinc-900/40 border border-zinc-800 p-2 rounded-2xl flex items-center justify-between relative overflow-hidden">
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${theme.bg}`} />
               <div className="flex items-center gap-3 px-3">
                 <Palette size={16} className={theme.primary} />
                 <span className="text-xs font-bold text-zinc-300 tracking-wider uppercase">Theme Style</span>
               </div>
               <div className="flex bg-black/40 rounded-xl p-1 gap-1">
                 {['rose', 'blue'].map((mode) => (
                   <button
                    key={mode}
                    onClick={() => setCurrentTheme(mode)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1
                      ${currentTheme === mode 
                        ? (mode === 'rose' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'bg-blue-500 text-white shadow-lg shadow-blue-900/50')
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                    `}
                   >
                     {currentTheme === mode && <Check size={10} strokeWidth={4} />}
                     {mode}
                   </button>
                 ))}
               </div>
            </section>

            {/* 辦事處 */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-3">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-zinc-200 font-bold text-sm">台北駐大阪經濟文化辦事處</h3>
                    <p className="text-[10px] text-zinc-400 mt-1">{TRAVEL_DATA.emergency[2].address}</p>
                  </div>
                  <a 
                    href={getMapLink(TRAVEL_DATA.emergency[2].mapQuery)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`${NAV_BUTTON_STYLE} ml-2`} 
                  >
                    <Navigation size={14} />
                  </a>
               </div>
               <a href={`tel:${TRAVEL_DATA.emergency[2].tel}`} className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center text-white`}><Phone size={14} /></div>
                  <div>
                    <p className="text-[11px] text-white font-mono">{TRAVEL_DATA.emergency[2].tel}</p>
                    <p className="text-[9px] text-zinc-400 uppercase">{TRAVEL_DATA.emergency[2].desc}</p>
                  </div>
               </a>
            </div>
            
            {/* Hotels */}
            <section className="space-y-4">
               <h2 className="text-xs font-black text-zinc-400 tracking-[0.3em] uppercase flex items-center gap-2">
                <Hotel size={14} /> Hotels
              </h2>
              {TRAVEL_DATA.accommodations.map((hotel, i) => (
                <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-zinc-100 font-bold text-sm">{hotel.name}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1">{hotel.address}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                        <a 
                          href={getMapLink(hotel.mapQuery)} 
                          target="_blank" 
                          rel="noreferrer" 
                          className={NAV_BUTTON_STYLE}
                        >
                           <MapPin size={14} />
                        </a>
                        <a href={`tel:${hotel.tel}`} className={`w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center ${theme.primary} ${theme.bgHover} hover:text-white transition-colors`}>
                           <Phone size={14} />
                        </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                    <div>
                      <p className="text-[9px] text-zinc-400 uppercase font-black">Check In</p>
                      <p className={`text-[11px] ${theme.light} font-mono mt-0.5`}>{hotel.checkIn}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-400 uppercase font-black">Check Out</p>
                      <p className={`text-[11px] ${theme.light} font-mono mt-0.5`}>{hotel.checkOut}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Flights */}
            <section className="space-y-4">
              <h2 className="text-xs font-black text-zinc-400 tracking-[0.3em] uppercase flex items-center gap-2">
                <Plane size={14} /> Flights
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {displayedFlightGroups.map((group, idx) => (
                  <div key={idx} className="space-y-3 animate-in">
                    <div className="flex items-center gap-2 px-1">
                      <Users size={12} className={theme.primary} />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{group.label}</span>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                       <div>
                         <p className="text-[9px] text-zinc-400 uppercase font-black">Outbound</p>
                         <p className="text-sm font-bold text-white mt-1">{group.outbound.code}</p>
                         <p className="text-[10px] text-zinc-400">{group.outbound.desc}</p>
                       </div>
                       <div className="text-right">
                          <p className={`text-xs font-mono ${theme.light}`}>{group.outbound.time}</p>
                       </div>
                    </div>
                    <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                       <div>
                         <p className="text-[9px] text-zinc-400 uppercase font-black">Inbound</p>
                         <p className="text-sm font-bold text-white mt-1">{group.inbound.code}</p>
                         <p className="text-[10px] text-zinc-400">{group.inbound.desc}</p>
                       </div>
                       <div className="text-right">
                          <p className={`text-xs font-mono ${theme.light}`}>{group.inbound.time}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* === 懸浮導航 === */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-[#111]/90 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-4 flex justify-between items-center z-[100] shadow-2xl shadow-black/50">
          {[
            { id: 'itinerary', icon: Calendar, label: 'TRIP' },
            { id: 'currency', icon: Coins, label: 'EXCH' },
            { id: 'info', icon: Info, label: 'INFO' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === tab.id ? `${theme.primary} scale-105` : 'text-zinc-400 hover:text-zinc-400'}`}>
              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[9px] font-black tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

      </div>
      
      {/* Global Style (新增 no-spinner) */}
      <style>{`
        body { background-color: #000000; margin: 0; padding: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* 移除 Number Input 的箭頭 */
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}