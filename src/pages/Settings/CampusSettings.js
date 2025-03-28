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
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchCampuses, 
  createCampusAsync, 
  updateCampusAsync, 
  deleteCampusAsync 
} from "../../slices/settings/reducer";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const CampusSettings = () => {
  const dispatch = useDispatch();
  const { campuses, loading, error, pagination } = useSelector((state) => state.Settings);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  useEffect(() => {
    dispatch(fetchCampuses({ page: 1, size: pagination.pageSize }));
  }, [dispatch, pagination.pageSize]);

  const handlePageChange = (page) => {
    dispatch(fetchCampuses({ page, size: pagination.pageSize }));
  };

  const handlePerPageChange = (size) => {
    dispatch(fetchCampuses({ page: 1, size }));
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
      if (editMode) {
        await dispatch(updateCampusAsync({ ...formData, id: editId })).unwrap();
        toast.success("Campus updated successfully! 🏛️");
      } else {
        await dispatch(createCampusAsync(formData)).unwrap();
        toast.success("New campus added successfully! 🏛️");
      }
      toggleModal();
      dispatch(fetchCampuses({ page: pagination.currentPage, size: pagination.pageSize }));
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
      await dispatch(deleteCampusAsync({ id: deleteId })).unwrap();
      toast.success("Campus deleted successfully! 🗑️");
      setDeleteModal(false);
      dispatch(fetchCampuses({ page: pagination.currentPage, size: pagination.pageSize }));
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
                      columns={columns}
                      data={campuses}
                      isGlobalFilter={true}
                      isGlobalSearch={true}
                      SearchPlaceholder="Search campuses..."
                      customPageSize={pagination.pageSize}
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      theadClass="table-light table-nowrap"
                      thClass="table-light text-muted"
                      pagination={true}
                      paginationPageSize={pagination.pageSize}
                      paginationTotalRows={pagination.totalRecords}
                      paginationPerPage={pagination.pageSize}
                      paginationRowsPerPageOptions={[10, 25, 50, 100]}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handlePerPageChange}
                      serverPagination={true}
                      totalRecords={pagination.totalRecords}
                      totalPages={pagination.totalPages}
                      currentPage={pagination.currentPage}
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
