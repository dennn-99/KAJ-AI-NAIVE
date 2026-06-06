type ScoreGaugeProps = {
  label: string;
  value: number;
  tone: "good" | "warn" | "risk";
};

const toneClass = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  risk: "bg-rose-500"
};

export function ScoreGauge({ label, value, tone }: ScoreGaugeProps) {
  return (
    <div className="metric">
      <div className="metricHeader">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="bar">
        <div className={`barFill ${toneClass[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
