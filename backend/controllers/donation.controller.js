// backend/controllers/donation.controller.js
import Donation from "../models/donation.model.js";
import Donor from "../models/donor.model.js";

/**
 * @desc Create a new donation (Donor side)
 * @route POST /api/donations/create
 * @access Private
 */
export const createDonation = async (req, res) => {
  try {
    const { foodType, quantity, location, pickupDate, description } = req.body;
    const donorId = req.userId; // from isAuth middleware

    // ✅ Get donor profile linked to user
    const donorProfile = await Donor.findOne({ user: donorId });
    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found. Please create donor profile first.",
      });
    }

    // ✅ Create new donation
    const newDonation = new Donation({
      donor: donorProfile.user, // reference to user
      donorName: donorProfile.fullName,
      donorPhone: donorProfile.mobile,
      foodType,
      quantity,
      location,
      pickupDate,
      description,
      status: "Available",
    });

    await newDonation.save();

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      donation: newDonation,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating donation",
      error: error.message,
    });
  }
};

/**
 * @desc Get all available donations (Receiver side)
 * @route GET /api/donations/all
 * @access Public
 */
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Available" })
      .sort({ createdAt: -1 })
      .select("foodType quantity location donorName donorPhone createdAt status");

    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching donations",
    });
  }
};

/**
 * @desc Get logged-in donor's donations
 * @route GET /api/donations/my-donations
 * @access Private
 */
export const getDonationsByDonor = async (req, res) => {
  try {
    const donorId = req.userId;
    const donations = await Donation.find({ donor: donorId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      donations,
    });
  } catch (error) {
    console.error("Error fetching donor's donations:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching donor's donations",
    });
  }
};

// Accept a donation (Receiver side)
// controllers/donation.controller.js
export const acceptDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const receiverId = req.userId;

    const Receiver = (await import("../models/receiver.model.js")).default;
    const receiverProfile = await Receiver.findOne({ user: receiverId });
    if (!receiverProfile) {
      return res.status(404).json({ success: false, message: "Receiver profile not found" });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    donation.status = "Collected";
    donation.receiver = receiverId;
    donation.receiverName = receiverProfile.fullName;
    donation.receiverPhone = receiverProfile.mobile;

    await donation.save();

    res.status(200).json({ success: true, message: "Donation accepted", donation });
  } catch (err) {
    console.error("Error accepting donation:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ success: false, message: "Donation not found" });
    }

    // Ensure the logged-in user is the donor
    if (donation.donor.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await donation.deleteOne();
    res.status(200).json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting donation",
    });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const receiverId = req.userId;
    const donations = await Donation.find({ receiver: receiverId })
      .populate("donor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, donations });
  } catch (err) {
    console.error("Error fetching receiver requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


