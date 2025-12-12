import Donation from "../models/Donation.js";

// Create Donation
export const createDonation = async (req, res) => {
  try {
    const { foodType, quantity, location, pickupDate, description } = req.body;
    const donorId = req.user?._id; // assuming you have user authentication middleware

    const donation = await Donation.create({
      donor: donorId,
      foodType,
      quantity,
      location,
      pickupDate,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Donation submitted successfully",
      donation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Donations (for receivers)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: "Available" })
      .populate("donor", "name email") // get donor details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, donations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Mark Donation as Collected (optional)
export const markAsCollected = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation)
      return res.status(404).json({ success: false, message: "Donation not found" });

    donation.status = "Collected";
    await donation.save();

    res.status(200).json({ success: true, message: "Donation marked as collected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
