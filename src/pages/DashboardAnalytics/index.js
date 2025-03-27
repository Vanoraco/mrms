import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import CountUp from "react-countup";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DashboardAnalytics = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        campuses: 0,
        buildings: 0,
        blocks: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem("authUser") 
                    ? JSON.parse(sessionStorage.getItem("authUser")).token 
                    : null;

                if (!token) {
                    toast.error('Authentication required');
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                const [campusesRes, buildingsRes, blocksRes] = await Promise.all([
                    fetch('https://aaurms.eotcssu.et/api/v1/campuses', { headers }),
                    fetch('https://aaurms.eotcssu.et/api/v1/buildings', { headers }),
                    fetch('https://aaurms.eotcssu.et/api/v1/blocks', { headers })
                ]);

                if (!campusesRes.ok || !buildingsRes.ok || !blocksRes.ok) {
                    throw new Error('One or more API requests failed');
                }

                const [campuses, buildings, blocks] = await Promise.all([
                    campusesRes.json(),
                    buildingsRes.json(),
                    blocksRes.json()
                ]);

                console.log('API Responses:', { campuses, buildings, blocks });

                setStats({
                    campuses: campuses.meta?.total || 0,
                    buildings: buildings.meta?.total || 0,
                    blocks: blocks.meta?.total || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error('Failed to load dashboard statistics');
                setStats({
                    campuses: 0,
                    buildings: 0,
                    blocks: 0
                });
            }
        };

        fetchStats();
    }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col>
                            <div className="h-100">
                                <Row>
                                    <Col xl={4}>
                                        <Card className="card-animate" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings-campuses')}>
                                            <CardBody>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                            Total Campuses
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-end justify-content-between mt-4">
                                                    <div>
                                                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                            <CountUp
                                                                start={0}
                                                                end={stats.campuses}
                                                                duration={2}
                                                                className="counter-value"
                                                            />
                                                        </h4>
                                                    </div>
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <span className="avatar-title bg-primary rounded fs-3">
                                                            <i className="bx bx-building"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xl={4}>
                                        <Card className="card-animate" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings-blocks')}>
                                            <CardBody>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                            Total Blocks
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-end justify-content-between mt-4">
                                                    <div>
                                                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                            <CountUp
                                                                start={0}
                                                                end={stats.blocks}
                                                                duration={2}
                                                                className="counter-value"
                                                            />
                                                        </h4>
                                                    </div>
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <span className="avatar-title bg-info rounded fs-3">
                                                            <i className="bx bx-buildings"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xl={4}>
                                        <Card className="card-animate" style={{ cursor: 'pointer' }} onClick={() => navigate('/settings-buildings')}>
                                            <CardBody>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1 overflow-hidden">
                                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                                            Total Buildings
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-end justify-content-between mt-4">
                                                    <div>
                                                        <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                                            <CountUp
                                                                start={0}
                                                                end={stats.buildings}
                                                                duration={2}
                                                                className="counter-value"
                                                            />
                                                        </h4>
                                                    </div>
                                                    <div className="avatar-sm flex-shrink-0">
                                                        <span className="avatar-title bg-success rounded fs-3">
                                                            <i className="bx bx-home-circle"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardAnalytics;