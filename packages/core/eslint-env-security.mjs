const SECRET_PATTERNS = [
  /NEXT_PUBLIC_(SERVICE_ROLE|SUPABASE_SERVICE_ROLE|AI_API_KEY|AI_SECRET_KEY)/,
  /SERVICE_ROLE/i,
  /AI_(API_KEY|SECRET_KEY)/i,
];

const CLIENT_FILES = ['apps/**/*.{js,jsx,ts,tsx}', 'packages/**/*.{js,jsx,ts,tsx}'];

export const envSecurityRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow exposing secrets in public environment variables or client code.',
    },
    schema: [],
  },
  create(context) {
    function reportIfSensitive(node) {
      const source = context.sourceCode.getText(node);
      if (SECRET_PATTERNS.some((pattern) => pattern.test(source))) {
        context.report({
          node,
          message:
            'Sensitive secrets must not be exposed through NEXT_PUBLIC_* variables or included in client code.',
        });
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          reportIfSensitive(node);
        }
      },
      TemplateElement(node) {
        reportIfSensitive(node);
      },
      Program(node) {
        const filename = context.filename || '';
        const isClientFile = CLIENT_FILES.some((pattern) =>
          filename.includes(pattern.replace(/\*\*|\*|\{[^}]+\}/g, '').trim()),
        );

        if (isClientFile) {
          const source = context.sourceCode.getText();
          if (SECRET_PATTERNS.some((pattern) => pattern.test(source))) {
            context.report({
              node,
              message:
                'Sensitive secrets must not be exposed through NEXT_PUBLIC_* variables or included in client code.',
            });
          }
        }
      },
    };
  },
};

export default {
  rules: {
    'env-security': envSecurityRule,
  },
};
