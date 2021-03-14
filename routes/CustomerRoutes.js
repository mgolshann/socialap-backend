const express = require("express");
const CustomerModel = require("../models/CustomerModel");
const Customer = require("../models/CustomerModel");
const {validateCreateCustomer , validateUpdateCustomer} = require("../validators/CustomerValidator");
const router = express.Router();

let customers = [
  { id: 1, name: "ali" },
  { id: 2, name: "saeed" },
  { id: 3, name: "mohammad" },
  { id: 4, name: "yalda" },
];

router.get("/api/customers", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.post("/api/customers", async function (req, res) {

  // Validate data from client
  const { error } = validateCreateCustomer(req.body);
  if (error) return res.status(400).send({ message: error.message });

  let customer = new Customer ({
    name: req.body.name,
  });

  customer = await customer.save();
  res.send(customer);
});



router.get("/api/customers/:id", async (req, res) => {

  const mongoose = require("mongoose");
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send("Bad Id");
  
  
  const customer = await Customer.findById(req.params.id);

  if (customer) 
    res.send(customer);
  else 
    res.status(404).send("not found");
});


router.put("/api/customers/:customerId", async (req, res) => {
  // input validation
  //return res.send({...req.body});
  const { error } = validateUpdateCustomer({ 
      ...req.body, 
      customerId: req.params.customerId 
  });
  if (error) return res.status(400).send({ message: error.message });

  let customer = await Customer.findById(req.params.customerId);
  if (!customer) return res.status(404).send({ message: "مشتری مورد نظر یافت نشد" })

  customer.name = req.body.name;
  customer = await customer.save();
  
  res.send(customer);
});

router.delete("/api/customers/:customerId", async (req, res) => {
  const result = await Customer.findByIdAndRemove(req.params.customerId);
  if (!result) return res.status(404).send({ message: "مشتری مورد نظر یافت نشد" })
  res.status(200).send({message: "delete successfuly ..."});
});


module.exports = router;
/*
* [1,2,3,4,5]
* */