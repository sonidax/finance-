export interface IPO {
  id: number;
  ipo_name: string;
  status: 'Open' | 'Upcoming' | 'Listed';
  price_band: string;
  lot_size: number;
  issue_size: string;
  open_date: string;
  close_date: string;
  listing_date: string;
  boardtype: string;
  type: string;
  gmp: number;
  created_at: string;
}

export interface GMPRow {
  id: number;
  ipo_id: number;
  current_gmp: number;
  expected_listing: string;
  change_percentage: number;
  updated_at: string;
  ipo_name: string;
  status: string;
  price_band: string;
  listing_date?: string;
}

export interface SubscriptionRatioRow {
  id: number;
  ipo_id: number;
  qib: number;
  nii: number;
  rii: number;
  total: number;
  updated_at: string;
  ipo_name: string;
  status: string;
}

export interface MutualFund {
  id: number;
  fund_name: string;
  category: string;
  nav: number;
  aum: string;
  returns_1y: number;
  returns_3y: number;
  fund_house: string;
  created_at: string;
}

export interface Commodity {
  id: number;
  name: string;
  category: 'Precious Metals' | 'Energy' | 'Base Metals' | 'Agricultural';
  expiry_date: string;
  current_price: number;
  price_change: number;
  unit: string;
  high_24h: number;
  low_24h: number;
  volume: string;
  icon?: string;
  created_at: string;
}

export const mockIPOs: IPO[] = [
  {
    id: 1,
    ipo_name: "Hyundai Motor India Ltd",
    status: "Open",
    price_band: "1860-1960",
    lot_size: 7,
    issue_size: "27,870 Cr",
    open_date: "2026-08-01",
    close_date: "2026-08-05",
    listing_date: "2026-08-10",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 380,
    created_at: "2026-07-25T10:00:00Z"
  },
  {
    id: 2,
    ipo_name: "Waaree Energies Ltd",
    status: "Open",
    price_band: "1427-1503",
    lot_size: 9,
    issue_size: "4,321 Cr",
    open_date: "2026-08-02",
    close_date: "2026-08-06",
    listing_date: "2026-08-11",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 540,
    created_at: "2026-07-26T10:00:00Z"
  },
  {
    id: 3,
    ipo_name: "Apex Solar Tech (SME)",
    status: "Open",
    price_band: "120-126",
    lot_size: 1000,
    issue_size: "48.5 Cr",
    open_date: "2026-08-01",
    close_date: "2026-08-04",
    listing_date: "2026-08-08",
    boardtype: "SME",
    type: "Book Built",
    gmp: 65,
    created_at: "2026-07-27T10:00:00Z"
  },
  {
    id: 4,
    ipo_name: "Swiggy Limited",
    status: "Upcoming",
    price_band: "371-390",
    lot_size: 38,
    issue_size: "11,370 Cr",
    open_date: "2026-08-08",
    close_date: "2026-08-12",
    listing_date: "2026-08-18",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 28,
    created_at: "2026-07-28T10:00:00Z"
  },
  {
    id: 5,
    ipo_name: "NTPC Green Energy Ltd",
    status: "Upcoming",
    price_band: "102-108",
    lot_size: 138,
    issue_size: "10,000 Cr",
    open_date: "2026-08-14",
    close_date: "2026-08-18",
    listing_date: "2026-08-23",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 18,
    created_at: "2026-07-29T10:00:00Z"
  },
  {
    id: 6,
    ipo_name: "Mobikwik Systems Ltd",
    status: "Upcoming",
    price_band: "265-279",
    lot_size: 53,
    issue_size: "700 Cr",
    open_date: "2026-08-20",
    close_date: "2026-08-24",
    listing_date: "2026-08-28",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: -12,
    created_at: "2026-07-30T10:00:00Z"
  },
  {
    id: 7,
    ipo_name: "Bajaj Housing Finance Ltd",
    status: "Listed",
    price_band: "66-70",
    lot_size: 214,
    issue_size: "6,560 Cr",
    open_date: "2026-07-15",
    close_date: "2026-07-18",
    listing_date: "2026-07-23",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 55,
    created_at: "2026-07-10T10:00:00Z"
  },
  {
    id: 8,
    ipo_name: "Premier Energies Ltd",
    status: "Listed",
    price_band: "427-450",
    lot_size: 33,
    issue_size: "2,830 Cr",
    open_date: "2026-07-20",
    close_date: "2026-07-23",
    listing_date: "2026-07-28",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 390,
    created_at: "2026-07-12T10:00:00Z"
  },
  {
    id: 9,
    ipo_name: "FirstCry (Brainbees Solutions)",
    status: "Listed",
    price_band: "440-465",
    lot_size: 32,
    issue_size: "4,193 Cr",
    open_date: "2026-07-06",
    close_date: "2026-07-08",
    listing_date: "2026-07-13",
    boardtype: "Mainboard",
    type: "Book Built",
    gmp: 82,
    created_at: "2026-07-01T10:00:00Z"
  }
];

export const mockGMPData: GMPRow[] = [
  {
    id: 1,
    ipo_id: 1,
    ipo_name: "Hyundai Motor India Ltd",
    price_band: "1860-1960",
    current_gmp: 380,
    expected_listing: "2,340",
    change_percentage: 19.38,
    status: "Open",
    listing_date: "2026-08-10",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 2,
    ipo_id: 2,
    ipo_name: "Waaree Energies Ltd",
    price_band: "1427-1503",
    current_gmp: 540,
    expected_listing: "2,043",
    change_percentage: 35.92,
    status: "Open",
    listing_date: "2026-08-11",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 3,
    ipo_id: 3,
    ipo_name: "Apex Solar Tech (SME)",
    price_band: "120-126",
    current_gmp: 65,
    expected_listing: "191",
    change_percentage: 51.59,
    status: "Open",
    listing_date: "2026-08-08",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 4,
    ipo_id: 4,
    ipo_name: "Swiggy Limited",
    price_band: "371-390",
    current_gmp: 28,
    expected_listing: "418",
    change_percentage: 7.18,
    status: "Upcoming",
    listing_date: "2026-08-18",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 5,
    ipo_id: 5,
    ipo_name: "NTPC Green Energy Ltd",
    price_band: "102-108",
    current_gmp: 18,
    expected_listing: "126",
    change_percentage: 16.67,
    status: "Upcoming",
    listing_date: "2026-08-23",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 6,
    ipo_id: 6,
    ipo_name: "Mobikwik Systems Ltd",
    price_band: "265-279",
    current_gmp: -12,
    expected_listing: "267",
    change_percentage: -4.30,
    status: "Upcoming",
    listing_date: "2026-08-28",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 7,
    ipo_id: 7,
    ipo_name: "FinTech Infra India Ltd",
    price_band: "210-220",
    current_gmp: -8,
    expected_listing: "212",
    change_percentage: -3.64,
    status: "Upcoming",
    listing_date: "2026-08-30",
    updated_at: "2026-08-02T09:30:00Z"
  },
  {
    id: 8,
    ipo_id: 8,
    ipo_name: "Delta Infra Tech",
    price_band: "85-90",
    current_gmp: 0,
    expected_listing: "90",
    change_percentage: 0.00,
    status: "Upcoming",
    listing_date: "2026-09-02",
    updated_at: "2026-08-02T09:30:00Z"
  }
];

export const mockSubscriptionRatio: SubscriptionRatioRow[] = [
  {
    id: 1,
    ipo_id: 1,
    ipo_name: "Hyundai Motor India Ltd",
    qib: 84.50,
    nii: 42.10,
    rii: 15.30,
    total: 54.20,
    status: "Open",
    updated_at: "2026-08-02T10:00:00Z"
  },
  {
    id: 2,
    ipo_id: 2,
    ipo_name: "Waaree Energies Ltd",
    qib: 112.40,
    nii: 68.20,
    rii: 24.80,
    total: 78.60,
    status: "Open",
    updated_at: "2026-08-02T10:00:00Z"
  },
  {
    id: 3,
    ipo_id: 3,
    ipo_name: "Apex Solar Tech (SME)",
    qib: 25.10,
    nii: 110.50,
    rii: 185.20,
    total: 122.80,
    status: "Open",
    updated_at: "2026-08-02T10:00:00Z"
  },
  {
    id: 4,
    ipo_id: 7,
    ipo_name: "Bajaj Housing Finance Ltd",
    qib: 222.10,
    nii: 41.50,
    rii: 7.04,
    total: 63.60,
    status: "Listed",
    updated_at: "2026-08-02T10:00:00Z"
  },
  {
    id: 5,
    ipo_id: 8,
    ipo_name: "Premier Energies Ltd",
    qib: 216.70,
    nii: 50.00,
    rii: 7.60,
    total: 74.30,
    status: "Listed",
    updated_at: "2026-08-02T10:00:00Z"
  }
];

export const mockMutualFunds: MutualFund[] = [
  {
    id: 1,
    fund_name: "Nippon India Small Cap Fund Direct-Growth",
    category: "Small Cap",
    nav: 172.45,
    aum: "56,840 Cr",
    returns_1y: 38.6,
    returns_3y: 32.4,
    fund_house: "Nippon India Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 2,
    fund_name: "Quant Small Cap Fund Direct-Growth",
    category: "Small Cap",
    nav: 268.10,
    aum: "24,150 Cr",
    returns_1y: 42.1,
    returns_3y: 36.8,
    fund_house: "Quant Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 3,
    fund_name: "HDFC Top 100 Fund Direct-Growth",
    category: "Large Cap",
    nav: 1140.50,
    aum: "35,420 Cr",
    returns_1y: 28.4,
    returns_3y: 21.2,
    fund_house: "HDFC Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 4,
    fund_name: "ICICI Prudential Bluechip Fund Direct-Growth",
    category: "Large Cap",
    nav: 105.80,
    aum: "52,100 Cr",
    returns_1y: 26.8,
    returns_3y: 19.5,
    fund_house: "ICICI Prudential",
    created_at: "2026-01-01"
  },
  {
    id: 5,
    fund_name: "SBI Midcap Fund Direct-Growth",
    category: "Mid Cap",
    nav: 245.30,
    aum: "21,800 Cr",
    returns_1y: 33.2,
    returns_3y: 26.4,
    fund_house: "SBI Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 6,
    fund_name: "Motilal Oswal Midcap Fund Direct-Growth",
    category: "Mid Cap",
    nav: 118.90,
    aum: "18,650 Cr",
    returns_1y: 54.2,
    returns_3y: 38.1,
    fund_house: "Motilal Oswal",
    created_at: "2026-01-01"
  },
  {
    id: 7,
    fund_name: "Parag Parikh Flexi Cap Fund Direct-Growth",
    category: "Flexi Cap",
    nav: 86.40,
    aum: "74,200 Cr",
    returns_1y: 31.5,
    returns_3y: 24.6,
    fund_house: "PPFAS Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 8,
    fund_name: "Tata Digital India Fund Direct-Growth",
    category: "Sectoral",
    nav: 58.70,
    aum: "9,840 Cr",
    returns_1y: 29.8,
    returns_3y: 18.4,
    fund_house: "Tata Mutual Fund",
    created_at: "2026-01-01"
  },
  {
    id: 9,
    fund_name: "Mirae Asset Large Cap Fund Direct-Growth",
    category: "Large Cap",
    nav: 122.15,
    aum: "38,900 Cr",
    returns_1y: 24.5,
    returns_3y: 17.9,
    fund_house: "Mirae Asset",
    created_at: "2026-01-01"
  },
  {
    id: 10,
    fund_name: "Axis Small Cap Fund Direct-Growth",
    category: "Small Cap",
    nav: 104.60,
    aum: "22,400 Cr",
    returns_1y: 27.9,
    returns_3y: 25.1,
    fund_house: "Axis Mutual Fund",
    created_at: "2026-01-01"
  }
];

export const mockCommodities: Commodity[] = [
  {
    id: 1,
    name: "Gold",
    category: "Precious Metals",
    expiry_date: "2026-08-05",
    current_price: 72450,
    price_change: 480,
    unit: "10 grams",
    high_24h: 72800,
    low_24h: 71950,
    volume: "12,450 lots",
    icon: "/goldV3.svg",
    created_at: "2026-08-02"
  },
  {
    id: 2,
    name: "Silver",
    category: "Precious Metals",
    expiry_date: "2026-09-05",
    current_price: 85200,
    price_change: -620,
    unit: "1 kg",
    high_24h: 86100,
    low_24h: 84800,
    volume: "18,920 lots",
    icon: "/silverV3.svg",
    created_at: "2026-08-02"
  },
  {
    id: 3,
    name: "Crude Oil",
    category: "Energy",
    expiry_date: "2026-08-19",
    current_price: 6420,
    price_change: 95,
    unit: "1 Barrel",
    high_24h: 6480,
    low_24h: 6310,
    volume: "45,100 lots",
    icon: "/crudeOilV2.svg",
    created_at: "2026-08-02"
  },
  {
    id: 4,
    name: "Natural Gas",
    category: "Energy",
    expiry_date: "2026-08-26",
    current_price: 218.5,
    price_change: -4.2,
    unit: "1 MMBtu",
    high_24h: 224.0,
    low_24h: 215.2,
    volume: "32,800 lots",
    icon: "/naturalGasV3.svg",
    created_at: "2026-08-02"
  },
  {
    id: 5,
    name: "Copper",
    category: "Base Metals",
    expiry_date: "2026-08-31",
    current_price: 792.3,
    price_change: 6.8,
    unit: "1 kg",
    high_24h: 798.5,
    low_24h: 785.0,
    volume: "14,350 lots",
    icon: "copper",
    created_at: "2026-08-02"
  },
  {
    id: 6,
    name: "Aluminum",
    category: "Base Metals",
    expiry_date: "2026-08-31",
    current_price: 234.8,
    price_change: 1.4,
    unit: "1 kg",
    high_24h: 237.0,
    low_24h: 232.5,
    volume: "8,900 lots",
    icon: "aluminum",
    created_at: "2026-08-02"
  },
  {
    id: 7,
    name: "Zinc",
    category: "Base Metals",
    expiry_date: "2026-08-31",
    current_price: 268.1,
    price_change: -2.3,
    unit: "1 kg",
    high_24h: 271.4,
    low_24h: 266.0,
    volume: "9,640 lots",
    icon: "zinc",
    created_at: "2026-08-02"
  },
  {
    id: 8,
    name: "Platinum",
    category: "Precious Metals",
    expiry_date: "2026-10-05",
    current_price: 31850,
    price_change: 210,
    unit: "10 grams",
    high_24h: 32100,
    low_24h: 31500,
    volume: "3,120 lots",
    icon: "platinum",
    created_at: "2026-08-02"
  }
];
