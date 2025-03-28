import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getCampuses, 
  getBlocks, 
  getBuildings, 
  getRoomTypes, 
  getRoomFacilities, 
  getDepartmentTypes, 
  getDepartments, 
  getRoles, 
  getPermissions,
  createCampus,
  updateCampus,
  deleteCampus,
  createBlock,
  updateBlock,
  deleteBlock,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  createRoomFacility,
  updateRoomFacility,
  deleteRoomFacility,
  createDepartmentType,
  updateDepartmentType,
  deleteDepartmentType,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createRole,
  updateRole,
  deleteRole
} from "../../helpers/fakebackend_helper";

// Async thunks for fetching data
export const fetchCampuses = createAsyncThunk(
  "settings/fetchCampuses",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getCampuses(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBlocks = createAsyncThunk(
  "settings/fetchBlocks",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getBlocks(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBuildings = createAsyncThunk(
  "settings/fetchBuildings",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getBuildings(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoomTypes = createAsyncThunk(
  "settings/fetchRoomTypes",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoomTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoomFacilities = createAsyncThunk(
  "settings/fetchRoomFacilities",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoomFacilities(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartmentTypes = createAsyncThunk(
  "settings/fetchDepartmentTypes",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getDepartmentTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  "settings/fetchDepartments",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getDepartments(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "settings/fetchRoles",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoles(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "settings/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPermissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks for creating/updating/deleting data
export const createCampusAsync = createAsyncThunk(
  "settings/createCampus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createCampus(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCampusAsync = createAsyncThunk(
  "settings/updateCampus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateCampus(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCampusAsync = createAsyncThunk(
  "settings/deleteCampus",
  async (data, { rejectWithValue }) => {
    try {
      const response = await deleteCampus(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Similar thunks for other entities...

const initialState = {
  campuses: [],
  blocks: [],
  buildings: [],
  roomTypes: [],
  roomFacilities: [],
  departmentTypes: [],
  departments: [],
  roles: [],
  permissions: [],
  loading: false,
  loadingCampuses: false,
  loadingBlocks: false,
  loadingBuildings: false,
  loadingRoomTypes: false,
  loadingRoomFacilities: false,
  loadingDepartmentTypes: false,
  loadingDepartments: false,
  loadingRoles: false,
  loadingPermissions: false,
  error: null,
  errorCampuses: null,
  errorBlocks: null,
  errorBuildings: null,
  errorRoomTypes: null,
  errorRoomFacilities: null,
  errorDepartmentTypes: null,
  errorDepartments: null,
  errorRoles: null,
  errorPermissions: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 1
  }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettings: (state) => {
      return initialState;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Campuses
      .addCase(fetchCampuses.pending, (state) => {
        state.loadingCampuses = true;
        state.errorCampuses = null;
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.loadingCampuses = false;
        state.campuses = action.payload.data;
        state.pagination = {
          ...state.pagination,
          currentPage: action.payload.meta.current_page,
          pageSize: action.payload.meta.per_page,
          totalRecords: action.payload.meta.total,
          totalPages: action.payload.meta.last_page
        };
      })
      .addCase(fetchCampuses.rejected, (state, action) => {
        state.loadingCampuses = false;
        state.errorCampuses = action.payload;
      })
      // Create Campus
      .addCase(createCampusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.campuses.push(action.payload.data);
      })
      .addCase(createCampusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Campus
      .addCase(updateCampusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCampusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.campuses.findIndex(campus => campus.id === action.payload.data.id);
        if (index !== -1) {
          state.campuses[index] = action.payload.data;
        }
      })
      .addCase(updateCampusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Campus
      .addCase(deleteCampusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCampusAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.campuses = state.campuses.filter(campus => campus.id !== action.payload.data.id);
      })
      .addCase(deleteCampusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSettings, setPagination } = settingsSlice.actions;
export default settingsSlice.reducer; 