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
import { getBlocks, createBlock, updateBlock, deleteBlock, getCampuses } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const BlockSettings = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    campus_id: "",
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
  const [campuses, setCampuses] = useState([]);

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
        Header: "Campus",
        accessor: "campus.name",
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

  const fetchBlocks = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await getBlocks(page, size);
      console.log('API Response:', response); // Debug log
      if (response.status) {
        setBlocks(response.data || []);
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
      console.error('Error fetching blocks:', error); // Debug log
      toast.error(error.message || "Failed to fetch blocks");
    } finally {
      setLoading(false);
    }
  };

  const fetchCampuses = async () => {
    try {
      const response = await getCampuses();
      if (response.status) {
        setCampuses(response.data || []);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch campuses");
    }
  };

  useEffect(() => {
    fetchCampuses();
    fetchBlocks(1, pageSize);
  }, []);

  const handlePageChange = (page) => {
    console.log('Changing to page:', page); // Debug log
    fetchBlocks(page + 1, pageSize); // Add 1 because API uses 1-based indexing
  };

  const handlePerPageChange = (size) => {
    console.log('Changing page size to:', size); // Debug log
    setPageSize(size);
    fetchBlocks(1, size); // Reset to first page when changing page size
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({ name: "", description: "", campus_id: "" });
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
      const payload = { ...formData };
      if (editMode) {
        await updateBlock({ ...payload, id: editId });
        toast.success("Block updated successfully! 🏢");
      } else {
        await createBlock(payload);
        toast.success("New block added successfully! 🏢");
      }
      toggleModal();
      fetchBlocks(currentPage, pageSize); // Refresh current page
    } catch (error) {
      toast.error(error.message || "Failed to save block");
    }
  };

  const handleEdit = (block) => {
    setFormData({
      name: block.name,
      description: block.description,
      campus_id: block.campus.id,
    });
    setEditMode(true);
    setEditId(block.id);
    setModal(true);
  };

  const handleDeleteClick = (block) => {
    setDeleteId(block.id);
    setDeleteName(block.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBlock({ id: deleteId });
      toast.success("Block deleted successfully! 🗑️");
      setDeleteModal(false);
      fetchBlocks(currentPage, pageSize);
    } catch (error) {
      toast.error(error.message || "Failed to delete block");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({ name: "", description: "", campus_id: "" });
    setModal(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Block Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Block List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Block
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
                        Header: "Campus",
                        accessor: "campus.name",
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
                    data={blocks}
                    isGlobalFilter={true}
                    isGlobalSearch={true}
                    SearchPlaceholder="Search blocks..."
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
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {editMode ? "Edit Block" : "Add Block"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter block name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter block description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="campus_id">Campus</Label>
              <Input
                type="select"
                name="campus_id"
                id="campus_id"
                value={formData.campus_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Campus</option>
                {campuses.map((campus) => (
                  <option key={campus.id} value={campus.id}>
                    {campus.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <div className="text-end">
              <Button color="light" onClick={toggleModal} className="me-2">
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {editMode ? "Update" : "Add"}
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>

      <ConfirmationDialog
        isOpen={deleteModal}
        toggle={() => setDeleteModal(false)}
        title="Delete Block"
        message={`Are you sure you want to delete the block "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default BlockSettings;
