"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { playablePubGameDefinition } from "@/data/walks/hidden-pubs/game/definition";
import { useT } from "@/i18n/client";
import type { EvidenceSubmission } from "@/types/pub-game";
import { usePubGameTexts } from "../client/texts-context";
import type { PubGameHandle } from "../client/usePubGame";
import { MAX_RULE_LENGTH } from "../config";
import { allTeams, playerName } from "../logic/view-helpers";
import { FormError } from "./FormError";
import { TextField } from "./TextField";

/** The task (and its café) a submission is for. */
function findTask(taskId: string) {
  for (const cafe of playablePubGameDefinition.cafes) {
    const task = cafe.tasks.find((candidate) => candidate.id === taskId);
    if (task) return { cafeId: cafe.id, task };
  }
  return null;
}

/**
 * The host approves or rejects each photo/video (D26). Points only count once
 * approved. The file comes from our own route, which checks that this phone is
 * the host's (private Blob storage, never a public link).
 */
export function EvidenceReview({ game }: { game: PubGameHandle }) {
  const t = useT();
  const pending = game.view.evidence.filter((item) => item.status === "pending");
  if (pending.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold text-parchment">{t("pubgame.host.reviewTitle")}</h2>
      <p className="text-sm text-parchment/75">{t("pubgame.host.reviewHelp")}</p>
      {pending.map((submission) => (
        <ReviewCard key={submission.id} game={game} submission={submission} />
      ))}
    </section>
  );
}

function ReviewCard({ game, submission }: { game: PubGameHandle; submission: EvidenceSubmission }) {
  const t = useT();
  const texts = usePubGameTexts();
  const { view, act, busy } = game;
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const found = findTask(submission.taskId);
  const taskTitle = (found && texts.cafes[found.cafeId]?.tasks[submission.taskId]?.title) ?? submission.taskId;
  const teamName = allTeams(view).find((team) => team.id === submission.teamId)?.name ?? submission.teamId;
  const src = `/api/games/${game.code}/media/file?id=${encodeURIComponent(submission.mediaId)}`;
  const label = t("pubgame.host.mediaLabel", { team: teamName, task: taskTitle });

  const review = async (approve: boolean) =>
    setError(await act({ type: "REVIEW_EVIDENCE", submissionId: submission.id, approve, ...(approve || !reason.trim() ? {} : { reason }) }));

  return (
    <article className="flex flex-col gap-3 rounded-sm border border-gold/50 bg-ink/40 p-4">
      <h3 className="font-display text-xl text-gold">{t("pubgame.host.reviewFor", { team: teamName, task: taskTitle })}</h3>
      {found?.task.evidence === "video" ? (
        <video src={src} controls playsInline preload="metadata" aria-label={label} className="max-h-80 w-full rounded-sm bg-black" />
      ) : (
        // A private, access-checked file from our own route: next/image can't optimise it.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="max-h-80 w-full rounded-sm bg-black object-contain" />
      )}
      <p className="text-sm text-parchment/80">
        {t("pubgame.host.tookPart", { names: submission.participantIds.map((id) => playerName(view, id)).join(", ") })}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button disabled={busy} onClick={() => review(true)}>
          {t("pubgame.host.approve")}
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => review(false)}>
          {t("pubgame.host.reject")}
        </Button>
      </div>
      <TextField label={t("pubgame.host.rejectReason")} value={reason} onChange={setReason} maxLength={MAX_RULE_LENGTH} />
      <FormError error={error} />
    </article>
  );
}
