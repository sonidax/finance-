import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Users, Building2, Briefcase, Info } from "lucide-react";
import { useSubscriptionRatio } from "@/hooks/useSubscriptionRatio";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function SubscriptionRatio() {
  const { subscriptionData, loading, error } = useSubscriptionRatio();

  // Calculate totals for summary
  const avgQIB = subscriptionData.length ? subscriptionData.reduce((acc, curr) => acc + curr.qib, 0) / subscriptionData.length : 0;
  const avgNII = subscriptionData.length ? subscriptionData.reduce((acc, curr) => acc + curr.nii, 0) / subscriptionData.length : 0;
  const avgRII = subscriptionData.length ? subscriptionData.reduce((acc, curr) => acc + curr.rii, 0) / subscriptionData.length : 0;

  const getSubscriptionLevel = (value: number) => {
    if (value >= 50) return { label: "Oversubscribed", color: "bg-success/10 text-success border-success/20" };
    if (value >= 10) return { label: "High Demand", color: "bg-accent/10 text-accent border-accent/20" };
    if (value >= 1) return { label: "Subscribed", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "Under", color: "bg-muted text-muted-foreground border-border" };
  };

  const getProgressColor = (value: number) => {
    if (value >= 50) return "bg-success";
    if (value >= 10) return "bg-accent";
    if (value >= 1) return "bg-warning";
    return "bg-muted-foreground";
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Subscription Ratio
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-5 w-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Subscription ratio shows how many times an IPO has been subscribed across different investor categories.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-muted-foreground">
            Live subscription data for ongoing and recent IPOs
          </p>
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">QIB (Avg)</p>
                  <p className="text-2xl font-bold text-foreground">{avgQIB.toFixed(2)}x</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NII (Avg)</p>
                  <p className="text-2xl font-bold text-foreground">{avgNII.toFixed(2)}x</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RII (Avg)</p>
                  <p className="text-2xl font-bold text-foreground">{avgRII.toFixed(2)}x</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span><strong>QIB:</strong> Qualified Institutional Buyers</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <span><strong>NII:</strong> Non-Institutional Investors (HNI)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-success" />
                <span><strong>RII:</strong> Retail Individual Investors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Live Subscription Data
            </CardTitle>
            <CardDescription>
              Updated every 30 minutes during subscription period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IPO Name</TableHead>
                    <TableHead className="text-center">QIB</TableHead>
                    <TableHead className="text-center">NII</TableHead>
                    <TableHead className="text-center">RII</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Loading subscription data…
                      </TableCell>
                    </TableRow>
                  )}
                  {error && !loading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-destructive py-8">
                        Couldn't load subscription data. Please try again shortly.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && !error && subscriptionData.map((item) => {
                    const status = getSubscriptionLevel(item.total);
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.ipo_name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-center font-semibold">{item.qib}x</div>
                            <Progress 
                              value={Math.min(item.qib, 100)} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-center font-semibold">{item.nii}x</div>
                            <Progress 
                              value={Math.min(item.nii, 100)} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-center font-semibold">{item.rii}x</div>
                            <Progress 
                              value={Math.min(item.rii, 100)} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center text-lg font-bold text-foreground">
                            {item.total}x
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Understanding Subscription Ratios</h4>
                <p className="text-sm text-muted-foreground">
                  A subscription ratio greater than 1x means the IPO is oversubscribed. Higher subscription in retail (RII) category 
                  typically indicates strong retail interest, while QIB subscription shows institutional confidence. 
                  Very high subscription ratios often correlate with positive listing gains.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
