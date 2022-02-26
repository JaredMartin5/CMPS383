import { Card, Col } from "react-bootstrap";
import './ProductList.css'
export function ProductCard({ myProduct }) {
    return (
        <Col>

        <Card className="ProductCard h-100" bg="black" text="white">
            {/* <Card.Img variant="top" src="holder.js/100px160" /> */}
            <Card.Body>
                <Card.Title style= {{fontWeight: 700}}>{myProduct.name}</Card.Title>
                <Card.Text>
                    {myProduct.description}
                </Card.Text>
            </Card.Body>
            <Card.Footer>${myProduct.price.toFixed(2)}</Card.Footer>
        </Card>
        </Col>

    )
}