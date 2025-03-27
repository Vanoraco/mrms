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
} from "reactstrap";
import { getRoles, createRole, updateRole, deleteRole, getPermissions } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const RoleSettings = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [],
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

  const fetchData = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRoles(page, size),
        getPermissions()
      ]);
      
      if (rolesResponse.status) {
        setRoles(rolesResponse.data || []);
        // Get total from meta object
        const total = rolesResponse.meta?.total || 0;
        const lastPage = rolesResponse.meta?.last_page || 1;
        setTotalRecords(total);
        setCurrentPage(rolesResponse.meta?.current_page || 1);
        setPageSize(rolesResponse.meta?.per_page || 10);
        setTotalPages(lastPage);
      }
      
      if (permissionsResponse.status) {
        setPermissions(permissionsResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || "Failed to fetch data");
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
        Header: "Description",
        accessor: (row) => truncateText(row.description, 50),
        sortable: true,
      },
      {
        Header: "Permissions",
        accessor: (row) => {
          const permCount = row.permissions?.length || 0;
          return `${permCount} permission${permCount !== 1 ? 's' : ''}`;
        },
        sortable: false,
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
      setFormData({ name: "", description: "", permissions: [] });
      setEditMode(false);
      setEditId(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, parseInt(value)],
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(id => id !== parseInt(value)),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      
      // Create a clean payload with the structure expected by the backend
      const payload = {
        id: editMode ? editId : undefined,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions // Send permission IDs array
      };
      
      console.log("Submitting role with payload:", payload);
      
      if (editMode) {
        await updateRole(payload);
        toast.success("Role updated successfully! 🔒");
      } else {
        await createRole(payload);
        toast.success("New role added successfully! 🔒");
      }
      toggleModal();
      fetchData(currentPage, pageSize); // Refresh current page
    } catch (error) {
      console.error('Error saving role:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      toast.error(error.message || "Failed to save role");
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (role) => {
    // Extract permission IDs
    const permissionIds = role.permissions?.map(p => p.id) || [];
    
    setFormData({
      name: role.name,
      description: role.description,
      permissions: permissionIds,
    });
    setEditMode(true);
    setEditId(role.id);
    setModal(true);
  };

  const handleDeleteClick = (role) => {
    setDeleteId(role.id);
    setDeleteName(role.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRole({ id: deleteId });
      toast.success("Role deleted successfully! ud83duddd1ufe0f");
      setDeleteModal(false);
      fetchData(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete role");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({ name: "", description: "", permissions: [] });
    setModal(true);
  };

  // Group permissions by their prefix (e.g., 'create user', 'update user' -> 'user')
  const groupedPermissions = useMemo(() => {
    const groups = {};
    
    permissions.forEach(permission => {
      // Extract the resource part (e.g., 'user' from 'create user')
      const parts = permission.name.split(' ');
      if (parts.length > 1) {
        const resource = parts.slice(1).join(' ');
        if (!groups[resource]) {
          groups[resource] = [];
        }
        groups[resource].push(permission);
      } else {
        // Handle permissions without a clear prefix-resource pattern
        if (!groups['other']) {
          groups['other'] = [];
        }
        groups['other'].push(permission);
      }
    });
    
    return groups;
  }, [permissions]);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Role Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Role List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                      disabled={updating}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Role
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
                      data={roles}
                      isGlobalFilter={true}
                      isGlobalSearch={true}
                      SearchPlaceholder="Search roles..."
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
          {editMode ? "Edit Role" : "Add Role"}
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
                    placeholder="Enter role name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={updating}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    placeholder="Enter role description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={updating}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Permissions</Label>
              <div className="permissions-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {Object.keys(groupedPermissions).length > 0 ? (
                  Object.entries(groupedPermissions).map(([resource, perms]) => (
                    <div key={resource} className="mb-3">
                      <h6 className="text-capitalize">{resource}</h6>
                      <div className="d-flex flex-wrap">
                        {perms.map(permission => (
                          <div key={permission.id} className="form-check me-3 mb-2">
                            <Input
                              type="checkbox"
                              id={`perm-${permission.id}`}
                              value={permission.id}
                              checked={formData.permissions.includes(permission.id)}
                              onChange={handlePermissionChange}
                              disabled={updating}
                            />
                            <Label className="form-check-label" for={`perm-${permission.id}`}>
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-3">
                    <p>No permissions available</p>
                  </div>
                )}
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
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default RoleSettings;
