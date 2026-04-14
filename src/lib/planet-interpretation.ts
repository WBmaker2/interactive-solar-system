function formatValue(value: number) {
  const rounded = value.toFixed(2);
  return rounded.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

export function formatPlanetMetricValue(value: number, unit: string) {
  return unit === "AU" ? `${formatValue(value)} ${unit}` : `${formatValue(value)}${unit}`;
}

export function describePlanetSize(diameterEarths: number) {
  if (diameterEarths < 0.5) {
    return "지구보다 훨씬 작아요";
  }

  if (diameterEarths < 0.8) {
    return "지구보다 작아요";
  }

  if (diameterEarths < 1.2) {
    return "지구와 비슷한 크기예요";
  }

  if (diameterEarths < 5) {
    return "지구보다 꽤 커요";
  }

  return "태양계에서 매우 큰 행성이에요";
}

export function describeDistance(distanceFromSunAU: number) {
  if (distanceFromSunAU < 0.8) {
    return "태양에 아주 가까워요";
  }

  if (distanceFromSunAU < 1.5) {
    return "태양과 가까운 편이에요";
  }

  if (distanceFromSunAU < 10) {
    return "태양에서 꽤 멀어요";
  }

  return "태양에서 아주 멀어요";
}

export function describeOrbitalPeriod(orbitalPeriodDays: number) {
  if (orbitalPeriodDays < 100) {
    return "한 바퀴 도는 데 아주 짧은 시간이 걸려요";
  }

  if (orbitalPeriodDays < 400) {
    return "1년 안에 한 바퀴를 돌아요";
  }

  if (orbitalPeriodDays < 5000) {
    return "여러 해가 걸려요";
  }

  return "아주 오랜 시간이 걸려요";
}
