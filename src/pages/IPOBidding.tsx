import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  XCircle, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  TrendingUp, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight,
  Info
} from "lucide-react";
import { useIPOs, IPO } from "@/hooks/useIPOs";
import { useIPOBids } from "@/hooks/useIPOBids";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function IPOBidding() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { ipos, loading: iposLoading, error: iposError } = useIPOs();
  const { bids, submitBid } = useIPOBids();

  // Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);

  // Form State matching Angel One UI
  const [investorType, setInvestorType] = useState<'Retail' | 'HNI'>('Retail');
  const [numberOfLots, setNumberOfLots] = useState<string>("1");
  const [bidPrice, setBidPrice] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("shilpeshkrupali-2@okhdfcbank");
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [showAmountBreakdown, setShowAmountBreakdown] = useState(false);
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [dpId, setDpId] = useState("1208160012345678");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openIPOs = ipos.filter((ipo) => ipo.status === "Open");
  const upcomingIPOs = ipos.filter((ipo) => ipo.status === "Upcoming");
  const listedIPOs = ipos.filter((ipo) => ipo.status === "Listed");

  // Check if user has already applied for the selected IPO
  const existingBid = selectedIPO 
    ? bids.find(b => b.ipo_id === selectedIPO.id || b.ipo_name === selectedIPO.ipo_name)
    : null;

  // Auto-open application modal if redirecting back after login with ?applyIpoId=X
  useEffect(() => {
    const applyIpoId = searchParams.get("applyIpoId");
    if (applyIpoId && ipos.length > 0) {
      const found = ipos.find((i) => String(i.id) === applyIpoId);
      if (found && user) {
        openApplicationModal(found);
        searchParams.delete("applyIpoId");
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, ipos, user]);

  const openApplicationModal = (ipo: IPO) => {
    setSelectedIPO(ipo);
    const upperPrice = ipo.price_band.includes("-") 
      ? ipo.price_band.split("-")[1].trim() 
      : ipo.price_band;
    
    setBidPrice(upperPrice);
    setNumberOfLots("1");
    setInvestorType('Retail');
    setIsEditingUpi(false);
    setShowAmountBreakdown(false);
    
    if (user?.email) {
      const userPrefix = user.email.split('@')[0];
      setUpiId(`${userPrefix}@okhdfcbank`);
    } else {
      setUpiId("shilpeshkrupali-2@okhdfcbank");
    }

    setIsDialogOpen(true);
  };

  const handleApplyClick = (ipo: IPO) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to apply for an IPO.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/ipo-bidding", applyIpoId: ipo.id } });
      return;
    }
    openApplicationModal(ipo);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedIPO(null);
      setNumberOfLots("1");
      setBidPrice("");
      setIsEditingUpi(false);
      setShowAmountBreakdown(false);
    }
  };

  const lotCount = Math.max(1, parseInt(numberOfLots || "1", 10));
  const lotShares = selectedIPO?.lot_size || 1;
  const totalShares = lotCount * lotShares;
  const unitPrice = parseFloat(bidPrice || (selectedIPO?.price_band.includes("-") ? selectedIPO.price_band.split("-")[1] : selectedIPO?.price_band) || "0");
  const totalPayableAmount = totalShares * unitPrice;

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIPO) return;

    if (!upiId.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter a valid UPI ID for mandate payment.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBid({
        ipo_id: selectedIPO.id,
        investor_type: investorType,
        number_of_lots: lotCount,
        bid_price: unitPrice,
        total_investment: totalPayableAmount,
        pan_number: panNumber,
        dp_id: dpId,
      });

      toast({
        title: "🎉 IPO Application Placed Successfully!",
        description: `Your bid for ${selectedIPO.ipo_name} (${lotCount} ${lotCount === 1 ? 'Lot' : 'Lots'}, ₹${totalPayableAmount.toLocaleString('en-IN')}) has been submitted. UPI Mandate request sent to ${upiId}.`,
      });

      setIsDialogOpen(false);
    } catch (err: any) {
      toast({
        title: "Application Failed",
        description: err.message || "Failed to submit bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "Upcoming":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400";
      case "Listed":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              IPO Bidding
            </h1>
            <p className="text-muted-foreground mt-2">
              Apply for active and upcoming IPOs directly with cut-off price bidding.
            </p>
          </div>
        </div>

        {iposLoading && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading IPOs…</p>
          </Card>
        )}

        {iposError && !iposLoading && (
          <Card className="p-12 text-center">
            <p className="text-destructive">Couldn't load IPOs. Please try again shortly.</p>
          </Card>
        )}

        {!iposLoading && !iposError && (
          <Tabs defaultValue="open" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="open" className="gap-2">
                Open IPOs
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{openIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                Upcoming IPOs
                <Badge variant="secondary" className="ml-1">{upcomingIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="listed" className="gap-2">
                Recently Listed
                <Badge variant="secondary" className="ml-1">{listedIPOs.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* OPEN IPOS GRID */}
            <TabsContent value="open">
              {openIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openIPOs.map((ipo) => {
                    const isSME = ipo.boardtype?.toLowerCase() === "sme";
                    return (
                      <Card key={ipo.id} className="card-hover border-border/80 rounded-xl overflow-hidden bg-card flex flex-col justify-between">
                        <CardHeader className="pb-3 pt-5 px-5">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="font-bold text-lg text-foreground leading-tight">{ipo.ipo_name}</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  isSME 
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200" 
                                    : "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200"
                                }`}>
                                  {ipo.boardtype || "MAINBOARD"}
                                </span>
                              </div>
                            </div>
                            <span className={`text-sm font-bold ${ipo.gmp >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              GMP: ₹{ipo.gmp}
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="px-5 pb-5 space-y-4">
                          <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-lg bg-muted/30 border border-border/40">
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Price Band</span>
                              <span className="font-bold text-sm text-foreground">₹{ipo.price_band}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Lot Size</span>
                              <span className="font-semibold text-foreground">{ipo.lot_size} shares / lot</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Issue Size</span>
                              <span className="font-semibold text-foreground">₹{ipo.issue_size}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-0.5">Closes On</span>
                              <span className="font-semibold text-foreground">
                                {new Date(ipo.close_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 transition-all"
                            type="button"
                            onClick={() => handleApplyClick(ipo)}
                          >
                            APPLY
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No open IPOs at the moment.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="upcoming">
              {upcomingIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingIPOs.map((ipo) => (
                    <Card key={ipo.id} className="border-border/80 rounded-xl overflow-hidden bg-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg text-foreground">{ipo.ipo_name}</h3>
                          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                            {ipo.boardtype || "MAINBOARD"}
                          </Badge>
                        </div>
                        <CardDescription>Price Band: ₹{ipo.price_band}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="secondary" className="w-full" disabled>
                          Coming Soon
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No upcoming IPOs.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="listed">
              {listedIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listedIPOs.map((ipo) => (
                    <Card key={ipo.id} className="border-border/80 rounded-xl bg-card">
                      <CardHeader className="pb-3">
                        <h3 className="font-bold text-lg text-foreground">{ipo.ipo_name}</h3>
                        <CardDescription>Listed on {new Date(ipo.listing_date).toLocaleDateString('en-GB')}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No recently listed IPOs.</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* ── ANGEL ONE STYLE IPO APPLICATION POPUP MODAL ───────────────────────── */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="max-w-lg p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-2xl bg-white dark:bg-card text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER MATCHING ANGEL ONE */}
          <div className="p-5 pb-4 border-b border-gray-100 dark:border-gray-800 relative">
            <button
              onClick={() => handleDialogClose(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 flex-wrap pr-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-foreground tracking-tight">
                {selectedIPO?.ipo_name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 uppercase tracking-wider">
                {selectedIPO?.boardtype || "MAINBOARD"}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
              ₹{selectedIPO?.price_band.includes("-") ? selectedIPO.price_band : `${selectedIPO?.price_band} - ${selectedIPO?.price_band}`}
            </p>
          </div>

          <form onSubmit={handleBidSubmit} className="p-5 space-y-5">
            {/* EXISTING BID ALERT BANNER (ANGEL ONE MATCH) */}
            {existingBid && (
              <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 flex items-center justify-between text-red-700 dark:text-red-300">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span>You have already applied as {existingBid.investor_type}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNumberOfLots(String(existingBid.number_of_lots || 1));
                    setInvestorType(existingBid.investor_type === 'HNI' ? 'HNI' : 'Retail');
                    toast({ title: "Modifying Bid", description: "You can now edit your bid details below." });
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-wider ml-2"
                >
                  MODIFY
                </button>
              </div>
            )}

            {/* INVESTOR TYPE BUTTON TOGGLES */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Investor Type
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInvestorType('Retail');
                    if (parseInt(numberOfLots) > 13) setNumberOfLots("13");
                  }}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border ${
                    investorType === 'Retail'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  Retail
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInvestorType('HNI');
                    if (parseInt(numberOfLots) < 14) setNumberOfLots("14");
                  }}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border ${
                    investorType === 'HNI'
                      ? 'border-blue-600 text-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                      : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  HNI
                </button>
              </div>
            </div>

            {/* NUMBER OF LOTS & BID PRICE (2 COLUMN LAYOUT) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column: Number of Lots */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Number Of Lots
                </label>
                <Input
                  type="number"
                  min={1}
                  max={investorType === 'Retail' ? 13 : 100}
                  value={numberOfLots}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNumberOfLots(val);
                  }}
                  className="h-12 border-gray-200 dark:border-gray-800 text-base font-semibold text-gray-900 dark:text-white rounded-lg focus-visible:ring-blue-600"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {lotCount} {lotCount === 1 ? 'lot' : 'lots'}: {totalShares} shares
                </p>
              </div>

              {/* Right Column: Bid Price */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Bid Price
                </label>
                <Input
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="h-12 border-gray-200 dark:border-gray-800 text-base font-semibold text-gray-900 dark:text-white rounded-lg focus-visible:ring-blue-600"
                />
              </div>
            </div>

            {/* UPI ID CARD CONTAINER (MATCHING ANGEL ONE) */}
            <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  UPI
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium block">UPI ID</span>
                  {!isEditingUpi ? (
                    <span className="text-sm font-bold text-gray-900 dark:text-foreground font-mono">
                      {upiId}
                    </span>
                  ) : (
                    <Input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="h-8 text-xs font-mono w-56"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingUpi(!isEditingUpi)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
              >
                {isEditingUpi ? "SAVE" : "EDIT"}
              </button>
            </div>

            {/* TOTAL PAYABLE AMOUNT & EXPANDABLE BREAKDOWN */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowAmountBreakdown(!showAmountBreakdown)}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600"
                >
                  <span>Total Payable Amount</span>
                  {showAmountBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <span className="text-xl font-extrabold text-gray-900 dark:text-foreground tracking-tight">
                  ₹{totalPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Expandable Breakdown Drawer */}
              {showAmountBreakdown && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs space-y-1.5 border border-gray-100 dark:border-gray-800 animate-fade-in">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shares ({lotCount} lots × {lotShares})</span>
                    <span className="font-semibold text-gray-900 dark:text-foreground">{totalShares} shares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bid Price per share</span>
                    <span className="font-semibold text-gray-900 dark:text-foreground">₹{unitPrice}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 font-bold text-gray-900 dark:text-foreground">
                    <span>Total Investment</span>
                    <span>₹{totalPayableAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* FULL WIDTH ANGEL ONE PRIMARY APPLY BUTTON */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-md mt-2"
              >
                {isSubmitting ? "APPLYING FOR IPO..." : "APPLY FOR IPO"}
              </Button>

              <p className="text-center text-[11px] text-gray-500 dark:text-gray-400">
                By applying, you accept the{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Terms and Conditions
                </a>
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
