import React, { useState } from "react";
import {
    Table,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner
} from "reactstrap";
import { toast } from "react-toastify";

const ListJs = ({ buildings }) => {
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        blockId: "",
        status: "active"
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggle = () => setModal(!modal);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Add your API call here to create building
            toast.success("Building added successfully");
            toggle();
            setFormData({ name: "", description: "", blockId: "", status: "active" });
        } catch (error) {
            toast.error("Failed to add building");
        } finally {
            setLoading(false);
        }
    };

    const filteredBuildings = buildings.filter(building =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.block.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search buildings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <Button color="primary" onClick={toggle}>
                        <i className="ri-add-line align-bottom me-1"></i> Add Building
                    </Button>
                </div>
            </div>

            <div className="table-responsive">
                <Table className="table align-middle table-nowrap table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Block</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBuildings.map((building) => (
                            <tr key={building.id}>
                                <td>{building.name}</td>
                                <td>{building.description}</td>
                                <td>{building.block.name}</td>
                                <td>
                                    <span className={`badge bg-${building.status === 'active' ? 'success' : 'danger'}`}>
                                        {building.status}
                                    </span>
                                </td>
                                <td>
                                    <Button color="primary" size="sm" className="me-2">
                                        <i className="ri-edit-line"></i>
                                    </Button>
                                    <Button color="danger" size="sm">
                                        <i className="ri-delete-bin-line"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add New Building</ModalHeader>
                <Form onSubmit={handleSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
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
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="blockId">Block</Label>
                            <Input
                                type="select"
                                name="blockId"
                                id="blockId"
                                value={formData.blockId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Block</option>
                                {/* Add block options here */}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="status">Status</Label>
                            <Input
                                type="select"
                                name="status"
                                id="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Cancel</Button>
                        <Button color="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : "Add Building"}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
};

export default ListJs; 