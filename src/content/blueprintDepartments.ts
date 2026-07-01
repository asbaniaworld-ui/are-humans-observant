import type { BlueprintCategory, DifferenceType } from './types';

/** Research department metadata — difference palettes per scientific field. */
export interface BlueprintDepartmentConfig {
  category: BlueprintCategory;
  labelEn: string;
  labelZh: string;
  preferredDifferenceTypes: DifferenceType[];
  exampleDifferences: string[];
}

export const BLUEPRINT_DEPARTMENTS: BlueprintDepartmentConfig[] = [
  {
    category: 'mechanical_engineering',
    labelEn: 'Mechanical Engineering',
    labelZh: '机械工程',
    preferredDifferenceTypes: ['missing_element', 'count_mismatch', 'geometry_shift', 'altered_label', 'texture_density'],
    exampleDifferences: ['missing gear', 'missing bolt', 'wire direction', 'piston size', 'engraved label'],
  },
  {
    category: 'human_anatomy',
    labelEn: 'Human Anatomy',
    labelZh: '人体解剖',
    preferredDifferenceTypes: ['symmetry_break', 'altered_label', 'geometry_shift', 'missing_element', 'texture_density'],
    exampleDifferences: ['missing organ label', 'bone length', 'vein direction', 'tissue pattern', 'annotation'],
  },
  {
    category: 'biology',
    labelEn: 'Biological Research',
    labelZh: '生物学',
    preferredDifferenceTypes: ['count_mismatch', 'geometry_shift', 'altered_label', 'texture_density', 'line_interruption'],
    exampleDifferences: ['missing organ label', 'venation branch', 'cell wall layer', 'specimen tag', 'scale bar'],
  },
  {
    category: 'architecture',
    labelEn: 'Architecture',
    labelZh: '建筑学',
    preferredDifferenceTypes: ['missing_element', 'geometry_shift', 'altered_label', 'count_mismatch', 'line_interruption'],
    exampleDifferences: ['missing window', 'stair direction', 'pillar alignment', 'blueprint symbols', 'floor labels'],
  },
  {
    category: 'astronomy',
    labelEn: 'Astronomy',
    labelZh: '天文学',
    preferredDifferenceTypes: ['count_mismatch', 'geometry_shift', 'altered_label', 'pointer_rotation', 'texture_density'],
    exampleDifferences: ['orbit path', 'satellite position', 'constellation mark', 'telescope angle', 'planet label'],
  },
  {
    category: 'transportation',
    labelEn: 'Transportation',
    labelZh: '交通运输',
    preferredDifferenceTypes: ['geometry_shift', 'missing_element', 'altered_label', 'count_mismatch', 'pointer_rotation'],
    exampleDifferences: ['wheel spoke count', 'hull rivet', 'fin angle', 'track gauge', 'instrument label'],
  },
  {
    category: 'communication',
    labelEn: 'Communication Networks',
    labelZh: '通信工程',
    preferredDifferenceTypes: ['count_mismatch', 'line_interruption', 'symmetry_break', 'altered_label', 'texture_density'],
    exampleDifferences: ['relay node', 'wave arc', 'frequency band', 'antenna element', 'patch label'],
  },
  {
    category: 'weather_systems',
    labelEn: 'Weather Simulation',
    labelZh: '气象系统',
    preferredDifferenceTypes: ['line_interruption', 'pointer_rotation', 'missing_element', 'geometry_shift', 'texture_density'],
    exampleDifferences: ['isobar spacing', 'vane direction', 'pressure tap', 'condensation line', 'scale ring'],
  },
  {
    category: 'energy_infrastructure',
    labelEn: 'Energy Infrastructure',
    labelZh: '能源基础设施',
    preferredDifferenceTypes: ['missing_element', 'pointer_rotation', 'texture_density', 'count_mismatch', 'altered_label'],
    exampleDifferences: ['gauge needle', 'bus bar', 'cooling fin', 'transformer tap', 'load label'],
  },
  {
    category: 'ocean_research',
    labelEn: 'Ocean Research',
    labelZh: '海洋研究',
    preferredDifferenceTypes: ['altered_label', 'line_interruption', 'geometry_shift', 'symmetry_break', 'count_mismatch'],
    exampleDifferences: ['depth contour', 'hydrophone node', 'cable bundle', 'buoy mark', 'classified stamp'],
  },
  {
    category: 'future_city',
    labelEn: 'Future Systems / City',
    labelZh: '未来城市',
    preferredDifferenceTypes: ['line_interruption', 'count_mismatch', 'missing_element', 'geometry_shift', 'altered_label'],
    exampleDifferences: ['bridge cable', 'tower antenna', 'transit line', 'dome panel', 'sector label'],
  },
  {
    category: 'archive_documents',
    labelEn: 'Memory Archive',
    labelZh: '档案文献',
    preferredDifferenceTypes: ['altered_label', 'missing_element', 'symmetry_break', 'gaze_calibration', 'pointer_rotation'],
    exampleDifferences: ['red stamp', 'punch hole', 'margin note', 'folder tab', 'classification mark'],
  },
];

export const DEPARTMENT_BY_CATEGORY: Record<BlueprintCategory, BlueprintDepartmentConfig> = Object.fromEntries(
  BLUEPRINT_DEPARTMENTS.map((d) => [d.category, d]),
) as Record<BlueprintCategory, BlueprintDepartmentConfig>;

export function getDepartmentForCategory(category: BlueprintCategory): BlueprintDepartmentConfig {
  return DEPARTMENT_BY_CATEGORY[category];
}
