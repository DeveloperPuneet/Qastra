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
            html: `Hi ${name},<br>Your verification code is ${id}`
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
            html: `Hi ${name},<br>Your Reset Password code is ${id}`
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
            to: config.email,
            subject: 'Qastra Report Mail',
            html: `Hi Admin, the reported QID is ${QID}`
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

        const notifications = await Notifications.find({ for: id });
        const unreadExists = notifications.some(n => n.Read === false);

        return res.render("Dashboard", { acc, ques, unreadExists });
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
        return res.render("Notifications", { notifications });
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
const mongoose = require('mongoose'); // Ensure mongoose is imported if needed

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

    const file = files.file;
    if (!file || !file.filepath) {
      return res.status(400).send("No file uploaded or file path missing");
    }

    // Replace spaces with hyphens in the file name
    const fileName = file.originalFilename.replace(/ /g, '-');
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "media" });

    // Debugging log
    console.log('File received:', file);

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