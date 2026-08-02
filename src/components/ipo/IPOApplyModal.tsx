import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  CreditCard, 
  Minus, 
  Plus, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useIPOBids } from "@/hooks/useIPOBids";
import { IPO } from "@/hooks/useIPOs";
import { useIPOLotValidation, calculateIPOLotRules } from "@/hooks/useIPOLotValidation";

interface IPOApplyModalProps {
  ipo: IPO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type ModalView = "LOGIN" | "SIGNUP" | "APPLICATION" | "SUCCESS";

export const IPOApplyModal: React.FC<IPOApplyModalProps> = ({
  ipo,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { submitBid } = useIPOBids();

  // Internal modal view state
  const [currentView, setCurrentView] = useState<ModalView>("LOGIN");

  // Login / Signup Form State
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  // Application Form State
  const [investorType, setInvestorType] = useState<"Retail" | "HNI">("Retail");
  const [numberOfLots, setNumberOfLots] = useState<number>(1);
  const [bidPrice, setBidPrice] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("user@okhdfcbank");
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [dpId, setDpId] = useState("1208160012345678");
  const [showPayableDetails, setShowPayableDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Dynamic LOT Validation Hook tailored for Mainboard vs SME
  const lotRules = useIPOLotValidation(ipo, investorType);

  // Success Screen Data
  const [applicationResult, setApplicationResult] = useState<{
    applicationNumber: string;
    lots: number;
    shares: number;
    amount: number;
    upi: string;
  } | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Synchronize Auth state with current view when modal opens or user logs in
  useEffect(() => {
    if (isOpen && ipo) {
      if (user) {
        setCurrentView("APPLICATION");
      } else {
        setCurrentView("LOGIN");
      }

      const defaultUpperPrice = ipo.price_band.includes("-")
        ? ipo.price_band.split("-")[1].trim()
        : ipo.price_band.replace(/[^0-9.]/g, "");
      setBidPrice(defaultUpperPrice);
      setInvestorType("Retail");
      setNumberOfLots(1);
      setIsEditingUpi(false);
      setShowPayableDetails(false);

      if (user?.email) {
        const prefix = user.email.split("@")[0];
        setUpiId(`${prefix}@okhdfcbank`);
      } else {
        setUpiId("shilpeshkrupali-2@okhdfcbank");
      }
    }
  }, [isOpen, ipo, user]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard trap & ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !ipo) return null;

  // Calculation helpers
  const totalShares = numberOfLots * lotRules.lotSize;
  const totalPayableAmount = totalShares * lotRules.upperPrice;

  // CENTRALIZED STRICT LOT VALIDATOR WITH SHAKE & CLAMPING
  const attemptSetLots = (targetValue: number) => {
    if (targetValue > lotRules.maxLots) {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      // Clamp back to maxLots
      setNumberOfLots(lotRules.maxLots);

      toast({
        title: `Maximum ${investorType} limit reached`,
        description: lotRules.isSME
          ? `SME ${investorType} applications are limited to ${lotRules.maxLots} ${lotRules.maxLots === 1 ? 'lot' : 'lots'}.`
          : `Retail applications are limited to ${lotRules.maxLots} lots (₹2 lakh SEBI limit). Switch to HNI for more lots.`,
        variant: "destructive",
      });
      return;
    }

    if (targetValue < lotRules.minLots) {
      // Trigger shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);

      // Clamp back to minLots
      setNumberOfLots(lotRules.minLots);

      toast({
        title: `Minimum ${investorType} limit required`,
        description: `${investorType} applications require at least ${lotRules.minLots} ${lotRules.minLots === 1 ? 'lot' : 'lots'}.`,
        variant: "destructive",
      });
      return;
    }

    setNumberOfLots(targetValue);
  };

  // AUTO INVESTOR TYPE SWITCHING (Retail <-> HNI)
  const handleInvestorTypeSwitch = (newType: "Retail" | "HNI") => {
    if (newType === investorType) return;

    const futureRules = calculateIPOLotRules(ipo, newType);
    setInvestorType(newType);

    if (newType === "HNI") {
      // Retail -> HNI: Automatically adjust to HNI minimum
      const adjusted = Math.max(numberOfLots, futureRules.hniMinLots);
      setNumberOfLots(adjusted);
      toast({
        title: "Category Switched to HNI",
        description: `Quantity adjusted to HNI minimum (${futureRules.hniMinLots} lots).`,
      });
    } else {
      // HNI -> Retail: If quantity exceeds Retail max, adjust to Retail max
      if (numberOfLots > futureRules.retailMaxLots) {
        setNumberOfLots(futureRules.retailMaxLots);
        toast({
          title: "Category Switched to Retail",
          description: `Quantity adjusted to Retail maximum (${futureRules.retailMaxLots} lots).`,
        });
      }
    }
  };

  // Handle Login inside modal
  const handleModalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast({ title: "Error", description: "Please enter email and password", variant: "destructive" });
      return;
    }
    setAuthLoading(true);
    try {
      await signIn(authEmail, authPassword);
      toast({ title: "Welcome!", description: "Signed in successfully. Proceeding with application." });
      setCurrentView("APPLICATION");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Signup inside modal
  const handleModalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authName) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setAuthLoading(true);
    try {
      await signUp(authEmail, authPassword, authName, authPhone);
      toast({ title: "Account Created!", description: "Proceeding to IPO Application." });
      setCurrentView("APPLICATION");
    } catch (err: any) {
      toast({ title: "Signup Failed", description: err.message || "Could not create account", variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle IPO Bid Submission
  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim()) {
      toast({ title: "UPI ID Required", description: "Please enter your UPI ID.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBid({
        ipo_id: ipo.id,
        investor_type: investorType,
        number_of_lots: numberOfLots,
        bid_price: lotRules.upperPrice,
        total_investment: totalPayableAmount,
        pan_number: panNumber,
        dp_id: dpId,
      });

      const generatedAppNo = "APP-" + Math.floor(100000 + Math.random() * 900000);
      setApplicationResult({
        applicationNumber: generatedAppNo,
        lots: numberOfLots,
        shares: totalShares,
        amount: totalPayableAmount,
        upi: upiId,
      });

      setCurrentView("SUCCESS");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast({ title: "Submission Error", description: err.message || "Failed to submit bid", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* BLURRED DARK BACKDROP OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* CENTERED POPUP MODAL */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white dark:bg-card text-foreground rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-border/60 z-10 my-auto"
        >
          {/* TOP CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* VIEW SWITCHER CONTENT WITH SMOOTH FRAMER MOTION TRANSITION */}
          <AnimatePresence mode="wait">
            {/* ── 1. IN-MODAL LOGIN VIEW ────────────────────────────────────────── */}
            {currentView === "LOGIN" && (
              <motion.div
                key="login-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-[#163A7D]/10 text-[#163A7D] flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Sign In to Apply</h2>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Please log in to apply for <span className="font-semibold text-foreground">{ipo.ipo_name}</span>
                  </p>
                </div>

                <form onSubmit={handleModalLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email / Mobile Number</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-[#163A7D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-foreground">Password</label>
                      <button
                        type="button"
                        onClick={() => toast({ title: "Reset Password", description: "Password reset link sent to email." })}
                        className="text-[#163A7D] hover:underline font-medium"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-[#163A7D] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-input text-[#163A7D] focus:ring-[#163A7D]"
                      />
                      <span>Remember Me</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-[#163A7D] to-[#1e4ca5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {authLoading ? "Signing in..." : "Sign In & Continue Application"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="text-center text-xs text-muted-foreground border-t pt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentView("SIGNUP")}
                    className="text-[#163A7D] font-bold hover:underline"
                  >
                    Sign Up Now
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── 2. IN-MODAL SIGNUP VIEW ────────────────────────────────────────── */}
            {currentView === "SIGNUP" && (
              <motion.div
                key="signup-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8 space-y-6"
              >
                <div className="text-center space-y-2">
                  <h2 className="font-display text-2xl font-bold text-foreground">Create Account</h2>
                  <p className="text-sm text-muted-foreground">Quick sign up to bid for {ipo.ipo_name}</p>
                </div>

                <form onSubmit={handleModalSignup} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#163A7D] to-[#1e4ca5] text-white font-bold text-sm shadow-md transition-all mt-2"
                  >
                    {authLoading ? "Creating Account..." : "Create Account & Apply"}
                  </button>
                </form>

                <div className="text-center text-xs text-muted-foreground border-t pt-3">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentView("LOGIN")}
                    className="text-[#163A7D] font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── 3. IPO APPLICATION MODAL VIEW (MAINBOARD vs SME DYNAMIC FLOW) ────── */}
            {currentView === "APPLICATION" && (
              <motion.div
                key="application-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-0"
              >
                {/* POPUP MODAL HEADER */}
                <div className="p-5 sm:p-6 pb-4 border-b border-border/50 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap pr-8">
                    <h2 className="text-xl font-bold text-foreground tracking-tight">
                      {ipo.ipo_name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      lotRules.isSME
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                    }`}>
                      {lotRules.boardType}
                    </span>
                    {ipo.gmp && ipo.gmp > 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                        GMP: +₹{ipo.gmp}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    Price Band: ₹{ipo.price_band.includes("-") ? ipo.price_band : `${ipo.price_band} - ${ipo.price_band}`} • Lot Size: {lotRules.lotSize} shares
                  </p>
                </div>

                <form onSubmit={handleApplicationSubmit} className="p-5 sm:p-6 space-y-5">
                  {/* INVESTOR TYPE SELECTOR WITH AUTO CLAMPING */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      Investor Type
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleInvestorTypeSwitch("Retail")}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all border ${
                          investorType === "Retail"
                            ? "border-[#163A7D] text-[#163A7D] bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-[#163A7D]"
                            : "border-border text-foreground hover:bg-muted/50"
                        }`}
                      >
                        Retail ({lotRules.isSME && lotRules.retailMaxLots === 1 ? "1 Lot" : `Max ${lotRules.retailMaxLots} Lots`})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInvestorTypeSwitch("HNI")}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all border ${
                          investorType === "HNI"
                            ? "border-[#163A7D] text-[#163A7D] bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-[#163A7D]"
                            : "border-border text-foreground hover:bg-muted/50"
                        }`}
                      >
                        HNI ({lotRules.hniMinLots}–{lotRules.hniMaxLots} Lots)
                      </button>
                    </div>
                  </div>

                  {/* LOTS & BID PRICE (2 COLUMN LAYOUT WITH STRICT CLAMPING & SHAKE) */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Number Of Lots with +/- Controls & Shake animation */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Number Of Lots
                      </label>
                      <motion.div
                        animate={{ x: isShaking ? [-6, 6, -6, 6, 0] : 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-center border rounded-xl bg-background overflow-hidden h-11 transition-colors ${
                          isShaking ? "border-rose-500 ring-2 ring-rose-200" : "border-input"
                        }`}
                      >
                        {/* MINUS BUTTON */}
                        <button
                          type="button"
                          disabled={numberOfLots <= lotRules.minLots}
                          onClick={() => attemptSetLots(numberOfLots - 1)}
                          className="px-3 h-full flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        {/* NUMERIC INPUT WITH STRICT PASTE / WHEEL / TYPING ENFORCEMENT */}
                        <input
                          type="number"
                          min={lotRules.minLots}
                          max={lotRules.maxLots}
                          value={numberOfLots}
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp") {
                              e.preventDefault();
                              attemptSetLots(numberOfLots + 1);
                            } else if (e.key === "ArrowDown") {
                              e.preventDefault();
                              attemptSetLots(numberOfLots - 1);
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            const pasted = parseInt(e.clipboardData.getData("text") || "1", 10);
                            if (!isNaN(pasted)) attemptSetLots(pasted);
                          }}
                          onChange={(e) => {
                            const val = parseInt(e.target.value || String(lotRules.minLots), 10);
                            if (!isNaN(val)) attemptSetLots(val);
                          }}
                          className="w-full text-center font-bold text-base focus:outline-none bg-transparent"
                        />

                        {/* PLUS BUTTON (DISABLED AT MAX LOTS) */}
                        <button
                          type="button"
                          disabled={numberOfLots >= lotRules.maxLots}
                          onClick={() => attemptSetLots(numberOfLots + 1)}
                          className={`px-3 h-full flex items-center justify-center transition-colors ${
                            numberOfLots >= lotRules.maxLots
                              ? "opacity-40 cursor-not-allowed bg-muted/60 text-muted-foreground"
                              : "hover:bg-muted text-foreground"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </motion.div>

                      <p className="text-[11px] text-muted-foreground font-medium">
                        {numberOfLots} {numberOfLots === 1 ? "lot" : "lots"}: {totalShares} shares
                      </p>
                    </div>

                    {/* Bid Price Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        Bid Price (Cut-off)
                      </label>
                      <input
                        type="number"
                        readOnly
                        value={lotRules.upperPrice}
                        className="w-full h-11 px-3 rounded-xl border border-input bg-muted/30 font-bold text-base text-foreground focus:outline-none"
                      />
                      <p className="text-[11px] text-emerald-600 font-semibold">Cut-off Price Applied</p>
                    </div>
                  </div>

                  {/* DYNAMIC HELPER TEXT tailored for Mainboard vs SME */}
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-start gap-1.5 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/50">
                    <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{lotRules.helperText}</span>
                  </p>

                  {/* QUICK LOT PRESETS (DYNAMICALLY TAILORED) */}
                  <div className="flex flex-wrap gap-1.5 items-center text-xs">
                    <span className="text-muted-foreground text-[11px] font-medium mr-1">Quick Presets:</span>
                    {lotRules.quickPresets.map((lots) => (
                      <button
                        key={lots}
                        type="button"
                        onClick={() => attemptSetLots(lots)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                          numberOfLots === lots
                            ? "bg-[#163A7D] text-white"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        {lots === lotRules.maxLots ? `${lots} (Max)` : `${lots} ${lots === 1 ? "Lot" : "Lots"}`}
                      </button>
                    ))}
                  </div>

                  {/* UPI ID CARD CONTAINER */}
                  <div className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        UPI
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                          UPI ID for Payment Mandate
                        </span>
                        {!isEditingUpi ? (
                          <span className="text-sm font-bold font-mono text-foreground">{upiId}</span>
                        ) : (
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="h-8 px-2 text-xs font-mono border rounded-lg bg-background w-48"
                            autoFocus
                          />
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingUpi(!isEditingUpi)}
                      className="text-xs font-bold text-[#163A7D] hover:underline uppercase"
                    >
                      {isEditingUpi ? "SAVE" : "EDIT"}
                    </button>
                  </div>

                  {/* TOTAL PAYABLE AMOUNT & BREAKDOWN */}
                  <div className="pt-2 border-t border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowPayableDetails(!showPayableDetails)}
                        className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <span>Total Payable Amount</span>
                        {showPayableDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                      <span className="text-2xl font-extrabold text-foreground tracking-tight">
                        ₹{totalPayableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {showPayableDetails && (
                      <div className="p-3 rounded-xl bg-muted/40 text-xs space-y-1 border border-border">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total Shares ({numberOfLots} lots × {lotRules.lotSize})</span>
                          <span className="font-semibold text-foreground">{totalShares} shares</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Bid Price per share</span>
                          <span className="font-semibold text-foreground">₹{lotRules.upperPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1 text-foreground">
                          <span>Investment Amount</span>
                          <span>₹{totalPayableAmount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    {/* ACTIONS: APPLY & CANCEL */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 h-12 rounded-xl border border-border font-semibold text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#163A7D] to-[#1e4ca5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {isSubmitting ? "Placing Application..." : "APPLY FOR IPO"}
                      </button>
                    </div>

                    <p className="text-center text-[11px] text-muted-foreground pt-1">
                      By applying, you accept the{" "}
                      <a href="#" className="text-[#163A7D] font-semibold hover:underline">
                        Terms and Conditions
                      </a>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── 4. SUCCESS VIEW WITH PREMIUM FINTECH ANIMATION ───────────────── */}
            {currentView === "SUCCESS" && applicationResult && (
              <motion.div
                key="success-view"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 text-center space-y-6"
              >
                <div className="space-y-3">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="h-10 w-10 animate-pulse" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">IPO Applied Successfully!</h2>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    Your bid has been recorded. Please approve the UPI mandate sent to{" "}
                    <span className="font-semibold text-foreground font-mono">{applicationResult.upi}</span>
                  </p>
                </div>

                {/* SUMMARY DETAILS CARD */}
                <div className="p-4 rounded-2xl bg-card border border-border space-y-2.5 text-xs text-left shadow-xs">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground font-medium">Application Number</span>
                    <span className="font-bold font-mono text-sm text-[#163A7D]">{applicationResult.applicationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">IPO Name</span>
                    <span className="font-bold text-foreground">{ipo.ipo_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Applied Lots</span>
                    <span className="font-bold text-foreground">{applicationResult.lots} Lots ({applicationResult.shares} shares)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Investment Amount</span>
                    <span className="font-bold text-emerald-600 text-sm">₹{applicationResult.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-[#163A7D] to-[#1e4ca5] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Done & Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
