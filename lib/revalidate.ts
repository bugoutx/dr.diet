import { revalidateTag, revalidatePath } from "next/cache";
import { CACHE_TAG } from "./data";

export function revalidateSite() {
  revalidateTag(CACHE_TAG, "max");
  revalidatePath("/");
}
