import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calculator, Clock, DollarSign, TrendingDown, CalendarDays } from "lucide-react";

interface MembershipValueCalculatorProps {
  membershipsSold: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function MembershipValueCalculator({ membershipsSold }: MembershipValueCalculatorProps) {
  const [monthlyPrice, setMonthlyPrice] = useState("");
  const [attritionInput, setAttritionInput] = useState("");
  const [lifetimeInput, setLifetimeInput] = useState("");
  const [useLifetime, setUseLifetime] = useState(false);

  const price = parseFloat(monthlyPrice) || 0;
  const attritionPct = parseFloat(attritionInput) || 0;
  const lifetimeDirect = parseFloat(lifetimeInput) || 0;

  // Calculate average lifetime in months
  let lifetimeMonths = 0;
  if (useLifetime) {
    lifetimeMonths = lifetimeDirect;
  } else if (attritionPct > 0 && attritionPct < 100) {
    lifetimeMonths = 1 / (attritionPct / 100);
  }

  const ltvPerMember = price * lifetimeMonths;
  const monthlyRevenue = price * membershipsSold;
  const totalLifetimeValue = ltvPerMember * membershipsSold;

  const hasInput = price > 0 && lifetimeMonths > 0;

  return (
    <Card className="relative border-[#10E29C]/30 bg-card p-6">
      <div className="mb-1 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#10E29C]/10">
          <Calculator className="h-5 w-5 text-[#10E29C]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Membership Value Calculator</h2>
          <p className="text-xs text-muted-foreground">
            Calculate member value based on attrition &amp; memberships sold
          </p>
        </div>
      </div>

      {membershipsSold > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Memberships sold: <span className="font-semibold text-[#10E29C]">{membershipsSold.toLocaleString()}</span>
        </p>
      )}

      {/* Toggle */}
      <div className="mt-5 flex items-center gap-3">
        <span className={`text-xs font-medium uppercase tracking-wider ${!useLifetime ? "text-[#10E29C]" : "text-muted-foreground"}`}>
          Monthly Attrition %
        </span>
        <Switch
          checked={useLifetime}
          onCheckedChange={setUseLifetime}
          className="data-[state=checked]:bg-[#10E29C]"
        />
        <span className={`text-xs font-medium uppercase tracking-wider ${useLifetime ? "text-[#10E29C]" : "text-muted-foreground"}`}>
          Lifetime (Months)
        </span>
      </div>

      {/* Inputs */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="monthly-price-input"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Monthly Membership Price ($)
          </label>
          <Input
            id="monthly-price-input"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 149"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
            className="border-[#10E29C]/20 bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-[#10E29C]/40"
          />
        </div>

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

      {/* Derived lifetime display when using attrition */}
      {!useLifetime && attritionPct > 0 && attritionPct < 100 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Avg member lifetime: <span className="font-semibold text-[#10E29C]">{lifetimeMonths.toFixed(1)} months</span>
        </p>
      )}

      {/* Results */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#10E29C]" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Avg Lifetime
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasInput ? `${lifetimeMonths.toFixed(1)} mo` : "--"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-[#10E29C]" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              LTV / Member
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasInput ? formatCurrency(ltvPerMember) : "--"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#10E29C]" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Revenue
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasInput ? formatCurrency(monthlyRevenue) : "--"}
          </p>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#10E29C]" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Lifetime Value
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {hasInput ? formatCurrency(totalLifetimeValue) : "--"}
          </p>
        </div>
      </div>
    </Card>
  );
}
