import { useState, useRef, useCallback } from "react";

const CATEGORIES = ["billing", "technical", "account", "general"];
const PRIORITIES = ["low", "medium", "high", "critical"];

export default function TicketForm({ apiBase, onCreated }) {
  const [form, setForm] = useState({ title: "", description: "", category: "", priority: "" });
  const [classifying, setClassifying] = useState(false);
  const [aiSuggested, setAiSuggested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(false);
  const [errors, setErrors] = useState({});
  const classifyTimeout = useRef(null);

  const classify = useCallback(async (description) => {
    if (!description || description.length < 20) return;
    setClassifying(true);
    setAiSuggested(false);
    try {
      const res = await fetch(`${apiBase}/tickets/classify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm(f => ({
          ...f,
          category: data.suggested_category || f.category,
          priority: data.suggested_priority || f.priority,
        }));
        setAiSuggested(true);
      }
    } catch (e) {
      // silent fail
    } finally {
      setClassifying(false);
    }
  }, [apiBase]);

  const handleDescChange = (e) => {
    const val = e.target.value;
    setForm(f => ({ ...f, description: val }));
    clearTimeout(classifyTimeout.current);
    classifyTimeout.current = setTimeout(() => classify(val), 800);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.length > 200) errs.title = "Max 200 characters";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.category) errs.category = "Select a category";
    if (!form.priority) errs.priority = "Select a priority";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/tickets/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const ticket = await res.json();
        onCreated(ticket);
        setForm({ title: "", description: "", category: "", priority: "" });
        setAiSuggested(false);
        setErrors({});
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      }
    } catch (e) {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="section-title">Submit a Ticket</h1>
      <p className="section-sub">Describe your issue and our AI will categorize it automatically.</p>

      <div className="card" style={{ maxWidth: 680 }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field">
            <label className="label">Title</label>
            <input
              className="input"
              placeholder="Brief summary of the issue..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              maxLength={200}
            />
            {errors.title && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.title}</span>}
          </div>

          <div className="field">
            <label className="label">Description</label>
            <textarea
              className="textarea"
              placeholder="Describe your issue in detail — the more you write, the better the AI can categorize it..."
              value={form.description}
              onChange={handleDescChange}
              style={{ minHeight: 140 }}
            />
            {errors.description && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.description}</span>}
            {classifying && (
              <div className="ai-loading">
                <div className="spinner" />
                <span>AI is analyzing your description…</span>
              </div>
            )}
            {aiSuggested && !classifying && (
              <div className="ai-badge">
                <span className="ai-dot" />
                AI suggested category & priority — review below
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="field">
              <label className="label">Category</label>
              <select
                className="select"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
              {errors.category && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.category}</span>}
            </div>

            <div className="field">
              <label className="label">Priority</label>
              <select
                className="select"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
              >
                <option value="">Select priority…</option>
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
              {errors.priority && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.priority}</span>}
            </div>
          </div>

          <div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? <><div className="spinner" />Submitting…</> : "Submit Ticket"}
            </button>
          </div>
        </form>
      </div>

      {toast && <div className="toast">✓ Ticket submitted successfully!</div>}
    </div>
  );
}