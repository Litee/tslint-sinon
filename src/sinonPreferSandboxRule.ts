import * as Lint from "tslint";
import * as ts from "typescript";

export class Rule extends Lint.Rules.AbstractRule {

  public static metadata: Lint.IRuleMetadata = {
    ruleName: "sinon-prefer-sandbox",
    description: "Suggest to create Sinon fakes via sandbox",
    optionsDescription: "Not configurable.",
    options: null,
    optionExamples: [true],
    rationale: Lint.Utils.dedent`
        Sinon allows to create fakes (stubs, mocks and spies) directly or via sandbox.
        Creating fakes via sandbox simplifies the cleanup.`,
    type: "style",
    typescriptOnly: false,
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new PreferSandboxWalker(sourceFile, this.getOptions()),
    );
  }
}

// The walker takes care of all the work.
class PreferSandboxWalker extends Lint.RuleWalker {
  private functionNames = ["stub", "createStubInstance", "mock", "spy"];

  public visitCallExpression(node: ts.CallExpression) {
    const sinonReturnsExpression = node.expression;

    if (sinonReturnsExpression.kind === ts.SyntaxKind.PropertyAccessExpression) {
      const propertyAccess = sinonReturnsExpression as ts.PropertyAccessExpression;
      const calleeName = propertyAccess.expression;
      if (calleeName.getText() === "sinon") {
        const methodName = propertyAccess.name.text;
        if (this.functionNames.indexOf(methodName) > -1) {
          this.addFailureAtNode(node, `Use sandbox.${methodName}() instead!`);
        }
      }
    }

    super.visitCallExpression(node);
  }
}
