module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "obsolete i18n namespace specification on `useTranslation` hook",
    },
    schema: [],
    fixable: "code",
    messages: {
      "no-specification": "obsolete i18n namespace specification",
    },
  },

  create(context) {
    return {
      CallExpression(node) {
        if (
          node.type === "CallExpression" &&
          node.callee.name === "useTranslation"
        ) {
          if (Array.isArray(node.arguments) && node.arguments.length) {
            context.report({
              node,
              messageId: "no-specification",
              fix: (fixer) => {
                return fixer.replaceText(node, `useTranslation()`);
              },
            });
          }
        }
      },
    };
  },
};
