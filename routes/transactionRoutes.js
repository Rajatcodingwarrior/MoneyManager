const express = require("express");
const router = express.Router();
const {addTransaction,editTransaction,deleteTransaction,getAllTransactions}=require("../controllers/transactionControllers.js")
router.route("/add-transaction").post(addTransaction);
router.route("/edit-transaction").post(editTransaction);
router.route("/delete-transaction").post(deleteTransaction);
router.route("/get-all-transactions").post(getAllTransactions);

module.exports=router;