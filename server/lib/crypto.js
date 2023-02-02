
// Cryptography Functions

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const {
    JWT_KEY = "my_secret_key",
    JWT_EXPIRY = 20,
    JWT_REFRESH = 5
} = process.env;


// Password Hashing

export function hashPassword(password) {
    let salt = bcrypt.genSaltSync(12);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
}

export function checkPassword(password, hash) {
    if(!hash) {
        console.log(`no hash`);
        return false;
    }
    try {
        let result = bcrypt.compareSync(password, hash);
        return result;    
    } catch(e) {
        console.error(e);
        return false;
    }
}

// JWT

export function createToken(data) {

	const token = jwt.sign(data, JWT_KEY, {
		algorithm: "HS256",
		expiresIn: JWT_EXPIRY,
	});

    return token;
}

export function verifyToken(token) {

    if (!token) {
		return {error: 'No Token'}
	}

    let payload;

	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
        payload = jwt.verify(token, JWT_KEY);
        
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return {error: 'Invalid Token'}
		}
		// otherwise, return a bad request error
		return {error: 'Invalid Request'}
	}

    return payload;

}

export function refreshToken(token) {

    if (!token) {
		return {error: 'No Token'}
	}

    let payload;

	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
        payload = jwt.verify(token, JWT_KEY);
        
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return {error: 'Invalid Token'}
		}
		// otherwise, return a bad request error
		return {error: 'Invalid Request'}
	}

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
	if (payload.exp - nowUnixSeconds > JWT_REFRESH) {
		return {error: `Too Early ${Math.round(payload.exp - nowUnixSeconds)}`};
	}

    let newData = {...payload};
    delete newData.iat;
    delete newData.exp;
	// Now, create a new token for the current user, with a renewed expiration time
	const newToken = jwt.sign(newData, JWT_KEY, {
		algorithm: "HS256",
		expiresIn: JWT_EXPIRY,
	})

    return newToken;
}