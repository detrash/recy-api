import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import { sign } from 'jsonwebtoken';

export const jwtDevelopment = async () => {
  const clipboardy = (await import('clipboardy')).default;

  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    console.error(chalk.red('JWT_SECRET is not set in the environment variables!'));
    return;
  }

  const user = {
    sub: 'google-oauth2|1234567890',
    iss: 'https://recy-staging.us.auth0.com/',
    aud: ['recy-staging-api', 'https://recy-staging.us.auth0.com/userinfo'],
    iat: Math.floor(Date.now() / 1000),
    scope: 'openid profile email',
    azp: 'mock-dev-azp-id',
    permissions: [] as string[],
  };

  const instructions = chalk.blueBright('\n\nspace: select | a: select all | i: invert selection | enter: confirm');

  const modules = await checkbox({
    message: chalk.green('Select the modules you want to grant access to'),
    instructions,
    pageSize: 18,
    required: true,
    choices: [
      { name: 'Delete Audits', value: 'delete:audits' },
      { name: 'Delete Reports', value: 'delete:reports' },
      { name: 'Delete Uploads', value: 'delete:upload' },
      { name: 'Delete Users', value: 'delete:users' },
      { name: 'Read Audits', value: 'read:audits' },
      { name: 'Read Reports', value: 'read:reports' },
      { name: 'Read Users', value: 'read:users' },
      { name: 'Update Audits', value: 'update:audits' },
      { name: 'Update Reports', value: 'update:reports' },
      { name: 'Update Uploads', value: 'update:upload' },
      { name: 'Update Users', value: 'update:users' },
      { name: 'Write Audits', value: 'write:audits' },
      { name: 'Write Reports', value: 'write:reports' },
      { name: 'Write Uploads', value: 'write:upload' },
      { name: 'Write Users', value: 'write:users' },
    ],
  });

  user.permissions = modules;

  const token = sign(user, JWT_SECRET!, { expiresIn: '100d' });

  clipboardy.writeSync(token);
  console.log(chalk.green('\n\nJWT token generated for dev user:'));
  console.log(chalk.green(token));
};
