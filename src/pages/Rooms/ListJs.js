import React, { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Input, Label, Modal, ModalBody, ModalHeader, Row, Table, Badge, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { createRoom, updateRoom, deleteRoom } from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";

const ListJs = ({ 
    rooms = [], 
    roomTypes = [], 
    roomFacilities = [], 
    departmentTypes = [], 
    onDelete = () => {} 
}) => {
    const [modal_list, setmodal_list] = useState(false);
    const [modal_delete, setmodal_delete] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        room_type_id: "",
        room_facility_ids: [],
        description: "",
        capacity: "",
        floor: "",
        status: "active"
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        // Filter rooms based on search term
        const filtered = (rooms || []).filter((room) =>
            Object.values(room).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredRooms(filtered);
    }, [rooms, searchTerm]);

    // Calculate pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggle = () => {
        setmodal_list(!modal_list);
        if (!modal_list) {
            setSelectedRoom(null);
            setFormData({
                name: "",
                room_type_id: "",
                room_facility_ids: [],
                description: "",
                capacity: "",
                floor: "",
                status: "active"
            });
        }
    };

    const toggleDelete = () => {
        setmodal_delete(!modal_delete);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedRoom) {
                await updateRoom(selectedRoom.id, formData);
                toast.success("Room updated successfully");
            } else {
                await createRoom(formData);
                toast.success("Room created successfully");
            }
            toggle();
            // Refresh the rooms list
            window.location.reload();
        } catch (error) {
            toast.error(error.message || "Failed to save room");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteRoom(selectedRoom.id);
            toast.success("Room deleted successfully");
            toggleDelete();
            // Refresh the rooms list
            window.location.reload();
        } catch (error) {
            toast.error(error.message || "Failed to delete room");
        }
    };

    const handleEdit = (room) => {
        setSelectedRoom(room);
        setFormData({
            name: room.name,
            room_type_id: room.room_type_id,
            room_facility_ids: room.room_facility_ids || [],
            description: room.description,
            capacity: room.capacity,
            floor: room.floor,
            status: room.status
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
                            placeholder="Search rooms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </Col>
                <Col sm={12} className="col-lg-auto">
                    <Button
                        color="success"
                        className="add-btn"
                        onClick={toggle}
                    >
                        <i className="ri-add-line align-bottom me-1"></i> Add Room
                    </Button>
                </Col>
            </Row>

            <div className="table-responsive table-card">
                <Table className="table align-middle table-nowrap table-hover mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Capacity</th>
                            <th scope="col">Floor</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((room) => (
                            <tr key={room.id}>
                                <td>{room.name}</td>
                                <td>
                                    {(roomTypes || []).find(type => type.id === room.room_type_id)?.name || "N/A"}
                                </td>
                                <td>{room.capacity}</td>
                                <td>{room.floor}</td>
                                <td>
                                    <span className={`badge bg-${room.status === "active" ? "success" : "danger"}`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        color="primary"
                                        className="btn-sm me-2"
                                        onClick={() => handleEdit(room)}
                                    >
                                        <i className="ri-edit-line"></i>
                                    </Button>
                                    <Button
                                        color="danger"
                                        className="btn-sm"
                                        onClick={() => {
                                            setSelectedRoom(room);
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
                    {selectedRoom ? "Edit Room" : "Add Room"}
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
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="room_type" className="form-label">Room Type</Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="room_type"
                                value={formData.room_type_id}
                                onChange={(e) => setFormData({ ...formData, room_type_id: e.target.value })}
                                required
                            >
                                <option value="">Select Room Type</option>
                                {(roomTypes || []).map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Input>
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="facilities" className="form-label">Facilities</Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="facilities"
                                multiple
                                value={formData.room_facility_ids}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, room_facility_ids: selectedOptions });
                                }}
                            >
                                {(roomFacilities || []).map((facility) => (
                                    <option key={facility.id} value={facility.id}>
                                        {facility.name}
                                    </option>
                                ))}
                            </Input>
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="capacity" className="form-label">Capacity</Label>
                            <Input
                                type="number"
                                className="form-control"
                                id="capacity"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="floor" className="form-label">Floor</Label>
                            <Input
                                type="text"
                                className="form-control"
                                id="floor"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <Label htmlFor="status" className="form-label">Status</Label>
                            <Input
                                type="select"
                                className="form-control"
                                id="status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                required
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Input>
                        </div>
                        <div className="text-end">
                            <Button type="button" color="light" onClick={toggle}>
                                Cancel
                            </Button>
                            <Button type="submit" color="primary" className="ms-2">
                                {selectedRoom ? "Update" : "Add"}
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={modal_delete} toggle={toggleDelete} className="modal-dialog-centered">
                <ModalHeader className="modal-title fw-bold" toggle={toggleDelete}>
                    Delete Room
                </ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this room?</p>
                </ModalBody>
                <div className="modal-footer">
                    <Button color="light" onClick={toggleDelete}>
                        Cancel
                    </Button>
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default ListJs; 