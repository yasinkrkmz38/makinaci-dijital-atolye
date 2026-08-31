const js=require('@eslint/js');
const tsParser=require('@typescript-eslint/parser');
const tsPlugin=require('@typescript-eslint/eslint-plugin');
const hooks=require('eslint-plugin-react-hooks');

module.exports=[
  {ignores:['node_modules/**','.expo/**','android/**','coverage/**','dist/**','dist-android/**']},
  js.configs.recommended,
  {files:['eslint.config.js'],languageOptions:{globals:{require:'readonly',module:'readonly'}}},
  {
    files:['**/*.ts','**/*.tsx'],
    languageOptions:{parser:tsParser,parserOptions:{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}},globals:{__DEV__:'readonly',fetch:'readonly',FormData:'readonly',AbortController:'readonly',setTimeout:'readonly',clearTimeout:'readonly'}},
    plugins:{'@typescript-eslint':tsPlugin,'react-hooks':hooks},
    rules:{...tsPlugin.configs.recommended.rules,...hooks.configs.recommended.rules,'@typescript-eslint/no-explicit-any':'off','no-undef':'off','react-hooks/set-state-in-effect':'off','react-hooks/preserve-manual-memoization':'off','react-hooks/incompatible-library':'off'}
  }
];
