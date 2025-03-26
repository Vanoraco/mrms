import React, { useState, useEffect } from "react";
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
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  GET_ROOMS,
  GET_ROOM_TYPES,
  GET_DEPARTMENT_TYPES,
  POST_ROOM,
  PUT_ROOM,
  DELETE_ROOM,
  POST_ROOM_TYPE,
  PUT_ROOM_TYPE,
  DELETE_ROOM_TYPE,
  POST_DEPARTMENT_TYPE,
  PUT_DEPARTMENT_TYPE,
  DELETE_DEPARTMENT_TYPE,
} from "../../helpers/url_helper";
import ListJs from "./ListJs";

const Rooms = () => {
  const { buildingId } = useParams();
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [departmentTypes, setDepartmentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'room', 'roomType', 'departmentType'
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    capacity: "",
    roomTypeId: "",
    departmentTypeId: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, [buildingId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roomsRes, roomTypesRes, departmentTypesRes] = await Promise.all([
        fetch(GET_ROOMS + `?buildingId=${buildingId}`),
        fetch(GET_ROOM_TYPES),
        fetch(GET_DEPARTMENT_TYPES),
      ]);

      if (!roomsRes.ok || !roomTypesRes.ok || !departmentTypesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [roomsData, roomTypesData, departmentTypesData] = await Promise.all([
        roomsRes.json(),
        roomTypesRes.json(),
        departmentTypesRes.json(),
      ]);

      // Extract data from the API responses
      setRooms(roomsData.data || []);
      setRoomTypes(roomTypesData.data || []);
      setDepartmentTypes(departmentTypesData.data || []);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = (type) => {
    setModalType(type);
    setModal(!modal);
    if (!modal) {
      setFormData({
        name: "",
        code: "",
        capacity: "",
        roomTypeId: "",
        departmentTypeId: "",
        description: "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const data = {
        ...formData,
        buildingId,
      };

      switch (modalType) {
        case "room":
          response = await fetch(POST_ROOM, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          break;
        case "roomType":
          response = await fetch(POST_ROOM_TYPE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name, description: formData.description }),
          });
          break;
        case "departmentType":
          response = await fetch(POST_DEPARTMENT_TYPE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formData.name, description: formData.description }),
          });
          break;
        default:
          return;
      }

      if (!response.ok) {
        throw new Error("Failed to save data");
      }

      toast.success("Data saved successfully");
      toggleModal(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to save data");
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      let response;
      switch (type) {
        case "room":
          response = await fetch(DELETE_ROOM + `/${id}`, { method: "DELETE" });
          break;
        case "roomType":
          response = await fetch(DELETE_ROOM_TYPE + `/${id}`, { method: "DELETE" });
          break;
        case "departmentType":
          response = await fetch(DELETE_DEPARTMENT_TYPE + `/${id}`, { method: "DELETE" });
          break;
        default:
          return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      toast.success("Data deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete data");
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert color="danger">
        Error: {error}
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="card-title mb-0">Rooms</h4>
                    <div>
                      <Button
                        color="primary"
                        className="me-2"
                        onClick={() => toggleModal("room")}
                      >
                        Add Room
                      </Button>
                      <Button
                        color="success"
                        className="me-2"
                        onClick={() => toggleModal("roomType")}
                      >
                        Add Room Type
                      </Button>
                      <Button
                        color="info"
                        onClick={() => toggleModal("departmentType")}
                      >
                        Add Department Type
                      </Button>
                    </div>
                  </div>

                  <ListJs
                    rooms={rooms}
                    roomTypes={roomTypes}
                    departmentTypes={departmentTypes}
                    onDelete={handleDelete}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={modal} toggle={() => toggleModal(null)}>
        <ModalHeader toggle={() => toggleModal(null)}>
          {modalType === "room"
            ? "Add Room"
            : modalType === "roomType"
            ? "Add Room Type"
            : "Add Department Type"}
        </ModalHeader>
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
            {modalType === "room" && (
              <>
                <FormGroup>
                  <Label for="code">Code</Label>
                  <Input
                    type="text"
                    name="code"
                    id="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="capacity">Capacity</Label>
                  <Input
                    type="number"
                    name="capacity"
                    id="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="roomTypeId">Room Type</Label>
                  <Input
                    type="select"
                    name="roomTypeId"
                    id="roomTypeId"
                    value={formData.roomTypeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="departmentTypeId">Department Type</Label>
                  <Input
                    type="select"
                    name="departmentTypeId"
                    id="departmentTypeId"
                    value={formData.departmentTypeId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department Type</option>
                    {departmentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </>
            )}
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => toggleModal(null)}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default Rooms; 