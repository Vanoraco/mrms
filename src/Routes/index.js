import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from './AuthProtected';

// Settings Components
import CampusSettings from "../pages/Settings/CampusSettings";
import BlockSettings from "../pages/Settings/BlockSettings";
import BuildingSettings from "../pages/Settings/BuildingSettings";
import RoomTypeSettings from "../pages/Settings/RoomTypeSettings";
import RoomFacilitySettings from "../pages/Settings/RoomFacilitySettings";
import DepartmentTypeSettings from "../pages/Settings/DepartmentTypeSettings";
import DepartmentSettings from "../pages/Settings/DepartmentSettings";
import RoleSettings from "../pages/Settings/RoleSettings";
import UserSettings from "../pages/Settings/UserSettings";

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                <Route>
                    {publicRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <NonAuthLayout>
                                    {route.component}
                                </NonAuthLayout>
                            }
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>

                <Route>
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    <VerticalLayout>{route.component}</VerticalLayout>
                                </AuthProtected>}
                            key={idx}
                            exact={true}
                        />
                    ))}
                </Route>
            </Routes>
        </React.Fragment>
    );
};

export default Index;