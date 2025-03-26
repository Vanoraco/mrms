import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Table, Badge, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { toast } from "react-toastify";

const ListJs = ({ campuses, onDelete }) => {
    const [modal_list, setmodal_list] = useState(false);
    const [modal_delete, setmodal_delete] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        // Filter campuses based on search term
        const filtered = campuses.filter((campus) =>
            Object.values(campus).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredCampuses(filtered);
    }, [campuses, searchTerm]);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCampuses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCampuses.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggle = () => {
        setmodal_list(!modal_list);
        if (!modal_list) {
            setSelectedCampus(null);
            setFormData({
                name: "",
                description: "",
                status: "active"
            });
        }
    };

    const toggleDelete = () => {
        setmodal_delete(!modal_delete);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Implement create/update campus API call
            toast.success("Campus saved successfully");
            toggle();
            onDelete();
        } catch (error) {
            toast.error(error.message || "Failed to save campus");
        }
    };

    const handleDelete = async () => {
        try {
            // TODO: Implement delete campus API call
            toast.success("Campus deleted successfully");
            toggleDelete();
            onDelete();
        } catch (error) {
            toast.error(error.message || "Failed to delete campus");
        }
    };

    const handleEdit = (campus) => {
        setSelectedCampus(campus);
        setFormData({
            name: campus.name,
            description: campus.description,
            status: campus.status
        });
        toggle();
    };

    return (
        <React.Fragment>
            <Row className="mb-3">
                <Col sm={12} className="col-lg">
                    <div className="search-box">
                        <Input
                            type="text"
                            className="form-control"
                            placeholder="Search campuses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </Col>
            </Row>

            <div className="table-responsive table-card">
                <Table className="table align-middle table-nowrap table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((campus) => (
                            <tr key={campus.id}>
                                <td>{campus.name}</td>
                                <td>{campus.description}</td>
                                <td>
                                    <span className={`badge bg-${campus.status === "active" ? "success" : "danger"}`}>
                                        {campus.status}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        color="primary"
                                        className="btn-sm me-2"
                                        onClick={() => handleEdit(campus)}
                                    >
                                        <i className="ri-edit-line"></i>
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="btn-sm"
                                        onClick={() => {
                                            setSelectedCampus(campus);
                                            toggleDelete();
                                        }}
                                    >
                                        <i className="ri-delete-bin-line"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {totalPages > 1 && (
                <Pagination className="pagination pagination-rounded justify-content-center mt-3">
                    <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink
                            previous
                            onClick={() => handlePageChange(currentPage - 1)}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index} active={currentPage === index + 1}>
                            <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink
                            next
                            onClick={() => handlePageChange(currentPage + 1)}
                        />
                    </PaginationItem>
                </Pagination>
            )}

            {/* Add/Edit Modal */}
            <Modal isOpen={modal_list} toggle={toggle} className="modal-dialog-centered">
                <ModalHeader className="modal-title fw-bold" toggle={toggle}>
                    {selectedCampus ? "Edit Campus" : "Add Campus"}
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <Label htmlFor="name" className="form-label">Name</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="description" className="form-label">Description</Label>
                            <Input
                                type="textarea"
                                className="form-control"
                                id="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="status" className="form-label">Status</Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Input>
                        </div>
                        <div className="text-end">
                            <Button type="submit" color="success" className="me-2">
                                {selectedCampus ? "Update" : "Add"} Campus
                            </Button>
                            <Button color="danger" onClick={toggle}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={modal_delete} toggle={toggleDelete} className="modal-dialog-centered">
                <ModalHeader className="modal-title fw-bold" toggle={toggleDelete}>
                    Delete Campus
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this campus?</p>
                </ModalBody>
                <div className="modal-footer">
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button color="secondary" onClick={toggleDelete}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default ListJs; 