import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  FormFeedback,
  Badge,
} from "reactstrap";
import { getUsers, createUser, updateUser, deleteUser, getRoles, getDepartments } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { formatDate } from "../../utils";
import { truncateText } from "../../utils/truncateText";

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    department_id: "",
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  const fetchData = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      
      // Check if token exists before making API calls
      const authUser = sessionStorage.getItem("authUser");
      const token = authUser ? JSON.parse(authUser).token : sessionStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      
      console.log("Fetching users with token:", token.substring(0, 15) + "...");
      
      // First, fetch users and roles
      const [usersResponse, rolesResponse] = await Promise.all([
        getUsers(page, size),
        getRoles()
      ]);
      
      // Then try to fetch departments, but handle the case if it fails
      let departmentsData = [];
      try {
        const departmentsResponse = await getDepartments();
        if (departmentsResponse.status) {
          departmentsData = departmentsResponse.data || [];
        }
      } catch (depError) {
        console.error('Error fetching departments:', depError);
        // Don't show error toast for departments, just log it
      }
      
      if (usersResponse.status) {
        setUsers(usersResponse.data || []);
        // Get total from meta object
        const total = usersResponse.meta?.total || 0;
        const lastPage = usersResponse.meta?.last_page || 1;
        setTotalRecords(total);
        setCurrentPage(usersResponse.meta?.current_page || 1);
        setPageSize(usersResponse.meta?.per_page || 10);
        setTotalPages(lastPage);
      }
      
      if (rolesResponse.status) {
        setRoles(rolesResponse.data || []);
      }
      
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      let errorMessage = "Failed to fetch data";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to access this resource.";
        } else if (error.response.status === 404) {
          errorMessage = "Resource not found. Please check API endpoint.";
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response received from server. Please check your connection.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
  }, []);

  const handlePageChange = (page) => {
    fetchData(page, pageSize); // Using the page directly since TableContainer now sends 1-based page numbers
  };

  const handlePerPageChange = (size) => {
    setPageSize(size);
    fetchData(1, size); // Reset to first page when changing page size
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Role",
        accessor: (row) => row.role?.name || "N/A",
        sortable: false,
      },
      {
        Header: "Department",
        accessor: (row) => row.department?.name || "N/A",
        sortable: false,
      },
      {
        Header: "Status",
        accessor: (row) => (
          <Badge color={row.is_active ? "success" : "danger"} className="badge-soft-success">
            {row.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
        sortable: false,
      },
      {
        Header: "Created",
        accessor: (row) => formatDate(row.created_at),
        sortable: true,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="d-flex gap-2">
            <Button
              color="info"
              size="sm"
              className="btn-soft-info"
              onClick={() => handleEdit(row.original)}
            >
              <i className="ri-edit-line"></i>
            </Button>
            <Button
              color="danger"
              size="sm"
              className="btn-soft-danger"
              onClick={() => handleDeleteClick(row.original)}
            >
              <i className="ri-delete-bin-line"></i>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_id: "",
      department_id: "",
      is_active: true,
    });
    setFormErrors({});
    setEditMode(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear field-specific error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!editMode && !formData.password) errors.password = "Password is required";
    if (!editMode && formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "Passwords don't match";
    }
    if (!formData.role_id) errors.role_id = "Role is required";
    // Make department field optional
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setUpdating(true);
      const payload = { ...formData };
      
      // If editing and no new password is provided, remove password fields
      if (editMode && !payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      
      // Add debugging logs
      console.log("User payload:", payload);
      
      if (editMode) {
        // Ensure ID is included in the payload for updates
        await updateUser({ ...payload, id: editId });
        toast.success("User updated successfully! 👤");
      } else {
        await createUser(payload);
        toast.success("New user added successfully! 👤");
      }
      toggleModal();
      fetchData(currentPage, pageSize); // Refresh current page
    } catch (error) {
      console.error("Error saving user:", error);
      
      // Handle validation errors from API
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        toast.error(error.message || "Failed to save user");
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password
      password_confirmation: "",
      role_id: user.role_id || "",
      department_id: user.department_id || "",
      is_active: user.is_active === undefined ? true : user.is_active,
    });
    setEditMode(true);
    setEditId(user.id);
    setModal(true);
  };

  const handleDeleteClick = (user) => {
    setDeleteId(user.id);
    setDeleteName(user.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser({ id: deleteId });
      toast.success("User deleted successfully! ud83duddd1ufe0f");
      setDeleteModal(false);
      fetchData(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    resetForm();
    setModal(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="User Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">User List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                      disabled={updating}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add User
                    </Button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner color="primary">
                      Loading...
                    </Spinner>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <TableContainer
                      columns={columns}
                      data={users}
                      isGlobalFilter={true}
                      isGlobalSearch={true}
                      SearchPlaceholder="Search users..."
                      customPageSize={pageSize}
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      theadClass="table-light table-nowrap"
                      thClass="table-light text-muted"
                      pagination={true}
                      paginationPageSize={pageSize}
                      paginationTotalRows={totalRecords}
                      paginationPerPage={pageSize}
                      paginationRowsPerPageOptions={[10, 25, 50, 100]}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handlePerPageChange}
                      serverPagination={true}
                      totalRecords={totalRecords}
                      totalPages={totalPages}
                      currentPage={currentPage}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {editMode ? "Edit User" : "Add User"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter user name"
                    value={formData.name}
                    onChange={handleInputChange}
                    invalid={!!formErrors.name}
                    disabled={updating}
                  />
                  {formErrors.name && <FormFeedback>{formErrors.name}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter user email"
                    value={formData.email}
                    onChange={handleInputChange}
                    invalid={!!formErrors.email}
                    disabled={updating}
                  />
                  {formErrors.email && <FormFeedback>{formErrors.email}</FormFeedback>}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="password">{editMode ? "New Password (leave blank to keep current)" : "Password"}</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder={editMode ? "Enter new password" : "Enter password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    invalid={!!formErrors.password}
                    disabled={updating}
                    required={!editMode}
                  />
                  {formErrors.password && <FormFeedback>{formErrors.password}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="password_confirmation">Confirm Password</Label>
                  <Input
                    type="password"
                    name="password_confirmation"
                    id="password_confirmation"
                    placeholder="Confirm password"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    invalid={!!formErrors.password_confirmation}
                    disabled={updating}
                    required={!editMode && !!formData.password}
                  />
                  {formErrors.password_confirmation && (
                    <FormFeedback>{formErrors.password_confirmation}</FormFeedback>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="role_id">Role</Label>
                  <Input
                    type="select"
                    name="role_id"
                    id="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    invalid={!!formErrors.role_id}
                    disabled={updating}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Input>
                  {formErrors.role_id && <FormFeedback>{formErrors.role_id}</FormFeedback>}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="department_id">Department {departments.length === 0 && "(Not Available)"}</Label>
                  <Input
                    type="select"
                    name="department_id"
                    id="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    invalid={!!formErrors.department_id}
                    disabled={updating || departments.length === 0}
                  >
                    <option value="">Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </Input>
                  {formErrors.department_id && <FormFeedback>{formErrors.department_id}</FormFeedback>}
                  {departments.length === 0 && (
                    <small className="text-muted">
                      Departments are not configured in the system.
                    </small>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup className="mt-2">
              <div className="form-check">
                <Input
                  type="checkbox"
                  className="form-check-input"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  disabled={updating}
                />
                <Label className="form-check-label" for="is_active">
                  User is active
                </Label>
              </div>
            </FormGroup>

            <div className="text-end mt-3">
              <Button color="light" onClick={toggleModal} className="me-2" disabled={updating}>
                Cancel
              </Button>
              <Button color="primary" type="submit" disabled={updating}>
                {updating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {editMode ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editMode ? "Update" : "Add"
                )}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <ConfirmationDialog
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        title="Delete User"
        message={`Are you sure you want to delete the user "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default UserSettings;
