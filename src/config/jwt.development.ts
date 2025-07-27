import chalk from 'chalk';
import { sign } from 'jsonwebtoken';

export const jwtDevFast = async () => {
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    console.error(chalk.red('JWT_SECRET is not set in the environment variables!'));
    process.exit(1);
  }

  const user = {
    sub: 'google-oauth2|devuser',
    iss: 'https://recy-staging.us.auth0.com/',
    aud: ['recy-staging-api', 'https://recy-staging.us.auth0.com/userinfo'],
    iat: Math.floor(Date.now() / 1000),
    scope: 'openid profile email',
    azp: 'mock-dev-azp-id',
    permissions: [
      'delete:audits',
      'delete:reports',
      'delete:upload',
      'delete:users',
      'read:audits',
      'read:reports',
      'read:users',
      'update:audits',
      'update:reports',
      'update:upload',
      'update:users',
      'write:audits',
      'write:reports',
      'write:upload',
      'write:users',
    ],
  };

  const token = sign(user, JWT_SECRET, { expiresIn: '100d' });
  console.log(chalk.green('\nJWT token for dev user:\n'));
  console.log(token);
};
