import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";
import ListJs from "../../components/Tables/ListJs";

const CampusList = () => {
    const [campuses, setCampuses] = useState([]);

    useEffect(() => {
        // TODO: Fetch campuses from API
        const sampleCampuses = [
            { id: 1, name: "Campus A", description: "Main Campus", blocks: 3 },
            { id: 2, name: "Campus B", description: "New Campus", blocks: 2 },
        ];
        setCampuses(sampleCampuses);
    }, []);

    const columns = [
        {
            Header: "Campus Name",
            accessor: "name",
        },
        {
            Header: "Description",
            accessor: "description",
        },
        {
            Header: "Number of Blocks",
            accessor: "blocks",
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: (cellProps) => {
                return (
                    <div className="d-flex gap-2">
                        <Link to={`/campus/${cellProps.value}/blocks`} className="btn btn-sm btn-soft-primary">
                            View Blocks
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
                                        <h4 className="card-title mb-0">AAU Campuses</h4>
                                        <button className="btn btn-primary">
                                            Add New Campus
                                        </button>
                                    </div>
                                    <ListJs
                                        columns={columns}
                                        data={campuses}
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

export default CampusList; 