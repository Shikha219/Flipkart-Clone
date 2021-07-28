const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");


//environment variables or constants
env.config();



//mongodb connection
// admin-shikha shikha123
mongoose.connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.dveic.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
     {
         useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        }
).then(()=>{
    console.log(`Database connected`);
});

//use bodyParser
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use("/api",authRoutes);
app.use("/api",adminRoutes);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});