const outcomeModle = require("../models/outcomeModel");
const Category = require("../models/categoryModel");

const createOutComeCtrl = async (req, res) => {
  const { propertyData } = req.body; // Extract propertyData
  const { expense, months = {}, categoryId } = propertyData || {}; // Destructure from propertyData

  try {
    // Validate required fields
    if (!expense || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Both `expense` and `categoryId` are required.",
      });
    }

    const catDetails = await Category.findById(categoryId)
    console.log(catDetails)

    
    // Calculate totalAmount from months
    const totalAmount = Object.values(months).reduce(
      (acc, curr) => acc + (curr || 0),
      0
    );

    // Create the outcome entry
    const outcome = await outcomeModle.create({
      expense,
      months,
      totalAmount,
      categoryId,
     currency: catDetails.currency || "USD"
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Outcome created successfully!",
      outcome,
    });
  } catch (error) {
    console.error("Error creating outcome:", error);
    res.status(500).json({
      success: false,
      message: "Error in create outcome API",
      error: error.message,
    });
  }
};

const deleteOutcomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProperty = await outcomeModle.findByIdAndDelete(id);
    if (!deleteProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Outcome not found" });
    }
    res.status(200).json({
      success: true,
      message: "Outcome deleted successfully",
      property: deleteProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllOutcomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const properties = await outcomeModle.find({ categoryId: id });
    res.json({
      success: true,
      properties,
    });
    console.log(properties);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching property outcome.",
      error: error.message,
    });
  }
};

const getOutcomeCtrl = async (req, res) => {
  try {
    const properties = await outcomeModle.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching property outcome.",
      error: error.message,
    });
  }
};

const updateMonthsOutcome = async (req, res) => {
  const { id } = req.params;
  const { month, amount, operation, year, document } = req.body;

  // Validate input
  if (!month || typeof amount !== "number") {
    return res
      .status(400)
      .json({
        message: "Month and amount are required, and amount should be a number",
      });
  }

  const validMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (!validMonths.includes(month)) {
    return res.status(400).json({ message: "Invalid month" });
  }

  try {
    const currentYear = year || new Date().getFullYear();

    // Find the document for the given year
    let outcomeRecord = await outcomeModle.findOne({
      _id: id,
      createdAt: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
      },
    });

   
    if (!outcomeRecord) {
      // Create a new document if it doesn't exist
      outcomeRecord = new outcomeModle({
        _id: id,
        months: { [month]: amount },
        documents: [
          {
            month: month,
            url: document.url, // Ensure `document` variable contains a valid URL
          },
        ],
        totalAmount: amount,
        updateLog: [
          {
            date: new Date(),
            updatedFields: new Map([[month, String(amount)]]),
            operation,
            currency:outcomeRecord.currency || "USD"
          },
        ],
      });
    } else {
      // Update the existing document
      outcomeRecord.months[month] = amount;
      const existingDocumentIndex = outcomeRecord.documents.findIndex(
        (doc) => doc.month === month
      );

      if (existingDocumentIndex !== -1) {
        // If month exists, update URL
        outcomeRecord.documents[existingDocumentIndex].url = document.url;
      } else {
        // If not, push new document entry
        outcomeRecord.documents.push({ month, url: document.url });
      }
      // Recalculate totalAmount
      outcomeRecord.totalAmount = Object.values(outcomeRecord.months).reduce(
        (acc, curr) => acc + curr,
        0
      );

      // Check for an existing log entry for the month
      const existingLogIndex = outcomeRecord.updateLog.findIndex((log) =>
        log.updatedFields.has(month)
      );

      if (existingLogIndex !== -1) {
        // Update the existing log entry
        outcomeRecord.updateLog[existingLogIndex].date = new Date();
        outcomeRecord.updateLog[existingLogIndex].updatedFields.set(
          month,
          String(amount)
        );
        outcomeRecord.updateLog[existingLogIndex].operation = operation;
      } else {
        // Add a new log entry if no existing log is found for the month
        outcomeRecord.updateLog.push({
          date: new Date(),
          updatedFields: new Map([[month, String(amount)]]),
          operation,
          currency:outcomeRecord.currency || "USD"

        });
      }
    }

    // Save the document
    await outcomeRecord.save();

    res.status(200).json({
      message: outcomeRecord.isNew
        ? "New outcome record created successfully"
        : "Outcome record updated successfully",
      data: outcomeRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};





const getDocumentsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Validate categoryId
        if (!categoryId) {
            return res.status(400).json({ success: false, message: "Category ID is required" });
        }

        // Fetch all outcomes under the given category
        const outcomes = await outcomeModle.find({ categoryId }).populate("categoryId", "name");

        if (!outcomes.length) {
            return res.status(404).json({ success: false, message: "No records found for this category" });
        }

        // Format the response
        const response = outcomes.map(outcome => {
            const filteredMonths = outcome.documents.map(doc => ({
                month: doc.month,
                amount: outcome.months[doc.month] || 0, // Get amount for that month
                url: doc.url,
                date:doc.date || Date.now()
            }));

            return {
                _id: outcome._id,
                expense: outcome.expense,
                categoryId: outcome.categoryId?._id || null,
                categoryName: outcome.categoryId?.name || null,
                documents: filteredMonths // Only months with documents
            };
        });

        res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error
        });
    }
};






module.exports = {
  createOutComeCtrl,
  deleteOutcomeCtrl,
  getAllOutcomeCtrl,
  getOutcomeCtrl,
  updateMonthsOutcome,
  getDocumentsByCategory
};
