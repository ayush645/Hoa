const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const Owner = require("../models/Income"); // Adjust the path as necessary
const PropertyInformations = require("../models/PropertyInformationsModel"); // Adjust the path as necessary
const pdf = require("html-pdf-node");
const PropertyCommitiModel = require("../models/PropertyCommitiModel");

const router = express.Router();



async function generatePDF(data) {
  try {
    // Render the EJS template
    const htmlContent = await ejs.renderFile(
      path.join(__dirname, "../mail_template/hoaPaymentReminder.ejs"),
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

async function generatePDF2(data) {
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../mail_template/hoaPartialPaymentReminder.ejs"),
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
};

// Generate PDF from HTML
const file = { content: htmlContent };
const pdfBuffer = await pdf.generatePdf(file, options);

return pdfBuffer;
}



// Send email using Nodemailer
async function sendEmail(pdfBuffer, recipientEmail,filename) {
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
        filename:filename ,
        content: pdfBuffer,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

// API Endpoint to send email
router.post("/dueMail", async (req, res) => {
  const { ownerId, dueMonth } = req.body;
console.log("hello")
  if (!ownerId || !dueMonth) {
    return res
      .status(400)
      .json({ error: "Owner ID and due month are required" });
  }

  try {
    // Fetch owner data from database
    const owner = await Owner.findById(ownerId).populate("categoryId");
    const propertInfo = await PropertyInformations.find({
      categoryId: owner.categoryId,
    });

    const comity = await PropertyCommitiModel.findOne({categoryId:owner.categoryId,position:"President"})
    console.log(comity)
    
    const monthAmount = owner.months[dueMonth];
    const contribution = owner.contribution;

    if (monthAmount >= contribution) {
      res.status(500).json({ error: "All ready paid" });
    }

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Prepare data for template
    const data = {
      logoPath: propertInfo[0]?.logo?.url, // Replace with actual logo path
      prisident:comity.name,
      propertyAddress: propertInfo[0]?.pName,
      ownerName: owner.ownerName,
      expiredMonth: dueMonth, // Use the due month provided by the frontend
      outstandingAmount: contribution - monthAmount,
      dueDate: `${dueMonth}`, // Example due date, adjust logic as needed
      stampImageUrl: "https://i.ibb.co/428Fp08/h1.png",
      contactInfo: "hoa@example.com",
    };

    // Generate PDF
    const pdfBuffer = await generatePDF(data);

    // Send Email
    await sendEmail(pdfBuffer, owner.email,"hoa_payment_reminder.pdf");

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

router.post("/partialPayment", async (req, res) => {
  const { ownerId, dueMonth, followingMonth, newDueDate } = req.body;

  if (!ownerId || !dueMonth) {
    return res
      .status(400)
      .json({ error: "Owner ID and due month are required" });
  }

  try {
    // Fetch owner data from database
    const owner = await Owner.findById(ownerId).populate("categoryId");
    const propertInfo = await PropertyInformations.find({
      categoryId: owner.categoryId,
    });
    console.log(owner.months[dueMonth]);

    const monthAmount = owner.months[dueMonth];
    const contribution = owner.contribution;

    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Prepare data for template
    const data = {
      logoPath: propertInfo[0]?.logo?.url, // Replace with actual logo path
      propertyAddress: propertInfo[0]?.pName,
      ownerName: owner.ownerName,
      memberName: owner.ownerName,
      dueMonth: dueMonth,
      followingMonth: followingMonth,

      outstandingAmount: contribution - monthAmount,

      dueDate: newDueDate,
      contactInfo: "HOA Office: (555) 123-4567",
    };

    // Generate PDF
    const pdfBuffer = await generatePDF2(data);

    // Send Email
    await sendEmail(pdfBuffer, owner.email,"Partial_Reminder.pdf");

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
