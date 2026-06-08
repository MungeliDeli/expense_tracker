import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/format';
import { INCOME_CHART_COLORS } from '../../lib/constants';
import { useThemeStore } from '../../store/themeStore';
import type { IncomeStats } from '../../types';

interface IncomeChartsSectionProps {
  stats: IncomeStats | null;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 card-shadow text-sm transition-colors duration-500">
      <p className="text-muted">{label}</p>
      <p className="font-semibold text-success">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const ChartSkeleton = () => (
  <Card className="space-y-4">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-64 w-full" />
  </Card>
);

export const IncomeChartsSection = ({ stats, isLoading }: IncomeChartsSectionProps) => {
  const activeThemeId = useThemeStore((s) => s.activeThemeId);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <div className="lg:col-span-2"><ChartSkeleton /></div>
      </div>
    );
  }

  const hasData = stats && stats.allTime > 0;

  if (!hasData) {
    return (
      <Card>
        <EmptyState
          icon={TrendingUp}
          title="No income data yet"
          description="Add your first income entry to see earnings analytics here."
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2" key={activeThemeId}>
      <MotionCard delay={0.2}>
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Monthly Income Trend
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.monthlyTrend}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--success))" stopOpacity={0.45} />
                <stop offset="100%" stopColor="rgb(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="rgb(var(--success))"
              strokeWidth={2.5}
              fill="url(#incomeGradient)"
              dot={{ fill: 'rgb(var(--success))', r: 4 }}
              activeDot={{ r: 6, fill: 'rgb(var(--accent))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.3}>
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Income Sources
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={stats.sourceBreakdown}
              dataKey="amount"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={52}
              paddingAngle={4}
              label={(props) => {
                const { name, percent } = props;
                if (!percent || percent <= 0.05) return '';
                return `${name} ${(percent * 100).toFixed(0)}%`;
              }}
              labelLine={false}
            >
              {stats.sourceBreakdown.map((_, i) => (
                <Cell key={i} fill={INCOME_CHART_COLORS[i % INCOME_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.4} className="lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Weekly Earnings
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.weeklyBreakdown}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--accent))" />
                <stop offset="100%" stopColor="rgb(var(--success))" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </MotionCard>
    </div>
  );
};
