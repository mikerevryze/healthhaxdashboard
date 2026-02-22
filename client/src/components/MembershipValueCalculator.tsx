import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Calculator,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";

interface MembershipValueCalculatorProps {
  membersAdded: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MembershipValueCalculator({
  membersAdded,
}: MembershipValueCalculatorProps) {
  const [valueInput, setValueInput] = useState("");
  const [attritionInput, setAttritionInput] = useState("");
  const [lifetimeInput, setLifetimeInput] = useState("");
  const [useLifetime, setUseLifetime] = useState(false);

  const memberValue = parseFloat(valueInput) || 0;
  const attritionPct = parseFloat(attritionInput) || 0;
  const lifetimeDirect = parseFloat(lifetimeInput) || 0;

  // Lifetime in months: from attrition (1 / rate) or entered directly
  let lifetimeMonths = 0;
  if (useLifetime) {
    lifetimeMonths = lifetimeDirect;
  } else if (attritionPct > 0 && attritionPct < 100) {
    lifetimeMonths = 1 / (attritionPct / 100);
  }

  const ltvPerMember = memberValue * lifetimeMonths;
  const totalProjectedValue = ltvPerMember * membersAdded;

  const hasProjection = memberValue > 0 && lifetimeMonths > 0;

  return (
    <Card className="relative border-[#10E29C]/30 bg-card p-6">
      {/* Header */}
      <div className="mb-1 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#10E29C]/10">
          <Calculator className="h-5 w-5 text-[#10E29C]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Membership Value Calculator
          </h2>
          <p className="text-xs text-muted-foreground">
            Total members added &times; value &times; lifetime
          </p>
        </div>
      </div>

      {/* Actual: members added from pipeline */}
      <div className="mt-4 rounded-md border border-[#10E29C]/20 bg-[#10E29C]/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#10E29C]" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Members Added
          </span>
          <span className="ml-auto rounded bg-[#10E29C]/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#10E29C]">
            Actual
          </span>
        </div>
        <p className="mt-1 text-2xl font-bold text-foreground">
          {membersAdded.toLocaleString()}
        </p>
      </div>

      {/* Lifetime toggle */}
      <div className="mt-5 flex items-center gap-3">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${!useLifetime ? "text-[#10E29C]" : "text-muted-foreground"}`}
        >
          Monthly Attrition %
        </span>
        <Switch
          checked={useLifetime}
          onCheckedChange={setUseLifetime}
          className="data-[state=checked]:bg-[#10E29C]"
        />
        <span
          className={`text-xs font-medium uppercase tracking-wider ${useLifetime ? "text-[#10E29C]" : "text-muted-foreground"}`}
        >
          Avg Lifetime (Months)
        </span>
      </div>

      {/* Inputs row */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Membership value */}
        <div>
          <label
            htmlFor="member-value-input"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Membership Value ($/mo)
          </label>
          <Input
            id="member-value-input"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 149"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            className="border-[#10E29C]/20 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-[#10E29C]/40"
          />
        </div>

        {/* Attrition OR Lifetime */}
        {useLifetime ? (
          <div>
            <label
              htmlFor="lifetime-input"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Avg Lifetime (Months)
            </label>
            <Input
              id="lifetime-input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 20"
              value={lifetimeInput}
              onChange={(e) => setLifetimeInput(e.target.value)}
              className="border-[#10E29C]/20 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-[#10E29C]/40"
            />
          </div>
        ) : (
          <div>
            <label
              htmlFor="attrition-input"
              className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Monthly Attrition Rate (%)
            </label>
            <Input
              id="attrition-input"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g. 5"
              value={attritionInput}
              onChange={(e) => setAttritionInput(e.target.value)}
              className="border-[#10E29C]/20 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-[#10E29C]/40"
            />
          </div>
        )}
      </div>

      {/* Derived lifetime when using attrition */}
      {!useLifetime && attritionPct > 0 && attritionPct < 100 && (
        <p className="mt-3 text-xs text-muted-foreground">
          = avg member lifetime:{" "}
          <span className="font-semibold text-[#10E29C]">
            {lifetimeMonths.toFixed(1)} months
          </span>
        </p>
      )}

      {/* Projected results */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg Lifetime
            </span>
            <span className="ml-auto rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
              Projected
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasProjection ? `${lifetimeMonths.toFixed(1)} mo` : "--"}
          </p>
        </div>

        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              LTV / Member
            </span>
            <span className="ml-auto rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
              Projected
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasProjection ? formatCurrency(ltvPerMember) : "--"}
          </p>
        </div>

        <div className="rounded-md border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Projected Value
            </span>
            <span className="ml-auto rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
              Projected
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasProjection ? formatCurrency(totalProjectedValue) : "--"}
          </p>
        </div>
      </div>

      {/* Summary sentence */}
      {hasProjection && membersAdded > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {membersAdded.toLocaleString()}
          </span>{" "}
          members &times;{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(memberValue)}/mo
          </span>{" "}
          &times;{" "}
          <span className="font-semibold text-foreground">
            {lifetimeMonths.toFixed(1)} mo
          </span>{" "}
          ={" "}
          <span className="font-bold text-[#10E29C]">
            {formatCurrency(totalProjectedValue)}
          </span>
        </p>
      )}
    </Card>
  );
}
