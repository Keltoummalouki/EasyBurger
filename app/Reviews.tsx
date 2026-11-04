"use client";

import { useRef, useState, type FormEvent } from "react";
import type { GuestReview } from "./api/reviews/types";
import "./reviews.css";

const googleMaps = "https://www.google.com/maps/search/?api=1&query=Easy+Burger+Rue+Ennahas+Annahoui+Casablanca";
const reviewSource = "https://fr.restaurantguru.com/Easy-burger-Casablanca";
const dateFormat = new Intl.DateTimeFormat("fr-MA", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Casablanca" });

function ArrowIcon({ external = false }: { external?: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      {external ? <path d="M6 18 18 6M7 6h11v11" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

function Star({ filled = true }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="m12 2.6 2.85 5.94 6.53.88-4.74 4.58 1.15 6.48L12 17.35l-5.79 3.13L7.36 14 2.62 9.42l6.53-.88Z" />
    </svg>
  );
}

export default function Reviews() {
  const [source, setSource] = useState<"google" | "site">("google");
  const [reviews, setReviews] = useState<GuestReview[] | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [rating, setRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [posted, setPosted] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const latestLoad = useRef(0);
  const submission = useRef({ id: "", content: "" });

  async function loadReviews(after: string | null = null) {
    const version = ++latestLoad.current;
    setLoading(true);
    setListError("");
    try {
      const response = await fetch(after ? `/api/reviews?after=${encodeURIComponent(after)}` : "/api/reviews", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (version !== latestLoad.current) return;
      setReviews((current) => after ? [...(current ?? []), ...data.reviews] : data.reviews);
      setNextCursor(data.nextCursor);
    } catch {
      if (version === latestLoad.current) setListError("Impossible de charger les avis pour le moment.");
    } finally {
      if (version === latestLoad.current) setLoading(false);
    }
  }

  function showGuestReviews() {
    setSource("site");
    if (reviews === null && !loading) void loadReviews();
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const details = { name: String(fields.get("name") || "").trim(), rating, comment: String(fields.get("comment") || "").trim() };
    if (!details.name || details.comment.length < 3) {
      setFormError("Renseignez votre prénom et écrivez au moins trois caractères.");
      return;
    }
    const content = JSON.stringify(details);
    setSending(true);
    setFormError("");
    try {
      if (content !== submission.current.content) {
        submission.current = { id: crypto.randomUUID(), content };
      }
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...details, id: submission.current.id }),
      });
      if (!response.ok) {
        const failure = await response.json().catch(() => null);
        throw new Error(failure?.message || "Publication impossible. Réessayez dans un instant.");
      }
      const { review } = await response.json();
      setReviews((current) => [review, ...(current ?? []).filter((item) => item.id !== review.id)]);
      setSource("site");
      setPosted(true);
      form.reset();
      setRating(0);
      submission.current = { id: "", content: "" };
      dialog.current?.close();
      void loadReviews();
    } catch (error) {
      setFormError(error instanceof TypeError ? "Vérifiez votre connexion, puis réessayez." : (error as Error).message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="review-section" id="avis" aria-labelledby="reviews-title">
      <div className="review-wrap">
        <div className="review-head">
          <div>
            <p className="review-eyebrow"><span aria-hidden="true">✳</span> Le livre d’or</p>
            <h2 id="reviews-title">La parole à Casa<span>.</span></h2>
          </div>
          <button className="review-action" type="button" onClick={() => { setFormError(""); dialog.current?.showModal(); }}>
            Écrire un avis <ArrowIcon />
          </button>
        </div>
        <div className="review-sources" role="group" aria-label="Source des avis">
          <button type="button" aria-pressed={source === "google"} onClick={() => setSource("google")}>Sur Google</button>
          <button type="button" aria-pressed={source === "site"} onClick={showGuestReviews}>Sur le site</button>
        </div>
        {source === "google" ? (
          <div className="review-feature">
            <div className="review-score">
              <p className="review-score-number" aria-label="Note de 4,9 sur 5">4,9<span>/5</span></p>
              <span className="review-kicker">97 notes sur Google</span>
            </div>
            <div className="review-quote">
              <blockquote>« Très bon nouveau spot de burger à casa. Staff très accueillant. Je recommande vivement ! »</blockquote>
              <cite>Hiba Lebbar <span>· Avis Google</span></cite>
            </div>
            <div className="review-source-line">
              <span>Relevé du 4 nov. 2026 via <a href={reviewSource} target="_blank" rel="noopener noreferrer">Restaurant Guru</a></span>
              <a href={googleMaps} target="_blank" rel="noopener noreferrer" className="review-map-link">Voir sur Google Maps <ArrowIcon external /></a>
            </div>
          </div>
        ) : (
          <div className="review-guestbook" aria-busy={loading}>
            {posted && <p className="review-notice" role="status">Merci ! Votre avis est publié.</p>}
            {reviews?.map((review) => (
              <article key={review.id} className="review-entry">
                <div className="review-entry-head">
                  <strong>{review.name}</strong>
                  <time dateTime={review.createdAt}>{dateFormat.format(new Date(review.createdAt))}</time>
                </div>
                <span className="review-stars" role="img" aria-label={`${review.rating} sur 5`}>
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} filled={star <= review.rating} />)}
                </span>
                <p>{review.comment}</p>
              </article>
            ))}
            {reviews?.length === 0 && !listError && <p className="review-empty">Le livre d’or est ouvert. Qui laisse le premier mot ?</p>}
            {loading && <p className="review-status" role="status">Chargement des avis…</p>}
            {listError && <p className="review-status" role="alert">{listError} <button type="button" onClick={() => void loadReviews(nextCursor)}>Réessayer</button></p>}
            {!loading && !listError && nextCursor && <button className="review-more" type="button" onClick={() => void loadReviews(nextCursor)}>Voir plus d’avis <span aria-hidden="true">↓</span></button>}
          </div>
        )}
      </div>
      <dialog className="review-sheet" aria-labelledby="review-form-title" ref={dialog} data-lenis-prevent>
        <div className="review-sheet-inner">
          <div className="review-sheet-head">
            <p className="review-eyebrow">Le livre d’or</p>
            <button className="review-close" aria-label="Fermer le formulaire" type="button" onClick={() => dialog.current?.close()}>×</button>
          </div>
          <h3 id="review-form-title">Votre avis<span>.</span></h3>
          <p className="review-form-intro">Votre prénom et votre avis seront visibles sur le site.</p>
          <form onSubmit={publish}>
            <label className="review-field">Prénom
              <input name="name" type="text" maxLength={40} autoComplete="given-name" required />
            </label>
            <fieldset className="review-rating">
              <legend>Votre note</legend>
              <div>{[1, 2, 3, 4, 5].map((star) => (
                <label key={star}>
                  <input type="radio" name="rating" value={star} checked={star === rating} onChange={() => setRating(star)} aria-label={`${star} étoile${star > 1 ? "s" : ""}`} required />
                  <span><Star filled={star <= rating} /></span>
                </label>
              ))}</div>
            </fieldset>
            <label className="review-field">Votre commentaire
              <textarea name="comment" rows={3} minLength={3} maxLength={400} required />
            </label>
            {formError && <p className="review-form-error" role="alert">{formError}</p>}
            <button type="submit" className="review-action" disabled={sending}>{sending ? "Publication…" : "Publier mon avis"} <ArrowIcon /></button>
          </form>
        </div>
      </dialog>
    </section>
  );
}
