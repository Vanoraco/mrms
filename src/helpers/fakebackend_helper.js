import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Gets the logged in user data from local session
export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

// //is user is logged in
export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
export const postFakeRegister = data => api.create(url.POST_FAKE_REGISTER, data);

// Login Method
export const postFakeLogin = data => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = data => api.create(url.POST_FAKE_PASSWORD_FORGET, data);

// Edit profile
export const postJwtProfile = data => api.create(url.POST_EDIT_JWT_PROFILE, data);

export const postFakeProfile = (data) => api.update(url.POST_EDIT_PROFILE + '/' + data.idx, data);

// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = (data) => {
  return api.create("api/auth/login", data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// postForgetPwd
export const postJwtForgetPwd = data => api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);

// postSocialLogin
export const postSocialLogin = data => api.create(url.SOCIAL_LOGIN, data);

// Calendar
// get Events
export const getEvents = () => api.get(url.GET_EVENTS);

// get Events
export const getCategories = () => api.get(url.GET_CATEGORIES);

// get Upcomming Events
export const getUpCommingEvent = () => api.get(url.GET_UPCOMMINGEVENT);

// add Events
export const addNewEvent = event => api.create(url.ADD_NEW_EVENT, event);

// update Event
export const updateEvent = event => api.put(url.UPDATE_EVENT, event);

// delete Event
export const deleteEvent = event => api.delete(url.DELETE_EVENT, { headers: { event } });

// Chat
// get Contact
export const getDirectContact = () => api.get(url.GET_DIRECT_CONTACT);

// get Messages
export const getMessages = roomId => api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });

// add Message
export const addMessage = message => api.create(url.ADD_MESSAGE, message);

// add Message
export const deleteMessage = message => api.delete(url.DELETE_MESSAGE, { headers: { message } });

// get Channels
export const getChannels = () => api.get(url.GET_CHANNELS);

// MailBox
//get Mail
export const getMailDetails = () => api.get(url.GET_MAIL_DETAILS);

// delete Mail
export const deleteMail = forId => api.delete(url.DELETE_MAIL, { headers: { forId } });

// Ecommerce
// get Products
export const getProducts = () => api.get(url.GET_PRODUCTS);

// delete Product
export const deleteProducts = product => api.delete(url.DELETE_PRODUCT + '/' + product);

// add Products
export const addNewProduct = product => api.create(url.ADD_NEW_PRODUCT, product);

// update Products
export const updateProduct = product => api.update(url.UPDATE_PRODUCT + '/' + product._id, product);

// get Orders
export const getOrders = () => api.get(url.GET_ORDERS);

// add Order
export const addNewOrder = order => api.create(url.ADD_NEW_ORDER, order);

// update Order
export const updateOrder = order => api.update(url.UPDATE_ORDER + '/' + order._id, order);

// delete Order
export const deleteOrder = order => api.delete(url.DELETE_ORDER + '/' + order);

// get Customers
export const getCustomers = () => api.get(url.GET_CUSTOMERS);

// add Customers
export const addNewCustomer = customer => api.create(url.ADD_NEW_CUSTOMER, customer);

// update Customers
export const updateCustomer = customer => api.update(url.UPDATE_CUSTOMER + '/' + customer._id, customer);

// delete Customers
export const deleteCustomer = customer => api.delete(url.DELETE_CUSTOMER + '/' + customer);

// get Sellers
export const getSellers = () => api.get(url.GET_SELLERS);

// Project
// get Project list 
export const getProjectList = () => api.get(url.GET_PROJECT_LIST);

// Tasks
// get Task
export const getTaskList = () => api.get(url.GET_TASK_LIST);

// add Task
export const addNewTask = task => api.create(url.ADD_NEW_TASK, task);

// update Task
export const updateTask = task => api.update(url.UPDATE_TASK + '/' + task._id, task);

// delete Task
export const deleteTask = task => api.delete(url.DELETE_TASK + '/' + task);

// CRM
// get Contacts
export const getContacts = () => api.get(url.GET_CONTACTS);

// add Contact
export const addNewContact = contact => api.create(url.ADD_NEW_CONTACT, contact);

// update Contact
export const updateContact = contact => api.update(url.UPDATE_CONTACT + '/' + contact._id, contact);

// delete Contact
export const deleteContact = contact => api.delete(url.DELETE_CONTACT + '/' + contact);

// get Companies
export const getCompanies = () => api.get(url.GET_COMPANIES);

// add Companies
export const addNewCompanies = company => api.create(url.ADD_NEW_COMPANIES, company);

// update Companies
export const updateCompanies = company => api.update(url.UPDATE_COMPANIES + '/' + company._id, company);

// delete Companies
export const deleteCompanies = company => api.delete(url.DELETE_COMPANIES + '/' + company);

// get Deals
export const getDeals = () => api.get(url.GET_DEALS);

// get Leads
export const getLeads = () => api.get(url.GET_LEADS);

// add Lead
export const addNewLead = lead => api.create(url.ADD_NEW_LEAD, lead);

// update Lead
export const updateLead = lead => api.update(url.UPDATE_LEAD + '/' + lead._id, lead);

// delete Lead
export const deleteLead = lead => api.delete(url.DELETE_LEAD + '/' + lead);

// Crypto
// Transation
export const getTransationList = () => api.get(url.GET_TRANSACTION_LIST);

// Order List
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);

// Invoice
//get Invoice
export const getInvoices = () => api.get(url.GET_INVOICES);

// add Invoice
export const addNewInvoice = invoice => api.create(url.ADD_NEW_INVOICE, invoice);

// update Invoice
export const updateInvoice = invoice => api.update(url.UPDATE_INVOICE + '/' + invoice._id, invoice);

// delete Invoice
export const deleteInvoice = invoice => api.delete(url.DELETE_INVOICE + '/' + invoice);

// Support Tickets 
// Tickets
export const getTicketsList = () => api.get(url.GET_TICKETS_LIST);

// add Tickets 
export const addNewTicket = ticket => api.create(url.ADD_NEW_TICKET, ticket);

// update Tickets 
export const updateTicket = ticket => api.update(url.UPDATE_TICKET + '/' + ticket._id, ticket);

// delete Tickets 
export const deleteTicket = ticket => api.delete(url.DELETE_TICKET + '/' + ticket);

// Dashboard Analytics

// Sessions by Countries
export const getAllData = () => api.get(url.GET_ALL_DATA);
export const getHalfYearlyData = () => api.get(url.GET_HALFYEARLY_DATA);
export const getMonthlyData = () => api.get(url.GET_MONTHLY_DATA);

// Audiences Metrics
export const getAllAudiencesMetricsData = () => api.get(url.GET_ALLAUDIENCESMETRICS_DATA);
export const getMonthlyAudiencesMetricsData = () => api.get(url.GET_MONTHLYAUDIENCESMETRICS_DATA);
export const getHalfYearlyAudiencesMetricsData = () => api.get(url.GET_HALFYEARLYAUDIENCESMETRICS_DATA);
export const getYearlyAudiencesMetricsData = () => api.get(url.GET_YEARLYAUDIENCESMETRICS_DATA);

// Users by Device
export const getTodayDeviceData = () => api.get(url.GET_TODAYDEVICE_DATA);
export const getLastWeekDeviceData = () => api.get(url.GET_LASTWEEKDEVICE_DATA);
export const getLastMonthDeviceData = () => api.get(url.GET_LASTMONTHDEVICE_DATA);
export const getCurrentYearDeviceData = () => api.get(url.GET_CURRENTYEARDEVICE_DATA);

// Audiences Sessions by Country
export const getTodaySessionData = () => api.get(url.GET_TODAYSESSION_DATA);
export const getLastWeekSessionData = () => api.get(url.GET_LASTWEEKSESSION_DATA);
export const getLastMonthSessionData = () => api.get(url.GET_LASTMONTHSESSION_DATA);
export const getCurrentYearSessionData = () => api.get(url.GET_CURRENTYEARSESSION_DATA);

// Dashboard CRM

// Balance Overview
export const getTodayBalanceData = () => api.get(url.GET_TODAYBALANCE_DATA);
export const getLastWeekBalanceData = () => api.get(url.GET_LASTWEEKBALANCE_DATA);
export const getLastMonthBalanceData = () => api.get(url.GET_LASTMONTHBALANCE_DATA);
export const getCurrentYearBalanceData = () => api.get(url.GET_CURRENTYEARBALANCE_DATA);

// Dial Type
export const getTodayDealData = () => api.get(url.GET_TODAYDEAL_DATA);
export const getWeeklyDealData = () => api.get(url.GET_WEEKLYDEAL_DATA);
export const getMonthlyDealData = () => api.get(url.GET_MONTHLYDEAL_DATA);
export const getYearlyDealData = () => api.get(url.GET_YEARLYDEAL_DATA);

// Sales Forecast
export const getOctSalesData = () => api.get(url.GET_OCTSALES_DATA);
export const getNovSalesData = () => api.get(url.GET_NOVSALES_DATA);
export const getDecSalesData = () => api.get(url.GET_DECSALES_DATA);
export const getJanSalesData = () => api.get(url.GET_JANSALES_DATA);

// Dashboard Ecommerce
// Revenue
export const getAllRevenueData = () => api.get(url.GET_ALLREVENUE_DATA);
export const getMonthRevenueData = () => api.get(url.GET_MONTHREVENUE_DATA);
export const getHalfYearRevenueData = () => api.get(url.GET_HALFYEARREVENUE_DATA);
export const getYearRevenueData = () => api.get(url.GET_YEARREVENUE_DATA);


// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);

// Market Graph
export const getAllMarketData = () => api.get(url.GET_ALLMARKETDATA_DATA);
export const getYearMarketData = () => api.get(url.GET_YEARMARKET_DATA);
export const getMonthMarketData = () => api.get(url.GET_MONTHMARKET_DATA);
export const getWeekMarketData = () => api.get(url.GET_WEEKMARKET_DATA);
export const getHourMarketData = () => api.get(url.GET_HOURMARKET_DATA);

// Dashboard Project
// Project Overview
export const getAllProjectData = () => api.get(url.GET_ALLPROJECT_DATA);
export const getMonthProjectData = () => api.get(url.GET_MONTHPROJECT_DATA);
export const gethalfYearProjectData = () => api.get(url.GET_HALFYEARPROJECT_DATA);
export const getYearProjectData = () => api.get(url.GET_YEARPROJECT_DATA);

// Project Status
export const getAllProjectStatusData = () => api.get(url.GET_ALLPROJECTSTATUS_DATA);
export const getWeekProjectStatusData = () => api.get(url.GET_WEEKPROJECTSTATUS_DATA);
export const getMonthProjectStatusData = () => api.get(url.GET_MONTHPROJECTSTATUS_DATA);
export const getQuarterProjectStatusData = () => api.get(url.GET_QUARTERPROJECTSTATUS_DATA);

// Dashboard NFT
// Marketplace
export const getAllMarketplaceData = () => api.get(url.GET_ALLMARKETPLACE_DATA);
export const getMonthMarketplaceData = () => api.get(url.GET_MONTHMARKETPLACE_DATA);
export const gethalfYearMarketplaceData = () => api.get(url.GET_HALFYEARMARKETPLACE_DATA);
export const getYearMarketplaceData = () => api.get(url.GET_YEARMARKETPLACE_DATA);

// Project
export const addProjectList = (project) => api.create(url.ADD_NEW_PROJECT, project);
export const updateProjectList = (project) => api.put(url.UPDATE_PROJECT, project);
export const deleteProjectList = (project) => api.delete(url.DELETE_PROJECT, { headers: { project } });

// Pages > Team
export const getTeamData = (team) => api.get(url.GET_TEAMDATA, team);
export const deleteTeamData = (team) => api.delete(url.DELETE_TEAMDATA, { headers: { team } });
export const addTeamData = (team) => api.create(url.ADD_NEW_TEAMDATA, team);
export const updateTeamData = (team) => api.put(url.UPDATE_TEAMDATA, team);

// File Manager

// Folder
export const getFolders = (folder) => api.get(url.GET_FOLDERS, folder);
export const deleteFolder = (folder) => api.delete(url.DELETE_FOLDER, { headers: { folder } });
export const addNewFolder = (folder) => api.create(url.ADD_NEW_FOLDER, folder);
export const updateFolder = (folder) => api.put(url.UPDATE_FOLDER, folder);

// File
export const getFiles = (file) => api.get(url.GET_FILES, file);
export const deleteFile = (file) => api.delete(url.DELETE_FILE, { headers: { file } });
export const addNewFile = (file) => api.create(url.ADD_NEW_FILE, file);
export const updateFile = (file) => api.put(url.UPDATE_FILE, file);

// To Do
export const getTodos = (todo) => api.get(url.GET_TODOS, todo);
export const deleteTodo = (todo) => api.delete(url.DELETE_TODO, { headers: { todo } });
export const addNewTodo = (todo) => api.create(url.ADD_NEW_TODO, todo);
export const updateTodo = (todo) => api.put(url.UPDATE_TODO, todo);

// To do Project
export const getProjects = (project) => api.get(url.GET_PROJECTS, project);
export const addNewProject = (project) => api.create(url.ADD_NEW_TODO_PROJECT, project);

//Job Application
export const getJobApplicationList = () => api.get(url.GET_APPLICATION_LIST);

//API Key
export const getAPIKey = () => api.get(url.GET_API_KEY);

// Campus APIs
export const getCampuses = (page = 1, limit = 10) => {
  return api.get(`${url.GET_CAMPUSES}?page=${page}&limit=${limit}`);
};

export const createCampus = (data) => {
  return api.create(url.POST_CAMPUS, data);
};

export const updateCampus = ({ id, ...data }) => {
  return api.update(url.PUT_CAMPUS, { ...data, id });
};

export const deleteCampus = ({ id }) => {
  const token = localStorage.getItem("token");
  console.log('Delete Campus Request:', {
    url: url.DELETE_CAMPUS,
    data: {
      id: id
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return api.delete(url.DELETE_CAMPUS, { 
    data: {
      id: id
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(response => {
    console.log('Delete Campus Response:', response);
    return response;
  }).catch(error => {
    console.error('Delete Campus Error:', error);
    throw error;
  });
};

// Block APIs
export const getBlocks = (page = 1, limit = 10) => {
  return api.get(`${url.GET_BLOCKS}?page=${page}&limit=${limit}`);
};
export const getBlock = (id) => api.get(url.GET_BLOCK + id);
export const createBlock = (data) => api.create(url.POST_BLOCK, data);
export const updateBlock = (data) => api.put(url.PUT_BLOCK, data);
export const deleteBlock = (data) => api.delete(url.DELETE_BLOCK, { data });

// Building APIs
export const getBuildings = (page = 1, limit = 10) => {
  return api.get(`${url.GET_BUILDINGS}?page=${page}&limit=${limit}`);
};
export const getBuilding = (id) => api.get(url.GET_BUILDING + id);
export const createBuilding = (data) => api.create(url.POST_BUILDING, data);
export const updateBuilding = (data) => api.put(url.PUT_BUILDING, data);
export const deleteBuilding = (data) => api.delete(url.DELETE_BUILDING, { data });

// Room APIs
export const getRooms = () => api.get(url.GET_ROOMS);
export const getRoom = (id) => api.get(url.GET_ROOM + id);
export const createRoom = (data) => api.post(url.POST_ROOM, data);
export const updateRoom = (id, data) => api.put(url.PUT_ROOM + id, data);
export const deleteRoom = (id) => api.delete(url.DELETE_ROOM + id);

// Room Type APIs
export const getRoomTypes = (page = 1, limit = 10) => {
  return api.get(url.GET_ROOM_TYPES, { params: { page, limit } });
};
export const getRoomType = (id) => api.get(url.GET_ROOM_TYPE + id);
export const createRoomType = (data) => api.post(url.POST_ROOM_TYPE, data);
export const updateRoomType = (id, data) => api.put(url.PUT_ROOM_TYPE + id, data);
export const deleteRoomType = (id) => api.delete(url.DELETE_ROOM_TYPE + id);

// Room Facility APIs
export const getRoomFacilities = (page = 1, limit = 10) => {
  return api.get(url.GET_ROOM_FACILITIES, { params: { page, limit } });
};
export const getRoomFacility = (id) => api.get(`${url.GET_ROOM_FACILITY}${id}`);
export const createRoomFacility = (data) => api.create(url.POST_ROOM_FACILITY, data);
export const updateRoomFacility = (id, data) => api.update(`${url.PUT_ROOM_FACILITY}/${id}`, data);
export const deleteRoomFacility = (id) => api.delete(`${url.DELETE_ROOM_FACILITY}/${id}`);

// Department Type APIs
export const getDepartmentTypes = (page = 1, limit = 10) => {
  return api.get(url.GET_DEPARTMENT_TYPES, { params: { page, limit } });
};
export const getDepartmentType = (id) => api.get(`${url.GET_DEPARTMENT_TYPE}/${id}`);
export const createDepartmentType = (data) => api.create(url.POST_DEPARTMENT_TYPE, data);
export const updateDepartmentType = (data) => api.update(url.PUT_DEPARTMENT_TYPE, data);
export const deleteDepartmentType = (data) => api.delete(url.DELETE_DEPARTMENT_TYPE, { data });

// Department APIs
export const getDepartments = (page = 1, limit = 10) => {
  return api.get(url.GET_DEPARTMENTS, { params: { page, limit } });
};
export const getDepartment = (id) => api.get(`${url.GET_DEPARTMENT}/${id}`);
export const createDepartment = (data) => api.create(url.POST_DEPARTMENT, data);
export const updateDepartment = (data) => {
  // Make sure we have the department ID
  if (!data.id) {
    throw new Error("Department ID is required for updating");
  }
  
  // Clone the data to avoid mutating the original
  const payload = { ...data };
  
  // Log the update request for debugging
  console.log(`Updating department ${data.id} with:`, payload);
  
  // Use PATCH method with ID in URL
  return api.patch(`${url.PUT_DEPARTMENT}/${data.id}`, payload);
};
export const deleteDepartment = (data) => api.delete(url.DELETE_DEPARTMENT, { data });

// Role APIs
export const getRoles = (page = 1, limit = 10) => {
  return api.get(url.GET_ROLES, { params: { page, limit } });
};
export const getRole = (id) => api.get(`${url.GET_ROLE}/${id}`);
export const createRole = (data) => api.create(url.POST_ROLE, data);
export const updateRole = (data) => {
  // Make sure we have the role ID
  if (!data.id) {
    throw new Error("Role ID is required for updating");
  }
  
  // Clone the data to avoid mutating the original
  const payload = { ...data };
  
  // Log the update request for debugging
  console.log(`Updating role ${data.id} with:`, payload);
  
  // Use PATCH method with ID in URL
  return api.patch(`${url.PUT_ROLE}/${data.id}`, payload);
};
export const deleteRole = (data) => api.delete(url.DELETE_ROLE, { data });

// Extract permissions from roles instead of a separate API call
export const getPermissions = async () => {
  // Get all roles with their permissions included
  const rolesResponse = await getRoles(1, 100); // Get up to 100 roles to collect all permissions
  
  if (rolesResponse.status && rolesResponse.data && rolesResponse.data.length > 0) {
    // Create a map to store unique permissions by ID
    const permissionsMap = new Map();
    
    // Extract all permissions from all roles
    rolesResponse.data.forEach(role => {
      if (role.permissions && Array.isArray(role.permissions)) {
        role.permissions.forEach(permission => {
          // Only add if we haven't seen this permission ID before
          if (!permissionsMap.has(permission.id)) {
            permissionsMap.set(permission.id, permission);
          }
        });
      }
    });
    
    // Convert Map values to array
    const uniquePermissions = Array.from(permissionsMap.values());
    
    // Sort permissions by ID
    uniquePermissions.sort((a, b) => a.id - b.id);
    
    // Return in the same format as the API would
    return {
      status: true,
      message: "Permissions extracted from roles",
      data: uniquePermissions
    };
  }
  
  // If we can't find any roles or permissions, return an empty array
  return {
    status: false,
    message: "No permissions found",
    data: []
  };
};

// User APIs
export const getUsers = (page = 1, limit = 10) => {
  return api.get(url.GET_USERS, { params: { page, limit } });
};
export const getUser = (id) => api.get(`${url.GET_USER}/${id}`);
export const createUser = (data) => api.create(url.POST_USER, data);
export const updateUser = (data) => {
  // Make sure we have the user ID
  if (!data.id) {
    throw new Error("User ID is required for updating");
  }
  
  // Clone the data to avoid mutating the original
  const payload = { ...data };
  
  // Log the update request for debugging
  console.log(`Updating user ${data.id} with:`, payload);
  
  // Use PATCH method with ID in URL
  return api.patch(`${url.PUT_USER}/${data.id}`, payload);
};
export const deleteUser = (data) => api.delete(url.DELETE_USER, { data });