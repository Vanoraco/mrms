import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCampuses, getBlocks, getBuildings } from "../helpers/fakebackend_helper";
import { getLoggedinUser } from "../helpers/api_helper";

const Navdata = () => {
    const history = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);
    const [isSettings, setIsSettings] = useState(false);

    // Data states
    const [campuses, setCampuses] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [isCampusOpen, setIsCampusOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    // Reset all other states when one is active
    const resetStates = () => {
        setIsDashboard(false);
        setIsApps(false);
        setIsAuth(false);
        setIsPages(false);
        setIsBaseUi(false);
        setIsAdvanceUi(false);
        setIsForms(false);
        setIsTables(false);
        setIsCharts(false);
        setIsIcons(false);
        setIsMaps(false);
        setIsMultiLevel(false);
        setIsSettings(false);
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get current user and update auth headers
                const user = getLoggedinUser();
                if (!user) {
                    setError("Please log in to view campus data");
                    return;
                }

                const [campusesData, blocksData, buildingsData] = await Promise.all([
                    getCampuses(currentPage, pageSize),
                    getBlocks(),
                    getBuildings()
                ]);

                setCampuses(campusesData.data || []);
                setBlocks(blocksData.data || []);
                setBuildings(buildingsData.data || []);
                setTotalPages(campusesData.meta?.last_page || 1);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const updateIconSidebar = (e) => {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    };

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
    }, []);

    const menuItems = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/dashboard",
            click: function (e) {
                resetStates();
                setIsDashboard(true);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
        },
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "campus",
            label: "AAU Campuses",
            icon: "ri-building-2-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsCampusOpen(!isCampusOpen);
                resetStates();
                setIscurrentState('Campus');
                updateIconSidebar(e);
            },
            stateVariables: isCampusOpen,
            subItems: loading ? [
                {
                    id: "loading",
                    label: "Loading...",
                    link: "#",
                    isChildItem: true,
                    parentId: "campus"
                }
            ] : error ? [
                {
                    id: "error",
                    label: error,
                    link: "#",
                    isChildItem: true,
                    parentId: "campus"
                }
            ] : blocks.map((block) => {
                const campus = block.campus;
                const campusId = `campus-${campus.id}`;

                // Get all blocks for this campus
                const campusBlocks = blocks.filter(b => b.campus.id === campus.id);

                return {
                    id: campusId,
                    label: campus.name,
                    link: "#",
                    click: function (e) {
                        e.preventDefault();
                        setOpenItems(prev => ({
                            ...prev,
                            [campusId]: !prev[campusId]
                        }));
                    },
                    stateVariables: openItems[campusId],
                    isChildItem: true,
                    parentId: "campus",
                    childItems: campusBlocks.map((block) => {
                        const blockId = `block-${block.id}`;
                        const blockBuildings = buildings.filter(b => b.block.id === block.id);

                        return {
                            id: blockId,
                            label: block.name,
                            link: "#",
                            click: function (e) {
                                e.preventDefault();
                                setOpenItems(prev => ({
                                    ...prev,
                                    [blockId]: !prev[blockId]
                                }));
                            },
                            stateVariables: openItems[blockId],
                            childItems: blockBuildings.map((building) => {
                                return {
                                    id: `building-${building.id}`,
                                    label: building.name,
                                    link: `/rooms/${building.id}`,
                                    isChildItem: true,
                                    parentId: blockId,
                                    click: (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history(`/rooms/${building.id}`);
                                    }
                                };
                            })
                        };
                    })
                };
            }).filter((item, index, self) =>
                index === self.findIndex((t) => t.id === item.id)
            ),
            footer: isCampusOpen && totalPages > 1 ? (
                <div className="d-flex align-items-center justify-content-between mt-3 px-3 py-2 border-top">
                    <a
                        href="#"
                        className="btn btn-link btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            // Logic for "View All" campuses
                            history("/campuses");
                        }}
                    >
                        <i className="ri-eye-line align-middle me-1"></i> View All
                    </a>
                    <div className="pagination-controls d-flex align-items-center">
                        <button 
                            className="btn btn-sm btn-link p-0 me-2" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (currentPage > 1) {
                                    handlePageChange(currentPage - 1);
                                }
                            }}
                            disabled={currentPage === 1}
                            style={{ fontSize: '14px' }}
                        >
                            <i className="ri-arrow-left-line"></i>
                        </button>
                        <span className="mx-2" style={{ fontSize: '12px' }}>{currentPage} / Total</span>
                        <button 
                            className="btn btn-sm btn-link p-0 ms-2" 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (currentPage < totalPages) {
                                    handlePageChange(currentPage + 1);
                                }
                            }}
                            disabled={currentPage === totalPages}
                            style={{ fontSize: '14px' }}
                        >
                            <i className="ri-arrow-right-line"></i>
                        </button>
                    </div>
                </div>
            ) : isCampusOpen ? (
                <div className="d-flex align-items-center justify-content-between mt-3 px-3 py-2 border-top">
                    <a
                        href="#"
                        className="btn btn-link btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            // Logic for "View All" campuses
                            history("/campuses");
                        }}
                    >
                        <i className="ri-eye-line align-middle me-1"></i> View All
                    </a>
                </div>
            ) : null
        },
        {
            label: "Components",
            isHeader: true,
        },
        {
            id: "settings",
            label: "Settings",
            icon: "ri-settings-3-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                resetStates();
                setIsSettings(!isSettings);
                setIscurrentState('Settings');
                updateIconSidebar(e);
            },
            stateVariables: isSettings,
            subItems: [
                {
                    id: "campus-settings",
                    label: "Campuses",
                    link: "/settings-campus",
                    parentId: "settings"
                },
                {
                    id: "block-settings",
                    label: "Blocks",
                    link: "/settings-block",
                    parentId: "settings"
                },
                {
                    id: "building-settings",
                    label: "Buildings",
                    link: "/settings-building",
                    parentId: "settings"
                }
            ]
        },
       /* {
            id: "tables",
            label: "Tables",
            icon: "ri-layout-grid-line",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                resetStates();
                setIsTables(true);
                setIscurrentState('Tables');
                updateIconSidebar(e);
            },
            stateVariables: isTables,
            subItems: [
                { id: "basictables", label: "Basic Tables", link: "/tables-basic", parentId: "tables" },
                { id: "listjs", label: "List Js", link: "/tables-listjs", parentId: "tables" },
                { id: "reactdatatables", label: "React Datatables", link: "/tables-react", parentId: "tables" },
            ],
        },*/
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;