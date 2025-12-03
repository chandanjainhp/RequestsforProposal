// Import Router from Express to create modular route handlers
import {Router}  from "express";

// Import the registerUser controller function from the user controller
// This controller handles the business logic for user registration
import { logoutUser, registerUser, login,refreshAccessToken } from "../controllers/use.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middle.js";
// Create a new router instance
// This router will handle all user-related routes
const router = Router();

// Test route to check if the server is working
// GET /test - Simple test endpoint
router.route("/test").get((req, res) => {
    res.json({ message: "User routes are working!" });
});

// Test route for user registration without files (for debugging)
// POST /register-test - Test registration without file upload
router.route("/register-test").post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }]),
    (req, res) => {
        console.log("Test route - req.body:", req.body);
        console.log("Test route - req.files:", req.files);
        res.json({ 
            message: "Test route working", 
            body: req.body, 
            files: req.files || "No files received"
        });
    }
);

// Define the registration route
// POST /register - This route will handle user registration requests
// When someone makes a POST request to /register, it will execute the registerUser function
// Full URL will be: http://localhost:8000/api/v1/users/register
// (because this router is mounted at /api/v1/users in app.js)
router.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },{
        name : "coverImage",
        maxCount:1
    }]),
    
    registerUser);

// Define the login route
// POST /login - This route handles user login requests
// No file upload needed for login, just email/username and password
router.route("/login").post(login);

// SECURED ROUTES - These routes require authentication
// POST /logout - This route handles user logout (requires valid JWT token)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

// You can add more user-related routes here, for example:
// router.route("/profile").get(verifyJWT, getUserProfile)
// router.route("/update-profile").patch(verifyJWT, updateUserProfile)

// Export the router as default so it can be imported in app.js
// This allows app.js to use this router with app.use()
export default router