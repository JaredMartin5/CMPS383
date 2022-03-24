import axios from "axios";
import { useEffect, useState } from 'react';
import { Breadcrumb, Button, Dropdown, DropdownButton, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function PublisherManageProducts() {
    const [products, setProducts] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addProductError, setAddProductError] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const [productId, setProductId] = useState("");

    const handleClose = () => {
        setName("");
        setDescription("");
        setPrice("");
        setAddProductError(false);
        setShow(false);
        setIsEdit(false);
    }
    const handleShow = () => setShow(true);

    async function fetchProducts() {
        axios.get('/api/publisher/products')
            .then(function (response) {
                setLoading(true);
                console.log(response.data);
                const data = response.data;
                setProducts(data);
                setLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        document.title = "ICE - Manage Products"

        fetchProducts();
    }, [])

    const handleAdd = (e) => {
        e.preventDefault();

        axios.post('/api/products', {
            name: name,
            description: description,
            price: price
        })
            .then(function (response) {
                fetchProducts();
                handleClose();
            })
            .catch(function (error) {
                setAddProductError(true);
                console.log(error);
            })

    }

    const handleEdit = (e) => {
        e.preventDefault();
        console.log(productId);
        axios.put('/api/products/' + productId, {
            name: name,
            description: description,
            price: price
        })
            .then(function (response) {
                fetchProducts();
                handleClose();
            })
            .catch(function (error) {
                setAddProductError(true);
                console.log(error);
            })

    }

    function handleEditShow(product) {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setProductId(product.id);
        setIsEdit(true);
        handleShow();
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/publisher" linkProps={{ to: "/publisher" }}>Publisher Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header><Modal.Title>{isEdit ? <>Edit Product</> : <>Add Product</>}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={isEdit ? handleEdit : handleAdd}>
                        <Form.Group className="mb-2" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Name" maxLength="120" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formBasicDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required as="textarea" rows={5} placeholder="Description" maxLength="2000" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="formBasicPrice">
                            <Form.Label>Price</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control required min="0.01" step="0.01" max="999.99" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Button className="custom-primary-btn" variant="primary" type="submit">
                            {isEdit ? <>Save Changes</> : <>Add</>}
                        </Button>
                        <Button variant="danger" onClick={handleClose}>
                            Discard
                        </Button>
                        {addProductError ? <p style={{ marginTop: "1em", background: "#500000", padding: "1em" }}>Invalid Submission</p> : null}
                    </Form>
                </Modal.Body>
            </Modal>
            {loading ? "Loading" : products.length > 0 && !loading ?
                <>
                    <Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                        Add Product
                    </Button>
                    <Table striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    {/* Shouldn't be hardcoding this, stuck with it for now */}
                                    <td>{product.status === 0 ? "Active" : product.status === 1 ? "Hidden" : product.status === 2 ? "Inactive" : null}</td>
                                    <td>
                                        <DropdownButton id="dropdown-item-button" title="Actions">
                                            <Dropdown.Item as="button"><Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>Go to Store Page</Link></Dropdown.Item>
                                            <Dropdown.Item as="button" onClick={() => handleEditShow(product)} >Edit</Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </Table></>
                : <><Button variant="primary" className="custom-primary-btn mb-3" onClick={handleShow}>
                    Add Product
                </Button><h1>No products</h1></>}
        </>
    );
}
