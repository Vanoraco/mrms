import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import ListJs from "../components/Tables/ListJs";

const BuildingRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [buildingId, setBuildingId] = useState(null);

    useEffect(() => {
        // Get building ID from URL
        const path = window.location.pathname;
        const id = path.split('/')[2];
        setBuildingId(id);

        // TODO: Fetch rooms data from API
        // This is sample data - replace with actual API call
        const sampleRooms = [
            { id: 1, name: "Room 101", type: "Classroom", capacity: 50, status: "Available" },
            { id: 2, name: "Room 102", type: "Office", capacity: 20, status: "Occupied" },
            { id: 3, name: "Room 103", type: "Meeting Hall", capacity: 100, status: "Available" },
        ];
        setRooms(sampleRooms);
    }, []);

    const columns = [
        {
            Header: "Room Name",
            accessor: "name",
        },
        {
            Header: "Type",
            accessor: "type",
        },
        {
            Header: "Capacity",
            accessor: "capacity",
        },
        {
            Header: "Status",
            accessor: "status",
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: (cellProps) => {
                return (
                    <div className="d-flex gap-2">
                        <Link to={`/room/${cellProps.value}`} className="btn btn-sm btn-soft-primary">
                            View
                        </Link>
                        <button className="btn btn-sm btn-soft-success">
                            Edit
                        </button>
                        <button className="btn btn-sm btn-soft-danger">
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="card-title mb-0">Rooms in Building {buildingId}</h4>
                                        <button className="btn btn-primary">
                                            Add New Room
                                        </button>
                                    </div>
                                    <ListJs
                                        columns={columns}
                                        data={rooms}
                                        isGlobalFilter={true}
                                        isAddOptions={false}
                                        customPageSize={10}
                                        className="custom-header-css table align-middle table-nowrap"
                                        tableClassName="table-centered table-nowrap mb-0"
                                        theadClassName="table-light"
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default BuildingRooms; 