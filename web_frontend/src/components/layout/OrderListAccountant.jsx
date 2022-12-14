/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import OrderModal from "./OrderModal";
import { useNavigate } from "react-router-dom";

const OrderListAccountant = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const rejectOrder = async (id) => {
    const result = await axios.put(
      "http://localhost:8000/order/update/Approval/" + id,
      { Approval: "Rejected" }
    );

    if (result.status === 422) {
      console.log("error");
    } else {
      alert("Rejected Order Successfully");
      console.log("Rejected Order Successfully");
      window.location.reload();
    }
  };

  const approvedOrder = async (id) => {
    const result = await axios.put(
      "http://localhost:8000/order/update/Approval/" + id,
      { Approval: "Approved" }
    );

    if (result.status === 422) {
      console.log("error");
    } else {
      alert("Approved Order Successfully");
      console.log("Approved Order Successfully");
      window.location.reload();
    }
  };

  function OrderListAccountant() {
    /* Returning the data in the form of a table. */
    return orders
      ?.filter((element) => {
        if (searchTerm === "") {
          return element;
        } else if (
          element.SiteManager.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          element.SiteAddress.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          element.Approval.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return element;
        } else {
          return false;
        }
      })
      .map((current, index) => {
        /* Checking if the name contains the search string or if the search string is empty. */
        return (
          <tr key={index}>
            <td>{current.SiteManager.name}</td>
            <td>{current.Cart.length}</td>
            <td>{current.SiteAddress}</td>
            <td>{current.TotalPrice}</td>
            <td>{current.DeliveryStatus}</td>
            <td>{current.Approval}</td>
            <td>
              {current.Approval === "Pending" ? (
                <>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => approvedOrder(current._id)}
                  >
                    Approve
                  </button>
                  &nbsp;
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => rejectOrder(current._id)}
                  >
                    Reject
                  </button>
                  &nbsp;
                </>
              ) : (
                ""
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={viewOrder.bind(this, current)}
              >
                Orders
              </button>
              &nbsp;
              <button
                className="btn btn-outline-secondary"
                onClick={viewProducts.bind(this, current.Cart)}
              >
                Products
              </button>
            </td>
          </tr>
        );
      });
  }

  /**
   * When the user clicks on a row, the user's data is set to the state and the modal is shown.
   */
  function viewOrder(data) {
    setOrder(data);
    handleShow();
  }

  function viewProducts(data) {
    navigate("/orders/products", { state: data });
  }

  useEffect(() => {
    /**
     * "getall" is an async function that uses axios to get data from the server, and then sets the
     * state of the notes and totalPage variables.
     */
    const getall = async () => {
      try {
        const result = await axios.get(`http://localhost:8000/order/getAll`);
        console.log(result);
        /* Setting the state of the notes and totalPage variables. */
        setOrders(result?.data?.data);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };
    getall();
  }, []);

  return (
    <div>
      <div className="topHeading">
        <h1>All Orders</h1>
      </div>
      <div className="main">
        {show === true && (
          <OrderModal order={order} handleClose={handleClose} />
        )}
        <div className="sub-main">
          <div className="head-left">
            <input
              className="search-input"
              placeholder="Search Orders"
              type="search"
              name="searchQuery"
              onChange={(product) => {
                setSearchTerm(product.target.value);
              }}
            ></input>
          </div>
          <hr />
          <Table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Site Manager</th>
                <th>No of Products</th>
                <th>Site Address</th>
                <th>Total Price</th>
                <th>Delivery Status</th>
                <th>Approval</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{OrderListAccountant()}</tbody>
          </Table>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default OrderListAccountant;
