import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

  public static metadata: Lint.IRuleMetadata = {
    ruleName: "sinon-prefer-resolves",
    description: "Suggest using stub.resolves(...) instead of stub.returns(Promise.resolve(...))",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: [true],
    rationale: Lint.Utils.dedent`
        Sinon library provides a shorter idiom for returning resolved promises from stubs.`,
    type: "style",
    typescriptOnly: false,
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new PreferResolvesWalker(sourceFile, this.getOptions()),
    );
  }
}

// The walker takes care of all the work.
class PreferResolvesWalker extends Lint.RuleWalker {
  public visitCallExpression(node: ts.CallExpression) {
    const sinonReturnsExpression = node.expression;

    if (sinonReturnsExpression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      const returnsMethod = sinonReturnsExpression as ts.PropertyAccessExpression;
      const returnsMethodName = returnsMethod.name.text;
      if (returnsMethodName === "returns") {
        if (node.arguments.length === 1) {
          const returnsMethodArgumentOne = node.arguments[0];
          if (returnsMethodArgumentOne.kind === ts.SyntaxKind.CallExpression) {
            const argumentOneAsCallExpression = returnsMethodArgumentOne as ts.CallExpression;
            const expression = argumentOneAsCallExpression.expression;
            if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
              const promiseResolvePropertyAccess = expression as ts.PropertyAccessExpression;
              const resolveMethodName = promiseResolvePropertyAccess.name.text;
              if (promiseResolvePropertyAccess.expression.getText() === "Promise" && resolveMethodName === "resolve") {
                this.addFailureAtNode(node, `Use Stub.resolves() method instead`);
              }
            }
          }
        }
      }
    }

    super.visitCallExpression(node);
  }
}
