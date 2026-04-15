export const speedOptions = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const defaultSpeedMultiplier = 1;

function clampSpeedSliderValue(value: number) {
  return Math.min(Math.max(value, 0), speedOptions.length - 1);
}

export function getSpeedSliderValue(speedMultiplier: number) {
  const sliderValue = speedOptions.indexOf(
    speedMultiplier as (typeof speedOptions)[number]
  );

  if (sliderValue >= 0) {
    return sliderValue;
  }

  return speedOptions.indexOf(defaultSpeedMultiplier);
}

export function getSpeedMultiplierFromSliderValue(sliderValue: number) {
  return speedOptions[clampSpeedSliderValue(sliderValue)];
}

export function formatSpeedMultiplier(speedMultiplier: number) {
  return `x${speedMultiplier}`;
}
