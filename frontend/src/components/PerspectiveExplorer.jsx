const PERSPECTIVE_ORDER = ["business", "student", "researcher", "critic"];

export default function PerspectiveExplorer({ perspectiveAnalysis, activePerspective, onSelectPerspective }) {
  if (!perspectiveAnalysis?.perspectives) {
    return (
      <section className="panel result-panel">
        <div className="panel-head">
          <h2>Parallel Reality Summarization Engine</h2>
          <span className="status">Waiting for analysis</span>
        </div>
        <p className="muted">Generate a summary to explore business, student, researcher, and critic viewpoints.</p>
      </section>
    );
  }

  const selectedKey = PERSPECTIVE_ORDER.includes(activePerspective) ? activePerspective : "business";
  const selectedPerspective = perspectiveAnalysis.perspectives[selectedKey];

  return (
    <section className="panel result-panel">
      <div className="panel-head">
        <h2>Parallel Reality Summarization Engine</h2>
        <span className="status">Perspective switching enabled</span>
      </div>

      <div className="tabs">
        {PERSPECTIVE_ORDER.map((key) => {
          const view = perspectiveAnalysis.perspectives[key];
          return (
            <button
              key={key}
              type="button"
              className={`tab-button ${selectedKey === key ? "active" : ""}`}
              onClick={() => onSelectPerspective(key)}
            >
              {view?.label ?? key}
            </button>
          );
        })}
      </div>

      {selectedPerspective ? (
        <div className="view-grid">
          <article className="metric-card">
            <span className="metric-label">Perspective Summary</span>
            <p>{selectedPerspective.summary}</p>
          </article>

          <article className="metric-card">
            <span className="metric-label">Focus Priorities</span>
            <div className="chip-row">
              {(selectedPerspective.priorities ?? []).map((priority) => (
                <span key={priority} className="chip">
                  {priority}
                </span>
              ))}
            </div>
          </article>

          <article className="metric-card">
            <span className="metric-label">Traceable Source Cues</span>
            <p>{selectedPerspective.sourceTrace}</p>
          </article>
        </div>
      ) : null}

      <div className="metric-grid two comparative-grid">
        <article className="metric-card">
          <span className="metric-label">Comparative Insight Blocks</span>
          <ul className="info-list">
            {(perspectiveAnalysis.comparativeInsights ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="metric-card">
          <span className="metric-label">Difference Analysis</span>
          <ul className="info-list">
            {(perspectiveAnalysis.differenceAnalysis ?? []).map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.insight}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}