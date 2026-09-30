import React, { useState } from 'react';
import { ResultCard } from '../common/ResultCard';

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

// 1. Paint Calculator
const PaintCalcView: React.FC = () => {
  const [wallLength, setWallLength] = useState(20);
  const [wallHeight, setWallHeight] = useState(8);
  const [doors, setDoors] = useState(2);
  const [windows, setWindows] = useState(2);
  const [coats, setCoats] = useState(2);
  const [coveragePerGallon, setCoveragePerGallon] = useState(350); // 350 sq ft per gallon typical

  const grossArea = wallLength * wallHeight * 2; // perimeter estimate or single big room walls
  const deductionArea = doors * 21 + windows * 15; // standard door ~21 sqft, window ~15 sqft
  const netArea = Math.max(0, grossArea - deductionArea);
  const totalPaintArea = netArea * coats;
  const gallonsNeeded = totalPaintArea / (coveragePerGallon || 350);
  const litersNeeded = gallonsNeeded * 3.78541;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Total Wall Length (ft)</label>
          <input
            type="number"
            value={wallLength}
            onChange={e => setWallLength(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Ceiling Height (ft)</label>
          <input
            type="number"
            value={wallHeight}
            onChange={e => setWallHeight(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Number of Doors</label>
          <input
            type="number"
            value={doors}
            onChange={e => setDoors(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Number of Windows</label>
          <input
            type="number"
            value={windows}
            onChange={e => setWindows(parseInt(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-zinc-500 mb-1">Number of Coats</label>
          <input
            type="number"
            value={coats}
            onChange={e => setCoats(parseInt(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Gallons Needed" value={`${Math.ceil(gallonsNeeded)} gal`} subtext={`${gallonsNeeded.toFixed(2)} exact`} highlight />
        <ResultCard label="Liters Equivalent" value={`${litersNeeded.toFixed(1)} L`} />
        <ResultCard label="Net Paintable Area" value={`${netArea.toFixed(0)} sq ft`} />
      </div>
    </div>
  );
};

// 2. Tile & Grout Calculator
const TileCalcView: React.FC = () => {
  const [roomL, setRoomL] = useState(12); // ft
  const [roomW, setRoomW] = useState(10); // ft
  const [tileL, setTileL] = useState(12); // in
  const [tileW, setTileW] = useState(12); // in
  const [wastePercent, setWastePercent] = useState(10); // 10%
  const [tilesPerBox, setTilesPerBox] = useState(10);

  const roomAreaSqFt = roomL * roomW;
  const singleTileSqFt = (tileL * tileW) / 144;
  const rawTiles = singleTileSqFt > 0 ? roomAreaSqFt / singleTileSqFt : 0;
  const totalTilesWithWaste = Math.ceil(rawTiles * (1 + wastePercent / 100));
  const boxesNeeded = Math.ceil(totalTilesWithWaste / (tilesPerBox || 1));

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Room Length (ft)</label>
          <input
            type="number"
            value={roomL}
            onChange={e => setRoomL(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Room Width (ft)</label>
          <input
            type="number"
            value={roomW}
            onChange={e => setRoomW(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tile Dimensions (inches)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={tileL}
              onChange={e => setTileL(parseFloat(e.target.value) || 1)}
              className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="L"
            />
            <span className="self-center font-bold">×</span>
            <input
              type="number"
              value={tileW}
              onChange={e => setTileW(parseFloat(e.target.value) || 1)}
              className="w-full border rounded-xl p-2 font-mono text-center bg-white dark:bg-zinc-950 dark:border-zinc-700"
              placeholder="W"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Wastage Buffer (%)</label>
          <input
            type="number"
            value={wastePercent}
            onChange={e => setWastePercent(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Total Tiles Needed" value={`${totalTilesWithWaste} tiles`} subtext={`Includes ${wastePercent}% cuts buffer`} highlight />
        <ResultCard label="Boxes to Purchase" value={`${boxesNeeded} boxes`} subtext={`@ ${tilesPerBox} tiles/box`} />
        <ResultCard label="Surface Area" value={`${roomAreaSqFt} sq ft`} />
      </div>
    </div>
  );
};

// 3. Flooring Box Calculator
const FlooringCalcView: React.FC = () => {
  const [area, setArea] = useState(350); // sq ft
  const [coveragePerBox, setCoveragePerBox] = useState(24.5); // sq ft per box
  const [wastePercent, setWastePercent] = useState(10);
  const [pricePerSqFt, setPricePerSqFt] = useState(3.5);

  const totalAreaWithWaste = area * (1 + wastePercent / 100);
  const boxes = Math.ceil(totalAreaWithWaste / (coveragePerBox || 1));
  const estimatedMaterialCost = totalAreaWithWaste * pricePerSqFt;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Floor Area (sq ft)</label>
          <input
            type="number"
            value={area}
            onChange={e => setArea(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Coverage per Box (sq ft)</label>
          <input
            type="number"
            value={coveragePerBox}
            onChange={e => setCoveragePerBox(parseFloat(e.target.value) || 1)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Wastage Allowance (%)</label>
          <input
            type="number"
            value={wastePercent}
            onChange={e => setWastePercent(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Price per sq ft ($)</label>
          <input
            type="number"
            step="0.1"
            value={pricePerSqFt}
            onChange={e => setPricePerSqFt(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Flooring Boxes Needed" value={`${boxes} boxes`} highlight />
        <ResultCard label="Material Cost" value={`$${estimatedMaterialCost.toFixed(2)}`} />
        <ResultCard label="Total Coverage Bought" value={`${(boxes * coveragePerBox).toFixed(1)} sq ft`} />
      </div>
    </div>
  );
};

// 4. Concrete & Slab Volume Calculator
const ConcreteCalcView: React.FC = () => {
  const [length, setLength] = useState(12); // ft
  const [width, setWidth] = useState(10); // ft
  const [thicknessInches, setThicknessInches] = useState(4); // 4 inches

  const cubicFeet = length * width * (thicknessInches / 12);
  const cubicYards = cubicFeet / 27;
  const cubicMeters = cubicYards * 0.764555;
  const bags60lb = Math.ceil(cubicFeet / 0.45); // ~0.45 cu ft per 60lb bag
  const bags80lb = Math.ceil(cubicFeet / 0.60); // ~0.60 cu ft per 80lb bag

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Length (ft)</label>
          <input
            type="number"
            value={length}
            onChange={e => setLength(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Width (ft)</label>
          <input
            type="number"
            value={width}
            onChange={e => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Thickness (inches)</label>
          <input
            type="number"
            value={thicknessInches}
            onChange={e => setThicknessInches(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Volume" value={`${cubicYards.toFixed(2)} yd³`} subtext={`${cubicMeters.toFixed(2)} m³`} highlight />
        <ResultCard label="80 lb Premix Bags" value={`${bags80lb} bags`} />
        <ResultCard label="60 lb Premix Bags" value={`${bags60lb} bags`} />
      </div>
    </div>
  );
};

// 5. Brick & Mortar Calculator
const BrickCalcView: React.FC = () => {
  const [wallL, setWallL] = useState(15); // ft
  const [wallH, setWallH] = useState(6); // ft
  const [wallType, setWallType] = useState<'single' | 'double'>('single');

  const wallArea = wallL * wallH;
  // Standard modular brick with mortar: ~7 bricks per sq ft for single wythe, ~14 for double wythe
  const bricksPerSqFt = wallType === 'single' ? 7 : 14;
  const bricksNeeded = Math.ceil(wallArea * bricksPerSqFt * 1.05); // 5% wastage
  const mortarBags = Math.ceil(bricksNeeded / 125); // ~125 bricks per 80lb mortar bag

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Wall Length (ft)</label>
          <input
            type="number"
            value={wallL}
            onChange={e => setWallL(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Wall Height (ft)</label>
          <input
            type="number"
            value={wallH}
            onChange={e => setWallH(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Skin Type</label>
          <select
            value={wallType}
            onChange={e => setWallType(e.target.value as 'single' | 'double')}
            className="w-full border rounded-xl p-2 text-sm bg-white dark:bg-zinc-950 dark:border-zinc-700"
          >
            <option value="single">Single Wythe (Half Brick)</option>
            <option value="double">Double Wythe (Full Brick)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResultCard label="Bricks Required" value={`${bricksNeeded} bricks`} subtext="Includes 5% allowance" highlight />
        <ResultCard label="Mortar Bags (80 lb)" value={`${mortarBags} bags`} />
        <ResultCard label="Wall Surface" value={`${wallArea} sq ft`} />
      </div>
    </div>
  );
};

// 6. Stair Dimensions Calculator
const StairCalcView: React.FC = () => {
  const [totalRiseInches, setTotalRiseInches] = useState(105); // 105 inches (standard 8ft 9in ceiling+floor)
  const [targetRiserInches, setTargetRiserInches] = useState(7.5); // standard building code ~7.5 in
  const [treadDepthInches, setTreadDepthInches] = useState(10.5); // standard ~10.5 in

  const stepCount = Math.round(totalRiseInches / (targetRiserInches || 7.5));
  const exactRiser = stepCount > 0 ? totalRiseInches / stepCount : 0;
  const totalRunInches = (stepCount - 1) * treadDepthInches;
  const angleDeg = (Math.atan(exactRiser / treadDepthInches) * 180) / Math.PI;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Total Rise (inches)</label>
          <input
            type="number"
            value={totalRiseInches}
            onChange={e => setTotalRiseInches(parseFloat(e.target.value) || 0)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Target Riser (inches)</label>
          <input
            type="number"
            step="0.25"
            value={targetRiserInches}
            onChange={e => setTargetRiserInches(parseFloat(e.target.value) || 7)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tread Depth (inches)</label>
          <input
            type="number"
            step="0.25"
            value={treadDepthInches}
            onChange={e => setTreadDepthInches(parseFloat(e.target.value) || 10)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Total Steps" value={`${stepCount} risers`} highlight />
        <ResultCard label="Exact Riser Height" value={`${exactRiser.toFixed(2)} in`} />
        <ResultCard label="Total Run Length" value={`${(totalRunInches / 12).toFixed(2)} ft`} />
        <ResultCard label="Stringer Incline" value={`${angleDeg.toFixed(1)}°`} />
      </div>
    </div>
  );
};

// 7. Right Triangle / Pythagoras Calculator
const RightTriangleCalcView: React.FC = () => {
  const [sideA, setSideA] = useState<string>('3');
  const [sideB, setSideB] = useState<string>('4');
  const [sideC, setSideC] = useState<string>('');

  const a = parseFloat(sideA) || 0;
  const b = parseFloat(sideB) || 0;
  const c = parseFloat(sideC) || 0;

  let hyp = 0;
  let area = 0;
  let angleA = 0;
  let angleB = 0;

  if (a && b) {
    hyp = Math.sqrt(a * a + b * b);
    area = 0.5 * a * b;
    angleA = (Math.atan(a / b) * 180) / Math.PI;
    angleB = 90 - angleA;
  } else if (c && a && c > a) {
    const calcB = Math.sqrt(c * c - a * a);
    hyp = c;
    area = 0.5 * a * calcB;
    angleA = (Math.asin(a / c) * 180) / Math.PI;
    angleB = 90 - angleA;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Side A (Height)</label>
          <input
            type="number"
            value={sideA}
            onChange={e => setSideA(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Side B (Base)</label>
          <input
            type="number"
            value={sideB}
            onChange={e => setSideB(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Hypotenuse C</label>
          <input
            type="number"
            value={sideC}
            placeholder="Calculated"
            onChange={e => setSideC(e.target.value)}
            className="w-full border rounded-xl p-2 font-mono bg-white dark:bg-zinc-950 dark:border-zinc-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <ResultCard label="Hypotenuse (C)" value={hyp.toFixed(2)} highlight />
        <ResultCard label="Triangle Area" value={area.toFixed(2)} />
        <ResultCard label="Angle A" value={`${angleA.toFixed(1)}°`} />
        <ResultCard label="Angle B" value={`${angleB.toFixed(1)}°`} />
      </div>
    </div>
  );
};
