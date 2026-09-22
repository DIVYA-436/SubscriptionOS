import {
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  CreditCard,
  PiggyBank,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  calculateStats,
  categoryData,
  daysUntil,
  formatCurrency,
  monthlyEquivalent,
} from "./utils";

import {
  StatCard,
  SectionHeader,
  SubscriptionCard,
  RenewalMiniCard,
  QuickInsight,
  EmptyState,
} from "./components";

export default function Dashboard({
  subscriptions,
  budget,
  onAdd,
  onDelete,
  onEdit,
  setPage,
}) {
  const stats = calculateStats(subscriptions);

  const upcoming = [...subscriptions]
    .filter((item) => daysUntil(item.renewal) >= 0)
    .sort(
      (a, b) =>
        new Date(a.renewal) - new Date(b.renewal)
    )
    .slice(0, 4);

  const categories = categoryData(subscriptions);

  const chartData = [
    { month: "Apr", amount: Math.round(stats.monthly * 0.83) },
    { month: "May", amount: Math.round(stats.monthly * 0.92) },
    { month: "Jun", amount: Math.round(stats.monthly * 0.88) },
    { month: "Jul", amount: Math.round(stats.monthly * 1.03) },
    { month: "Aug", amount: Math.round(stats.monthly * 0.95) },
    { month: "Sep", amount: Math.round(stats.monthly) },
  ];

  const budgetPercent = Math.min(
    100,
    (stats.monthly / budget) * 100
  );

  return (
    <div className="dashboard">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">SATURDAY, SEPTEMBER 19</div>
          <h1>Your financial command center.</h1>
          <p>
            Everything recurring, organized in one intelligent
            workspace.
          </p>
        </div>

        <button className="primary-button" onClick={onAdd}>
          <Plus size={17} />
          Add subscription
        </button>
      </div>

      <div className="stat-grid">
        <StatCard
          icon={<CircleDollarSign size={19} />}
          label="Monthly spend"
          value={formatCurrency(stats.monthly)}
          detail="Current recurring commitment"
          accent="blue"
        />

        <StatCard
          icon={<CreditCard size={19} />}
          label="Yearly commitment"
          value={formatCurrency(stats.yearly)}
          detail="Projected recurring spend"
          accent="purple"
        />

        <StatCard
          icon={<CalendarClock size={19} />}
          label="Upcoming renewals"
          value={stats.upcoming}
          detail="Within the next 30 days"
          accent="orange"
        />

        <StatCard
          icon={<PiggyBank size={19} />}
          label="Budget remaining"
          value={formatCurrency(
            Math.max(0, budget - stats.monthly)
          )}
          detail={`of ${formatCurrency(budget)} monthly budget`}
          accent="green"
        />
      </div>

      <div className="dashboard-grid">
        <div className="panel spending-panel">
          <SectionHeader
            eyebrow="SPENDING"
            title="Recurring spend"
            description="Your monthly-equivalent subscription cost."
            action={
              <button
                className="text-button"
                onClick={() => setPage("analytics")}
              >
                View analytics <ArrowUpRight size={15} />
              </button>
            }
          />

          <div className="chart-value">
            {formatCurrency(stats.monthly)}
            <span> / month</span>
          </div>

          <div className="large-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="spendGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="100%"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  hide
                  domain={["dataMin - 100", "dataMax + 100"]}
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Spend",
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="amount"
                  strokeWidth={3}
                  fill="url(#spendGradient)"
                  fillOpacity={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel budget-panel">
          <SectionHeader
            eyebrow="BUDGET"
            title="Monthly budget"
          />

          <div className="budget-circle">
            <div>
              <strong>{Math.round(budgetPercent)}%</strong>
              <span>used</span>
            </div>
          </div>

          <div className="budget-numbers">
            <div>
              <span>Used</span>
              <strong>{formatCurrency(stats.monthly)}</strong>
            </div>

            <div>
              <span>Limit</span>
              <strong>{formatCurrency(budget)}</strong>
            </div>
          </div>

          <div className="progress">
            <span style={{ width: `${budgetPercent}%` }} />
          </div>

          <p className="budget-note">
            {budgetPercent < 80
              ? "You're comfortably inside your subscription budget."
              : "Your recurring spending is approaching your budget."}
          </p>
        </div>
      </div>

      <div className="dashboard-grid lower-grid">
        <div className="panel">
          <SectionHeader
            eyebrow="YOUR SERVICES"
            title="Active subscriptions"
            description={`${subscriptions.length} services being tracked`}
            action={
              <button
                className="text-button"
                onClick={() => setPage("subscriptions")}
              >
                See all <ArrowUpRight size={15} />
              </button>
            }
          />

          <div className="subscription-list">
            {subscriptions.length ? (
              subscriptions.slice(0, 5).map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))
            ) : (
              <EmptyState onAdd={onAdd} />
            )}
          </div>
        </div>

        <div className="side-stack">
          <div className="panel">
            <SectionHeader
              eyebrow="NEXT UP"
              title="Renewals"
            />

            <div className="renewal-list">
              {upcoming.map((item) => (
                <RenewalMiniCard
                  key={item.id}
                  subscription={item}
                />
              ))}
            </div>

            <button
              className="full-button"
              onClick={() => setPage("calendar")}
            >
              Open renewal calendar
            </button>
          </div>

          <div className="panel ai-card">
            <div className="ai-card-glow">
              <Sparkles size={22} />
            </div>

            <div>
              <div className="eyebrow">AI ADVISOR</div>
              <h3>Make your subscriptions work smarter.</h3>
              <p>
                Get personalized spending insights and renewal
                recommendations.
              </p>
            </div>

            <button
              className="ai-button"
              onClick={() => setPage("ai")}
            >
              Open AI Advisor
            </button>
          </div>
        </div>
      </div>

      <div className="panel category-panel">
        <SectionHeader
          eyebrow="SPENDING MIX"
          title="Where your money goes"
          description="Monthly-equivalent spending by category."
        />

        <div className="category-chart">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="value"
                nameKey="name"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={4}
              >
                {categories.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`hsl(${210 + index * 38} 75% ${
                      55 - index * 2
                    }%)`}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  formatCurrency(value),
                  "Monthly",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="category-legend">
            {categories.map((item, index) => (
              <div key={item.name}>
                <span
                  className="legend-dot"
                  style={{
                    background: `hsl(${
                      210 + index * 38
                    } 75% ${55 - index * 2}%)`,
                  }}
                />

                <span>{item.name}</span>
                <strong>{formatCurrency(item.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-insights">
        <QuickInsight
          icon="◈"
          title="Unused subscriptions"
          text="AI can help identify services you may no longer use."
        />

        <QuickInsight
          icon="↗"
          title="Renewal prediction"
          text="Monitor upcoming recurring charges before they hit."
        />

        <QuickInsight
          icon="⌁"
          title="Smart organization"
          text="Your recurring expenses are automatically categorized."
        />
      </div>
    </div>
  );
}