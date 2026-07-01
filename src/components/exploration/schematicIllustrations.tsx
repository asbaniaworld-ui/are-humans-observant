import React from 'react';

export type SchematicObjectKind =
  | 'cabinet'
  | 'photo_wall'
  | 'drawer'
  | 'chart'
  | 'document'
  | 'machine'
  | 'seal'
  | 'mirror'
  | 'chair'
  | 'projector'
  | 'rack'
  | 'cylinder'
  | 'panel'
  | 'camera'
  | 'workbench'
  | 'gear'
  | 'solder'
  | 'turbine'
  | 'robot'
  | 'tool'
  | 'audio'
  | 'ocean'
  | 'negative'
  | 'model'
  | 'protocol'
  | 'blueprint';

export function getSchematicObjectKind(objectId: string): SchematicObjectKind {
  if (objectId.includes('blueprint') || objectId.includes('hanging')) return 'blueprint';
  if (objectId.includes('filing') || objectId.includes('cabinet')) return 'cabinet';
  if (objectId.includes('polaroid')) return 'photo_wall';
  if (objectId.includes('punch') || objectId.includes('drawer')) return 'drawer';
  if (objectId.includes('mercury') || objectId.includes('gauge') || objectId.includes('flood') || objectId.includes('console')) return 'chart';
  if (objectId.includes('microfilm') || objectId.includes('reader')) return 'machine';
  if (objectId.includes('seal') || objectId.includes('cal-seal')) return 'seal';
  if (objectId.includes('roster') || objectId.includes('memo') || objectId.includes('logbook') || objectId.includes('terminated') || objectId.includes('log')) return 'document';
  if (objectId.includes('mirror') || objectId.includes('window') || objectId.includes('observation')) return 'mirror';
  if (objectId.includes('chair') || objectId.includes('eeg')) return 'chair';
  if (objectId.includes('projector') || objectId.includes('retina')) return 'projector';
  if (objectId.includes('vacuum') || objectId.includes('rack') || objectId.includes('wire')) return 'rack';
  if (objectId.includes('cylinder')) return 'cylinder';
  if (objectId.includes('intercom') || objectId.includes('panel')) return 'panel';
  if (objectId.includes('camera') || objectId.includes('cam')) return 'camera';
  if (objectId.includes('lathe') || objectId.includes('bench')) return 'workbench';
  if (objectId.includes('gear')) return 'gear';
  if (objectId.includes('solder')) return 'solder';
  if (objectId.includes('turbine')) return 'turbine';
  if (objectId.includes('robot')) return 'robot';
  if (objectId.includes('tool')) return 'tool';
  if (objectId.includes('audio') || objectId.includes('reel')) return 'audio';
  if (objectId.includes('ocean')) return 'ocean';
  if (objectId.includes('negative')) return 'negative';
  if (objectId.includes('city') || objectId.includes('model')) return 'model';
  if (objectId.includes('protocol') || objectId.includes('final')) return 'protocol';
  return 'document';
}

export function SchematicObjectIllustration({
  kind,
  accent,
}: {
  kind: SchematicObjectKind;
  accent?: string;
}) {
  const stroke = '#1a1a1a';

  if (kind === 'blueprint') {
    return (
      <svg viewBox="0 0 40 20" className="w-full h-full opacity-40">
        <path d="M 5,10 q 15,-10 30,0" stroke={stroke} strokeWidth="1" fill="none" />
        <circle cx="20" cy="10" r="5" stroke={stroke} strokeWidth="0.5" strokeDasharray="1 1" fill="none" />
      </svg>
    );
  }

  if (kind === 'cabinet') {
    return (
      <div className="w-full h-full flex flex-col justify-around p-0.5 gap-0.5">
        {['CONFIDENTIAL', 'CASE_A', 'RED-402'].map((label, i) => (
          <div key={label} className="border border-black/20 h-3 w-full bg-[#faf6eb] flex items-center justify-between px-0.5">
            <div className="w-1.5 h-0.5 bg-black" />
            <div
              className={`text-[3px] font-mono leading-none scale-[0.55] text-center border border-black/30 px-0.5 ${
                i === 2 ? 'bg-[#d94141] text-white' : 'bg-white'
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'mirror' || kind === 'rack') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-1 bg-emerald-900/10 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_50%,_transparent_50%)] bg-[size:100%_3px] opacity-60 pointer-events-none" />
        <span className="text-[4px] text-emerald-800/70 font-black tracking-widest uppercase relative z-10">TERMINAL</span>
        <div className="flex items-center justify-center gap-1 py-0.5 opacity-50 relative z-10">
          <div className="w-3 h-3 rounded-full border border-emerald-700 border-dashed" />
          <div className="w-2.5 h-2.5 rounded-full border border-emerald-700 border-dashed" />
          <div className="w-3 h-3 rounded-full border border-emerald-700 border-dashed" />
        </div>
        <span className="text-[3px] text-emerald-800/60 font-bold relative z-10">● FEEDBACK ON</span>
      </div>
    );
  }

  if (kind === 'chart') {
    return (
      <div className="w-full h-full flex flex-col justify-between p-1">
        <div className="flex items-center justify-between border-b border-black/10 pb-0.5">
          <span className="text-[4px] font-black text-[#d94141]">M-19-68</span>
          <div className="w-1 h-1 bg-green-600 rounded-full border border-black/40" />
        </div>
        <div className="flex items-center justify-center py-0.5">
          <div className="w-6 h-6 rounded-full border border-black flex items-center justify-center relative bg-white">
            <div className="absolute w-0.5 h-2 bg-[#d94141] origin-bottom -translate-y-1 rotate-[-12deg]" />
            <div className="w-1 h-1 rounded-full bg-black z-10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="w-full h-full opacity-70" fill="none">
      <rect x="12" y="8" width="24" height="32" stroke={stroke} strokeWidth="1" fill="#faf6eb" />
      {[14, 20, 26, 32].map((y) => (
        <line key={y} x1="16" y1={y} x2="32" y2={y} stroke={stroke} strokeWidth="0.5" opacity="0.5" />
      ))}
      {accent && <rect x="28" y="10" width="6" height="6" fill={accent} opacity="0.6" />}
    </svg>
  );
}
