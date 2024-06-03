import jwt, { decode } from "jsonwebtoken";
   
export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    //httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    // secure: process.env.NODE_ENV !== "development",
  });
  return token
};



export const refreshToken = (req, res) => {
  // Check if the token is present in the request headers, cookies, or any other mechanism
  const token = req.cookies.jwt;
    console.log(req)

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    // Verify the token and extract user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode Token". decodedToken, process.env.JWT_SECRET)
    const userId = decodedToken.userId;

    // Check if the token has expired
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    // if (decodedToken.exp < currentTimeInSeconds) {
    //   console.log("expired")
    //   return res.status(401).json({ message: 'Token has expired' });
    // }

    // Calculate the current time and time remaining until expiry in milliseconds
    const currentTime = Date.now();
    const timeRemaining = decodedToken.exp * 1000 - currentTime;
    console.log(timeRemaining)
    // Check if there are less than 2 hours (in milliseconds) left until expiry
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
    if (timeRemaining < twoHoursInMilliseconds) {
      console.log("true")
      // Generate a new token and update the existing token in the cookie
      const newToken = generateTokenAndSetCookie(userId, res);
      console.log("new Token", newToken)

      return res.status(200).json({ message: 'Token refreshed successfully' });
    }else{
      
    }
console.log(decodedToken, currentTimeInSeconds ,"time")
 
   return res.status(200).json({ message: 'Token still valid' });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

