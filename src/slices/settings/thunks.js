import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getCampuses, 
  createCampus, 
  updateCampus, 
  deleteCampus,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock,
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getRoomTypes,
  createRoomType,
  updateRoomType,
  deleteRoomType,
  getRoomFacilities,
  createRoomFacility,
  updateRoomFacility,
  deleteRoomFacility,
  getDepartmentTypes,
  createDepartmentType,
  updateDepartmentType,
  deleteDepartmentType,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getPermissions
} from '../../helpers/fakebackend_helper';

// Campus Thunks
export const fetchCampuses = createAsyncThunk(
  'settings/fetchCampuses',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getCampuses(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCampusAsync = createAsyncThunk(
  'settings/createCampus',
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
  'settings/updateCampus',
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
  'settings/deleteCampus',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteCampus({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Block Thunks
export const fetchBlocks = createAsyncThunk(
  'settings/fetchBlocks',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getBlocks(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBlockAsync = createAsyncThunk(
  'settings/createBlock',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createBlock(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBlockAsync = createAsyncThunk(
  'settings/updateBlock',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateBlock(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBlockAsync = createAsyncThunk(
  'settings/deleteBlock',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteBlock({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Building Thunks
export const fetchBuildings = createAsyncThunk(
  'settings/fetchBuildings',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getBuildings(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBuildingAsync = createAsyncThunk(
  'settings/createBuilding',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createBuilding(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBuildingAsync = createAsyncThunk(
  'settings/updateBuilding',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateBuilding(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBuildingAsync = createAsyncThunk(
  'settings/deleteBuilding',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteBuilding({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Room Type Thunks
export const fetchRoomTypes = createAsyncThunk(
  'settings/fetchRoomTypes',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoomTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRoomTypeAsync = createAsyncThunk(
  'settings/createRoomType',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createRoomType(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRoomTypeAsync = createAsyncThunk(
  'settings/updateRoomType',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateRoomType(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRoomTypeAsync = createAsyncThunk(
  'settings/deleteRoomType',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteRoomType({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Room Facility Thunks
export const fetchRoomFacilities = createAsyncThunk(
  'settings/fetchRoomFacilities',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoomFacilities(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRoomFacilityAsync = createAsyncThunk(
  'settings/createRoomFacility',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createRoomFacility(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRoomFacilityAsync = createAsyncThunk(
  'settings/updateRoomFacility',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateRoomFacility(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRoomFacilityAsync = createAsyncThunk(
  'settings/deleteRoomFacility',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteRoomFacility({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Department Type Thunks
export const fetchDepartmentTypes = createAsyncThunk(
  'settings/fetchDepartmentTypes',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getDepartmentTypes(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDepartmentTypeAsync = createAsyncThunk(
  'settings/createDepartmentType',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createDepartmentType(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDepartmentTypeAsync = createAsyncThunk(
  'settings/updateDepartmentType',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateDepartmentType(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDepartmentTypeAsync = createAsyncThunk(
  'settings/deleteDepartmentType',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteDepartmentType({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Department Thunks
export const fetchDepartments = createAsyncThunk(
  'settings/fetchDepartments',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getDepartments(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createDepartmentAsync = createAsyncThunk(
  'settings/createDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createDepartment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDepartmentAsync = createAsyncThunk(
  'settings/updateDepartment',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateDepartment(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDepartmentAsync = createAsyncThunk(
  'settings/deleteDepartment',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteDepartment({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Role Thunks
export const fetchRoles = createAsyncThunk(
  'settings/fetchRoles',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await getRoles(page, size);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRoleAsync = createAsyncThunk(
  'settings/createRole',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createRole(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRoleAsync = createAsyncThunk(
  'settings/updateRole',
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateRole(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRoleAsync = createAsyncThunk(
  'settings/deleteRole',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await deleteRole({ id });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'settings/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPermissions();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
); 