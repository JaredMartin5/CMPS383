import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Navmenu.css";
import iceLogo from '../content/ice_logo.png';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { checkForRole } from "./checkForRole";

export function Navmenu() {
  let location = useLocation()
  const loggedInUser = localStorage.getItem("user");
  let navigate = useNavigate();

  function handleLogout() {
    axios.post('/api/authentication/logout', {
    })
      .then(function (response) {
        console.log(response.data);
        localStorage.removeItem('user')
        navigate("/", { replace: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function renderLoginButton() {
    if (loggedInUser && location.pathname.toLowerCase() === '/login') {
      return <Navigate to="/" />
    } else if (loggedInUser) {
      return (
        <>
        <NavDropdown title={JSON.parse(loggedInUser).userName.toUpperCase()} id="navbarScrollingDropdown">
          <NavDropdown.Item to="/" onClick={handleLogout}>LOGOUT</NavDropdown.Item>
        </NavDropdown>
        </>
      )
    }
    return (
      <>
        <Nav.Link as={Link} to="/Login">LOGIN</Nav.Link>
        <Nav.Link as={Link} to="/SignUp">SIGN UP</Nav.Link>
      </>
    )
  }

  return (
    <>
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" ><img className="navbar-image" src={iceLogo} alt={"ICE Logo"} /></Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/publisher">{checkForRole("Publisher") ? null : "PUBLISHER"}</Nav.Link>
          </Nav>
          <Nav>
          {renderLoginButton()}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

