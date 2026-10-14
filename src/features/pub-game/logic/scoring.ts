import type { PubGameDefinition, PubGameState, QuestionProgress } from "@/types/pub-game";
import { POINTS_PER_ATTEMPT } from "../config";

/** Points for a correct answer after `wrongAttempts` wrong ones: 100, 80, 60, then 0. */
export function pointsForAttempt(wrongAttempts: number): number {
  return POINTS_PER_ATTEMPT[wrongAttempts] ?? 0;
}

/** After this many wrong answers the correct one is shown (0 points). */
export const WRONG_ATTEMPTS_BEFORE_REVEAL = POINTS_PER_ATTEMPT.length;

export function emptyQuestionProgress(): QuestionProgress {
  return { wrongOptionIds: [], status: "open", correctOptionId: null, points: 0 };
}

export interface Score {
  /** A team id, or a player id in a single-team ("player") game. */
  scorerId: string;
  questionPoints: number;
  /** Only approved evidence counts. */
  bonusPoints: number;
  total: number;
  /** Correct answers on the first attempt: the tie-breaker (D27). */
  firstAttemptCorrect: number;
  /** Correct answers in total (any attempt): a fun statistic for the results. */
  correctAnswers: number;
  /** Photo/video tasks the host approved: a fun statistic for the results. */
  approvedTasks: number;
}

/**
 * Everyone's score, computed from the game state every time it's needed.
 * Scores are never stored separately, so a repeated or replayed action can't
 * add points twice: the points exist only once, in the question progress and
 * the approved evidence.
 */
export function computeScores(definition: PubGameDefinition, state: PubGameState): Score[] {
  const scorerIds =
    state.scoringMode === "player" ? state.players.map((player) => player.id) : state.teams.map((team) => team.id);

  const tasks = new Map(definition.cafes.flatMap((cafe) => cafe.tasks).map((task) => [task.id, task]));

  return scorerIds.map((scorerId) => {
    const progress = Object.values(state.answers[scorerId] ?? {});
    const questionPoints = progress.reduce((sum, question) => sum + question.points, 0);
    const firstAttemptCorrect = progress.filter(
      (question) => question.status === "correct" && question.wrongOptionIds.length === 0,
    ).length;

    let bonusPoints = 0;
    let approvedTasks = 0;
    for (const submission of state.evidence) {
      const task = tasks.get(submission.taskId);
      if (!task || submission.status !== "approved") continue;

      if (state.scoringMode === "player") {
        // Single team: every player who took part gets the task's points (D25).
        if (submission.participantIds.includes(scorerId)) {
          bonusPoints += task.points;
          approvedTasks++;
        }
      } else if (submission.teamId === scorerId) {
        bonusPoints += task.scoring === "per-player" ? task.points * submission.participantIds.length : task.points;
        approvedTasks++;
      }
    }

    return {
      scorerId,
      questionPoints,
      bonusPoints,
      total: questionPoints + bonusPoints,
      firstAttemptCorrect,
      correctAnswers: progress.filter((question) => question.status === "correct").length,
      approvedTasks,
    };
  });
}

export interface RankedScore extends Score {
  /** 1 = first. Scorers with the same total and tie-breaker share a position. */
  position: number;
}

/** Highest total first; a tie goes to most first-attempt answers; still tied: shared place (D27). */
export function rankScores(scores: Score[]): RankedScore[] {
  const sorted = [...scores].sort(
    (a, b) => b.total - a.total || b.firstAttemptCorrect - a.firstAttemptCorrect,
  );
  return sorted.map((score, index) => {
    const firstEqual = sorted.findIndex(
      (other) => other.total === score.total && other.firstAttemptCorrect === score.firstAttemptCorrect,
    );
    return { ...score, position: (firstEqual === -1 ? index : firstEqual) + 1 };
  });
}
