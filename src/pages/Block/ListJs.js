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

const ListJs = ({ blocks }) => {
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        campusId: "",
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
            // Add your API call here to create block
            toast.success("Block added successfully");
            toggle();
            setFormData({ name: "", description: "", campusId: "", status: "active" });
        } catch (error) {
            toast.error("Failed to add block");
        } finally {
            setLoading(false);
        }
    };

    const filteredBlocks = blocks.filter(block =>
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.campus.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="search-box">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search blocks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <Button color="primary" onClick={toggle}>
                        <i className="ri-add-line align-bottom me-1"></i> Add Block
                    </Button>
                </div>
            </div>

            <div className="table-responsive">
                <Table className="table align-middle table-nowrap table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Campus</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlocks.map((block) => (
                            <tr key={block.id}>
                                <td>{block.name}</td>
                                <td>{block.description}</td>
                                <td>{block.campus.name}</td>
                                <td>
                                    <span className={`badge bg-${block.status === 'active' ? 'success' : 'danger'}`}>
                                        {block.status}
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
                <ModalHeader toggle={toggle}>Add New Block</ModalHeader>
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
                            <Label for="campusId">Campus</Label>
                            <Input
                                type="select"
                                name="campusId"
                                id="campusId"
                                value={formData.campusId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Campus</option>
                                {/* Add campus options here */}
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
                            {loading ? <Spinner size="sm" /> : "Add Block"}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
};

export default ListJs; 