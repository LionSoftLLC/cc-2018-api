//Dependencies
import Promise from 'bluebird';
import fs from 'fs-extra';

import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Instantiated
const DEFAULT_SALT_ROUNDS = 10;

const ARGON2_CONFIG = {
	timeCost: 3,
	memoryCost: 4096,
	parallelism: 1,
	type: argon2.argon2id,
};

const JWT_CONFIG = {
	algorithm: `HS256`,
	expiresIn: `2h`,
};

const Security = class Security {
	constructor() {
		throw new Error(`Security class is static and cannot be instantiated.`);
	}

	////////////////////
	// PUBLIC METHODS //
	////////////////////

	static CreateCredentials(password, saltRounds = DEFAULT_SALT_ROUNDS) {
		const credentials = {};

		return Security.GenerateSalt(saltRounds)
			.then((salt) => {
				credentials.salt = salt;
				return Security.HashPassword(password, salt);
			})
			.then((hash) => {
				credentials.hash = hash;
				return Promise.resolve(credentials);
			});
	}

	static GenerateSalt(saltRounds = DEFAULT_SALT_ROUNDS) {
		return bcrypt.genSalt(saltRounds);
	}

	static HashPassword(password, salt) {
		const salted = salt + password;

		return argon2.hash(salted, ARGON2_CONFIG);
	}

	static VerifyPassword(password, credentials) {
		const salted = credentials.salt + password;

		return argon2.verify(credentials.hash, salted);
	}

	static GenerateToken(user) {
		const tokenPayload = {
			user: user.email
		};

		return Security._getKey()
			.then((key) => {
				return new Promise((resolve, reject) => {
					jwt.sign(tokenPayload, key, JWT_CONFIG, (err, token) => {
						if (err) {
							reject(err);
						} else {
							resolve(token);
						}
					});
				});
			});
	}

	static ReadToken(token) {
		return Security._getKey()
			.then((key) => {
				return new Promise((resolve, reject) => {
					jwt.verify(token, key, (err, decoded) => {
						if (err) {
							reject(err);
						} else {
							resolve(decoded);
						}
					});
				});
			}); 
	}

	////////////////////
	// PRIVATE METHODS//
	////////////////////

	static _getKey() {
		// preserve context
		const _this = this;

		return fs.readFile(process.env.KEY_FILE)
			.then((readData) => {
				return Promise.resolve(readData.toString());
			});
	}
};

export { Security };
export default Security;
