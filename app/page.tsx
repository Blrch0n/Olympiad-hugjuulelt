import GalaxyHero from "@/app/components/GalaxyHero";
import ErrorBoundary from "@/app/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <GalaxyHero />
    </ErrorBoundary>
  );
}
