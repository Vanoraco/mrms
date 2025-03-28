import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedinUser } from "../helpers/api_helper";
import { fetchCampuses, fetchBlocks, fetchBuildings } from "../slices/settings/reducer";

const Navdata = () => {
    const history = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { campuses, blocks, buildings, loading, error } = useSelector((state) => state.Settings);
    
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

    // UI states
    const [isCampusOpen, setIsCampusOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');
    const [activeSubMenu, setActiveSubMenu] = useState('');

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

    // Effect to check current route and set active states
    useEffect(() => {
        const path = location.pathname;
        
        // Set Dashboard active
        if (path === '/dashboard') {
            resetStates();
            setIsDashboard(true);
            setIscurrentState('Dashboard');
            return;
        }
        
        // Check if current route is a settings page
        if (path.includes('settings-')) {
            resetStates();
            setIsSettings(true);
            setIscurrentState('Settings');
            
            // Set active submenu
            setActiveSubMenu(path);
        }
    }, [location]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get current user and update auth headers
                const user = getLoggedinUser();
                if (!user) {
                    return;
                }

                await Promise.all([
                    dispatch(fetchCampuses({ page: currentPage, size: pageSize })),
                    dispatch(fetchBlocks({ page: 1, size: 100 })), // Fetch all blocks
                    dispatch(fetchBuildings({ page: 1, size: 100 })) // Fetch all buildings
                ]);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [dispatch, currentPage, pageSize]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1) {
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
      {/*  {
            label: "pages",
            isHeader: true,
        },*/},
       {/* {
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
            footer: isCampusOpen ? (
                <div className="d-flex align-items-center justify-content-between mt-3 px-3 py-2 border-top">
                    <a
                        href="#"
                        className="btn btn-link btn-sm"
                        onClick={(e) => {
                            e.preventDefault();
                            history("/campuses");
                        }}
                    >
                        <i className="ri-eye-line align-middle me-1"></i> View All
                    </a>
                </div>
            ) : null
        },*/},
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
                    link: "/settings-campuses",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-campuses",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-campuses");
                        history("/settings-campuses");
                    }
                },
                {
                    id: "block-settings",
                    label: "Blocks",
                    link: "/settings-blocks",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-blocks",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-blocks");
                        history("/settings-blocks");
                    }
                },
                {
                    id: "building-settings",
                    label: "Buildings",
                    link: "/settings-buildings",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-buildings",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-buildings");
                        history("/settings-buildings");
                    }
                },
                {
                    id: "room-type-settings",
                    label: "Room Types",
                    link: "/settings-room-types",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-room-types",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-room-types");
                        history("/settings-room-types");
                    }
                },
                {
                    id: "room-facility-settings",
                    label: "Room Facilities",
                    link: "/settings-room-facilities",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-room-facilities",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-room-facilities");
                        history("/settings-room-facilities");
                    }
                },
                {
                    id: "department-type-settings",
                    label: "Department Types",
                    link: "/settings-department-types",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-department-types",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-department-types");
                        history("/settings-department-types");
                    }
                },
                {
                    id: "department-settings",
                    label: "Departments",
                    link: "/settings-departments",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-departments",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-departments");
                        history("/settings-departments");
                    }
                },
                {
                    id: "role-settings",
                    label: "Roles",
                    link: "/settings-roles",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-roles",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-roles");
                        history("/settings-roles");
                    }
                },
                {
                    id: "user-settings",
                    label: "Users",
                    link: "/settings-users",
                    parentId: "settings",
                    isActive: activeSubMenu === "/settings-users",
                    click: (e) => {
                        e.preventDefault();
                        setActiveSubMenu("/settings-users");
                        history("/settings-users");
                    }
                }
            ]
        }
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;