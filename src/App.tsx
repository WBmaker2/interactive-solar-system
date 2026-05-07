import { useState } from "react";

import SolarSystemCanvas from "./components/solar/SolarSystemCanvas";
import ComparisonSheet from "./components/ui/ComparisonSheet";
import ControlBar from "./components/ui/ControlBar";
import MissionChip from "./components/ui/MissionChip";
import MobileInfoSheet from "./components/ui/MobileInfoSheet";
import MotionGuideDialog from "./components/ui/MotionGuideDialog";
import PlanetInfoPanel from "./components/ui/PlanetInfoPanel";
import ScaleNotice from "./components/ui/ScaleNotice";
import { useSolarSystemApp } from "./hooks/useSolarSystemApp";

export default function App() {
  const [isMotionGuideOpen, setIsMotionGuideOpen] = useState(false);
  const {
    planets,
    selectedPlanetId,
    isPlaying,
    speedMultiplier,
    currentMission,
    isCurrentMissionComplete,
    comparisonMode,
    isComparisonOpen,
    sceneResetVersion,
    selectPlanet,
    togglePlaying,
    setSpeedMultiplier,
    resetScene,
    openComparison,
    closeComparison,
  } = useSolarSystemApp();
  const selectedPlanet =
    planets.find((planet) => planet.id === selectedPlanetId) ?? null;
  const isOverlayOpen = isComparisonOpen || isMotionGuideOpen;

  return (
    <div className="app-shell">
      <div aria-hidden={isOverlayOpen} className="app-shell__content">
        <header className="app-header">
          <div className="app-header__copy">
            <p className="app-header__eyebrow">5~6학년 과학</p>
            <h1>내 손안의 우주</h1>
            <p className="app-header__lead">
              태양을 중심으로 행성의 거리, 크기, 공전 속도를 직접 비교해 보세요.
            </p>
          </div>

          <div
            className="mission-strip"
            aria-label="오늘의 미션"
            aria-live="polite"
            aria-atomic="true"
          >
            {currentMission ? (
              <MissionChip
                label={currentMission.prompt}
                hint={currentMission.hint}
                explanation={
                  isCurrentMissionComplete ? currentMission.completionExplanation : undefined
                }
                status={isCurrentMissionComplete ? "completed" : "active"}
              />
            ) : (
              <p className="mission-strip__complete">모든 미션을 완료했어요.</p>
            )}
          </div>
        </header>

        <main className="app-main">
          <section className="scene-column">
            <SolarSystemCanvas
              onPlanetSelect={selectPlanet}
              isPlaying={isPlaying}
              planets={planets}
              selectedPlanetId={selectedPlanetId}
              sceneResetVersion={sceneResetVersion}
              speedMultiplier={speedMultiplier}
            />
            <ScaleNotice />
          </section>

          <PlanetInfoPanel planet={selectedPlanet} />
        </main>

        <MobileInfoSheet planet={selectedPlanet} />

        <ControlBar
          isPlaying={isPlaying}
          onOpenComparison={openComparison}
          onOpenMotionGuide={() => setIsMotionGuideOpen(true)}
          onReset={resetScene}
          onSpeedChange={setSpeedMultiplier}
          onTogglePlaying={togglePlaying}
          speedMultiplier={speedMultiplier}
        />
      </div>

      <ComparisonSheet
        isOpen={isComparisonOpen}
        mode={comparisonMode}
        onClose={closeComparison}
        onModeChange={openComparison}
        planets={planets}
      />
      <MotionGuideDialog
        isOpen={isMotionGuideOpen}
        onClose={() => setIsMotionGuideOpen(false)}
        planet={selectedPlanet}
      />
    </div>
  );
}
