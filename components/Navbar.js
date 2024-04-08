import { useState } from "react";
import { Nav, Navbar } from "rsuite";

const AppNavbar = () => {
    const [active, setActive] = useState("home");

    return (
        <Navbar className="navbar">
            <Navbar.Brand href="#">
                <img src="/logo.png"/>
            </Navbar.Brand>
            <Nav activeKey={active} onSelect={setActive} appearance="subtle">
                <Nav.Item eventKey="home">Əsas səhifə</Nav.Item>
                <Nav.Item eventKey="about">Haqqımızda</Nav.Item>
                <Nav.Item eventKey="contact">Əlaqə</Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default AppNavbar;
