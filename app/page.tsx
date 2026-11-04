import { Footer, Location, Menu, Moments } from "./Details";
import { Header, Hero, PosterStrip, ScrollMotion } from "./Poster";
import Reviews from "./Reviews";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu">
        <Hero />
        <PosterStrip />
        <Menu />
        <Moments />
        <Reviews />
        <Location />
      </main>
      <Footer />
      <ScrollMotion />
    </>
  );
}
