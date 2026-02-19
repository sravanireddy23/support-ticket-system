import { useState } from "react";

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"];
const CATEGORY_OPTIONS = ["billing", "technical", "account", "general"];
const PRIORITY_OPTIONS = ["low", "medium", "high", "critical"];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function TicketCard({ ticket, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`ticket-card ${expanded ? "expanded" : ""}`} onClick={() => setExpanded(e => !e)}>
      <div className="ticket-header">
        <div className="ticket-title">{ticket.title}</div>
        <span className={`badge badge-${ticket.status}`}>{ticket.status.replace("_", " ")}</span>
      </div>

      <div className="ticket-meta">
        <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
        <span className={`badge badge-${ticket.category}`}>{ticket.category}</span>
      </div>

      {expanded ? (
        <p className="ticket-desc">{ticket.description}</p>
      ) : (
        <p className="ticket-desc" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {ticket.description}
        </p>
      )}

      <div className="ticket-time">#{ticket.id} · {timeAgo(ticket.created_at)}</div>

      {expanded && (
        <div className="ticket-actions" onClick={e => e.stopPropagation()}>
          <label>Update Status</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={`btn btn-ghost`}
                style={{
                  fontSize: 13, padding: "6px 14px",
                  ...(ticket.status === s ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}),
                }}
                onClick={() => onStatusChange(ticket.id, s)}
              >
                {s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TicketList({ tickets, filters, setFilters, onStatusChange }) {
  return (
    <div>
      <h1 className="section-title">All Tickets</h1>
      <p className="section-sub">{tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found</p>

      <div className="filters">
        <input
          className="search-input"
          placeholder="Search by title or description…"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
        />
        <select
          className="filter-select"
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="filter-select"
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          className="filter-select"
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        {(filters.category || filters.priority || filters.status || filters.search) && (
          <button
            className="btn btn-ghost"
            style={{ fontSize: 13, padding: "6px 14px" }}
            onClick={() => setFilters({ category: "", priority: "", status: "", search: "" })}
          >
            Clear filters
          </button>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <div className="empty-text">No tickets found</div>
        </div>
      ) : (
        tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} onStatusChange={onStatusChange} />
        ))
      )}
    </div>
  );
}