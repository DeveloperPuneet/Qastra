// * importing modules
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const mongoose = require("mongoose");

// * mongodb models
const Accounts = require("../models/Accounts");
const Questions = require("../models/Question");
const Notifications = require("../models/Notification");
const Answers = require("../models/Answer");

// * importing files
const config = require('../config/config');
const Question = require("../models/Question");
const Answer = require("../models/Answer");

// * mailing system 
const VerificationMail = async (name, email, id) => {
    try {
        const transports = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mailOption = {
            from: config.email,
            to: email,
            subject: 'Qastra Verification Mail',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Qastra Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at top left, #1e1e1e, #0a0a0a);
      color: #e0e0e0;
      position: relative;
      overflow: hidden;
      min-height: 100vh;
    }

    /* Sparkle Particles */
    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(#ffffff15 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.05;
      z-index: 0;
    }

    .blob {
      position: absolute;
      z-index: 0;
      opacity: 0.12;
      filter: blur(10px);
    }

    .blob1 {
      top: -100px;
      left: -100px;
      transform: rotate(25deg);
    }

    .blob2 {
      bottom: -120px;
      right: -80px;
      transform: rotate(-35deg);
    }

    .container {
      position: relative;
      z-index: 2;
      width: 92%;
      max-width: 720px;
      margin: 80px auto;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 26px;
      padding: 50px 40px;
      backdrop-filter: blur(15px);
      box-shadow: 0 0 30px rgba(0, 255, 200, 0.1), inset 0 0 25px rgba(255,255,255,0.03);
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 24px;
      background: linear-gradient(90deg, #ffd700, #fff6aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: #cccccc;
      text-align: center;
      margin: 18px 0;
    }

    .aura {
      margin: 40px auto;
      padding: 20px 35px;
      font-size: 26px;
      font-weight: bold;
      text-align: center;
      border-radius: 20px;
      background: radial-gradient(circle at center, #1f1f1f, #121212);
      color: #00ff99;
      box-shadow:
        0 0 25px #00ff9970,
        0 0 10px #00ffaa40 inset,
        0 0 4px #00ff9970 inset;
      letter-spacing: 4px;
    }

    .footer {
      margin-top: 60px;
      font-size: 13px;
      color: #666;
      text-align: center;
      border-top: 1px solid #333;
      padding-top: 16px;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }

      .aura {
        font-size: 22px;
        padding: 16px 24px;
      }
    }
  </style>
</head>
<body>
  <!-- 🌀 Blobs -->
  <svg class="blob blob1" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M120,-155.2C161.7,-122.2,202.4,-81.6,215.1,-34.4C227.9,12.9,212.7,66.5,182.3,110.4C151.9,154.2,106.3,188.3,56.9,199.5C7.5,210.7,-46,199.1,-91.4,172.6C-136.7,146,-173.9,104.5,-183.8,58.5C-193.6,12.6,-176.1,-38.9,-145.8,-86.7C-115.5,-134.5,-72.3,-178.6,-21.1,-188.3C30.1,-198,80.2,-173.2,120,-155.2Z" fill="#00ffc8"/>
    </g>
  </svg>

  <svg class="blob blob2" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M112.6,-137.6C147.4,-105.1,178.3,-73.7,189.9,-35.4C201.5,2.8,193.8,47.9,173.5,91.5C153.3,135.1,120.5,177.1,79.7,191.4C38.9,205.7,-10,192.2,-51.4,167.1C-92.8,142,-126.7,105.3,-150.5,60.6C-174.3,15.9,-187.9,-36.7,-169.1,-82.2C-150.4,-127.7,-99.3,-165.9,-47,-178.2C5.3,-190.5,58.8,-176.1,112.6,-137.6Z" fill="#00bcd4"/>
    </g>
  </svg>

  <!-- 💠 Main Card -->
  <div class="container">
    <h1>🌟 Welcome to Qastra, ${name}!</h1>
    <p>You’ve just unlocked the gates to something legendary. Use the code below to verify your account and begin your journey with us. This step confirms your identity and secures your space in our universe.</p>
    <div class="aura">${id}</div>
    <p>If this wasn’t you, you can safely ignore this message. Otherwise — destiny awaits ⚡</p>
    <p>Qastra – Crafted to awaken minds. Engineered for excellence.</p>
    <div class="footer">
      © 2025 Qastra Inc. All rights reserved.
    </div>
  </div>
</body>
</html>
`
        }
        transports.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("Qastra fail code 3");
            }
            else {
                console.log("Mail sent 🕊");
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const ResetPasswordMail = async (name, email, id) => {
    try {
        const transports = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mailOption = {
            from: config.email,
            to: email,
            subject: 'Qastra Reset Password code',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Qastra Password</title>
  <style>
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at top left, #1e1e1e, #0a0a0a);
      color: #e0e0e0;
      position: relative;
      min-height: 100vh;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(#ffffff15 1px, transparent 1px);
      background-size: 22px 22px;
      opacity: 0.03;
      z-index: 0;
    }

    .blob {
      position: absolute;
      z-index: 0;
      opacity: 0.1;
      filter: blur(12px);
    }

    .blob1 {
      top: -120px;
      left: -90px;
      transform: rotate(30deg);
    }

    .blob2 {
      bottom: -100px;
      right: -120px;
      transform: rotate(-35deg);
    }

    .container {
      position: relative;
      z-index: 2;
      width: 92%;
      max-width: 720px;
      margin: 80px auto;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 50px 40px;
      backdrop-filter: blur(14px);
      box-shadow: 0 0 20px rgba(255, 80, 80, 0.08), inset 0 0 15px rgba(255,255,255,0.03);
    }

    h1 {
      font-size: 30px;
      font-weight: 700;
      text-align: center;
      margin-bottom: 20px;
      background: linear-gradient(90deg, #ff5f5f, #ffaaaa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: #cccccc;
      text-align: center;
      margin: 18px 0;
    }

    .code {
      display: inline-block;
      background: #1a1a1a;
      padding: 20px 38px;
      border-radius: 14px;
      font-size: 24px;
      font-weight: bold;
      color: #ff4d4d;
      letter-spacing: 4px;
      text-shadow: 0 0 10px #ff4d4daa, 0 0 4px #ff000050;
      box-shadow: 0 0 22px #ff4d4d40, inset 0 0 10px #ff4d4d30;
      margin: 30px auto;
      text-align: center;
    }

    .footer {
      margin-top: 60px;
      font-size: 13px;
      color: #777;
      text-align: center;
      border-top: 1px solid #333;
      padding-top: 16px;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }

      .code {
        font-size: 20px;
        padding: 16px 24px;
      }
    }
  </style>
</head>
<body>
  <!-- 🔮 Background Blobs -->
  <svg class="blob blob1" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M120,-155.2C161.7,-122.2,202.4,-81.6,215.1,-34.4C227.9,12.9,212.7,66.5,182.3,110.4C151.9,154.2,106.3,188.3,56.9,199.5C7.5,210.7,-46,199.1,-91.4,172.6C-136.7,146,-173.9,104.5,-183.8,58.5C-193.6,12.6,-176.1,-38.9,-145.8,-86.7C-115.5,-134.5,-72.3,-178.6,-21.1,-188.3C30.1,-198,80.2,-173.2,120,-155.2Z" fill="#ff5252"/>
    </g>
  </svg>
  <svg class="blob blob2" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M112.6,-137.6C147.4,-105.1,178.3,-73.7,189.9,-35.4C201.5,2.8,193.8,47.9,173.5,91.5C153.3,135.1,120.5,177.1,79.7,191.4C38.9,205.7,-10,192.2,-51.4,167.1C-92.8,142,-126.7,105.3,-150.5,60.6C-174.3,15.9,-187.9,-36.7,-169.1,-82.2C-150.4,-127.7,-99.3,-165.9,-47,-178.2C5.3,-190.5,58.8,-176.1,112.6,-137.6Z" fill="#ff7272"/>
    </g>
  </svg>

  <!-- 🧊 Frosted Card -->
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hey ${name},</p>
    <p>Someone (hopefully you 👀) requested to reset the password for your Qastra account. If that’s you, use this special code to verify:</p>
    <div class="code">${id}</div>
    <p>If this wasn’t you, just ignore this email — your account is safe and untouched.</p>
    <p>Stay secure. Stay curious. Stay legendary. 🔐</p>
    <div class="footer">
      © 2025 Qastra Inc. All rights reserved.
    </div>
  </div>
</body>
</html>`
        }
        transports.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("Qastra fail code 3");
            }
            else {
                console.log("Mail sent 🕊");
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

const ReportMail = async (email, QID) => {
    try {
        const transports = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.email,
                pass: config.password
            }
        });

        const mailOption = {
            from: config.email,
            to: email,
            subject: 'Qastra Report Mail',
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Qastra Report Alert – QID Flagged</title>
  <style>
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background: radial-gradient(circle at top left, #1a1a1a, #0d0d0d);
      color: #e0e0e0;
      position: relative;
      min-height: 100vh;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(#ffffff10 1px, transparent 1px);
      background-size: 22px 22px;
      opacity: 0.04;
      z-index: 0;
    }

    .blob {
      position: absolute;
      z-index: 0;
      opacity: 0.1;
      filter: blur(12px);
    }

    .blob1 {
      top: -120px;
      left: -100px;
      transform: rotate(45deg);
    }

    .blob2 {
      bottom: -110px;
      right: -90px;
      transform: rotate(-40deg);
    }

    .container {
      position: relative;
      z-index: 2;
      width: 92%;
      max-width: 720px;
      margin: 80px auto;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      padding: 50px 40px;
      backdrop-filter: blur(14px);
      box-shadow: 0 0 25px rgba(255, 60, 60, 0.08), inset 0 0 15px rgba(255, 0, 0, 0.04);
    }

    h1 {
      font-size: 28px;
      font-weight: 800;
      text-align: center;
      margin-bottom: 18px;
      background: linear-gradient(90deg, #ff4d4d, #ff9999);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      font-size: 16px;
      line-height: 1.7;
      color: #cccccc;
      text-align: center;
      margin: 16px 0;
    }

    .code {
      display: inline-block;
      background: #1a1a1a;
      padding: 20px 38px;
      border-radius: 14px;
      font-size: 24px;
      font-weight: bold;
      color: #ff4d4d;
      letter-spacing: 4px;
      text-shadow: 0 0 10px #ff4d4daa, 0 0 4px #ff000050;
      box-shadow: 0 0 22px #ff4d4d40, inset 0 0 10px #ff4d4d30;
      margin: 30px auto;
      text-align: center;
    }

    .footer {
      margin-top: 50px;
      font-size: 13px;
      color: #777;
      text-align: center;
      border-top: 1px solid #333;
      padding-top: 16px;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }

      .code {
        font-size: 20px;
        padding: 16px 24px;
      }
    }
  </style>
</head>
<body>

  <!-- 🔮 Visual Blobs -->
  <svg class="blob blob1" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M120,-155.2C161.7,-122.2,202.4,-81.6,215.1,-34.4C227.9,12.9,212.7,66.5,182.3,110.4C151.9,154.2,106.3,188.3,56.9,199.5C7.5,210.7,-46,199.1,-91.4,172.6C-136.7,146,-173.9,104.5,-183.8,58.5C-193.6,12.6,-176.1,-38.9,-145.8,-86.7C-115.5,-134.5,-72.3,-178.6,-21.1,-188.3C30.1,-198,80.2,-173.2,120,-155.2Z" fill="#ff4d4d"/>
    </g>
  </svg>

  <svg class="blob blob2" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(300,300)">
      <path d="M112.6,-137.6C147.4,-105.1,178.3,-73.7,189.9,-35.4C201.5,2.8,193.8,47.9,173.5,91.5C153.3,135.1,120.5,177.1,79.7,191.4C38.9,205.7,-10,192.2,-51.4,167.1C-92.8,142,-126.7,105.3,-150.5,60.6C-174.3,15.9,-187.9,-36.7,-169.1,-82.2C-150.4,-127.7,-99.3,-165.9,-47,-178.2C5.3,-190.5,58.8,-176.1,112.6,-137.6Z" fill="#ff8888"/>
    </g>
  </svg>

  <!-- 🧊 Alert Card -->
  <div class="container">
    <h1>Qastra Report Alert 🚨</h1>
    <p>Hello Admin,</p>
    <p>A user has flagged a question on Qastra. The reported QID is shown below.</p>
    <div class="code">${QID}</div>
    <p>Please review the question and take any necessary action based on its content or community feedback.</p>
    <p>This report was generated automatically. If further details are required, visit the admin panel.</p>
    <div class="footer">
      © 2025 Qastra Inc. Internal Communication
    </div>
  </div>
</body>
</html>
`
        }
        transports.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("Qastra fail code 3");
            }
            else {
                console.log("Mail sent 🕊");
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}

// * encrypt password
const EncryptPassword = async (password) => {
    try {
        const encrypted = await bcrypt.hash(password, 10)
        return encrypted
    } catch (error) {
        console.log("Qastra fail code: 5")
    }
}

let GenerateRandomString = (n) => {
    let a = randomstring.generate(n);
    return a
}

// * functions
const Load = async (req, res) => {
    try {
        return res.render("Load");
    } catch (error) {
        console.log(error);
    }
}

const SignInLoad = async (req, res) => {
    try {
        return res.render("Signin");
    } catch (error) {
        console.log(error);
    }
}

const SignUpLoad = async (req, res) => {
    try {
        return res.render("Signup");
    } catch (error) {
        console.log(error);
    }
}

const Signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        let id = GenerateRandomString(20);
        if (email) {
            let v1 = await Accounts.find({ email })
            if (v1) {
                return res.render("Signup", { message: "Error while creating Account" })
            }
        }
        let enc = await EncryptPassword(password);
        if (!enc) {
            return res.render("Signup", { message: "Error while creating Account" });
        } else {
            let acc = new Accounts({
                Name: name,
                Username: username,
                Email: email,
                Password: enc,
                Identity: id
            });
            let data = await acc.save();
            if (data) {
                await VerificationMail(name, email, id);
                return res.redirect("/activation");
            } else {
                return res.render("Signup", { message: "Error while creating Account" })
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const ActivationLoad = async (req, res) => {
    try {
        return res.render("Activation")
    } catch (error) {
        console.log(error);
    }
}

const Activate = async (req, res) => {
    try {
        const { code } = req.body;
        const acc = await Accounts.findOne({ Identity: code });
        if (acc) {
            acc.verification = true;
            await acc.save();
            return res.redirect("/signin");
        } else {
            return res.render("Activation", { message: "Wrong code" });
        }
    } catch (error) {
        console.log(error);
    }
}

const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await Accounts.findOne({ Email: email });
        if (data) {
            let pass = await bcrypt.compare(password, data.Password);
            let pass2 = await bcrypt.compare(data.Password, password);
            if (pass || pass2) {
                if (data.verification == true) {
                    req.session.user = await data.Identity;
                    setTimeout(() => {
                        return res.redirect("/dashboard");
                    }, 2000);
                } else {
                    return res.render("Activation", { message: "Verify your account" });
                }
            } else {
                return res.render("Signin", { message: "Error: Invalid credentials" });
            }
        } else {
            return res.render("Signin", { message: "Error: Invalid credentials" });
        }
    } catch (error) {
        console.log(error)
    }
}

const dashboardLoad = async (req, res) => {
    try {
        const id = req.session.user;
        const acc = await Accounts.findOne({ Identity: id });

        const skip = parseInt(req.query.skip) || 0;
        const limit = 50;
        let ques = await Question.find().sort({ Date: -1 }).skip(skip).limit(limit);

        const answerCounts = await Answer.aggregate([
            { $group: { _id: "$QID", count: { $sum: 1 } } }
        ]);

        const answerCountMap = {};
        answerCounts.forEach(item => {
            answerCountMap[item._id] = item.count;
        });

        ques = ques.map(q => ({
            ...q._doc,
            answerCount: answerCountMap[q.QID] || 0
        }));

        if (req.xhr) {
            return res.json(ques);
        }

        const notifications = await Notifications.find({ NotifyTo: id });
        const notificationMark = notifications.some(n => n.Read === false);
        return res.render("Dashboard", { acc, ques, notificationMark });
    } catch (error) {
        console.log(error);
    }
};

const EnterEmail = async (req, res) => {
    try {
        return res.render("EnterMail");
    } catch (error) {
        console.log(error);
    }
}

const SendResetCode = async (req, res) => {
    try {
        let code = await GenerateRandomString(40);
        let { email } = req.body;
        let acc = await Accounts.findOne({ Email: email });
        if (acc) {
            acc.Token = code;
            let data = await acc.save();
            if (data) {
                await ResetPasswordMail(acc.Name, acc.Email, code);
                return res.render("EnterNewPassword", { message: "Check your mailbox to get code" });
            }
        } else {
            return res.render("EnterMail", { message: "incorrect email" });
        }
    } catch (error) {
        console.log(error);
    }
}

const ChangePassword = async (req, res) => {
    try {
        let { password, token } = req.body;
        let enc = await EncryptPassword(password);
        let acc = await Accounts.findOne({ Token: token });
        if (acc) {
            acc.Password = enc;
            acc.Token = "";
            await acc.save();
            return res.render("Signin", { message: "Password Changed" });
        } else {
            return res.render("EnterNewPassword", { message: "Error while changing Password" });
        }
    } catch (error) {
        console.log(error);
    }
}

const AskAQuestion = async (req, res) => {
    try {
        return res.render("Question");
    } catch (error) {
        console.log(error);
    }
}

function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentTimestamp() {
    return Date.now();
}

const AskingQuestion = async (req, res) => {
    try {
        let { topic, question } = req.body;
        let id = req.session.user;
        let QID = await GenerateRandomString(40);
        let date = getCurrentTimestamp();
        let ques = await Questions({
            author: id,
            Topic: topic,
            Question: question,
            QID: QID,
            Date: date,
        });
        let data = await ques.save();
        if (data) {
            return res.redirect("/dashboard");
        } else {
            return res.render("Question", { message: "Error with server" });
        }
    } catch (error) {
        console.log(error);
    }
}

const ShowQuestion = async (req, res) => {
    try {
        let QID = req.params.QID;
        let ques = await Question.findOne({ QID });

        // Fetch all answers for this question
        let rawAnswers = await Answer.find({ QID }).sort({ Date: -1 });

        // Enrich answers with author name
        let ans = await Promise.all(
            rawAnswers.map(async (answer) => {
                const user = await Accounts.findOne({ Identity: answer.author });
                return {
                    ...answer._doc,
                    authorName: user ? user.Username : "Unknown User"
                };
            })
        );

        if (ques) {
            return res.render("AskedQuestion", { ques, ans });
        }
    } catch (error) {
        console.log(error);
    }
};

const ResponseAnswer = async (req, res) => {
    try {
        let QID = req.params.QID;
        let ques = await Question.findOne({ QID: QID });
        let auth = ques.author;
        console.log(auth);
        let author = req.session.user;
        let { answer } = req.body;
        let date = getCurrentTimestamp();
        let AID = GenerateRandomString(40);
        let ans = Answer({
            author: author,
            Answer: answer,
            Date: date,
            AID: AID,
            QID: QID
        });
        let exp = date + 2592000000;
        const notify = Notifications({
            Type: "Answered",
            message: QID,
            NotifyTo: auth,
            Date: date,
            Expire: exp
        });
        await notify.save();
        let data = await ans.save();
        if (data) {
            return res.redirect(`/question/${QID}`);
        } else {
            return res.redirect(`/question/${QID}`);
        }
    } catch (error) {
        console.log(error);
    }
}

const ReportTheQuestion = async (req, res) => {
    try {
        let QID = req.params.QID;
        await ReportMail(config.email, QID);
        return res.redirect(`/question/${QID}`);
    } catch (error) {
        console.log(error);
    }
}

const saveTheQuestion = async (req, res) => {
    try {
        let { QID } = req.params;
        let id = req.session.user;

        // Find the question
        let ques = await Question.findOne({ QID });

        if (ques) {
            // If user hasn't already saved it
            if (!ques.Saved.includes(id)) {
                ques.Saved.push(id);
                await ques.save();
            }
            return res.redirect(`/question/${QID}`);
        } else {
            res.status(404).send("Question not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
};

const SavedQuestionLoad = async (req, res) => {
    try {
        const id = req.session.user;
        const questions = await Question.find({ Saved: { $in: [id] } }).sort({ Date: -1 });
        return res.render("SavedQuestions", { questions });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const RemoveFromSaved = async (req, res) => {
    try {
        const QID = req.params.QID;
        const userId = req.session.user;

        await Question.updateOne(
            { QID },
            { $pull: { Saved: userId } }
        );

        return res.redirect("/saved-questions");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const AnsweredQuestion = async (req, res) => {
    try {
        const userId = req.session.user;
        const answers = await Answer.find({ author: userId });
        const qids = answers.map(ans => ans.QID);
        const questions = await Question.find({ QID: { $in: qids } }).sort({ Date: -1 });
        return res.render("AnsweredQuestion", { answers, questions });
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const Notification = async (req, res) => {
    try {
        let id = req.session.user;
        let notifications = await Notifications.find({ NotifyTo: id }).sort({ Date: -1 });
        let update = await Notifications.updateMany({ NotifyTo: id }, { $set: { Read: true } });
        if (update) {
            return res.render("Notifications", { notifications });
        }
    } catch (error) {
        console.log(error);
    }
}

const SettingsLoad = async (req, res) => {
    try {
        return res.render("Settings");
    } catch (error) {
        console.log(error);
    }
}

const GuidelineLoad = async (req, res) => {
    try {
        return res.render("Guidelines");
    } catch (error) {
        console.log(error)
    }
}

const PrivacyPolicyLoad = async (req, res) => {
    try {
        return res.render("PrivacyPolicy");
    } catch (error) {
        console.log(error)
    }
}

const TermsOfUse = async (req, res) => {
    try {
        return res.render("Terms");
    } catch (error) {
        console.log(error);
    }
}

const CopyrightLoad = async (req, res) => {
    try {
        return res.render("Copyrights");
    } catch (error) {
        console.log(error);
    }
}

const CookiesLoad = async (req, res) => {
    try {
        return res.render("Cookies");
    } catch (error) {
        console.log(error);
    }
}

const QastraCommunityLoad = async (req, res) => {
    try {
        return res.render("QastraCommunity");
    } catch (error) {
        console.log(error);
    }
}

const HelpCenterLoad = async (req, res) => {
    try {
        return res.render("HelpCenter");
    } catch (error) {
        console.log(error);
    }
}

const SafetyCenterLoad = async (req, res) => {
    try {
        return res.render("SafetyCenter");
    } catch (error) {
        console.log(error);
    }
}

const ResponsibleDisclosureLoad = async (req, res) => {
    try {
        return res.render("ResponsibleDisclosure");
    } catch (error) {
        console.log(error);
    }
}

const ProfileLoad = async (req, res) => {
    try {
        let id = req.session.user;
        let acc = await Accounts.findOne({ Identity: id });
        return res.render("Profile", { acc });
    } catch (error) {
        console.log(error);
    }
}

const EditProfile = async (req, res) => {
    try {
        let { name } = req.body;
        let id = req.session.user;
        let acc = await Accounts.findOne({ Identity: id });
        acc.Name = name;
        let data = await acc.save();
        return res.render("Profile", { acc });
    } catch (error) {
        console.log(error);
    }
}

const AccountActionsLoad = async (req, res) => {
    try {
        return res.render("AccountActionsLoad");
    } catch (error) {
        console.log(error);
    }
}

const Logout = async (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
            }
            res.clearCookie('connect.sid');
            return res.redirect("/");
        });
    } catch (error) {
        console.log(error);
    }
}

const deleteAccount = async (req, res) => {
    try {
        const userId = req.session.user;
        await Question.deleteMany({ author: userId });
        await Answer.deleteMany({ author: userId });
        await Accounts.findOneAndDelete({ Identity: userId });
        await Notifications.deleteMany({ NotifyTo: userId });
        req.session.destroy(err => {
            if (err) {
                return res.redirect("/");
            }
        });
        return res.redirect("/");
    } catch (error) {
        console.error(error);
    }
};

const { GridFSBucket } = require('mongodb');
const Media = require('../models/Media');
const formidable = require('formidable');
const fs = require('fs');

const UploadPage = async (req, res) => {
    const acc = await Accounts.findOne({ Identity: req.session.user });
    if (acc && acc.admin == true) {
        return res.render("Upload");
    } else {
        return res.status(403).send("Access Denied ❌");
    }
};

const UploadMedia = async (req, res) => {
    const acc = await Accounts.findOne({ Identity: req.session.user });
    if (!acc || !acc.admin) return res.status(403).send("Forbidden");

    const form = new formidable.IncomingForm({ multiples: false });
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).send("Form parse error");

        // Ensure files.file is an array or a single object
        const file = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!file || !file.filepath) {
            return res.status(400).send("No file uploaded or file path missing");
        }

        // Replace spaces with hyphens in the file name
        const fileName = file.originalFilename.replace(/ /g, '-');
        const db = mongoose.connection.db;
        const bucket = new GridFSBucket(db, { bucketName: "media" });

        try {
            const uploadStream = bucket.openUploadStream(fileName); // Use modified file name
            const readStream = fs.createReadStream(file.filepath);

            readStream.pipe(uploadStream)
                .on('error', err => {
                    console.error('Upload error:', err);
                    res.status(500).send("Upload error");
                })
                .on('finish', async () => {
                    const media = new Media({
                        filename: fileName,  // Store the modified file name
                        fileId: uploadStream.id,
                        uploadedBy: acc.Identity
                    });
                    await media.save();
                    return res.redirect("/render-img");
                });
        } catch (err) {
            console.error('Error during file upload:', err);
            res.status(500).send("Internal server error");
        }
    });
};

const RenderImages = async (req, res) => {
    const images = await Media.find().sort({ createdAt: -1 });
    const files = images.map(file => ({
        url: `/media/${file.fileId}`,
        filename: file.filename
    }));

    res.render("Blog", { mediaFiles: files });
};

const ServeImage = async (req, res) => {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'media' });
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(req.params.id));
    downloadStream.pipe(res);
};

// * exporting functions 
module.exports = {
    Load,
    SignInLoad,
    SignUpLoad,
    Signup,
    ActivationLoad,
    Activate,
    SignIn,
    dashboardLoad,
    EnterEmail,
    SendResetCode,
    ChangePassword,
    AskAQuestion,
    AskingQuestion,
    ShowQuestion,
    ResponseAnswer,
    ReportTheQuestion,
    saveTheQuestion,
    SavedQuestionLoad,
    RemoveFromSaved,
    AnsweredQuestion,
    Notification,
    SettingsLoad,
    GuidelineLoad,
    PrivacyPolicyLoad,
    TermsOfUse,
    CopyrightLoad,
    CookiesLoad,
    QastraCommunityLoad,
    HelpCenterLoad,
    SafetyCenterLoad,
    ResponsibleDisclosureLoad,
    ProfileLoad,
    EditProfile,
    AccountActionsLoad,
    Logout,
    deleteAccount,
    UploadPage,
    UploadMedia,
    RenderImages,
    ServeImage
}