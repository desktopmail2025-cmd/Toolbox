import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';
import { sounds } from '../../utils/audio';
import { Check, ShieldCheck, AlertCircle, Info, Sparkles, Ruler } from 'lucide-react';

interface ToolComponentProps {
  toolId: string;
}

export const DiyConstructionTools: React.FC<ToolComponentProps> = ({ toolId }) => {
  switch (toolId) {
    case 'paint-calc':
      return <PaintCalcView />;
    case 'tile-calc':
      return <TileCalcView />;
    case 'flooring-calc':
      return <FlooringCalcView />;
    case 'concrete-calc':
      return <ConcreteCalcView />;
    case 'brick-calc':
      return <BrickCalcView />;
    case 'stair-calc':
      return <StairCalcView />;
    case 'right-triangle-calc':
      return <RightTriangleCalcView />;
    default:
      return <PaintCalcView />;
  }
};

// 1. Professional Paint & Primer Estimator
const ROOM_PRESETS = [
  { name: 'Standard Bedroom', l: 12, w: 10, h: 8, doors: 1, windows: 2 },
  { name: 'Master Suite', l: 16, w: 14, h: 9, doors: 2, windows: 3 },
  { name: 'Living & Dining Room', l: 22, w: 15, h: 9, doors: 2, windows: 4 },
  { name: 'Compact Bathroom', l: 8, w: 6, h: 8, doors: 1, windows: 1 },
  { name: 'Single Accent Wall', l: 14, w: 0, h: 8, doors: 0, windows: 0 },
];

const PaintCalcView: React.FC = () => {
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [wallLength, setWallLength] = useState(16);
  const [wallWidth, setWallWidth] = useState(12);
  const [wallHeight, setWallHeight] = useState(8.5);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);
  const [coats, setCoats] = useState(2);
  const [includeCeiling, setIncludeCeiling] = useState(false);
  const [needPrimer, setNeedPrimer] = useState(false);
  const [priceTier, setPriceTier] = useState<number>(45); // $45/gal standard
  const [coveragePerGallon, setCoveragePerGallon] = useState(350); // 350 sq ft per gal

  const applyPreset = (preset: typeof ROOM_PRESETS[0]) => {
    sounds.playClick();
    setWallLength(preset.l);
    setWallWidth(preset.w);
    setWallHeight(preset.h);
    setDoors(preset.doors);
    setWindows(preset.windows);
  };

  // Convert if metric: inputs are meters, internally convert to ft for consistent sq ft math
  const lFt = unit === 'metric' ? wallLength * 3.28084 : wallLength;
  const wFt = unit === 'metric' ? wallWidth * 3.28084 : wallWidth;
  const hFt = unit === 'metric' ? wallHeight * 3.28084 : wallHeight;

  // Perimeter * height for 4 walls, or single wall if width is 0
  const wallPerimeter = wFt > 0 ? (lFt + wFt) * 2 : lFt;
  const grossWallArea = wallPerimeter * hFt;
  const ceilingArea = includeCeiling && wFt > 0 ? lFt * wFt : 0;

  // Deductions: 21 sq ft per door, 15 sq ft per window
  const deductionArea = doors * 21 + windows * 15;
  const netPaintableSqFt = Math.max(0, grossWallArea - deductionArea + ceilingArea);
  const totalCoatedSqFt = netPaintableSqFt * coats;

  const gallonsNeeded = totalCoatedSqFt / (coveragePerGallon || 350);
  const fullGallonsToBuy = Math.ceil(gallonsNeeded);
  const litersEquivalent = gallonsNeeded * 3.78541;

  // Primer: 1 coat typically covers 300 sq ft / gallon
  const primerGallons = needPrimer ? Math.ceil(netPaintableSqFt / 300) : 0;
  const totalCost = (fullGallonsToBuy * priceTier) + (primerGallons * 30);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Professional Paint & Surface Coating Estimator
          </h2>
          <span className="text-xs text-zinc-400">
            Accurate surface square footage, door/window deductions, primer requirements & cost estimation
          </span>
        </div>
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setUnit('imperial')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              unit === 'imperial'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Feet / Gal
          </button>
          <button
            onClick={() => setUnit('metric')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              unit === 'metric'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Meters / L
          </button>
        </div>
      </div>

      {/* Room Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
          Select Room Preset
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {ROOM_PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="p-2 rounded-xl text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs hover:border-indigo-400 cursor-pointer transition-colors"
            >
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{p.name}</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{p.l}×{p.w > 0 ? p.w : ''} ft</div>
            </button>
          ))}
        </div>
      </div>

      {/* Geometry Form */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Room Length ({unit === 'imperial' ? 'ft' : 'm'})
          </label>
          <input
            type="number"
            step="0.5"
            value={wallLength}
            onChange={e => setWallLength(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Room Width ({unit === 'imperial' ? 'ft' : 'm'})
          </label>
          <input
            type="number"
            step="0.5"
            value={wallWidth}
            onChange={e => setWallWidth(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Ceiling Height ({unit === 'imperial' ? 'ft' : 'm'})
          </label>
          <input
            type="number"
            step="0.5"
            value={wallHeight}
            onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Doors (21 sq ft ea)</label>
          <input
            type="number"
            min="0"
            value={doors}
            onChange={e => setDoors(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Windows (15 sq ft ea)</label>
          <input
            type="number"
            min="0"
            value={windows}
            onChange={e => setWindows(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Coats of Paint</label>
          <select
            value={coats}
            onChange={e => setCoats(parseInt(e.target.value) || 2)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value={1}>1 Coat (Touch-up / Same Color)</option>
            <option value={2}>2 Coats (Standard Recommendation)</option>
            <option value={3}>3 Coats (Dark to Light Color Change)</option>
          </select>
        </div>

        {/* Checkbox Options */}
        <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCeiling}
              onChange={e => setIncludeCeiling(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Include Ceiling Painting (+{Math.round(ceilingArea)} sq ft)</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={needPrimer}
              onChange={e => setNeedPrimer(e.target.checked)}
              className="rounded accent-indigo-600"
            />
            <span>Include Dedicated Primer Coat (Bare Drywall / Stains)</span>
          </label>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-500">Paint Tier:</span>
            {[
              { label: 'Budget ($30)', p: 30 },
              { label: 'Premium ($48)', p: 48 },
              { label: 'Ultra ($75)', p: 75 },
            ].map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => setPriceTier(t.p)}
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold cursor-pointer ${
                  priceTier === t.p
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <ResultCard
          label="Paint to Purchase"
          value={`${fullGallonsToBuy} Gallons`}
          subtext={`${gallonsNeeded.toFixed(2)} gal (${litersEquivalent.toFixed(1)} L)`}
          highlight
        />
        <ResultCard
          label="Primer Needed"
          value={needPrimer ? `${primerGallons} Gallons` : 'None required'}
          subtext={needPrimer ? '1 full foundation coat' : 'Self-priming paint ok'}
        />
        <ResultCard
          label="Net Paintable Area"
          value={`${Math.round(netPaintableSqFt)} sq ft`}
          subtext={`${(netPaintableSqFt * 0.092903).toFixed(1)} m² (after doors/windows)`}
        />
        <ResultCard
          label="Estimated Material Cost"
          value={`$${totalCost.toFixed(2)}`}
          subtext={`@ $${priceTier}/gal + primer`}
        />
      </div>
    </div>
  );
};

// 2. Tile & Grout Calculator
const TILE_PRESETS = [
  { name: 'Subway Backsplash', l: 3, w: 6, thick: 0.25, joint: 0.0625 },
  { name: 'Square Floor Tile', l: 12, w: 12, thick: 0.375, joint: 0.125 },
  { name: 'Large Format Porcelain', l: 24, w: 24, thick: 0.375, joint: 0.125 },
  { name: 'Plank Wood Look', l: 36, w: 6, thick: 0.375, joint: 0.0625 },
];

const TileCalcView: React.FC = () => {
  const [roomL, setRoomL] = useState(12); // ft
  const [roomW, setRoomW] = useState(10); // ft
  const [tileL, setTileL] = useState(12); // inches
  const [tileW, setTileW] = useState(12); // inches
  const [tileThickInches, setTileThickInches] = useState(0.375); // 3/8"
  const [groutJointInches, setGroutJointInches] = useState(0.125); // 1/8"
  const [pattern, setPattern] = useState<'straight' | 'diagonal' | 'herringbone'>('straight');
  const [tilesPerBox, setTilesPerBox] = useState(10);
  const [costPerSqFt, setCostPerSqFt] = useState(4.5);

  const applyPreset = (p: typeof TILE_PRESETS[0]) => {
    sounds.playClick();
    setTileL(p.l);
    setTileW(p.w);
    setTileThickInches(p.thick);
    setGroutJointInches(p.joint);
  };

  const roomAreaSqFt = roomL * roomW;
  const singleTileAreaSqFt = (tileL * tileW) / 144;
  const baseTilesNeeded = singleTileAreaSqFt > 0 ? roomAreaSqFt / singleTileAreaSqFt : 0;

  // Wastage based on pattern
  const wastePercent = pattern === 'herringbone' ? 18 : pattern === 'diagonal' ? 15 : 10;
  const totalTilesWithWaste = Math.ceil(baseTilesNeeded * (1 + wastePercent / 100));
  const boxesNeeded = Math.ceil(totalTilesWithWaste / (tilesPerBox || 1));

  // Grout formula: Lbs of grout = (TileL + TileW) / (TileL * TileW) * JointWidth * JointDepth * RoomSqFt * 1.5
  const groutFactor = ((tileL + tileW) / (tileL * tileW)) * groutJointInches * tileThickInches * roomAreaSqFt * 1.75;
  const groutLbsNeeded = Math.max(1, Math.ceil(groutFactor * 1.15)); // 15% grout wastage
  const grout25lbBags = Math.ceil(groutLbsNeeded / 25);

  // Cement backer board (3x5 ft = 15 sq ft)
  const backerBoards = Math.ceil(roomAreaSqFt / 15);
  const totalMaterialCost = (boxesNeeded * tilesPerBox * singleTileAreaSqFt * costPerSqFt) + (grout25lbBags * 22) + (backerBoards * 14);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Professional Ceramic & Porcelain Tile Calculator
        </h2>
        <span className="text-xs text-zinc-400">
          Calculates tile count, pattern wastage buffer, sanded/unsanded grout poundage & backer board count
        </span>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
          Tile Size Presets
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {TILE_PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="p-2 rounded-xl text-left border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs hover:border-indigo-400 cursor-pointer"
            >
              <div className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{p.name}</div>
              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{p.l}" × {p.w}"</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Room / Wall Length (ft)</label>
          <input
            type="number"
            step="0.5"
            value={roomL}
            onChange={e => setRoomL(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Room / Wall Width (ft)</label>
          <input
            type="number"
            step="0.5"
            value={roomW}
            onChange={e => setRoomW(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Tile Dimensions (Inches)</label>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={tileL}
              onChange={e => setTileL(parseFloat(e.target.value) || 1)}
              className="w-full border rounded-xl p-2.5 font-mono text-center text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              placeholder="L"
            />
            <span className="text-zinc-400 font-bold">×</span>
            <input
              type="number"
              value={tileW}
              onChange={e => setTileW(parseFloat(e.target.value) || 1)}
              className="w-full border rounded-xl p-2.5 font-mono text-center text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              placeholder="W"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Tile Layout Pattern</label>
          <select
            value={pattern}
            onChange={e => setPattern(e.target.value as any)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value="straight">Straight Grid (10% waste)</option>
            <option value="diagonal">Diagonal 45° (15% waste)</option>
            <option value="herringbone">Herringbone / Chevron (18% waste)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Grout Joint Width</label>
          <select
            value={groutJointInches}
            onChange={e => setGroutJointInches(parseFloat(e.target.value))}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value={0.0625}>1/16" (1.5mm - Rectified Porcelain)</option>
            <option value={0.125}>1/8" (3mm - Standard Joint)</option>
            <option value={0.1875}>3/16" (4.5mm - Traditional Tile)</option>
            <option value={0.25}>1/4" (6mm - Saltillo / Quarry)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Tiles Per Box</label>
          <input
            type="number"
            min="1"
            value={tilesPerBox}
            onChange={e => setTilesPerBox(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <ResultCard
          label="Total Tiles Needed"
          value={`${totalTilesWithWaste} Tiles`}
          subtext={`Includes ${wastePercent}% pattern waste`}
          highlight
        />
        <ResultCard
          label="Boxes to Purchase"
          value={`${boxesNeeded} Boxes`}
          subtext={`@ ${tilesPerBox} tiles/box`}
        />
        <ResultCard
          label="Grout Required"
          value={`${groutLbsNeeded} lbs`}
          subtext={`${grout25lbBags} × 25-lb bags`}
        />
        <ResultCard
          label="Estimated Cost"
          value={`$${totalMaterialCost.toFixed(2)}`}
          subtext="Tiles + Grout + Backer board"
        />
      </div>
    </div>
  );
};

// 3. Flooring Box & Baseboard Calculator
const FlooringCalcView: React.FC = () => {
  const [length, setLength] = useState(18); // ft
  const [width, setWidth] = useState(14); // ft
  const [coveragePerBox, setCoveragePerBox] = useState(23.8); // sq ft per box
  const [wastePercent, setWastePercent] = useState(10); // 10%
  const [flooringType, setFlooringType] = useState('LVP (Luxury Vinyl Plank)');
  const [pricePerSqFt, setPricePerSqFt] = useState(3.49);

  const roomAreaSqFt = length * width;
  const roomPerimeterFt = (length + width) * 2;
  const totalAreaWithWaste = roomAreaSqFt * (1 + wastePercent / 100);
  const boxes = Math.ceil(totalAreaWithWaste / (coveragePerBox || 1));
  const baseboardFeetNeeded = Math.ceil(roomPerimeterFt * 1.10); // 10% cutting buffer
  const underlaymentRolls = Math.ceil(roomAreaSqFt / 100); // 100 sq ft rolls
  const totalCost = (boxes * coveragePerBox * pricePerSqFt) + (baseboardFeetNeeded * 1.75);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Hardwood, LVP & Laminate Flooring Estimator
        </h2>
        <span className="text-xs text-zinc-400">
          Calculates box purchase count, baseboard perimeter molding & underlayment rolls with cutting waste allowance
        </span>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Room Length (ft)</label>
          <input
            type="number"
            step="0.5"
            value={length}
            onChange={e => setLength(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Room Width (ft)</label>
          <input
            type="number"
            step="0.5"
            value={width}
            onChange={e => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Flooring Type</label>
          <select
            value={flooringType}
            onChange={e => setFlooringType(e.target.value)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value="LVP (Luxury Vinyl Plank)">LVP (Luxury Vinyl Plank)</option>
            <option value="Hardwood Solid Oak">Hardwood Solid Oak</option>
            <option value="Laminate Click-Lock">Laminate Click-Lock</option>
            <option value="Engineered Hardwood">Engineered Hardwood</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Coverage / Box (sq ft)</label>
          <input
            type="number"
            step="0.1"
            value={coveragePerBox}
            onChange={e => setCoveragePerBox(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Wastage Buffer (%)</label>
          <select
            value={wastePercent}
            onChange={e => setWastePercent(parseInt(e.target.value) || 10)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value={7}>7% (Simple Square Room)</option>
            <option value={10}>10% (Standard Room with Closets)</option>
            <option value={15}>15% (Diagonal / Complex Corners)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Price / Sq Ft ($)</label>
          <input
            type="number"
            step="0.1"
            value={pricePerSqFt}
            onChange={e => setPricePerSqFt(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <ResultCard
          label="Boxes to Purchase"
          value={`${boxes} Boxes`}
          subtext={`${(boxes * coveragePerBox).toFixed(1)} sq ft coverage`}
          highlight
        />
        <ResultCard
          label="Baseboard Molding"
          value={`${baseboardFeetNeeded} Linear Ft`}
          subtext={`Perimeter + 10% cuts buffer`}
        />
        <ResultCard
          label="Underlayment Rolls"
          value={`${underlaymentRolls} Rolls`}
          subtext="100 sq ft standard rolls"
        />
        <ResultCard
          label="Estimated Budget"
          value={`$${totalCost.toFixed(2)}`}
          subtext="Flooring + Baseboards"
        />
      </div>
    </div>
  );
};

// 4. Concrete & Slab Volume Calculator
const ConcreteCalcView: React.FC = () => {
  const [shape, setShape] = useState<'slab' | 'column' | 'footing'>('slab');

  // Slab states
  const [slabLength, setSlabLength] = useState(12); // ft
  const [slabWidth, setSlabWidth] = useState(10); // ft
  const [slabThickInches, setSlabThickInches] = useState(4); // in

  // Pier/Column states
  const [columnDiameterInches, setColumnDiameterInches] = useState(12); // in
  const [columnDepthFt, setColumnDepthFt] = useState(4); // ft (below frost line)
  const [columnCount, setColumnCount] = useState(6);

  // Footing states
  const [footingLengthFt, setFootingLengthFt] = useState(60); // ft
  const [footingWidthInches, setFootingWidthInches] = useState(16); // in
  const [footingDepthInches, setFootingDepthInches] = useState(10); // in

  let cubicFeet = 0;
  if (shape === 'slab') {
    cubicFeet = slabLength * slabWidth * (slabThickInches / 12);
  } else if (shape === 'column') {
    const radiusFt = (columnDiameterInches / 2) / 12;
    cubicFeet = Math.PI * radiusFt * radiusFt * columnDepthFt * columnCount;
  } else if (shape === 'footing') {
    cubicFeet = footingLengthFt * (footingWidthInches / 12) * (footingDepthInches / 12);
  }

  // 10% safety margin
  const cubicFeetWithMargin = cubicFeet * 1.10;
  const cubicYards = cubicFeetWithMargin / 27;
  const cubicMeters = cubicYards * 0.764555;

  // Premix bag counts
  const bags80lb = Math.ceil(cubicFeetWithMargin / 0.60); // ~0.60 cu ft per 80lb bag
  const bags60lb = Math.ceil(cubicFeetWithMargin / 0.45); // ~0.45 cu ft per 60lb bag

  // Ready mix truck cost vs bag cost
  const truckCost = Math.max(140, cubicYards * 135) + 80; // $135/yd + delivery surcharge
  const bagsCost = bags80lb * 6.50;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Concrete, Slab & Sonotube Pier Volume Calculator
          </h2>
          <span className="text-xs text-zinc-400">
            Cubic yardage & premix bag estimator for patio slabs, circular deck piers & continuous trench footings
          </span>
        </div>
      </div>

      {/* Geometry Shape Selector */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs font-bold gap-1">
        {[
          { id: 'slab', label: '1. Patio / Driveway Slab' },
          { id: 'column', label: '2. Circular Deck Piers (Sonotube)' },
          { id: 'footing', label: '3. Trench Foundation Footing' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => {
              sounds.playClick();
              setShape(s.id as any);
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              shape === s.id
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        {shape === 'slab' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Slab Length (ft)</label>
              <input
                type="number"
                step="0.5"
                value={slabLength}
                onChange={e => setSlabLength(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Slab Width (ft)</label>
              <input
                type="number"
                step="0.5"
                value={slabWidth}
                onChange={e => setSlabWidth(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Slab Thickness (inches)</label>
              <select
                value={slabThickInches}
                onChange={e => setSlabThickInches(parseFloat(e.target.value))}
                className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              >
                <option value={3.5}>3.5" (Walkways / Shed base)</option>
                <option value={4}>4.0" (Standard Patio / Garage floor)</option>
                <option value={5}>5.0" (Heavy Vehicle Driveway)</option>
                <option value={6}>6.0" (Commercial / Hot Tub Pad)</option>
              </select>
            </div>
          </>
        )}

        {shape === 'column' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Pier Diameter (inches)</label>
              <select
                value={columnDiameterInches}
                onChange={e => setColumnDiameterInches(parseFloat(e.target.value))}
                className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              >
                <option value={8}>8" Tube (Light Deck / Fence)</option>
                <option value={10}>10" Tube (Standard Residential Deck)</option>
                <option value={12}>12" Tube (Heavy Deck / Pergola)</option>
                <option value={16}>16" Tube (Post & Beam Foundation)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Depth / Height (ft)</label>
              <input
                type="number"
                step="0.5"
                value={columnDepthFt}
                onChange={e => setColumnDepthFt(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Number of Tube Piers</label>
              <input
                type="number"
                min="1"
                value={columnCount}
                onChange={e => setColumnCount(parseInt(e.target.value) || 1)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </>
        )}

        {shape === 'footing' && (
          <>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Total Trench Length (ft)</label>
              <input
                type="number"
                value={footingLengthFt}
                onChange={e => setFootingLengthFt(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Footing Width (inches)</label>
              <input
                type="number"
                value={footingWidthInches}
                onChange={e => setFootingWidthInches(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Footing Depth (inches)</label>
              <input
                type="number"
                value={footingDepthInches}
                onChange={e => setFootingDepthInches(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <ResultCard
          label="Total Concrete Volume"
          value={`${cubicYards.toFixed(2)} yd³`}
          subtext={`${cubicMeters.toFixed(2)} m³ (w/ 10% safety buffer)`}
          highlight
        />
        <ResultCard
          label="80 lb Premix Bags"
          value={`${bags80lb} Bags`}
          subtext={`Est: $${bagsCost.toFixed(0)} total bag cost`}
        />
        <ResultCard
          label="60 lb Premix Bags"
          value={`${bags60lb} Bags`}
          subtext="Lighter weight option"
        />
        <ResultCard
          label="Ready-Mix Truck Cost"
          value={`$${truckCost.toFixed(0)}`}
          subtext={cubicYards > 2 ? 'Recommend truck delivery' : 'Recommend hand mixing bags'}
        />
      </div>
    </div>
  );
};

// 5. Brick & Mortar Calculator
const BRICK_TYPES = [
  { name: 'Standard Modular Red Brick', perSqFt: 7, bagYield: 125 },
  { name: 'Queen Size Brick', perSqFt: 5.8, bagYield: 110 },
  { name: 'King Size Brick', perSqFt: 4.8, bagYield: 95 },
  { name: 'CMU Cinder Block (8×8×16")', perSqFt: 1.125, bagYield: 30 },
];

const BrickCalcView: React.FC = () => {
  const [wallLength, setWallLength] = useState(20); // ft
  const [wallHeight, setWallHeight] = useState(6); // ft
  const [brickIndex, setBrickIndex] = useState(0);
  const [wallType, setWallType] = useState<'single' | 'double'>('single');
  const [wastePercent, setWastePercent] = useState(5);

  const selectedBrick = BRICK_TYPES[brickIndex];
  const wallArea = wallLength * wallHeight;
  const multiplier = wallType === 'double' ? 2 : 1;
  const rawCount = wallArea * selectedBrick.perSqFt * multiplier;
  const totalWithWaste = Math.ceil(rawCount * (1 + wastePercent / 100));

  // Mortar bags (80 lb)
  const mortarBags = Math.ceil(totalWithWaste / selectedBrick.bagYield);
  const sandTonsNeeded = (mortarBags * 80 * 2.5) / 2000; // ~2.5 parts sand per part mortar cement

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Masonry Brick & Concrete Cinder Block Estimator
        </h2>
        <span className="text-xs text-zinc-400">
          Precise unit counts for standard brick veneers, double wythe walls & 8x8x16 CMU blocks with mortar bag requirements
        </span>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Wall Length (ft)</label>
          <input
            type="number"
            step="0.5"
            value={wallLength}
            onChange={e => setWallLength(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Wall Height (ft)</label>
          <input
            type="number"
            step="0.5"
            value={wallHeight}
            onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Masonry Unit Type</label>
          <select
            value={brickIndex}
            onChange={e => setBrickIndex(parseInt(e.target.value, 10))}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            {BRICK_TYPES.map((b, idx) => (
              <option key={b.name} value={idx}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Wall Construction</label>
          <select
            value={wallType}
            onChange={e => setWallType(e.target.value as any)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value="single">Single Wythe (Veneer / Facing)</option>
            <option value="double">Double Wythe (Solid Structural Brick)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">Breakage Buffer (%)</label>
          <select
            value={wastePercent}
            onChange={e => setWastePercent(parseInt(e.target.value) || 5)}
            className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          >
            <option value={5}>5% Standard cuts/breakage</option>
            <option value={10}>10% Complex curves or corners</option>
          </select>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <div className="text-zinc-400 uppercase text-[10px] font-bold">Surface Coverage</div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mt-0.5">{wallArea} sq ft</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard
          label={`${selectedBrick.name.split(' ')[0]}s Required`}
          value={`${totalWithWaste} Units`}
          subtext={`Includes ${wastePercent}% cutting waste`}
          highlight
        />
        <ResultCard
          label="80 lb Mortar Bags"
          value={`${mortarBags} Bags`}
          subtext="Type N / S masonry mortar"
        />
        <ResultCard
          label="Masonry Sand Tonnage"
          value={`${sandTonsNeeded.toFixed(2)} Tons`}
          subtext="Clean washed masonry sand"
        />
      </div>
    </div>
  );
};

// 6. Stair Dimensions & IRC Building Code Calculator
const StairCalcView: React.FC = () => {
  const [totalRiseInches, setTotalRiseInches] = useState(105); // 105 inches (standard 8ft 9in ceiling+floor)
  const [targetRiserInches, setTargetRiserInches] = useState(7.5); // standard code ~7.5 in
  const [treadDepthInches, setTreadDepthInches] = useState(10.5); // standard ~10.5 in

  const stepCount = Math.max(1, Math.round(totalRiseInches / (targetRiserInches || 7.5)));
  const exactRiser = totalRiseInches / stepCount;
  const totalRunInches = (stepCount - 1) * treadDepthInches;
  const totalRunFeet = totalRunInches / 12;
  const angleDeg = (Math.atan(exactRiser / treadDepthInches) * 180) / Math.PI;

  // Blondel's Rule of Comfort: 2R + T should equal 24" - 25"
  const blondelValue = 2 * exactRiser + treadDepthInches;
  const isBlondelCompliant = blondelValue >= 24 && blondelValue <= 25.5;

  // IRC Code checks: Max riser 7.75", Min tread 10.0"
  const isRiserCodePass = exactRiser <= 7.75;
  const isTreadCodePass = treadDepthInches >= 10.0;
  const needsLanding = totalRiseInches > 144; // > 12 ft rise requires landing

  // Stringer board length = sqrt(totalRise^2 + totalRun^2)
  const stringerLengthInches = Math.sqrt(totalRiseInches * totalRiseInches + totalRunInches * totalRunInches);
  const stringerLumberFeet = Math.ceil((stringerLengthInches + 12) / 12); // add 1ft margin

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Stair Layout, Stringer & Building Code Compliance Suite
        </h2>
        <span className="text-xs text-zinc-400">
          Automates IRC residential code compliance, Blondel ergonomic comfort formula & stringer lumber cuts
        </span>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Total Vertical Rise (inches)
          </label>
          <input
            type="number"
            step="0.25"
            value={totalRiseInches}
            onChange={e => setTotalRiseInches(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
            {(totalRiseInches / 12).toFixed(2)} ft floor-to-floor
          </span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Target Riser Height (inches)
          </label>
          <input
            type="number"
            step="0.25"
            value={targetRiserInches}
            onChange={e => setTargetRiserInches(parseFloat(e.target.value) || 7)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">IRC Code Max: 7.75"</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1">
            Tread Depth (inches)
          </label>
          <input
            type="number"
            step="0.25"
            value={treadDepthInches}
            onChange={e => setTreadDepthInches(parseFloat(e.target.value) || 10)}
            className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
          />
          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">IRC Code Min: 10.0"</span>
        </div>
      </div>

      {/* Code Compliance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold ${
          isRiserCodePass
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Riser: {exactRiser.toFixed(2)}" {isRiserCodePass ? '(Passes IRC)' : '(Exceeds 7.75" limit)'}</span>
        </div>

        <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold ${
          isTreadCodePass
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Tread: {treadDepthInches}" {isTreadCodePass ? '(Passes IRC)' : '(Under 10" min)'}</span>
        </div>

        <div className={`p-3 rounded-2xl border flex items-center gap-2.5 text-xs font-bold ${
          isBlondelCompliant
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
        }`}>
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>2R+T: {blondelValue.toFixed(1)}" {isBlondelCompliant ? '(Optimal Comfort)' : '(Steep/Shallow)'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Total Steps (Risers)" value={`${stepCount} Steps`} highlight />
        <ResultCard label="Exact Riser Height" value={`${exactRiser.toFixed(2)}" in`} subtext={`${(exactRiser * 25.4).toFixed(1)} mm`} />
        <ResultCard label="Total Horizontal Run" value={`${totalRunFeet.toFixed(2)} ft`} subtext={`${totalRunInches.toFixed(1)}" inches`} />
        <ResultCard label="2×12 Stringer Lumber" value={`${stringerLumberFeet} ft length`} subtext={`Incline: ${angleDeg.toFixed(1)}°`} />
      </div>
    </div>
  );
};

// 7. Right Triangle / 3-4-5 Carpenter Squaring & Roof Pitch Tool
const RightTriangleCalcView: React.FC = () => {
  const [mode, setMode] = useState<'pythagoras' | 'squaring' | 'roof'>('pythagoras');

  // Pythagoras mode
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [sideC, setSideC] = useState<string>('');

  // 3-4-5 Carpenter squaring mode
  const [baseWallLength, setBaseWallLength] = useState<number>(12); // e.g. 12 ft wall

  // Roof pitch mode
  const [roofPitchRise, setRoofPitchRise] = useState<number>(6); // 6:12 pitch
  const [buildingSpanFt, setBuildingSpanFt] = useState<number>(24); // 24 ft building span

  // Pythagoras math
  const a = parseFloat(sideA) || 0;
  const b = parseFloat(sideB) || 0;
  const c = parseFloat(sideC) || 0;

  let hyp = 0;
  let area = 0;
  let angleA = 0;
  let angleB = 0;
  let perimeter = 0;

  if (a && b) {
    hyp = Math.sqrt(a * a + b * b);
    area = 0.5 * a * b;
    angleA = (Math.atan(a / b) * 180) / Math.PI;
    angleB = 90 - angleA;
    perimeter = a + b + hyp;
  } else if (c && a && c > a) {
    const calcB = Math.sqrt(c * c - a * a);
    hyp = c;
    area = 0.5 * a * calcB;
    angleA = (Math.asin(a / c) * 180) / Math.PI;
    angleB = 90 - angleA;
    perimeter = a + calcB + c;
  }

  // 3-4-5 Squaring math: multiplier = baseWallLength / 4 (or / 3)
  const squareMult = baseWallLength / 4;
  const side3 = squareMult * 3;
  const side4 = baseWallLength;
  const side5Diagonal = squareMult * 5;

  // Roof math
  const roofRunFt = buildingSpanFt / 2;
  const roofRiseFt = roofRunFt * (roofPitchRise / 12);
  const rafterLengthFt = Math.sqrt(roofRunFt * roofRunFt + roofRiseFt * roofRiseFt);
  const roofAngleDeg = (Math.atan(roofPitchRise / 12) * 180) / Math.PI;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Carpenter Squaring, Right Triangle & Roof Pitch Suite
        </h2>
        <span className="text-xs text-zinc-400">
          Pythagorean theorem solver, foundation 3-4-5 squaring layout & roof rafter pitch calculations
        </span>
      </div>

      {/* Sub Tabs */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-xs font-bold gap-1">
        {[
          { id: 'pythagoras', label: '1. Pythagorean Solver' },
          { id: 'squaring', label: '2. 3-4-5 Foundation Squaring' },
          { id: 'roof', label: '3. Roof Pitch & Rafters' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              sounds.playClick();
              setMode(m.id as any);
            }}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer ${
              mode === m.id
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs font-extrabold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* MODE 1: PYTHAGORAS */}
      {mode === 'pythagoras' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Side A (Height / Rise)</label>
              <input
                type="number"
                value={sideA}
                onChange={e => setSideA(e.target.value)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Side B (Base / Run)</label>
              <input
                type="number"
                value={sideB}
                onChange={e => setSideB(e.target.value)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Hypotenuse C (Diagonal)</label>
              <input
                type="number"
                value={sideC}
                placeholder="Calculated"
                onChange={e => setSideC(e.target.value)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="Hypotenuse (C)" value={hyp.toFixed(2)} subtext="Diagonal length" highlight />
            <ResultCard label="Triangle Area" value={area.toFixed(2)} subtext="½ × base × height" />
            <ResultCard label="Angle α (at Base)" value={`${angleA.toFixed(1)}°`} />
            <ResultCard label="Perimeter" value={perimeter.toFixed(2)} subtext="Total boundary" />
          </div>
        </div>
      )}

      {/* MODE 2: 3-4-5 FOUNDATION SQUARING */}
      {mode === 'squaring' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-indigo-200/80 bg-indigo-50/60 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
              <Ruler className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>How the 3-4-5 Squaring Method Works</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              To square foundations, decks, or wall framing without optical levels, carpenters use multiples of the 3-4-5 right triangle. Measure your base wall ({side4} ft), measure perpendicular ({side3.toFixed(1)} ft), and adjust the corner until the diagonal measures exactly {side5Diagonal.toFixed(1)} ft. This guarantees an exact 90.0° square corner!
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Length of Base Wall / Ledger Board (ft)
            </label>
            <input
              type="number"
              step="1"
              value={baseWallLength}
              onChange={e => setBaseWallLength(parseFloat(e.target.value) || 1)}
              className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              label="Perpendicular Leg (Side 3)"
              value={`${side3.toFixed(2)} ft`}
              subtext="Measure along perpendicular stringline"
            />
            <ResultCard
              label="Base Leg (Side 4)"
              value={`${side4.toFixed(2)} ft`}
              subtext="Measure along ledger wall"
            />
            <ResultCard
              label="Diagonal Check (Side 5)"
              value={`${side5Diagonal.toFixed(2)} ft`}
              subtext="Must match exactly for 90° corner"
              highlight
            />
          </div>
        </div>
      )}

      {/* MODE 3: ROOF PITCH & RAFTERS */}
      {mode === 'roof' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Roof Pitch (Rise / 12" Run)</label>
              <select
                value={roofPitchRise}
                onChange={e => setRoofPitchRise(parseFloat(e.target.value))}
                className="w-full border rounded-xl p-2.5 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              >
                <option value={3}>3:12 (Low Slope / Shed)</option>
                <option value={4}>4:12 (Conventional Ranch)</option>
                <option value={6}>6:12 (Standard Gable Roof)</option>
                <option value={8}>8:12 (Steep Roof)</option>
                <option value={10}>10:12 (Chalet / A-Frame)</option>
                <option value={12}>12:12 (45° Equal Rise & Run)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1">Total Building Span (ft)</label>
              <input
                type="number"
                value={buildingSpanFt}
                onChange={e => setBuildingSpanFt(parseFloat(e.target.value) || 0)}
                className="w-full border rounded-xl p-2.5 font-mono text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <ResultCard
              label="Common Rafter Length"
              value={`${rafterLengthFt.toFixed(2)} ft`}
              subtext={`+ overhang (Run: ${roofRunFt} ft)`}
              highlight
            />
            <ResultCard
              label="Ridge Peak Rise"
              value={`${roofRiseFt.toFixed(2)} ft`}
              subtext="Height above wall top plate"
            />
            <ResultCard
              label="Pitch Angle"
              value={`${roofAngleDeg.toFixed(1)}°`}
              subtext="Miter saw bevel setting"
            />
            <ResultCard
              label="Pitch Slope"
              value={`${roofPitchRise} / 12`}
              subtext="Inches rise per foot run"
            />
          </div>
        </div>
      )}
    </div>
  );
};
