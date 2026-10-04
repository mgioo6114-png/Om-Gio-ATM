import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  Upload,
  CheckCircle2,
  Sparkles,
  Info,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { OmGioCharacter, IdentityLockStrength } from '../../types';
import { OmGioVisualAvatar } from './OmGioVisualAvatar';

interface CharacterLibraryViewProps {
  character: OmGioCharacter;
  identityLockStrength: IdentityLockStrength;
  onUpdateIdentityLock: (strength: IdentityLockStrength) => void;
  onUploadPhoto?: (photoUrl: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CharacterLibraryView: React.FC<CharacterLibraryViewProps> = ({
  character,
  identityLockStrength,
  onUpdateIdentityLock,
  onUploadPhoto,
  onShowToast,
}) => {
  const [activeAngle, setActiveAngle] = useState<
    'front' | 'threeQuarter' | 'leftProfile' | 'rightProfile' | 'fullBody' | 'smile' | 'neutral' | 'serious' | 'glasses' | 'mustache' | 'watch'
  >('front');

  const strengthOptions: IdentityLockStrength[] = ['80%', '85%', '90%', '95%', '100%'];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      if (onUploadPhoto) {
        onUploadPhoto(url);
      }
      onShowToast('Foto karakter Om Gio berhasil diupload dan dipasang di seluruh scene storyboard!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const anglesList: {
    id: typeof activeAngle;
    label: string;
    category: 'Pose Angles' | 'Expressions' | 'Biometric Closeups';
  }[] = [
    { id: 'front', label: 'Front View Portrait', category: 'Pose Angles' },
    { id: 'threeQuarter', label: '3/4 Angle Hero', category: 'Pose Angles' },
    { id: 'leftProfile', label: 'Left Profile', category: 'Pose Angles' },
    { id: 'rightProfile', label: 'Right Profile', category: 'Pose Angles' },
    { id: 'fullBody', label: 'Full Body Fit', category: 'Pose Angles' },
    { id: 'smile', label: 'Friendly Smile', category: 'Expressions' },
    { id: 'neutral', label: 'Neutral Focus', category: 'Expressions' },
    { id: 'serious', label: 'Authoritative Serious', category: 'Expressions' },
    { id: 'glasses', label: 'Rectangular Eyeglasses', category: 'Biometric Closeups' },
    { id: 'mustache', label: 'Thin Mustache & Beard', category: 'Biometric Closeups' },
    { id: 'watch', label: 'Steel Chronograph Watch', category: 'Biometric Closeups' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#091120] via-[#080d1a] to-[#040812] border border-cyan-500/25 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              PRIMARY CHARACTER REFERENCE
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" />
              IDENTITY LOCK ENGAGED ({identityLockStrength})
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Om Gio Character Sheet & Biometrics</h2>
          <p className="text-xs text-slate-400">
            Mandatory visual identity for all scene reconstructions. Preserves facial structure, glasses, mustache, and skin tone.
          </p>
        </div>

        {/* Upload Custom Character Button (Section 8) */}
        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 transition-colors cursor-pointer shrink-0 shadow-md">
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>{character.customPhotoUrl ? 'Ganti Foto Om Gio' : 'Upload Foto Referensi Om Gio'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>
      </div>

      {/* Main Character Sheet Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Large High-Res Visual Avatar & Biometric HUD */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative bg-black">
            {character.customPhotoUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={character.customPhotoUrl}
                  alt="Om Gio Uploaded Reference"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      ID_LOCK: {identityLockStrength}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-600 font-bold">
                      ACTIVE USER REFERENCE
                    </span>
                  </div>
                  <div className="bg-black/75 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300">
                    OM GIO PRIMARY TARGET • 28yo INDONESIAN MALE • RECTANGULAR EYEGLASSES
                  </div>
                </div>
              </div>
            ) : (
              <OmGioVisualAvatar
                viewMode={activeAngle}
                identityLockStrength={identityLockStrength}
                showHud={true}
                className="w-full h-full"
              />
            )}
          </div>

          {/* Identity Strength Slider / Pills (Section 2) */}
          <div className="p-4 rounded-xl bg-[#090d18] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                IDENTITY STRENGTH (LOCK DEGREE)
              </span>
              <span className="text-cyan-400 font-extrabold">{identityLockStrength}</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {strengthOptions.map((str) => (
                <button
                  key={str}
                  onClick={() => {
                    onUpdateIdentityLock(str);
                    onShowToast(`Identity strength updated to ${str}`, 'info');
                  }}
                  className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    identityLockStrength === str
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {str}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-mono text-center">
              Recommended: 95% (Enforces strict facial structure while allowing dynamic speech articulation)
            </p>
          </div>
        </div>

        {/* Right: Angle Navigation & Biometric Specs */}
        <div className="lg:col-span-6 space-y-5">
          {/* Angle / Expression Switcher */}
          <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Character Reference Angles & Expressions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {anglesList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveAngle(item.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs font-mono ${
                    activeAngle === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <p className="font-bold truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Full Anatomical Specifications from Section 1 */}
          <div className="rounded-2xl bg-[#090d18] border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Anatomical & Style Specifications</span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Locked</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Character Name</span>
                <p className="font-bold text-white mt-0.5">{character.name}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Age & Apparent Maturity</span>
                <p className="font-bold text-white mt-0.5">{character.age} years old</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Nationality & Heritage</span>
                <p className="font-bold text-white mt-0.5">{character.nationality}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Physique & Body Type</span>
                <p className="font-bold text-white mt-0.5">{character.bodyType}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Face Shape</span>
                <p className="font-bold text-white mt-0.5">{character.faceShape}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Hair Structure</span>
                <p className="font-bold text-white mt-0.5">{character.hair}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Eyewear</span>
                <p className="font-bold text-white mt-0.5">{character.eyewear}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Facial Hair</span>
                <p className="font-bold text-white mt-0.5">{character.facialHair}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Skin Tone</span>
                <p className="font-bold text-white mt-0.5">{character.skinTone}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-500">Rendering Style</span>
                <p className="font-bold text-cyan-300 mt-0.5">{character.style}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
