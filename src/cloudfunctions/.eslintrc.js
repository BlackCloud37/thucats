module.exports = {
  env: {
    node: true
  },
  rules: {
    '@typescript-eslint/no-require-imports': 'off'
  },
  globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // myGlobal: false
    cloud: false,
    db: false,
    _: false,
    $: false
  }
};
