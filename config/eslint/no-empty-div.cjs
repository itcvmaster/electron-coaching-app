module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "return `null` over empty div",
    },
    schema: [],
    fixable: "code",
    messages: {
      "no-empty-div": "return `null` over empty div",
    },
  },

  create(context) {
    return {
      ReturnStatement(node) {
        if (node.argument && node.argument.type === "JSXFragment") {
          if (
            Array.isArray(node.argument.children) &&
            !node.argument.children.length
          ) {
            context.report({
              node,
              messageId: "no-empty-div",
              fix: (fixer) => {
                return fixer.replaceText(node, `return null;`);
              },
            });
          }
        }
      },
    };
  },
};
