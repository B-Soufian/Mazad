import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  liveAuctions: [
    {
      id: 1,
      name: "1967 Ferrari 275 GTB/4",
      assetId: "#FER-275-882",
      category: "LUXURY ASSETS",
      image: null,
      currentBid: 3250000,
      reserveMet: true,
      bidders: 42,
      timeLeft: "02:45",
      urgent: true,
    },
    {
      id: 2,
      name: "Rolex Daytona 'Paul Newman'",
      assetId: "#WTC-PN-002",
      category: "RARE WATCHES",
      image: null,
      currentBid: 412000,
      reserveMet: false,
      bidders: 18,
      timeLeft: "14:22:05",
      urgent: false,
    },
    {
      id: 3,
      name: "Platinum Plate '777'",
      assetId: "#PLT-DU-777",
      category: "VIP PLATES",
      image: null,
      currentBid: 185500,
      reserveMet: true,
      bidders: 8,
      timeLeft: "04:12",
      urgent: true,
    },
    {
      id: 4,
      name: "Basquiat Original 'Skull'",
      assetId: "#ART-BSQ-441",
      category: "FINE ART",
      image: null,
      currentBid: 12400000,
      reserveMet: true,
      bidders: 126,
      timeLeft: "08:45:12",
      urgent: false,
    },
  ],
  totalActive: 12,
  filters: {
    category: 'All Categories',
    priceRange: 'Any Range',
    status: 'All Status',
  },
  loading: false,
  error: null,
};

const auctionSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        category: 'All Categories',
        priceRange: 'Any Range',
        status: 'All Status',
      };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setFilter, resetFilters, setLoading } = auctionSlice.actions;
export default auctionSlice.reducer;
