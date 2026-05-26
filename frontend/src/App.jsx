import { useState } from "react";
import CognitiveDriftPanel from "./components/CognitiveDriftPanel.jsx";
import PerspectiveExplorer from "./components/PerspectiveExplorer.jsx";

const initialForm = {
  content: "",
  url: "",
  summaryLength: "medium",
  style: "paragraph",
  tone: "neutral",
  mode: "extractive"
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "") ?? "";

function apiUrl(path) {
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path;
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [driftAnalysis, setDriftAnalysis] = useState(null);
  const [perspectiveAnalysis, setPerspectiveAnalysis] = useState(null);
  const [activePerspective, setActivePerspective] = useState("business");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    setDriftAnalysis(null);
    setPerspectiveAnalysis(null);

    try {
      const payload = new FormData();
      payload.append("content", form.content);
      payload.append("url", form.url);
      payload.append("summaryLength", form.summaryLength);
      payload.append("style", form.style);
      payload.append("tone", form.tone);
      payload.append("mode", form.mode);

      if (file) {
        payload.append("file", file);
      }

      const response = await fetch(apiUrl("/api/summarize"), {
        method: "POST",
        body: payload
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to summarize content.");
      }

      setResult(data.summarizedContent);
      setDriftAnalysis(data.driftAnalysis ?? null);
      setPerspectiveAnalysis(data.perspectiveAnalysis ?? null);
      setActivePerspective("business");
    } catch (exception) {
      setError(exception.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AI Content Summarizer</p>
          <p className="lede">
            Paste text, upload a document, or provide a URL. Tune the summary for length, tone, style, and analysis depth in one focused workspace.
          </p>
        </div>

        <div className="hero-stats" aria-label="Summarizer capabilities">
          <div>
            <strong>3</strong>
            <span>Input sources</span>
          </div>
          <div>
            <strong>4</strong>
            <span>Perspective views</span>
          </div>
          <div>
            <strong>2</strong>
            <span>Summary modes</span>
          </div>
        </div>
      </section>

      <section className="panel input-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow compact">Workspace</p>
            <h2>Create summary</h2>
          </div>
          <span className="status">Ready</span>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <label>
            Content
            <textarea
              value={form.content}
              onChange={(event) => updateField("content", event.target.value)}
              placeholder="Paste articles, research, notes, or reports here"
              rows="10"
            />
          </label>

          <div className="grid two">
            <label>
              URL
              <input
                value={form.url}
                onChange={(event) => updateField("url", event.target.value)}
                placeholder="https://example.com/article"
              />
            </label>

            <label>
              File
              <input type="file" accept=".txt,.docx,.pdf,text/plain,application/pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
          </div>

          <div className="grid four">
            <label>
              Mode
              <select value={form.mode} onChange={(event) => updateField("mode", event.target.value)}>
                <option value="extractive">Extractive</option>
                <option value="abstractive">Abstractive</option>
              </select>
            </label>

            <label>
              Length
              <select value={form.summaryLength} onChange={(event) => updateField("summaryLength", event.target.value)}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </label>

            <label>
              Style
              <select value={form.style} onChange={(event) => updateField("style", event.target.value)}>
                <option value="paragraph">Paragraph</option>
                <option value="bullet">Bullet points</option>
              </select>
            </label>

            <label>
              Tone
              <select value={form.tone} onChange={(event) => updateField("tone", event.target.value)}>
                <option value="neutral">Neutral</option>
                <option value="formal">Formal</option>
                <option value="direct">Direct</option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Summarizing..." : "Summarize content"}
            </button>
            <p className="helper-text">Use any one input source, or combine text with a file for more context.</p>
          </div>
        </form>
      </section>

      <section className="panel result-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow compact">Output</p>
            <h2>Summary</h2>
          </div>
          {error ? <span className="status error">{error}</span> : <span className="status">Ready</span>}
        </div>
        <pre className="result">{result || "Your summary will appear here."}</pre>
      </section>

      <CognitiveDriftPanel driftAnalysis={driftAnalysis} />

      <PerspectiveExplorer
        perspectiveAnalysis={perspectiveAnalysis}
        activePerspective={activePerspective}
        onSelectPerspective={setActivePerspective}
      />
    </main>
  );
}
