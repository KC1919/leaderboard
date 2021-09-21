const jwt = require("jsonwebtoken");

async function verify(req, res, next) {
    try {
        const token = await req.cookies['secret'];
        const result = jwt.verify(token, process.env.JWT_KEY);
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Unauthorized user",
            error: error
        });
    }
}

module.exports = verify;