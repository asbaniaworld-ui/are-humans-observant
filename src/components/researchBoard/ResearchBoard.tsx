import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import ArchiveCardModal from '../archive/ArchiveCardModal';
import {
  RESEARCH_DEPARTMENTS,
  RESEARCH_BOARD_CONNECTIONS,
  buildBoardNodes,
  getGlobalNodePosition,
  getResearcherBoardComment,
  getStatusLabel,
  getUnlockedDepartmentCount,
  formatDuration,
  getArchiveEntryIdForLevel,
} from '../../content/researchBoard';
import { ARCHIVE_BY_ID } from '../../content/archiveCatalog';
import { BLUEPRINT_BY_ID } from '../../content/blueprintLibrary';
import { getActiveBlueprintId } from '../../content/experimentRun';
import type { ArchiveEntry, ExperimentRecord } from '../../content/types';
import type { ResearchBoardNodeStatus } from '../../content/types';
import { boardNodeCursor, boardNodeDisabled } from '../../utils/gameCursor';

type BoardPhase = 'walking' | 'focusing' | 'board' | 'comment';

interface ResearchBoardProps {
  completedPhase: number;
  currentLevel: number;
  foundDiffs: Record<number, number[]>;
  experimentRecords: Record<number, ExperimentRecord>;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  audio: { playClick: () => void; playSuccessBell: () => void; playLevelUp: () => void; playTick: () => void };
  onComplete: () => void;
}

function resolveArchiveEntry(level: number): ArchiveEntry | null {
  const entryId = getArchiveEntryIdForLevel(level);
  if (ARCHIVE_BY_ID[entryId]) return ARCHIVE_BY_ID[entryId];
  const bpId = getActiveBlueprintId(level);
  const bp = BLUEPRINT_BY_ID[bpId];
  if (!bp) return null;
  return {
    id: entryId,
    type: 'blueprint',
    title: bp.title,
    date: '1968-06-25',
    classification: `BLUEPRINT // ${bp.category.toUpperCase().replace(/_/g, '-')}`,
    body: `${bp.description}\n\n视觉提示：${bp.visualPrompt}\n\n难度层级：${bp.difficultyTier} | 差异类型：${bp.differenceTypes.join(', ')}`,
    blueprintId: bpId,
    tags: [bp.category],
  };
}

export default function ResearchBoard({
  completedPhase,
  currentLevel,
  foundDiffs,
  experimentRecords,
  isMuted,
  setIsMuted,
  audio,
  onComplete,
}: ResearchBoardProps) {
  const [phase, setPhase] = useState<BoardPhase>('walking');
  const [walkProgress, setWalkProgress] = useState(0);
  const [focusProgress, setFocusProgress] = useState(0);
  const [animatePins, setAnimatePins] = useState(true);
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [viewingEntry, setViewingEntry] = useState<ArchiveEntry | null>(null);
  const [typedComment, setTypedComment] = useState('');
  const [showContinue, setShowContinue] = useState(false);

  const nodes = useMemo(
    () => buildBoardNodes(completedPhase, currentLevel, foundDiffs, experimentRecords),
    [completedPhase, currentLevel, foundDiffs, experimentRecords],
  );

  const unlockedDepts = getUnlockedDepartmentCount(completedPhase);
  const researcherComment = getResearcherBoardComment(completedPhase);
  const hoveredNode = nodes.find((n) => n.level === hoveredLevel);

  // Auto walk toward the board
  useEffect(() => {
    if (phase !== 'walking') return;
    const start = performance.now();
    const duration = 2800;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setWalkProgress(t);
      if (!isMuted && Math.floor(t * 20) % 4 === 0) audio.playTick();
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPhase('focusing');
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, isMuted, audio]);

  // Camera focus on board
  useEffect(() => {
    if (phase !== 'focusing') return;
    const start = performance.now();
    const duration = 1600;
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setFocusProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        setPhase('board');
        audio.playLevelUp();
        window.setTimeout(() => setAnimatePins(false), 2200);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, audio]);

  // Typewriter for researcher comment
  useEffect(() => {
    if (phase !== 'comment') return;
    let i = 0;
    setTypedComment('');
    setShowContinue(false);
    const interval = window.setInterval(() => {
      if (i < researcherComment.length) {
        setTypedComment(researcherComment.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setShowContinue(true);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [phase, researcherComment]);

  const skipToBoard = () => {
    audio.playClick();
    setWalkProgress(1);
    setFocusProgress(1);
    setPhase('board');
    setAnimatePins(false);
  };

  const handleNodeClick = (level: number, status: ResearchBoardNodeStatus) => {
    if (status === 'department_locked' || status === 'locked') {
      audio.playClick();
      return;
    }
    if (status === 'verified') {
      const entry = resolveArchiveEntry(level);
      if (entry) {
        audio.playSuccessBell();
        setViewingEntry(entry);
      }
    }
  };

  const cameraScale = phase === 'walking' ? 1 - walkProgress * 0.08 : 0.92 + focusProgress * 0.08;
  const cameraY = phase === 'walking' ? walkProgress * 12 : 12 - focusProgress * 12;
  const boardOpacity = phase === 'walking' ? 0.55 + walkProgress * 0.45 : 1;

  return (
    <div className="max-w-5xl mx-auto my-4 border-4 border-black bg-[#faf4ea] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden font-mono select-none cursor-game-default">
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-black/20 px-4 py-2 text-[10px] tracking-widest text-black/60">
        <div className="flex items-center space-x-2">
          <span>实验室 B 区 // RESEARCH PLANNING ROOM</span>
          <span className="text-[#d94141] font-bold animate-pulse">● 总体规划板在线</span>
        </div>
        <div className="flex items-center space-x-3">
          {(phase === 'walking' || phase === 'focusing') && (
            <button
              onClick={skipToBoard}
              className="text-[9px] uppercase underline hover:text-black cursor-pointer"
            >
              跳过步行 // SKIP
            </button>
          )}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center space-x-1 hover:text-black cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-[#d94141]" /> : <Volume2 className="w-3 h-3" />}
            <span>[{isMuted ? '已静音' : '声音: 开启'}]</span>
          </button>
        </div>
      </div>

      {/* Room + camera viewport */}
      <div className="relative overflow-hidden bg-[#2a2520]" style={{ height: phase === 'comment' ? '520px' : '580px' }}>
        {/* Floor perspective */}
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{
            transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
            transformOrigin: '50% 60%',
          }}
        >
          {/* Back wall ambient */}
          <div className="absolute inset-x-0 top-0 h-[35%] bg-gradient-to-b from-[#1a1814] to-[#3d3830]" />
          {/* Side walls */}
          <div className="absolute left-0 top-0 bottom-0 w-[8%] bg-[#252118] opacity-80" />
          <div className="absolute right-0 top-0 bottom-0 w-[8%] bg-[#252118] opacity-80" />
          {/* Floor */}
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-[#faf6eb]/10">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(400px) rotateX(60deg)',
                transformOrigin: '50% 0%',
              }}
            />
          </div>

          {/* Walking silhouette (only during walk) */}
          {phase === 'walking' && (
            <div
              className="absolute bottom-[8%] left-1/2 -translate-x-1/2 transition-all duration-300"
              style={{ opacity: 1 - walkProgress * 0.9, transform: `translateX(-50%) scale(${1 - walkProgress * 0.3})` }}
            >
              <div className="w-8 h-16 border-2 border-[#faf6eb]/40 rounded-sm mx-auto" />
              <p className="text-[8px] text-[#faf6eb]/50 text-center mt-1 uppercase tracking-widest">走近规划墙…</p>
            </div>
          )}

          {/* THE INVESTIGATION BOARD */}
          <div
            className="absolute left-[6%] right-[6%] top-[8%] bottom-[12%] transition-opacity duration-700"
            style={{ opacity: boardOpacity }}
          >
            <BoardWall
              nodes={nodes}
              unlockedDepts={unlockedDepts}
              animatePins={animatePins}
              completedPhase={completedPhase}
              hoveredLevel={hoveredLevel}
              onHover={setHoveredLevel}
              onNodeClick={handleNodeClick}
            />
          </div>
        </div>

        {/* Hover tooltip */}
        {phase === 'board' && hoveredNode && (
          <div className="absolute bottom-4 left-4 right-4 z-30 pointer-events-none">
            <div className="bg-black/92 text-[#faf6eb] border-2 border-[#d94141] p-3 shadow-[4px_4px_0px_0px_rgba(217,65,65,1)] max-w-md mx-auto">
              <div className="text-[9px] text-[#d94141] font-bold uppercase tracking-widest mb-1">
                {hoveredNode.experimentLabel} // {getStatusLabel(hoveredNode.status)}
              </div>
              <div className="font-serif font-bold text-sm mb-2">{hoveredNode.title}</div>
              {hoveredNode.status === 'verified' && hoveredNode.record ? (
                <div className="text-[10px] space-y-0.5 text-white/85 font-mono">
                  <div>准确率 // ACCURACY: {hoveredNode.record.accuracy}%</div>
                  <div>用时 // DURATION: {formatDuration(hoveredNode.record.durationSec)}</div>
                  <div className="text-[#f3ca52] mt-1">点击打开档案记录</div>
                </div>
              ) : hoveredNode.status === 'department_locked' ? (
                <div className="text-[10px] text-white/70 italic">Research Department Locked</div>
              ) : hoveredNode.status === 'locked' ? (
                <div className="text-[10px] text-white/70">按序列推进后解锁此节点</div>
              ) : (
                <div className="text-[10px] text-white/70">已列入研究计划 · 等待校准</div>
              )}
            </div>
          </div>
        )}

        {/* Researcher comment overlay */}
        {phase === 'comment' && (
          <div className="absolute inset-0 bg-black/70 flex items-end justify-center p-4 z-40 animate-fade-in">
            <div className="max-w-xl w-full bg-[#faf4ea] border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(217,65,65,1)]">
              <div className="text-[9px] text-[#d94141] font-bold uppercase tracking-widest mb-2">
                伊芙琳·默瑟 博士 // CHIEF RESEARCHER
              </div>
              <p className="font-serif text-base leading-relaxed text-black italic min-h-[4rem]">{typedComment}</p>
              {showContinue && (
                <button
                  onClick={() => {
                    audio.playClick();
                    onComplete();
                  }}
                  className="mt-4 w-full flex items-center justify-center space-x-2 bg-black text-[#faf6eb] border-2 border-black px-6 py-3 text-xs font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(217,65,65,1)]"
                >
                  <span>继续间歇探索 // ENTER INTERLUDE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      {phase === 'board' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-t border-black/15">
          <p className="text-[9px] text-black/50 uppercase tracking-wide max-w-md">
            悬停蓝图节点查看进度 · 已验证节点可打开档案 · 红线表示部际研究依赖链
          </p>
          <button
            onClick={() => {
              audio.playClick();
              setPhase('comment');
            }}
            className="flex items-center justify-center space-x-2 bg-black text-[#faf6eb] border-2 border-black px-5 py-2.5 text-[10px] font-bold uppercase hover:bg-[#faf6eb] hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(217,65,65,1)] shrink-0"
          >
            <span>听取研究员评注 // BRIEFING</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {viewingEntry && (
        <ArchiveCardModal
          entry={viewingEntry}
          onClose={() => {
            audio.playClick();
            setViewingEntry(null);
          }}
        />
      )}
    </div>
  );
}

interface BoardWallProps {
  nodes: ReturnType<typeof buildBoardNodes>;
  unlockedDepts: number;
  animatePins: boolean;
  completedPhase: number;
  hoveredLevel: number | null;
  onHover: (level: number | null) => void;
  onNodeClick: (level: number, status: ResearchBoardNodeStatus) => void;
}

function BoardWall({
  nodes,
  unlockedDepts,
  animatePins,
  completedPhase,
  hoveredLevel,
  onHover,
  onNodeClick,
}: BoardWallProps) {
  const newlyVerifiedLevels = useMemo(() => {
    if (completedPhase < 1) return [];
    return RESEARCH_DEPARTMENTS[completedPhase - 1]?.experimentLevels ?? [];
  }, [completedPhase]);

  return (
    <div className="relative w-full h-full bg-[#c4a882] border-[6px] border-[#5c4a32] shadow-[inset_0_0_60px_rgba(0,0,0,0.25)]">
      {/* Cork texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #8b6914 0.5px, transparent 0.5px)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Title plaque */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-[#faf4ea] border-2 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
        <div className="text-[8px] text-[#d94141] font-black tracking-[0.25em] text-center uppercase">
          控制论校准学部 // MASTER RESEARCH PLAN
        </div>
        <div className="text-[7px] text-black/50 text-center tracking-widest">FORM #402-B · REV. 1968.06</div>
      </div>

      {/* Red string connections (SVG overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5]" viewBox="0 0 100 100" preserveAspectRatio="none">
        {RESEARCH_BOARD_CONNECTIONS.map(([from, to], i) => {
          const a = getGlobalNodePosition(from);
          const b = getGlobalNodePosition(to);
          const fromNode = nodes.find((n) => n.level === from);
          const isActive = fromNode?.status === 'verified';
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={isActive ? '#c0392b' : '#c0392b55'}
              strokeWidth={isActive ? 0.35 : 0.2}
              strokeDasharray={isActive ? 'none' : '1 1.5'}
            />
          );
        })}
        {/* Pin heads at connection nodes */}
        {nodes
          .filter((n) => n.status === 'verified')
          .map((n) => {
            const g = getGlobalNodePosition(n.level);
            return <circle key={n.level} cx={g.x} cy={g.y} r={0.6} fill="#8b0000" opacity={0.8} />;
          })}
      </svg>

      {/* Four department quadrants */}
      <div className="absolute inset-[4%] top-[10%] grid grid-cols-2 grid-rows-2 gap-2">
        {RESEARCH_DEPARTMENTS.map((dept, deptIdx) => {
          const isDeptLocked = deptIdx >= unlockedDepts;
          const isNewlyUnlocked = deptIdx === completedPhase && completedPhase >= 1 && animatePins;

          return (
            <div
              key={dept.id}
              className={`relative border-2 border-dashed border-black/25 bg-[#faf6eb]/40 p-2 overflow-hidden ${
                isNewlyUnlocked ? 'animate-board-dept-unlock' : ''
              }`}
            >
              {/* Dept header */}
              <div className="border-b border-black/15 pb-1 mb-1 pr-1">
                <div className="text-[7px] font-black tracking-wider text-[#d94141] leading-tight">{dept.title}</div>
                <div className="text-[6px] text-black/45 uppercase">{dept.subtitle}</div>
                <div className="text-[5px] text-black/35 font-mono mt-0.5">{dept.classificationLabel}</div>
              </div>

              {/* Handwritten annotation */}
              <p
                className="text-[5px] text-black/55 italic leading-snug mb-2 max-w-[95%] pointer-events-none"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                {dept.annotation}
              </p>

              {/* Blueprint nodes */}
              <div className="relative h-[calc(100%-3.5rem)] min-h-[60px]">
                {dept.nodePositions.map((pos) => {
                  const node = nodes.find((n) => n.level === pos.level)!;
                  const isHovered = hoveredLevel === pos.level;
                  const isNewPin = animatePins && newlyVerifiedLevels.includes(pos.level);

                  return (
                    <button
                      key={pos.level}
                      type="button"
                      disabled={boardNodeDisabled(node.status)}
                      title={
                        node.status === 'verified'
                          ? '点击查看档案'
                          : node.status === 'available'
                            ? '完成实验后可查看档案'
                            : '尚未解锁'
                      }
                      className={`absolute w-[26%] min-w-[52px] max-w-[72px] aspect-[3/4] ${boardNodeCursor(node.status)} transition-all duration-200 group ${
                        isHovered ? 'z-20 scale-110' : 'z-10'
                      } ${isNewPin ? 'animate-board-pin-drop' : ''}`}
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                      }}
                      onMouseEnter={() => onHover(pos.level)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => onNodeClick(pos.level, node.status)}
                      aria-label={`${node.experimentLabel} ${node.title}`}
                    >
                      {/* Push pin */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#8b0000] border border-black/40 shadow-sm z-10" />

                      {/* Blueprint card */}
                      <div
                        className={`relative w-full h-full border-2 border-black bg-[#faf4ea] shadow-[2px_3px_0px_0px_rgba(0,0,0,0.4)] overflow-hidden ${
                          node.status === 'department_locked' || node.status === 'locked'
                            ? 'opacity-40 grayscale'
                            : ''
                        } ${isHovered ? 'ring-2 ring-[#d94141] ring-offset-1' : ''}`}
                      >
                        {/* Schematic lines */}
                        <div className="absolute inset-1 border border-black/10 pointer-events-none">
                          <svg viewBox="0 0 40 50" className="w-full h-full opacity-40">
                            <rect x="4" y="4" width="32" height="42" fill="none" stroke="#1a1a1a" strokeWidth="0.8" />
                            <circle cx="20" cy="22" r="8" fill="none" stroke="#1a1a1a" strokeWidth="0.6" />
                            <line x1="8" y1="38" x2="32" y2="38" stroke="#1a1a1a" strokeWidth="0.5" />
                            <path d="M 12,14 L 28,14 M 12,18 L 24,18" stroke="#1a1a1a" strokeWidth="0.4" />
                          </svg>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-black/85 text-[#faf6eb] px-0.5 py-0.5">
                          <div className="text-[4px] font-bold tracking-tighter truncate text-center">
                            {node.experimentLabel}
                          </div>
                        </div>

                        {/* Verified stamp */}
                        {node.status === 'verified' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="border-2 border-[#d94141] text-[#d94141] font-black text-[5px] px-1 py-0.5 -rotate-12 opacity-90 bg-[#faf4ea]/80 animate-stamp uppercase tracking-tighter">
                              VERIFIED
                            </div>
                          </div>
                        )}

                        {/* Locked overlay */}
                        {(node.status === 'department_locked' || node.status === 'locked') && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 pointer-events-none">
                            <span className="text-[4px] font-bold text-black/70 uppercase text-center px-0.5 leading-tight">
                              {node.status === 'department_locked' ? 'DEPT LOCKED' : 'LOCKED'}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Department lock veil */}
              {isDeptLocked && (
                <div className="absolute inset-0 bg-[#1a1a1a]/55 flex flex-col items-center justify-center z-30 cursor-game-locked pointer-events-auto">
                  <div className="border-2 border-[#d94141] text-[#faf6eb] px-2 py-1 text-[7px] font-black uppercase tracking-wider text-center rotate-[-3deg] bg-black/80">
                    Research Department Locked
                  </div>
                </div>
              )}

              {/* Archive stamp on completed departments */}
              {deptIdx < unlockedDepts - 1 && (
                <div className="absolute bottom-1 right-1 text-[5px] text-[#d94141] font-bold border border-[#d94141] px-1 py-0.5 rotate-6 opacity-70 pointer-events-none uppercase">
                  ARCHIVED
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Wall-mounted classification legend */}
      <div className="absolute bottom-1 left-2 text-[5px] text-black/40 uppercase tracking-widest pointer-events-none">
        PIN: RED // STRING: DEPT CHAIN // STAMP: VERIFIED 1968
      </div>
    </div>
  );
}
