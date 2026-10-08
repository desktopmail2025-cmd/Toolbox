import React, { useState } from 'react';
import { ToolItem } from '../../types';
import { ToolHeader } from '../common/ToolHeader';
import { GeneralCalculators } from './GeneralCalculators';
import { FinanceCalculators } from './FinanceCalculators';
import { ConversionHub } from './ConversionHub';
import { StudentTools } from './StudentTools';
import { HomeDailyTools } from './HomeDailyTools';
import { DiyConstructionTools } from './DiyConstructionTools';
import { SmartphoneMediaTools } from './SmartphoneMediaTools';
import { CameraImageTools } from './CameraImageTools';
import { TextWritingTools } from './TextWritingTools';
import { SecurityPrivacyTools } from './SecurityPrivacyTools';
import { TravelTools } from './TravelTools';
import { InternetTools } from './InternetTools';
import { GameZone } from './GameZone';
import { EverydayQuickTools } from './EverydayQuickTools';
import { PdfDocumentTools } from './PdfDocumentTools';
import { HealthWellnessTools } from './HealthWellnessTools';
import { DeveloperTools } from './DeveloperTools';
import { LiveDataTools } from './LiveDataTools';
import { AudioMusicTools } from './AudioMusicTools';
import { ExtendedUtilities } from './ExtendedUtilities';
import { HotPicksView } from './HotPicksTools';
import { ProfessionalTools } from './ProfessionalTools';
import { MedicineReminderView } from './MedicineReminderTool';
import { PerfectPrimeCalculatorView } from './PerfectPrimeCalculator';
import { SportsLiveScoresTool } from './SportsLiveScoresTool';
import { TeamFormationBuilder } from './TeamFormationBuilder';
import { ScorecardMakerTool } from './ScorecardMakerTool';
import { CodeIdePlayground } from './CodeIdePlayground';
import { LoveManagementTools } from './LoveManagementTools';
import { DateReminderTools } from './DateReminderTools';
import { NumberArrangementTool } from './NumberArrangementTool';
import { HeadlineMakerTool } from './HeadlineMakerTool';
import { PackageArchiveConverterTool } from './PackageArchiveConverterTool';
import { AdMobBanner } from '../ads/AdMobBanner';

interface ToolDispatcherProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelectTool?: (tool: ToolItem) => void;
  onOpenAdMobPerformance?: () => void;
}

export const ToolDispatcher: React.FC<ToolDispatcherProps> = ({
  tool,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  onOpenAdMobPerformance,
}) => {
  const [resetKey, setResetKey] = useState<number>(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  const renderToolBody = () => {
    if (tool.id === 'prime-checker' || tool.id === 'prime-calculator') {
      return <PerfectPrimeCalculatorView key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'number-arrangement') {
      return <NumberArrangementTool key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'code-ide-playground') {
      return <CodeIdePlayground key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'sports-live-scores') {
      return <SportsLiveScoresTool key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'team-formation-builder') {
      return <TeamFormationBuilder key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'scorecard-maker') {
      return <ScorecardMakerTool key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'headline-maker') {
      return <HeadlineMakerTool key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'package-archive-converter') {
      return <PackageArchiveConverterTool key={`${tool.id}-${resetKey}`} />;
    }
    if (tool.id === 'whiteboard-canvas') {
      return <StudentTools key={`${tool.id}-${resetKey}`} toolId="student-whiteboard" />;
    }

    switch (tool.categoryId) {
      case 'live-score':
        if (tool.id === 'team-formation-builder') {
          return <TeamFormationBuilder key={`${tool.id}-${resetKey}`} />;
        }
        if (tool.id === 'scorecard-maker') {
          return <ScorecardMakerTool key={`${tool.id}-${resetKey}`} />;
        }
        return <SportsLiveScoresTool key={`${tool.id}-${resetKey}`} />;
      case 'general':
        return <GeneralCalculators key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'finance':
        return <FinanceCalculators key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'conversions':
        return <ConversionHub key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'health':
        return <HealthWellnessTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'student':
        return <StudentTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'home':
        return <HomeDailyTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'diy':
        return <DiyConstructionTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'smartphone':
        return <SmartphoneMediaTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'camera':
        return <CameraImageTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'text':
        return <TextWritingTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'security':
        return <SecurityPrivacyTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'travel':
        return <TravelTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'internet':
        return <InternetTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'games':
        return <GameZone key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'quick':
        return <EverydayQuickTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'pdf':
        return <PdfDocumentTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'developer':
        return <DeveloperTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'live-data':
        return <LiveDataTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'audio-music':
        return <AudioMusicTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'hot-picks':
        return <HotPicksView key={`${tool.id}-${resetKey}`} />;
      case 'professional':
        return <ProfessionalTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'love-management':
        return <LoveManagementTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      case 'date-reminder':
        return <DateReminderTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      default: {
        if (tool.id === 'medicine-reminder') {
          return <MedicineReminderView key={`${tool.id}-${resetKey}`} />;
        }
        if (tool.id === 'hot-picks-feed') {
          return <HotPicksView key={`${tool.id}-${resetKey}`} />;
        }
        if (tool.id === 'video-to-audio') {
          return <ProfessionalTools key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
        }
        // Check if handled by extended utilities
        return <ExtendedUtilities key={`${tool.id}-${resetKey}`} toolId={tool.id} />;
      }
    }
  };

  return (
    <div className="w-full pb-20">
      <ToolHeader
        tool={tool}
        onBack={onBack}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onReset={handleReset}
        onSelectTool={onSelectTool}
      />
      {renderToolBody()}

      {/* Google AdMob Banner docked cleanly at tool footer */}
      <div className="pt-8">
        <AdMobBanner variant="inline" />
      </div>
    </div>
  );
};
