import express from "express";
import {
  syncEmails,
  dashboard
} from "../controllers/email.controller.js";

const router = express.Router();

router.get("/emails", syncEmails);
router.get("/dashboard", dashboard);
router.get("/email/:id", getEmailBody);

export default router;
