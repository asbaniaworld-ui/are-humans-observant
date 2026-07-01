import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Keyboard, CornerDownLeft, Eye, FileText, Settings, User, ArrowRight, Compass } from 'lucide-react';
import EvelynMercerPortrait from './characters/EvelynMercerPortrait';
import { getIntroObjectImage } from '../content/archiveImages';
import { GAME_CURSOR } from '../utils/gameCursor';

interface PlayableIntroProps {
  onComplete: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  audio: any;
}

interface InteractiveItem {
  id: string;
  name: string;
  chineseName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string[];
}

export default function PlayableIntro({ onComplete, isMuted, setIsMuted, audio }: PlayableIntroProps) {
  // Movement & depth physics (2D coordinates)
  const [playerX, setPlayerX] = useState<number>(120);
  const [playerY, setPlayerY] = useState<number>(240);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkCycle, setWalkCycle] = useState<number>(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  
  // Interaction & UI state
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [activeInspection, setActiveInspection] = useState<InteractiveItem | null>(null);
  const [inspectionTextIndex, setInspectionTextIndex] = useState<number>(0);
  const [typedInspectionText, setTypedInspectionText] = useState<string>("");
  const [surveyAnswers, setSurveyAnswers] = useState<number[]>([]);
  const [guidedStep, setGuidedStep] = useState<number>(0);
  const [guidedWarning, setGuidedWarning] = useState<string | null>(null);
  
  // Interview/Dialogue states
  const [interviewStep, setInterviewStep] = useState<number>(-1); // -1: Not started, 0,1,2: Questions, 3: Completed
  const [typedDialogue, setTypedDialogue] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // General state
  const [gameState, setGameState] = useState<'walking' | 'transition_screen'>('walking');
  const [fadeOpacity, setFadeOpacity] = useState<number>(0);

  // Keyboard input state
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  // List of interactive objects placed inside the lobby
  const items: InteractiveItem[] = [
    {
      id: "hanging_blueprint",
      name: "Engineering Blueprint",
      chineseName: "挂墙精密工程图",
      x: 100,
      y: 195,
      width: 80,
      height: 60,
      description: [
        "一幅泛黄微卷的工程蓝图，以精细笔触勾勒出「神经突触联合义肢手」的同轴构造——人类手掌与控制论机械腕在指尖以电火花耦合。",
        "图板下角贴着一行手写红色钢笔字：‘警告：测试主体 #402 对微观非对称异常的突触感知力极强，已逼近该校准镜片的接收极限。必要时增加衰减器。’"
      ]
    },
    {
      id: "archive_cabinet",
      name: "Classified Filing Cabinet",
      chineseName: "极密钢制档案柜",
      x: 240,
      y: 200,
      width: 70,
      height: 90,
      description: [
        "重型军用铸铁档案柜，抽屉正面印着生锈的‘认知校准处 1960-1968 分类案卷’金属浮雕。",
        "柜缝微开，内部纸页夹杂着发黄的相片。多份个人案卷上覆盖着黑色的墨水涂鸦。偶尔能辨认出‘皮层折射率超标’、‘突触断裂’和‘重组替代周期已到’等字样。"
      ]
    },
    {
      id: "observation_window",
      name: "Frosted Observation Window",
      chineseName: "防辐射深色观察窗",
      x: 400,
      y: 185,
      width: 140,
      height: 50,
      description: [
        "一扇嵌在钢板墙壁中的超厚铅玻璃观察窗。窗户那端笼罩在静谧的绿色荧光幕后。",
        "隐隐约约地，你可以看见后方的计算机主机房内，有几台巨大的带盘机舱正在徐徐转动，成百上千支真空管发出一闪一闪的微光。空气中仿佛回荡着低沉的电磁蜂鸣。"
      ]
    },
    {
      id: "control_console",
      name: "Mainframe Calibration Panel",
      chineseName: "M-19-68 差速校准台",
      x: 550,
      y: 210,
      width: 80,
      height: 80,
      description: [
        "一台由大量黄铜压铸和黑色电木旋钮组成的庞大测定工作台。铜壳真空式压力表指针在稳定摆动。",
        "主屏幕闪烁着浅绿色的同步正弦波纹，标牌蚀刻：‘一旦两侧视线通路实现完美聚合，系统将启动终极标本隔离通道。’"
      ]
    },
    {
      id: "evelyn_mercer",
      name: "Dr. Evelyn Mercer",
      chineseName: "伊芙琳·默瑟 博士 (Dr. Evelyn Mercer)",
      x: 720,
      y: 230,
      width: 60,
      height: 100,
      description: [] // Handled via special dialogue questionnaire flow
    }
  ];

  // Interview Question definitions
  const interviewQuestions = [
    {
      question: "“我是伊芙琳·默瑟博士。欢迎来到控制论认知校准部的核心档案区。在引导你进入一号标本测试室前，我们需要建立你的认知预设档案。”\n\n问卷 Q1：你是否清楚并完全理解你所参与的 [认知校准协议 #402-B] 的真实意图？",
      options: [
        "是的，我的视神经与突触调节完全处于最佳观察状态。",
        "我只是遵照第402号行政法令前往此地，配合执行测试。",
        "我想知道为什么我的日常视线流动会被如此精确地记录。"
      ]
    },
    {
      question: "“很好，测定电极运转平稳。现在进行次级认知倾向度量。\n\n问卷 Q2：在观察极其复杂的对称机械工程蓝图或高密度结构时，你的视觉焦点通常最先滞留在何处？”",
      options: [
        "直觉性地追踪大尺度的几何对称中轴与力学平衡点。",
        "敏锐搜索边缘线段的不连续性、铆钉漏装或微小碎斑。",
        "观察图像背后若隐若现的留白底纹与电磁噪波分布。"
      ]
    },
    {
      question: "“最后一个必填项。我们在你的神经通路上发现了些许微弱的非对称折射波。\n\n问卷 Q3：如果在漫长的观察与解构过程中，你面临无论如何都无法定位的、极其隐晦的异常，你会做出何种举措？”",
      options: [
        "绝不放弃。盯紧图像并调集全部专注力，直到视网膜产生噪点。",
        "将视线平移，在左右两块图板间进行机械式的高频扫视与差分比对。",
        "服从无意识。让肉体本能引导指尖点击，相信瞬间的认知波长。"
      ]
    }
  ];

  // Dialogue & Inspection Typewriters
  useEffect(() => {
    if (activeInspection) {
      let text = activeInspection.description[inspectionTextIndex] || "";
      let index = 0;
      setTypedInspectionText("");
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedInspectionText(text.substring(0, index + 1));
          if (!isMuted && Math.random() > 0.45) {
            audio.playTypewriter();
          }
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [activeInspection, inspectionTextIndex]);

  // Dialogue Interview Typewriter
  useEffect(() => {
    if (interviewStep >= 0 && interviewStep < 3) {
      let text = interviewQuestions[interviewStep].question;
      let index = 0;
      setTypedDialogue("");
      setSelectedOption(null);
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedDialogue(text.substring(0, index + 1));
          if (!isMuted && Math.random() > 0.45) {
            audio.playTypewriter();
          }
          index++;
        } else {
          clearInterval(interval);
        }
      }, 16);
      return () => clearInterval(interval);
    } else if (interviewStep === 3) {
      // Completed message
      let text = "“（沙沙的书写声...）太棒了。你的主观认知偏离率已经录入。脑波侧写数据表明你的突触反馈效率堪称完美，这并非普通的偶然。”\n\n【认知特性侧写已安全建立 // COGNITIVE PROFILE RECORDED】\n\n【正在加载 Experiment 01: 神经突触联合义肢手 — 请比对左右图板，从机械腕螺丝开始校准。】";
      let index = 0;
      setTypedDialogue("");
      
      const interval = setInterval(() => {
        if (index < text.length) {
          setTypedDialogue(text.substring(0, index + 1));
          if (!isMuted && Math.random() > 0.45) {
            audio.playTypewriter();
          }
          index++;
        } else {
          clearInterval(interval);
          // Wait 2 seconds and switch to transition screen
          setTimeout(() => {
            setGameState('transition_screen');
          }, 2500);
        }
      }, 16);
      return () => clearInterval(interval);
    }
  }, [interviewStep]);

  // Handle Keyboard walking loops (WASD & Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'transition_screen' || activeInspection || interviewStep >= 0) return;

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
        keysPressed.current[key] = true;
        setHasMoved(true);
      }

      // Quick interact key (E or Space)
      if (key === 'e' || key === ' ') {
        e.preventDefault();
        attemptProximityInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key)) {
        keysPressed.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, activeInspection, interviewStep]);

  // Main 2D physics update loop
  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      if (gameState === 'walking' && !activeInspection && interviewStep === -1) {
        let isMoving = false;
        let dx = 0;
        let dy = 0;

        // X movement
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
          dx = 2.4;
          setDirection('right');
          isMoving = true;
        } else if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
          dx = -2.4;
          setDirection('left');
          isMoving = true;
        }

        // Y movement (vertical depth walk)
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
          dy = -1.5;
          isMoving = true;
        } else if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
          dy = 1.5;
          isMoving = true;
        }

        if (isMoving) {
          setPlayerX((prevX) => Math.max(-15, Math.min(950, prevX + dx)));
          setPlayerY((prevY) => Math.max(145, Math.min(315, prevY + dy)));
          setIsWalking(true);
          setWalkCycle((prev) => prev + 0.15);
          
          if (!isMuted && Math.floor(walkCycle) % 5 === 0) {
            audio.playTick();
          }
        } else {
          setIsWalking(false);
        }
      } else {
        setIsWalking(false);
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState, walkCycle, activeInspection, interviewStep, isMuted]);

  // Transition screen fade transition
  useEffect(() => {
    if (gameState === 'transition_screen') {
      setFadeOpacity(1);
      const timer = setTimeout(() => {
        onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Proximity checker helper
  const getProximityItem = () => {
    let closestItem: InteractiveItem | null = null;
    let minDistance = 85; // Active threshold

    items.forEach((item) => {
      const dist = Math.hypot(playerX - item.x, playerY - item.y);
      if (dist < minDistance) {
        minDistance = dist;
        closestItem = item;
      }
    });

    return closestItem;
  };

  const nearbyItem = getProximityItem();

  // Centralized sequential item interaction and gating
  const handleItemClick = (itemIndex: number) => {
    if (guidedStep < itemIndex) {
      audio.playErrorBuzz?.() || audio.playClick();
      const nextRequiredName = 
        guidedStep === 0 ? "挂墙精密工程图" :
        guidedStep === 1 ? "极密钢制档案柜" :
        guidedStep === 2 ? "防辐射深色观察窗" :
        guidedStep === 3 ? "M-19-68 差速校准台" : "伊芙琳·默瑟 博士";
      setGuidedWarning(`【校准权限限制 / ORDER BLOCKED】请先走近并完成【${nextRequiredName}】的观察核对！`);
      setTimeout(() => setGuidedWarning(null), 3500);
      return;
    }
    
    if (itemIndex === 4) {
      audio.playClick();
      setInterviewStep(0);
      if (guidedStep === 4) {
        setGuidedStep(5);
      }
    } else {
      audio.playClick();
      setActiveInspection(items[itemIndex]);
      setInspectionTextIndex(0);
      if (guidedStep === itemIndex) {
        setGuidedStep(prev => prev + 1);
      }
    }
  };

  // Handle interaction trigger via Space/E/Enter or Touch
  const attemptProximityInteraction = () => {
    const item = getProximityItem();
    if (!item) return;

    const idx = items.findIndex(it => it.id === item.id);
    if (idx !== -1) {
      handleItemClick(idx);
    }
  };

  // Dialogue choices handling
  const chooseSurveyOption = (index: number) => {
    audio.playSuccessBell();
    setSelectedOption(index);
    setSurveyAnswers(prev => [...prev, index]);

    // Delay briefly before going to next question step
    setTimeout(() => {
      setInterviewStep((prev) => prev + 1);
    }, 1500);
  };

  const nextInspectionPage = () => {
    audio.playClick();
    if (activeInspection && inspectionTextIndex < activeInspection.description.length - 1) {
      setInspectionTextIndex(prev => prev + 1);
    } else {
      setActiveInspection(null);
    }
  };

  // Dynamic player scaling to create depth sorting illusion (Walking up = smaller, walking down = larger)
  const playerScale = 0.85 + ((playerY - 190) / 100) * 0.25;
  const playerFeetY = Math.round(playerY * 1.26 - 6);

  return (
    <div id="intro-canvas-container" className={`max-w-4xl mx-auto my-4 border-4 border-black p-4 md:p-6 bg-[#faf4ea] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden font-mono select-none ${GAME_CURSOR.default}`}>
      
      {/* Decorative Blueprint Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] border border-black/10" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      {/* Dynamic Header Badge Ribbon */}
      <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-2 text-[10px] tracking-widest text-black/60">
        <div className="flex items-center space-x-2">
          <span>校准水平 00 // INITIAL CALIBRATION LOBBY</span>
          <span className="text-[#d94141] animate-pulse font-bold">
            {interviewStep === 3 ? "● 认知侧写已建立" : "● 等待建立人类认知测绘侧写"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline">坐标系: [X: {Math.round(playerX)} Y: {Math.round(playerY)}]</span>
          <button 
            id="intro-mute-btn"
            onClick={() => setIsMuted(!isMuted)} 
            className="hover:text-black transition-colors flex items-center space-x-1 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-[#d94141]" /> : <Volume2 className="w-3 h-3" />}
            <span>[{isMuted ? "已静音" : "声音: 开启"}]</span>
          </button>
        </div>
      </div>

      {/* SEQUENTIAL ONBOARDING TASK CHECKLIST PROGRESS BAR */}
      <div className="bg-[#faf6eb] border-2 border-black p-2 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-mono">
        <div className="font-bold uppercase text-[#d94141] flex items-center space-x-1 shrink-0">
          <span className="animate-ping inline-block w-1.5 h-1.5 bg-[#d94141] rounded-full mr-1" />
          <span>引导校准流程 // GUIDED WORKFLOW:</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 flex-1 max-w-2xl text-center">
          <div className={`border p-1 ${guidedStep > 0 ? 'bg-green-100/70 border-green-700 text-green-900 font-bold' : guidedStep === 0 ? 'bg-yellow-100/70 border-yellow-700 text-yellow-900 font-bold animate-pulse' : 'bg-white/40 border-black/10 text-black/30'}`}>
            1. 观察蓝图 {guidedStep > 0 ? "✓" : "▶"}
          </div>
          <div className={`border p-1 ${guidedStep > 1 ? 'bg-green-100/70 border-green-700 text-green-900 font-bold' : guidedStep === 1 ? 'bg-yellow-100/70 border-yellow-700 text-yellow-900 font-bold animate-pulse' : 'bg-white/40 border-black/10 text-black/30'}`}>
            2. 调阅案卷 {guidedStep > 1 ? "✓" : guidedStep === 1 ? "▶" : "🔒"}
          </div>
          <div className={`border p-1 ${guidedStep > 2 ? 'bg-green-100/70 border-green-700 text-green-900 font-bold' : guidedStep === 2 ? 'bg-yellow-100/70 border-yellow-700 text-yellow-900 font-bold animate-pulse' : 'bg-white/40 border-black/10 text-black/30'}`}>
            3. 点击观察窗 {guidedStep > 2 ? "✓" : guidedStep === 2 ? "▶" : "🔒"}
          </div>
          <div className={`border p-1 ${guidedStep > 3 ? 'bg-green-100/70 border-green-700 text-green-900 font-bold' : guidedStep === 3 ? 'bg-yellow-100/70 border-yellow-700 text-yellow-900 font-bold animate-pulse' : 'bg-white/40 border-black/10 text-black/30'}`}>
            4. 激活校准台 {guidedStep > 3 ? "✓" : guidedStep === 3 ? "▶" : "🔒"}
          </div>
          <div className={`border p-1 ${guidedStep > 4 ? 'bg-green-100/70 border-green-700 text-green-900 font-bold' : guidedStep === 4 ? 'bg-yellow-100/70 border-yellow-700 text-yellow-900 font-bold animate-pulse' : 'bg-white/40 border-black/10 text-black/30'}`}>
            5. 进行认知研讨 {guidedStep > 4 ? "✓" : guidedStep === 4 ? "▶" : "🔒"}
          </div>
        </div>
      </div>

      {/* Main 2.5D Lab Lobby Viewport stage */}
      <div className={`relative w-full aspect-[1000/400] border-2 border-black bg-[#faf6eb] overflow-hidden rounded-sm ${GAME_CURSOR.default}`}>
        
        {/* GUIDED WARNING OVERLAY */}
        {guidedWarning && (
          <div className="absolute inset-0 bg-[#d94141]/25 backdrop-blur-[1px] border-4 border-[#d94141] flex flex-col items-center justify-center z-50 p-4 transition-all animate-fade-in">
            <div className="bg-black text-[#faf6eb] border-2 border-black p-4 max-w-md text-center shadow-[4px_4px_0px_0px_rgba(217,65,65,1)]">
              <div className="text-[#d94141] font-black text-xs uppercase tracking-widest mb-1.5 animate-pulse">
                ⚠ ACCESS LOCKED // 拒绝执行
              </div>
              <p className="text-xs font-mono font-bold text-white/90 mb-3">
                {guidedWarning}
              </p>
              <div className="text-[9px] text-[#f3ca52] font-mono">
                * 被测主体 402 必须按照序列对齐突触路径
              </div>
            </div>
          </div>
        )}
        
        {/* PARALLAX / DECORATIVE STATIC VECTOR FLOOR LINES */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Horizon wall divide */}
          <line x1="0" y1="180" x2="1000" y2="180" stroke="#000" strokeWidth="2.5" />
          {/* Wall background wood panels or lines */}
          <line x1="150" y1="0" x2="150" y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-20" />
          <line x1="300" y1="0" x2="300" y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-20" />
          <line x1="500" y1="0" x2="500" y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-20" />
          <line x1="700" y1="0" x2="700" y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-20" />
          <line x1="850" y1="0" x2="850" y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2 3" className="opacity-20" />

          {/* Perspective Floor grids */}
          <line x1="120" y1="180" x2="0" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20" />
          <line x1="320" y1="180" x2="200" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20" />
          <line x1="520" y1="180" x2="450" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20" />
          <line x1="720" y1="180" x2="700" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20" />
          <line x1="920" y1="180" x2="950" y2="400" stroke="#000" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-20" />

          {/* Floor measurement reference rulers */}
          <path d="M 0,340 l 1000,0 M 100,340 v 8 M 200,340 v 8 M 300,340 v 8 M 400,340 v 8 M 500,340 v 8 M 600,340 v 8 M 700,340 v 8 M 800,340 v 8 M 900,340 v 8" stroke="#000" strokeWidth="1" strokeDasharray="2 4" className="opacity-45" />
          
          <rect x="70" y="25" width="220" height="28" stroke="#000" strokeWidth="1.5" fill="#faf6eb" className="opacity-80" />
          <text x="180" y="42" textAnchor="middle" className="fill-black font-serif font-bold text-[9px] tracking-widest uppercase">控制论校准学部 // LAB SECTOR 00</text>
        </svg>

        {/* ------------------------------------------------------------------
            Y-SORTED LAYERS OF INTERACTIVE ENVIRONMENTAL OBJECTS
           ------------------------------------------------------------------ */}

        {/* 1. HANGING PRECISION BLUEPRINT (Static background wall, y = 150) */}
        <div 
          className={`absolute bg-[#faf4ea] border-2 border-black p-1 text-center transition-transform hover:scale-105 ${GAME_CURSOR.action} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${guidedStep === 0 ? 'ring-4 ring-[#d94141] ring-offset-2 animate-pulse' : ''}`}
          style={{ left: '100px', top: '70px', width: '80px', height: '60px' }}
          onClick={() => handleItemClick(0)}
        >
          {guidedStep === 0 && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#d94141] text-white text-[7px] font-bold py-0.5 px-1.5 border border-black shadow animate-bounce uppercase whitespace-nowrap z-50">
              第一步:点击此处 // CLICK
            </div>
          )}
          <div className="w-full h-full border border-dashed border-black/40 p-1 flex flex-col justify-between">
            <span className="text-[6px] font-black uppercase text-[#d94141] tracking-tighter">SYNAPTIC HAND</span>
            <div className="w-full h-6 border border-black/10 relative overflow-hidden bg-white/50 flex items-center justify-center">
              {/* schematic silhouette */}
              <svg width="40" height="20" viewBox="0 0 40 20" className="opacity-30">
                <path d="M 5,10 q 15,-10 30,0" stroke="#000" strokeWidth="1" />
                <circle cx="20" cy="10" r="5" stroke="#000" strokeWidth="0.5" strokeDasharray="1 1" />
              </svg>
            </div>
            <span className="text-[5px] text-black/50 tracking-tighter">SPECIMEN #402 // 1968</span>
          </div>
        </div>

        {/* 2. CHROME CLASSIFIED CABINET (Interactive midground object, y = 200) */}
        <div 
          className={`absolute flex flex-col justify-end items-center ${GAME_CURSOR.action} group`}
          style={{ left: '240px', top: '100px', width: '70px', height: '100px', zIndex: 200 }}
          onClick={() => handleItemClick(1)}
        >
          {guidedStep === 1 && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#d94141] text-white text-[7px] font-bold py-0.5 px-1.5 border border-black shadow animate-bounce uppercase whitespace-nowrap z-50">
              第二步:调阅案卷 // INSPECT
            </div>
          )}
          {/* Isometric cabinet structure */}
          <div className={`w-full h-[90px] border-2 border-black bg-[#faf4ea] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-around p-1.5 transition-transform group-hover:-translate-y-1 ${guidedStep === 1 ? 'ring-4 ring-[#d94141] border-[#d94141]' : ''}`}>
            <div className="border border-black/20 h-5 w-full bg-[#faf6eb] flex items-center justify-between px-1">
              <div className="w-2 h-0.5 bg-black" />
              <div className="w-6 h-1.5 border border-black/30 text-[4px] font-mono leading-none scale-[0.6] text-center bg-white">CONFIDENTIAL</div>
            </div>
            <div className="border border-black/20 h-5 w-full bg-[#faf6eb] flex items-center justify-between px-1">
              <div className="w-2 h-0.5 bg-black" />
              <div className="w-6 h-1.5 border border-black/30 text-[4px] font-mono leading-none scale-[0.6] text-center bg-white">CASE_A</div>
            </div>
            <div className="border border-black/20 h-5 w-full bg-[#faf6eb] flex items-center justify-between px-1">
              <div className="w-2 h-0.5 bg-black" strokeDasharray="1 1" />
              <div className="w-6 h-1.5 border border-black/30 text-[4px] font-mono leading-none scale-[0.6] text-center bg-[#d94141] text-white">RED-402</div>
            </div>
          </div>
          <span className="text-[6px] uppercase text-black/40 mt-1 font-bold">机密分类案卷</span>
        </div>

        {/* 3. FROSTED LEAD GLASS WINDOW (Background, y = 185) */}
        <div 
          className={`absolute bg-emerald-950/25 border-2 border-black shadow-inner flex flex-col justify-between overflow-hidden ${GAME_CURSOR.action} ${guidedStep === 2 ? 'ring-4 ring-[#d94141] border-[#d94141]' : ''}`}
          style={{ left: '380px', top: '65px', width: '130px', height: '60px' }}
          onClick={() => handleItemClick(2)}
        >
          {guidedStep === 2 && (
            <div className="absolute top-1 left-1 bg-[#d94141] text-white text-[7px] font-bold py-0.5 px-1.5 border border-black shadow animate-pulse uppercase whitespace-nowrap z-50">
              第三步:点击观察 // OBSERVE
            </div>
          )}
          {/* Animated matrix grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_50%,_transparent_50%)] bg-[size:100%_4px] opacity-65 pointer-events-none" />
          <div className="w-full h-full p-1.5 flex flex-col justify-between relative bg-emerald-900/10 hover:bg-emerald-800/10 transition-colors">
            <span className="text-[5px] text-emerald-700/60 font-black tracking-widest uppercase">MAINFRAME TERMINAL CORE</span>
            {/* Spinning vector server dials */}
            <div className="flex items-center space-x-3 justify-center py-1 opacity-45">
              <div className="w-5 h-5 rounded-full border border-emerald-700 border-dashed animate-spin" />
              <div className="w-4 h-4 rounded-full border border-emerald-700 border-dashed animate-[spin_4s_linear_infinite]" />
              <div className="w-5 h-5 rounded-full border border-emerald-700 border-dashed animate-[spin_8s_linear_infinite]" />
            </div>
            <div className="flex items-center justify-between text-[4px] text-emerald-700/60 font-bold tracking-tighter">
              <span>RPM: 3600 // SECTOR SAFE</span>
              <span className="animate-pulse">● FEEDBACK ON</span>
            </div>
          </div>
        </div>

        {/* 4. ANALOG CONTROL PANEL CONSOLE (Midground table, y = 210) */}
        <div 
          className={`absolute ${GAME_CURSOR.action} group`}
          style={{ left: '550px', top: '100px', width: '80px', height: '90px', zIndex: 210 }}
          onClick={() => handleItemClick(3)}
        >
          {guidedStep === 3 && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#d94141] text-white text-[7px] font-bold py-0.5 px-1.5 border border-black shadow animate-bounce uppercase whitespace-nowrap z-50">
              第四步:点击校准 // CALIBRATE
            </div>
          )}
          <div className={`w-full h-[75px] border-2 border-black bg-[#faf4ea] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 flex flex-col justify-between transition-transform group-hover:-translate-y-1 ${guidedStep === 3 ? 'ring-4 ring-[#d94141] border-[#d94141]' : ''}`}>
            <div className="flex items-center justify-between border-b border-black/10 pb-1">
              <span className="text-[5px] font-black uppercase tracking-widest text-[#d94141]">M-19-68</span>
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse border border-black/40" />
            </div>
            {/* Pressure gauge */}
            <div className="flex items-center justify-around py-0.5">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center relative bg-white">
                <div className="absolute w-0.5 h-3 bg-[#d94141] origin-bottom -translate-y-1.5 -rotate-12 animate-[pulse_1.5s_infinite_alternate]" />
                <div className="w-1.5 h-1.5 rounded-full bg-black z-10" />
              </div>
              <div className="flex flex-col space-y-0.5">
                <div className="w-5 h-2 bg-black/10 border border-black text-[3px] scale-95 flex items-center justify-center font-bold">HZ: 98</div>
                <div className="w-5 h-2 bg-black text-[#faf6eb] border border-black text-[3px] scale-95 flex items-center justify-center font-bold animate-pulse">LOCK</div>
              </div>
            </div>
            <span className="text-[5px] text-center text-black/50 font-bold uppercase tracking-widest">中央遥测校正台</span>
          </div>
        </div>

        {/* 5. DR. EVELYN MERCER (Research Assistant stands here, y = 230) - RE-ENGINEERED HIGH DETAIL */}
        <div 
          className={`absolute ${GAME_CURSOR.action} transition-all`}
          style={{ 
            left: `${items[4].x}px`, 
            top: '110px',
            width: '64px',
            height: '110px',
            zIndex: 230 
          }}
          onClick={() => handleItemClick(4)}
        >
          {guidedStep === 4 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#d94141] text-white text-[8px] font-black py-1 px-2 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap z-50 animate-bounce">
              第五步:进行访谈 // TALK
            </div>
          )}
          <svg width="64" height="110" viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="32" cy="103" rx="14" ry="2.5" fill="#000" className="opacity-15" />
            
            {/* Standing Legs with detailed leather boots */}
            <line x1="28" y1="74" x2="28" y2="101" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="36" y1="74" x2="36" y2="101" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 24,101 L 30,101 L 31,104 L 23,104 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1" />
            <path d="M 34,101 L 40,101 L 41,104 L 33,104 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1" />

            {/* Double-breasted clinical lab coat with shading and folds */}
            <path d="M 20,44 L 44,44 L 48,76 L 16,76 Z" fill="#faf4ea" stroke="#000" strokeWidth="2" />
            <path d="M 20,44 L 24,76" stroke="#000" strokeWidth="0.75" strokeDasharray="1 2" className="opacity-40" />
            <path d="M 44,44 L 40,76" stroke="#000" strokeWidth="0.75" strokeDasharray="1 2" className="opacity-40" />
            <circle cx="28" cy="52" r="1.5" fill="#000" />
            <circle cx="28" cy="60" r="1.5" fill="#000" />
            <circle cx="28" cy="68" r="1.5" fill="#000" />
            <circle cx="36" cy="52" r="1.5" fill="#000" />
            <circle cx="36" cy="60" r="1.5" fill="#000" />
            <circle cx="36" cy="68" r="1.5" fill="#000" />
            
            {/* Stenciled clinical ID badge */}
            <rect x="38" y="47" width="6" height="4.5" fill="#fff" stroke="#000" strokeWidth="0.75" />
            <line x1="39" y1="49" x2="43" y2="49" stroke="#d94141" strokeWidth="0.5" />
            <line x1="39" y1="50.5" x2="42" y2="50.5" stroke="#000" strokeWidth="0.5" />

            {/* Clipboard held in hand with mini graph paper */}
            <g transform="rotate(-8 16 61)">
              <rect x="8" y="50" width="14" height="20" fill="#dfd6c2" stroke="#000" strokeWidth="1.5" />
              <rect x="9" y="51" width="12" height="18" fill="#ffffff" />
              <line x1="11" y1="55" x2="19" y2="55" stroke="#90caf9" strokeWidth="0.5" />
              <line x1="11" y1="60" x2="19" y2="60" stroke="#90caf9" strokeWidth="0.5" />
              <line x1="11" y1="65" x2="19" y2="65" stroke="#90caf9" strokeWidth="0.5" />
              <path d="M 11,66 L 14,61 L 16,63 L 19,56" stroke="#d94141" strokeWidth="0.75" fill="none" />
              <rect x="12" y="47" width="6" height="3" fill="#333" stroke="#000" strokeWidth="1" />
            </g>
            <path d="M 20,46 Q 12,50 14,58" stroke="#000" strokeWidth="2" fill="none" />

            {/* Head, detailed hair, retro eyeglasses, light reflections */}
            <circle cx="32" cy="27" r="11" fill="#faf4ea" stroke="#000" strokeWidth="2" />
            <circle cx="32" cy="14" r="5.5" fill="#2d221c" stroke="#000" strokeWidth="1.5" />
            <path d="M 23,22 Q 32,16 41,22" stroke="#000" strokeWidth="1.5" fill="#2d221c" />
            <path d="M 21,25 C 21,18 43,18 43,25 Z" fill="#2d221c" stroke="#000" strokeWidth="1.5" />
            
            <circle cx="26" cy="27" r="4" stroke="#000" fill="#a7f3d0" fillOpacity="0.25" strokeWidth="1.5" />
            <circle cx="34" cy="27" r="4" stroke="#000" fill="#a7f3d0" fillOpacity="0.25" strokeWidth="1.5" />
            <line x1="29" y1="27" x2="31" y2="27" stroke="#000" strokeWidth="1.5" />
            <line x1="25" y1="25" x2="27" y2="28" stroke="#fff" strokeWidth="0.75" />
            <line x1="33" y1="25" x2="35" y2="28" stroke="#fff" strokeWidth="0.75" />
          </svg>

          {/* Interactive balloon pointer when Evelyn Mercer is nearby */}
          {guidedStep === 4 && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-[#faf6eb] text-[7px] font-bold py-1 px-1.5 border border-black shadow-[2px_2px_0px_0px_rgba(217,65,65,1)] whitespace-nowrap opacity-85 animate-pulse">
              [点击博士开启对话]
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------
            PROXIMITY RADAR OVERLAY INTERACTIVE PROMPT
           ------------------------------------------------------------------ */}
        {nearbyItem && !activeInspection && interviewStep === -1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black text-[#faf6eb] border-2 border-black px-4 py-2.5 shadow-[4px_4px_0px_0px_rgba(217,65,65,1)] text-center animate-pulse rounded-sm">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              靠近: 【{nearbyItem.chineseName}】 // PROXIMITY ENGAGED
            </span>
            <div className="font-mono text-[9px] text-[#f3ca52] mt-1 font-black">
              按 [空格键 / 回车键] 或 [点击此对象] 进行深度校准核对
            </div>
          </div>
        )}

        {/* Welcome HUD overlay for first-time walkers */}
        {!hasMoved && !activeInspection && interviewStep === -1 && (
          <div className="absolute top-10 left-10 animate-pulse flex items-center space-x-3 bg-black text-[#faf6eb] px-4 py-3 border border-black shadow-[4px_4px_0px_0px_rgba(217,65,65,1)] text-[10px] uppercase font-bold tracking-widest rounded-sm z-50">
            <Keyboard className="w-4 h-4 text-[#d94141]" />
            <span>使用 WASD 键 或 方向键 在3D实验室中自由走动</span>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SVG PLAYER CHARACTER (Drawn with depth scaling)
           ------------------------------------------------------------------ */}
        <div
          className="absolute transition-all duration-75 pointer-events-none"
          style={{ 
            left: `${playerX}px`, 
            top: `${playerY - 45}px`, // Offset to align legs to Y grid walkline
            transform: `scale(${playerScale}) scaleX(${direction === 'right' ? 1 : -1})`,
            width: '64px',
            height: '110px',
            zIndex: playerFeetY // Dynamic vertical depth sort
          }}
        >
          <svg width="64" height="110" viewBox="0 0 64 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Shadow ellipse */}
            <ellipse cx="32" cy="104" rx="14" ry="3" fill="#000" className="opacity-15" />
            
            {/* Walking legs with detailed retro leather boots */}
            {(() => {
              const leg1Angle = isWalking ? Math.sin(walkCycle) * 22 : 0;
              const leg2Angle = isWalking ? -Math.sin(walkCycle) * 22 : 0;
              const l1x = 28 + Math.sin(leg1Angle * Math.PI / 180) * 30;
              const l1y = 72 + Math.cos(leg1Angle * Math.PI / 180) * 30;
              const l2x = 36 + Math.sin(leg2Angle * Math.PI / 180) * 30;
              const l2y = 72 + Math.cos(leg2Angle * Math.PI / 180) * 30;
              
              return (
                <g stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                  {/* Leg 1 */}
                  <line x1="28" y1="72" x2={l1x} y2={l1y} />
                  {/* Boot 1 */}
                  <path d={`M ${l1x - 3} ${l1y} L ${l1x + 7} ${l1y} L ${l1x + 8} ${l1y + 4} L ${l1x - 4} ${l1y + 4} Z`} fill="#111" stroke="#000" strokeWidth="1" />
                  
                  {/* Leg 2 */}
                  <line x1="36" y1="72" x2={l2x} y2={l2y} />
                  {/* Boot 2 */}
                  <path d={`M ${l2x - 3} ${l2y} L ${l2x + 7} ${l2y} L ${l2x + 8} ${l2y + 4} L ${l2x - 4} ${l2y + 4} Z`} fill="#111" stroke="#000" strokeWidth="1" />
                </g>
              );
            })()}

            {/* Vintage trench coat with lapels, buttons and shaded side folds */}
            <path d="M 22,42 L 42,42 L 46,72 L 18,72 Z" fill="#faf4ea" stroke="#000" strokeWidth="2" />
            {/* Shoulder strap detail for telemetry back pack */}
            <path d="M 22,42 L 36,72" stroke="#4a3b32" strokeWidth="2" />
            {/* Belt buckle and line */}
            <line x1="20" y1="56" x2="44" y2="56" stroke="#000" strokeWidth="2" />
            <rect x="28" y="53" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#faf6eb" />
            <rect x="31" y="55" width="2" height="2" fill="#000" />
            {/* Trench Coat lapels */}
            <path d="M 25,42 L 32,49 L 39,42" stroke="#000" strokeWidth="1.5" fill="none" />
            <path d="M 22,42 L 26,48" stroke="#000" strokeWidth="1.5" />
            <path d="M 42,42 L 38,48" stroke="#000" strokeWidth="1.5" />
            {/* Tiny buttons */}
            <circle cx="26" cy="62" r="1" fill="#000" />
            <circle cx="38" cy="62" r="1" fill="#000" />
            <circle cx="26" cy="67" r="1" fill="#000" />
            <circle cx="38" cy="67" r="1" fill="#000" />

            {/* Arm swing with sleeve cuffs and hand holding sensor wire */}
            {(() => {
              const armAngle = isWalking ? -Math.sin(walkCycle) * 20 : 0;
              const ax = 18 + Math.sin(armAngle * Math.PI / 180) * 18;
              const ay = 60 + Math.cos(armAngle * Math.PI / 180) * 12;
              return (
                <g stroke="#000" strokeWidth="2" strokeLinecap="round">
                  <line x1="22" y1="44" x2={ax} y2={ay} />
                  {/* Small hand holding a sensor bulb */}
                  <circle cx={ax} cy={ay} r="2.5" fill="#faf4ea" stroke="#000" strokeWidth="1" />
                  <path d={`M ${ax} ${ay} Q ${ax + 5} ${ay + 8} 32 75`} stroke="#10b981" strokeWidth="0.75" strokeDasharray="1 1" fill="none" />
                </g>
              );
            })()}

            {/* Subject Head & Hair & Glasses */}
            <circle cx="32" cy="28" r="11" fill="#faf4ea" stroke="#000" strokeWidth="2" />
            {/* Combed vintage hair with detailed parting lines */}
            <path d="M 23,22 Q 32,15 41,22 Q 32,18 23,22" fill="#3a3028" stroke="#000" strokeWidth="1" />
            <path d="M 22,23 C 21,26 23,29 24,28" stroke="#000" strokeWidth="1" />
            
            {/* Refined glasses with white reflection lines */}
            <rect x="34" y="24" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
            <rect x="22" y="24" width="8" height="6" stroke="#000" strokeWidth="1.5" fill="#e0f2fe" fillOpacity="0.4" />
            <line x1="30" y1="27" x2="34" y2="27" stroke="#000" strokeWidth="1.5" />
            <line x1="24" y1="25" x2="26" y2="28" stroke="#fff" strokeWidth="1" />
            <line x1="36" y1="25" x2="38" y2="28" stroke="#fff" strokeWidth="1" />

            {/* Telemetry Sensor crown antenna with details */}
            <path d="M 26,18 L 32,10 L 38,18 Z" fill="#b45309" stroke="#000" strokeWidth="1" />
            <line x1="32" y1="10" x2="32" y2="2" stroke="#d94141" strokeWidth="1.2" />
            {/* Glowing active neon indicator bulb */}
            <circle cx="32" cy="2" r="2.5" fill="#d94141" className="animate-pulse" />
            <circle cx="32" cy="2" r="1" fill="#fff" />
          </svg>
        </div>

      </div>

      {/* MOBILE ONSCREEN JOYSTICK / BUTTON PANEL */}
      <div className="flex md:hidden items-center justify-center space-x-2 mt-4">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button 
            onTouchStart={() => { keysPressed.current['arrowup'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowup'] = false; }}
            className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold text-center rounded-sm flex items-center justify-center text-sm"
          >
            ▲
          </button>
          <div />
          <button 
            onTouchStart={() => { keysPressed.current['arrowleft'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowleft'] = false; }}
            className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold text-center rounded-sm flex items-center justify-center text-sm"
          >
            ◀
          </button>
          <button 
            onTouchStart={() => { attemptProximityInteraction(); }}
            className="w-12 h-12 border-2 border-[#d94141] bg-black text-white font-bold text-center rounded-sm flex items-center justify-center text-[10px]"
          >
            E
          </button>
          <button 
            onTouchStart={() => { keysPressed.current['arrowright'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowright'] = false; }}
            className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold text-center rounded-sm flex items-center justify-center text-sm"
          >
            ▶
          </button>
          <div />
          <button 
            onTouchStart={() => { keysPressed.current['arrowdown'] = true; }}
            onTouchEnd={() => { keysPressed.current['arrowdown'] = false; }}
            className="w-12 h-12 border-2 border-black bg-white hover:bg-black hover:text-white transition-all font-bold text-center rounded-sm flex items-center justify-center text-sm"
          >
            ▼
          </button>
          <div />
        </div>
      </div>

      {/* ------------------------------------------------------------------
          DIALOGUE BOX STYLED LIKE STARDEW VALLEY (RE-ENGINEERED WITH HIGH READABILITY)
         ------------------------------------------------------------------ */}
      
      {/* 1. ARCHIVE / CONSOLE INSPECTION MODAL */}
      {activeInspection && (
        <div className="mt-4 border-4 border-black p-5 bg-[#faf4ea] relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="absolute top-1 left-1 right-1 bottom-1 border border-black/10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5 items-start">
            <InspectionArchivalPhoto itemId={activeInspection.id} alt={activeInspection.chineseName} />

            <div className="flex-1 w-full text-justify">
              <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-2.5">
                <span className="text-xs font-black tracking-widest text-[#d94141] uppercase">
                  档案分析器 // {activeInspection.name}
                </span>
                <span className="text-[8px] font-mono opacity-50">坐标对齐: READY</span>
              </div>
              
              <p className="text-sm md:text-base leading-relaxed text-black font-semibold min-h-[50px] whitespace-pre-wrap">
                {typedInspectionText}
                {typedInspectionText.length < (activeInspection.description[inspectionTextIndex] || "").length && (
                  <span className="typewriter-cursor text-[#d94141] ml-0.5" />
                )}
              </p>

              {typedInspectionText.length === (activeInspection.description[inspectionTextIndex] || "").length && (
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={nextInspectionPage}
                    className="flex items-center space-x-1.5 text-xs font-black uppercase tracking-widest bg-black text-[#faf6eb] border border-black px-4 py-2 hover:bg-[#faf6eb] hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(217,65,65,1)]"
                  >
                    <span>
                      {inspectionTextIndex < activeInspection.description.length - 1 ? "阅读下一页 // NEXT" : "结束核查 // CLOSE"}
                    </span>
                    <CornerDownLeft className="w-3.5 h-3.5 text-[#d94141] shrink-0" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. DR. EVELYN MERCER ENTRY INTERVIEW SURVEY DIALOGUE */}
      {interviewStep >= 0 && (
        <div className="mt-4 border-4 border-black p-6 bg-[#faf4ea] relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
          <div className="absolute top-1 left-1 right-1 bottom-1 border border-black/10 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-start">
            
            {/* PORTRAIT SECTION */}
            <EvelynMercerPortrait size={96} variant="card" className="mx-auto md:mx-0" />

            {/* INTERACTIVE QUESTIONNAIRE */}
            <div className="flex-1 w-full text-justify space-y-4">
              <div className="flex items-center justify-between border-b border-black/10 pb-1.5 mb-1">
                <span className="text-xs font-black tracking-widest text-[#d94141] uppercase">
                  伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST
                </span>
                <span className="text-[8px] font-mono opacity-50">问卷协议 // COGNITIVE PROFILE</span>
              </div>
              
              {/* Questionnaire Dialogue text: Increased Size and Spacing for Perfect Readability */}
              <p className="text-base md:text-lg leading-relaxed text-black font-semibold min-h-[50px] whitespace-pre-wrap">
                {typedDialogue}
                {typedDialogue.length < (interviewStep < 3 ? interviewQuestions[interviewStep].question.length : 120) && (
                  <span className="typewriter-cursor text-[#d94141] ml-0.5" />
                )}
              </p>

              {/* Multiple Choice Options (Only render when dialogue finished typing) */}
              {interviewStep < 3 && typedDialogue.length === interviewQuestions[interviewStep].question.length && (
                <div className="space-y-2 mt-4 pt-4 border-t border-black/10">
                  {interviewQuestions[interviewStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      disabled={selectedOption !== null}
                      onClick={() => chooseSurveyOption(oIdx)}
                      className={`w-full text-left font-mono text-xs md:text-sm px-4 py-3 border-2 border-black bg-white transition-all duration-150 flex items-center justify-between rounded-sm cursor-pointer ${
                        selectedOption === null 
                          ? 'hover:bg-[#faf4ea] hover:translate-x-1 hover:shadow-[3px_3px_0px_0px_rgba(217,65,65,1)]' 
                          : selectedOption === oIdx 
                            ? 'bg-black text-[#faf6eb] border-black scale-[1.01]' 
                            : 'opacity-40'
                      }`}
                    >
                      <span className="font-semibold">{oIdx + 1}. {opt}</span>
                      {selectedOption === oIdx && <ArrowRight className="w-4 h-4 text-[#f3ca52] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------
          TRANSITION TO EXPERIMENT TITLE SCREEN OVERLAY
         ------------------------------------------------------------------ */}
      {gameState === 'transition_screen' && (
        <div 
          className="fixed inset-0 z-[9999] bg-[#faf6eb] text-black p-8 md:p-16 flex flex-col items-center justify-center transition-opacity duration-700 select-none"
          style={{ opacity: fadeOpacity }}
        >
          {/* Subtle Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

          {/* Retro framing boarder */}
          <div className="max-w-xl w-full border-4 border-black p-8 md:p-12 text-center bg-[#faf4ea] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-black/10 pointer-events-none" />

            <div className="space-y-3 mb-8">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#d94141] font-bold animate-[pulse_2s_infinite]">
                认知校准程序 // COGNITIVE CALIBRATION
              </h4>
              <div className="border-t-2 border-double border-black my-4" />
              <h2 className="font-mono text-sm tracking-widest text-black/60 uppercase">
                测试主体 // SUBJECT #402
              </h2>
            </div>

            <div className="space-y-6 my-10">
              <h3 className="font-mono text-base tracking-widest text-[#d94141] uppercase font-bold">
                实验一 // EXPERIMENT 01
              </h3>
              <h1 className="font-serif font-black text-3xl md:text-5xl tracking-tight text-black uppercase letterpress-text">
                神经突触联合义肢手
              </h1>
              <p className="font-mono text-[10px] text-black/50 tracking-widest uppercase">
                标本 I · 创造之指 // THE FINGER OF CREATION
              </p>
            </div>

            <div className="border-t-2 border-double border-black my-4" />
            <div className="flex items-center justify-center space-x-2 font-mono text-[9px] text-black/40 uppercase tracking-widest">
              <span className="animate-spin inline-block w-3 h-3 border-2 border-black border-t-transparent rounded-full" />
              <span>正在建立高精度突触监测信道...</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function InspectionArchivalPhoto({ itemId, alt }: { itemId: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const url = getIntroObjectImage(itemId);

  if (!url || failed) {
    return (
      <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-black bg-[#faf6eb] flex items-center justify-center shrink-0 relative shadow-sm mx-auto md:mx-0">
        <Compass className="w-10 h-10 text-black stroke-[1.2] animate-pulse" />
        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#d94141]" />
      </div>
    );
  }

  return (
    <div className="w-28 md:w-36 shrink-0 border-2 border-black overflow-hidden bg-black/5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] mx-auto md:mx-0">
      <img
        src={url}
        alt={alt}
        className="w-full h-28 md:h-36 object-cover sepia-[0.3] contrast-[1.05] brightness-[0.93]"
        onError={() => setFailed(true)}
        draggable={false}
      />
      <div className="px-2 py-1 bg-black/80 text-[#faf6eb] font-mono text-[7px] uppercase tracking-widest text-center">
        档案影像 // ARCHIVAL PHOTO
      </div>
    </div>
  );
}
