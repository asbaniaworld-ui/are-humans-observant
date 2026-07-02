import { assetUrl } from '../utils/assetUrl';

/** Archival photo paths for interlude collection items (1960s documentary style). */
export const ARCHIVE_IMAGE_BY_ENTRY_ID: Record<string, string> = {
  'arch-filing-cabinet-402': assetUrl('assets/archive/arch-filing-cabinet-402.png'),
  'arch-subject-roster': assetUrl('assets/archive/arch-subject-roster.png'),
  'arch-polaroid-wall': assetUrl('assets/archive/arch-polaroid-wall.png'),
  'arch-punch-card-drawer': assetUrl('assets/archive/arch-punch-card-drawer.png'),
  'arch-red-stamped-memo': assetUrl('assets/archive/arch-red-stamped-memo.png'),
  'arch-microfilm-reader': assetUrl('assets/archive/arch-microfilm-reader.png'),
  'arch-mercury-log': assetUrl('assets/archive/arch-mercury-log.png'),
  'arch-calibration-seal': assetUrl('assets/archive/arch-calibration-seal.png'),
  'arch-one-way-mirror': assetUrl('assets/archive/arch-one-way-mirror.png'),
  'arch-eeg-chair': assetUrl('assets/archive/arch-eeg-chair.png'),
  'arch-retina-projector': assetUrl('assets/archive/arch-retina-projector.png'),
  'arch-observer-logbook': assetUrl('assets/archive/arch-observer-logbook.png'),
  'arch-vacuum-tube-rack': assetUrl('assets/archive/arch-vacuum-tube-rack.png'),
  'arch-specimen-cylinder': assetUrl('assets/archive/arch-specimen-cylinder.png'),
  'arch-intercom-panel': assetUrl('assets/archive/arch-intercom-panel.png'),
  'arch-ceiling-camera': assetUrl('assets/archive/arch-ceiling-camera.png'),
  'arch-lathe-bench': assetUrl('assets/archive/arch-lathe-bench.png'),
  'arch-gear-template-wall': assetUrl('assets/archive/arch-gear-template-wall.png'),
  'arch-soldering-station': assetUrl('assets/archive/arch-soldering-station.png'),
  'arch-turbine-mockup': assetUrl('assets/archive/arch-turbine-mockup.png'),
  'arch-wire-spool-rack': assetUrl('assets/archive/arch-wire-spool-rack.png'),
  'arch-pressure-gauge-bank': assetUrl('assets/archive/arch-pressure-gauge-bank.png'),
  'arch-prototype-robot-arm': assetUrl('assets/archive/arch-prototype-robot-arm.png'),
  'arch-tool-chest': assetUrl('assets/archive/arch-tool-chest.png'),
  'arch-flood-log': assetUrl('assets/archive/arch-flood-log.png'),
  'arch-terminated-subjects': assetUrl('assets/archive/arch-terminated-subjects.png'),
  'arch-audio-reel-402': assetUrl('assets/archive/arch-audio-reel-402.png'),
  'arch-ocean-chart': assetUrl('assets/archive/arch-ocean-chart.png'),
  'arch-mirror-negative': assetUrl('assets/archive/arch-mirror-negative.png'),
  'arch-future-city-model': assetUrl('assets/archive/arch-future-city-model.png'),
  'arch-wind-tunnel-plaque': assetUrl('assets/archive/arch-wind-tunnel-plaque.png'),
  'arch-final-protocol': assetUrl('assets/archive/arch-final-protocol.png'),
};

/** Intro lobby schematic objects → archive entry for inspect modal photos. */
export const INTRO_OBJECT_ARCHIVE_IDS: Record<string, string> = {
  hanging_blueprint: 'arch-microfilm-reader',
  archive_cabinet: 'arch-filing-cabinet-402',
  observation_window: 'arch-vacuum-tube-rack',
  control_console: 'arch-pressure-gauge-bank',
};

export function getArchiveImageUrl(entryId: string): string | undefined {
  return ARCHIVE_IMAGE_BY_ENTRY_ID[entryId];
}

export function getIntroObjectImage(itemId: string): string | undefined {
  const entryId = INTRO_OBJECT_ARCHIVE_IDS[itemId];
  return entryId ? getArchiveImageUrl(entryId) : undefined;
}
