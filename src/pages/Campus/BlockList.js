import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import ListJs from "../../components/Tables/ListJs";

const BlockList = () => {
    const [blocks, setBlocks] = useState([]);
    const { campusId } = useParams();

    useEffect(() => {
        // TODO: Fetch blocks from API based on campusId
        const sampleBlocks = [
            { id: 1, name: "Block 1", description: "Main Block", buildings: 2 },
            { id: 2, name: "Block 2", description: "Science Block", buildings: 1 },
            { id: 3, name: "Block 3", description: "Engineering Block", buildings: 1 },
        ];
        setBlocks(sampleBlocks);
    }, [campusId]);

    const columns = [
        {
            Header: "Block Name",
            accessor: "name",
        },
        {
            Header: "Description",
            accessor: "description",
        },
        {
            Header: "Number of Buildings",
            accessor: "buildings",
        },
        {
            Header: "Actions",
            accessor: "id",
            Cell: (cellProps) => {
                return (
                    <div className="d-flex gap-2">
                        <Link to={`/campus/${campusId}/block/${cellProps.value}/buildings`} className="btn btn-sm btn-soft-primary">
                            View Buildings
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
                                        <h4 className="card-title mb-0">Blocks in Campus {campusId}</h4>
                                        <button className="btn btn-primary">
                                            Add New Block
                                        </button>
                                    </div>
                                    <ListJs
                                        columns={columns}
                                        data={blocks}
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

export default BlockList; 