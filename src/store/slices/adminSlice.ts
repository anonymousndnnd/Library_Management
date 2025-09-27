/* eslint-disable */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
interface Books {
  id:string,
  isPublished:boolean,
  title:string,
  description:string,
  createdAt: string;
  author: {
    username: string;
  };
}
interface Author {
  email:string,
  username:string,
  id:string,
  books:Books[]
}
interface AdminState {
  authorCount: number;
  customerCount: number;
  books: Books[];
  loading: boolean;
  error: string | null;
  authors:Author[]
}

const initialState: AdminState = {
  authorCount: 0,
  customerCount: 0,
  books: [],
  authors: [],
  loading: false,
  error: null,
};

// Prefetch all admin data
export const fetchAdminData = createAsyncThunk("admin/fetchData", async () => {
  const [authorsRes, customersRes, booksRes,allAuthors] = await Promise.all([
    axios.get("/api/authorCount"),
    axios.get("/api/customerCount"),
    axios.get("/api/bookInventory"),
    axios.get("/api/allAuthor"),

  ]);
  console.log("authorsRes", authorsRes.data);
  console.log("customersRes", customersRes.data);
  console.log("booksRes", booksRes.data);
  console.log("all Authors",allAuthors)
  return {
    authorCount: authorsRes.data.authorCount || 0,
    customerCount: customersRes.data.customerCount || 0,
    books: booksRes.data.books || [],
    authors: (allAuthors.data.authors || []).map((a: any) => ({
        ...a,
        books: Array.isArray(a.books) ? a.books : [], // ensure books is always array
      })),
  };
});

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAdminData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.authorCount = action.payload.authorCount;
        state.customerCount = action.payload.customerCount;
        state.books = action.payload.books;
        state.authors = action.payload.authors; 
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load admin data";
      });
  },
});

export default adminSlice.reducer;
