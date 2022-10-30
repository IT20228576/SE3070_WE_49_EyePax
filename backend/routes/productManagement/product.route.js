const express = require("express");
const router = express.Router();
const products = require("../../models/productManagement/product.model");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
let path = require('path');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../frontend/src/components/eventManagement/EventImages');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
  }
  
  let upload = multer({ storage, fileFilter });

  
router.post("/product/new",upload.single('EventImage') , async (req, res) => {

     const { ProductCode, ProductName, Description, Qty, Price, Image} = req.body;

    if (!ProductCode || !ProductName || !Description || !Qty || !Price || !Image) {
        res.status(422).json("Please enter all data")
        return 0;
    } else if (Qty > 100) {
        res.status(420).json("Maximum Partipants are 100")
        return 0;
    }else if (Qty.Description > 20) {
        res.status(420).json("Client name should be less than 20 characters")
        return 0;
    }else{
    try {
        const addproduct = new products({
            ProductCode: req.body.ProductCode,
             ProductName: req.body.ProductName,
              Description: req.body.Description,
               Qty: req.body.Qty,
                Price: req.body.Price,
                 Image: req.body.Image,
        });

        await addproduct.save();
        res.status(201).json(addproduct);

    } catch (error) {
        res.status(422).json(error);
    }
}
})

// get product data

router.get("/product/viewp", async (req, res) => {
    try {
        const pageNo = req.query.pageNo || 1;
        const itemsPerPage = req.query.pageSize || 10;
        const skip = (pageNo - 1) * itemsPerPage;
        const count = await products.estimatedDocumentCount();
        const pageCount = Math.ceil(count / itemsPerPage);

        const getproductdata = await products.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(itemsPerPage);

        res.status(201).json({ pagination: { count, pageCount }, getproductdata })

    } catch (error) {
        return res.status(422).json(error);
    }
})

// get individual product

router.get("/product/view/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const productindividual = await products.findById({ _id: id });
        res.status(201).json(productindividual)

    } catch (error) {
        res.status(422).json(error);
    }
})

// update product data

router.patch("/product/update/:id", async (req, res) => {

    const { ProductCode, ProductName, Description, Qty, Price, Image } = req.body;
    if (!ProductCode || !ProductName || !Description || !Qty || !Price || !Image) {
        res.status(422).json("Please enter all data")
        return 0;
    }else if (Qty > 100) {
        res.status(420).json("Maximum Partipants are 100")
        return 0;
    }else if (Description.length > 20) {
        res.status(420).json("Client name should be less than 20 characters")
        return 0;
    }
    try {
        const { id } = req.params;

        const updateproduct = await products.findByIdAndUpdate(id, req.body, {
            new: true
        });

        res.status(201).json(updateproduct);

    } catch (error) {
        res.status(422).json(error);
    }
})

// delete product
router.delete("/product/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deleteproduct = await products.findByIdAndDelete({ _id: id })
        res.status(201).json(deleteproduct);

    } catch (error) {
        res.status(422).json(error);
    }
})

module.exports = router;









