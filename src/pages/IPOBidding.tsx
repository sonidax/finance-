import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp, Users } from "lucide-react";
import { useIPOs, IPO } from "@/hooks/useIPOs";
import { IPOApplyModal } from "@/components/ipo/IPOApplyModal";

export default function IPOBidding() {
  const { ipos, loading: iposLoading, error: iposError } = useIPOs();

  // Modal State for IPO Application Flow
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openIPOs = ipos.filter((ipo) => ipo.status === "Open");
  const upcomingIPOs = ipos.filter((ipo) => ipo.status === "Upcoming");
  const listedIPOs = ipos.filter((ipo) => ipo.status === "Listed");

  const handleApplyClick = (ipo: IPO) => {
    setSelectedIPO(ipo);
    setIsModalOpen(true);
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

  const IPOCard = ({ ipo }: { ipo: IPO }) => (
    <Card className="card-hover relative overflow-hidden border-border/80 rounded-xl bg-card flex flex-col justify-between">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="font-bold text-lg text-foreground leading-tight">{ipo.ipo_name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                ipo.boardtype?.toLowerCase() === "sme"
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

        {/* APPLY NOW BUTTON — Opens Modal without page navigation */}
        {ipo.status === "Open" && (
          <Button
            className="w-full font-bold text-sm bg-gradient-to-r from-[#163A7D] to-[#1e4ca5] hover:opacity-95 text-white rounded-xl h-11 shadow-md transition-all"
            type="button"
            onClick={() => handleApplyClick(ipo)}
          >
            APPLY NOW
          </Button>
        )}
        {ipo.status === "Upcoming" && (
          <Button variant="secondary" className="w-full rounded-xl" disabled>
            Coming Soon
          </Button>
        )}
        {ipo.status === "Listed" && (
          <Button variant="outline" className="w-full rounded-xl" disabled>
            Listed on {new Date(ipo.listing_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            IPO Bidding Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Apply for active Mainboard & SME IPOs directly with instant UPI mandate approval.
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
                <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{openIPOs.length}</Badge>
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

      {/* REUSABLE SEAMLESS IPO APPLICATION MODAL */}
      <IPOApplyModal
        ipo={selectedIPO}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}
