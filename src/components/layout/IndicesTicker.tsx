import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const indicesData = [
  { name: "NIFTY 50", value: 24835.85, change: 156.30, changePercent: 0.63 },
  { name: "SENSEX", value: 81765.86, change: 478.24, changePercent: 0.59 },
  { name: "NIFTY BANK", value: 52892.45, change: -124.50, changePercent: -0.24 },
  { name: "NIFTY IT", value: 43256.75, change: 287.15, changePercent: 0.67 },
  { name: "NIFTY MIDCAP", value: 58924.30, change: 312.80, changePercent: 0.53 },
  { name: "NIFTY SMALLCAP", value: 18456.20, change: -87.45, changePercent: -0.47 },
  { name: "INDIA VIX", value: 13.24, change: -0.42, changePercent: -3.08 },
  { name: "GIFT NIFTY", value: 24892.50, change: 98.00, changePercent: 0.40 },
];

function IndexItem({ name, value, change, changePercent }: typeof indicesData[0]) {
  const isPositive = change >= 0;

  return (
    <div className="flex items-center gap-3 px-5 py-2 whitespace-nowrap group">
      <span className="font-semibold text-primary-foreground transition-all duration-300 group-hover:text-accent">
        {name}
      </span>
      <span className="text-primary-foreground/70 font-medium">
        {value.toLocaleString("en-IN")}
      </span>
      <span
        className={cn(
          "flex items-center gap-1.5 text-sm font-bold px-2 py-0.5 rounded-full transition-all duration-300",
          isPositive 
            ? "text-success bg-success/10" 
            : "text-destructive bg-destructive/10"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-3.5 w-3.5 animate-bounce-soft" />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 animate-bounce-soft" />
        )}
        {isPositive ? "+" : ""}
        {change.toFixed(2)} ({changePercent.toFixed(2)}%)
      </span>
    </div>
  );
}

export function IndicesTicker() {
  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary to-primary text-primary-foreground overflow-hidden relative">
      {/* Subtle shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent animate-shimmer bg-[length:200%_100%]" />
      
      <div className="flex ticker-scroll relative">
        {/* Duplicate the content for seamless loop */}
        {[...indicesData, ...indicesData].map((index, i) => (
          <IndexItem key={`${index.name}-${i}`} {...index} />
        ))}
      </div>
    </div>
  );
}
