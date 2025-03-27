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
import { getRoomFacilities, createRoomFacility, updateRoomFacility, deleteRoomFacility } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const RoomFacilitySettings = () => {
  const [roomFacilities, setRoomFacilities] = useState([]);
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

  const fetchRoomFacilities = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await getRoomFacilities(page, size);
      if (response.status) {
        setRoomFacilities(response.data || []);
        // Get total from meta object
        const total = response.meta?.total || 0;
        const lastPage = response.meta?.last_page || 1;
        setTotalRecords(total);
        setCurrentPage(response.meta?.current_page || 1);
        setPageSize(response.meta?.per_page || 10);
        setTotalPages(lastPage);
      }
    } catch (error) {
      console.error('Error fetching room facilities:', error);
      toast.error(error.message || "Failed to fetch room facilities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomFacilities(1, pageSize);
  }, []);

  const handlePageChange = (page) => {
    fetchRoomFacilities(page, pageSize); // Using the page directly since TableContainer now sends 1-based page numbers
  };

  const handlePerPageChange = (size) => {
    setPageSize(size);
    fetchRoomFacilities(1, size); // Reset to first page when changing page size
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
        await updateRoomFacility({ ...payload, id: editId });
        toast.success("Room facility updated successfully! 🖥️");
      } else {
        await createRoomFacility(payload);
        toast.success("New room facility added successfully! 🖥️");
      }
      toggleModal();
      fetchRoomFacilities(currentPage, pageSize); // Refresh current page
    } catch (error) {
      toast.error(error.message || "Failed to save room facility");
    } finally {
      setUpdating(false);
    }
  };

  const handleEdit = (roomFacility) => {
    setFormData({
      name: roomFacility.name,
      description: roomFacility.description,
    });
    setEditMode(true);
    setEditId(roomFacility.id);
    setModal(true);
  };

  const handleDeleteClick = (roomFacility) => {
    setDeleteId(roomFacility.id);
    setDeleteName(roomFacility.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRoomFacility({ id: deleteId });
      toast.success("Room facility deleted successfully! 🗑️");
      setDeleteModal(false);
      fetchRoomFacilities(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete room facility");
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
        <BreadCrumb title="Room Facility Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Room Facility List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                      disabled={updating}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Room Facility
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
                      data={roomFacilities}
                      isGlobalFilter={true}
                      isGlobalSearch={true}
                      SearchPlaceholder="Search room facilities..."
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
          {editMode ? "Edit Room Facility" : "Add Room Facility"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter room facility name"
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
                placeholder="Enter room facility description"
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
        title="Delete Room Facility"
        message={`Are you sure you want to delete the room facility "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default RoomFacilitySettings;
