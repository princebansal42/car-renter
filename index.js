require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");

app.use(express.json({ extended: false }));
app.use(routes);
const connectDB = require("./config/db");
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
