import { useMemo } from "react";
import { IPO } from "./useIPOs";

export interface IPOLotRules {
  isSME: boolean;
  boardType: "MAINBOARD" | "SME";
  lotSize: number;
  upperPrice: number;
  lotCost: number;
  retailMinLots: number;
  retailMaxLots: number;
  hniMinLots: number;
  hniMaxLots: number;
  minLots: number;
  maxLots: number;
  helperText: string;
  quickPresets: number[];
}

/**
 * Robustly parses upper price band from any string format (e.g., "₹1,860 - ₹1,960", "1860 - 1960", "₹1960", 1960)
 */
export function parseUpperPrice(priceBand?: string | number): number {
  if (typeof priceBand === "number") {
    return isNaN(priceBand) || priceBand <= 0 ? 100 : priceBand;
  }
  if (!priceBand) return 100;

  let str = String(priceBand);
  if (str.includes("-")) {
    const parts = str.split("-");
    str = parts[parts.length - 1]; // upper band
  }

  // Strip all non-numeric characters except dots
  const clean = str.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(clean);

  return isNaN(parsed) || parsed <= 0 ? 100 : parsed;
}

export function calculateIPOLotRules(ipo: IPO | null, investorType: "Retail" | "HNI"): IPOLotRules {
  const safeDefaults: IPOLotRules = {
    isSME: false,
    boardType: "MAINBOARD",
    lotSize: 1,
    upperPrice: 100,
    lotCost: 100,
    retailMinLots: 1,
    retailMaxLots: 13,
    hniMinLots: 14,
    hniMaxLots: 34,
    minLots: 1,
    maxLots: 13,
    helperText: "Retail applications are limited to 13 lots.",
    quickPresets: [1, 2, 5, 10, 13],
  };

  if (!ipo) return safeDefaults;

  try {
    const isSME = (ipo.boardtype || (ipo as any).ipoType || "").toString().toLowerCase() === "sme";
    const boardType: "MAINBOARD" | "SME" = isSME ? "SME" : "MAINBOARD";

    // Safe field extraction with fallbacks
    const upperPrice = parseUpperPrice((ipo as any).upperPrice ?? ipo.price_band);
    const lotSize = Math.max(1, parseInt(String((ipo as any).lotSize ?? ipo.lot_size ?? 1), 10) || 1);
    const lotCost = upperPrice * lotSize;

    const SEBI_RETAIL_CAP = 200000;

    // Check optional metadata overrides on ipo object
    const customRetail = (ipo as any).retail;
    const customHni = (ipo as any).hni;

    if (isSME) {
      // ── SME IPO RULES ──
      const retailMinLots = customRetail?.minLots ?? 1;
      const calculatedMax = lotCost > 0 ? Math.max(1, Math.floor(SEBI_RETAIL_CAP / lotCost)) : 1;
      const retailMaxLots = customRetail?.maxLots ?? calculatedMax;

      const hniMinLots = customHni?.minLots ?? (retailMaxLots + 1 > 1 ? 2 : 2);
      const hniMaxLots = customHni?.maxLots ?? 10;

      if (investorType === "Retail") {
        const minLots = retailMinLots;
        const maxLots = Math.max(minLots, retailMaxLots);
        const helperText = maxLots === 1
          ? `Retail investors can apply for only 1 lot (₹${lotCost.toLocaleString("en-IN")}) in this SME IPO.`
          : `Retail applications are limited to ${maxLots} lots (₹2 lakh limit).`;

        const quickPresets: number[] = [];
        for (let i = minLots; i <= maxLots; i++) quickPresets.push(i);
        if (quickPresets.length === 0) quickPresets.push(1);

        return {
          isSME: true,
          boardType: "SME",
          lotSize,
          upperPrice,
          lotCost,
          retailMinLots,
          retailMaxLots: maxLots,
          hniMinLots,
          hniMaxLots,
          minLots,
          maxLots,
          helperText,
          quickPresets,
        };
      } else {
        // SME HNI
        const minLots = hniMinLots;
        const maxLots = Math.max(minLots, hniMaxLots);
        const helperText = `SME HNI applications require between ${minLots} and ${maxLots} lots.`;
        
        const presets = [minLots, Math.floor((minLots + maxLots) / 2), maxLots]
          .filter((v, i, a) => a.indexOf(v) === i && v >= minLots && v <= maxLots);

        return {
          isSME: true,
          boardType: "SME",
          lotSize,
          upperPrice,
          lotCost,
          retailMinLots,
          retailMaxLots,
          hniMinLots: minLots,
          hniMaxLots: maxLots,
          minLots,
          maxLots,
          helperText,
          quickPresets: presets.length > 0 ? presets : [2, 5, 8, 10],
        };
      }
    } else {
      // ── MAINBOARD IPO RULES ──
      const retailMinLots = customRetail?.minLots ?? 1;
      const calculatedMax = lotCost > 0 ? Math.max(1, Math.floor(SEBI_RETAIL_CAP / lotCost)) : 13;
      const retailMaxLots = customRetail?.maxLots ?? calculatedMax;

      const hniMinLots = customHni?.minLots ?? (retailMaxLots + 1);
      const hniMaxLots = customHni?.maxLots ?? Math.min(100, Math.max(hniMinLots + 10, Math.floor(hniMinLots * 2.5)));

      if (investorType === "Retail") {
        const minLots = retailMinLots;
        const maxLots = Math.max(minLots, retailMaxLots);
        const helperText = `Retail applications are limited to ${maxLots} lots (₹2 lakh SEBI limit). Select HNI for larger applications.`;

        const quickPresets = [1, 2, 5, 10, maxLots]
          .filter((val, idx, arr) => arr.indexOf(val) === idx && val <= maxLots && val >= minLots);

        return {
          isSME: false,
          boardType: "MAINBOARD",
          lotSize,
          upperPrice,
          lotCost,
          retailMinLots,
          retailMaxLots: maxLots,
          hniMinLots,
          hniMaxLots,
          minLots,
          maxLots,
          helperText,
          quickPresets: quickPresets.length > 0 ? quickPresets : [1],
        };
      } else {
        // Mainboard HNI
        const minLots = hniMinLots;
        const maxLots = Math.max(minLots, hniMaxLots);
        const helperText = `HNI applications start from ${minLots} lots up to ${maxLots} lots.`;

        const step = Math.max(1, Math.floor((maxLots - minLots) / 4));
        const quickPresets = [
          minLots,
          minLots + step,
          minLots + step * 2,
          minLots + step * 3,
          maxLots
        ].filter((val, idx, arr) => arr.indexOf(val) === idx && val <= maxLots && val >= minLots);

        return {
          isSME: false,
          boardType: "MAINBOARD",
          lotSize,
          upperPrice,
          lotCost,
          retailMinLots,
          retailMaxLots,
          hniMinLots: minLots,
          hniMaxLots: maxLots,
          minLots,
          maxLots,
          helperText,
          quickPresets: quickPresets.length > 0 ? quickPresets : [minLots, maxLots],
        };
      }
    }
  } catch (err) {
    console.error("Error in calculateIPOLotRules:", err);
    return safeDefaults;
  }
}

export function useIPOLotValidation(ipo: IPO | null, investorType: "Retail" | "HNI") {
  return useMemo(() => calculateIPOLotRules(ipo, investorType), [ipo, investorType]);
}
