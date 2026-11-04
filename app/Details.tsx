"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import "./details.css";

const instagram = "https://www.instagram.com/easyburger.ma/";
const tripadvisor = "https://www.tripadvisor.fr/Restaurant_Review-g293732-d34539088-Reviews-Easy_Burger-Casablanca_Casablanca_Settat.html";
const mapQuery = "Easy Burger, Rue Ennahas Annahoui, Casablanca, Maroc";
const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapQuery);
const directions = "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(mapQuery);

type MenuItem = [name: string, price: string, note?: string];
type Photo = { file: string; alt: string; caption: string; position?: string };
type Category = { name: string; photo: Photo; items: MenuItem[] };

const burgerPhoto: Photo = {
  file: "easy-hero",
  alt: "Un smash burger dans son bun doré, accompagné de frites",
  caption: "Le smash, côté cuisine.",
  position: "50% 58%",
};
const tablePhoto: Photo = {
  file: "easy-table",
  alt: "Une table vue du dessus avec un burger, des frites et des mini beignets",
  caption: "Le déjeuner est servi.",
  position: "50% 55%",
};
const beignetPhoto: Photo = {
  file: "easy-beignets",
  alt: "Des mini beignets saupoudrés de sucre autour d’un petit bol de sauce",
  caption: "Les mini beignets à partager.",
  position: "50% 51%",
};
const teamPhoto: Photo = {
  file: "easy-team",
  alt: "Un membre de l’équipe Easy Burger devant le comptoir",
  caption: "Derrière le comptoir.",
  position: "50% 32%",
};
const dessertPhoto: Photo = {
  file: "easy-chocolat",
  alt: "Des mini beignets tout près d’un pot de sauce brune",
  caption: "Le dernier beignet.",
  position: "50% 52%",
};
const mealPhoto: Photo = {
  file: "easy-service",
  alt: "Des burgers, des frites et des accompagnements réunis à table",
  caption: "À table chez Easy Burger.",
  position: "50% 49%",
};

const categories: Category[] = [
  { name: "Smash burgers", photo: burgerPhoto, items: [["Easy", "55"], ["Double Easy", "80"], ["Classic Double Cheese", "75"]] },
  { name: "À côté", photo: tablePhoto, items: [["Frites", "20"], ["Frites patates douces", "30"], ["Loaded fries", "45", "Classic ou Spicy"], ["Chicken tenders", "45"], ["Salade César", "60"]] },
  { name: "Menus", photo: mealPhoto, items: [["Menu Midi", "69"], ["Menu enfant", "50"], ["Upgrade Menu", "+20", "Supplément"]] },
  { name: "Desserts", photo: beignetPhoto, items: [["Easy Sundae", "30"], ["Scoopable cookie", "45", "Avec soft serve"], ["Mini beignets", "25"]] },
  { name: "Boissons", photo: tablePhoto, items: [["Eau / Soda", "15"], ["Lemonade", "20"], ["Lemonade 3/4p", "50"]] },
  { name: "Sauces", photo: mealPhoto, items: [["Easy", "5"], ["Sweet creamy", "5"], ["Green mayo", "5"], ["Spicy Mayo", "5"], ["Ketchup Heinz", "5"], ["Yellow mustard", "5"]] },
];

function Arrow({ up = false }: { up?: boolean }) {
  return <svg className="eb-arrow" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={up ? "M5 19 19 5M6 5h13v13" : "M3 12h17m-7-7 7 7-7 7"} />
  </svg>;
}

function InstagramIcon() {
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.8" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>;
}

function RestaurantPhoto({ photo, sizes }: { photo: Photo; sizes: string }) {
  return <Image unoptimized src={`/images/${photo.file}.webp`} alt={photo.alt} fill sizes={sizes} style={{ objectFit: "cover", objectPosition: photo.position }} />;
}

export function Menu() {
  const [selected, setSelected] = useState(0);
  const category = categories[selected];
  return (
    <section className="eb-section eb-menu" id="menu" aria-labelledby="eb-menu-title">
      <div className="eb-wrap">
        <div className="eb-heading">
          <h2 id="eb-menu-title">Au menu<span>.</span></h2>
          <p>Le smash au centre de la table.<br /> À vous de choisir la suite.</p>
        </div>
        <div className="eb-filters" role="group" aria-label="Catégories de la carte">
          {categories.map(({ name }, index) => (
            <button key={name} type="button" aria-pressed={index === selected} aria-controls="eb-menu-list" onClick={() => setSelected(index)}>{name}</button>
          ))}
        </div>
        <div className="eb-menu-body">
          <figure className="eb-menu-photo">
            <RestaurantPhoto photo={category.photo} sizes="(max-width: 720px) 100vw, 40vw" />
            <figcaption>{category.photo.caption}</figcaption>
          </figure>
          <div id="eb-menu-list" className="eb-menu-list" aria-live="polite" aria-atomic="true">
            <h3>{category.name}</h3>
            <dl>
              {category.items.map(([name, price, note]) => (
                <div className="eb-menu-row" key={name}>
                  <dt>{name}{note && <small>{note}</small>}</dt>
                  <dd>{price} <abbr title="dirhams marocains">DH</abbr></dd>
                </div>
              ))}
            </dl>
            <p className="eb-menu-note">Prix indicatifs en dirhams, à confirmer sur place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const moments = [tablePhoto, teamPhoto, dessertPhoto];

export function Moments() {
  const [current, setCurrent] = useState(0);
  const viewer = useRef<HTMLDialogElement>(null);
  const selected = moments[current];
  return (
    <section className="eb-section eb-moments" id="moments" aria-labelledby="eb-moments-title">
      <div className="eb-wrap">
        <div className="eb-heading">
          <h2 id="eb-moments-title">Les bons moments<span>.</span></h2>
          <a className="eb-social" href={instagram + "reels/"} target="_blank" rel="noreferrer"><InstagramIcon /> Voir les reels <Arrow up /></a>
        </div>
        <div className="eb-gallery">
          {moments.map((photo, index) => (
            <figure key={photo.file}>
              <button type="button" className="eb-gallery-open" aria-haspopup="dialog" aria-label={`Agrandir la photo « ${photo.caption} »`} onClick={() => { setCurrent(index); viewer.current?.showModal(); }}>
                <RestaurantPhoto photo={photo} sizes="(max-width: 540px) 82vw, 34vw" />
                <span className="eb-expand" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 3h7v7M21 3l-7 7M10 21H3v-7m0 7 7-7" /></svg></span>
              </button>
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <dialog ref={viewer} className="eb-viewer" aria-labelledby="eb-photo-caption" data-lenis-prevent onClick={(event) => { if (event.currentTarget === event.target) viewer.current?.close(); }}>
        <div className="eb-viewer-panel">
          <button type="button" className="eb-viewer-close" aria-label="Fermer la photo" onClick={() => viewer.current?.close()}><svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m4 4 12 12M16 4 4 16" /></svg></button>
          <Image unoptimized src={`/images/${selected.file}.webp`} alt={selected.alt} width={772} height={1368} />
          <p id="eb-photo-caption" aria-live="polite">{selected.caption}</p>
          <div className="eb-viewer-nav">
            <button type="button" onClick={() => setCurrent((current + moments.length - 1) % moments.length)}>Précédente</button>
            <button type="button" onClick={() => setCurrent((current + 1) % moments.length)}>Suivante <Arrow /></button>
          </div>
        </div>
      </dialog>
    </section>
  );
}

export function Location() {
  return (
    <section className="eb-section eb-location" id="adresse" aria-labelledby="eb-address-title">
      <div className="eb-wrap">
        <div className="eb-heading"><h2 id="eb-address-title">On se retrouve <em>à Casa<span>.</span></em></h2></div>
        <div className="eb-visit-grid">
          <div className="eb-contact">
            <h3>L’adresse</h3>
            <address>Rue Ennahas Annahoui<br />Casablanca, Maroc</address>
            <a className="eb-map-link" href={directions} target="_blank" rel="noreferrer">Itinéraire <Arrow up /></a>
            <a className="eb-tel" href="tel:+212664470771">+212 664 470 771</a>
          </div>
          <div className="eb-hours">
            <h3>Quand passer ?</h3>
            <dl>
              <div><dt>Lundi</dt><dd>Fermé</dd></div>
              <div><dt>Mar. – ven.</dt><dd>12h30 – 15h30<br />19h30 – 22h30</dd></div>
              <div><dt>Samedi</dt><dd>13h30 – 18h30<br />20h30 – 23h30</dd></div>
              <div><dt>Dimanche</dt><dd>14h30 – 22h00</dd></div>
            </dl>
          </div>
          <div className="eb-map-tile">
            <iframe title="Plan du quartier d’Easy Burger à Casablanca" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={"https://maps.google.com/maps?q=" + encodeURIComponent(mapQuery) + "&z=16&output=embed"} />
            <a href={maps} target="_blank" rel="noreferrer">Ouvrir dans Google Maps <Arrow up /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="eb-footer">
      <div className="eb-wrap">
        <div className="eb-footer-head"><span>Easy Burger · Casablanca</span><nav aria-label="Retrouvez Easy Burger"><a href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow up /></a><a href={tripadvisor} target="_blank" rel="noreferrer">Tripadvisor <Arrow up /></a></nav></div>
        <a href="#" className="eb-footer-mark" aria-label="Easy Burger, retour en haut de page">easy burger<span>.</span></a>
      </div>
    </footer>
  );
}
