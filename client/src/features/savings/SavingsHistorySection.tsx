import { memo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { History } from 'lucide-react';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/format';
import type { SavingsStats } from '../../types';

interface SavingsHistorySectionProps {
  stats: SavingsStats | null;
  isLoading: boolean;
}

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm card-shadow">
      <p className="mb-1 text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

export const SavingsHistorySection = memo(({ stats, isLoading }: SavingsHistorySectionProps) => {
  if (isLoading) {
    return (
      <MotionCard delay={0.1}>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="mt-4 h-64 w-full" />
      </MotionCard>
    );
  }

  const history = stats?.monthlyHistory ?? [];
  const hasData = history.some((h) => h.deposited > 0);

  if (!hasData) {
    return (
      <MotionCard delay={0.1}>
        <EmptyState
          icon={History}
          title="No savings history yet"
          description="Start depositing to see your monthly savings trend."
        />
      </MotionCard>
    );
  }

  return (
    <MotionCard delay={0.1}>
      <h3 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
        Monthly Savings History
      </h3>
      <p className="mb-4 text-xs text-muted">Deposits vs your monthly goal (last 6 months)</p>

      <div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {history.map((item) => (
          <div
            key={item.month}
            className={`rounded-xl border px-3 py-2 text-center ${
              item.isOnTrack
                ? 'border-[rgba(var(--success),0.3)] bg-[rgba(var(--success),0.06)]'
                : 'border-border bg-muted/40'
            }`}
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{item.month}</p>
            <p className="mt-1 text-sm font-bold text-foreground">{formatCurrency(item.deposited)}</p>
            <p className={`mt-0.5 text-[10px] font-semibold ${item.isOnTrack ? 'text-success' : 'text-muted'}`}>
              {item.goal > 0
                ? item.isOnTrack ? 'On track' : 'Below goal'
                : item.deposited > 0 ? 'Saved' : '—'}
            </p>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={history} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="deposited" name="Deposited" fill="rgb(var(--primary))" radius={[6, 6, 0, 0]} />
          <Bar dataKey="goal" name="Goal" fill="rgb(var(--accent))" radius={[6, 6, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </MotionCard>
  );
});

SavingsHistorySection.displayName = 'SavingsHistorySection';
