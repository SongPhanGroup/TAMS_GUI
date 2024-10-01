import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getSystemParameter } from "../api/system_parameter"

const initialState = {
  data: [],
  isLoading: false,
  error: null
}

// Thunk action để lấy danh sách tham số hệ thống
export const fetchSystemParameters = createAsyncThunk(
  'systemParameters/fetchList',
  async (query, { rejectWithValue }) => {
    try {
      const response = await getSystemParameter(query)
      return response.data  // Giả sử API trả về dữ liệu ở `response.data`
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Slice xử lý trạng thái và hành động
export const systemParameterSlice = createSlice({
  name: 'systemParameters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemParameters.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSystemParameters.fulfilled, (state, { payload }) => {
        const { data } = payload
        state.isLoading = false
        state.data = data
      })
      .addCase(fetchSystemParameters.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload || 'Failed to fetch system parameters'
      })
  },
})

// Export actions và reducer
export const systemParameterActions = systemParameterSlice.actions
export default systemParameterSlice.reducer
