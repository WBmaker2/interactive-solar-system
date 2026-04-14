import SolarSystemCanvas from "./components/solar/SolarSystemCanvas";
import ComparisonSheet from "./components/ui/ComparisonSheet";
import ControlBar from "./components/ui/ControlBar";
import MissionChip from "./components/ui/MissionChip";
import MobileInfoSheet from "./components/ui/MobileInfoSheet";
import PlanetInfoPanel from "./components/ui/PlanetInfoPanel";
import ScaleNotice from "./components/ui/ScaleNotice";
import { useSolarSystemApp } from "./hooks/useSolarSystemApp";

export default function App() {
  const {
    planets,
    angles,
    selectedPlanetId,
    isPlaying,
    speedMultiplier,
    currentMission,
    isCurrentMissionComplete,
    comparisonMode,
    isComparisonOpen,
    selectPlanet,
    togglePlaying,
    setSpeedMultiplier,
    resetScene,
    openComparison,
    closeComparison,
  } = useSolarSystemApp();
  const selectedPlanet =
    planets.find((planet) => planet.id === selectedPlanetId) ?? null;

  return (
    <div className="app-shell">
      <div aria-hidden={isComparisonOpen} className="app-shell__content">
        <header className="app-header">
          <div className="app-header__copy">
            <p className="app-header__eyebrow">5~6학년 과학</p>
            <h1>내 손안의 우주</h1>
            <p className="app-header__lead">
              태양을 중심으로 행성의 거리, 크기, 공전 속도를 직접 비교해 보세요.
            </p>
          </div>

          <div className="mission-strip" aria-label="오늘의 미션">
            {currentMission ? (
              <MissionChip
                label={currentMission.prompt}
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
              angles={angles}
              onPlanetSelect={selectPlanet}
              planets={planets}
              selectedPlanetId={selectedPlanetId}
            />
            <ScaleNotice />
          </section>

          <PlanetInfoPanel planet={selectedPlanet} />
        </main>

        <MobileInfoSheet planet={selectedPlanet} />

        <ControlBar
          isPlaying={isPlaying}
          onOpenComparison={openComparison}
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
    </div>
  );
}
