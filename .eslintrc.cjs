module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/NEXT_PUBLIC_(SERVICE_ROLE|SUPABASE_SERVICE_ROLE|AI_API_KEY|AI_SECRET_KEY)/i]",
        message: 'Do not expose secrets through NEXT_PUBLIC_* variables.',
      },
      {
        selector: "TemplateElement[value.raw=/NEXT_PUBLIC_(SERVICE_ROLE|SUPABASE_SERVICE_ROLE|AI_API_KEY|AI_SECRET_KEY)/i]",
        message: 'Do not expose secrets through NEXT_PUBLIC_* variables.',
      },
    ],
  },
};
