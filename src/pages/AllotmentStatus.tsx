import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIPOs } from "@/hooks/useIPOs";

interface AllotmentResult {
  ipoName: string;
  applicationNumber: string;
  pan: string;
  dpId?: string;
  clientId?: string;
  sharesApplied: number;
  sharesAllotted: number;
  status: "Allotted" | "Not Allotted" | "Pending";
  refundAmount?: number;
}

type SearchType = "pan" | "application" | "dpid";

export default function AllotmentStatus() {
  const { toast } = useToast();
  const { ipos: activeIPOs } = useIPOs();
  
  // Search type state
  const [searchType, setSearchType] = useState<SearchType>("pan");
  
  // Individual input states - kept separate to prevent resets
  const [panValue, setPanValue] = useState("");
  const [applicationValue, setApplicationValue] = useState("");
  const [dpIdValue, setDpIdValue] = useState("");
  const [clientIdValue, setClientIdValue] = useState("");
  
  const [selectedIPO, setSelectedIPO] = useState("");
  const [result, setResult] = useState<AllotmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search type change - only update the type, preserve all input values
  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
  };

  // Validate inputs based on search type
  const validateInputs = (): boolean => {
    if (!selectedIPO) {
      toast({
        title: "Select IPO",
        description: "Please select an IPO to check allotment status",
        variant: "destructive",
      });
      return false;
    }

    if (searchType === "pan" && !panValue.trim()) {
      toast({
        title: "Enter PAN",
        description: "Please enter your PAN number",
        variant: "destructive",
      });
      return false;
    }

    if (searchType === "application" && !applicationValue.trim()) {
      toast({
        title: "Enter Application Number",
        description: "Please enter your application number",
        variant: "destructive",
      });
      return false;
    }

    if (searchType === "dpid") {
      if (!dpIdValue.trim() || !clientIdValue.trim()) {
        toast({
          title: "Enter DP ID & Client ID",
          description: "Please enter both DP ID and Client ID",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSearch = () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const statuses: AllotmentResult["status"][] = ["Allotted", "Not Allotted", "Pending"];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const ipoDetails = activeIPOs.find(ipo => ipo.ipo_name === selectedIPO);
      
      // Build result based on search type
      const baseResult = {
        ipoName: selectedIPO,
        applicationNumber: searchType === "application" 
          ? applicationValue 
          : "APP" + Math.random().toString().slice(2, 12),
        pan: searchType === "pan" 
          ? panValue.toUpperCase() 
          : "ABCDE1234F",
        sharesApplied: ipoDetails?.lot_size || 50,
        sharesAllotted: randomStatus === "Allotted" ? (ipoDetails?.lot_size || 50) : 0,
        status: randomStatus,
        refundAmount: randomStatus === "Not Allotted" 
          ? (ipoDetails?.lot_size || 50) * parseInt(ipoDetails?.price_band.split("-")[1] || "100") 
          : 0,
      };

      // Add DP ID and Client ID if that search type was used
      if (searchType === "dpid") {
        setResult({
          ...baseResult,
          dpId: dpIdValue,
          clientId: clientIdValue,
        });
      } else {
        setResult(baseResult);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const getStatusIcon = (status: AllotmentResult["status"]) => {
    switch (status) {
      case "Allotted":
        return <CheckCircle className="h-6 w-6 text-success" />;
      case "Not Allotted":
        return <XCircle className="h-6 w-6 text-destructive" />;
      case "Pending":
        return <Clock className="h-6 w-6 text-warning" />;
    }
  };

  const getStatusColor = (status: AllotmentResult["status"]) => {
    switch (status) {
      case "Allotted":
        return "bg-success/10 text-success border-success/20";
      case "Not Allotted":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Pending":
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Allotment Status
          </h1>
          <p className="text-muted-foreground mt-2">
            Check your IPO allotment status by PAN, Application Number, or DP ID
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Form Card */}
          <Card className="lg:col-span-1 shadow-lg border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="font-display flex items-center gap-2 text-xl">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                Check Status
              </CardTitle>
              <CardDescription>
                Enter your details to check allotment status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* IPO Select */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select IPO</Label>
                <Select value={selectedIPO} onValueChange={setSelectedIPO}>
                  <SelectTrigger className="h-11 bg-background">
                    <SelectValue placeholder="Choose an IPO" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {activeIPOs.map((ipo) => (
                      <SelectItem key={ipo.id} value={ipo.ipo_name}>
                        {ipo.ipo_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Type Selection - Modern Radio Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Search By</Label>
                <div className="grid grid-cols-1 gap-2">
                  {/* PAN Option */}
                  <button
                    type="button"
                    onClick={() => handleSearchTypeChange("pan")}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      searchType === "pan"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      searchType === "pan" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {searchType === "pan" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      searchType === "pan" ? "text-primary" : "text-foreground"
                    }`}>
                      PAN Number
                    </span>
                  </button>

                  {/* Application Number Option */}
                  <button
                    type="button"
                    onClick={() => handleSearchTypeChange("application")}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      searchType === "application"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      searchType === "application" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {searchType === "application" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      searchType === "application" ? "text-primary" : "text-foreground"
                    }`}>
                      Application No
                    </span>
                  </button>

                  {/* DP ID / Client ID Option */}
                  <button
                    type="button"
                    onClick={() => handleSearchTypeChange("dpid")}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      searchType === "dpid"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      searchType === "dpid" ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {searchType === "dpid" && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      searchType === "dpid" ? "text-primary" : "text-foreground"
                    }`}>
                      DP ID / Client ID
                    </span>
                  </button>
                </div>
              </div>

              {/* Conditional Input Fields */}
              <div className="space-y-4">
                {/* PAN Input */}
                {searchType === "pan" && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="panInput" className="text-sm font-medium">
                      Enter PAN Number
                    </Label>
                    <Input
                      id="panInput"
                      placeholder="e.g., ABCDE1234F"
                      value={panValue}
                      onChange={(e) => setPanValue(e.target.value.toUpperCase())}
                      maxLength={10}
                      className="h-11 bg-background uppercase"
                    />
                  </div>
                )}

                {/* Application Number Input */}
                {searchType === "application" && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="applicationInput" className="text-sm font-medium">
                      Enter Application Number
                    </Label>
                    <Input
                      id="applicationInput"
                      placeholder="e.g., 1234567890"
                      value={applicationValue}
                      onChange={(e) => setApplicationValue(e.target.value)}
                      maxLength={20}
                      className="h-11 bg-background"
                    />
                  </div>
                )}

                {/* DP ID & Client ID Inputs - TWO SEPARATE FIELDS */}
                {searchType === "dpid" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="space-y-2">
                      <Label htmlFor="dpIdInput" className="text-sm font-medium">
                        Enter DP ID
                      </Label>
                      <Input
                        id="dpIdInput"
                        placeholder="e.g., IN300123"
                        value={dpIdValue}
                        onChange={(e) => setDpIdValue(e.target.value.toUpperCase())}
                        maxLength={16}
                        className="h-11 bg-background uppercase"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientIdInput" className="text-sm font-medium">
                        Enter Client ID
                      </Label>
                      <Input
                        id="clientIdInput"
                        placeholder="e.g., 12345678"
                        value={clientIdValue}
                        onChange={(e) => setClientIdValue(e.target.value)}
                        maxLength={16}
                        className="h-11 bg-background"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="button"
                className="w-full h-11 font-medium" 
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Check Status"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          <div className="lg:col-span-2">
            {result ? (
              <Card className="animate-fade-in shadow-lg border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="font-display text-xl">{result.ipoName}</CardTitle>
                    <Badge variant="outline" className={`text-sm px-3 py-1 ${getStatusColor(result.status)}`}>
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Status Banner */}
                  <div className={`flex items-center gap-4 p-6 rounded-xl mb-6 ${
                    result.status === "Allotted" 
                      ? "bg-success/10 border border-success/20" 
                      : result.status === "Not Allotted"
                        ? "bg-destructive/10 border border-destructive/20"
                        : "bg-warning/10 border border-warning/20"
                  }`}>
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {result.status === "Allotted" && "Congratulations! Shares Allotted"}
                        {result.status === "Not Allotted" && "Sorry, No Shares Allotted"}
                        {result.status === "Pending" && "Allotment In Progress"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.status === "Allotted" && `You have been allotted ${result.sharesAllotted} shares`}
                        {result.status === "Not Allotted" && "Better luck next time!"}
                        {result.status === "Pending" && "Please check back later"}
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Application Number</p>
                      <p className="font-semibold text-foreground mt-1">{result.applicationNumber}</p>
                    </div>
                    <div className="p-4 border border-border rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">PAN</p>
                      <p className="font-semibold text-foreground mt-1">{result.pan}</p>
                    </div>
                    
                    {/* Show DP ID and Client ID if available */}
                    {result.dpId && (
                      <div className="p-4 border border-border rounded-xl bg-muted/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">DP ID</p>
                        <p className="font-semibold text-foreground mt-1">{result.dpId}</p>
                      </div>
                    )}
                    {result.clientId && (
                      <div className="p-4 border border-border rounded-xl bg-muted/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">Client ID</p>
                        <p className="font-semibold text-foreground mt-1">{result.clientId}</p>
                      </div>
                    )}
                    
                    <div className="p-4 border border-border rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Shares Applied</p>
                      <p className="font-semibold text-foreground mt-1">{result.sharesApplied}</p>
                    </div>
                    <div className="p-4 border border-border rounded-xl bg-muted/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Shares Allotted</p>
                      <p className="font-semibold text-foreground mt-1">{result.sharesAllotted}</p>
                    </div>
                  </div>

                  {/* Refund Info */}
                  {result.status === "Not Allotted" && result.refundAmount && result.refundAmount > 0 && (
                    <div className="mt-6 p-5 bg-accent/10 rounded-xl border border-accent/20">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Refund Amount</p>
                      <p className="text-2xl font-bold text-foreground mt-1">
                        ₹{result.refundAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Refund will be credited to your bank account within 4-6 working days
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center p-12 shadow-lg border-border/50">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                    <FileText className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    No Search Results
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    Select an IPO and enter your PAN, Application Number, or DP ID to check your allotment status
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
 