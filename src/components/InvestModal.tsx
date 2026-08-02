import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

// Product type for investment
export interface InvestProduct {
  id: string | number;
  name: string;
  type: "etf" | "bond";
  price: number;
  minInvestment?: number;
  maxInvestment?: number;
}

interface InvestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InvestProduct | null;
}

// Reusable investment modal component
export function InvestModal({ open, onOpenChange, product }: InvestModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setAmount("");
      setError("");
      setIsLoading(false);
      setIsSuccess(false);
    }
    onOpenChange(newOpen);
  };

  // Validate the investment amount
  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    
    if (!value.trim()) {
      setError("Please enter an amount");
      return false;
    }
    
    if (isNaN(numValue) || numValue <= 0) {
      setError("Please enter a valid positive amount");
      return false;
    }

    if (product?.minInvestment && numValue < product.minInvestment) {
      setError(`Minimum investment is ₹${product.minInvestment.toLocaleString('en-IN')}`);
      return false;
    }

    if (product?.maxInvestment && numValue > product.maxInvestment) {
      setError(`Maximum investment is ₹${product.maxInvestment.toLocaleString('en-IN')}`);
      return false;
    }

    setError("");
    return true;
  };

  // Simulate API call for investment
  const handleConfirm = async () => {
    if (!validateAmount(amount)) return;

    setIsLoading(true);
    
    // Mock API call - replace this with real API integration later
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);

    // Show success toast
    toast({
      title: "Investment Successful!",
      description: `Your investment in ${product?.name} of ₹${parseFloat(amount).toLocaleString('en-IN')} has been placed successfully.`,
    });

    // Close modal after showing success
    setTimeout(() => {
      handleOpenChange(false);
    }, 2000);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    if (error) setError(""); // Clear error on input change
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          // Success state
          <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Investment Placed!
            </h3>
            <p className="text-muted-foreground">
              ₹{parseFloat(amount).toLocaleString('en-IN')} invested in {product.name}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Invest in {product.name}
              </DialogTitle>
              <DialogDescription>
                {product.type === "etf" 
                  ? "Enter the amount you want to invest in this ETF"
                  : "Enter the amount you want to invest in this bond"
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Current Price Display */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {product.type === "etf" ? "Current NAV" : "Issue Price"}
                  </span>
                  <span className="text-lg font-bold text-foreground">
                    ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    {product.type === "bond" && <span className="text-sm font-normal">/gm</span>}
                  </span>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className={error ? "border-destructive" : ""}
                  min="0"
                  step="100"
                />
                {error && (
                  <p className="text-sm text-destructive animate-fade-in">{error}</p>
                )}
                {product.minInvestment && (
                  <p className="text-xs text-muted-foreground">
                    Min: ₹{product.minInvestment.toLocaleString('en-IN')} | 
                    {product.maxInvestment 
                      ? ` Max: ₹${product.maxInvestment.toLocaleString('en-IN')}`
                      : " No maximum limit"
                    }
                  </p>
                )}
              </div>

              {/* Estimated Units (for ETFs) */}
              {product.type === "etf" && amount && parseFloat(amount) > 0 && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 animate-fade-in">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated Units</span>
                    <span className="font-semibold text-foreground">
                      ~{(parseFloat(amount) / product.price).toFixed(4)} units
                    </span>
                  </div>
                </div>
              )}

              {/* Estimated Grams (for Bonds) */}
              {product.type === "bond" && amount && parseFloat(amount) > 0 && (
                <div className="p-3 bg-warning/10 rounded-lg border border-warning/20 animate-fade-in">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated Gold</span>
                    <span className="font-semibold text-foreground">
                      ~{(parseFloat(amount) / product.price).toFixed(4)} grams
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isLoading || !amount}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Investment"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
