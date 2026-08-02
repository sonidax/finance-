import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp, Filter, Building } from "lucide-react";
import { useMutualFunds } from "@/hooks/useMutualFunds";

const categories = ["All", "Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "Sectoral"];

export default function MutualFunds() {
  const { funds } = useMutualFunds();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFundHouse, setSelectedFundHouse] = useState("All");

  // Normalize snake_case API fields to the shape this page's UI expects
  const mutualFundsData = funds.map(f => ({
    id: f.id,
    name: f.fund_name,
    category: f.category,
    nav: f.nav,
    aum: f.aum,
    returns1Y: f.returns_1y,
    returns3Y: f.returns_3y,
    fundHouse: f.fund_house || "Mutual Fund House",
  }));

  const fundHouses = ["All", ...Array.from(new Set(mutualFundsData.map(f => f.fundHouse)))];

  const filteredFunds = mutualFundsData.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || fund.category === selectedCategory;
    const matchesFundHouse = selectedFundHouse === "All" || fund.fundHouse === selectedFundHouse;
    return matchesSearch && matchesCategory && matchesFundHouse;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Large Cap":
        return "bg-primary/10 text-primary border-primary/20";
      case "Mid Cap":
        return "bg-accent/10 text-accent border-accent/20";
      case "Small Cap":
        return "bg-success/10 text-success border-success/20";
      case "Flexi Cap":
        return "bg-warning/10 text-warning border-warning/20";
      case "Sectoral":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const avgReturn = mutualFundsData.length 
    ? (mutualFundsData.reduce((acc, f) => acc + (f.returns1Y || 0), 0) / mutualFundsData.length).toFixed(1)
    : "0.0";

  return (
    <Layout>
      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Mutual Funds
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore and compare top-performing mutual funds across categories
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Funds</p>
              <p className="text-2xl font-bold text-foreground">{mutualFundsData.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground">{categories.length - 1}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Fund Houses</p>
              <p className="text-2xl font-bold text-foreground">{Math.max(fundHouses.length - 1, 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg 1Y Return</p>
              <p className="text-2xl font-bold text-success">
                +{avgReturn}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search funds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedFundHouse} onValueChange={setSelectedFundHouse}>
                <SelectTrigger className="w-full md:w-48">
                  <Building className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Fund House" />
                </SelectTrigger>
                <SelectContent>
                  {fundHouses.map(house => (
                    <SelectItem key={house} value={house}>{house}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Funds Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Fund Performance
            </CardTitle>
            <CardDescription>
              Showing {filteredFunds.length} of {mutualFundsData.length} funds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">NAV</TableHead>
                    <TableHead className="text-right">AUM</TableHead>
                    <TableHead className="text-right">1Y Returns</TableHead>
                    <TableHead className="text-right">3Y Returns</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFunds.map((fund) => (
                    <TableRow key={fund.id} className="hover:bg-muted/50 cursor-pointer">
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{fund.name}</p>
                          <p className="text-xs text-muted-foreground">{fund.fundHouse}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getCategoryColor(fund.category)}>
                          {fund.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{fund.nav.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">₹{fund.aum}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-success">+{fund.returns1Y}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-accent">+{fund.returns3Y}%</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredFunds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No funds found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
