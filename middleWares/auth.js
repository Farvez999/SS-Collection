const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const response = require('../helpers/response');

const isValidUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        console.log("sdfopopr", authorization);
        let token;
        let decodedData;
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ")[1];
            //console.log(token);
            decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("sdfdfds", decodedData);
        } else if (!authorization) {
            res.status(403).json({ error: 'Unauthorized' });
        } else if (!decodedData) {
            res.status(403).json({ error: 'Unauthorized' });
        }
        console.log(decodedData, '----------------->');
        req.body.userId = decodedData._id;
        req.body.userRole = decodedData.role;
        console.log(req.body.userId)
        req.user = decodedData._id;
        console.log(req.user)
        next();
    } catch (error) {
        console.log(error.message);
        if (error.message === "jwt expired") {
            return res.status(401).json(response({ message: "Unauthorized" }));
        }
        if (error.message === "invalid signature") {
            return res.status(401).json(response({ message: "Unauthorized" }));
        }
        return next(createError(error));
    }
};


module.exports = { isValidUser };