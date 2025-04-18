// * importing modules
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require("mongoose");
const path = require('path');

// * importing files
const config = require("../config/config");
const controller = require("../controllers/controller");
const auth = require("../middlewares/auth");

// * variables
const router = express();

// * MongoDB session store
const store = new MongoDBStore({
    uri: config.db,
    collection: 'sessions'
});

// * handle session store errors
store.on('error', function (error) {
    console.log('Session Store Error:', error);
});

// * session expiration (30 days)
const sessionExpiration = 1000 * 60 * 60 * 24 * 30;

// * settings
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, '../public')));
router.set('view engine', 'pug');
router.set('views', path.join(__dirname, '../views'));

router.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: sessionExpiration },
    rolling: true
}));

// * add 'expiresAt' to new sessions
store.on('create', function (sessionId, sessionData) {
    const expiresAt = new Date(Date.now() + sessionExpiration);
    mongoose.connection.collection('sessions').updateOne(
        { _id: sessionId },
        { $set: { expiresAt: expiresAt } }
    );
});

// * ensure TTL index
store.on('connected', () => {
    mongoose.connection.collection('sessions').createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
    );
});

// * handling response
router.get("/", auth.isLogout, controller.Load);
router.get("/signin", auth.isLogout, controller.SignInLoad);
router.get("/signup", auth.isLogout, controller.SignUpLoad);
router.get("/activation", auth.isLogout, controller.ActivationLoad);
router.get("/dashboard", auth.isLogin, controller.dashboardLoad);
router.get("/enter-email", controller.EnterEmail);
router.get("/ask-a-question", auth.isLogin, controller.AskAQuestion);
router.get("/question/:QID", controller.ShowQuestion);
router.get("/report/:QID", controller.ReportTheQuestion);
router.get("/save/:QID", controller.saveTheQuestion);
router.get("/saved-questions", auth.isLogin, controller.SavedQuestionLoad);
router.get("/remove/:QID", auth.isLogin, controller.RemoveFromSaved);
router.get("/answered-question", auth.isLogin, controller.AnsweredQuestion);
router.get("/notification", auth.isLogin, controller.Notification);
router.get("/settings", auth.isLogin, controller.SettingsLoad);
router.get("/guidelines", controller.GuidelineLoad);
router.get("/privacy-policy", controller.PrivacyPolicyLoad);
router.get("/terms-of-use", controller.TermsOfUse);
router.get("/copyright", controller.CopyrightLoad);
router.get("/cookies", controller.CookiesLoad);
router.get("/qastra-community", controller.QastraCommunityLoad);
router.get("/help-center", controller.HelpCenterLoad);
router.get("/safety-center", controller.SafetyCenterLoad);
router.get("/responsible-disclosure-agreement", controller.ResponsibleDisclosureLoad);
router.get("/profile", auth.isLogin, controller.ProfileLoad);
router.get("/account-actions", auth.isLogin, controller.AccountActionsLoad);
router.get("/logout", auth.isLogin, controller.Logout);
router.get("/delete-account", auth.isLogin, controller.deleteAccount);

// * handling requests 
router.post("/signup", controller.Signup);
router.post("/activation", controller.Activate);
router.post("/signin", controller.SignIn);
router.post("/enter-email", controller.SendResetCode);
router.post("/new-password", controller.ChangePassword);
router.post("/ask-a-question", controller.AskingQuestion);
router.post("/answer/:QID", controller.ResponseAnswer);
router.post("/edit-profile", controller.EditProfile);

// * exporting routes
module.exports = router;
