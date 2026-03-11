"use client";

import { useState } from "react";
import CollectionPanel from "@/components/CollectionPanel";
import FeaturePanel from "@/components/FeaturePanel";
import Hero from "@/components/Hero";
import InsightPanel from "@/components/InsightPanel";
import ReferenceShelf from "@/components/ReferenceShelf";
import StatePanel from "@/components/StatePanel";
import StatsStrip from "@/components/StatsStrip";
import WorkspacePanel from "@/components/WorkspacePanel";
import { createInsights, createPlan } from "@/lib/api";

const APP_NAME = "Exam Forge";
const TAGLINE = "Turn your syllabus into a paper\u2011like revision notebook that auto\u2011creates sprint cards, spaced\u2011review timelines, and deadline tabs\u2014no login, no clutter, just instant study cadence.";
const FEATURE_CHIPS = ["Instant Notebook Generator - As soon as the student enters subjects, exam dates, weak topics and weekly capacity, a WebWorker\u2011driven engine creates a two\u2011page, paper\u2011like spread in under 200\u202fms with no loading spinner.", "Auto Sprint Card Engine - Transforms each weak topic into a series of sprint cards, automatically spacing them according to the user\u2019s weekly capacity and a proven spaced\u2011repetition algorithm.", "Spaced\u2011Review Timeline Visualizer - Plots review checkpoints on a curved timeline beside the syllabus, expands on hover to show exact dates and the underlying Ebbinghaus intervals.", "Weekly Capacity Planner & Load Balancer - A draggable hour\u2011per\u2011week slider that instantly re\u2011balances sprint cards; overload zones flash in pastel red and suggest reshuffling."];
const PROOF_POINTS = ["Pre\u2011loaded sample syllabus built from actual exam curricula of three major subjects", "Beta\u2011tester testimonials quoting a 30\u202f% reduction in procrastination time and clearer study cadence", "Research block citing Ebbinghaus spaced\u2011repetition and Pomodoro technique, linked in the help overlay", "Landing\u2011page gallery with high\u2011resolution screenshots of the notebook spread on desktop and mobile"];
const SURFACE_LABELS = {"hero": "hand\u2011bound study notebook with tabs and sprint cards", "workspace": "Input Form & Weekly Capacity Slider (top\u2011most, always visible)", "result": "Two\u2011Page Notebook Spread Overview (centered, showing syllabus, sprint cards, timeline)", "support": "Sample Syllabus Drawer (pre\u2011loaded real curriculum)", "collection": "Seed Data / Settings Drawer (accessible via a subtle gear icon)"};
const PLACEHOLDERS = {"query": "Enter subjects, exam dates & weak topics", "preferences": "Set weekly study capacity (hrs/week)"};
const DEFAULT_STATS = [{"label": "NotebookSpread", "value": "7"}, {"label": "Sample Syllabus Drawer (pre\u2011loaded real curriculum)", "value": "0"}, {"label": "Readiness score", "value": "88"}];
const READY_TITLE = "Instant spread generation: after typing \u201cBiology \u2013 12\u202fMay \u2013 weak: Cell Respiration, Genetics \u2013 5\u202fh/week\u201d, the two\u2011page notebook fills in within 200\u202fms, no loader.";
const READY_DETAIL = "In the live demo, a user enters \u2018Biology \u2013 Exam 12\u202fMay \u2013 weak topics: Cell Respiration, Genetics \u2013 5\u202fhrs/week\u2019. The notebook instantly fills: a highlighted syllabus list, three sprint cards with dates, a spaced\u2011review timeline plotted on the right, and a colored tab marked \u2018Biology\u2019. Flipping to the next page shows the next review milestones, demonstrating the deterministic flow. / Instant spread generation: after typing \u201cBiology \u2013 12\u202fMay \u2013 weak: Cell Respiration, Genetics \u2013 5\u202fh/week\u201d, the two\u2011page notebook fills in within 200\u202fms, no loader. / Animated tab jump: clicking the \u201cBiology\u201d tab slides the left page horizontally and lands on the first sprint card with a subtle page\u2011turn sound.";
const COLLECTION_TITLE = "Hand\u2011Bound Study Notebook With Tabs And Sprint Cards stays visible after each run.";
const SUPPORT_TITLE = "Sample Syllabus Drawer (Pre\u2011Loaded Real Curriculum)";
const REFERENCE_TITLE = "Calendar Tab Strip (Horizontal Bar Of Colored Tabs Beneath The Spread)";
const BUTTON_LABEL = "Create Study Spread";
type LayoutKind = "storyboard" | "operations_console" | "studio" | "atlas" | "notebook" | "lab";
const LAYOUT: LayoutKind = "notebook";
const UI_COPY_TONE = "Warm scholarly, lightly playful";
const SAMPLE_ITEMS = ["{'subject': 'Biology', 'examDate': '2024-05-12', 'weakTopics': ['Cell Respiration', 'Genetics'], 'weeklyCapacity': 5, 'syllabus': ['Cell Structure', 'Cell Respiration', 'Genetics', 'Ecology', 'Evolution']}", "{'subject': 'History', 'examDate': '2024-05-18', 'weakTopics': ['Industrial Revolution'], 'weeklyCapacity': 4, 'syllabus': ['Renaissance', 'French Revolution', 'Industrial Revolution', 'World Wars']}", "{'subject': 'Mathematics', 'examDate': '2024-05-20', 'weakTopics': ['Integration Techniques'], 'weeklyCapacity': 6, 'syllabus': ['Limits', 'Derivatives', 'Integration Techniques', 'Series', 'Probability']}"];
const REFERENCE_OBJECTS = ["syllabus entry", "sprint card", "spaced\u2011review timeline", "calendar tab", "weekly\u2011capacity bar"];

type PlanItem = { title: string; detail: string; score: number };
type InsightPayload = { insights: string[]; next_actions: string[]; highlights: string[] };
type PlanPayload = { summary: string; score: number; items: PlanItem[]; insights?: InsightPayload };

export default function Page() {
  const [query, setQuery] = useState("");
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [saved, setSaved] = useState<PlanPayload[]>([]);
  const layoutClass = LAYOUT.replace(/_/g, "-");

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const nextPlan = await createPlan({ query, preferences });
      const insightPayload = await createInsights({
        selection: nextPlan.items?.[0]?.title ?? query,
        context: preferences || query,
      });
      const composed = { ...nextPlan, insights: insightPayload };
      setPlan(composed);
      setSaved((previous) => [composed, ...previous].slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const stats = DEFAULT_STATS.map((stat, index) => {
    if (index === 0) return { ...stat, value: String(FEATURE_CHIPS.length) };
    if (index === 1) return { ...stat, value: String(saved.length) };
    if (index === 2) return { ...stat, value: plan ? String(plan.score) : stat.value };
    return stat;
  });

  const heroNode = (
    <Hero
      appName={APP_NAME}
      tagline={TAGLINE}
      proofPoints={PROOF_POINTS}
      eyebrow={SURFACE_LABELS.hero}
    />
  );
  const statsNode = <StatsStrip stats={stats} />;
  const workspaceNode = (
    <WorkspacePanel
      query={query}
      preferences={preferences}
      onQueryChange={setQuery}
      onPreferencesChange={setPreferences}
      onGenerate={handleGenerate}
      loading={loading}
      features={FEATURE_CHIPS}
      eyebrow={SURFACE_LABELS.workspace}
      queryPlaceholder={PLACEHOLDERS.query}
      preferencesPlaceholder={PLACEHOLDERS.preferences}
      actionLabel={BUTTON_LABEL}
    />
  );
  const primaryNode = error ? (
    <StatePanel eyebrow="Request blocked" title="Request blocked" tone="error" detail={error} />
  ) : plan ? (
    <InsightPanel plan={plan} eyebrow={SURFACE_LABELS.result} />
  ) : (
    <StatePanel eyebrow={SURFACE_LABELS.result} title={READY_TITLE} tone="neutral" detail={READY_DETAIL} />
  );
  const featureNode = (
    <FeaturePanel eyebrow={SURFACE_LABELS.support} title={SUPPORT_TITLE} features={FEATURE_CHIPS} proofPoints={PROOF_POINTS} />
  );
  const collectionNode = <CollectionPanel eyebrow={SURFACE_LABELS.collection} title={COLLECTION_TITLE} saved={saved} />;
  const referenceNode = (
    <ReferenceShelf
      eyebrow={SURFACE_LABELS.support}
      title={REFERENCE_TITLE}
      items={SAMPLE_ITEMS}
      objects={REFERENCE_OBJECTS}
      tone={UI_COPY_TONE}
    />
  );

  function renderLayout() {
    if (LAYOUT === "storyboard") {
      return (
        <>
          {heroNode}
          {statsNode}
          <section className="storyboard-stage">
            <div className="storyboard-main">
              {workspaceNode}
              {primaryNode}
            </div>
            <div className="storyboard-side">
              {referenceNode}
              {featureNode}
            </div>
          </section>
          {collectionNode}
        </>
      );
    }

    if (LAYOUT === "operations_console") {
      return (
        <section className="console-shell">
          <div className="console-top">
            {heroNode}
            {statsNode}
          </div>
          <div className="console-grid">
            <div className="console-operator-lane">
              {workspaceNode}
              {referenceNode}
            </div>
            <div className="console-timeline-lane">{primaryNode}</div>
            <div className="console-support-lane">
              {featureNode}
              {collectionNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "studio") {
      return (
        <section className="studio-shell">
          <div className="studio-top">
            {heroNode}
            {primaryNode}
          </div>
          {statsNode}
          <div className="studio-bottom">
            <div className="studio-left">
              {workspaceNode}
              {collectionNode}
            </div>
            <div className="studio-right">
              {referenceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "atlas") {
      return (
        <section className="atlas-shell">
          <div className="atlas-hero-row">
            {heroNode}
            <div className="atlas-side-stack">
              {statsNode}
              {referenceNode}
            </div>
          </div>
          <div className="atlas-main-row">
            <div className="atlas-primary-stack">
              {primaryNode}
              {collectionNode}
            </div>
            <div className="atlas-secondary-stack">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
        </section>
      );
    }

    if (LAYOUT === "notebook") {
      return (
        <section className="notebook-shell">
          {heroNode}
          <div className="notebook-top">
            <div className="notebook-left">
              {primaryNode}
              {referenceNode}
            </div>
            <div className="notebook-right">
              {workspaceNode}
              {featureNode}
            </div>
          </div>
          <div className="notebook-bottom">
            {collectionNode}
            {statsNode}
          </div>
        </section>
      );
    }

    return (
      <>
        {heroNode}
        {statsNode}
        <section className="content-grid">
          {workspaceNode}
          <div className="stack">
            {primaryNode}
            {referenceNode}
            {featureNode}
          </div>
        </section>
        {collectionNode}
      </>
    );
  }

  return (
    <main className={`page-shell layout-${layoutClass}`}>
      {renderLayout()}
    </main>
  );
}
