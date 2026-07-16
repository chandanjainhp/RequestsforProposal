import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image, url }) => {
    const defaultTitle = "BidSense - Intelligent RFP Management";
    const defaultDescription = "AI-powered RFP creation, proposal comparison, and intelligent vendor scoring for modern procurement teams.";
    const defaultKeywords = "RFP, procurement, AI, vendor management, proposal scoring, BidSense";
    const siteUrl = "https://bidsense.ai"; // Placeholder URL
    const defaultImage = "/og-image.png"; // Placeholder image

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{title ? `${title} | BidSense` : defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || siteUrl} />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            <meta property="og:image" content={image || defaultImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url || siteUrl} />
            <meta name="twitter:title" content={title || defaultTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Helmet>
    );
};

export default SEO;
