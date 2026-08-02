import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";
import { useIPOs, IPO } from "@/hooks/useIPOs";
import { useIPOBids } from "@/hooks/useIPOBids";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function IPOBidding() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ipos, loading: iposLoading, error: iposError } = useIPOs();
  const { submitBid } = useIPOBids();

  // Dialog state - controlled externally to prevent re-renders
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);

  // Form state - separate from dialog state
  const [bidQuantity, setBidQuantity] = useState("1");
  const [bidPrice, setBidPrice] = useState("");
  const [investorType, setInvestorType] = useState<'Retail' | 'HNI' | null>(null);
  const [panNumber, setPanNumber] = useState("");
  const [dpId, setDpId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openIPOs = ipos.filter((ipo) => ipo.status === "Open");
  const upcomingIPOs = ipos.filter((ipo) => ipo.status === "Upcoming");
  const listedIPOs = ipos.filter((ipo) => ipo.status === "Listed");

  // Handler for Apply Now button - single click opens dialog
  const handleApplyClick = (ipo: IPO) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to apply for an IPO.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setSelectedIPO(ipo);
    // If SME, default to HNI and set default lots to 14; otherwise default to Retail with 1 lot
    const isSME = ipo.boardtype?.toLowerCase() === 'sme';
    setBidQuantity(isSME ? '14' : '1');
    setBidPrice(ipo.price_band.split("-")[1]); // Default to upper price band
    setInvestorType(isSME ? 'HNI' : 'Retail');
    setPanNumber("");
    setDpId("");
    setIsDialogOpen(true);
  };

  // Handler for dialog close
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form state when dialog closes
      setBidQuantity("");
      setBidPrice("");
      setInvestorType(null);
      setPanNumber("");
      setDpId("");
    }
  };

  const handleBidSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any form submission or bubbling
    e.preventDefault();
    e.stopPropagation();

    if (!bidQuantity || !bidPrice || !selectedIPO || !investorType) {
      toast({
        title: "Error",
        description: "Please enter bid quantity and price",
        variant: "destructive",
      });
      return;
    }

    const panPattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    if (!panPattern.test(panNumber.trim())) {
      toast({
        title: "Invalid PAN",
        description: "Enter a valid 10-character PAN (e.g. ABCDE1234F).",
        variant: "destructive",
      });
      return;
    }

    if (!dpId.trim()) {
      toast({
        title: "DP ID required",
        description: "Please enter your DP ID / Client ID.",
        variant: "destructive",
      });
      return;
    }

    const totalInvestment = parseInt(bidQuantity) * selectedIPO.lot_size * parseFloat(bidPrice);

    setIsSubmitting(true);
    try {
      await submitBid({
        ipo_id: selectedIPO.id,
        investor_type: investorType,
        number_of_lots: parseInt(bidQuantity),
        bid_price: parseFloat(bidPrice),
        total_investment: totalInvestment,
        pan_number: panNumber.trim().toUpperCase(),
        dp_id: dpId.trim(),
      });

      toast({
        title: "Bid Submitted",
        description: `Your bid for ${selectedIPO.ipo_name} has been submitted successfully.`,
      });

      // Close dialog and reset
      setIsDialogOpen(false);
      setBidQuantity("");
      setBidPrice("");
      setSelectedIPO(null);
      setInvestorType(null);
      setPanNumber("");
      setDpId("");
    } catch (err: any) {
      toast({
        title: "Bid Failed",
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

  const getBoardBadgeClass = (boardtype?: string) => {
    if (!boardtype) return 'hidden';
    switch (boardtype.toLowerCase()) {
      case 'mainboard':
        return 'inline-flex items-center px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold uppercase';
      case 'sme':
        return 'inline-flex items-center px-3 py-1 rounded-md bg-amber-500 text-white text-xs font-semibold uppercase';
      default:
        return 'inline-flex items-center px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs font-semibold uppercase';
    }
  };

  // IPOCard component - no longer contains Dialog to prevent re-render issues
  const IPOCard = ({ ipo }: { ipo: IPO }) => (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={getStatusColor(ipo.status)}>
            {ipo.status}
          </Badge>
          <span className={`text-sm font-semibold ${ipo.gmp >= 0 ? 'text-success' : 'text-destructive'}`}>
            GMP: ₹{ipo.gmp}
          </span>
        </div>
        <CardTitle className="font-display text-xl mt-2">{ipo.ipo_name}</CardTitle>
        <CardDescription>{ipo.type} Issue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Price Band
            </span>
            <span className="font-semibold">₹{ipo.price_band}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              Lot Size
            </span>
            <span className="font-semibold">{ipo.lot_size} shares</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issue Size</span>
            <span className="font-semibold">₹{ipo.issue_size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Open
            </span>
            <span className="font-medium">{new Date(ipo.open_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Close
            </span>
            <span className="font-medium">{new Date(ipo.close_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        {/* Apply Now button - single click handler, no DialogTrigger */}
        {ipo.status === "Open" && (
          <Button
            className="w-full mt-4"
            type="button"
            onClick={() => handleApplyClick(ipo)}
          >
            Apply Now
          </Button>
        )}
        {ipo.status === "Upcoming" && (
          <Button variant="secondary" className="w-full mt-4" disabled>
            Coming Soon
          </Button>
        )}
        {ipo.status === "Listed" && (
          <Button variant="outline" className="w-full mt-4" disabled>
            Listed on {new Date(ipo.listing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            IPO Bidding
          </h1>
          <p className="text-muted-foreground mt-2">
            Apply for upcoming and active IPOs. Track your applications and allotments.
          </p>
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
                Open
                <Badge variant="secondary" className="ml-1">{openIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="gap-2">
                Upcoming
                <Badge variant="secondary" className="ml-1">{upcomingIPOs.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="listed" className="gap-2">
                Listed
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

      {/* Single Dialog instance - controlled, outside IPOCard to prevent remounting */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="font-display">Apply for {selectedIPO?.ipo_name}</DialogTitle>
            <DialogDescription>
              Enter your bid details below. Minimum lot size: {selectedIPO?.lot_size} shares
            </DialogDescription>
            <DialogDescription>
             Investortype: &nbsp;
              {selectedIPO?.boardtype && (
                <span className={getBoardBadgeClass(selectedIPO.boardtype)}>
                  {selectedIPO.boardtype.toUpperCase()}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              {selectedIPO?.boardtype?.toLowerCase() !== 'sme' && (
                <Button
                  className={`flex-1 ${investorType === 'Retail' ? 'bg-primary text-primary-foreground ring-2 ring-primary/40' : ''}`}
                  variant={investorType === 'Retail' ? undefined : 'outline'}
                  onClick={() => {
                    setInvestorType('Retail');
                    setBidQuantity('1');
                  }}
                  aria-pressed={investorType === 'Retail'}
                  type="button"
                >
                  Retail
                </Button>
              )}
              <Button
                className={`flex-1 ${investorType === 'HNI' ? 'bg-primary text-primary-foreground ring-2 ring-primary/40' : ''}`}
                variant={investorType === 'HNI' ? undefined : 'outline'}
                onClick={() => {
                  setInvestorType('HNI');
                  setBidQuantity('14');
                }}
                aria-pressed={investorType === 'HNI'}
                type="button"
              >
                HNI
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Band</span>
                <span className="font-semibold">₹{selectedIPO?.price_band}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lot Size</span>
                <span className="font-semibold">{selectedIPO?.lot_size} shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min Investment</span>
                <span className="font-semibold">
                  ₹{selectedIPO ? (selectedIPO.lot_size * parseInt(selectedIPO.price_band.split("-")[1])).toLocaleString('en-IN') : 0}
                </span>
              </div>
            </div>

            {/* Input fields with type="button" behavior prevented */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Lots</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={investorType === 'HNI' ? 14 : 13}
                placeholder="Enter number of lots"
                value={bidQuantity}
                onChange={(e) => {
                  e.stopPropagation();
                  const raw = e.target.value;
                  if (raw === '') {
                    setBidQuantity('');
                    return;
                  }
                  let num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
                  if (Number.isNaN(num)) return;
                  const max = investorType === 'HNI' ? 14 : 13;
                  if (num > max) num = max;
                  if (num < 1) num = 1;
                  setBidQuantity(String(num));
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Bid Price (₹)</Label>
              <Input
                id="price"
                disabled
                type="text"
                placeholder={`Enter price (${selectedIPO?.price_band || ''})`}
                value={selectedIPO?.price_band}
                onChange={(e) => setBidPrice(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pan">PAN Number</Label>
              <Input
                id="pan"
                type="text"
                maxLength={10}
                placeholder="ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dpid">DP ID / Client ID</Label>
              <Input
                id="dpid"
                type="text"
                placeholder="Enter your DP ID or Client ID"
                value={dpId}
                onChange={(e) => setDpId(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {bidQuantity && bidPrice && selectedIPO && (
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{(parseInt(bidQuantity) * selectedIPO.lot_size * parseFloat(bidPrice)).toLocaleString('en-IN')}
                </p>
              </div>
            )}

            {/* Submit button with type="button" to prevent form submission */}
            <Button
              className="w-full"
              type="button"
              disabled={isSubmitting}
              onClick={handleBidSubmit}
            >
              {isSubmitting ? "Submitting…" : "Submit Bid"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
