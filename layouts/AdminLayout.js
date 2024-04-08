import React, { useEffect } from "react";
import Header from "./../components/Header";
import Footer from "../components/Footer";
import { Sidenav, Nav } from "rsuite";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import { useRouter } from "next/router";
import { Menus } from "../helpers/enums";
import Link from "next/link";
import { AdminGuard } from "../guards/AdminGuard";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [activeKey, setActiveKey] = React.useState("1");
  const [openKeys, setOpenKeys] = React.useState([]);
  const [expanded, setExpand] = React.useState(true);

  useEffect(() => {
    const path = router.pathname.split("/")[2];
    setActiveKey(Menus[path]);
  }, []);

  return (
    <div className="admin-layout">
      <Header hideButtons={true}/>
      <AdminGuard>
        <main className="admin-main">
          <div>
            <CustomSidenav
              activeKey={activeKey}
              openKeys={openKeys}
              onSelect={setActiveKey}
              onOpenChange={setOpenKeys}
              expanded={expanded}
              onExpand={setExpand}
            />
          </div>
          <div className="main">{children}</div>
        </main>
      </AdminGuard>
      <Footer />
    </div>
  );
}

const styles = {
  maxWidth: 300,
  display: "inline-table",
  marginRight: 10,
};

const CustomSidenav = ({
  appearance,
  openKeys,
  expanded,
  onOpenChange,
  onExpand,
  ...navProps
}) => {
  const router = useRouter();

  const selectMenu = (menuId) => {
    for (const key in Menus) {
      if (Menus[key] == menuId) {
        router.push('/admin/' + key);
        break;
      }
    }
  };

  return (
    <div style={styles}>
      <Sidenav
        appearance={appearance}
        expanded={expanded}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        <Sidenav.Body>
          <Nav {...navProps} onSelect={(e) => selectMenu(e)}>
            <Nav.Item eventKey="1" icon={<DashboardIcon />}>
              Products
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<GroupIcon />}>
              Users
            </Nav.Item>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={onExpand} />
      </Sidenav>
    </div>
  );
};
