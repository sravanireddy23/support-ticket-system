import { useState, useEffect, useCallback } from "react";
import TicketForm from "./components/TicketForm";
import TicketList from "./components/TicketList";
import StatsDashboard from "./components/StatsDashboard";
import "./App.css";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("submit");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({ category: "", priority: "", status: "", search: "" });
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  const fetchTickets = useCallback(async () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    const res = await fetch(`${API_BASE}/tickets/?${params}`);
    const data = await res.json();
    setTickets(data);
  }, [filters]);

  const fetchStats = useCallback(async () => {
    const res = await fetch(`${API_BASE}/tickets/stats/`);
    const data = await res.json();
    setStats(data);
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);
  useEffect(() => { fetchStats(); }, [fetchStats, statsRefreshKey]);

  const handleTicketCreated = (ticket) => {
    setTickets(prev => [ticket, ...prev]);
    setStatsRefreshKey(k => k + 1);
  };

  const handleStatusChange = async (id, status) => {
    const res = await fetch(`${API_BASE}/tickets/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setTickets(prev => prev.map(t => t.id === id ? updated : t));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">SupportDesk</span>
          </div>
          <nav className="nav">
            {[
              { id: "submit", label: "New Ticket" },
              { id: "tickets", label: "All Tickets" },
              { id: "stats", label: "Dashboard" },
            ].map(tab => (
              <button
                key={tab.id}
                className={`nav-btn ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        {activeTab === "submit" && (
          <TicketForm apiBase={API_BASE} onCreated={handleTicketCreated} />
        )}
        {activeTab === "tickets" && (
          <TicketList
            tickets={tickets}
            filters={filters}
            setFilters={setFilters}
            onStatusChange={handleStatusChange}
          />
        )}
        {activeTab === "stats" && <StatsDashboard stats={stats} />}
      </main>
    </div>
  );
}