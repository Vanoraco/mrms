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
  Alert,
} from "reactstrap";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment, getDepartmentTypes } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const DepartmentSettings = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department_type_id: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  const [tableError, setTableError] = useState(null);

  const fetchData = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      setTableError(null);
      
      // Check if token exists before making API calls
      const authUser = sessionStorage.getItem("authUser");
      const token = authUser ? JSON.parse(authUser).token : sessionStorage.getItem("token");
      
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }
      
      console.log("Fetching departments with token:", token.substring(0, 15) + "...");
      
      try {
        const [departmentsResponse, departmentTypesResponse] = await Promise.all([
          getDepartments(page, size),
          getDepartmentTypes()
        ]);
        
        if (departmentsResponse.status) {
          setDepartments(departmentsResponse.data || []);
          // Get total from meta object
          const total = departmentsResponse.meta?.total || 0;
          const lastPage = departmentsResponse.meta?.last_page || 1;
          setTotalRecords(total);
          setCurrentPage(departmentsResponse.meta?.current_page || 1);
          setPageSize(departmentsResponse.meta?.per_page || 10);
          setTotalPages(lastPage);
        }
        
        if (departmentTypesResponse.status) {
          setDepartmentTypes(departmentTypesResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Check for specific error about missing table
        if (error.response?.data?.message?.includes("Table 'eotcssue_fdms.departments' doesn't exist")) {
          setTableError("The departments table doesn't exist in the database. Please run the migration to create it.");
        } else {
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
        }
      }
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
        Header: "Type",
        accessor: (row) => row.department_type?.name || "N/A",
        sortable: true,
      },
      {
        Header: "Description",
        accessor: (row) => truncateText(row.description, 50),
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
      setFormData({ name: "", description: "", department_type_id: "" });
      setEditMode(false);
      setEditId(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const payload = { ...formData };
      
      console.log("Department payload:", payload);
      
      if (editMode) {
        await updateDepartment({ ...payload, id: editId });
        toast.success("Department updated successfully! 🏢");
      } else {
        await createDepartment(payload);
        toast.success("New department added successfully! 🏢");
      }
      toggleModal();
      fetchData(currentPage, pageSize); // Refresh current page
    } catch (error) {
      console.error("Error saving department:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      toast.error(error.message || "Failed to save department");
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (department) => {
    setFormData({
      name: department.name,
      description: department.description,
      department_type_id: department.department_type_id || "",
    });
    setEditMode(true);
    setEditId(department.id);
    setModal(true);
  };

  const handleDeleteClick = (department) => {
    setDeleteId(department.id);
    setDeleteName(department.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment({ id: deleteId });
      toast.success("Department deleted successfully! 🗑️");
      setDeleteModal(false);
      fetchData(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete department");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({ name: "", description: "", department_type_id: "" });
    setModal(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Department Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Department List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                      disabled={updating || tableError}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Department
                    </Button>
                  </div>
                </div>
                
                {tableError && (
                  <Alert color="danger">
                    <div>
                      <h4 className="alert-heading">Database Error</h4>
                      <p>{tableError}</p>
                      <hr />
                      <p className="mb-0">
                        Please contact your system administrator to run the database migration or create the departments table.
                      </p>
                    </div>
                  </Alert>
                )}
                
                {loading ? (
                  <div className="text-center my-4">
                    <Spinner color="primary">
                      Loading...
                    </Spinner>
                  </div>
                ) : (
                  !tableError && (
                    <div className="table-responsive">
                      <TableContainer
                        columns={columns}
                        data={departments}
                        isGlobalFilter={true}
                        isGlobalSearch={true}
                        SearchPlaceholder="Search departments..."
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
                  )
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editMode ? "Edit Department" : "Add Department"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter department name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={updating}
              />
            </FormGroup>
            <FormGroup>
              <Label for="department_type_id">Department Type</Label>
              <Input
                type="select"
                name="department_type_id"
                id="department_type_id"
                value={formData.department_type_id}
                onChange={handleInputChange}
                required
                disabled={updating}
              >
                <option value="">Select Department Type</option>
                {departmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter department description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={updating}
              />
            </FormGroup>
            <div className="text-end">
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
        title="Delete Department"
        message={`Are you sure you want to delete the department "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default DepartmentSettings;
