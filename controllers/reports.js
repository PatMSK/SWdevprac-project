const Report = require("../models/Report");
const User = require("../models/User");

exports.getAllReports = async (req, res, next) => {
  if (req.user.role !== "admin") {
    query = Report.find({ User: req.user.id }).populate("User", "name email");
  } else {
    query = Report.find().populate("User", "name email");
  }
  try {
    const reports = await query;
    res
      .status(200)
      .json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reports" });
  }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "User",
      "name email"
    );
    if (!report) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No report with the id of ${req.params.id}`,
        });
    }
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Report" });
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const { Title, Description } = req.body;
    const report = await Report.create({
      Title,
      Description,
      User: req.user.id,
    });
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Report" });
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const { Title, Description, Status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        Title,
        Description,
        Status,
      },
      { new: true, runValidators: true }
    ).populate("User", "name email");
    if (!report) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No report with the id of ${req.params.id}`,
        });
    }
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Report" });
  }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No report with the id of ${req.params.id}`,
        });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Report" });
  }
};
