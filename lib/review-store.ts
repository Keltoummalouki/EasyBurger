import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { reviewIdPattern, pageSize, type GuestReview } from "../app/api/reviews/types";

// Point this at a persistent volume when running the Node server in a container.
const directory = process.env.EASYBURGER_REVIEWS_DIR || path.join(process.cwd(), ".easyburger-data", "reviews");

export async function listReviews(cursor: string | null): Promise<GuestReview[]> {
  const files = await readdir(/* turbopackIgnore: true */ directory).catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const published = files.filter((name) => reviewIdPattern.test(name));
  const reviews: GuestReview[] = await Promise.all(published.map(async (name) =>
    JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ directory, name, "review.json"), "utf8"))
  ));
  reviews.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  const start = cursor ? reviews.findIndex((review) => review.id === cursor) + 1 : 0;
  return reviews.slice(start, start + pageSize + 1);
}

export async function saveReview(review: GuestReview): Promise<GuestReview> {
  await mkdir(directory, { recursive: true });
  const temporary = await mkdtemp(path.join(/* turbopackIgnore: true */ directory, ".incoming-"));
  const destination = path.join(/* turbopackIgnore: true */ directory, review.id);
  try {
    await writeFile(path.join(temporary, "review.json"), JSON.stringify(review));
    // A completed non-empty directory can be published atomically but never overwritten by a retry.
    await rename(temporary, destination);
    return review;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EEXIST" && code !== "ENOTEMPTY" && code !== "EPERM" && code !== "EACCES") throw error;
    return JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ destination, "review.json"), "utf8"));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}
