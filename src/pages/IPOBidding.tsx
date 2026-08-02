import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  UserCheck, 
  ShieldCheck, 
  CreditCard,
  Zap,
  Sparkles
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
  const { submitBid } = useIPOBids();

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);

  // Application Dashboard Form State
  const [lotCount, setLotCount] = useState<number>(1);
  const [bidPrice, setBidPrice] = useState<string>("");
  const [investorType, setInvestorType] = useState<'Retail' | 'sHNI' | 'bHNI'>('Retail');
  const [panNumber, setPanNumber] = useState("");
  const [dpId, setDpId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openIPOs = ipos.filter((ipo) => ipo.status === "Open");
  const upcomingIPOs = ipos.filter((ipo) => ipo.status === "Upcoming");
  const listedIPOs = ipos.filter((ipo) => ipo.status === "Listed");

  // Auto-open application modal if redirecting back after login with ?applyIpoId=X
  useEffect(() => {
    const applyIpoId = searchParams.get("applyIpoId");
    if (applyIpoId && ipos.length > 0) {
      const found = ipos.find((i) => String(i.id) === applyIpoId);
      if (found) {
        if (user) {
          openApplicationModal(found);
          // Clean up search params after opening
          searchParams.delete("applyIpoId");
          setSearchParams(searchParams, { replace: true });
        }
      }
    }
  }, [searchParams, ipos, user]);

  const openApplicationModal = (ipo: IPO) => {
    setSelectedIPO(ipo);
    const isSME = ipo.boardtype?.toLowerCase() === 'sme';
    const upperPrice = ipo.price_band.includes("-") 
      ? ipo.price_band.split("-")[1].trim() 
      : ipo.price_band;
    
    setBidPrice(upperPrice);
    
    if (isSME) {
      setInvestorType('sHNI');
      setLotCount(1);
    } else {
      setInvestorType('Retail');
      setLotCount(1);
    }

    setPanNumber(user?.email ? "ABCDE1234F" : "");
    setDpId("1208160012345678");
    setUpiId(user?.email ? `${user.email.split('@')[0]}@upi` : "");
    setIsDialogOpen(true);
  };

  // Handler for Apply Now button
  const handleApplyClick = (ipo: IPO) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to proceed with your IPO Application Dashboard.",
        variant: "destructive",
      });
      navigate("/login", { state: { from: "/ipo-bidding", applyIpoId: ipo.id } });
      return;
    }
    openApplicationModal(ipo);
  };

  // Handler for dialog close
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setLotCount(1);
      setBidPrice("");
      setSelectedIPO(null);
      setInvestorType('Retail');
      setPanNumber("");
      setDpId("");
      setUpiId("");
    }
  };

  // Lot increment / decrement handlers
  const handleIncrementLots = () => {
    if (!selectedIPO) return;
    const isSME = selectedIPO.boardtype?.toLowerCase() === 'sme';
    const maxLots = isSME ? 50 : (investorType === 'Retail' ? 13 : 100);
    if (lotCount < maxLots) {
      const next = lotCount + 1;
      setLotCount(next);
      checkAndUpdateCategory(next, selectedIPO);
    }
  };

  const handleDecrementLots = () => {
    if (lotCount > 1) {
      const next = lotCount - 1;
      setLotCount(next);
      if (selectedIPO) checkAndUpdateCategory(next, selectedIPO);
    }
  };

  const handleSetLots = (num: number) => {
    setLotCount(num);
    if (selectedIPO) checkAndUpdateCategory(num, selectedIPO);
  };

  const checkAndUpdateCategory = (lots: number, ipo: IPO) => {
    const isSME = ipo.boardtype?.toLowerCase() === 'sme';
    if (isSME) return;

    const price = parseFloat(bidPrice || ipo.price_band.split("-")[1] || "100");
    const totalAmount = lots * ipo.lot_size * price;

    if (totalAmount > 200000 && investorType === 'Retail') {
      setInvestorType('sHNI');
      toast({
        title: "Category Switched to sHNI",
        description: "Investment amount exceeds ₹2,00,000 limit for Retailers.",
      });
    } else if (totalAmount <= 200000 && (investorType === 'sHNI' || investorType === 'bHNI')) {
      if (lots < 14) {
        setInvestorType('Retail');
      }
    }
  };

  const handleBidSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedIPO) return;

    if (!panNumber.trim()) {
      toast({
        title: "PAN Number Required",
        description: "Please enter your 10-character PAN number.",
        variant: "destructive",
      });
      return;
    }

    const panPattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    if (!panPattern.test(panNumber.trim())) {
      toast({
        title: "Invalid PAN Format",
        description: "Format must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).",
        variant: "destructive",
      });
      return;
    }

    if (!dpId.trim()) {
      toast({
        title: "DP ID Required",
        description: "Please enter your 16-digit Demat / DP ID.",
        variant: "destructive",
      });
      return;
    }

    const currentPrice = parseFloat(bidPrice || selectedIPO.price_band.split("-")[1]);
    const totalInvestment = lotCount * selectedIPO.lot_size * currentPrice;

    setIsSubmitting(true);
    try {
      await submitBid({
        ipo_id: selectedIPO.id,
        investor_type: investorType === 'Retail' ? 'Retail' : 'HNI',
        number_of_lots: lotCount,
        bid_price: currentPrice,
        total_investment: totalInvestment,
        pan_number: panNumber.trim().toUpperCase(),
        dp_id: dpId.trim(),
      });

      toast({
        title: "🎉 IPO Bid Application Submitted!",
        description: `Application for ${selectedIPO.ipo_name} (${lotCount} ${lotCount === 1 ? 'Lot' : 'Lots'}, ₹${totalInvestment.toLocaleString('en-IN')}) successfully placed. UPI Mandate sent to ${upiId || 'your registered UPI'}.`,
      });

      setIsDialogOpen(false);
      handleDialogClose(false);
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-success/10 text-success border-success/20";
      case "Upcoming":
        return "bg-warning/10 text-warning border-warning/20";
      case "Listed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const IPOCard = ({ ipo }: { ipo: IPO }) => (
    <Card className="card-hover relative overflow-hidden border-border/70 flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={getStatusColor(ipo.status)}>
              {ipo.status}
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
              {ipo.boardtype || "Mainboard"}
            </Badge>
          </div>
          <span className={`text-sm font-bold ${ipo.gmp >= 0 ? 'text-success' : 'text-destructive'}`}>
            GMP: ₹{ipo.gmp}
          </span>
        </div>
        <CardTitle className="font-display text-xl mt-3 text-foreground">{ipo.ipo_name}</CardTitle>
        <CardDescription>{ipo.type} Issue</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2.5 text-sm p-3 rounded-lg bg-muted/30 border border-border/40">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              Price Band
            </span>
            <span className="font-bold text-foreground">₹{ipo.price_band}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="h-4 w-4 text-accent" />
              Lot Size
            </span>
            <span className="font-semibold text-foreground">{ipo.lot_size} shares / lot</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issue Size</span>
            <span className="font-semibold text-foreground">₹{ipo.issue_size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-success" />
              Open - Close
            </span>
            <span className="font-medium">
              {new Date(ipo.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(ipo.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        {/* Apply Now button */}
        {ipo.status === "Open" && (
          <Button
            className="w-full font-semibold btn-shine"
            type="button"
            onClick={() => handleApplyClick(ipo)}
          >
            Apply Now
          </Button>
        )}
        {ipo.status === "Upcoming" && (
          <Button variant="secondary" className="w-full" disabled>
            Coming Soon
          </Button>
        )}
        {ipo.status === "Listed" && (
          <Button variant="outline" className="w-full" disabled>
            Listed on {new Date(ipo.listing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  // Calculations for current selected IPO in Modal
  const isSME = selectedIPO?.boardtype?.toLowerCase() === 'sme';
  const unitPrice = parseFloat(bidPrice || selectedIPO?.price_band.split("-")[1] || "0");
  const lotShares = selectedIPO?.lot_size || 1;
  const totalShares = lotCount * lotShares;
  const totalInvestmentAmount = totalShares * unitPrice;

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            IPO Bidding Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Apply for active Mainboard & SME IPOs, customize your lot size, and track your bids.
          </p>
        </div>

        {iposLoading && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">Loading active IPOs…</p>
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
                Open Issues
                <Badge variant="secondary" className="ml-1">{openIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                Upcoming Issues
                <Badge variant="secondary" className="ml-1">{upcomingIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="listed" className="gap-2">
                Recently Listed
                <Badge variant="secondary" className="ml-1">{listedIPOs.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="open">
              {openIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {openIPOs.map((ipo) => (
                    <IPOCard key={ipo.id} ipo={ipo} />
                  ))}
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
                    <IPOCard key={ipo.id} ipo={ipo} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No upcoming IPOs at the moment.</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="listed">
              {listedIPOs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listedIPOs.map((ipo) => (
                    <IPOCard key={ipo.id} ipo={ipo} />
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

      {/* RICH IPO APPLICATION DASHBOARD DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pr-6">
              <div>
                <DialogTitle className="font-display text-2xl font-bold flex items-center gap-2 text-foreground">
                  {selectedIPO?.ipo_name}
                </DialogTitle>
                <DialogDescription className="mt-1 text-xs">
                  {selectedIPO?.type} Issue • Cut-off Price Bidding Dashboard
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={isSME ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"}>
                  {selectedIPO?.boardtype?.toUpperCase() || "MAINBOARD"}
                </Badge>
                {selectedIPO?.gmp && selectedIPO.gmp > 0 && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-bold">
                    GMP: +₹{selectedIPO.gmp}
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Board Type & Category Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
                <UserCheck className="h-4 w-4 text-primary" />
                Select Investor Category
              </Label>

              {!isSME ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setInvestorType('Retail');
                      if (lotCount > 13) setLotCount(13);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      investorType === 'Retail'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm'
                        : 'border-border hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">Retail (RII)</span>
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Up to ₹2,00,000</p>
                    <p className="text-[10px] text-success font-semibold mt-1">Best for Retailers</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvestorType('sHNI');
                      if (lotCount < 14) setLotCount(14);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      investorType === 'sHNI'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm'
                        : 'border-border hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">Small HNI (sNII)</div>
                    <p className="text-[11px] text-muted-foreground mt-1">₹2L to ₹10L</p>
                    <p className="text-[10px] text-primary font-semibold mt-1">Min 14 Lots</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvestorType('bHNI');
                      if (lotCount < 70) setLotCount(70);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      investorType === 'bHNI'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm'
                        : 'border-border hover:border-primary/40 bg-card'
                    }`}
                  >
                    <div className="font-bold text-sm text-foreground">Big HNI (bNII)</div>
                    <p className="text-[11px] text-muted-foreground mt-1">Above ₹10 Lakhs</p>
                    <p className="text-[10px] text-accent font-semibold mt-1">High Allocation</p>
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    SME Board IPO Application
                  </div>
                  <p className="text-[11px] mt-1 opacity-90">
                    SME IPOs have higher minimum lot sizes ({selectedIPO?.lot_size} shares/lot) with fixed lot investments starting around ₹1.2L+.
                  </p>
                </div>
              )}
            </div>

            {/* LOT QUANTITY CALCULATOR DASHBOARD */}
            <div className="space-y-3 p-4 rounded-xl bg-card border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-bold text-foreground">Select Number of Lots</Label>
                  <p className="text-xs text-muted-foreground">1 Lot = {lotShares} shares</p>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  Max: {investorType === 'Retail' ? '13 Lots (₹2L)' : '100 Lots'}
                </Badge>
              </div>

              {/* Increment / Decrement Lot Selector */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl text-lg font-bold border-2"
                  onClick={handleDecrementLots}
                  disabled={lotCount <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <div className="flex-1 text-center py-2 px-4 rounded-xl bg-muted/50 border border-border">
                  <span className="text-2xl font-extrabold text-foreground">{lotCount}</span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-medium">{lotCount === 1 ? 'Lot' : 'Lots'}</span>
                  <div className="text-xs font-semibold text-primary">({totalShares} shares)</div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl text-lg font-bold border-2"
                  onClick={handleIncrementLots}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              {/* Lot Preset Quick Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs text-muted-foreground self-center mr-1">Quick Sets:</span>
                {!isSME && investorType === 'Retail' && (
                  <>
                    {[1, 2, 5, 10, 13].map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={lotCount === num ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7 px-2.5 rounded-lg"
                        onClick={() => handleSetLots(num)}
                      >
                        {num === 13 ? '13 Lots (Max)' : `${num} ${num === 1 ? 'Lot' : 'Lots'}`}
                      </Button>
                    ))}
                  </>
                )}
                {investorType !== 'Retail' && (
                  <>
                    {[14, 20, 50, 70].map((num) => (
                      <Button
                        key={num}
                        type="button"
                        variant={lotCount === num ? "default" : "outline"}
                        size="sm"
                        className="text-xs h-7 px-2.5 rounded-lg"
                        onClick={() => handleSetLots(num)}
                      >
                        {num} Lots
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* LIVE INVESTMENT SUMMARY DASHBOARD */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Cut-off Bid Price</span>
                <span className="font-semibold text-foreground">₹{unitPrice.toLocaleString('en-IN')} / share</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total Shares Applied</span>
                <span className="font-semibold text-foreground">{totalShares} Shares ({lotCount} Lots)</span>
              </div>
              <div className="h-px bg-border/60" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Investment Amount</span>
                  <div className="text-3xl font-extrabold text-foreground tracking-tight mt-0.5">
                    ₹{totalInvestmentAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <Badge variant="outline" className={`px-3 py-1 text-xs font-bold ${
                  totalInvestmentAmount <= 200000 
                    ? 'bg-success/10 text-success border-success/30' 
                    : 'bg-primary/10 text-primary border-primary/30'
                }`}>
                  {totalInvestmentAmount <= 200000 ? 'Retail Category' : 'HNI Category'}
                </Badge>
              </div>
            </div>

            {/* APPLICANT DEMAT & PAYMENT DETAILS */}
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="pan" className="text-xs font-semibold">PAN Number *</Label>
                <Input
                  id="pan"
                  type="text"
                  maxLength={10}
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  className="uppercase font-mono tracking-wider bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dpid" className="text-xs font-semibold">Demat DP ID / Client ID *</Label>
                <Input
                  id="dpid"
                  type="text"
                  placeholder="1208160012345678 (16 digits)"
                  value={dpId}
                  onChange={(e) => setDpId(e.target.value)}
                  className="font-mono bg-card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upi" className="text-xs font-semibold flex items-center justify-between">
                  <span>UPI Virtual Payment Address (VPA)</span>
                  <span className="text-[10px] text-muted-foreground font-normal">For ASBA Mandate</span>
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="upi"
                    type="text"
                    placeholder="yourname@okhdfcbank or yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="pl-10 font-mono text-sm bg-card"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BID BUTTON */}
            <Button
              className="w-full h-12 text-base font-bold btn-shine shadow-md"
              type="button"
              disabled={isSubmitting}
              onClick={handleBidSubmit}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing IPO Application…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-amber-300" />
                  Submit Bid (₹{totalInvestmentAmount.toLocaleString('en-IN')})
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
