import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultLayout from '../Layouts/DefaultLayout';

// Lazy load components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Rooms = lazy(() => import("../pages/Rooms"));
const Campus = lazy(() => import("../pages/Campus"));
const Block = lazy(() => import("../pages/Block"));
const Building = lazy(() => import("../pages/Building"));
const CampusSettings = lazy(() => import("../pages/Settings/CampusSettings"));
const BlockSettings = lazy(() => import("../pages/Settings/BlockSettings"));
const BuildingSettings = lazy(() => import("../pages/Settings/BuildingSettings"));

const RouteComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route index element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                    </Suspense>
                } />
                <Route path="/dashboard" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                    </Suspense>
                } />
                <Route path="/rooms/:buildingId" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Rooms />
                    </Suspense>
                } />
                <Route path="/campus" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Campus />
                    </Suspense>
                } />
                <Route path="/block" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Block />
                    </Suspense>
                } />
                <Route path="/building" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <Building />
                    </Suspense>
                } />
                <Route path="/settings/campus" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <CampusSettings />
                    </Suspense>
                } />
                <Route path="/settings/block" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <BlockSettings />
                    </Suspense>
                } />
                <Route path="/settings/building" element={
                    <Suspense fallback={<div>Loading...</div>}>
                        <BuildingSettings />
                    </Suspense>
                } />
                {/* Add other routes here */}
            </Route>
        </Routes>
    );
};

export default RouteComponent; 