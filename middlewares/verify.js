const jwt = require("jsonwebtoken");

async function verify(req, res, next) {
    try {
        const token = await req.cookies['secret'];
        // console.log("Verifying:",token);
        const result = jwt.verify(token, process.env.JWT_KEY);
        if(result){
            req.userId=result.userId;
            next();
        }
    } catch (error) {
        // console.log(error);
        // return res.status(401).json({
        //     message: "Unauthorized user",
        //     error: error
        // });
        res.redirect("/");
    }
}

module.exports = verify;