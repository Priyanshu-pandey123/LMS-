const Lead = require("../model/leadSchema");

exports.createOrUpdateLead = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const leadData = { ...req.body, createdBy: req.user.id };

    // Check if a lead already exists for the user
    const existingLead = await Lead.findOne({ createdBy: req.user.id });

    if (existingLead) {
      // Update the existing lead
      const updatedLead = await Lead.findOneAndUpdate(
        { createdBy: req.user.id },
        leadData,
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        message: "Lead updated successfully",
        lead: updatedLead,
      });
    }

    // Create a new lead if not found
    const newLead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead: newLead,
    });
  } catch (error) {
    console.error("Error creating/updating lead:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing lead", error });
  }
};
// exports.createLead = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const leadData = { ...req.body, createdBy: req.user.id };

//     const lead = new Lead(leadData);

//     await lead.save();

//     res
//       .status(201)
//       .json({ success: true, message: "Lead created successfully", lead });
//   } catch (error) {
//     console.error("Error creating lead:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating lead", error });
//   }
// };
// exports.getLead = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const lead = await Lead.findOne({ createdBy: req.user.id });

//     if (!lead) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Lead not found" });
//     }

//     res.status(200).json({ success: true, message: "Lead found", lead });
//   } catch (error) {
//     console.error("Error finding lead:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error finding lead", error });
//   }
// };
