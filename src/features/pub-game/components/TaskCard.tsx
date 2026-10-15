"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { TaskText } from "@/data/walks/hidden-pubs/game/content/types";
import { useT } from "@/i18n/client";
import type { EvidenceTask } from "@/types/pub-game";
import { useUploadMode } from "../client/texts-context";
import { uploadEvidence } from "../client/upload";
import type { PubGameHandle } from "../client/usePubGame";
import { ALLOWED_TYPES } from "../media";
import { teammates } from "../logic/view-helpers";
import { FormError } from "./FormError";

/**
 * A photo/video task (a pubtask like Lucie, or one of Beery's bonus tasks):
 * what to do and what it's worth; take or choose the photo/video, see it,
 * tick who took part, send it to the host. Points only count after the host
 * approves; a rejected one can be sent again. Always skippable.
 */
export function TaskCard({ game, task, text }: { game: PubGameHandle; task: EvidenceTask; text: TaskText | undefined }) {
  const t = useT();
  const { view } = game;
  const team = teammates(view);
  // This team's latest submission for this task (an earlier one may have been rejected).
  const latest = [...view.evidence].reverse().find((item) => item.taskId === task.id && item.teamId === view.team.id);
  const skipped = view.team.doneTaskIds.includes(task.id) && !latest;
  const canSend = !skipped && (!latest || latest.status === "rejected");

  return (
    <section className="flex flex-col gap-3 rounded-sm border border-gold/50 bg-umber/70 p-4">
      <h2 className="font-display text-2xl font-semibold text-parchment">{text?.title ?? task.id}</h2>
      <p className="text-sm font-semibold text-gold">
        {task.scoring === "per-player"
          ? t("pubgame.tasks.perPlayer", { points: task.points })
          : t.plural("pubgame.tasks.points", task.points)}
      </p>
      {text && <p>{text.instruction}</p>}
      <p className="text-sm text-parchment/70">
        {t("pubgame.tasks.respect")} {t("pubgame.evidence.consent")}
      </p>

      {/* Always mounted: a new status (sent, approved, rejected) is announced. */}
      <p role="status" className={latest ? "font-semibold" : "sr-only"}>
        {latest?.status === "pending" && <span className="text-parchment">{t("pubgame.evidence.pending")}</span>}
        {latest?.status === "approved" && (
          <span className="text-green-300">
            {t.plural(
              "pubgame.evidence.approved",
              task.scoring === "per-player" && view.scoringMode === "team" ? task.points * latest.participantIds.length : task.points,
            )}
          </span>
        )}
        {latest?.status === "rejected" && (
          <span className="text-red-300">
            {latest.rejectionReason
              ? t("pubgame.evidence.rejectedReason", { reason: latest.rejectionReason })
              : t("pubgame.evidence.rejected")}{" "}
            {t("pubgame.evidence.sendAgain")}
          </span>
        )}
      </p>

      {skipped && <p className="text-gold">{t("pubgame.tasks.done")}</p>}
      {canSend && <EvidenceForm game={game} task={task} team={team.map((player) => ({ id: player.id, name: player.name }))} canSkip={!latest} />}
    </section>
  );
}

interface EvidenceFormProps {
  game: PubGameHandle;
  task: EvidenceTask;
  team: { id: string; name: string }[];
  /** Skipping is only possible before anything was sent. */
  canSkip: boolean;
}

function EvidenceForm({ game, task, team, canSkip }: EvidenceFormProps) {
  const t = useT();
  const uploadMode = useUploadMode();
  const { act, busy } = game;
  const [file, setFile] = useState<File | null>(null);
  const [participants, setParticipants] = useState<string[]>(team.map((player) => player.id));
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const isPhoto = task.evidence === "photo";
  const inputId = `evidence-${task.id}`;

  // Free the preview's memory when it changes or the screen closes.
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  async function send() {
    if (!file || participants.length === 0) return;
    setError(null);
    setProgress(0);
    const uploaded = await uploadEvidence(game.code, task.id, task.evidence, file, uploadMode, setProgress);
    if (!uploaded.ok) {
      setProgress(null);
      setError(uploaded.error);
      return;
    }
    const failure = await act({ type: "SUBMIT_EVIDENCE", taskId: task.id, mediaId: uploaded.mediaId, participantIds: participants });
    setProgress(null);
    setError(failure);
    if (!failure) setFile(null);
  }

  const sending = progress !== null;

  return (
    <div className="flex flex-col gap-3">
      {/* The label is the big button; `capture` opens the camera straight away on phones. */}
      <label
        htmlFor={inputId}
        className="flex min-h-14 cursor-pointer items-center justify-center rounded-sm border border-gold/70 px-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-gold hover:bg-gold hover:text-ink focus-within:outline-2 focus-within:outline-gold"
      >
        {isPhoto ? t("pubgame.evidence.takePhoto") : t("pubgame.evidence.takeVideo")}
      </label>
      <input
        id={inputId}
        type="file"
        accept={ALLOWED_TYPES[task.evidence].join(",")}
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          setError(null);
          setFile(event.target.files?.[0] ?? null);
        }}
      />

      {previewUrl &&
        (isPhoto ? (
          // A local preview (blob: URL), not an optimisable site image: a plain <img> is right here.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt={t("pubgame.evidence.previewPhoto")} className="max-h-72 w-full rounded-sm object-contain" />
        ) : (
          <video src={previewUrl} controls playsInline aria-label={t("pubgame.evidence.previewVideo")} className="max-h-72 w-full rounded-sm" />
        ))}

      {file && team.length > 1 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">{t("pubgame.evidence.whoTookPart")}</legend>
          <div className="grid grid-cols-2 gap-2">
            {team.map((player) => (
              <label key={player.id} className="flex min-h-11 items-center gap-2">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-gold"
                  checked={participants.includes(player.id)}
                  onChange={(event) =>
                    setParticipants((current) =>
                      event.target.checked ? [...current, player.id] : current.filter((id) => id !== player.id),
                    )
                  }
                />
                {player.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {file && (
        <Button onClick={send} disabled={busy || sending || participants.length === 0} fullWidth>
          {sending ? t("pubgame.evidence.sending", { percent: progress ?? 0 }) : t("pubgame.evidence.send")}
        </Button>
      )}
      <FormError error={error} />

      {canSkip && !sending && (
        <Button
          variant="outline"
          disabled={busy}
          onClick={async () => setError(await act({ type: "SKIP_TASK", taskId: task.id }))}
          fullWidth
        >
          {t("pubgame.tasks.skip")}
        </Button>
      )}
    </div>
  );
}
