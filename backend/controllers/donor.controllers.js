import Donation from "../models/donation.model.js";
import Donor from "../models/donor.model.js";

/**
 * @desc Create a new donation
 * @route POST /api/donations/create
 * @access Private (requires isAuth)
 */
export const createDonation = async (req, res) => {
  try {
    const { foodType, quantity, location, pickupDate, description } = req.body;
    const donorId = req.userId;

    // ✅ Corrected lookup
    const donorProfile = await Donor.findOne({ user: donorId });

    if (!donorProfile) {
      return res.status(404).json({
        success: false,
        message: "Donor profile not found",
      });
    }

    const newDonation = new Donation({
      donor: donorProfile._id,   // donor ref
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
    console.error("Donation creation error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while creating donation",
      error: error.message,
    });
  }
};
