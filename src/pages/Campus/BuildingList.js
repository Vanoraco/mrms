import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import ListJs from "../../components/Tables/ListJs";

const BuildingList = () => {
    const [buildings, setBuildings] = useState([]);
    const { campusId, blockId } = useParams();

    useEffect(() => {
        // TODO: Fetch buildings from API based on campusId and blockId
        const sampleBuildings = [
            { id: 1, name: "Building X", description: "Main Building", rooms: 10 },
            { id: 2, name: "Building Y", description: "Science Building", rooms: 8 },
            { id: 3, name: "Building Z", description: "Engineering Building", rooms: 12 },
        ];
        setBuildings(sampleBuildings);
    }, [campusId, blockId]);

    const columns = [
        {
            Header: "Building Name",
            accessor: "name",
        },
        {
            Header: "Description",
            accessor: "description",
        },
        {
            Header: "Number of Rooms",
            accessor: "rooms",
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: (cellProps) => {
                return (
                    <div className="d-flex gap-2">
                        <Link to={`/building/${cellProps.value}/rooms`} className="btn btn-sm btn-soft-primary">
                            View Rooms
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
                                        <h4 className="card-title mb-0">Buildings in Block {blockId}</h4>
                                        <button className="btn btn-primary">
                                            Add New Building
                                        </button>
                                    </div>
                                    <ListJs
                                        columns={columns}
                                        data={buildings}
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

export default BuildingList; 