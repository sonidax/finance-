import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  FileText, 
  BarChart3, 
  Wallet,
  ArrowRight,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIPOs, useGMPData } from "@/hooks/useIPOs";

const features = [
  {
    icon: FileText,
    title: "IPO Bidding",
    description: "Apply for latest IPOs with real-time updates and seamless bidding process.",
    link: "/ipo-bidding",
  },
  {
    icon: BarChart3,
    title: "Grey Market Premium",
    description: "Track GMP trends to make informed investment decisions.",
    link: "/gmp",
  },
  {
    icon: TrendingUp,
    title: "Subscription Ratios",
    description: "Monitor live subscription data across all investor categories.",
    link: "/subscription-ratio",
  },
  {
    icon: Wallet,
    title: "Mutual Funds",
    description: "Explore and invest in top-performing mutual funds.",
    link: "/mutual-funds",
  },
];

const stats = [
  { label: "Active IPOs", value: "12+", icon: FileText },
  { label: "Registered Users", value: "50K+", icon: Users },
  { label: "Years Experience", value: "15+", icon: Clock },
  { label: "Success Rate", value: "99.9%", icon: Shield },
];

export default function Index() {
  const { ipos } = useIPOs();
  const { gmpData } = useGMPData();
  const openIPOs = ipos.filter((ipo) => ipo.status === "Open").slice(0, 3);
  const topGMP = gmpData.filter((g) => g.current_gmp > 0).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-28 particles-bg">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse-soft" />
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
        
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 opacity-0 animate-fade-in-down backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-accent animate-pulse-soft" />
              <span className="text-sm font-medium text-primary-foreground">Trusted by 50,000+ Investors</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 opacity-0 animate-fade-in-up">
              Your Gateway to
              <span className="block mt-2 text-gradient bg-gradient-to-r from-primary-foreground via-accent to-primary-foreground bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                Smart Investments
              </span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 opacity-0 animate-fade-in-up stagger-2 leading-relaxed">
              Apply for IPOs, track GMP, monitor mutual funds, and invest in gold bonds — 
              all in one platform. Start your investment journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up stagger-3">
              <Button size="xl" variant="secondary" className="btn-shine group" asChild>
                <Link to="/ipo-bidding">
                  Explore IPOs
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="xl" 
                variant="ghost" 
                className="border border-primary-foreground/30 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/15 backdrop-blur-sm transition-all duration-300 hover:border-primary-foreground/50" 
                asChild
              >
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5" />
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`text-center opacity-0 animate-scale-in stagger-${index + 1} group`}
              >
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-accent/10 mb-3 transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110">
                  <stat.icon className="h-6 w-6 text-accent transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-50" />
        <div className="container relative">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-up">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-1">
              Comprehensive financial services platform for all your investment needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link} className="group">
                <Card 
                  className={`h-full card-hover border-border hover:border-accent/50 cursor-pointer opacity-0 animate-fade-in-up stagger-${index + 1} relative overflow-hidden`}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-all duration-500" />
                  
                  <CardHeader className="relative">
                    <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110 group-hover:rotate-3">
                      <feature.icon className="h-7 w-7 text-accent transition-all duration-300 group-hover:scale-110" />
                    </div>
                    <CardTitle className="font-display text-lg group-hover:text-accent transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Active IPOs Section */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div className="opacity-0 animate-slide-in-left">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Open IPOs
              </h2>
              <p className="text-muted-foreground mt-2">Don't miss out on current opportunities</p>
            </div>
            <Button variant="outline" className="opacity-0 animate-slide-in-right group hover:border-accent" asChild>
              <Link to="/ipo-bidding">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {openIPOs.map((ipo, index) => (
              <Card 
                key={ipo.id} 
                className={`card-hover opacity-0 animate-fade-in-up stagger-${index + 1} group relative overflow-hidden`}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-success/10 text-success border border-success/20 animate-pulse-soft">
                      {ipo.status}
                    </span>
                    <span className={`text-sm font-bold ${ipo.gmp >= 0 ? 'text-success' : 'text-destructive'}`}>
                      GMP: ₹{ipo.gmp}
                    </span>
                  </div>
                  <CardTitle className="font-display text-lg mt-3 group-hover:text-accent transition-colors duration-300">{ipo.ipo_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Price Band</span>
                    <span className="font-semibold">₹{ipo.price_band}</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Lot Size</span>
                    <span className="font-semibold">{ipo.lot_size} shares</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-muted-foreground">Issue Size</span>
                    <span className="font-semibold">₹{ipo.issue_size}</span>
                  </div>
                  <Button className="w-full mt-2 btn-shine group/btn" asChild>
                    <Link to="/ipo-bidding">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GMP Highlights */}
      <section className="py-20 bg-card relative">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div className="opacity-0 animate-slide-in-left">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                Top GMP Movers
              </h2>
              <p className="text-muted-foreground mt-2">Grey market premium indicators</p>
            </div>
            <Button variant="outline" className="opacity-0 animate-slide-in-right group hover:border-accent" asChild>
              <Link to="/gmp">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topGMP.map((item, index) => (
              <Card 
                key={item.id} 
                className={`card-hover opacity-0 animate-fade-in-up stagger-${index + 1} group border-border hover:border-success/30`}
              >
                <CardContent className="pt-6">
                  <h3 className="font-display font-semibold text-foreground truncate group-hover:text-accent transition-colors duration-300">
                    {item.ipo_name}
                  </h3>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">GMP</p>
                      <p className="text-3xl font-bold text-success">₹{item.current_gmp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Expected</p>
                      <p className="text-xl font-semibold text-foreground">₹{item.expected_listing}</p>
                    </div>
                  </div>
                  {/* Progress indicator */}
                  <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-success to-accent rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min((item.current_gmp / 200) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="container relative">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 opacity-0 animate-fade-in-up">
              Why Choose DM Services?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-1">
              Trusted by thousands of investors across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "SEBI Registered",
                description: "Fully compliant with SEBI regulations for your safety and security.",
              },
              {
                title: "Real-time Updates",
                description: "Get instant notifications on IPO allotments, GMP changes, and more.",
              },
              {
                title: "Expert Support",
                description: "Dedicated support team to assist you with all your investment queries.",
              },
            ].map((item, index) => (
              <div 
                key={item.title} 
                className={`flex gap-5 opacity-0 animate-fade-in-up stagger-${index + 1} group`}
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center transition-all duration-500 group-hover:bg-accent/20 group-hover:scale-110">
                  <CheckCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-2 text-lg group-hover:text-accent transition-colors duration-300">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero relative overflow-hidden particles-bg">
        {/* Animated orbs */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl animate-float-slow" />
        
        <div className="container text-center relative">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4 opacity-0 animate-fade-in-up">
            Ready to Start Investing?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-1">
            Join thousands of investors who trust DM Services for their financial needs.
          </p>
          <Button size="xl" variant="secondary" className="btn-shine group opacity-0 animate-scale-in stagger-2" asChild>
            <Link to="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}