const incomeModel = require("../models/Income"); // Adjust the path as per your project structure
const Outcome = require("../models/outcomeModel");
const PropertyInformations = require("../models/PropertyInformationsModel"); // Adjust the path as necessary
const ejs = require("ejs");
const path = require("path");
const nodemailer = require("nodemailer");

const pdf = require("html-pdf-node");

async function generatePDF2(data) {
  try {
    // Render the EJS template
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "../mail_template/reciapt.ejs"),
      data
    );

    // Define PDF options
    const options = {
      format: "A4",
      margin: {
        top: "20mm",
        right: "10mm",
        bottom: "20mm",
        left: "10mm",
      },
      path: "./output.pdf", // Optional: specify the output file path
      args: ["--no-sandbox", "--disable-setuid-sandbox"] // Add these arguments for headless mode
    };

    // Generate PDF from HTML
    const file = { content: htmlContent };
    const pdfBuffer = await pdf.generatePdf(file, options);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

async function sendEmail(pdfBuffer, recipientEmail, filename) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // Set in .env
      pass: process.env.MAIL_PASS, // Set in .env
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: recipientEmail,
    subject: "HOA Payment Reminder",
    text: "Please find the HOA payment reminder attached.",
    attachments: [
      {
        filename: filename,
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}


const createIncomeCtrl = async (req, res) => {
  const {
    ownerName, // Replace 'ownerName' with 'incomeName' if necessary
    months = {},
    categoryId,
    contribution,
  } = req.body;
  console.log(months);
  try {
    // Validate required fields
    if (!ownerName) {
      return res.status(400).json({
        success: false,
        message: "Please provide the owner name",
      });
    }

    // Calculate totalAmount from months
    const totalAmount = Object.values(months).reduce(
      (acc, curr) => acc + (curr || 0),
      0
    );
    console.log(totalAmount);

    // Create the income entry
    const income = await incomeModel.create({
      ownerName,
      months,
      totalAmount,
      categoryId,
      contribution,
    });

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Income created successfully!",
      income,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error in create income API",
    });
  }
};

const deleteIncomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProperty = await incomeModel.findByIdAndDelete(id);
    if (!deleteProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }
    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
      property: deleteProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllIncomeCtrl = async (req, res) => {
  const { id } = req.params;
  try {
    const properties = await incomeModel
      .find({ categoryId: id })
      .sort({ createdAt: -1 });

    console.log(properties);
    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching income.",
      error: error.message,
    });
  }
};

const getIncomeCtrl = async (req, res) => {
  try {
    const properties = await incomeModel.find();
    console.log(properties); // Check if data is being fetched

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching income.",
      error: error.message,
    });
  }
};

const updateMonthsIncome = async (req, res) => {
  const { id } = req.params;
  const { month, amount, operation, year, method } = req.body;

  if (!month || typeof amount !== "number") {
    return res.status(400).json({
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
    const currentYear = year;

    // Find the document for the given year
    let incomeRecord = await incomeModel.findOne({
      _id: id,
      createdAt: {
        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
      },
    });

    let status = amount === 0 ? "not paid" : "not updated";
    if (!incomeRecord) {
      // If no document exists, create a new one
      incomeRecord = new incomeModel({
        _id: id,
        months: { [month]: amount },
        statuses: { [month]: status },
        totalAmount: amount,
        updateLog: [
          {
            date: new Date(),
            updatedFields: { [month]: amount },
            operation: `${operation}'s Contribution ${month}`,
          },
        ],
      });
    } else {
      // Update the existing document
      incomeRecord.months[month] = amount;
      incomeRecord.statuses[month] = status;

      // Recalculate totalAmount
      incomeRecord.totalAmount = Object.values(incomeRecord.months).reduce(
        (acc, curr) => acc + curr,
        0
      );

      // Find existing log entry for the month
      const existingLogIndex = incomeRecord.updateLog.findIndex((log) =>
        log.updatedFields.has(month)
      );

      console.log(existingLogIndex);
      if (existingLogIndex !== -1) {
        incomeRecord.updateLog[existingLogIndex].date = new Date();
        incomeRecord.updateLog[existingLogIndex].updatedFields.set(
          month,
          String(amount)
        );
        incomeRecord.updateLog[
          existingLogIndex
        ].operation = `${operation}'s Contribution ${month}`;
      } else {
        // Add a new log entry for the month
        incomeRecord.updateLog.push({
          date: new Date(),
          updatedFields: new Map([[month, String(amount)]]),
          operation: `${operation}'s Contribution ${month}`,
        });
      }
    }

    // Save the document
    await incomeRecord.save();
    const propertInfo = await PropertyInformations.find({
      categoryId: incomeRecord.categoryId,
    });

    const paymentDateTime = new Date();

    // Extract the month, date, and year
    const month2 = paymentDateTime.toLocaleString("default", { month: "long" }); // Full month name
    const date = paymentDateTime.getDate();
    const year2 = paymentDateTime.getFullYear();

    const monthAmount = incomeRecord.months[month];
    const contribution = incomeRecord.contribution;
    const data = {
      logoPath: propertInfo[0]?.logo?.url,
      stampImagePath: "https://i.ibb.co/428Fp08/h1.png",
      propertyAddress: propertInfo[0]?.pName,
      ownerName: incomeRecord.ownerName,
      receiptNumber: "12345",
      ownerUnit: incomeRecord.unit,
      dueMonth: contribution,
      amountToPay: amount,
      paidAmount: amount,
      dueAmount: contribution - monthAmount,
      paymentMethod: method,
      paymentDateTime: `${month2} ${date}, ${year2}`,
    };

    const pdfBuffer = await generatePDF2(data);

    // Send Email
    await sendEmail(pdfBuffer, incomeRecord.email, "Payment_Receipt.pdf");

    res.status(200).json({
      message: incomeRecord.isNew
        ? "New income record created successfully"
        : "Income record updated successfully",
      data: incomeRecord,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const findAllLogs = async (req, res) => {
  try {
    // Find all Outcome documents
    const outcomes = await Outcome.find();
    const income = await incomeModel.find(); // Ensure `incomeModel` is correctly imported

    // Initialize empty arrays to store all logs
    let outComeLogs = [];
    let InComeLogs = [];

    // Loop through each outcome document and merge their updateLogs
    outcomes.forEach((outcome) => {
      if (outcome.updateLog && outcome.updateLog.length > 0) {
        // Push the updateLog entries into the outComeLogs array
        outComeLogs = outComeLogs.concat(outcome.updateLog);
      }
    });

    // Loop through each income document and merge their updateLogs
    income.forEach((incomeDoc) => {
      if (incomeDoc.updateLog && incomeDoc.updateLog.length > 0) {
        // Push the updateLog entries into the InComeLogs array
        InComeLogs = InComeLogs.concat(incomeDoc.updateLog);
      }
    });

    // Return the combined updateLog as a response
    return res.status(200).json({ success: true, outComeLogs, InComeLogs });
  } catch (err) {
    console.error("Error fetching update logs:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching update logs" });
  }
};

module.exports = {
  createIncomeCtrl,
  deleteIncomeCtrl,
  getAllIncomeCtrl,
  getIncomeCtrl,
  updateMonthsIncome,
  findAllLogs,
};
