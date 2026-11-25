export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['tokens', 'icons', 'components', 'apps', 'docs', 'ci', 'repo']],
    'subject-case': [0],
  },
};
