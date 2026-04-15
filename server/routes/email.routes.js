import express from "express";

import {
  syncEmailsController,
  dashboard,
  getEmailBody,
  getStats,
  searchBySender,
  advancedSearch
} from "../controllers/email.controller.js";

const router = express.Router();

router.get("/sync", syncEmailsController);
router.get("/dashboard", dashboard);
router.get("/email/:id", getEmailBody);
router.get("/stats", getStats);
router.get("/search", searchBySender);

router.post(
"/advanced",
advancedSearch
);

export default router;