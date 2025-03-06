"use server";

import { eq } from "drizzle-orm";
import { db, weavesTable } from "@/db";
import type { UUID } from "crypto";
import type { Weave } from "./types";

export async function getWeaves() {
  return (await db
    .select()
    .from(weavesTable)
    .then((weaves) =>
      weaves.map(({ id, ...other }) => ({
        uuid: id,
        ...other,
      })),
    )) as Weave[];
}

export async function editWeaveName(newName: string, id: UUID) {
  await db
    .update(weavesTable)
    .set({ name: newName })
    .where(eq(weavesTable.id, id));
}

export async function deleteWeave(id: UUID) {
  await db.delete(weavesTable).where(eq(weavesTable.id, id));
}
