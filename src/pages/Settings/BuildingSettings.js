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
import { getBuildings, createBuilding, updateBuilding, deleteBuilding } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import ConfirmationDialog from "../../Components/Common/ConfirmationDialog";
import { truncateText } from "../../utils/truncateText";

const BuildingSettings = () => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    length: "",
    width: "",
    floors: "",
    basements: "",
    remarks: "",
    block_id: "",
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
        Header: "Block",
        accessor: "block.name",
        sortable: true,
      },
      {
        Header: "Campus",
        accessor: "block.campus.name",
        sortable: true,
      },
      {
        Header: "Area",
        accessor: "area",
        sortable: true,
        Cell: ({ row }) => (
          <div>
            {`${row.original.length * row.original.width}m²`}
          </div>
        ),
      },
      {
        Header: "Floors",
        accessor: "floors",
        sortable: true,
        Cell: ({ row }) => (
          <div>
            {`${row.original.floors} floors, ${row.original.basements} basement${row.original.basements !== 1 ? 's' : ''}`}
          </div>
        ),
      },
      {
        Header: "Created By",
        accessor: "created_by.name",
        sortable: true,
      },
      {
        Header: "Updated By",
        accessor: "updated_by.name",
        sortable: true,
      },
      {
        Header: "Remarks",
        accessor: (row) => truncateText(row.remarks, 30),
        sortable: true,
      },
    ],
    []
  );

  const fetchBuildings = async (page = 1, size = 10) => {
    try {
      setLoading(true);
      const response = await getBuildings(page, size);
      console.log('API Response:', response); // Debug log
      if (response.status) {
        setBuildings(response.data || []);
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
      console.error('Error fetching buildings:', error); // Debug log
      toast.error(error.message || "Failed to fetch buildings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings(1, pageSize);
  }, []);

  const handlePageChange = (page) => {
    console.log('Changing to page:', page); // Debug log
    fetchBuildings(page + 1, pageSize); // Add 1 because API uses 1-based indexing
  };

  const handlePerPageChange = (size) => {
    console.log('Changing page size to:', size); // Debug log
    setPageSize(size);
    fetchBuildings(1, size); // Reset to first page when changing page size
  };

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({
        name: "",
        description: "",
        length: "",
        width: "",
        floors: "",
        basements: "",
        remarks: "",
        block_id: "",
      });
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
      const payload = {
        ...formData,
        length: Number(formData.length),
        width: Number(formData.width),
        floors: Number(formData.floors),
        basements: Number(formData.basements),
      };

      if (editMode) {
        await updateBuilding({ ...payload, id: editId });
        toast.success("Building updated successfully! 🏗️");
      } else {
        await createBuilding(payload);
        toast.success("New building added successfully! 🏗️");
      }
      toggleModal();
      fetchBuildings(currentPage, pageSize); // Refresh current page
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save building");
    }
  };

  const handleEdit = (building) => {
    setFormData({
      name: building.name,
      description: building.description,
      length: building.length,
      width: building.width,
      floors: building.floors,
      basements: building.basements,
      remarks: building.remarks,
      block_id: building.block.id,
    });
    setEditMode(true);
    setEditId(building.id);
    setModal(true);
  };

  const handleDeleteClick = (building) => {
    setDeleteId(building.id);
    setDeleteName(building.name);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteBuilding({ id: deleteId });
      toast.success("Building deleted successfully! 🗑️");
      setDeleteModal(false);
      fetchBuildings(currentPage, pageSize);
    } catch (error) {
      console.error("Error deleting building:", error);
      toast.error("Failed to delete building");
    }
  };

  const handleAddClick = () => {
    setEditMode(false);
    setFormData({
      name: "",
      description: "",
      length: "",
      width: "",
      floors: "",
      basements: "",
      remarks: "",
      block_id: "",
    });
    setModal(true);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Building Settings" pageTitle="Settings" />
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-3">
                  <h5 className="card-title mb-0 flex-grow-1">Building List</h5>
                  <div className="flex-shrink-0">
                    <Button
                      color="primary"
                      className="btn-rounded mb-2 me-2"
                      onClick={handleAddClick}
                    >
                      <i className="mdi mdi-plus me-1" />
                      Add Building
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
                      ...columns.slice(0, -1),
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
                    data={buildings}
                    isGlobalFilter={true}
                    isGlobalSearch={true}
                    SearchPlaceholder="Search buildings..."
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
          {editMode ? "Edit Building" : "Add Building"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter building name"
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
                placeholder="Enter building description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="length">Length (m)</Label>
                  <Input
                    type="number"
                    name="length"
                    id="length"
                    placeholder="Enter length"
                    value={formData.length}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="width">Width (m)</Label>
                  <Input
                    type="number"
                    name="width"
                    id="width"
                    placeholder="Enter width"
                    value={formData.width}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="floors">Floors</Label>
                  <Input
                    type="number"
                    name="floors"
                    id="floors"
                    placeholder="Enter number of floors"
                    value={formData.floors}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="basements">Basements</Label>
                  <Input
                    type="number"
                    name="basements"
                    id="basements"
                    placeholder="Enter number of basements"
                    value={formData.basements}
                    onChange={handleInputChange}
                    required
                    min="0"
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="remarks">Remarks</Label>
              <Input
                type="textarea"
                name="remarks"
                id="remarks"
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={handleInputChange}
              />
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
        title="Delete Building"
        message={`Are you sure you want to delete the building "${deleteName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
        cancelColor="light"
      />
    </div>
  );
};

export default BuildingSettings;
