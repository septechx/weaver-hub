import type { UUID } from "crypto";

export type Weave = {
  name: string;
  uuid: UUID;
  data: string;
  preview: string;
  updatedAt: Date;
};
