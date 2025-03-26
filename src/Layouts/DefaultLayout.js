import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SidebarContent from "./SidebarContent";
import Footer from "./Footer";

const DefaultLayout = () => {
    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header />
                <div className="vertical-menu">
                    <div data-simplebar className="h-100">
                        <SidebarContent />
                    </div>
                </div>
                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <Outlet />
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </React.Fragment>
    );
};

export default DefaultLayout; 