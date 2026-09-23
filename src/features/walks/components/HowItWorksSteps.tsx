export interface HowItWorksStep {
  title: string;
  text?: string;
}

interface HowItWorksStepsProps {
  steps: HowItWorksStep[];
}

/** Numbered steps ("01 Choose your walk…"). Used on the home page and walk pages. */
export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="border-t-2 border-gold-deep/40 pt-4">
          <p aria-hidden="true" className="font-display text-4xl font-semibold text-gold-deep">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{step.title}</h3>
          {step.text && <p className="mt-1 text-sepia">{step.text}</p>}
        </li>
      ))}
    </ol>
  );
}
