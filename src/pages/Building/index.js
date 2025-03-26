import React, { useEffect, useState } from "react";
import { getBuildings } from "../../helpers/fakebackend_helper";
import ListJs from "./ListJs";

const Building = () => {
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                setLoading(true);
                const response = await getBuildings();
                if (response?.data) {
                    setBuildings(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch buildings");
            } finally {
                setLoading(false);
            }
        };

        fetchBuildings();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h4 className="card-title mb-0">Building Management</h4>
                                </div>
                                <div className="card-body">
                                    <ListJs buildings={buildings} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Building; 