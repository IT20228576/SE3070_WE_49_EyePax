const express = require("express");
const Orders = require("../../models/orderManagement/order.model");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Cart = require("../../models/orderManagement/cart.model");

/* Add New Order */
router.post("/add", async (req, res) => {
  try {
    // assign the data coming from the req body to separate variable
    const oldData = req.body;

    const newOrder = new Orders({
      OrderId: "SP" + uuidv4(),
      SiteManager: oldData.SiteManager,
      Cart: oldData.Cart, // send this as an array
      SiteAddress: oldData.ClientName,
      DeliveryDate: oldData.EventStartTime,
      TotalPrice: oldData.EventEndTime,
      DeliveryStatus: oldData.NoOfParticipants,
      Comment: oldData.EventStatus,
      Approval: oldData.EventLocation,
    });

    await newOrder.save();
    await Cart.deleteMany({ SiteManager: oldData.User._id });
    return res.status(201).json({ message: "Order Confirmed Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

/* Get All Orders */
router.get("/getAll/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const details = await Orders.find({ SiteManager: id });

    return res.status(200).json({
      data: details,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

/* Get Order by ID */
router.get("/getById/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const details = await Orders.findOne({ _id: id });

    return res.status(200).json({
      data: details,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

/* Update Delivery Status */
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deliveryStatus = req.body.DeliveryStatus;
    const details = await Orders.findByIdAndUpdate(id, {
      DeliveryStatus: deliveryStatus,
    }).exec();

    return res.status(200).json({
      data: details,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

/* Search an Order */
router.get("/search/:searchTerm", async (req, res) => {
  try {
    // using "$options: 'i'" for case insensitive search
    const details = await Orders.find({
      $or: [
        {
          OrderId: { $regex: req.params.searchTerm, $options: "i" },
        },
      ],
    });

    return res.status(200).json({
      data: details,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

module.exports = router;