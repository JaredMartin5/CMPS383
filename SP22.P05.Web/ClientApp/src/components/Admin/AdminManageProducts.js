import axios from "axios";
import { useEffect, useState } from "react";
import { Breadcrumb, Table, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { checkForRole } from "../Auth/checkForRole";

export function AdminManageProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        document.title = "ICE - Manage Products"
        fetchProducts();
    }, [])
    async function fetchProducts() {
        axios.get('/api/products/manage')
            .then(function (response) {
                const data = response.data;
                setProducts(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function changeStatus(id, status) {
        axios.put('/api/products/change-status/' + id + '/' + status)
            .then(function (response) {
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    function deleteProudct(id) {
        axios.delete('/api/products/' + id)
            .then(function (response) {
                fetchProducts();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            {checkForRole("Admin")}
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} to="/admin" linkProps={{ to: "/admin" }}>Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Products</Breadcrumb.Item>
            </Breadcrumb>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Publisher</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.publisherName}</td>
                            <td>
                                <Form>
                                    <div className="mb-3" onChange={(e) => { changeStatus(product.id, e.target.id) }}>
                                        <Form.Check
                                            inline
                                            label="Active"
                                            name="group1"
                                            type={'radio'}
                                            id={`0`}
                                            defaultChecked={product.status === 0}
                                        />
                                        <Form.Check
                                            inline
                                            label="Hidden"
                                            name="group1"
                                            type={'radio'}
                                            id={`1`}
                                            defaultChecked={product.status === 1}
                                        />
                                        <Form.Check
                                            inline
                                            label="Inactive"
                                            name="group1"
                                            type={'radio'}
                                            id={`2`}
                                            defaultChecked={product.status === 2}
                                        />
                                    </div>
                                </Form>
                            </td>
                            <td>
                                <DropdownButton id="dropdown-item-button" title="Actions">
                                    <Dropdown.Item as="button">
                                        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>Go to Store Page</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item as="button" variant="danger" onClick={() => { if (window.confirm('Delete ' + product.name + ' from the system? THIS ACTION IS IRREVERSABLE.')) deleteProudct(product.id) }}>Delete</Dropdown.Item>
                                </DropdownButton>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
        </>
    )
}