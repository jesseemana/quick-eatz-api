import { auth } from 'express-oauth2-jwt-bearer';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user.service';

declare global {
  namespace Express {
    interface Request {
      user: {};
      userId: string;
      auth0Id: string;
    }
  }
}

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256',
});

const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  const token = authorization.split(' ')[1].trim();

  try {
    const decoded = jwt.decode(token) as JwtPayload;
    const auth0Id = decoded.sub as string;

    const user = await UserService.findUser({ auth0Id });
    if (!user) return res.status(401).json({ msg: 'User not found' });

    req.user = user.toObject();
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }
};

export { jwtCheck, jwtParse, }
