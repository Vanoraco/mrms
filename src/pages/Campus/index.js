import React, { useEffect, useState } from "react";
import { getCampuses } from "../../helpers/fakebackend_helper";
import ListJs from "./ListJs";

const Campus = () => {
    const [campuses, setCampuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampuses = async () => {
            try {
                setLoading(true);
                const response = await getCampuses();
                if (response?.data) {
                    setCampuses(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch campuses");
            } finally {
                setLoading(false);
            }
        };

        fetchCampuses();
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
                                    <h4 className="card-title mb-0">Campus Management</h4>
                                </div>
                                <div className="card-body">
                                    <ListJs campuses={campuses} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Campus; 