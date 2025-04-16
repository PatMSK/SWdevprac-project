const express = require("express");
const {
  getAllReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/reports");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, getAllReports)
  .post(protect, authorize("admin", "user"), createReport);

router
  .route("/:id")
  .get(protect, getReport)
  .put(protect, authorize("admin"), updateReport)
  .delete(protect, authorize("admin"), deleteReport);

module.exports = router;
