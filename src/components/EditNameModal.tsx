import React, { useState } from 'react';
import { User, Check, X, Play, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EditNameModalProps {
  isOpen: boolean;
  currentName: string;
  onClose: () => void;
  onSaveName: (newName: string) => void;
  onSaveAndRace: (newName: string) => void;
}

const PRESET_CALLSIGNS = [
  'ApexRider',
  'GhostRider_99',
  'ViperX',
  'SpeedDemon',
  'NeonVolt',
  'ShadowRider',
  'TurboKitsune',
  'Phantom_RR'
];

export const EditNameModal: React.FC<EditNameModalProps> = ({
  isOpen,
  currentName,
  onClose,
  onSaveName,
  onSaveAndRace
}) => {
  const [nameInput, setNameInput] = useState(currentName);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (andRace: boolean = false) => {
    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      sounds.playCrash();
      return;
    }
    if (trimmed.length > 18) {
      setError('Name cannot exceed 18 characters.');
      sounds.playCrash();
      return;
    }

    sounds.playClaim();
    if (andRace) {
      onSaveAndRace(trimmed);
    } else {
      onSaveName(trimmed);
      onClose();
    }
  };

  return (
    <div
      id="edit-name-modal-overlay"
      className="fixed inset-0 z-50 bg-[#0b0e13]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="edit-name-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#191c21] border-2 border-[#00f0ff] p-5 sm:p-7 rounded-xl max-w-md w-full shadow-[0_0_35px_rgba(0,240,255,0.4)] clip-chamfer-panel relative font-sans text-left"
      >
        {/* Close Button */}
        <button
          id="close-edit-name-modal-btn"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#849495] hover:text-[#00f0ff] p-1.5 rounded bg-[#111319] border border-[#3b494b] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#3b494b]/40">
          <div className="w-10 h-10 rounded bg-[#1d2025] border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#00f0ff]" />
              <span>PILOT IDENTITY MATRIX</span>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-black italic text-[#e1e2ea] uppercase tracking-wide">
              EDIT RACER CALLSIGN
            </h2>
          </div>
        </div>

        {/* Instructions */}
        <p className="font-mono text-xs text-[#849495] mb-4">
          Customize your highway racer handle. This callsign will appear on your superbike dashboard,
          global rankings, and crash telemetry records.
        </p>

        {/* Name Input */}
        <div className="space-y-1.5 mb-4">
          <label className="block font-mono text-[11px] text-[#dbfcff] uppercase font-bold">
            RACER CALLSIGN
          </label>
          <div className="relative">
            <input
              id="pilot-name-input"
              type="text"
              autoFocus
              maxLength={18}
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(false);
                }
              }}
              placeholder="e.g. GhostRider"
              className="w-full bg-[#0b0e13] border-2 border-[#3b494b] focus:border-[#00f0ff] text-[#e1e2ea] placeholder-[#4f5b66] px-3.5 py-2.5 rounded-lg font-heading text-base tracking-wide outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#849495]">
              {nameInput.length}/18
            </span>
          </div>
          {error && (
            <p className="font-mono text-xs text-[#ff3b30] mt-1 flex items-center gap-1">
              <span>⚠</span> {error}
            </p>
          )}
        </div>

        {/* Quick Presets */}
        <div className="mb-6">
          <div className="font-mono text-[10px] text-[#849495] uppercase mb-2">
            PRESET CALLSIGNS:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CALLSIGNS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setNameInput(preset);
                  if (error) setError(null);
                }}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-all border ${
                  nameInput === preset
                    ? 'bg-[#00f0ff] text-[#002022] font-bold border-[#00f0ff]'
                    : 'bg-[#111319] text-[#849495] border-[#3b494b]/60 hover:text-[#e1e2ea] hover:border-[#00f0ff]/50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            id="save-name-btn"
            type="button"
            onClick={() => handleSubmit(false)}
            className="flex-1 py-3 bg-[#1d2025] hover:bg-[#272a30] text-[#00f0ff] border border-[#00f0ff]/60 hover:border-[#00f0ff] font-heading text-xs sm:text-sm font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>SAVE CALLSIGN</span>
          </button>

          <button
            id="save-and-play-race-btn"
            type="button"
            onClick={() => handleSubmit(true)}
            className="flex-1 py-3 bg-[#00f0ff] hover:bg-[#7df4ff] text-[#002022] font-heading text-xs sm:text-sm font-black italic uppercase rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_18px_rgba(0,240,255,0.6)] hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>SAVE & PLAY RACE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
