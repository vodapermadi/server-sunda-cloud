import { customResponse, decodeJwt } from "./helper.js"

const middlewareAuth = (req, res, next) => {
    const token = req.headers['sc-bearer-token'];
    
    if (!token) {
        return res.status(401).json(customResponse("Token not found", 401));
    }

    try {
        const translate = decodeJwt(token);

        if (!translate || !translate.id) {
            return res.status(401).json(customResponse("Invalid token", 401));
        }

        req.user = translate;

        next();
    } catch (error) {
        console.error("JWT Decode Error:", error.message);
        return res.status(500).json(customResponse("Internal server error", 500));
    }
};

export {
    middlewareAuth
}
