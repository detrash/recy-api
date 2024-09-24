module.exports = {
  project: ['src/**/*.ts', 'src/**/*.tsx'],
  ignore: ['lefthook.yml'],
  ignoreDependencies: ['ts-node', '@types/express', '@types/multer'],
  typescript: {
    config: ['tsconfig.json'],
  },
};
