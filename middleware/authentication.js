import jwt from 'jsonwebtoken';
const secretKey = 'captaincy'; // Replace this with your secret key

function authMiddleware(req, res, next) {
    const accessToken = req.header('Accesstoken');

    // Check if token exists in the request header
    if (!accessToken) {
        return res.status(200).json({ statusCode: 401, message: 'Access token not found' });
    }

    try {
        // Verify the access token
        const decodedToken = jwt.verify(accessToken, secretKey);

        // Pass the decoded data to the next function
        req.userData = decodedToken;
        next();
    } catch (err) {
        // If verification fails, return an error
        return res.status(200).json({ statusCode: 401, message: 'Invalid access token' });
    }
}

export default authMiddleware;
