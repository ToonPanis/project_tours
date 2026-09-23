interface PlaceholderNoticeProps {
  message?: string;
}

/**
 * Shown wherever content has `contentStatus: "placeholder"`, so unverified
 * text is never presented as historical fact.
 */
export function PlaceholderNotice({
  message = "This walk contains placeholder content. Historical stories, locations and details are still being researched.",
}: PlaceholderNoticeProps) {
  return (
    <aside
      role="note"
      className="rounded-sm border border-dashed border-gold-deep/50 bg-gold/10 px-4 py-3 text-sm text-sepia"
    >
      <strong className="font-semibold text-gold-deep">Research pending: </strong>
      {message}
    </aside>
  );
}
