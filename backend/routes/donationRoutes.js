import express from "express";
import {
  createDonation,
  getAllDonations,
  markAsCollected,
} from "../controllers/donationController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js"; // if you have auth

const router = express.Router();

// Submit donation (donor)
router.post("/", isAuthenticated, createDonation);

// Get all available donations (receiver)
router.get("/", getAllDonations);

// Mark as collected (admin or volunteer)
router.put("/:id/collect", isAuthenticated, markAsCollected);

export default router;
