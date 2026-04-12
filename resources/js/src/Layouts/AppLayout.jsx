import React, { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";
// Note the corrected path pointing to your 'src' subfolder
import { SidebarProvider, useSidebar } from "../contexts/SidebarContext";

const LayoutContent = ({ children }) => {
  // We extract the sidebar state to handle the dynamic width of the content area
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      {/* 1. The Navigation Components */}
      <AppSidebar />
      <Backdrop />

      {/* 2. The Main Content Wrapper */}
      {/* The margin (lg:ml) changes dynamically to make room for the sidebar */}
      <div className={`flex-1 transition-all duration-300 ${isMobileOpen ? "ml-0" : isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]" }`}>
        {/* 3. The Top Menu */}
        <AppHeader />
        {/* 4. The Dashboard Page Slot */}
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {/* This renders whatever is wrapped in <AppLayout> inside app.jsx */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Default export wraps everything in the Provider to avoid context errors
const AppLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;