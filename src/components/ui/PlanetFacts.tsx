import type { PlanetRecord } from "../../types/solar-system";

interface PlanetFactsProps {
  planet: PlanetRecord;
  title: string;
  className?: string;
}

export default function PlanetFacts({ planet, title, className }: PlanetFactsProps) {
  return (
    <section className={className} aria-label="행성 특징">
      <h3 className="info-panel__section-title">{title}</h3>
      <ul className="planet-facts">
        {planet.facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ul>
    </section>
  );
}
