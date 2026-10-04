import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  User,
  Sparkles,
  Upload,
  Download,
  Copy,
  Check,
  Eye,
  Sliders,
  Maximize2,
  CheckCircle2,
  Camera,
  Shirt,
  Watch,
  Palette,
} from 'lucide-react';
import { OmGioCharacter, IdentityLockStrength } from '../../types';
import { copyToClipboard } from '../../utils/exportHelpers';
import { OmGioVisualAvatar } from './OmGioVisualAvatar';

interface CharacterSheetViewProps {
  character: OmGioCharacter;
  identityLockStrength: IdentityLockStrength;
  onUpdateIdentityLock: (strength: IdentityLockStrength) => void;
  onUploadPhoto?: (photoUrl: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const CharacterSheetView: React.FC<CharacterSheetViewProps> = ({
  character,
  identityLockStrength,
  onUpdateIdentityLock,
  onUploadPhoto,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'turnaround' | 'biometrics' | 'prompt'>('sheet');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [characterSheetImage, setCharacterSheetImage] = useState<string | null>(character.customPhotoUrl || null);
  const [selectedAngle, setSelectedAngle] = useState<
    'front' | 'leftProfile' | 'rightProfile' | 'threeQuarter' | 'smile' | 'neutral' | 'serious' | 'fullBody' | 'glasses' | 'mustache' | 'watch'
  >('front');

  const strengthOptions: IdentityLockStrength[] = ['80%', '85%', '90%', '95%', '100%'];

  const handleSheetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCharacterSheetImage(url);
      if (onUploadPhoto) {
        onUploadPhoto(url);
      }
      onShowToast('Lembar Karakter Sheet Om Gio berhasil diupload dan dikunci ke seluruh storyboard!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const characterSheetPromptBlock = `CHARACTER IDENTITY REFERENCE SHEET — OM GIO:
- Age: 28 Tahun (approx 28 years old)
- Gender: Pria (Male)
- Ethnicity: Asia (Indonesia), Sawo Matang Cerah / Warm Indonesian light-tan (#D59A72)
- Body Type: Kurus / Fit (Athletic slim build)
- Face Shape: Oval
- Hair: Pendek Tersisir Rapi (Short black hair, neatly combed with modern side taper)
- Eyewear: Kacamata Bingkai Tipis Persegi Panjang Hitam (Thin black rectangular wireframe glasses)
- Facial Hair: Kumis Tipis Rapi & Soul Patch Halus (Precision-trimmed thin mustache, subtle soul patch)
- Wardrobe: Kaos Polos Hitam (solid matte black crewneck short-sleeve t-shirt), Celana Cargo Hitam (relaxed multi-pocket utility cargo pants), Sneakers Putih (white athletic performance running shoes), Jam Tangan Sporty Hitam (tactical chronograph watch on left wrist).
- Identity Lock Strength: ${identityLockStrength} (100% anatomical and biometric continuity across all generated shots).`;

  const handleCopyCharacterPrompt = async () => {
    const ok = await copyToClipboard(characterSheetPromptBlock);
    if (ok) {
      setCopiedPrompt(true);
      onShowToast('Prompt Lembar Karakter Sheet berhasil disalin untuk Google Flow!', 'success');
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  const headAngles = [
    { id: 'front', label: 'Front View', sub: 'Tampak Depan' },
    { id: 'leftProfile', label: 'Left Profile', sub: 'Profil Kiri' },
    { id: 'rightProfile', label: 'Right Profile', sub: 'Profil Kanan' },
    { id: 'threeQuarter', label: '3/4 View', sub: 'Sudut Tiga Perempat' },
  ] as const;

  const expressions = [
    { id: 'smile', label: 'Smiling Expression', desc: 'Senyum ramah autentik memperlihatkan gigi rapi' },
    { id: 'neutral', label: 'Neutral Expression', desc: 'Fokus tenang, pandangan lugas ke kamera' },
    { id: 'serious', label: 'Serious Expression', desc: 'Otoritatif, tatapan tajam mendalam' },
  ] as const;

  const fullBodyPosed = [
    { id: 'front', label: 'Front', desc: 'Kaos hitam polos, celana cargo, sneakers putih' },
    { id: 'leftSide', label: 'Left Side', desc: 'Profil tubuh samping kiri proporsional' },
    { id: 'back', label: 'Back', desc: 'Tampak belakang siluet bahu tegap' },
    { id: 'rightSide', label: 'Right Side', desc: 'Profil tubuh samping kanan' },
    { id: 'threeQuarter', label: '3/4 View', desc: 'Pose santai tangan di saku celana cargo' },
  ];

  const biometricDetails = [
    { title: 'Mata & Kacamata', desc: 'Kacamata bingkai hitam persegi panjang tipis, mata cokelat gelap natural', tag: 'OPTICAL' },
    { title: 'Hidung', desc: 'Hidung proporsional natural pria Indonesia', tag: 'FACIAL' },
    { title: 'Mulut & Kumis', desc: 'Kumis tipis rapi terawat dan soul patch halus di bawah bibir', tag: 'GROOMING' },
    { title: 'Rambut', desc: 'Hitam pekat, potongan pendek rapi dengan taper samping modern', tag: 'HAIR' },
    { title: 'Jam Tangan', desc: 'Sporty chronograph taktis warna hitam di pergelangan tangan kiri', tag: 'ACCESSORY' },
    { title: 'Sepatu', desc: 'Sneakers putih atletik dengan aksen abu-abu perak', tag: 'FOOTWEAR' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0a1122] via-[#070b16] to-[#04060d] border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              CHARACTER SHEET • IDENTITY REFERENCE
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              LOCK KONSISTENSI: {identityLockStrength}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Lembar Karakter Om Gio (Character Reference Sheet)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
            Panduan anatomi, sudut pose 360°, ekspresi wajah, pakaian, dan aksesori lengkap agar seluruh video yang dihasilkan di Google Flow / Veo memiliki karakter Om Gio yang 100% konsisten dari adegan pertama hingga terakhir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 relative z-10 flex-wrap">
          <button
            onClick={handleCopyCharacterPrompt}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all cursor-pointer"
            title="Salin blok spesifikasi karakter sheet untuk Google Flow"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedPrompt ? 'Tersalin!' : 'Salin Prompt Karakter'}</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload Lembar Karakter</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleSheetUpload}
            />
          </label>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveTab('sheet')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'sheet'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Lembar Referensi Lengkap (Turnaround Sheet)</span>
        </button>

        <button
          onClick={() => setActiveTab('turnaround')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'turnaround'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Sudut Wajah & Full Body (360°)</span>
        </button>

        <button
          onClick={() => setActiveTab('biometrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'biometrics'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Detail Biometrik & Wardrobe</span>
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'prompt'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Prompt Konsistensi Google Flow</span>
        </button>
      </div>

      {/* TAB 1: FULL CHARACTER SHEET DISPLAY */}
      {activeTab === 'sheet' && (
        <div className="space-y-6">
          {/* Identity Reference Specs Card */}
          <div className="rounded-3xl bg-[#090e1a] border border-cyan-500/30 p-6 space-y-6 shadow-xl">
            {/* Header Identity Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>Character Sheet</span>
                  <span className="text-cyan-400 text-sm font-mono font-normal">/ Identity Reference Sheet</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Spesifikasi resmi identitas Om Gio yang disinkronkan ke generator prompt Google Flow
                </p>
              </div>

              {/* Identity lock degree selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Tingkat Kunci:</span>
                <div className="flex items-center gap-1">
                  {strengthOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onUpdateIdentityLock(s);
                        onShowToast(`Kunci konsistensi karakter diatur ke ${s}`, 'info');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        identityLockStrength === s
                          ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Age</span>
                <span className="font-extrabold text-white text-sm">28 Tahun</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Gender</span>
                <span className="font-extrabold text-white text-sm">Pria</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Ethnicity</span>
                <span className="font-extrabold text-cyan-300 text-sm">Asia (Indonesia)</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Body Type</span>
                <span className="font-extrabold text-white text-sm">Kurus / Fit</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Hair</span>
                <span className="font-extrabold text-white text-sm">Pendek Tersisir Rapi</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/50 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Face Shape</span>
                <span className="font-extrabold text-white text-sm">Oval</span>
              </div>
            </div>

            {/* If user uploaded character sheet photo, show it prominently */}
            {characterSheetImage && (
              <div className="rounded-2xl overflow-hidden border border-cyan-500/40 bg-black shadow-2xl relative">
                <img
                  src={characterSheetImage}
                  alt="Lembar Referensi Karakter Pria Indonesia"
                  className="w-full h-auto object-contain max-h-[85vh] mx-auto"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md text-xs font-mono text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>LEMBAR KARAKTER AKTIF (100% LOCKED)</span>
                </div>
              </div>
            )}

            {/* Visual Sheet Breakdown Grid */}
            <div className="space-y-6 pt-2">
              {/* Row 1: Head Angles */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>1. Sudut Kepala / Head Angles (4 Sudut Pandang)</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {headAngles.map((ang) => (
                    <button
                      key={ang.id}
                      onClick={() => {
                        setSelectedAngle(ang.id as any);
                        onShowToast(`Sudut ${ang.label} dipilih sebagai fokus acuan`, 'info');
                      }}
                      className={`p-3 rounded-2xl bg-black/60 border text-left transition-all ${
                        selectedAngle === ang.id
                          ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-[#050811]">
                        <OmGioVisualAvatar
                          viewMode={ang.id as any}
                          showHud={false}
                          identityLockStrength={identityLockStrength}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="font-bold text-white text-xs">{ang.label}</p>
                      <p className="text-[10px] text-cyan-300 font-mono">{ang.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 2: Facial Expressions */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Ekspresi Wajah / Facial Expressions</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {expressions.map((exp) => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedAngle(exp.id as any)}
                      className={`p-3 rounded-2xl bg-black/60 border text-left transition-all ${
                        selectedAngle === exp.id
                          ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/20'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 bg-[#050811]">
                        <OmGioVisualAvatar
                          viewMode={exp.id as any}
                          showHud={false}
                          identityLockStrength={identityLockStrength}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="font-bold text-white text-xs">{exp.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{exp.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Full Body Turnaround */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>3. Full Body Turnaround (5 Sudut Penuh Tubuh)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {fullBodyPosed.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-black/60 border border-slate-800 text-left"
                    >
                      <div className="aspect-[1/2] rounded-xl overflow-hidden mb-2 bg-[#050811] flex items-center justify-center p-2">
                        <OmGioVisualAvatar
                          viewMode="fullBody"
                          showHud={false}
                          identityLockStrength={identityLockStrength}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="font-bold text-white text-xs">{item.label}</p>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 4: Detail Close Up */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>4. Detail Biometrik Close Up (Jangkar Konsistensi)</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {biometricDetails.map((det, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold block w-fit mb-1.5">
                          {det.tag}
                        </span>
                        <h5 className="font-bold text-white text-xs">{det.title}</h5>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug">{det.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Palette & Outfit Specifications */}
              <div className="p-4 rounded-2xl bg-[#050811] border border-cyan-500/20 space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Palet Warna & Spesifikasi Pakaian (Wardrobe Specs)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Color Swatches */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400">Warna Karakter:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-xl bg-black/70 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#d59a72] border border-white/20 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Kulit</p>
                          <p className="text-[10px] font-mono text-slate-400">#D59A72</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/70 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#111827] border border-slate-700 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Rambut</p>
                          <p className="text-[10px] font-mono text-slate-400">#111827</p>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/70 border border-slate-800 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0f172a] border border-slate-700 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Outfit</p>
                          <p className="text-[10px] font-mono text-slate-400">#0F172A</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wardrobe Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-slate-400">Elemen Pakaian Utama:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded-xl bg-black/70 border border-slate-800 text-center">
                        <span className="text-cyan-400 font-bold block">👕 Kaos</span>
                        <span className="text-slate-300 text-[10px]">Polos Hitam</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/70 border border-slate-800 text-center">
                        <span className="text-cyan-400 font-bold block">👖 Celana</span>
                        <span className="text-slate-300 text-[10px]">Cargo Hitam</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/70 border border-slate-800 text-center">
                        <span className="text-cyan-400 font-bold block">👟 Sepatu</span>
                        <span className="text-slate-300 text-[10px]">Sneakers Putih</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/70 border border-slate-800 text-center">
                        <span className="text-cyan-400 font-bold block">⌚ Aksesori</span>
                        <span className="text-slate-300 text-[10px]">Jam Tangan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TURNAROUND & BIOMETRIC 3D ANGLE VIEW */}
      {activeTab === 'turnaround' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 rounded-3xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center justify-between">
              <span>Biometric Avatar Inspector</span>
              <span className="text-xs text-cyan-300 font-mono">VIEW: {selectedAngle.toUpperCase()}</span>
            </h3>

            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-cyan-500/30">
              <OmGioVisualAvatar
                viewMode={selectedAngle as any}
                identityLockStrength={identityLockStrength}
                showHud={true}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="lg:col-span-6 rounded-3xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Pilih Sudut Pandang Kamera</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {headAngles.map((h) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedAngle(h.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAngle === h.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                      : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <p className="font-bold">{h.label}</p>
                  <p className="text-[10px] text-slate-500">{h.sub}</p>
                </button>
              ))}
              {expressions.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedAngle(e.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedAngle === e.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                      : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <p className="font-bold">{e.label}</p>
                  <p className="text-[10px] text-slate-500 truncate">{e.desc}</p>
                </button>
              ))}
              <button
                onClick={() => setSelectedAngle('fullBody')}
                className={`p-3 rounded-xl border text-left transition-all col-span-2 ${
                  selectedAngle === 'fullBody'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                    : 'bg-black/40 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <p className="font-bold">Full Body Turnaround (5 Angles)</p>
                <p className="text-[10px] text-slate-500">Kaos Polos Hitam + Celana Cargo + Sneakers Putih + Jam Tangan</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BIOMETRIC SPECS */}
      {activeTab === 'biometrics' && (
        <div className="rounded-3xl bg-[#090e1a] border border-slate-800 p-6 space-y-6">
          <h3 className="text-lg font-bold text-white font-mono">Biometric Feature Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {biometricDetails.map((b, i) => (
              <div key={i} className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {b.tag}
                </span>
                <h4 className="font-bold text-white text-sm">{b.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROMPT CONSISTENCY */}
      {activeTab === 'prompt' && (
        <div className="rounded-3xl bg-[#090e1a] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-mono">Format Prompt Konsistensi Google Flow / Veo</h3>
            <button
              onClick={handleCopyCharacterPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-black border border-slate-800 text-xs font-mono text-cyan-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {characterSheetPromptBlock}
          </pre>
        </div>
      )}
    </div>
  );
};
