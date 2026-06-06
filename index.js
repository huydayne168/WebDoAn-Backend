const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Export router

const sanphamRoutes = require("../server/routes/sanphamRoute");
const danhmucRoutes = require("./routes/danhmucRoute");
const nhanvienRoutes = require("./routes/nhanvienRoute");
const khachhangRoutes = require("./routes/khachhangRoute");
const khohangRoutes = require("./routes/khohangRoute");
const donhangRoutes = require("./routes/hoadonRoute");
const hdnRoutes = require("./routes/hoadonnhapRoute");
const ctdhRoutes = require("./routes/ctdhRoutes");
const taikhoanRoutes = require("./routes/taikhoanRoute");
const dathangRoutes = require("./routes/dathangRoute");
const vnpayRoutes = require("./routes/vnpayRoute");
const voucherRoutes = require("./routes/voucherRoute");
const bannerRoutes = require("./routes/bannerRoute");
const danhgiaRoutes = require("./routes/danhgiaRoute");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "WebDoAn backend is running" });
});

// Sử dụng route
app.use(sanphamRoutes);
app.use(danhmucRoutes);
app.use(nhanvienRoutes);
app.use(khachhangRoutes);
app.use(khohangRoutes);
app.use(donhangRoutes);
app.use(hdnRoutes);
app.use(ctdhRoutes);
app.use(taikhoanRoutes);
app.use(dathangRoutes);
app.use(vnpayRoutes);
app.use(voucherRoutes);
app.use(bannerRoutes);
app.use(danhgiaRoutes);

if (require.main === module) {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app;
