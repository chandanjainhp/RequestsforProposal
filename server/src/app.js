import express from "express";

// Import CORS (Cross-Origin Resource Sharing) middleware
// CORS allows your API to be accessed from different domains/origins
// Without CORS, browsers block requests from different domains for security
import cors from "cors"

// Import cookie-parser middleware 
// This middleware parses cookies from incoming requests and makes them available in req.cookies
// Useful for handling authentication tokens, user preferences, etc.
import cookieParser from "cookie-parser";

// Create an Express application instance
// This 'app' object represents your web server and will handle all HTTP requests
const app = express()

// Configure and apply CORS middleware to all routes
app.use(cors({
    // Allow requests from frontend dev server and any localhost
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    
    // Allow cookies and authorization headers to be sent with cross-origin requests
    // This is essential for authentication systems that use cookies or JWT tokens
    // Without this, the browser won't send cookies with requests from other domains
    credentials: true
}))



// Built-in Express middleware to parse JSON data from request bodies
// This allows your server to understand JSON data sent in POST/PUT requests
app.use(express.json({
    // limit: "16kb" - Sets maximum size of JSON payload to 16 kilobytes
    // This prevents clients from sending extremely large JSON data that could:
    // 1. Crash your server due to memory overload
    // 2. Slow down your application
    // 3. Be used in denial-of-service attacks
    // Example: When client sends {"name": "John", "age": 25}, it becomes available as req.body
    limit: "16kb"
}))

// Built-in Express middleware to parse URL-encoded data from HTML forms
// This handles data sent from HTML forms with method="POST"
app.use(express.urlencoded({
    // extended: true - Allows parsing of rich objects and arrays in URL-encoded data
    // With extended: true, you can send nested objects like: user[name]=John&user[age]=25
    // With extended: false, you can only send simple key-value pairs: name=John&age=25
    extended: true,
    
    // limit: "16kb" - Same as above, limits the size of form data to 16KB
    // Protects against large file uploads or malicious oversized form submissions
    limit: "16kb"
}))
app.use(express.static("public"))

// Apply cookie-parser middleware to all routes
// This middleware automatically parses Cookie headers and populates req.cookies object
// Apply cookie-parser middleware to all routes
// This middleware automatically parses Cookie headers and populates req.cookies object
// Example: If client sends "Cookie: token=abc123", you can access it via req.cookies.token
app.use(cookieParser())

// ROUTES CONFIGURATION:

// Import the user router that contains all user-related routes
// This router will handle all requests that start with /api/v1/users
import userRouter from './routes/user.router.js'

// REMOVED: Direct controller import - not needed since it's handled in the router
// import { registerUser } from "./controllers/use.controller.js";

// Root route - handles requests to http://localhost:8000/
app.get('/', (req, res) => {
    res.status(200).json({
        message: "🚀 API is running successfully!",
        endpoints: {
            register: "/api/v1/users/register"
        }
    });
});

// Mount the user router at the /api/v1/users path
// This means all routes defined in userRouter will be prefixed with /api/v1/users
// For example, if userRouter has a route "/register", the full path becomes "/api/v1/users/register"
app.use("/api/v1/users", userRouter)

// REMOVED: These lines had syntax errors and wrong logic
// app.use("/users, userRouter")  // Missing quote and wrong approach
// router.route("/register").post(registerUser)  // 'router' not defined here

// URL STRUCTURE:
// http://localhost:8000/ - Root route
// http://localhost:8000/api/v1/users/register - User registration

// Export the configured Express app so it can be imported in other files (like index.js)
export { app }
