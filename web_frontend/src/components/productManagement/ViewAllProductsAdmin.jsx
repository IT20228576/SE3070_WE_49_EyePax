import { useState, useEffect, useContext } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { NavLink } from "react-router-dom";
import { deldata } from "./context/ContextProvider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";

const ViewAllProductsAdmin = () => {
  const [getproductdata, setProductdata] = useState([]);

  const { setDLTdata } = useContext(deldata);
  const [searchTerm, setSearchTerm] = useState("");

  const getdata = async () => {
    const res = await fetch(`http://localhost:8000/product/view-all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (res.status === 422 || !data) {
      console.log("error ");
    } else {
      setProductdata(data.getproductdata);
      console.log("get data");
    }
  };

  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteproduct = async (id) => {
    const res2 = await fetch(`http://localhost:8000/product/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const deletedata = await res2.json();

    if (res2.status === 422 || !deletedata) {
      console.log("error");
    } else {
      alert("Deleted Product Details Successfully");
      console.log("product deleted");
      setDLTdata(deletedata);
      getdata();
    }
  };

  const rejectProduct = async (id) => {
    const result = await axios.put(
      "http://localhost:8000/product/update-status/" + id,
      { Status: "Rejected" }
    );

    if (result.status === 422) {
      console.log("error");
    } else {
      alert("Rejected Product Successfully");
      console.log("Rejected Product Successfully");
      getdata();
    }
  };

  const approvedProduct = async (id) => {
    const result = await axios.put(
      "http://localhost:8000/product/update-status/" + id,
      { Status: "Approved" }
    );

    if (result.status === 422) {
      console.log("error");
    } else {
      alert("Approved Product Successfully");
      console.log("Approved Product Successfully");
      getdata();
    }
  };

  return (
    <div>
      <div className="topHeading">
        <h1>All Products</h1>
      </div>
      <div className="main">
        <div className="sub-main">
          <div className="head-left">
            <form className="form-inline my-2 my-lg-0">
              <input
                className="search-input"
                placeholder="Search Products"
                type="search"
                name="searchQuery"
                onChange={(product) => {
                  setSearchTerm(product.target.value);
                }}
              ></input>
            </form>
          </div>

          <hr></hr>

          <Table striped style={{ textAlign: "center" }}>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th scope="col">
                  <b>#</b>
                </th>
                <th>Product Name</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Price(LKR)</th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getproductdata
                .filter((element) => {
                  if (searchTerm === "") {
                    return element;
                  } else if (
                    element.ProductCode.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    ) ||
                    element.ProductName.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    ) ||
                    element.Qty.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    ) ||
                    element.Price.toLowerCase().includes(
                      searchTerm.toLowerCase()
                    )
                  ) {
                    return element;
                  } else {
                    return false;
                  }
                })
                .map((element, id, user) => {
                  return (
                    <>
                      <tr>
                        <td>{id + 1}</td>
                        <td>
                          <Dropdown>
                            <Dropdown.Toggle id="" variant="">
                              {element.ProductName}
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="">
                              <Dropdown.Item href="#/action-2">
                                <NavLink to={`/view/${element._id}`}>
                                  <i className="btn btn-outline-success">
                                    <RemoveRedEyeIcon></RemoveRedEyeIcon> View
                                    Product
                                  </i>
                                </NavLink>
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item href="#/action-3">
                                <NavLink to={`/edit/${element._id}`}>
                                  <i className="btn btn-outline-warning">
                                    <EditIcon></EditIcon> Edit Product
                                  </i>
                                </NavLink>
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item href="#/action-4">
                                <i
                                  className="btn btn-outline-danger"
                                  onClick={() => deleteproduct(element._id)}
                                >
                                  <DeleteIcon></DeleteIcon> Delete Product
                                </i>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                        <td>{element.Description}</td>
                        <td>{element.Qty}</td>
                        <td>{element.Price}</td>
                        <td>{element.user.name}</td>
                        <td>{element.Status}</td>
                        <td>
                          <NavLink>
                            <Button
                              className="btn btn-warning my-1 my-sm-0"
                              style={{ margin: "10px" }}
                              onClick={() => approvedProduct(element._id)}
                            >
                              Approve
                            </Button>
                          </NavLink>
                          <NavLink>
                            <Button
                              className="btn btn-black my-1 my-sm-0"
                              onClick={() => rejectProduct(element._id)}
                            >
                              Reject
                            </Button>
                          </NavLink>
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ViewAllProductsAdmin;
