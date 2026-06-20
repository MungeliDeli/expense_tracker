import { memo, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ComposedChart,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { MotionCard } from '../../components/ui/MotionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/format';
import { CHART_COLORS } from '../../lib/constants';
import { useThemeStore } from '../../store/themeStore';
import type { DashboardStats } from '../../types';

interface DashboardChartsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

const ChartTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 card-shadow text-sm">
      <p className="mb-1 text-muted">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

const ChartSkeleton = () => (
  <Card className="space-y-4">
    <Skeleton className="h-5 w-40" />
    <Skeleton className="h-64 w-full" />
  </Card>
);

export const DashboardCharts = memo(({ stats, isLoading }: DashboardChartsProps) => {
  const activeThemeId = useThemeStore((s) => s.activeThemeId);

  const hasData = useMemo(
    () => stats && (stats.allTime.income > 0 || stats.allTime.expenses > 0),
    [stats],
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <div className="lg:col-span-2"><ChartSkeleton /></div>
        <div className="lg:col-span-2"><ChartSkeleton /></div>
      </div>
    );
  }

  if (!hasData || !stats) {
    return (
      <Card>
        <EmptyState
          icon={BarChart3}
          title="No financial data yet"
          description="Add income and expenses to unlock your dashboard analytics."
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2" key={activeThemeId}>
      <MotionCard delay={0.15} className="lg:col-span-2">
        <h3 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
          Income vs Expenses
        </h3>
        <p className="mb-4 text-xs text-muted">6-month trend comparison</p>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={stats.monthlyComparison}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--success))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(var(--success))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--danger))" stopOpacity={0.25} />
                <stop offset="100%" stopColor="rgb(var(--danger))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="rgb(var(--success))"
              fill="url(#incomeGrad)"
              strokeWidth={2}
              animationDuration={900}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              name="Expenses"
              stroke="rgb(var(--danger))"
              fill="url(#expenseGrad)"
              strokeWidth={2}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="rgb(var(--accent))"
              strokeWidth={2.5}
              dot={{ fill: 'rgb(var(--accent))', r: 4 }}
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="saved"
              name="Saved"
              stroke="rgb(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'rgb(var(--primary))', r: 3 }}
              animationDuration={900}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.2}>
        <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
          Net Savings Trend
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.monthlyComparison}>
            <defs>
              <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="saved"
              name="Saved"
              stroke="rgb(var(--primary))"
              fill="url(#netGrad)"
              strokeWidth={2}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="net"
              name="Net"
              stroke="rgb(var(--accent))"
              strokeWidth={2}
              dot={{ fill: 'rgb(var(--accent))', r: 3 }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.25}>
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
              outerRadius={88}
              innerRadius={48}
              paddingAngle={3}
              animationDuration={800}
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
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </MotionCard>

      <MotionCard delay={0.3} className="lg:col-span-2">
        <h3 className="mb-1 text-sm font-semibold text-foreground sm:text-base">
          This Week — Income vs Spending
        </h3>
        <p className="mb-4 text-xs text-muted">Daily breakdown</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.weeklyComparison} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'rgb(var(--muted))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar
              dataKey="income"
              name="Income"
              fill="rgb(var(--success))"
              radius={[6, 6, 0, 0]}
              animationDuration={700}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="rgb(var(--danger))"
              radius={[6, 6, 0, 0]}
              animationDuration={700}
            />
          </BarChart>
        </ResponsiveContainer>
      </MotionCard>

      {stats.sourceBreakdown.length > 0 && (
        <MotionCard delay={0.35} className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground sm:text-base">
            Income Sources
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats.sourceBreakdown.map((s) => ({ name: s.source, amount: s.amount }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'rgb(var(--muted))' }} tickFormatter={(v) => `K${v}`} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="amount"
                name="Amount"
                stroke="rgb(var(--success))"
                strokeWidth={2.5}
                dot={{ fill: 'rgb(var(--success))', r: 5, strokeWidth: 2, stroke: 'rgb(var(--card))' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </MotionCard>
      )}
    </div>
  );
});

DashboardCharts.displayName = 'DashboardCharts';
