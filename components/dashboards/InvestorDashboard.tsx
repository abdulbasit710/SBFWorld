"use client";

import KpiWidget from "@/components/ui/KpiWidget";
import Card, { CardHeader } from "@/components/ui/Card";
import DealCard from "@/components/deals/DealCard";
import MatchingEngine from "@/components/matching/MatchingEngine";
import BlueprintPortalPanel from "@/components/notion/BlueprintPortalPanel";
import { DonutChart, LineChart } from "@/components/charts/Charts";
import { PageHeader, SectionTitle } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icons";
import {
  DEALS,
  PORTFOLIO_EXPOSURE,
  CAPITAL_TREND,
  fmtMoney,
} from "@/lib/data";

export default function InvestorDashboard() {
  const investable = DEALS.filter(
    (d) => d.status !== "rejected" && d.roi > 0,
  ).slice(0, 6);

  return (
    <div>
      <PageHeader
        eyebrow="Investor Portal"
        title="Portfolio Overview"
        desc="Your capital exposure, realized returns, and curated opportunities across all pillars."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiWidget
          label="Total Invested"
          value={fmtMoney(284_000_000)}
          delta="8.4%"
          up
          icon={Icon.bank(18)}
          spark={CAPITAL_TREND}
        />
        <KpiWidget
          label="Active Deals"
          value="14"
          delta="2 new"
          up
          icon={Icon.deals(18)}
        />
        <KpiWidget
          label="Expected Return"
          value="21.4%"
          delta="1.2%"
          up
          icon={Icon.trend(18)}
        />
        <KpiWidget
          label="Realized Gains"
          value={fmtMoney(48_200_000)}
          delta="3.1%"
          up
          icon={Icon.pulse(18)}
        />
      </div>

      <MatchingEngine role="investor" />
      <BlueprintPortalPanel role="investor" />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Capital Deployed"
            sub="Trailing 12 months — USD millions"
          />
          <div className="p-6 pt-4">
            <LineChart data={CAPITAL_TREND} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Portfolio Exposure" sub="By pillar allocation" />
          <div className="flex items-center justify-center p-6">
            <DonutChart data={PORTFOLIO_EXPOSURE} />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <SectionTitle right={<span className="label-mono text-muted">Curated for you</span>}>
          Investable Opportunities
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {investable.map((d, i) => (
            <DealCard key={d.id} deal={d} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
