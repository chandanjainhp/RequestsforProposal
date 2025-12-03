// IMPORTS SECTION
// ================

// Import Mongoose ODM (Object Document Mapper) for MongoDB
// Schema is imported separately for creating database schemas
import mongoose, {Schema} from "mongoose";

// Import mongoose-aggregate-paginate-v2 plugin for pagination in aggregation queries
// This plugin adds pagination capabilities to MongoDB aggregation pipelines
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


// VIDEO SCHEMA DEFINITION
// =======================

// Create a new Mongoose schema for Video collection
// Fixed typo: videoScheam → videoSchema
const videoSchema = new Schema({
    
    // VIDEO FILE FIELD
    // ================
    videoFile: { 
        type: String,                    // Data type: String
        // This will store the Cloudinary URL for the actual video file
        required: true,                  // Field is mandatory - every video must have a file
    },
    
    // THUMBNAIL FIELD
    // ===============
    thumbnail: {
        type: String,                   
        // This will store the Cloudinary URL for the video thumbnail/preview image
        required: true,                  // Field is mandatory - every video needs a thumbnail
    },
    
    // TITLE FIELD
    // ===========
    title: {
        type: String,                    // Data type: String
        required: true                   // Field is mandatory - every video needs a title
    },
    
    // DESCRIPTION FIELD
    // =================
    description: {
        type: String,                    // Data type: String
        required: true                   // Field is mandatory - every video needs a description
    },
    
    // DURATION FIELD
    // ==============
    duration: {
        type: Number,                    // Data type: Number
        required: true                   // Field is mandatory - duration in seconds
        // This will store video duration in seconds (e.g., 120 for 2 minutes)
    },
    
    // VIEWS FIELD
    // ===========
    views: {
        type: Number,                    // Data type: Number
        default: 0                       // Default value is 0 when video is first uploaded
        // This will track how many times the video has been viewed
    },
    
    // PUBLISHED STATUS FIELD
    // ======================
    isPublished: {
        type: Boolean,                   // Data type: Boolean
        default: true                    // Default value is true - videos are published by default
        // This allows for draft videos (false) vs published videos (true)
    },
    
    // OWNER FIELD
    // ===========
    owner: {
        type: Schema.Types.ObjectId,     // Reference to another document's ObjectId
        ref: "User",                     // Fixed: ref:user → ref: "User" (quotes needed)
        // This creates a relationship between Video and User collections
        // Each video belongs to one user (the uploader)
    }
    
}, {
    // SCHEMA OPTIONS
    // ==============
    timestamps: true                     // Automatically adds createdAt and updatedAt fields
    // createdAt: when the video was first uploaded
    // updatedAt: when the video document was last modified
});

// PLUGIN REGISTRATION
// ===================

// Add the mongoose-aggregate-paginate-v2 plugin to the schema
// This enables pagination functionality for aggregation queries
videoSchema.plugin(mongooseAggregatePaginate);



// MODEL EXPORT
// ============

// Create and export the Video model based on videoSchema
export const Video = mongoose.model("Video", videoSchema); 