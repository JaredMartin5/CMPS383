import { Link } from "react-router-dom";
import { checkForRole } from "../checkForRole";
import { Breadcrumb, Card, Row, Col } from "react-bootstrap";

export function AdminDashboard() {
    const linkStyle = {
        textDecoration: "none",
        color: 'white'
    };

    return (
        <>
            {checkForRole("Admin")}

            <Breadcrumb>
                <Breadcrumb.Item active>Admin Dashboard</Breadcrumb.Item>
            </Breadcrumb>
            <h1>Admin Dashboard</h1>
            <Row xs={1} md={3} className="g-4 text-center">
                {/* <Col>
                    <Card bg='dark' className="h-100">
                        <Card.Body as={Link} to="./manage-tags" style={linkStyle}>
                            Manage Tags
                        </Card.Body>
                    </Card>
                </Col> */}
                <Col>
                    <Card bg='dark' className="h-100">
                        <Card.Body as={Link} to="./verify-publishers" style={linkStyle}>
                            Verify Incoming Publishers
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card bg='dark' className="h-100">
                        <Card.Body as={Link} to="./manage-publishers" style={linkStyle}>
                            Manage Publishers
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}