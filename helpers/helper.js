const jwt = require("jsonwebtoken");
function isAuthenticated(req, res, next) {
    try {
        // let token = req.get("authorization");
         let tokenHeader = req.headers["auth"];
        if (!tokenHeader) {
            return res.status(404).json({ success: false, msg: "Token not found" });
        }
        // token = token.split(" ")[1];
        const token = tokenHeader;
        const decoded = jwt.verify(token, "accessSecret");
        req.email = decoded.email;
        req.user_id = decoded.user_id;
        req.firstName = decoded.firstName;
        req.password = decoded.password;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: error.message });
        // console.error(error);
    }
    async function deleteUserAccount(email) {
        try {
            // Assuming you're using MongoDB and Mongoose as the ODM
            const deletedUser = await User.findOneAndDelete({ email: email });
    
            // Check if the user was found and deleted
            if (!deletedUser) {
                throw new Error("User not found");
            }
    
            // You can perform additional cleanup or logging here
    
            return { success: true, msg: "User account deleted successfully" };
        } catch (error) {
            return { success: false, msg: error.message };
        }
    }
}

function verifyRefresh(email, token) {
    try {
        const decoded = jwt.verify(token, "refreshSecret");
        return decoded.email === email;
    } catch (error) {
        // console.error(error);
        return false;
    }
}

async function deleteUserAccount(email) {
    try {
        // Assuming you're using MongoDB and Mongoose as the ODM
        const deletedUser = await User.findOneAndDelete({ email: email });

        // Check if the user was found and deleted
        if (!deletedUser) {
            throw new Error("User not found");
        }

        // You can perform additional cleanup or logging here

        return { success: true, msg: "User account deleted successfully" };
    } catch (error) {
        return { success: false, msg: error.message };
    }
}

module.exports = { isAuthenticated, verifyRefresh , deleteUserAccount};