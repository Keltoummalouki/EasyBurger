import { listReviews, saveReview } from "../../../lib/review-store";
import { pageSize, reviewIdPattern } from "./types";

function problem(message: string, status: number) {
  return Response.json({ message }, { status });
}

export async function GET(request: Request) {
  const cursor = new URL(request.url).searchParams.get("after");
  try {
    const page = await listReviews(cursor);
    const reviews = page.slice(0, pageSize);
    return Response.json({
      reviews,
      nextCursor: page.length > pageSize ? reviews.at(-1)?.id : null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return problem("Impossible de charger les avis pour le moment.", 503);
  }
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return problem("Format de formulaire invalide.", 415);
  }
  if (Number(request.headers.get("content-length")) > 8192) {
    return problem("Ce message est trop long.", 413);
  }
  let body;
  try {
    const input = await request.text();
    if (input.length > 8192) return problem("Ce message est trop long.", 413);
    body = JSON.parse(input);
  } catch {
    return problem("Impossible de lire le formulaire.", 400);
  }
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";
  const rating = body?.rating;
  const id = body?.id;
  if (typeof id !== "string" || !reviewIdPattern.test(id)) return problem("Identifiant d’envoi invalide.", 400);
  if (!name || name.length > 40) return problem("Saisissez un prénom de 1 à 40 caractères.", 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return problem("Choisissez une note de 1 à 5.", 400);
  if (comment.length < 3 || comment.length > 400) return problem("Votre avis doit contenir de 3 à 400 caractères.", 400);
  try {
    const review = await saveReview({ id, name, comment, rating, createdAt: new Date().toISOString() });
    if (review.name !== name || review.comment !== comment || review.rating !== rating) {
      return problem("Ce formulaire a déjà été envoyé.", 409);
    }
    return Response.json({ review }, { status: 201 });
  } catch {
    return problem("Votre avis n’a pas pu être enregistré. Réessayez dans un instant.", 503);
  }
}
