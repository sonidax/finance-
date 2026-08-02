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

export function calculateIPOLotRules(ipo: IPO | null, investorType: "Retail" | "HNI"): IPOLotRules {
  if (!ipo) {
    return {
      isSME: false,
      boardType: "MAINBOARD",
      lotSize: 1,
      upperPrice: 0,
      lotCost: 0,
      retailMinLots: 1,
      retailMaxLots: 13,
      hniMinLots: 14,
      hniMaxLots: 34,
      minLots: 1,
      maxLots: 13,
      helperText: "",
      quickPresets: [1],
    };
  }

  const isSME = ipo.boardtype?.toLowerCase() === "sme";
  const boardType = isSME ? "SME" : "MAINBOARD";

  // Parse upper price band
  const upperPrice = parseFloat(
    ipo.price_band.includes("-") 
      ? ipo.price_band.split("-")[1].trim() 
      : ipo.price_band.replace(/[^0-9.]/g, "")
  ) || 100;

  const lotSize = ipo.lot_size || 1;
  const lotCost = upperPrice * lotSize;

  // SEBI ₹2,00,000 Retail limit
  const SEBI_RETAIL_CAP = 200000;

  if (isSME) {
    // ── SME IPO RULES ──
    const retailMinLots = 1;
    const retailMaxLots = lotCost > 0 ? Math.max(1, Math.floor(SEBI_RETAIL_CAP / lotCost)) : 1;
    const hniMinLots = 2; // SME HNI starts at 2 lots
    const hniMaxLots = 10; // SME HNI max 10 lots

    if (investorType === "Retail") {
      const minLots = retailMinLots;
      const maxLots = retailMaxLots;
      const helperText = retailMaxLots === 1
        ? `Retail investors can apply for only 1 lot (₹${lotCost.toLocaleString("en-IN")}) in this SME IPO.`
        : `Retail applications are limited to ${retailMaxLots} lots (₹2 lakh limit).`;
      
      const quickPresets = [1];
      if (retailMaxLots > 1) {
        for (let i = 2; i <= retailMaxLots; i++) quickPresets.push(i);
      }

      return {
        isSME: true,
        boardType: "SME",
        lotSize,
        upperPrice,
        lotCost,
        retailMinLots,
        retailMaxLots,
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
      const maxLots = hniMaxLots;
      const helperText = `SME HNI applications require between ${hniMinLots} and ${hniMaxLots} lots.`;
      const quickPresets = [2, 5, 8, 10];

      return {
        isSME: true,
        boardType: "SME",
        lotSize,
        upperPrice,
        lotCost,
        retailMinLots,
        retailMaxLots,
        hniMinLots,
        hniMaxLots,
        minLots,
        maxLots,
        helperText,
        quickPresets,
      };
    }
  } else {
    // ── MAINBOARD IPO RULES ──
    const retailMinLots = 1;
    const retailMaxLots = lotCost > 0 ? Math.max(1, Math.floor(SEBI_RETAIL_CAP / lotCost)) : 13;
    const hniMinLots = retailMaxLots + 1; // Starts at Retail + 1 (e.g. 14)
    const hniMaxLots = Math.min(100, Math.max(hniMinLots + 10, Math.floor(hniMinLots * 2.5))); // e.g. 34

    if (investorType === "Retail") {
      const minLots = retailMinLots;
      const maxLots = retailMaxLots;
      const helperText = `Retail applications are limited to ${retailMaxLots} lots (₹2 lakh SEBI limit). Select HNI for larger applications.`;
      
      // Presets up to maxRetailLots
      const quickPresets = [1, 2, 5, 10, maxRetailLots]
        .filter((val, idx, arr) => arr.indexOf(val) === idx && val <= maxRetailLots);

      return {
        isSME: false,
        boardType: "MAINBOARD",
        lotSize,
        upperPrice,
        lotCost,
        retailMinLots,
        retailMaxLots,
        hniMinLots,
        hniMaxLots,
        minLots,
        maxLots,
        helperText,
        quickPresets,
      };
    } else {
      // Mainboard HNI
      const minLots = hniMinLots;
      const maxLots = hniMaxLots;
      const helperText = `HNI applications start from ${hniMinLots} lots up to ${hniMaxLots} lots.`;
      
      const step = Math.max(1, Math.floor((hniMaxLots - hniMinLots) / 4));
      const quickPresets = [
        hniMinLots,
        hniMinLots + step,
        hniMinLots + step * 2,
        hniMinLots + step * 3,
        hniMaxLots
      ].filter((val, idx, arr) => arr.indexOf(val) === idx && val <= hniMaxLots);

      return {
        isSME: false,
        boardType: "MAINBOARD",
        lotSize,
        upperPrice,
        lotCost,
        retailMinLots,
        retailMaxLots,
        hniMinLots,
        hniMaxLots,
        minLots,
        maxLots,
        helperText,
        quickPresets,
      };
    }
  }
}

export function useIPOLotValidation(ipo: IPO | null, investorType: "Retail" | "HNI") {
  return useMemo(() => calculateIPOLotRules(ipo, investorType), [ipo, investorType]);
}
