const isLogin = async (req, res, next) => {
    try {
        if (req.session.user) {
        } else {
            return res.redirect('/');
        }
        next();
    } catch (error) {
        console.log("Qastra fail code: 4")
        return res.render(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user) {
            return res.redirect('/dashboard');
        }
        next();
    } catch (error) {
        console.log("Qastra fail code: 4")
        return res.render(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}