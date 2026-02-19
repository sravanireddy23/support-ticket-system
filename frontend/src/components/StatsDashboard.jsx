const PRIORITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#22d3a0",
};
const CATEGORY_COLORS = {
  technical: "#6c63ff",
  billing: "#f97316",
  account: "#22d3a0",
  general: "#7a7a8c",
};

function BreakdownCard({ title, data, colors }) {
  if (!data) return null;
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return (
    <div className="breakdown-card">
      <div className="breakdown-title">{title}</div>
      {Object.entries(data).map(([key, count]) => (
        <div key={key} className="breakdown-row">
          <span className="breakdown-label">{key}</span>
          <div className="breakdown-bar-wrap">
            <div
              className="breakdown-bar"
              style={{
                width: total > 0 ? `${(count / total) * 100}%` : "0%",
                background: colors[key] || "#6c63ff",
              }}
            />
          </div>
          <span className="breakdown-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsDashboard({ stats }) {
  if (!stats) return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <div className="empty-state">
        <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto 12px", borderWidth: 3 }} />
        <div className="empty-text">Loading stats…</div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <p className="section-sub">Real-time metrics across all support tickets.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Tickets</div>
          <div className="stat-value accent">{stats.total_tickets ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open Tickets</div>
          <div className="stat-value" style={{ color: "var(--amber)" }}>{stats.open_tickets ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg / Day</div>
          <div className="stat-value green">{typeof stats.avg_tickets_per_day === "number" ? stats.avg_tickets_per_day.toFixed(1) : "—"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical Open</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>
            {stats.priority_breakdown?.critical ?? 0}
          </div>
        </div>
      </div>

      <div className="breakdown-grid">
        <BreakdownCard title="By Priority" data={stats.priority_breakdown} colors={PRIORITY_COLORS} />
        <BreakdownCard title="By Category" data={stats.category_breakdown} colors={CATEGORY_COLORS} />
      </div>
    </div>
  );
}