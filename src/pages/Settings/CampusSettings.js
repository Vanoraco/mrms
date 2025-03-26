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
} from "reactstrap";
import { getCampuses, createCampus, updateCampus, deleteCampus } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const CampusSettings = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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

  const fetchCampuses = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await getCampuses(page, size);
      console.log('API Response:', response); // Debug log
      if (response.status) {
        setCampuses(response.data || []);
        // Get total from meta object
        const total = response.meta?.total || 0;
        const lastPage = response.meta?.last_page || 1;
        console.log('Total Records:', total, 'Last Page:', lastPage); // Debug log
        setTotalRecords(total);
        setCurrentPage(response.meta?.current_page || 1);
        setPageSize(response.meta?.per_page || 10);
        setTotalPages(lastPage);
      }
    } catch (error) {
      console.error('Error fetching campuses:', error); // Debug log
      toast.error(error.message || "Failed to fetch campuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses(1, pageSize);
  }, []);

  const handlePageChange = (page) => {
    console.log('Changing to page:', page); // Debug log
    fetchCampuses(page + 1, pageSize); // Add 1 because API uses 1-based indexing
  };

  const handlePerPageChange = (size) => {
    console.log('Changing page size to:', size); // Debug log
    setPageSize(size);
    fetchCampuses(1, size); // Reset to first page when changing page size
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
      setFormData({ name: "", description: "" });
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
      if (editMode) {
        await updateCampus({ ...payload, id: editId });
        toast.success("Campus updated successfully! 🏛️");
      } else {
        await createCampus(payload);
        toast.success("New campus added successfully! 🏛️");
      }
      toggleModal();
      fetchCampuses(currentPage, pageSize); // Refresh current page
    } catch (error) {
      toast.error(error.message || "Failed to save campus");
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (campus) => {
    setFormData({
      name: campus.name,
      description: campus.description,
    });
    setEditMode(true);
    setEditId(campus.id);
    setModal(true);
  };

  const handleDeleteClick = (campus) => {
    setDeleteId(campus.id);
    setDeleteName(campus.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCampus({ id: deleteId });
      toast.success("Campus deleted successfully! 🗑️");
      setDeleteModal(false);
      fetchCampuses(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete campus");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({ name: "", description: "" });
    setModal(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Campus Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Campus List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                      disabled={updating}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Campus
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
                      columns={[
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
                      ]}
                      data={campuses}
                      isGlobalFilter={true}
                      isGlobalSearch={true}
                      SearchPlaceholder="Search campuses..."
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

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editMode ? "Edit Campus" : "Add Campus"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter campus name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={updating}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter campus description"
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
        title="Delete Campus"
        message={`Are you sure you want to delete the campus "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default CampusSettings;
