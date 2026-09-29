import { Badge } from "@/components/ui/Badge";
import type { Translator } from "@/i18n/translate";
import type { HeritageStatus } from "@/types/guide";

const statusTones: Record<HeritageStatus, "success" | "danger" | "warning" | "gold" | "muted"> = {
  exists: "success",
  vanished: "danger",
  "in-renovation": "warning",
  optional: "gold",
  unknown: "muted",
};

/** "BESTAAT NOG", "VERDWENEN", … in a color that matches the status. */
export function StatusBadge({ status, t }: { status: HeritageStatus; t: Translator }) {
  return <Badge tone={statusTones[status]}>{t(`guide.status.${status}`)}</Badge>;
}
