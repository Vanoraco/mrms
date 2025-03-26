import React, { useEffect, useState } from "react";
import { getBlocks } from "../../helpers/fakebackend_helper";
import ListJs from "./ListJs";

const Block = () => {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                setLoading(true);
                const response = await getBlocks();
                if (response?.data) {
                    setBlocks(response.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch blocks");
            } finally {
                setLoading(false);
            }
        };

        fetchBlocks();
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
                                    <h4 className="card-title mb-0">Block Management</h4>
                                </div>
                                <div className="card-body">
                                    <ListJs blocks={blocks} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Block; 