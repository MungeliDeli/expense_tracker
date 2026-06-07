import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/format';
import { CHART_COLORS } from '../../lib/constants';
import { useThemeStore } from '../../store/themeStore';
import type { ExpenseStats } from '../../types';

interface ChartsSectionProps {
  stats: ExpenseStats | null;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 card-shadow text-sm transition-colors duration-500">
      <p className="text-muted">{label}</p>
      <p className="font-semibold text-foreground">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

const ChartSkeleton = () => (
  <Card className="space-y-4">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-64 w-full" />
  </Card>
);

export const ChartsSection = ({ stats, isLoading }: ChartsSectionProps) => {
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
          icon={BarChart3}
          title="No spending data yet"
          description="Add your first expense to see charts and analytics here."
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2" key={activeThemeId}>
      <MotionCard delay={0.2}>
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Monthly Spending Trend
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="rgb(var(--primary))"
              strokeWidth={2.5}
              dot={{ fill: 'rgb(var(--primary))', r: 4 }}
              activeDot={{ r: 6, fill: 'rgb(var(--accent))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.3}>
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Expense Categories
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={stats.categoryBreakdown}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              label={(props) => {
                const { name, percent } = props;
                if (!percent || percent <= 0.05) return '';
                return `${name} ${(percent * 100).toFixed(0)}%`;
              }}
              labelLine={false}
            >
              {stats.categoryBreakdown.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.4} className="lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Weekly Spending
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.weeklyBreakdown}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" fill="rgb(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </MotionCard>
    </div>
  );
};
