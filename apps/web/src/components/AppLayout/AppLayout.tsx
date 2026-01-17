import AppHeader from "../AppHeader/AppHeader";
import SideBar from "../SideBar/SideBar";

import "./styles.scss";

/**
 * A general app layout
 * @returns
 */
export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="AppLayout">
      <AppHeader />
      <div id="main-grid">
        <SideBar />
        {children}
      </div>
    </div>
  );
}
