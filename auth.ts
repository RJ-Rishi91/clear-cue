import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { MongoUser, getIsMongoConnected } from './mongo';

export const JWT_SECRET = process.env.JWT_SECRET || 'clearcue_secure_auth_secret_jwt_2026';

export interface AuthenticatedUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
  agency: string;
  avatar: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

// Generate JWT token
export function generateToken(user: { id: string; username: string }): string {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Express middleware to verify token (optional or required)
export function authMiddleware(required: boolean = true) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (required) {
        res.status(401).json({ error: 'Authentication required. Please log in.' });
        return;
      }
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
      
      let user: AuthenticatedUser | null = null;
      if (getIsMongoConnected()) {
        const doc = await MongoUser.findById(decoded.id) || await MongoUser.findOne({ username: decoded.username });
        if (doc) {
          user = {
            id: doc._id.toString(),
            username: doc.username,
            name: doc.name,
            email: doc.email,
            role: doc.role,
            agency: doc.agency,
            avatar: doc.avatar,
          };
        }
      } else {
        const row = db.prepare('SELECT id, username, name, email, role, agency, avatar FROM users WHERE id = ? OR username = ?').get(decoded.id, decoded.username) as any;
        if (row) {
          user = row;
        }
      }

      if (!user) {
        if (required) {
          res.status(401).json({ error: 'User no longer exists.' });
          return;
        }
        return next();
      }

      req.user = user;
      next();
    } catch (err) {
      if (required) {
        res.status(401).json({ error: 'Invalid or expired session token. Please log in again.' });
        return;
      }
      next();
    }
  };
}

// Ensure password_hash column exists in SQLite table
export function ensurePasswordColumnInSQLite() {
  try {
    const columns = db.prepare("PRAGMA table_info(users)").all() as any[];
    const hasPassword = columns.some((c) => c.name === 'password_hash');
    if (!hasPassword) {
      db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
      // Set default demo password 'clearcue123' for seeded user
      const defaultHash = bcrypt.hashSync('clearcue123', 10);
      db.prepare("UPDATE users SET password_hash = ? WHERE password_hash IS NULL").run(defaultHash);
    }
  } catch (err: any) {
    console.warn('SQLite password column check note:', err.message);
  }
}
