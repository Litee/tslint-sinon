import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {
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
              const promise = promiseResolvePropertyAccess.expression as ts.Identifier;
              const resolveMethodName = promiseResolvePropertyAccess.name.text;
              if (promise.text === "Promise" && resolveMethodName === "resolve") {
                this.addFailureAtNode(node, `Use Stub.resolves() instead!`);
              }
            }
          }
        }
      }
    }

    super.visitCallExpression(node);
  }
}
