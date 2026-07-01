import type { InterludeScene } from './types';

const W = 1000;

export const INTERLUDE_SCENES: Record<string, InterludeScene> = {
  archive_room: {
    id: 'archive_room',
    title: '档案室',
    subtitle: 'ARCHIVE ROOM // SECTOR B1',
    sectorLabel: '国家认知校准部 // 档案室 B1',
    phase: 1,
    worldWidth: W,
    objects: [
      { id: 'obj-filing-cabinet', name: '钢制档案柜 #402', x: 70, y: 130, width: 78, height: 115, archiveEntryId: 'arch-filing-cabinet-402' },
      { id: 'obj-subject-roster', name: '实验主体名册', x: 200, y: 268, width: 62, height: 52, archiveEntryId: 'arch-subject-roster' },
      { id: 'obj-polaroid-wall', name: '宝丽来观测墙', x: 330, y: 72, width: 130, height: 72, archiveEntryId: 'arch-polaroid-wall', accent: '#d94141' },
      { id: 'obj-punch-drawer', name: '打孔卡索引抽屉', x: 420, y: 258, width: 72, height: 55, archiveEntryId: 'arch-punch-card-drawer' },
      { id: 'obj-red-memo', name: '红色印章备忘录', x: 530, y: 278, width: 52, height: 42, archiveEntryId: 'arch-red-stamped-memo', accent: '#d94141' },
      { id: 'obj-microfilm', name: '微缩胶片阅读机', x: 620, y: 248, width: 82, height: 62, archiveEntryId: 'arch-microfilm-reader' },
      { id: 'obj-mercury-log', name: '水银温度计日志', x: 750, y: 175, width: 55, height: 78, archiveEntryId: 'arch-mercury-log' },
      { id: 'obj-cal-seal', name: '校准学部印信', x: 860, y: 265, width: 48, height: 48, archiveEntryId: 'arch-calibration-seal' },
    ],
  },
  observation_hall: {
    id: 'observation_hall',
    title: '观测大厅',
    subtitle: 'OBSERVATION HALL // SECTOR C2',
    sectorLabel: '临床遥测部 // 观测大厅 C2',
    phase: 2,
    worldWidth: W,
    objects: [
      { id: 'obj-logbook', name: '观测员值班日志', x: 120, y: 270, width: 58, height: 45, archiveEntryId: 'arch-observer-logbook' },
      { id: 'obj-eeg-chair', name: 'EEG 受测座椅', x: 210, y: 220, width: 75, height: 88, archiveEntryId: 'arch-eeg-chair' },
      { id: 'obj-mirror', name: '单向观察镜', x: 380, y: 85, width: 140, height: 58, archiveEntryId: 'arch-one-way-mirror', accent: 'emerald' },
      { id: 'obj-retina-proj', name: '视网膜投影器', x: 560, y: 200, width: 85, height: 72, archiveEntryId: 'arch-retina-projector' },
      { id: 'obj-ceiling-cam', name: '天花板追踪摄像头', x: 480, y: 55, width: 52, height: 38, archiveEntryId: 'arch-ceiling-camera' },
      { id: 'obj-intercom', name: '内部通话面板', x: 470, y: 278, width: 62, height: 48, archiveEntryId: 'arch-intercom-panel' },
      { id: 'obj-cylinder', name: '标本密封圆筒', x: 680, y: 265, width: 48, height: 58, archiveEntryId: 'arch-specimen-cylinder' },
      { id: 'obj-vacuum-rack', name: '真空管阵列架', x: 780, y: 155, width: 95, height: 105, archiveEntryId: 'arch-vacuum-tube-rack' },
    ],
  },
  engineering_workshop: {
    id: 'engineering_workshop',
    title: '工程车间',
    subtitle: 'ENGINEERING WORKSHOP // SECTOR D3',
    sectorLabel: '机械加工部 // 工程车间 D3',
    phase: 3,
    worldWidth: W,
    followUpSceneId: 'basement_records',
    objects: [
      { id: 'obj-lathe', name: '精密车床工作台', x: 100, y: 235, width: 95, height: 72, archiveEntryId: 'arch-lathe-bench' },
      { id: 'obj-wire-rack', name: '线轴架', x: 200, y: 285, width: 62, height: 52, archiveEntryId: 'arch-wire-spool-rack' },
      { id: 'obj-gear-wall', name: '齿轮模板墙', x: 290, y: 75, width: 115, height: 82, archiveEntryId: 'arch-gear-template-wall' },
      { id: 'obj-gauge-bank', name: '压力表组', x: 370, y: 272, width: 82, height: 52, archiveEntryId: 'arch-pressure-gauge-bank' },
      { id: 'obj-solder', name: '焊台与电路原型', x: 470, y: 255, width: 72, height: 58, archiveEntryId: 'arch-soldering-station' },
      { id: 'obj-robot-arm', name: '机械臂原型', x: 560, y: 185, width: 68, height: 88, archiveEntryId: 'arch-prototype-robot-arm', accent: '#d94141' },
      { id: 'obj-turbine', name: '涡轮模型', x: 680, y: 218, width: 78, height: 78, archiveEntryId: 'arch-turbine-mockup' },
      { id: 'obj-tool-chest', name: '工程师工具箱', x: 820, y: 272, width: 58, height: 48, archiveEntryId: 'arch-tool-chest' },
    ],
  },
  basement_records: {
    id: 'basement_records',
    title: '地下室记录库',
    subtitle: 'BASEMENT RECORDS // SECTOR B3',
    sectorLabel: '受限存储区 // 地下室 B3',
    phase: 3,
    worldWidth: W,
    objects: [
      { id: 'obj-flood-log', name: '淹水记录板', x: 110, y: 255, width: 58, height: 48, archiveEntryId: 'arch-flood-log' },
      { id: 'obj-mirror-neg', name: '镜像主体底片', x: 200, y: 285, width: 52, height: 42, archiveEntryId: 'arch-mirror-negative' },
      { id: 'obj-terminated', name: '终止主体名单', x: 280, y: 210, width: 72, height: 62, archiveEntryId: 'arch-terminated-subjects', accent: '#d94141' },
      { id: 'obj-audio-reel', name: '402 号音频卷轴', x: 400, y: 258, width: 68, height: 52, archiveEntryId: 'arch-audio-reel-402' },
      { id: 'obj-city-model', name: '未来城市模型箱', x: 500, y: 272, width: 82, height: 58, archiveEntryId: 'arch-future-city-model' },
      { id: 'obj-ocean-chart', name: '海洋声学图', x: 620, y: 195, width: 92, height: 72, archiveEntryId: 'arch-ocean-chart' },
      { id: 'obj-wind-plaque', name: '风洞铭牌', x: 720, y: 278, width: 48, height: 38, archiveEntryId: 'arch-wind-tunnel-plaque' },
      { id: 'obj-final-protocol', name: '终极协议草案', x: 820, y: 228, width: 62, height: 52, archiveEntryId: 'arch-final-protocol', accent: '#d94141' },
    ],
  },
};

/** Phase completion → primary interlude scene(s). */
export const INTERLUDE_BY_PHASE: Record<number, string> = {
  1: 'archive_room',
  2: 'observation_hall',
  3: 'engineering_workshop',
};

export function getInterludeScene(sceneId: string): InterludeScene {
  return INTERLUDE_SCENES[sceneId]!;
}

export function getInterludeScenesForPhase(phase: number): string[] {
  const primary = INTERLUDE_BY_PHASE[phase];
  if (!primary) return [];
  const scene = INTERLUDE_SCENES[primary];
  if (scene?.followUpSceneId) return [primary, scene.followUpSceneId];
  return [primary];
}
