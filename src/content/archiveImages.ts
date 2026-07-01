/** Archival photo paths for interlude collection items (1960s documentary style). */
export const ARCHIVE_IMAGE_BY_ENTRY_ID: Record<string, string> = {
  'arch-filing-cabinet-402': '/assets/archive/arch-filing-cabinet-402.png',
  'arch-subject-roster': '/assets/archive/arch-subject-roster.png',
  'arch-polaroid-wall': '/assets/archive/arch-polaroid-wall.png',
  'arch-punch-card-drawer': '/assets/archive/arch-punch-card-drawer.png',
  'arch-red-stamped-memo': '/assets/archive/arch-red-stamped-memo.png',
  'arch-microfilm-reader': '/assets/archive/arch-microfilm-reader.png',
  'arch-mercury-log': '/assets/archive/arch-mercury-log.png',
  'arch-calibration-seal': '/assets/archive/arch-calibration-seal.png',
  'arch-one-way-mirror': '/assets/archive/arch-one-way-mirror.png',
  'arch-eeg-chair': '/assets/archive/arch-eeg-chair.png',
  'arch-retina-projector': '/assets/archive/arch-retina-projector.png',
  'arch-observer-logbook': '/assets/archive/arch-observer-logbook.png',
  'arch-vacuum-tube-rack': '/assets/archive/arch-vacuum-tube-rack.png',
  'arch-specimen-cylinder': '/assets/archive/arch-specimen-cylinder.png',
  'arch-intercom-panel': '/assets/archive/arch-intercom-panel.png',
  'arch-ceiling-camera': '/assets/archive/arch-ceiling-camera.png',
  'arch-lathe-bench': '/assets/archive/arch-lathe-bench.png',
  'arch-gear-template-wall': '/assets/archive/arch-gear-template-wall.png',
  'arch-soldering-station': '/assets/archive/arch-soldering-station.png',
  'arch-turbine-mockup': '/assets/archive/arch-turbine-mockup.png',
  'arch-wire-spool-rack': '/assets/archive/arch-wire-spool-rack.png',
  'arch-pressure-gauge-bank': '/assets/archive/arch-pressure-gauge-bank.png',
  'arch-prototype-robot-arm': '/assets/archive/arch-prototype-robot-arm.png',
  'arch-tool-chest': '/assets/archive/arch-tool-chest.png',
  'arch-flood-log': '/assets/archive/arch-flood-log.png',
  'arch-terminated-subjects': '/assets/archive/arch-terminated-subjects.png',
  'arch-audio-reel-402': '/assets/archive/arch-audio-reel-402.png',
  'arch-ocean-chart': '/assets/archive/arch-ocean-chart.png',
  'arch-mirror-negative': '/assets/archive/arch-mirror-negative.png',
  'arch-future-city-model': '/assets/archive/arch-future-city-model.png',
  'arch-wind-tunnel-plaque': '/assets/archive/arch-wind-tunnel-plaque.png',
  'arch-final-protocol': '/assets/archive/arch-final-protocol.png',
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
