import { Card, Row, Col } from "react-bootstrap";
import './ProductList.css'
export function ProductCard({ myProduct }) {
    return (
        <Col>

        <Card className="ProductCard h-100">
            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
            <Card.Body>
                <Card.Title>{myProduct.name}</Card.Title>
                <Card.Text>
                    {myProduct.description}
                </Card.Text>
            </Card.Body>
        </Card>
        </Col>

    )
}