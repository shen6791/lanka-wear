import type { Metadata } from "next";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = { title: "Size guide" };

const TOPS = [["XS", "81–86", "66–71", "86–91"], ["S", "86–91", "71–76", "91–96"], ["M", "96–101", "81–86", "99–104"], ["L", "106–111", "91–96", "109–114"], ["XL", "116–121", "101–106", "119–124"]];
const BOTTOMS = [["30", "76", "94", "81"], ["32", "81", "99", "82"], ["34", "86", "104", "83"], ["36", "91", "109", "84"]];

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead><tr className="border-b border-ink text-xs uppercase tracking-wider text-ink">{head.map((h) => <th key={h} className="py-3 pr-4">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r) => <tr key={r[0]} className="border-b border-line">{r.map((c, i) => <td key={i} className={`py-3 pr-4 ${i === 0 ? "font-semibold text-ink" : ""}`}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function SizeGuide() {
  return (
    <InfoPage eyebrow="Fit" title="Size guide" intro="All measurements are body measurements in centimetres. If you're between sizes, size up for a relaxed fit.">
      <section><h2>Tops, shirts &amp; dresses</h2><Table head={["Size", "Chest", "Waist", "Hip"]} rows={TOPS} /></section>
      <section><h2>Trousers &amp; shorts</h2><Table head={["Size", "Waist", "Hip", "Inseam"]} rows={BOTTOMS} /></section>
      <section>
        <h2>How to measure</h2>
        <ul>
          <li><b className="text-ink">Chest:</b> around the fullest part, keeping the tape level under your arms.</li>
          <li><b className="text-ink">Waist:</b> around your natural waistline, the narrowest part of your torso.</li>
          <li><b className="text-ink">Hip:</b> around the fullest part of your hips.</li>
          <li><b className="text-ink">Inseam:</b> from the crotch to the bottom of the ankle.</li>
        </ul>
      </section>
    </InfoPage>
  );
}
