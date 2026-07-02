/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  PuzzleOneSVG, 
  PuzzleTwoSVG, 
  PuzzleThreeSVG 
} from './components/PuzzleSVGs';
import { 
  PuzzleFourSVG,
  PuzzleFiveSVG,
  PuzzleSixSVG,
  PuzzleSevenSVG,
  PuzzleEightSVG,
  PuzzleNineSVG,
  PuzzleTenSVG,
  PuzzleElevenSVG,
  PuzzleTwelveSVG,
  PuzzleThirteenSVG
} from './components/PuzzleSVGsExtra';
import { 
  Volume2, 
  VolumeX, 
  Clock, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  FileText, 
  Printer, 
  Play, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

import { puzzlePanelCursor } from './utils/gameCursor';
import PlayableIntro from './components/PlayableIntro';
import PhaseInterlude from './components/exploration/PhaseInterlude';
import ResearchBoard from './components/researchBoard/ResearchBoard';
import EvelynMercerPortrait from './components/characters/EvelynMercerPortrait';
import ArchiveCardModal from './components/archive/ArchiveCardModal';
import ResearchArchiveMenu from './components/archive/ResearchArchiveMenu';
import {
  getExperimentBlueprint,
  getExperimentPuzzleIndex,
  getCategoryLabel,
  getInterludeScene,
  getInterludeScenesForPhase,
  initExperimentRun,
} from './content';
import { getHintOverlayStyle } from './content/puzzleHotspots';
import type { ArchiveEntry, ExperimentRecord } from './content/types';
import { useResearchArchive } from './hooks/useResearchArchive';

// --------------------------------------------------------------------
// WEB AUDIO SYNTHESIZER ENGINE (No external audio file dependencies)
// --------------------------------------------------------------------
class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private init() {
    if (this.muted) return;
    try {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policies", e);
    }
  }

  playClick() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playTypewriter() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      const pitch = 700 + Math.random() * 450;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playSuccessBell() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      // Synthesize a retro typewriter margin bell (ding!)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const gain2 = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1250, now);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1580, now + 0.015);
      gain2.gain.setValueAtTime(0.08, now + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.45);
      osc2.start(now + 0.015);
      osc2.stop(now + 0.4);
    } catch (e) {}
  }

  playErrorBuzz() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      // Low, buzzy spring-rattle coil sound
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(90, now);
      osc1.frequency.linearRampToValueAtTime(75, now + 0.22);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(94, now);
      osc2.frequency.linearRampToValueAtTime(79, now + 0.22);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    } catch (e) {}
  }

  playWinChime() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      // Arpeggio of classic space-age telemetry computing tones
      const freqs = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51]; // E-G-C-E-G-C-E
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.35);
      });
    } catch (e) {}
  }

  playTick() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      // Woodblock-style mechanical mechanical relay clock-tick
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.015);
    } catch (e) {}
  }

  playLevelUp() {
    this.init();
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      // Quick satisfying telemetry sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.3);
    } catch (e) {}
  }
}

const audio = new RetroAudioEngine();

// --------------------------------------------------------------------
// PUZZLE CONFIGURATIONS
// --------------------------------------------------------------------
interface Specimen {
  id: number;
  title: string;
  subtitle: string;
  technicalDetails: string;
  differences: string[];
}

const SPECIMENS: Specimen[] = [
  {
    id: 0,
    title: "标本 I：神经突触联合义肢手",
    subtitle: "有机与合成手臂关联接口",
    technicalDetails: "关注点：人类手掌与控制论接收器相遇。校准日志显示右侧测试图纸中印有 5 个微小异常。寻找结构性关节变化、电火花弧和铆钉遗漏。",
    differences: [
      "机器人手腕外壳板上缺失金属螺丝。",
      "指尖之间桥接着异常的电火花放电路径。",
      "食指指尖上的机械关节套筒铰链线发生改变。",
      "省略了桥接手腕至手掌的电信号回路束。",
      "人类手臂插入处的交叉排线阴影密度变稀疏。"
    ]
  },
  {
    id: 1,
    title: "标本 II：分析引擎",
    subtitle: "配有生物大脑罩的 1960 年代大型机控制台",
    technicalDetails: "关注点：直接连接到晶体管组的生物 CPU 协处理器。存在 5 个微观结构差异。检查真空管灯丝、仪表盘角度、开关阵列和电缆条纹。",
    differences: [
      "中央真空管阀内部的线圈灯丝断裂/切断。",
      "机械系统压力表指针精确旋转了 90 度。",
      "磁带旋转带芯的辐条数量不一致。",
      "辅助面板上的拨动开关位置矩阵发生偏差。",
      "右下角电缆束上省略了绝缘脊纹理图案。"
    ]
  },
  {
    id: 2,
    title: "标本 III：光学视网膜",
    subtitle: "聚焦星体轨道的机械天文台传感器",
    technicalDetails: "关注点：高精度追踪望远镜记录轨道衰变。异常网格检测到 5 个结构性差异。检查望远镜光圈叶片、轨道电子、定位螺栓和示波器波形。",
    differences: [
      "塑造内部相机镜头的非一致性光圈快门叶片。",
      "右上角轨道上省略了原子轨道电子卫星。",
      "侧面金属徽标上的倒三角形方向贴花。",
      "三脚架支柱颈部省略了仰角调节手拧螺栓。",
      "左下角信号监视器上的单峰波形差异。"
    ]
  },
  {
    id: 3,
    title: "标本 IV：记忆保管库 (The Mnemonic Vault)",
    subtitle: "用于打孔卡、检索齿轮与机械编目设备的存储架构",
    technicalDetails: "关注点：大规模机械式记忆归档存储器，使用模拟物理打孔卡记录检索。存在 5 处系统逻辑偏差。检查中央卡孔排列、拨号圆盘、索引标签及外框标尺刻度。",
    differences: [
      "中央打孔卡顶部的二进制数据编码孔缺失半数。",
      "左侧检索齿轮的外部啮合轮齿被磨平且失去咬合刻纹。",
      "右下角存储抽屉的黄铜分类标牌上缺失‘M-402’墨印字样。",
      "左上部主气压阀的压力偏转指针在右图中反向指涉。",
      "右侧机身主支架的微米级微调定位标尺线被完全省略。"
    ]
  },
  {
    id: 4,
    title: "标本 V：梦境记录仪 (The Oneiric Recorder)",
    subtitle: "配有睡眠舱、脑电图纸和神经监测探头的脑波映射器",
    technicalDetails: "关注点：捕获无意识状态下的低频电波，输出至模拟双轴绘图仪。存在 5 处脑电遥测偏移。请排查波形滚轮、探头节点、散热栅格及废带收集舱。",
    differences: [
      "自动纸卷绘图板上的辅助EEG脑电波形退化为静音直线。",
      "枕骨部神经电极耦合球上漏装了一根高阻抗屏蔽接地引线。",
      "右上角精密同步齿圈的第二级同心导轨圈变异为单一细环。",
      "底部废旧穿孔带收集盒中堆叠的废带线圈残影在右图中空无一物。",
      "顶部主机箱的第六条纵向热对流循环冷却栅格在右侧被熔封关闭。"
    ]
  },
  {
    id: 5,
    title: "标本 VI：记忆重建装置 (Memory Reconstruction)",
    subtitle: "整合光学投影仪、感光底片和机械处理器的断层合成仪",
    technicalDetails: "关注点：对受损海马体底片进行重叠对焦投影。发现 5 处结构性散射异常。仔细检查透镜螺钉、感光板成像、漫射光束及底座调节排齿。",
    differences: [
      "微调凸透镜紧固圆盘上的固定钢铆钉螺栓被抹除了一半。",
      "投影屏幕上显示的人脸轮廓记忆碎片在右图中消失，变为空白反光板。",
      "穿过折射透镜的副对角线发散辅助虚线光路被切断省略。",
      "透镜底座滑轨上用于精确调焦的重型齿条排齿退化为光滑连杆。",
      "右侧外接循环阻尼瓶内盛装的淡黄色冷却介质液位计跌落至底部。"
    ]
  },
  {
    id: 6,
    title: "标本 VII：概率未来引擎 (The Future Engine)",
    subtitle: "通过旋转计算圆盘与多维变阻器运行的事件预测机",
    technicalDetails: "关注点：通过齿轮差速器计算可能历史。记录到 5 处概率计算微差。检查外围运算环刻度、中心驱动辐条、正态曲线和权重滑块位置。",
    differences: [
      "最外围概率共振环的亚弧度计算刻度线数量异常变少。",
      "核心运算轴轮的三爪连接辐条在右图中退化为平面带孔圆盘。",
      "左侧监视屏上的高斯正态钟形分布曲线在右侧退化为一根对角斜线。",
      "right-hand side 微调变阻器的滑块指示物理位置从高位下移至底部限位槽。",
      "悬挂在右上方差速平衡摆锤底部的多层合金配重圈减少了一层。"
    ]
  },
  {
    id: 7,
    title: "标本 VIII：大气管理局 (The Atmospheric Bureau)",
    subtitle: "配备高压闪电发生器与精密气压测量仪的气候实验室",
    technicalDetails: "关注点：在微型电离舱内复制风暴流体动力学。系统触发 5 处风暴模型偏移。寻找电离针火花、风向针指向、收集杯气流阻尼及冷凝滴。",
    differences: [
      "中央高压气室内部的气旋介质翻滚液位线在右侧显著降低。",
      "左侧放电引导塔顶端持续发出的电离电火花信号在右侧完全熄灭。",
      "右上角风向传感器叶轮的流体力学指向针方向逆转了 180 度。",
      "左下角泄压阻尼环的外部防滑滚花网状纹理变异为平滑表面。",
      "收集舱右侧蛇形冷凝管末端缺失了连续滴落的微量冷凝液滴。"
    ]
  },
  {
    id: 8,
    title: "标本 IX：世界模拟舱 (World Simulation Chamber)",
    subtitle: "重现城市群、交通网络与电磁辐射节点的玻璃罩微缩生态",
    technicalDetails: "关注点：微缩人类聚集区。检测到 5 处社会学基础建模差异。检查工业烟羽、悬索大桥拉索、边缘螺栓数量、信号塔及穹顶换气扇。",
    differences: [
      "西侧微缩重工业厂区的烟囱排放物气浪线被完全切断省略。",
      "跨海海峡悬索桥中呈发散分布的桥面拉力悬索索具被简化为单梁。",
      "模拟底座外围用于锁闭气压法兰的重型六角紧固螺丝数量少了两颗。",
      "东部微缩丘陵顶端的无线电中继铁塔缺失了向外扩散的同心圆波段纹理。",
      "顶部空气循环风道的四叶片机械换气扇轮廓在右侧显示为全黑盲板。"
    ]
  },
  {
    id: 9,
    title: "标本 X：观测者 (The Observer)",
    subtitle: "双向视线偏振仪，对人类与非人类观测对象进行同步视差测量",
    technicalDetails: "关注点：两端互相透射的反馈环。存在 5 处光学路径不对称。密切凝视内窥镜视差快门、二极管状态灯、折射十字丝及标签印章。",
    differences: [
      "视线接收器透镜内部折射的视网膜同心圈层光圈收缩为极小焦点。",
      "外部传感器矩阵排板上的微型发光二极管工作指示灯熄灭了半数。",
      "光学观察屏底板上刻印的直角坐标折射角切线发生了明显位移。",
      "机身右下侧用于手动对焦的反光镜拨叉偏置于‘校准’模式而非‘观测’。",
      "上层控制线路板连接线束中一根原本平行排布的十二芯排线丢失了线影纹理。"
    ]
  },
  {
    id: 10,
    title: "标本 XI：镜像主体 (The Mirror Subject)",
    subtitle: "双侧行为一致性评估室，针对认知折射产生的微小变异",
    technicalDetails: "关注点：极其对称的折射脑功能区域。存在 5 处极其精细、旨在规避肉眼察觉的偏差。核查颅骨功能分区、电极网线、颈椎铆接等细节。",
    differences: [
      "颅骨骨相分区图中的‘MEMORIA’记忆反射网格在右侧退化为空白区域。",
      "左枕骨引出的两组三叉分型脑神经电极输入引线退化为单一回路。",
      "机械支架颈椎固定槽处的双向梅花十字紧固锁紧螺丝变为无刻槽平头铆钉。",
      "右侧信号监视面板上的反馈测量仪表盘读数发生微小角度位移。",
      "图纸右边缘印制的周期性边缘波段同步校准定位线间距发生异常改变。"
    ]
  },
  {
    id: 11,
    title: "标本 XII：主体 #402 (Subject #402 Archive)",
    subtitle: "包含分类档案、过往记录相片及机密观测文档的活动柜橱",
    technicalDetails: "关注点：记录了自 1968 年以来全部实验对象的个人案卷。存在 5 处被刻意篡改的历史印记。核对宝丽来照片、密封红章、金属夹、手写评语和铭牌。",
    differences: [
      "宝丽来照片上的主体头像阴影轮廓丢失了所有的面部眼镜勾线。",
      "机密文件封口处的红色印章文字由‘CLASSIFIED’被篡改为‘UNCONFIRMED’。",
      "固定顶部手写备忘页的传统卷边双环金属曲别针退化为黑色强力长尾夹。",
      "边缘墨水笔手写注释‘监测协议已激活’被修改为‘替换该实验主体’。",
      "left-hand side 下角第二级文件抽屉上的压铸标签文字由‘EXP 01-12’退化为‘CLOSED’。"
    ]
  },
  {
    id: 12,
    title: "标本 XIII：校准终点 (Calibration Complete)",
    subtitle: "无异常状态下的视线停留测定与突触跟踪协议",
    technicalDetails: "关注点：最终校准环节。两幅投影图纸几乎完全一样。无需寻找常规意义上的物理变异，只需将目光停留在核心几何对焦环上，让系统捕捉您的视线模式。",
    differences: [
      "对焦几何质心 (250, 250) —— 视觉滞留轨迹已锁定并由大型机归档。",
      "左上对焦区间 (150, 150) —— 微秒级眼球微颤动检测已完成算法匹配。",
      "右上对焦区间 (350, 150) —— 视网膜扫视搜索密度测定结果符合常态分布。",
      "左下对焦区间 (150, 350) —— 视线在缺乏微弱证据时的空间疑虑倾向已度量。",
      "右下对焦区间 (350, 350) —— 主体在非机械式认知反馈下的观察意愿已确立。"
    ]
  }
];

// Helper interface for telemetry logging
interface LogItem {
  time: string;
  text: string;
  highlight?: boolean;
}

// Generates immersive live observer logs reflecting player behavior
function getPlayerMonitoringLogs(level: number, foundCount: number, timeLeft: number): LogItem[] {
  const logs: LogItem[] = [];
  logs.push({ time: "10:29:10", text: "档案馆网络已接入。主体 [E. 默瑟] 首度登入终端。" });
  logs.push({ time: "10:29:12", text: "1968 年国家认知校准协议 #402-B 已全面引导。" });

  if (level > 0) {
    logs.push({ time: "10:30:15", text: "标本 I（突触关节）校准完成。主体表现出高于平均水平的异常检测敏锐度。" });
  }
  if (level > 1) {
    logs.push({ time: "10:31:40", text: "标本 II（分析引擎）校准完成。系统神经反馈正常，眼部追踪轨迹高频稳定。" });
  }
  if (level > 2) {
    logs.push({ time: "10:33:05", text: "标本 III（光学视网膜）校准完成。目标搜索行为精确，注视密度未发生疲劳性扩散。" });
  }
  if (level > 3) {
    logs.push({ time: "10:34:20", text: "标本 IV（记忆保管库）校准完成。模拟打孔卡检索偏差已被主体悉数拦截。" });
  }
  if (level > 4) {
    logs.push({ time: "10:35:50", text: "标本 V（梦境记录仪）校准完成。一阶睡眠波形反馈：主体意识活动处于高度警觉模态。" });
  }
  if (level > 5) {
    logs.push({ time: "10:37:15", text: "标本 VI（重建装置）校准完成。主体成功拼合受损海马体，光学漫射无认知畸变。" });
  }
  if (level > 6) {
    logs.push({ time: "10:38:40", text: "标本 VII（未来引擎）校准完成。正态分布回归。主体决策特征与系统运算发生深度共鸣。" });
  }
  if (level > 7) {
    logs.push({ time: "10:40:10", text: "标本 VIII（大气管理局）校准完成。冷凝阻尼指标校正。监测到主体呼吸速率轻微上升。" });
  }
  if (level > 8) {
    logs.push({ time: "10:41:35", text: "标本 IX（模拟世界）校准完成。主体在证据缺乏状态下依然继续检查，怀疑倾向正常。" });
  }
  if (level > 9) {
    logs.push({ time: "10:43:00", text: "标本 X（观测者）校准完成。双向偏振测量成立。注意：主体正注视设备，设备亦在评估其瞳孔扩张度。" });
  }
  if (level > 10) {
    logs.push({ time: "10:44:25", text: "标本 XI（镜像主体）校准完成。极其对称，无明显参照物。主体眨眼频率跌破正常阈值。" });
  }
  if (level > 11) {
    logs.push({ time: "10:45:50", text: "标本 XII（主体 #402）档案破解成功。警告！机密历史数据外泄，主体发现其本人名字与签名。" }, { time: "10:46:00", text: "监测报告：主体正经历突触危机，搜索动作发生不规则震颤。校准协议濒临强行重组。", highlight: true });
  }

  const activeTimeStr = "10:" + (47 + level).toString().padStart(2, '0') + ":" + (60 - (timeLeft % 60)).toString().padStart(2, '0');
  
  if (level === 0) {
    if (foundCount > 0) {
      logs.push({ time: activeTimeStr, text: `[实时监测] 指节与火花电离状态校正中。已找出 ${foundCount}/5 处异常。` });
    }
  } else if (level === 1) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 压力阀读数偏差分析：${foundCount === 5 ? "校正就绪" : "正在捕获主体眼球固定频率"}。` });
  } else if (level === 2) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 极轨示波器阻抗计算中。进度：${foundCount}/5。注意心率起伏。` });
  } else if (level === 3) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 打孔卡存储单元分析。主体专注度指数保持在 1.00 标定级。` });
  } else if (level === 4) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 梦境记录仪废带盘卷。发现率：${foundCount}/5。监控器保持活跃。` });
  } else if (level === 5) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 漫射光路调焦齿轮分析。注意：主体眼睑闭合延迟 +2ms。` });
  } else if (level === 6) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 概率路径权重判定。主体在低可预测性模式下展示出了极强的解构能力。` });
  } else if (level === 7) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 气旋流体阻尼调节。主体在风暴多层嵌套中检索到极微小线索。` });
  } else if (level === 8) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 玻璃穹顶反光率标定。主体继续检查，尽管没有证据支撑。` });
  } else if (level === 9) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 观测反射角建立。我们在看着他。他在看着我们。监测正在持续。` });
  } else if (level === 10) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 镜像边缘一致性检验。极其隐晦的微观缺陷。主体表现出惊人的耐心与毅力。` });
  } else if (level === 11) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 主体档案泄漏。观察表明主体正在反复对比自己的姓名拼写与指纹档案。`, highlight: true });
  } else if (level === 12) {
    logs.push({ time: activeTimeStr, text: `[实时监测] 最终校准阶段。两幅图像完全对称，无任何实质差异。`, highlight: true });
    if (foundCount > 0) {
      logs.push({ time: activeTimeStr, text: `[系统宣告] 第一焦点 (250, 250) 行为已捕获。主体在做虚无对焦。` });
    }
    if (foundCount > 1) {
      logs.push({ time: activeTimeStr, text: `[系统宣告] 第二焦点 (150, 150) 行为已捕获。微血管灌注度上升。` });
    }
    if (foundCount > 2) {
      logs.push({ time: activeTimeStr, text: `[系统宣告] 第三焦点 (350, 150) 行为已捕获。大脑皮质搜索行为已被量化。` });
    }
    if (foundCount > 3) {
      logs.push({ time: activeTimeStr, text: `[系统宣告] 第四焦点 (150, 350) 行为已捕获。主体继续坚持不放弃，观察协议记录完整。` });
    }
    if (foundCount === 5) {
      logs.push({ time: activeTimeStr, text: `[系统宣告] 最终校准结束。实验目标已完成：主体观察行为完美采集。`, highlight: true });
    }
  }

  return logs.reverse();
}

const PHASE_DIALOGUES: Record<number, { speaker: string; name: string; text: string }[]> = {
  1: [
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“很好。第一阶段 [基础校准] 测定完毕。你的视神经通路对称性极其平稳，异常检出率在标定水平之上。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“你或许未曾察觉，从第一号标本 [神经突触联合义肢手] 到光学视网膜，那些测试图纸并非单纯的人类手工作品，它们是大型机与你的视网膜建立谐振的解码格栅。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“接下来，我们将进入第二阶段：[记忆系统]。图纸细节与晶体管纹路将更为复杂，请保持高度专注。”'
    }
  ],
  2: [
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“第二阶段 [记忆系统] 校准完毕。你的突触反馈波形非常完美。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“（沙沙的记录声...）你在寻找这些异常时，是否感受到了轻微的...‘视线引力’？大型机捕捉到了你的眼球扫视中出现了微弱的、不自然的滞留。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“不用慌张，这是光路透射产生的感应共振。我们正通过你点击异常的频次和视线滞留，同步调谐中央真空管网的矩阵稳定性。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“第三阶段：[预测与观测] 即将引导。我们将开始对多维概率以及流体气候模型进行差速测定。保持对焦，主体。”'
    }
  ],
  3: [
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“无与伦比的敏锐度...不，坦白说，你的各项指标完美得超出了我们的所有理论峰值。你是我们记录中对齐程度最深的第402号主体。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“我想是时候告诉你真相了。你并不是在做一套普通的视觉消遣测验。那些图纸中的三维非对称几何...在真实的物理世界中是不稳定存在的。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“通过你目光的注视，和你对那些微观不对称细节的点击‘隔离’...你正在用你那健康的、逻辑完备的人类意识，帮助这台大型机‘稳定’并锚定那些正在坍塌的低频空间。”'
    },
    {
      speaker: 'assistant',
      name: '伊芙琳·默瑟 博士 // CHIEF PSYCHOLOGIST',
      text: '“你不仅是在接受测试。你就是这台巨型机的校准透镜。接下来是最后一阶段：[身份验证]，只有最后的三个标本。细节将极其隐晦。愿你的意识坚不可摧。”'
    }
  ]
};

// Puzzle lookup mapping
const PUZZLE_COMPONENTS: Record<number, React.FC<any>> = {
  0: PuzzleOneSVG,
  1: PuzzleTwoSVG,
  2: PuzzleThreeSVG,
  3: PuzzleFourSVG,
  4: PuzzleFiveSVG,
  5: PuzzleSixSVG,
  6: PuzzleSevenSVG,
  7: PuzzleEightSVG,
  8: PuzzleNineSVG,
  9: PuzzleTenSVG,
  10: PuzzleElevenSVG,
  11: PuzzleTwelveSVG,
  12: PuzzleThirteenSVG,
};

export default function App() {
  // Game states
  const [gameState, setGameState] = useState<
    'intro' | 'playable_intro' | 'playing' | 'phase_report' | 'research_board' | 'phase_interlude' | 'phase_dialogue' | 'completed'
  >('intro');
  const [interludeSceneQueue, setInterludeSceneQueue] = useState<string[]>([]);
  const [interludeSceneIndex, setInterludeSceneIndex] = useState<number>(0);
  const [showResearchArchive, setShowResearchArchive] = useState<boolean>(false);
  const [viewingArchiveEntry, setViewingArchiveEntry] = useState<ArchiveEntry | null>(null);
  const [showLeftPanelHint, setShowLeftPanelHint] = useState<boolean>(false);
  const [experimentRecords, setExperimentRecords] = useState<Record<number, ExperimentRecord>>({});
  const levelStartedAtRef = useRef<number>(Date.now());
  const researchArchive = useResearchArchive();
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [foundDiffs, setFoundDiffs] = useState<Record<number, number[]>>({});
  const [completedPhase, setCompletedPhase] = useState<number>(1);
  const [phaseDialogueIndex, setPhaseDialogueIndex] = useState<number>(0);
  const [typedPhaseDialogue, setTypedPhaseDialogue] = useState<string>("");
  const [showTutorialSuccess, setShowTutorialSuccess] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [flickerActive, setFlickerActive] = useState<boolean>(true);
  
  // Timer settings
  const [timeLeft, setTimeLeft] = useState<number>(240); // 240 seconds for the entire calibration protocol
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  
  // Analytics
  const [totalClicks, setTotalClicks] = useState<Record<number, number>>({});
  const [hintsUsed, setHintsUsed] = useState<Record<number, number>>({});
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const [shakeLeft, setShakeLeft] = useState<boolean>(false);
  const [shakeRight, setShakeRight] = useState<boolean>(false);
  
  // User Certification
  const [userName, setUserName] = useState<string>("E. 默瑟");
  const [certificationGrade, setCertificationGrade] = useState<string>("优秀敏锐度");

  // Typewriter intro text state
  const [introText, setIntroText] = useState<string>("");
  const fullIntroText = 
    `假说：现代自动化能够以极高的速度登记像素变化，但人类在对上下文异常的认知直觉上依然无可比拟。

目标：比较原始蓝图（左）与改动图纸（右）。在校准倒计时归零前，隔离出每个标本中的 5 处细微结构差异。

不要输掉这场观察测试，人类。`;

  // Ref to track typing index
  const typingIndexRef = useRef(0);

  // Typewriter effect on intro screen
  useEffect(() => {
    if (gameState === 'intro') {
      setIntroText("");
      typingIndexRef.current = 0;
      
      const interval = setInterval(() => {
        const currentIndex = typingIndexRef.current;
        if (currentIndex < fullIntroText.length) {
          setIntroText((prev) => prev + fullIntroText[currentIndex]);
          // Random typewriter sound
          if (!isMuted && Math.random() > 0.3) {
            audio.playTypewriter();
          }
          typingIndexRef.current = currentIndex + 1;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [gameState]);

  const handlePhaseDialogueNext = () => {
    const activeSeq = PHASE_DIALOGUES[completedPhase];
    if (!activeSeq) return;

    if (typedPhaseDialogue.length < activeSeq[phaseDialogueIndex].text.length) {
      setTypedPhaseDialogue(activeSeq[phaseDialogueIndex].text);
      return;
    }

    audio.playClick();
    if (phaseDialogueIndex < activeSeq.length - 1) {
      setPhaseDialogueIndex(prev => prev + 1);
    } else {
      audio.playLevelUp();
      setCurrentLevel(prev => prev + 1);
      // Give bonus time!
      setTimeLeft(prev => Math.min(300, prev + 60));
      setGameState('playing');
      setIsTimerActive(true); // Resume timer
    }
  };

  // Typewriter effect for story dialogue scenes between phases
  useEffect(() => {
    if (gameState !== 'phase_dialogue') return;
    
    const activeDiag = PHASE_DIALOGUES[completedPhase]?.[phaseDialogueIndex];
    if (!activeDiag) return;

    let index = 0;
    setTypedPhaseDialogue("");
    const text = activeDiag.text;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypedPhaseDialogue(text.substring(0, index + 1));
        if (!isMuted && Math.random() > 0.45) {
          audio.playTypewriter();
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [gameState, completedPhase, phaseDialogueIndex, isMuted]);

  // Keyboard listener for advancing phase dialogue via Space/Enter keys
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'phase_dialogue') {
        const key = e.key.toLowerCase();
        if (key === ' ' || key === 'enter') {
          e.preventDefault();
          handlePhaseDialogueNext();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [gameState, completedPhase, phaseDialogueIndex, typedPhaseDialogue]);

  // Keep audio sync in state
  useEffect(() => {
    audio.muted = isMuted;
  }, [isMuted]);

  // Track per-level start time for Research Board duration stats
  useEffect(() => {
    if (gameState === 'playing') {
      levelStartedAtRef.current = Date.now();
    }
  }, [currentLevel, gameState]);

  // Handle Game Timer Tick
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time Out
            setIsTimerActive(false);
            audio.playErrorBuzz();
            return 0;
          }
          // Quiet wooden tick-tock as countdown approaches critical threshold
          if (prev <= 15) {
            audio.playTick();
          } else if (prev % 2 === 0) {
            audio.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isTimerActive, timeLeft]);

  // Current active specimen config + blueprint library metadata
  const currentSpecimen = SPECIMENS[currentLevel];
  const currentBlueprint = getExperimentBlueprint(currentLevel);
  const activePuzzleIndex = getExperimentPuzzleIndex(currentLevel);
  const activeLevelFound = foundDiffs[currentLevel] || [];
  const levelAccuracy = Math.max(
    0,
    Math.round(
      (activeLevelFound.length / (totalClicks[currentLevel] || 1)) * 100
    )
  );

  // Restart audio context on any screen tap to satisfy browser policy
  const handleUserInteraction = () => {
    audio.playClick();
  };

  // Start the playable horizontal onboarding intro
  const startPlayableIntro = () => {
    audio.playClick();
    setGameState('playable_intro');
  };

  // Start the actual game session
  const startGame = () => {
    try {
      initExperimentRun();
    } catch (err) {
      console.error('Blueprint assignment failed', err);
    }
    setGameState('playing');
    setTimeLeft(240); // 240 seconds for the entire calibration protocol
    setIsTimerActive(true);
    
    // Reset specific states dynamically for all specimens
    const initialFound: Record<number, number[]> = {};
    const initialClicks: Record<number, number> = {};
    const initialHints: Record<number, number> = {};
    SPECIMENS.forEach((_, idx) => {
      initialFound[idx] = [];
      initialClicks[idx] = 0;
      initialHints[idx] = 0;
    });
    
    setFoundDiffs(initialFound);
    setTotalClicks(initialClicks);
    setHintsUsed(initialHints);
    setExperimentRecords({});
    setCurrentLevel(0);
    levelStartedAtRef.current = Date.now();
  };

  // Handle click outside of any valid difference hotspot
  const handleMissClick = (side: 'left' | 'right') => {
    if (activeLevelFound.length === 5 || timeLeft <= 0) return;
    
    // Update accuracy statistics
    setTotalClicks(prev => ({ ...prev, [currentLevel]: (prev[currentLevel] || 0) + 1 }));
    
    // Trigger error feedback
    audio.playErrorBuzz();
    if (side === 'left') {
      setShakeLeft(true);
      setTimeout(() => setShakeLeft(false), 400);
    } else {
      setShakeRight(true);
      setTimeout(() => setShakeRight(false), 400);
    }
  };

  // Handle successful spotting of a difference
  const handleHitClick = (diffIndex: number) => {
    if (timeLeft <= 0) return;
    if (activeLevelFound.includes(diffIndex)) {
      // Already found this, treat as background touch (ignore or click click)
      audio.playClick();
      return;
    }

    const updatedFound = [...activeLevelFound, diffIndex];
    const newFoundDiffs = { ...foundDiffs, [currentLevel]: updatedFound };
    setFoundDiffs(newFoundDiffs);
    setTotalClicks(prev => ({ ...prev, [currentLevel]: (prev[currentLevel] || 0) + 1 }));

    // Satisfying bell ding
    audio.playSuccessBell();

    // Trigger Experiment 01 Tutorial "Observation Confirmed" badge
    if (currentLevel === 0 && activeLevelFound.length === 0) {
      setShowTutorialSuccess(true);
      setTimeout(() => {
        setShowTutorialSuccess(false);
      }, 3500);
    }

    // Check if this level is complete (all 5 spotted)
    if (updatedFound.length === 5) {
      researchArchive.unlockExperimentBlueprint(currentLevel, currentBlueprint.id);
      const clicksForLevel = (totalClicks[currentLevel] || 0) + 1;
      const accuracy = Math.round((5 / Math.max(5, clicksForLevel)) * 100);
      const durationSec = Math.max(1, Math.round((Date.now() - levelStartedAtRef.current) / 1000));
      setExperimentRecords((prev) => ({
        ...prev,
        [currentLevel]: { accuracy, durationSec, completedAt: Date.now() },
      }));
      if (currentLevel < SPECIMENS.length - 1) {
        // Show stamp or wait briefly, play telemetric chime
        setTimeout(() => {
          audio.playLevelUp();
        }, 800);
      } else {
        // Final Level Completed
        setIsTimerActive(false);
        // Calculate dynamic certification grade based on accuracy and speed
        const overallClicks = SPECIMENS.reduce((acc, _, idx) => acc + (newFoundDiffs[idx]?.length || 0), 0);
        const totalAccuracyClicks = SPECIMENS.reduce((acc, _, idx) => acc + (totalClicks[idx] || 0), 0) || 1;
        const avgAcc = Math.round((overallClicks / totalAccuracyClicks) * 100);
        
        let grade = "合格";
        if (avgAcc >= 90 && timeLeft >= 40) grade = "卓越敏锐度";
        else if (avgAcc >= 75) grade = "优秀敏锐度";
        else if (avgAcc >= 50) grade = "普通人类";
        else grade = "机械级退化";

        setCertificationGrade(grade);
        
        setTimeout(() => {
          audio.playWinChime();
          setGameState('completed');
        }, 1200);
      }
    }
  };

  // Handle usage of hint
  const useHint = () => {
    if (timeLeft <= 0 || activeLevelFound.length === 5) return;
    const currentHintsUsed = hintsUsed[currentLevel] || 0;
    if (currentHintsUsed >= 2) return; // Limit to 2 hints per specimen

    // Find first difference index that hasn't been found
    const missingIndex = [0, 1, 2, 3, 4].find(idx => !activeLevelFound.includes(idx));
    if (missingIndex !== undefined) {
      audio.playClick();
      setHintsUsed(prev => ({ ...prev, [currentLevel]: currentHintsUsed + 1 }));
      setActiveHint(missingIndex);
      
      // Let it pulse for 3.5 seconds
      setTimeout(() => {
        setActiveHint(null);
      }, 3500);
    }
  };

  // Advance to next specimen level with Phase completion routing
  const advanceLevel = () => {
    if (currentLevel < SPECIMENS.length - 1) {
      audio.playClick();
      
      if (currentLevel === 2) {
        // Completed Phase 1 (Experiments 01 - 03)
        setCompletedPhase(1);
        setPhaseDialogueIndex(0);
        setGameState('phase_report');
        setIsTimerActive(false); // Pause timer during narrative interludes
      } else if (currentLevel === 5) {
        // Completed Phase 2 (Experiments 04 - 06)
        setCompletedPhase(2);
        setPhaseDialogueIndex(0);
        setGameState('phase_report');
        setIsTimerActive(false);
      } else if (currentLevel === 9) {
        // Completed Phase 3 (Experiments 07 - 10)
        setCompletedPhase(3);
        setPhaseDialogueIndex(0);
        setGameState('phase_report');
        setIsTimerActive(false);
      } else {
        // Normal advancement
        setCurrentLevel(prev => prev + 1);
        // Give bonus time!
        setTimeLeft(prev => Math.min(300, prev + 60));
      }
    }
  };

  // Reset current active level progress
  const resetCurrentLevel = () => {
    audio.playClick();
    setFoundDiffs(prev => ({ ...prev, [currentLevel]: [] }));
    setTotalClicks(prev => ({ ...prev, [currentLevel]: 0 }));
    setHintsUsed(prev => ({ ...prev, [currentLevel]: 0 }));
    setActiveHint(null);
  };

  const beginResearchBoard = () => {
    audio.playClick();
    setGameState('research_board');
  };

  const beginPhaseInterlude = () => {
    const scenes = getInterludeScenesForPhase(completedPhase);
    setInterludeSceneQueue(scenes);
    setInterludeSceneIndex(0);
    setGameState('phase_interlude');
  };

  const completeInterludeScene = () => {
    if (interludeSceneIndex < interludeSceneQueue.length - 1) {
      setInterludeSceneIndex((prev) => prev + 1);
    } else {
      setGameState('phase_dialogue');
    }
  };

  const handleUnlockInterludeEntry = (entryId: string) => {
    researchArchive.unlockEntry(entryId);
  };

  const triggerLeftPanelHint = () => {
    setShowLeftPanelHint(true);
    window.setTimeout(() => setShowLeftPanelHint(false), 3500);
  };

  // Format timer string (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to determine stamp overlay visibility
  const isLevelCleared = activeLevelFound.length === 5;

  return (
    <div 
      className="relative min-h-screen bg-[#faf6eb] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-black selection:text-[#faf6eb] p-4 md:p-8 cursor-game-default"
      onClick={handleUserInteraction}
    >
      {/* PROJECTOR BULB FLICKER OVERLAY */}
      {flickerActive && (
        <div className="fixed inset-0 pointer-events-none bg-black/5 z-[9998] animate-[flicker_5s_infinite]" />
      )}

      {/* HEADER CONTROLS (Floating technical margin strip) */}
      <div className="no-print max-w-6xl mx-auto flex items-center justify-between border-b-2 border-black/40 pb-3 mb-6 text-xs font-mono tracking-widest opacity-85">
        <div className="flex items-center space-x-4">
          <span>认知测试 #402-B</span>
          <span className="hidden md:inline">//</span>
          <span className="hidden md:inline">校准年份：1968</span>
        </div>
        <div className="flex items-center space-x-6">
          {gameState !== 'intro' && (
            <button
              id="research-archive-toggle"
              onClick={(e) => {
                e.stopPropagation();
                audio.playClick();
                setShowResearchArchive(true);
              }}
              className="flex items-center space-x-1 cursor-pointer hover:underline transition-colors"
              title="研究档案馆"
            >
              <FileText className="w-4 h-4" />
              <span>[研究档案馆 ({researchArchive.entries.length})]</span>
            </button>
          )}
          {/* Flicker Toggle */}
          <button 
            id="flicker-toggle"
            onClick={(e) => { e.stopPropagation(); setFlickerActive(!flickerActive); audio.playClick(); }}
            className={`cursor-pointer hover:underline transition-colors ${flickerActive ? 'text-black font-bold' : 'text-black/40'}`}
          >
            [投影仪: {flickerActive ? '开启' : '关闭'}]
          </button>
          
          {/* Audio Toggle */}
          <button 
            id="mute-toggle"
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="flex items-center space-x-1 cursor-pointer hover:text-black/60 transition-colors"
            title={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#d94141]" /> : <Volume2 className="w-4 h-4 text-black" />}
            <span>[{isMuted ? "已静音" : "声音: 开启"}]</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          STATE 1: SCIENTIFIC LABORATORY BRIEFING INTRO
         -------------------------------------------------------------------- */}
      {gameState === 'intro' && (
        <div className="max-w-3xl mx-auto my-8 border-4 border-black p-8 md:p-12 bg-[#faf4ea] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transition-all duration-300">
          {/* Accent corners */}
          <div className="absolute top-2 left-2 right-2 bottom-2 border border-black/10 pointer-events-none" />
          
          <div className="text-center space-y-4 mb-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#d94141] font-bold">
              控制论测试校准学部
            </h3>
            <h1 className="font-serif font-black text-4xl md:text-6xl tracking-tight leading-none text-black uppercase letterpress-text">
              人类是否<br className="hidden md:inline" />
              足够敏锐？
            </h1>
            <p className="font-mono text-xs text-black/50 tracking-wider">
              官方方案 // 售价 35 美分 // 标本公告第 12 号
            </p>
          </div>

          <div className="border-t-4 border-double border-black my-6" />

          {/* Typewritten Hypothesis Box */}
          <div className="bg-[#faf6eb] border-2 border-black p-6 font-mono text-sm leading-relaxed min-h-[220px] text-justify relative">
            <span className="absolute -top-3 left-4 bg-black text-white px-2 py-0.5 text-[10px] tracking-widest uppercase">
              假说声明
            </span>
            <p className="whitespace-pre-line text-[#1a1a1a]">
              {introText}
              {typingIndexRef.current < fullIntroText.length && (
                <span className="typewriter-cursor text-[#d94141]" />
              )}
            </p>
          </div>

          {/* Visual constraints checklist */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-black/75">
            <div className="flex items-start space-x-2">
              <span className="text-[#d94141] font-bold">[!]</span>
              <span>时间限制：120秒动态校准倒计时。找对差异可稳定神经。</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#d94141] font-bold">[!]</span>
              <span>印章稳定性：错误点击会使技术图板震动，并降低准确度。</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#d94141] font-bold">[!]</span>
              <span>标本规格：13 份渐进式技术图纸，分 3 个评估阶段。每份 5 处差异。</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-[#d94141] font-bold">[!]</span>
              <span>荣誉证书：成功的观察者将获得官方认证的视觉敏锐度凭证。</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center space-y-4">
            <button
              id="start-button"
              onClick={startPlayableIntro}
              className="w-full md:w-auto flex items-center justify-center space-x-3 cursor-pointer bg-black text-[#faf6eb] font-mono text-base uppercase font-bold tracking-widest px-10 py-5 border-2 border-black hover:bg-[#faf6eb] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(217,65,65,1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <Play className="w-5 h-5 stroke-[3]" />
              <span>开始实验</span>
            </button>
            <span className="font-mono text-[9px] text-black/40 uppercase tracking-widest">
              警告：请仅在光学传感器完全适应时继续
            </span>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          STATE 1.5: INTERACTIVE WALKING & CONVERSATION INTRO
         -------------------------------------------------------------------- */}
      {gameState === 'playable_intro' && (
        <PlayableIntro
          onComplete={startGame}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          audio={audio}
        />
      )}

      {/* --------------------------------------------------------------------
          STATE 2: ACTIVE SPOT-THE-DIFFERENCE GAMEPLAY
         -------------------------------------------------------------------- */}
      {gameState === 'playing' && (
        <div className="max-w-6xl mx-auto my-2">
          {/* Technical Manual Banner Header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end border-b-4 border-black pb-4 mb-6">
            <div className="lg:col-span-2">
              <span className="font-mono text-xs uppercase text-[#d94141] tracking-widest font-bold">
                评估方案：进度公告
              </span>
              <h1 className="font-serif font-black text-4xl md:text-5xl leading-none uppercase tracking-tight text-black mt-1 letterpress-text">
                人类是否足够敏锐？
              </h1>
              <p className="font-mono text-xs text-black/60 mt-1 max-w-xl">
                对比原始蓝图（左）和标本复制图（右）。直接点击异常区域来找出其中的 5 处不同。
              </p>
            </div>
            <div className="bg-[#faf4ea] border-2 border-black p-3 font-mono text-xs flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between border-b border-black/20 pb-1 mb-1">
                <span className="text-black/50">认知指数：</span>
                <span className={`font-bold ${levelAccuracy < 50 ? 'text-[#d94141]' : 'text-black'}`}>
                  {levelAccuracy}% 准确率
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">当前标本：</span>
                <span className="font-bold uppercase text-black">
                  第 {currentLevel + 1} 个 / 共 {SPECIMENS.length} 个
                </span>
              </div>
            </div>
          </div>

          {/* ABOVE ILLUSTRATION INDICATORS: TIMERS & COUNTERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
            {/* TENSION / TEMPERATURE GAUGE TIMER */}
            <div className="bg-[#faf4ea] border-2 border-black p-4 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between font-mono text-xs text-black/60 mb-2">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>校准刻度盘</span>
                </span>
                <span className={`font-mono font-bold ${timeLeft <= 20 ? 'text-[#d94141] animate-pulse' : 'text-black'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Dynamic Retro Gauge Bar */}
              <div className="w-full h-5 bg-black/10 border border-black relative overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    timeLeft <= 20 
                      ? 'bg-[#d94141] opacity-90' 
                      : timeLeft <= 45 
                        ? 'bg-[#e09834]' 
                        : 'bg-black'
                  }`}
                  style={{ width: `${Math.min(100, (timeLeft / 240) * 100)}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider font-bold mix-blend-difference text-white">
                  压力水平
                </span>
              </div>
            </div>

            {/* PROGRESS COUNTER SHEET */}
            <div className="bg-[#faf4ea] border-2 border-black p-4 flex flex-col justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="text-center">
                <span className="font-mono text-[9px] uppercase tracking-widest text-black/50 block">
                  异常追踪器
                </span>
                <h4 className="font-serif font-black text-2xl tracking-tight text-black mt-1">
                  已隔离 {activeLevelFound.length} / 5 处
                </h4>
                
                {/* Dots representation */}
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {[0, 1, 2, 3, 4].map((dotIdx) => (
                    <div 
                      key={dotIdx} 
                      className={`w-3 h-3 rounded-full border border-black ${
                        activeLevelFound.length > dotIdx 
                          ? 'bg-[#d94141]' 
                          : 'bg-transparent'
                      }`}
                      title={activeLevelFound.length > dotIdx ? "发现差异" : "未检出差异"}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* CHOSEN LEVEL DETAILS */}
            <div className="bg-[#faf4ea] border-2 border-black p-4 flex flex-col justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-mono leading-normal text-black/80">
              <span className="text-[9px] text-[#d94141] font-bold uppercase tracking-wider mb-0.5">
                [{getCategoryLabel(currentBlueprint.category)}] {currentBlueprint.title}
              </span>
              <span className="font-bold text-black border-b border-black/20 pb-1 mb-1 block uppercase">
                {currentSpecimen.subtitle}
              </span>
              <p className="text-[11px] line-clamp-3">
                {currentSpecimen.technicalDetails}
              </p>
            </div>
          </div>

          {/* Blueprint library subject — visible illustration identity */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-2 border-black bg-[#faf4ea] px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-mono text-[10px]">
            <div>
              <span className="text-[#d94141] font-bold uppercase tracking-wider">蓝图库 #{currentBlueprint.id.replace('bp-', '').toUpperCase()}</span>
              <span className="text-black/40 mx-2">//</span>
              <span className="font-bold text-black">{currentBlueprint.title}</span>
            </div>
            <div className="text-black/55 uppercase tracking-wide">
              {getCategoryLabel(currentBlueprint.category)} · 难度 T{currentBlueprint.difficultyTier} · 阶段 {currentBlueprint.phase}
            </div>
          </div>

          {/* THE SPECIMEN CARD - CONTAINS BOTH DRAWINGS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* LEFT ORIGINAL SPECIMEN PANEL */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between font-mono text-xs uppercase px-2">
                <span className="text-black/40">图板 A // 原始蓝图</span>
                <span className="bg-black text-white px-2 py-0.5 text-[9px] font-bold tracking-widest">原始</span>
              </div>
              
              <div 
                id="original-panel"
                className={`relative w-full aspect-square border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#faf4ea] ${puzzlePanelCursor('left', isLevelCleared)} transition-transform duration-300 ${shakeLeft ? 'animate-shake border-[#d94141]' : ''}`}
              >
                {/* Dynamically render the correct custom vector SVG */}
                {(() => {
                  const PuzzleComp = PUZZLE_COMPONENTS[activePuzzleIndex];
                  if (!PuzzleComp) return null;
                  return (
                    <PuzzleComp
                      side="left"
                      foundDiffs={activeLevelFound}
                      onFindDiff={handleHitClick}
                      onMiss={() => handleMissClick('left')}
                      onLeftPanelHint={triggerLeftPanelHint}
                    />
                  );
                })()}

                {showLeftPanelHint && (
                  <div className="absolute bottom-4 inset-x-3 z-20 bg-black/90 text-[#faf6eb] border border-[#d94141] px-3 py-2 text-[9px] font-mono animate-fade-in">
                    图板 A 仅供对照。请在图板 B（右侧）点击复制图中的可见异常。
                  </div>
                )}

                {/* PULSING HINT OVERLAY CIRCLE (Master side too) */}
                {activeHint !== null && (
                  <div 
                    className="absolute pointer-events-none rounded-full border-4 border-[#d94141] border-dashed animate-ping opacity-60"
                    style={{
                      // Approx positions based on static node coordinates
                      ...getHintOverlayStyle(activePuzzleIndex, activeHint)
                    }}
                  />
                )}

                {/* LEVEL CLEARED INK STAMP OVERLAY */}
                {isLevelCleared && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none bg-white/10 backdrop-blur-[0.5px]">
                    <div className="border-4 border-dashed border-[#d94141] text-[#d94141] font-mono font-bold text-3xl md:text-4xl tracking-widest px-8 py-4 uppercase bg-[#faf4ea]/90 shadow-lg animate-stamp">
                      标本已确认
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SPECIMEN SPECIMEN PANEL (WITH DIFFERENCES TO SPARK ON) */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between font-mono text-xs uppercase px-2">
                <span className="text-black/40">图板 B // 标本复制图</span>
                <span className="bg-[#d94141] text-white px-2 py-0.5 text-[9px] font-bold tracking-widest">测试记录 · 在此点击异常</span>
              </div>
              
              <div 
                id="specimen-panel"
                className={`relative w-full aspect-square border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-[#faf4ea] ${puzzlePanelCursor('right', isLevelCleared)} transition-transform duration-300 ${shakeRight ? 'animate-shake border-[#d94141]' : ''}`}
              >
                {/* Dynamically render the correct custom vector SVG */}
                {(() => {
                  const PuzzleComp = PUZZLE_COMPONENTS[activePuzzleIndex];
                  if (!PuzzleComp) return null;
                  return (
                    <PuzzleComp
                      side="right"
                      foundDiffs={activeLevelFound}
                      onFindDiff={handleHitClick}
                      onMiss={() => handleMissClick('right')}
                    />
                  );
                })()}

                {/* PULSING HINT OVERLAY CIRCLE (Target side) */}
                {activeHint !== null && (
                  <div 
                    className="absolute pointer-events-none rounded-full border-4 border-[#d94141] border-dashed animate-ping opacity-60"
                    style={{
                      ...getHintOverlayStyle(activePuzzleIndex, activeHint)
                    }}
                  />
                )}

                {/* LEVEL CLEARED INK STAMP OVERLAY */}
                {isLevelCleared && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none bg-white/10 backdrop-blur-[0.5px]">
                    <div className="border-4 border-dashed border-[#d94141] text-[#d94141] font-mono font-bold text-3xl md:text-4xl tracking-widest px-8 py-4 uppercase bg-[#faf4ea]/90 shadow-lg animate-stamp">
                      人类合格
                    </div>

                  </div>
                )}

                {/* TUTORIAL HIGHLIGHT PULSE FOR EXPERIMENT 01 */}
                {currentLevel === 0 && activeLevelFound.length === 0 && (
                  <>
                    <div 
                      className="absolute pointer-events-none rounded-full border-4 border-[#d94141] border-dashed animate-pulse"
                      style={{
                        ...getHintOverlayStyle(0, 0),
                        boxShadow: '0 0 15px rgba(217,65,65,0.8)'
                      }}
                    />
                    <div className="absolute top-4 left-4 z-20 bg-black text-[#faf6eb] border border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(217,65,65,1)] text-[10px] tracking-wider uppercase font-bold animate-pulse max-w-[80%] rounded-sm">
                      <span>【测控协议：一号差动校准】</span><br />
                      <span className="text-[#f3ca52] text-[9px]">请仔细比对左右图板，点击右侧手腕上缺少的螺丝。</span>
                    </div>
                  </>
                )}

                {/* TUTORIAL SUCCESS TOAST ALERT */}
                {currentLevel === 0 && showTutorialSuccess && (
                  <div className="absolute inset-x-4 top-4 z-30 bg-green-800 text-[#faf6eb] border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center animate-bounce rounded-sm">
                    <h4 className="font-mono text-xs font-black tracking-widest text-[#f3ca52]">
                      OBSERVATION CONFIRMED // 观察确认成功
                    </h4>
                    <p className="font-mono text-[9px] text-white/90 mt-1 uppercase">
                      异常已隔离。请继续在图板 B 上找出其余 4 处差异。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GAME ACTION BUTTONS BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t-2 border-black pt-4 mt-6">
            <div className="flex items-center space-x-2">
              {/* Hint button */}
              <button
                id="hint-button"
                onClick={useHint}
                disabled={activeLevelFound.length === 5 || (hintsUsed[currentLevel] || 0) >= 2 || activeHint !== null}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 cursor-pointer bg-white border-2 border-black px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-black hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <HelpCircle className="w-4 h-4" />
                <span>提示 (剩余 {2 - (hintsUsed[currentLevel] || 0)} 次)</span>
              </button>

              {/* Reset level */}
              <button
                id="reset-button"
                onClick={resetCurrentLevel}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-2 cursor-pointer bg-white border-2 border-black px-4 py-2 text-xs font-mono font-bold uppercase hover:bg-[#d94141] hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <RotateCcw className="w-4 h-4" />
                <span>重置图板</span>
              </button>
            </div>

            {/* Next stage / Completed button */}
            {isLevelCleared ? (
              currentLevel < SPECIMENS.length - 1 ? (
                <button
                  id="next-test-button"
                  onClick={advanceLevel}
                  className="flex items-center justify-center space-x-2 cursor-pointer bg-black text-[#faf6eb] border-2 border-black px-6 py-3 text-xs font-mono font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(217,65,65,1)] animate-pulse"
                >
                  <span>校准下一标本</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="animate-pulse bg-[#d94141] text-white border-2 border-black px-6 py-3 text-xs font-mono font-bold uppercase flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>正在传输人类诊断数据...</span>
                </div>
              )
            ) : currentLevel >= 1 && activeLevelFound.length === 0 && !activeHint ? (
              <span className="font-mono text-[10px] text-black/55 text-right uppercase tracking-widest italic py-2 max-w-xs">
                比对两图后，在图板 B 点击可见异常 · 误点左图不计分
              </span>
            ) : (
              <span className="font-mono text-[10px] text-black/50 text-right uppercase tracking-widest italic py-2">
                * 找出全部 5 处不同以校准标本遥测数据。
              </span>
            )}
          </div>

          {/* SPLIT GRID: LAB ANOMALY LOG & REAL-TIME TELEMETRY LOG */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* LAB ANOMALY LOG */}
            <div className="bg-[#faf4ea] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono text-[11px] leading-relaxed flex flex-col justify-between">
              <div>
                <span className="text-black/50 font-bold block uppercase border-b border-black/10 pb-1 mb-2">
                  标本实验室异常清单 (已检出轮廓)
                </span>
                {activeLevelFound.length === 0 ? (
                  <p className="text-black/40 italic">等待人类检测输入...</p>
                ) : (
                  <ul className="space-y-2 list-none pl-0 text-black/80 max-h-[180px] overflow-y-auto pr-1">
                    {activeLevelFound.map((idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-black">
                        <span className="text-[#d94141] font-bold mt-0.5">✓</span>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                          <span className="font-semibold text-[9px] bg-black/5 px-1 py-0.5 border border-black/10 uppercase shrink-0">
                            异常 #{idx + 1}
                          </span>
                          <span className="text-[11px]">{currentSpecimen.differences[idx]}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* REAL-TIME TELEMETRY LOG */}
            <div className="bg-[#faf4ea] border-2 border-black p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono text-[11px] leading-relaxed flex flex-col">
              <span className="text-[#d94141] font-bold block uppercase border-b border-black/10 pb-1 mb-2 flex items-center justify-between">
                <span>实时临床遥测观察日志</span>
                <span className="bg-[#d94141]/10 px-1.5 py-0.5 text-[8px] tracking-widest font-bold">连接在线 // 1968</span>
              </span>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1 flex-1">
                {getPlayerMonitoringLogs(currentLevel, activeLevelFound.length, timeLeft).map((log, lIdx) => (
                  <div key={lIdx} className={`text-[10px] leading-relaxed border-b border-black/5 pb-1 flex items-start space-x-2 ${log.highlight ? 'text-[#d94141] font-semibold bg-[#d94141]/5 p-1 border border-dashed border-[#d94141]/20' : 'text-black/70'}`}>
                    <span className="opacity-50 font-mono shrink-0">[{log.time}]</span>
                    <span>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAILURE GAME OVER DIALOG */}
          {timeLeft <= 0 && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[10000] no-print">
              <div className="max-w-md w-full bg-[#faf4ea] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(217,65,65,1)] text-center relative">
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-black/10 pointer-events-none" />
                <AlertTriangle className="w-12 h-12 text-[#d94141] mx-auto animate-bounce" />
                <h2 className="font-serif font-black text-3xl text-black uppercase tracking-tight mt-4 letterpress-text">
                  校准失败
                </h2>
                <p className="font-mono text-xs text-[#d94141] uppercase tracking-widest font-bold mt-1">
                  观察力完整性发生衰退
                </p>
                <p className="font-mono text-xs text-black/75 mt-4 leading-relaxed">
                  您的时间配额已完全耗尽。控制论校准系统无法认证您的有机视觉准确度阈值。
                </p>
                
                <div className="border-t border-black/20 my-6" />

                <button
                  id="restart-failure-button"
                  onClick={startGame}
                  className="w-full flex items-center justify-center space-x-2 bg-black text-white py-3 font-mono text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black transition-colors shadow-[3px_3px_0px_0px_rgba(217,65,65,1)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重新尝试临床测试</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------
          STATE 2.5: PHASE COMPLETE REPORT AND RESEARCHER STORY DIALOGUE
         -------------------------------------------------------------------- */}
      {gameState === 'phase_report' && (
        <div className="max-w-2xl mx-auto my-8 animate-fade-in no-print">
          <div className="relative bg-[#faf4ea] border-4 border-black p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a]">
            <div className="absolute inset-2 border border-black/15 pointer-events-none" />
            
            {/* Top Header Stamp */}
            <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
              <div>
                <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 uppercase tracking-widest font-black">
                  CLASSIFIED // COGNITIVE MAPPING BUREAU
                </span>
                <h2 className="font-serif font-black text-2xl uppercase tracking-tight text-black mt-2">
                  阶段性人类观察评估报告
                </h2>
                <p className="font-mono text-[10px] text-black/50 tracking-wider">
                  SECTION STATUS EVALUATION — FORM #402-B
                </p>
              </div>
              <div className="border border-[#d94141] text-[#d94141] font-mono font-bold text-center text-[10px] p-2 leading-none rotate-6 select-none shrink-0 border-double border-4">
                CONFIDENTIAL<br />
                <span className="text-[8px] font-normal opacity-80">1968 ARCHIVE</span>
              </div>
            </div>

            {/* Dynamic details */}
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">被测主体编号 // SUBJECT REGISTER:</span>
                <span className="font-bold text-black">{userName || "第 402 号主体"}</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">已完成评估阶段 // EVALUATION PHASE:</span>
                <span className="font-bold text-[#d94141] uppercase">
                  {completedPhase === 1 ? "第一阶段 [基础校准] FOUNDATION" :
                   completedPhase === 2 ? "第二阶段 [记忆系统] MEMORY SYSTEMS" :
                   "第三阶段 [预测与观测] PREDICTION & OBSERVATION"}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">观察异常点击准确率 // SYSTEM CLICK ACCURACY:</span>
                <span className="font-bold text-black">
                  {(() => {
                    const phaseLevels = completedPhase === 1 ? [0, 1, 2] : completedPhase === 2 ? [3, 4, 5] : [6, 7, 8, 9];
                    let clicks = 0;
                    let found = phaseLevels.length * 5;
                    phaseLevels.forEach(idx => {
                      clicks += totalClicks[idx] || 0;
                    });
                    const acc = Math.round((found / Math.max(found, clicks)) * 100);
                    return `${acc}%`;
                  })()}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">注意力阻尼系数 // STABILITY METRICS:</span>
                <span className="font-bold text-black">
                  {(() => {
                    const phaseLevels = completedPhase === 1 ? [0, 1, 2] : completedPhase === 2 ? [3, 4, 5] : [6, 7, 8, 9];
                    let clicks = 0;
                    let found = phaseLevels.length * 5;
                    phaseLevels.forEach(idx => {
                      clicks += totalClicks[idx] || 0;
                    });
                    const acc = Math.round((found / Math.max(found, clicks)) * 100);
                    if (acc >= 90) return "卓越稳定性 (Excellent Stability)";
                    if (acc >= 75) return "标准水平 (Standard)";
                    return "注意力滞后 (Focus Lag Detected)";
                  })()}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">神经触突相干性 // COHERENCE STATUS:</span>
                <span className="font-bold text-black">
                  {(() => {
                    const phaseLevels = completedPhase === 1 ? [0, 1, 2] : completedPhase === 2 ? [3, 4, 5] : [6, 7, 8, 9];
                    let hints = 0;
                    phaseLevels.forEach(idx => {
                      hints += hintsUsed[idx] || 0;
                    });
                    if (hints === 0) return "高维相干 (Superior Synaptic Coherence)";
                    if (hints <= 2) return "稳态对齐 (Optimal Alignment)";
                    return "边缘相干 (Marginal Synaptic Alignment)";
                  })()}
                </span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-2">
                <span className="text-black/50">临床认知完整性评价 // OBSERVATION STAMP:</span>
                <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 border border-green-700/20 uppercase text-[10px]">
                  人类意识对齐正常 // PASS INTEGRITY
                </span>
              </div>
            </div>

            {/* Vintage stamps / notes section */}
            <div className="bg-[#faf6eb]/50 border border-black/10 p-4 mt-6 text-[11px] font-mono text-black/60 leading-relaxed rounded-sm">
              <p className="font-bold text-black border-b border-black/10 pb-1 mb-1">
                主管研究助理评注 // OBSERVER CLINICAL NOTES:
              </p>
              <p>
                {completedPhase === 1 ? "【观察记录：主体展现出了令人惊叹的网膜细节比对效率，校准网路传输已经通过其神经光环锁定。准备移交下一级别图板。】" :
                 completedPhase === 2 ? "【警告：真空管热磁电位正在上升，主体点击位置与多维异常吻合度达 98%。脑电眼球反应出现不自然的频率共振，怀疑其意识已被校准协议捕获。】" :
                 "【紧急：在第 9 标本校准中，检测到低维度塌陷出现反向锚定，被测主体对异常的消除正在物理层面逆转维度降级。必须立刻推进到终极身份验证协议。】"}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex flex-col items-end gap-2">
              <p className="font-mono text-[9px] text-black/50 text-right max-w-sm">
                下一步：进入实验室规划室，查看总体规划板更新，随后进行间歇探索。
              </p>
              <button
                onClick={beginResearchBoard}
                className="flex items-center space-x-2 bg-black text-[#faf6eb] border-2 border-black px-6 py-3 text-xs font-mono font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(217,65,65,1)]"
              >
                <span>进入规划室 // RESEARCH BOARD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {gameState === 'research_board' && (
        <ResearchBoard
          completedPhase={completedPhase}
          currentLevel={currentLevel}
          foundDiffs={foundDiffs}
          experimentRecords={experimentRecords}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          audio={audio}
          onComplete={beginPhaseInterlude}
        />
      )}

      {gameState === 'phase_interlude' && interludeSceneQueue[interludeSceneIndex] && (
        <PhaseInterlude
          scene={getInterludeScene(interludeSceneQueue[interludeSceneIndex])}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          audio={audio}
          onUnlockEntry={handleUnlockInterludeEntry}
          onComplete={completeInterludeScene}
          continueLabel={
            interludeSceneIndex < interludeSceneQueue.length - 1
              ? '前往下一区域 // NEXT SECTOR'
              : '开启叙事研讨 // START DIALOGUE'
          }
        />
      )}

      {gameState === 'phase_dialogue' && (
        <div className="max-w-2xl mx-auto my-12 animate-fade-in no-print">
          <div className="bg-[#faf4ea] border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-[#1a1a1a] relative">
            <div className="absolute inset-1.5 border border-black/10 pointer-events-none" />
            
            {/* Dialogue Header */}
            <div className="flex items-center justify-between border-b border-black/25 pb-3 mb-6 font-mono text-[10px] tracking-widest text-black/50">
              <span>临床诊断界面 // MERGE PANEL</span>
              <span>ONLINE // 1968</span>
            </div>

            {/* Speaker Name / Banner */}
            <div className="font-mono text-xs font-bold text-[#d94141] mb-2 bg-[#d94141]/5 px-2.5 py-1 border border-dashed border-[#d94141]/20 inline-block uppercase tracking-wider">
              {PHASE_DIALOGUES[completedPhase]?.[phaseDialogueIndex]?.name}
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-6 mt-2">
              <EvelynMercerPortrait size={160} variant="monitor" className="self-center md:self-start" />

              {/* Dialogue text */}
              <div className="flex-1 flex flex-col justify-between py-1 min-h-[120px]">
                <p className="font-serif font-semibold text-lg md:text-xl text-black leading-relaxed tracking-wide italic whitespace-pre-line">
                  {typedPhaseDialogue}
                </p>

                {/* Next dialogue trigger button */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handlePhaseDialogueNext}
                    className="flex items-center space-x-2 bg-black text-[#faf6eb] border-2 border-black px-5 py-2 text-xs font-mono font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(217,65,65,1)]"
                  >
                    <span>
                      {phaseDialogueIndex < (PHASE_DIALOGUES[completedPhase]?.length - 1) 
                        ? "继续对话 // CONTINUE [SPACE]" 
                        : "进入下一阶段 // PROCEED [ENTER]"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------
          STATE 3: TRIAL COMPLETED - OFFICIAL CREDENTIAL DIPLOMA
         -------------------------------------------------------------------- */}
      {gameState === 'completed' && (
        <div className="max-w-4xl mx-auto my-4 transition-all duration-500">
          
          {/* Certificate Container Styled like old government issue document */}
          <div className="relative border-8 border-double border-black p-6 md:p-12 bg-[#faf4ea] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
            
            {/* Ornate corner frames */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-black/25 pointer-events-none" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-black/10 pointer-events-none" />

            <div className="space-y-6 max-w-2xl mx-auto">
              
              {/* Header crest */}
              <div className="flex justify-center items-center space-x-4">
                <div className="w-12 h-0.5 bg-black" />
                <Award className="w-10 h-10 text-black stroke-[1.5]" />
                <div className="w-12 h-0.5 bg-black" />
              </div>

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#d94141] font-bold block">
                  国家控制论认知验证委员会
                </span>
                <h1 className="font-serif font-black text-4xl md:text-5xl uppercase tracking-tight text-black leading-none letterpress-text">
                  视觉观察力<br />
                  认证证书
                </h1>
                <span className="font-mono text-[9px] text-black/50 tracking-widest block uppercase">
                  设立于1968年控制论委员会 // 结合标本异常测试方案
                </span>
              </div>

              <div className="border-t border-black/20 my-6 max-w-lg mx-auto" />

              <p className="font-mono text-xs leading-relaxed text-black/80 max-w-xl mx-auto text-justify md:text-center">
                此文献旨在记录在动态图纸时间分析中所收集的实证验证数据。证书获得者通过其强大的有机眼部折射力与突触边缘聚焦力，成功隔离了旨在规避自动扫描装置的全部 {SPECIMENS.length * 5} 处技术异常。
              </p>

              {/* Recipient Interactive Input Field */}
              <div className="bg-[#faf6eb] border-2 border-black p-4 inline-block mx-auto max-w-md w-full no-print">
                <label className="block font-mono text-[9px] uppercase tracking-widest text-black/60 mb-2">
                  输入获得者姓名以进行校准存档：
                </label>
                <input 
                  id="recipient-name-input"
                  type="text" 
                  value={userName} 
                  onChange={(e) => { setUserName(e.target.value.toUpperCase()); audio.playTypewriter(); }}
                  maxLength={32}
                  className="w-full bg-white text-center font-mono text-lg font-bold uppercase tracking-widest border border-black px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Dynamic printed line on paper */}
              <div className="py-2">
                <span className="font-mono text-xs uppercase tracking-widest text-black/40 block">
                  特此宣告
                </span>
                <h2 className="font-serif text-3xl font-bold tracking-wider text-black border-b-2 border-black/30 border-dashed inline-block px-10 py-1 uppercase mt-1">
                  {userName || "测试参与者"}
                </h2>
              </div>

              <p className="font-mono text-sm leading-normal text-black font-semibold">
                已成功隔离全部 <span className="text-[#d94141]">{SPECIMENS.length * 5} 处标本异常</span> <br />
                准确率等级评定为：
              </p>

              {/* Rating Seal Frame */}
              <div className="inline-block relative p-4 border-4 border-double border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] my-2">
                <span className="font-mono text-[10px] uppercase text-black/50 block tracking-widest">观察力系数</span>
                <span className="font-serif font-black text-2xl md:text-3xl text-[#d94141] block tracking-tight mt-1">
                  {certificationGrade}
                </span>
              </div>

              {/* Trial Stats Summary table */}
              <div className="max-w-md mx-auto bg-white/60 border border-black p-4 font-mono text-[11px] space-y-1 text-left">
                <div className="flex justify-between border-b border-black/10 pb-1 mb-1 font-bold">
                  <span>度量指标</span>
                  <span>实验室读数</span>
                </div>
                <div className="flex justify-between">
                  <span>累计节省时间:</span>
                  <span className="font-bold">{timeLeft} 秒</span>
                </div>
                <div className="flex justify-between">
                  <span>总计异常错误点击数:</span>
                  <span className="font-bold text-[#d94141]">
                    {Math.max(0, SPECIMENS.reduce((acc, _, idx) => acc + (totalClicks[idx] || 0), 0) - (SPECIMENS.length * 5))} 次失误
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>临床咨询提示使用数:</span>
                  <span className="font-bold">
                    {SPECIMENS.reduce((acc, _, idx) => acc + (hintsUsed[idx] || 0), 0)} / {SPECIMENS.length * 2}
                  </span>
                </div>
              </div>

              {/* Signature block */}
              <div className="grid grid-cols-2 gap-8 pt-6 text-left max-w-lg mx-auto border-t border-black/10">
                <div className="font-mono text-[10px] space-y-1">
                  <div className="h-8 border-b border-black/30 flex items-end">
                    <span className="font-serif italic text-sm text-[#d94141] opacity-80 leading-none pb-0.5 font-bold">A. Vance</span>
                  </div>
                  <span className="block font-bold text-black/70">亚瑟·凡斯 博士 (Dr. Arthur Vance)</span>
                  <span className="block text-[8px] text-black/40 leading-none">观察控制论主任</span>
                </div>
                <div className="font-mono text-[10px] space-y-1">
                  <div className="h-8 border-b border-black/30 flex items-end">
                    <span className="font-serif italic text-sm text-[#d94141] opacity-80 leading-none pb-0.5 font-bold">E. Mercer</span>
                  </div>
                  <span className="block font-bold text-black/70">伊芙琳·默瑟 博士 (Dr. Evelyn Mercer)</span>
                  <span className="block text-[8px] text-black/40 leading-none">首席认知心理检测学家</span>
                </div>
              </div>

              {/* Stamp graphics */}
              <div className="pt-4 flex justify-center space-x-6 items-center">
                {/* Vintage Circular Seal */}
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#d94141] flex items-center justify-center p-1 rotate-12">
                  <div className="w-full h-full rounded-full border border-[#d94141] flex flex-col items-center justify-center text-[7px] font-mono font-bold text-[#d94141] leading-none text-center">
                    <span>控制论</span>
                    <span className="my-0.5 text-[8px]">1968</span>
                    <span>核准印信</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Action buttons under the diploma */}
          <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Print function */}
            <button
              id="print-certificate-button"
              onClick={() => { audio.playClick(); window.print(); }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer bg-black text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#faf4ea] hover:text-black border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <Printer className="w-4 h-4" />
              <span>打印校准记录</span>
            </button>

            {/* Restart all */}
            <button
              id="restart-all-button"
              onClick={startGame}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer bg-white text-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#d94141] hover:text-white border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重新进行实验</span>
            </button>
          </div>
        </div>
      )}

      {/* FOOTER BULLETINS */}
      <div className="no-print max-w-6xl mx-auto text-center border-t border-black/25 pt-6 mt-12 mb-6 font-mono text-[9px] text-black/40 uppercase tracking-widest leading-loose">
        <span>实验受国家控制论认知法令协调组织。</span>
        <br />
        <span>记录已存储于中央大型机档案馆。保留所有存储在内存缓冲区内的权利，1968。</span>
      </div>

      {showResearchArchive && (
        <ResearchArchiveMenu
          archive={researchArchive}
          onClose={() => {
            audio.playClick();
            setShowResearchArchive(false);
          }}
          onOpenEntry={(entry) => {
            audio.playClick();
            setViewingArchiveEntry(entry);
          }}
        />
      )}

      {viewingArchiveEntry && (
        <ArchiveCardModal
          entry={viewingArchiveEntry}
          onClose={() => {
            audio.playClick();
            setViewingArchiveEntry(null);
          }}
        />
      )}
    </div>
  );
}
