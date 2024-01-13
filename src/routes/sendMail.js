// src/routes/sendMail.js

export async function post(req, res) {
    try {
      const { userEmail, message } = req.body;
  
  
      const nodemailer = require('nodemailer');
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'kurudhiofficial@gmail.com', // replace with your email
          pass: 'vutf jrjw bnpc jire', // replace with your password or use app-specific password
        },
      });
  
      // Define the email options
      const mailOptions = {
        from: 'noreply@kurudhi.com',
        to: userEmail,
        subject: '[🔐 Security Alert] Successful Login to Your Kurudhi.com Profile',
        html: message,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error(error);
  
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ success: false, error: 'Internal Server Error' }));
    }
  }
  