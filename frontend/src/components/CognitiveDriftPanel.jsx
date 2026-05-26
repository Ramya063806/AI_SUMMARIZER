export default function CognitiveDriftPanel({ driftAnalysis }) {
  if (!driftAnalysis) {
    return (
      <section className="panel result-panel">
        <div className="panel-head">
          <h2>Cognitive Drift Panel</h2>
          <span className="status">Waiting for analysis</span>
        </div>
        <p className="muted">Generate a summary to inspect stability, drift, and intent transitions.</p>
      </section>
    );
  }

  const stability = driftAnalysis.stabilityPercentage ?? 0;
  const confidence = driftAnalysis.confidenceScore ?? 0;

  return (
    <section className="panel result-panel drift-panel">
      <div className="panel-head">
        <h2>Cognitive Drift Panel</h2>
        <span className="status">Explainable analysis</span>
      </div>

      <div className="stability-meter">
        <div className="meter-header">
          <div>
            <p className="metric-label">Meaning Stability Score</p>
            <strong>{stability}%</strong>
          </div>
          <div className="meter-meta">
            <span>Confidence {confidence}%</span>
          </div>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${stability}%` }} />
        </div>
      </div>

      <div className="metric-grid three">
        <article className="metric-card">
          <span className="metric-label">Intent Shift Timeline</span>
          <p>{driftAnalysis.intentShiftTimeline?.length ?? 0} sections tracked</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Emotional Transition Summary</span>
          <p>{driftAnalysis.emotionalTransitionSummary || "No emotional summary available."}</p>
        </article>
        <article className="metric-card">
          <span className="metric-label">Context Consistency Analysis</span>
          <p>{driftAnalysis.contextConsistencyAnalysis || "No consistency note available."}</p>
        </article>
      </div>

      <div className="chip-row">
        {(driftAnalysis.driftIndicators ?? []).map((indicator) => (
          <span key={indicator} className="chip">
            {indicator}
          </span>
        ))}
      </div>

      <div className="timeline-list">
        {(driftAnalysis.intentShiftTimeline ?? []).map((item) => (
          <article className="timeline-item" key={`${item.section}-${item.intentLabel}`}>
            <div className="timeline-topline">
              <strong>Section {item.section}</strong>
              <span className={`pill pill-${item.stabilityScore >= 75 ? "stable" : item.stabilityScore >= 50 ? "watch" : "drift"}`}>
                {item.intentLabel} / {item.emotionLabel}
              </span>
            </div>
            <p className="timeline-excerpt">{item.excerpt}</p>
            <div className="timeline-bar">
              <span style={{ width: `${item.stabilityScore}%` }} />
            </div>
            <div className="timeline-footer">
              <span>Stability {item.stabilityScore}%</span>
              <span>Drift {item.driftScore}%</span>
            </div>
          </article>
        ))}
      </div>

      <article className="metric-card insight-card">
        <span className="metric-label">Narrative Drift Report</span>
        <p>{driftAnalysis.narrativeDriftReport || "No narrative report available."}</p>
      </article>
    </section>
  );
}