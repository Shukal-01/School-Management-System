const express = require("express");
const {
  addNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeBoardController");

const noticeBoardRouter = express.Router();

noticeBoardRouter.post("/add-notice", addNotice);
noticeBoardRouter.get("/all-notices", getAllNotices);
noticeBoardRouter.get("/get-notice/:id", getNoticeById);
noticeBoardRouter.put("/update-notice/:id", updateNotice);
noticeBoardRouter.delete("/delete-notice/:id", deleteNotice);

module.exports = noticeBoardRouter;
