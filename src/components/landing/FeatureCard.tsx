interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card-hover p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
