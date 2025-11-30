import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationsByDonor,
  acceptDonation,
  deleteDonation,
getMyRequests,   // 👈 add this
} from "../controllers/donation.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// Receiver views all available donations
router.get("/all", getAllDonations);
router.post("/create", isAuth, createDonation);
router.get("/my-donations", isAuth, getDonationsByDonor);
router.put("/accept/:donationId", isAuth, acceptDonation);
router.delete("/delete/:id", isAuth, deleteDonation);  // 👈 add this route
router.get("/my-requests", isAuth, getMyRequests);
export default router;
