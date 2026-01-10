import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  MapPin, CloudSun, Plane, Hotel, Calendar, Navigation,
  Flame, Info, Phone, ShieldAlert, LifeBuoy, 
  Coins, X, Car, Utensils, ShoppingBag, Map, AlertCircle,
  Palette, Check, Users, Eye, ArrowUp, Ticket, ChevronRight, Sparkles, Tag,
  Share, PlusSquare, ZoomIn, ZoomOut, MoreHorizontal, ArrowDown, MousePointerClick, Calculator
} from 'lucide-react';

// --- 1. 主題配色定義 ---
const THEMES = {
  rose: {
    name: "Rose Noir",
    primary: "text-rose-400",      
    light: "text-rose-300",        
    bg: "bg-rose-600",
    bgGradient: "from-rose-600 to-pink-700",              
    bgHover: "hover:bg-rose-500",  
    border: "border-rose-500/50",      
    softBg: "bg-rose-500/20",     
    glow: "shadow-[0_0_20px_-5px_rgba(225,29,72,0.5)]", 
    selection: "selection:bg-rose-500/30" 
  },
  blue: {
    name: "Classic Blue", 
    primary: "text-blue-400", 
    light: "text-blue-300",
    bg: "bg-blue-600",
    bgGradient: "from-blue-600 to-indigo-600", 
    bgHover: "hover:bg-blue-500",
    border: "border-blue-500/50",
    softBg: "bg-blue-500/20",      
    glow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]", 
    selection: "selection:bg-blue-500/30"
  }
};

// --- 2. 優惠券設定區 ---
const COUPON_LIST = [
  { id: 1, name: "Bic Camera 優惠券", type: "image", image: "https://d1grca2t3zpuug.cloudfront.net/2025/06/biccameracoupontwhk-1787x2527-1750209030.webp" },
  { id: 2, name: "唐吉訶德 優惠券", type: "link", link: "https://japanportal.donki-global.com/coupon/?ptcd=0020000103" },
  { id: 3, name: "大國藥妝 優惠券", type: "image", image: "https://d1grca2t3zpuug.cloudfront.net/2023/08/daikokucoupon-1751874722.webp" }
];

// --- 3. 折扣按鈕設定 (New) ---
const DISCOUNT_OPTIONS = [
  { label: "9折", rate: 0.9, text: "免稅" },
  { label: "85折", rate: 0.85, text: "免稅+5%" },
  { label: "83折", rate: 0.83, text: "免稅+7%" }
];

const getMapLink = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

// --- 旅行資料配置 ---
const TRAVEL_DATA = {
  title: "OSAKA 2026",
  subtitle: "WINTER EXPEDITION",
  duration: "2026/01/16 — 01/20",
  emergency: [
    { name: "警察局 (Police)", tel: "110", icon: <ShieldAlert size={20} /> },
    { name: "救護車 (Ambulance)", tel: "119", icon: <LifeBuoy size={20} /> },
    { name: "台灣駐大阪辦事處", tel: "+81-6-6443-8481", desc: "緊急專線: 090-8794-4568", address: "大阪市北區中之島 2-3-18", mapQuery: "台北駐大阪經濟文化辦事處" }
  ],
  flightGroups: [
    { id: 'tpe', label: "TPE Group", currency: "TWD", rate: 0.215, outbound: { code: "GK50", desc: "TPE(T1) ➔ KIX", time: "02:30 - 06:00" }, inbound: { code: "IT213", desc: "KIX(T1) ➔ TPE", time: "18:55 - 21:15" } },
    { id: 'hkg', label: "HKG Group", currency: "HKD", rate: 0.051, outbound: { code: "HX614", desc: "HKG(T1) ➔ KIX", time: "09:35 - 14:05" }, inbound: { code: "HX613", desc: "KIX(T1) ➔ HKG", time: "20:05 - 23:40" } }
  ],
  accommodations: [
    { name: "Bande Hotel Osaka", tel: "+81-6-6651-1200", checkIn: "01/16 15:00", checkOut: "01/19 10:00", address: "大阪府大阪市住之江區粉浜1-5-1", mapQuery: "Bande Hotel Osaka" },
    { name: "Candeo Hotels Osaka The Tower", tel: "+81-6-6136-3330", checkIn: "01/19 15:00", checkOut: "01/20 11:00", address: "大阪府大阪市北區堂島浜1-1-5", mapQuery: "Candeo Hotels Osaka The Tower" }
  ],
  days: [
    { id: 1, date: "01/16 (週五)", label: "Day 1", location: "難波 / 道頓堀", schedule: [
        { type: "hotel", name: "還沒輪到我們 嗚嗚嗚~~~", description: "明日搭乘HX614前往大阪", group: "hkg" },
        { type: "plane", name: "抵達大阪關西", description: "GK50 抵達, 入境手續", group: "tpe" },
        { type: "hotel", name: "Bande Hotel OSAKA", description: "辦理行李寄放，展開行程", group: "tpe" },
        { type: "spot", name: "木津市場", description: "大阪人的廚房，體驗當地早市與現剖海鮮", group: "tpe" },
        { id: "noodle_spot", type: "restaurant", name: "天下一品 難波ウインズ前店", description: "日本傳奇濃郁系雞白湯拉麵", group: "tpe" },
        { id: "park_spot", type: "shopping", name: "難波公園 (Namba Parks)", description: "都市森林綠建築，Alpen Outdoors 必買 HOKA 鞋款", tags: ["必買", "3F"], group: "tpe" },
        { type: "shopping", name: "Bic Camera 難波店", description: "大型電器賣場，一站式採買家電、藥妝與玩具", group: "tpe" },
        { type: "spot", name: "道頓堀 - 戎橋", description: "大阪代表性地標，與固力果跑跑人看板拍照", group: "tpe" },
        { type: "restaurant", name: "炭火燒寢床 心齋橋本店", description: "精緻炭火燒烤料理晚餐", group: "tpe" },
        { type: "hotel", name: "Bande Hotel", description: "辦理入住手續並稍作休息", group: "tpe" },
        { type: "restaurant", name: "炭火燒鳥 一燃", description: "道地日式燒鳥串燒宵夜", group: "tpe" }
      ]
    },
    { id: 2, date: "01/17 (週六)", label: "Day 2", location: "全員集合 / 新世界", schedule: [
        { type: "explore", name: "自由活動", description: "TPE組上午自由探索周邊街區", group: "tpe" },
        { type: "plane", name: "HKG組 出發", description: "HX614 前往大阪", group: "hkg" },
        { type: "plane", name: "HKG組 抵達", description: "預計抵達關西機場", group: "hkg" },
        { type: "hotel", name: "Bande Hotel", description: "寄放行李與辦理手續", group: "hkg" },
        { type: "spot", name: "全員集合", description: "集合地點為餐廳", tags: ["集合"], time: "16:45" },
        { type: "restaurant", name: "yakinikuen 忍鬨(ニング) 総本店", description: "IG爆紅名店，必吃招牌厚切蔥花牛舌", tags: ["預約"], time: "16:45" },
        { type: "spot", name: "大阪通天閣", description: "新世界地標，俯瞰昭和風情的老街景色"},
        { type: "spot", name: "大阪新世界", description: "感受懷舊昭和氛圍，體驗充滿活力的大阪街頭文化"},
        { type: "shopping", name: "心齋橋", description: "大阪最核心購物商圈，聚集各式服飾品牌與百貨"},
        { type: "shopping", name: "大國藥妝 難波中三町目店", description: "價格極具競爭力的連鎖藥妝採買點"},
        { type: "hotel", name: "回飯店", description: "返回 Bande Hotel Osaka 休息"}
      ]
    },
    { id: 3, date: "01/18 (週日)", label: "Day 3", location: "六甲山 / 神戶", schedule: [
        { type: "explore", name: "JR 難波站 OCAT 大廈 1F", description: "六甲山滑雪集合 集合點", tags: ["準時", "08:00"], time: "08:00" },
        { type: "explore", name: "六甲山雪地樂園", description: "關西近郊著名滑雪場，體驗戲雪與滑雪樂趣", tags: ["Snow"]},
        { type: "shopping", name: "神戶三田 Outlets", description: "西日本最大級 Outlet，美式風格建築與精品折扣"},
        { type: "spot", name: "阿倍野展望台 HARUKAS", description: "日本第一高樓，坐擁 360 度無死角大阪百萬夜景"},
        { type: "restaurant", name: "Cafe Dining Bar Sky Garden", description: "高空景觀餐廳，邊享用晚餐邊欣賞城市光影"},
        { type: "shopping", name: "MEGA唐吉軻德 新世界店", description: "超大型驚安殿堂，種類最齊全的深夜購物天堂"},
        { type: "restaurant", name: "鳥貴族 玉出店", description: "平價均一價串燒，老司機激推必點炸雞皮"},
        { type: "hotel", name: "回飯店", description: "返回飯店休息"}
      ]
    },
    { id: 4, date: "01/19 (週一)", label: "Day 4", location: "京都自駕", schedule: [
        { type: "hotel", name: "Bande Hotel 退房", description: "完成退房手續，準備開啟自駕之旅", time: "09:30" },
        { type: "hotel", name: "Candeo Hotels 寄行李", description: "前往光芒酒店寄放行李", group: "transfer" },
        { type: "explore", name: "租車 / 出發", description: "取車並前往京都，展開古都探索計畫"},
        { type: "spot", name: "北野天滿神社", description: "祈求學業與智慧，可俯瞰京都街道風景", note: "🅿️ 導航：一之鳥居" },
        { type: "spot", name: "花見小路 (南側)", description: "京都著名藝伎區，石板路與紅殼格子建築交織"},
        { type: "spot", name: "一年坂", description: "充滿京都韻味的古老街道與職人小店散策"},
        { type: "spot", name: "伏見稻荷大社", description: "壯觀的千本鳥居，京都最具代表性的神社景觀"},
        { type: "shopping", name: "新京極薬品", description: "京都鬧區傳統藥妝店，採購熱門品項"},
        { type: "explore", name: "大阪還車", description: "結束自駕行程返回大阪市區還車"},
        { type: "hotel", name: "Candeo Hotels Check-in", description: "享受頂樓露天浴池與精緻住宿空間"}
      ]
    },
    { id: 5, date: "01/20 (週二)", label: "Day 5", location: "返程 / 臨空城", schedule: [
        { type: "hotel", name: "飯店退房", description: "悠閒享用早餐後辦理退房手續", time: "11:30" },
        { type: "spot", name: "大鳥大社", description: "千年古社參拜，體驗大鳥造建築之美"},
        { type: "shopping", name: "臨空城 Rinku Outlet", description: "離日最後衝刺，海濱風格的精品折扣中心"},
        { type: "plane", name: "前往關西機場", description: "前往機場航廈辦理報到手續", group: "tpe" },
        { type: "plane", name: "IT213 起飛", description: "搭乘虎航班機，帶著滿滿回憶返家", tags: ["Go Home"], group: "tpe" },
        { type: "plane", name: "前往關西機場", description: "HKG組抵達機場辦理報到", time: "18:00", group: "hkg" },
        { type: "plane", name: "HX613 起飛", description: "搭乘香港航空班機返家", tags: ["Go Home"], group: "hkg" }
      ]
    }
  ]
};

const TypeIcon = ({ type, activeTheme }) => {
  const iconProps = { size: 18, strokeWidth: 1.5 };
  switch (type) {
    case 'hotel': return <Hotel {...iconProps} className="text-indigo-400" />;
    case 'restaurant': return <Utensils {...iconProps} className="text-orange-400" />;
    case 'shopping': return <ShoppingBag {...iconProps} className="text-pink-400" />;
    case 'explore': return <Car {...iconProps} className="text-emerald-400" />;
    case 'plane': return <Plane {...iconProps} className="text-sky-400" />;
    case 'spot': return <MapPin {...iconProps} className={activeTheme.primary} />;
    default: return <Map {...iconProps} className="text-zinc-500" />;
  }
};

export default function TravelApp() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [jpyInput, setJpyInput] = useState("");
  const [isMorning, setIsMorning] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const inputRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState('tpe'); 
  const [currentTheme, setCurrentTheme] = useState('blue');
  const [isIOSBrowser, setIsIOSBrowser] = useState(false);
  const [checked, setChecked] = useState(false);
  
  // New State for Discount
  const [discountRate, setDiscountRate] = useState(1); // 1 = no discount

  const theme = THEMES[currentTheme];

  const [weatherState, setWeatherState] = useState({
    current: null, max: null, min: null, loading: true, error: null
  });

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
    const isSafari = isIOS && /Safari/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
    if (isSafari && !isStandalone) setIsIOSBrowser(true);
    setChecked(true);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=34.6937&longitude=135.5023&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo');
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
    if (now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 30)) setIsMorning(false);
  }, []);

  // 優化切換：延遲聚焦避開動畫卡頓
  useEffect(() => {
    if (activeTab === 'currency' && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const displayedSchedule = useMemo(() => {
    const currentDay = TRAVEL_DATA.days[selectedDayIndex];
    let schedule = currentDay.schedule.filter(item => !item.group || item.group === activeGroup);
    
    if (selectedDayIndex === 0 && activeGroup === 'tpe' && !isMorning) {
      const noodleIdx = schedule.findIndex(i => i.id === "noodle_spot");
      const parkIdx = schedule.findIndex(i => i.id === "park_spot");
      if (noodleIdx !== -1 && parkIdx !== -1) {
        const newSchedule = [...schedule];
        [newSchedule[noodleIdx], newSchedule[parkIdx]] = [newSchedule[parkIdx], newSchedule[noodleIdx]];
        return newSchedule.map(item => item.id === "noodle_spot" ? { ...item, note: "⚠️ 時間已過 11:30，行程已自動優化" } : item);
      }
    }
    return schedule;
  }, [selectedDayIndex, activeGroup, isMorning]);

  const currentGroupData = TRAVEL_DATA.flightGroups.find(g => g.id === activeGroup);
  const displayedFlightGroups = TRAVEL_DATA.flightGroups.filter(g => g.id === activeGroup); // 補回航班資料
  const homeCurrency = currentGroupData?.currency || 'TWD';
  const exchangeRate = currentGroupData?.rate || 0.215;
  
  // *** 更新計算邏輯：加入 DiscountRate ***
  const convertedHome = jpyInput ? (Number(jpyInput) * discountRate * exchangeRate) : 0;
  
  // *** 取得目前折扣的顯示文字 ***
  const currentDiscountInfo = DISCOUNT_OPTIONS.find(d => d.rate === discountRate);

  const handleClear = (e) => {
    e.preventDefault();
    setJpyInput("");
    if (inputRef.current) inputRef.current.focus();
  };

  const toggleDiscount = (rate) => {
    if (discountRate === rate) {
      setDiscountRate(1); // 取消
    } else {
      setDiscountRate(rate); // 套用
    }
  };

  const GLASS_PANEL = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";
  const NAV_BUTTON_STYLE = `w-10 h-10 ${theme.softBg} rounded-full flex items-center justify-center ${theme.primary} ${theme.bgHover} hover:text-white transition-all flex-shrink-0 border border-white/5`;

  if (!checked) return null;
  if (isIOSBrowser) {
      return (
          <div className="w-full h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
             <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
             
             {/* --- 指向瀏覽器三個點的指示箭頭 (固定在右下角) --- */}
             <div className="absolute bottom-0 right-1 flex flex-col items-center animate-bounce z-50 pointer-events-none">
                <span className="text-[20px] font-bold text-blue-400 mb-1 tracking-widest uppercase">幹!按這裡!</span>
                <ArrowDown size={32} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" strokeWidth={3} />
             </div>

             <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-sm">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl flex items-center justify-center border border-white/10">
                    <Plane size={40} className="text-white" />
                 </div>
                 <div>
                     <h1 className="text-2xl font-bold tracking-widest uppercase mb-2">安裝 App</h1>
                     <p className="text-zinc-400 text-sm">為了獲得最佳體驗，你給我他媽安裝應用程式到主螢幕</p>
                  </div>

                 <div className="bg-white/5 border border-white/10 rounded-3xl p-6 w-full space-y-4 backdrop-blur-md text-left">
                    
                    {/* Step 1: 按下右下角的三個點 */}
                    <div className="flex items-center gap-4">
                         <MoreHorizontal className="text-blue-400 shrink-0" size={28} />
                         <div>
                             <p className="text-xs text-zinc-500 font-bold uppercase">步驟 1</p>
                             <p className="text-sm font-medium">點擊右下角的 <span className="text-blue-400 font-bold">選單 (三個點)</span></p>
                         </div>
                     </div>
                     
                     <div className="w-full h-[1px] bg-white/5"></div>
                     
                      {/* Step 2: 選擇分享 */}
                     <div className="flex items-center gap-4">
                         <Share className="text-blue-400 shrink-0" size={28} />
                         <div>
                             <p className="text-xs text-zinc-500 font-bold uppercase">步驟 2</p>
                             <p className="text-sm font-medium">選擇並按下 <span className="text-white font-bold">分享按鈕</span></p>
                         </div>
                     </div>

                     <div className="w-full h-[1px] bg-white/5"></div>

                     {/* Step 2: 選擇加入主畫面 */}
                     <div className="flex items-center gap-4">
                         <PlusSquare className="text-blue-400 shrink-0" size={28} />
                         <div>
                             <p className="text-xs text-zinc-500 font-bold uppercase">步驟 3</p>
                             <p className="text-sm font-medium">往下滑並選擇 <span className="text-white font-bold">加入主畫面</span></p>
                         </div>
                     </div>

                     <div className="w-full h-[1px] bg-white/5"></div>

                     {/* Step 3: 按下加入 (新增的步驟) */}
                     <div className="flex items-center gap-4">
                         <div className="w-7 h-6 flex items-center justify-center font-bold text-blue-400 text-sm">加入</div>
                         <div>
                             <p className="text-xs text-zinc-500 font-bold uppercase">步驟 4</p>
                             <p className="text-sm font-medium">點擊右上角的 <span className="text-blue-400 font-bold">加入</span></p>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      );
  }

  return (
    <div className={`w-full h-[100dvh] bg-black text-zinc-300 font-sans flex justify-center overflow-hidden ${theme.selection}`}>
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute bottom-[10%] w-[500px] h-[500px] ${theme.bg} rounded-full blur-[120px] opacity-10 animate-pulse`}></div>
      </div>

      <div className="w-full max-w-[430px] h-full relative z-10 flex flex-col bg-gradient-to-b from-black/50 to-black/90 shadow-2xl border-x border-white/5">
        
        {/* === Header === */}
        <div className="relative h-[16vh] shrink-0 overflow-hidden group">
          <img src="https://scontent-tpe1-1.xx.fbcdn.net/v/t39.30808-6/482205903_938142135190508_1121977906483293071_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HgFzLzeTMlIQ7kNvwHMkpxi&_nc_oc=Adn_gO39-pv6AuApt7fjq2hipoMHbHe26R1tNWRxMvvZ41F_Oz4IBd7X671IOl1u_Eg&_nc_zt=23&_nc_ht=scontent-tpe1-1.xx&_nc_gid=Fk2t2Xxz12cNLVq5N5WZhA&oh=00_AfmGs6kPDZHO_8FHi9LQUa9KiRGfw8V7Fjqv4-Z0xCzuVg&oe=6953B2C1" className="w-full h-full object-cover opacity-60 transition-transform duration-[2s]" alt="Osaka" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050505]" />
          <div className="absolute bottom-2 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-[9px] tracking-[0.2em] px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white/80 uppercase">Winter 2026</span>
                <h1 className="text-3xl font-light text-white tracking-[0.2em] uppercase">{TRAVEL_DATA.title}</h1>
                <p className="text-[10px] text-zinc-400 mt-1 tracking-widest uppercase flex items-center gap-1">{TRAVEL_DATA.subtitle} <ChevronRight size={10} /></p>
              </div>
              <div className="text-right flex flex-col items-end">
                {weatherState.loading ? <CloudSun size={24} className="text-zinc-500 animate-pulse" /> : (
                  <>
                    <span className="text-4xl font-thin text-white leading-none tracking-tighter">{weatherState.current}°</span>
                    <div className="flex gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                      <span className="text-orange-400 font-bold">H:{weatherState.max}°</span>
                      <span className="text-sky-400 font-bold">L:{weatherState.min}°</span>
                    </div>
                  </>
                )}
              </div>
          </div>
        </div>

        {/* === Main Content Layers (優化卡頓關鍵) === */}
        <div className="flex-1 relative overflow-hidden">
          
          {/* TAB: ITINERARY (使用 Visibility 避免銷毀 DOM) */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'itinerary' ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}>
            <div className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 pt-4 pb-4">
               <div className="px-5 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.bg} ${theme.glow}`}></div>
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Group: <span className="text-white">{activeGroup}</span></span>
                  </div>
                  <div className="text-[10px] text-zinc-600 font-mono">{selectedDayIndex + 1} / {TRAVEL_DATA.days.length}</div>
               </div>
               <div className="flex overflow-x-auto no-scrollbar px-5 gap-3 pb-1 snap-x">
                 {TRAVEL_DATA.days.map((day, idx) => (
                   <button key={idx} onClick={() => setSelectedDayIndex(idx)} className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${selectedDayIndex === idx ? 'bg-white text-black border-white scale-105' : 'bg-zinc-900/40 border-zinc-800 text-zinc-500'}`}>{day.label}</button>
                 ))}
               </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-36">
              <div className="flex items-end justify-between mb-8 ml-1">
                 <div>
                    <span className={`text-[10px] font-black ${theme.primary} uppercase tracking-widest block mb-1`}>Current Location</span>
                    <h2 className="text-2xl text-white font-light tracking-wider">{TRAVEL_DATA.days[selectedDayIndex].location}</h2>
                 </div>
                 <span className="text-xs text-zinc-500 font-mono bg-zinc-900/50 px-2 py-1 rounded border border-white/5">{TRAVEL_DATA.days[selectedDayIndex].date}</span>
              </div>
              <div className="relative space-y-8 pl-2">
                <div className="absolute left-[7px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-900/0"></div>
                {displayedSchedule.map((item, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className={`absolute left-0 top-3 w-[15px] h-[15px] rounded-full border-[3px] border-[#050505] z-10 transition-all ${item.tags?.includes('最高優先') ? 'bg-gradient-to-tr from-orange-500 to-yellow-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]' : 'bg-zinc-800 group-hover:bg-zinc-600'}`}></div>
                    <div className={`${GLASS_PANEL} p-5 group-hover:border-white/20 transition-colors relative overflow-hidden`}>
                      <div className="flex justify-between items-start mb-3 relative z-10">
                        <div className="flex-1">
                           <div className="flex items-center flex-wrap gap-2 mb-1.5">
                             {item.time && <span className={`text-sm font-bold font-mono ${theme.primary}`}>{item.time}</span>}
                             {item.tags?.map(tag => <span key={tag} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] border border-white/10 ${theme.softBg} ${theme.light} uppercase`}>{tag}</span>)}
                           </div>
                           <h3 className="text-base text-white font-bold leading-tight">{item.name}</h3>
                        </div>
                        <a href={getMapLink(item.note?.includes("導航") ? item.note.split("：")[1] : item.mapQuery || item.name + " 大阪")} target="_blank" rel="noreferrer" className={NAV_BUTTON_STYLE}><Navigation size={16}/></a>
                      </div>
                      <div className="flex gap-4 items-start relative z-10">
                        <div className="mt-0.5 shrink-0 opacity-80"><TypeIcon type={item.type} activeTheme={theme} /></div>
                        <p className="text-sm text-zinc-400 font-light leading-relaxed">{item.description}</p>
                      </div>
                      {item.note && (
                        <div className="mt-3 text-[11px] text-zinc-300 bg-black/30 px-3 py-2 rounded-lg border border-white/5 font-mono flex items-start gap-2">
                          <Info size={12} className={`shrink-0 mt-[2px] ${theme.primary}`}/><span>{item.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TAB: CURRENCY */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'currency' ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}>
             <div className="flex-1 overflow-y-auto no-scrollbar pt-8 px-6 pb-36 bg-black">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-extralight text-3xl tracking-[0.2em] uppercase">Exchange</h2>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${theme.bg} animate-pulse`}></div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live Rate</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    {/* *** UI變更: 增加折扣提示文字 *** */}
                    <div className="flex items-center gap-2 mb-2">
                      <label className={`text-[10px] font-bold ${theme.primary} uppercase tracking-[0.3em]`}>Converted ({homeCurrency})</label>
                      {currentDiscountInfo && (
                        <span className={`text-xs font-bold ${theme.bg} text-white px-2 py-0.5 rounded shadow-md animate-in`}>
                          {currentDiscountInfo.text}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-7xl font-thin text-white tracking-tighter">{convertedHome === 0 ? "0" : convertedHome.toLocaleString(undefined, { maximumFractionDigits: homeCurrency === 'HKD' ? 1 : 0 })}</div>
                      <span className="text-xl font-light text-zinc-600">{homeCurrency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 opacity-20 my-2"><div className="h-[1px] bg-white flex-1"></div><ArrowUp size={16} /><div className="h-[1px] bg-white flex-1"></div></div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-2 block">Japanese Yen</label>
                    <div className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 focus-within:border-white/30 transition-all">
                      <span className="text-xl font-light text-zinc-500 mr-4">¥</span>
                      <input ref={inputRef} type="number" inputMode="decimal" value={jpyInput} onChange={e => setJpyInput(e.target.value)} placeholder="0" className="w-full bg-transparent text-3xl font-light text-white outline-none placeholder:text-zinc-800" />
                      {jpyInput && <button onMouseDown={handleClear} className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center"><X size={14} /></button>}
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                     {/* *** New Discount Buttons Section *** */}
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Quick Discount</span>
                     <div className="grid grid-cols-3 gap-3 mb-6">
                        {DISCOUNT_OPTIONS.map((option) => (
                           <button 
                             key={option.rate} 
                             onClick={() => toggleDiscount(option.rate)}
                             className={`py-3 rounded-xl text-sm font-bold border transition-all ${discountRate === option.rate ? `${theme.bg} border-${theme.name}-500 text-white shadow-lg` : 'bg-zinc-900 border-white/5 text-zinc-500 hover:bg-zinc-800'}`}
                           >
                             {option.label}
                           </button>
                        ))}
                     </div>
                     
                     <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Exclusive Coupons</span>
                     {COUPON_LIST.map((coupon) => (
                        <button key={coupon.id} onClick={() => coupon.type === 'link' ? window.open(coupon.link, '_blank') : setActiveCoupon(coupon)} className="group relative w-full py-4 px-6 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full ${theme.softBg} flex items-center justify-center`}><Ticket size={18} className={theme.primary} /></div>
                              <div className="text-left"><span className="block text-sm font-bold text-white">{coupon.name}</span><span className="block text-[10px] text-zinc-500 uppercase">{coupon.type === 'link' ? 'Website' : 'Show QR'}</span></div>
                           </div>
                           <ChevronRight size={16} className="text-zinc-600" />
                        </button>
                     ))}
                  </div>
                </div>
             </div>
          </div>

          {/* TAB: INFO (已補回航班資訊) */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${activeTab === 'info' ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 translate-y-4 pointer-events-none'}`}>
             <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-36 space-y-8 bg-black">
                <section className="space-y-4">
                  <h2 className={`text-[10px] font-black ${theme.primary} tracking-[0.3em] uppercase flex items-center gap-2`}><ShieldAlert size={14} /> Emergency</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {TRAVEL_DATA.emergency.slice(0, 2).map((item, idx) => (
                      <a key={idx} href={`tel:${item.tel}`} className={`${GLASS_PANEL} p-5 flex flex-col items-center gap-2 active:scale-95 transition-all`}>
                        <span className={theme.primary}>{item.icon}</span><span className="text-white font-thin text-3xl">{item.tel}</span><span className="text-[9px] text-zinc-400 font-bold uppercase">{item.name.split(' ')[0]}</span>
                      </a>
                    ))}
                  </div>
                </section>
                <section className={`${GLASS_PANEL} p-1 flex items-center`}>
                   <div className="grid grid-cols-2 w-full gap-1">
                     {['tpe', 'hkg'].map((group) => (
                       <button key={group} onClick={() => setActiveGroup(group)} className={`py-2.5 rounded-2xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${activeGroup === group ? `${theme.bg} text-white` : 'text-zinc-500'}`}>
                         {activeGroup === group && <Check size={12} />}{group} Group
                       </button>
                     ))}
                   </div>
                </section>
                <section className={`${GLASS_PANEL} p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3"><Palette size={18} className={theme.primary} /><span className="text-xs font-bold text-zinc-300 uppercase">App Theme</span></div>
                    <div className="flex gap-2">
                      {Object.keys(THEMES).map(key => (
                        <button key={key} onClick={() => setCurrentTheme(key)} className={`w-8 h-8 rounded-full border-2 ${currentTheme === key ? 'border-white scale-110' : 'border-transparent'}`} style={{backgroundColor: key === 'rose' ? '#e11d48' : '#3b82f6'}} />
                      ))}
                    </div>
                </section>
                <div className={`${GLASS_PANEL} p-6 space-y-4`}>
                   <div className="flex justify-between items-start">
                     <div><h3 className="text-zinc-100 font-bold text-base">台北駐大阪辦事處</h3><p className="text-[10px] text-zinc-400">{TRAVEL_DATA.emergency[2].address}</p></div>
                     <a href={getMapLink(TRAVEL_DATA.emergency[2].mapQuery)} target="_blank" rel="noreferrer" className={NAV_BUTTON_STYLE}><Navigation size={16} /></a>
                   </div>
                   <a href={`tel:${TRAVEL_DATA.emergency[2].tel}`} className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                     <div className={`w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white`}><Phone size={18} /></div>
                     <div><p className="text-sm text-white font-mono">{TRAVEL_DATA.emergency[2].tel}</p><p className="text-[10px] text-zinc-500 uppercase">{TRAVEL_DATA.emergency[2].desc}</p></div>
                   </a>
                </div>
                <section className="space-y-4">
                  <h2 className="text-[10px] font-black text-zinc-500 uppercase flex items-center gap-2"><Hotel size={14} /> Accommodation</h2>
                  {TRAVEL_DATA.accommodations.map((hotel, i) => (
                    <div key={i} className={`${GLASS_PANEL} p-6 space-y-5`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1"><h3 className="text-zinc-100 font-bold text-base">{hotel.name}</h3><p className="text-[10px] text-zinc-500">{hotel.address}</p></div>
                        <a href={getMapLink(hotel.mapQuery)} target="_blank" rel="noreferrer" className={NAV_BUTTON_STYLE}><MapPin size={16} /></a>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div><p className="text-[9px] text-zinc-500 uppercase font-black">Check In</p><p className={`text-sm ${theme.light} font-mono`}>{hotel.checkIn}</p></div>
                        <div className="text-right"><p className="text-[9px] text-zinc-500 uppercase font-black">Check Out</p><p className={`text-sm ${theme.light} font-mono`}>{hotel.checkOut}</p></div>
                      </div>
                    </div>
                  ))}
                </section>
                {/* 補回的航班資訊區塊 */}
                <section className="space-y-4">
                  <h2 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase flex items-center gap-2">
                    <Plane size={14} /> Flights Info
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {displayedFlightGroups.map((group, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Tag size={12} className={theme.primary} />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">{group.label}</span>
                        </div>
                        {/* Outbound */}
                        <div className={`${GLASS_PANEL} p-4 flex justify-between items-center group hover:bg-white/10 transition-colors`}>
                           <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                <Plane size={14} className="transform rotate-45" />
                             </div>
                             <div>
                               <p className="text-base font-bold text-white">{group.outbound.code}</p>
                               <p className="text-[10px] text-zinc-500">{group.outbound.desc}</p>
                             </div>
                           </div>
                           <div className="text-right">
                              <p className={`text-xs font-mono ${theme.light}`}>{group.outbound.time}</p>
                           </div>
                        </div>
                        {/* Inbound */}
                         <div className={`${GLASS_PANEL} p-4 flex justify-between items-center group hover:bg-white/10 transition-colors`}>
                           <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                <Plane size={14} style={{ transform: 'rotate(-135deg)' }} />
                             </div>
                             <div>
                               <p className="text-base font-bold text-white">{group.inbound.code}</p>
                               <p className="text-[10px] text-zinc-500">{group.inbound.desc}</p>
                             </div>
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
          </div>
        </div>

        {/* === Floating Navigation === */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-auto z-[100]">
            <nav className="bg-[#111]/80 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-2 flex items-center gap-2 shadow-2xl">
            {[
                { id: 'itinerary', icon: Calendar, label: 'TRIP' },
                { id: 'currency', icon: Coins, label: 'EXCH' },
                { id: 'info', icon: Info, label: 'INFO' }
            ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative w-24 h-12 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
                        {isActive && <span className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-8 ${theme.bg} blur-xl opacity-40`}></span>}
                        <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                        <span className="text-[8px] font-black tracking-widest relative z-10">{tab.label}</span>
                    </button>
                )
            })}
            </nav>
        </div>

        {/* === Coupon Modal === */}
        {activeCoupon && (
          <div className="absolute inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => { setActiveCoupon(null); setIsZoomed(false); }}>
             <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#151515] flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <div className={`relative flex-1 bg-white ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}>
                    <img src={activeCoupon.image} alt={activeCoupon.name} onClick={() => setIsZoomed(!isZoomed)} className={`object-contain transition-all origin-top-left ${isZoomed ? 'w-[200%] max-w-none' : 'w-full h-full'}`} />
                    {!isZoomed && <div className="absolute top-4 right-4 bg-black/50 px-3 py-1.5 rounded-full flex items-center gap-2 text-white/90"><ZoomIn size={14} /><span className="text-[10px] font-bold uppercase">Tap to Zoom</span></div>}
                </div>
                <div className="p-6 text-center bg-[#151515] border-t border-white/5">
                   <h3 className="text-lg font-bold text-white mb-1">{activeCoupon.name}</h3>
                   <button onClick={() => { setActiveCoupon(null); setIsZoomed(false); }} className="mt-6 w-full py-3 rounded-xl bg-zinc-800 text-white text-xs font-bold uppercase">Close</button>
                </div>
             </div>
          </div>
        )}
      </div>
      
      <style>{`
        body { background-color: #000000; margin: 0; padding: 0; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; will-change: transform, opacity; }
      `}</style>
    </div>
  );
}