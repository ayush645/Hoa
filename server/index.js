const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { cloudinaryConnect } = require("./config/cloudinary")
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");


dotenv.config();

const PORT = process.env.PORT || 8080
connectDB();



// middleware 
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());

app.use(cors({
  origin: "*",
  credentials: true,
}))

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp"
  })
)

cloudinaryConnect();


// routes  
app.use("/api/v1/auth", require("./routes/authRoute"))
app.use("/api/v1/category", require("./routes/categoryRoutes"))
app.use("/api/v1/image", require("./routes/imageRoute"));
app.use("/api/v1/propertyinformation", require("./routes/propertyInformationRoute"));
app.use("/api/v1/propertycommiti", require("./routes/propertyCommitiRoute"));
app.use("/api/v1/units", require("./routes/unitsRoutes"));
app.use("/api/v1/owner", require("./routes/ownerRoute"));
app.use("/api/v1/income", require("./routes/incomeRoute"));
app.use("/api/v1/outcome", require("./routes/outcomeRoute"));
app.use("/api/v1/budget", require("./routes/budgetRoute"));
app.use("/api/v1/budgetincome", require("./routes/budgetIncomeRoute"));
app.use("/api/v1/budgetoutcome", require("./routes/budgetoutcomeRoute"));








// default route 
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ..."
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at port no ${PORT}`)
})
