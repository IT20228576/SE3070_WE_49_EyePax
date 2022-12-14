import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { updatedata } from "./context/ContextProvider";
import { Col, Row, Button, Form, Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";

const UpdateProduct = (props) => {
  const { setUPdata } = useContext(updatedata);

  const navigate = useNavigate("");

  const [inpval, setINP] = useState({
    ProductCode: "",
    ProductName: "",
    Description: "",
    Qty: "",
    Price: "",
    Image: "",
  });

  const setdata = (e) => {
    const { name, value } = e.target;
    setINP((preval) => {
      return {
        ...preval,
        [name]: value,
      };
    });
  };

  const { id } = useParams("");

  const getdata = async () => {
    const res = await fetch(`http://localhost:8000/product/view/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.status === 422 || !data) {
      console.log("Please enter all product details");
      return 0;
    } else {
      setINP(data);
      console.log("get data");
    }
  };

  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateproduct = async (e) => {
    e.preventDefault();

    const { ProductCode, ProductName, Price, Image, Qty, Description } = inpval;

    const res2 = await fetch(`http://localhost:8000/product/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProductCode,
        ProductName,
        Price,
        Image,
        Qty,
        Description,
      }),
    });

    const data2 = await res2.json();

    if (res2.status === 422 || !data2) {
      alert("Please enter all product details");
      return 0;
    } else if (Qty > 20) {
      alert("Qty should be less than 20");
    } else if (inpval.Description.length > 100) {
      alert("Description should be less than 100 characters");
      return 0;
    } else {
      alert("Update Product Details Successfully");
      navigate("/products");
      setUPdata(data2);
    }
  };

  return (
    <div
      style={{ marginLeft: "100px", marginTop: "10px", marginBottom: "100px" }}
    >
      <Container>
        <Modal
          dialogClassName="my-modal"
          show={true}
          onHide={props.handleModalClose}
          backdrop="static"
        >
          <a href="/products">
            <Modal.Header closeButton></Modal.Header>
          </a>
          <Modal.Title style={{ textAlign: "center" }}>
            Update Product
          </Modal.Title>
          <br></br>

          <Modal.Body>
            <form className="formCard" border="dark">
              <Row className="justify-content-md-center">
                <Form.Group className="mb-3">
                  <Form.Label>Product Code :</Form.Label>
                  <input
                    class="border border-warning"
                    placeholder="Enter Product Code"
                    value={inpval.ProductCode}
                    onChange={setdata}
                    name="ProductCode"
                    style={{
                      width: "700px",
                      marginLeft: "25px",
                      borderRadius: "10px",
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-md-center">
                <Form.Group className="mb-3">
                  <Form.Label>Product Name :</Form.Label>
                  <input
                    class="border border-warning"
                    placeholder="Enter Product Name"
                    value={inpval.ProductName}
                    onChange={setdata}
                    name="ProductName"
                    style={{
                      width: "700px",
                      marginLeft: "20px",
                      borderRadius: "10px",
                    }}
                  />
                </Form.Group>
              </Row>
              <Row className="justify-content-md-center">
                <Form.Group className="mb-3">
                  <Form.Label>Description :</Form.Label>
                  <input
                    class="border border-warning"
                    placeholder="Enter Product Description"
                    as="textarea"
                    rows={8}
                    value={inpval.Description}
                    onChange={setdata}
                    name="Description"
                    style={{
                      width: "700px",
                      marginLeft: "43px",
                      borderRadius: "10px",
                    }}
                  />
                </Form.Group>
              </Row>

              <Row className="justify-content-md-center">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Qty :</Form.Label>
                    <input
                      class="border border-warning"
                      placeholder="Enter Qty"
                      value={inpval.Qty}
                      onChange={setdata}
                      name="Qty"
                      style={{
                        width: "300px",
                        marginLeft: "97px",
                        borderRadius: "10px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Price :</Form.Label>
                    <input
                      class="border border-warning"
                      placeholder="Enter Price"
                      value={inpval.Price}
                      onChange={setdata}
                      name="Price"
                      style={{
                        width: "250px",
                        marginLeft: "35px",
                        borderRadius: "10px",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Image :</Form.Label>
                    <input
                      class="border border-warning"
                      type="file"
                      accept="image/*"
                      onChange={{}}
                      name="Image"
                      style={{
                        width: "250px",
                        marginLeft: "74px",
                        borderRadius: "10px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Label>
                    * Product will enable to purchase after manager approval
                  </Form.Label>
                </Col>
              </Row>

              <Row className="justify-content-md-center">
                <Col>
                  <Button
                    variant="outline-warning"
                    size="lg"
                    type="submit"
                    style={{ width: "56%", marginLeft: "120px" }}
                    onClick={updateproduct}
                  >
                    Update Product
                  </Button>
                </Col>

                <Col>
                  <a href="/products">
                    <Button
                      variant="outline-warning"
                      size="lg"
                      style={{ width: "56%", marginLeft: "5px" }}
                    >
                      Cancel
                    </Button>
                  </a>
                </Col>
              </Row>
            </form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default UpdateProduct;
