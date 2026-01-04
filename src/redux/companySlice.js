import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";

// ✅ Async thunk to fetch all companies
export const fetchAllCompanies = createAsyncThunk(
  "company/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
        withCredentials: true,
      });
      return res.data.companies;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch companies"
      );
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    singleCompany: null,
    searchCompanyByText: "",
    loading: false,
  },
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSearchCompanyByText: (state, action) => {
      state.searchCompanyByText = action.payload;
    },
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCompanies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export actions
export const {
  setCompanies,
  setSearchCompanyByText,
  setSingleCompany,
} = companySlice.actions;

// ✅ Export reducer
export default companySlice.reducer;
