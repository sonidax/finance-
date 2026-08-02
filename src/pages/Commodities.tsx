import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { useCommodities, Commodity } from "@/hooks/useCommodities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Flame, 
  Coins, 
  Layers, 
  Zap, 
  BarChart2, 
  Clock, 
  ShieldCheck, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

// Image icon fallback mapping
const IMG_BY_NAME: Record<string, string> = {
  "Crude Oil": "/crudeOilV2.svg",
  "Natural Gas": "/naturalGasV3.svg",
  "Gold": "/goldV3.svg",
  "Silver": "/silverV3.svg",
};

// Helper component for Commodity Icon with custom styling
function CommodityIcon({ name, icon }: { name: string; icon?: string }) {
  if (icon && icon.startsWith("/")) {
    return (
      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/20 p-2 flex items-center justify-center border border-amber-500/20 shadow-sm">
        <img src={icon} alt={name} className="h-8 w-8 object-contain" />
      </div>
    );
  }

  // Styled icons based on commodity type
  switch (name.toLowerCase()) {
    case "gold":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-amber-600/30 p-2 flex items-center justify-center border border-yellow-500/30 shadow-sm text-yellow-500">
          <Coins className="h-7 w-7" />
        </div>
      );
    case "silver":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-300/20 to-slate-500/30 p-2 flex items-center justify-center border border-slate-400/30 shadow-sm text-slate-300">
          <Coins className="h-7 w-7" />
        </div>
      );
    case "crude oil":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-900/30 to-slate-800/40 p-2 flex items-center justify-center border border-amber-800/30 shadow-sm text-amber-500">
          <Flame className="h-7 w-7" />
        </div>
      );
    case "natural gas":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/30 p-2 flex items-center justify-center border border-sky-400/30 shadow-sm text-sky-400">
          <Zap className="h-7 w-7" />
        </div>
      );
    case "copper":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-700/30 p-2 flex items-center justify-center border border-orange-500/30 shadow-sm text-orange-400">
          <Layers className="h-7 w-7" />
        </div>
      );
    case "aluminum":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-200/20 to-zinc-400/30 p-2 flex items-center justify-center border border-slate-300/30 shadow-sm text-slate-200">
          <Layers className="h-7 w-7" />
        </div>
      );
    case "zinc":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-300/20 to-indigo-500/30 p-2 flex items-center justify-center border border-blue-400/30 shadow-sm text-blue-300">
          <Layers className="h-7 w-7" />
        </div>
      );
    case "platinum":
      return (
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-violet-600/30 p-2 flex items-center justify-center border border-purple-400/30 shadow-sm text-purple-300">
          <Coins className="h-7 w-7" />
        </div>
      );
    default:
      return (
        <div className="h-12 w-12 rounded-xl bg-primary/10 p-2 flex items-center justify-center text-primary">
          <Activity className="h-7 w-7" />
        </div>
      );
  }
}

function formatExpiry(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Commodities() {
  const { commodities } = useCommodities();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCommodities = commodities.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === "all") return true;
    if (activeTab === "precious") return c.category === "Precious Metals" || c.name === "Gold" || c.name === "Silver" || c.name === "Platinum";
    if (activeTab === "energy") return c.category === "Energy" || c.name === "Crude Oil" || c.name === "Natural Gas";
    if (activeTab === "base") return c.category === "Base Metals" || c.name === "Copper" || c.name === "Aluminum" || c.name === "Zinc";
    return true;
  });

  // Calculate market statistics
  const gainerCount = commodities.filter(c => c.price_change > 0).length;
  const loserCount = commodities.filter(c => c.price_change < 0).length;

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Commodities Market
              </h1>
              <Badge className="bg-destructive text-destructive-foreground font-semibold px-2.5 py-0.5 animate-pulse">
                LIVE MCX
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Real-time prices, 24h high/low ranges, contract sizes & futures expiry for Gold, Silver, Crude Oil, Natural Gas and Metals.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card border border-border px-3 py-2 rounded-lg w-fit">
            <Clock className="h-4 w-4 text-primary" />
            <span>Updated: {new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })} IST</span>
          </div>
        </div>

        {/* Top Market Overview Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commodities.slice(0, 4).map((c) => {
            const isPositive = c.price_change >= 0;
            const pct = c.current_price
              ? (c.price_change / (c.current_price - c.price_change)) * 100
              : 0;
            const iconPath = IMG_BY_NAME[c.name] || c.icon;

            return (
              <Card key={c.id} className="relative overflow-hidden card-hover border-border/70">
                <div className={`absolute top-0 left-0 right-0 h-1 ${isPositive ? 'bg-success' : 'bg-destructive'}`} />
                <CardContent className="pt-5 pb-4 px-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <CommodityIcon name={c.name} icon={iconPath} />
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-snug">{c.name}</h3>
                        <p className="text-xs text-muted-foreground">{c.unit || "Contract Unit"}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-medium">
                      {formatExpiry(c.expiry_date)}
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{c.current_price.toLocaleString("en-IN")}
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${isPositive ? 'text-success' : 'text-destructive'}`}>
                        {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        <span>₹{Math.abs(c.price_change).toLocaleString("en-IN")} ({isPositive ? '+' : ''}{pct.toFixed(2)}%)</span>
                      </div>
                    </div>
                    {c.high_24h && c.low_24h && (
                      <div className="text-right text-[11px] text-muted-foreground">
                        <div>High: <span className="font-medium text-foreground">₹{c.high_24h.toLocaleString("en-IN")}</span></div>
                        <div>Low: <span className="font-medium text-foreground">₹{c.low_24h.toLocaleString("en-IN")}</span></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Category Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 w-full md:w-auto bg-muted">
              <TabsTrigger value="all">All ({commodities.length})</TabsTrigger>
              <TabsTrigger value="precious">Precious</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="base">Base Metals</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Gold, Crude Oil, Copper..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCommodities.map((c) => {
            const isPositive = c.price_change >= 0;
            const pct = c.current_price
              ? (c.price_change / (c.current_price - c.price_change)) * 100
              : 0;
            const iconPath = IMG_BY_NAME[c.name] || c.icon;

            // Calculate percentage position of current price in 24h high-low range
            const low = c.low_24h || c.current_price * 0.98;
            const high = c.high_24h || c.current_price * 1.02;
            const rangePct = Math.min(Math.max(((c.current_price - low) / (high - low)) * 100, 0), 100);

            return (
              <Card key={c.id} className="card-hover overflow-hidden border-border/80 flex flex-col justify-between">
                <CardHeader className="pb-3 pt-5 px-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <CommodityIcon name={c.name} icon={iconPath} />
                      <div>
                        <CardTitle className="text-lg font-bold">{c.name}</CardTitle>
                        <CardDescription className="text-xs">{c.category || "Commodity"}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[11px] font-semibold bg-muted">
                      {c.unit || "MCX Lot"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5 space-y-4">
                  {/* Price & Change */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/40">
                    <div className="text-xs text-muted-foreground font-medium mb-1">Futures Expiry: {formatExpiry(c.expiry_date)}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold tracking-tight text-foreground">
                        ₹{c.current_price.toLocaleString("en-IN")}
                      </span>
                      <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded ${
                        isPositive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                      }`}>
                        {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{pct.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* 24h High - Low Range */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>24h Range</span>
                      <span className="font-medium text-foreground">₹{low.toLocaleString("en-IN")} - ₹{high.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isPositive ? 'bg-success' : 'bg-destructive'}`}
                        style={{ width: `${rangePct}%` }}
                      />
                    </div>
                  </div>

                  {/* Contract Volume */}
                  {c.volume && (
                    <div className="flex justify-between text-xs pt-1 border-t border-border/50 text-muted-foreground">
                      <span>Volume</span>
                      <span className="font-semibold text-foreground">{c.volume}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Table View */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Complete Commodities Table
            </CardTitle>
            <CardDescription>
              Detailed view of all active MCX commodity futures contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Commodity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contract Unit</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Price (₹)</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                    <TableHead className="text-right">24h High / Low</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommodities.map((c) => {
                    const isPositive = c.price_change >= 0;
                    const pct = c.current_price
                      ? (c.price_change / (c.current_price - c.price_change)) * 100
                      : 0;
                    const iconPath = IMG_BY_NAME[c.name] || c.icon;

                    return (
                      <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-semibold">
                          <div className="flex items-center gap-3">
                            <CommodityIcon name={c.name} icon={iconPath} />
                            <div>
                              <p className="font-bold text-foreground">{c.name}</p>
                              <p className="text-xs text-muted-foreground">MCX Futures</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-normal">
                            {c.category || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.unit || "1 Lot"}</TableCell>
                        <TableCell className="font-medium text-foreground">{formatExpiry(c.expiry_date)}</TableCell>
                        <TableCell className="text-right font-bold text-base">₹{c.current_price.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded ${
                            isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {isPositive ? '▲ +' : '▼ '}₹{Math.abs(c.price_change).toLocaleString("en-IN")} ({pct.toFixed(2)}%)
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {c.high_24h && c.low_24h ? `₹${c.high_24h.toLocaleString("en-IN")} / ₹${c.low_24h.toLocaleString("en-IN")}` : '—'}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">{c.volume || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Commodity Market Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-4 items-start">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-foreground mb-1">About MCX Commodity Trading</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Commodity futures prices are tracked live from the Multi Commodity Exchange (MCX) of India. 
                  Trading hours for Bullion & Metals are 9:00 AM to 11:30 PM IST, and Energy contracts run till 11:55 PM IST. 
                  Contract values and margin requirements vary per lot size.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
