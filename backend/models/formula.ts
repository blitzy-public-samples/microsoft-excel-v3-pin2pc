import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Formula document
export interface IFormula extends Document {
  id: string;
  expression: string;
  result: any;
  dependencies: string[];
  createdDate: Date;
  modifiedDate: Date;
  setExpression(expression: string): void;
  evaluate(cellValues: Record<string, any>): any;
  getDependencies(): string[];
  isCircular(currentCell: string, visitedCells: Set<string>): boolean;
}

// Interface for the Formula data (used in constructor)
interface FormulaData {
  id?: string;
  expression: string;
  result?: any;
  dependencies?: string[];
  createdDate?: Date;
  modifiedDate?: Date;
}

// Schema definition for the Formula model
const FormulaSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  expression: { type: String, required: true },
  result: { type: Schema.Types.Mixed },
  dependencies: { type: [String], default: [] },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now }
});

// Method to set the expression and update dependencies
FormulaSchema.methods.setExpression = function(this: IFormula, expression: string): void {
  this.expression = expression;
  this.dependencies = extractDependencies(expression);
  this.result = undefined;
  this.modifiedDate = new Date();
};

// Method to evaluate the formula
FormulaSchema.methods.evaluate = function(this: IFormula, cellValues: Record<string, any>): any {
  // Check if all dependencies are available
  for (const dep of this.dependencies) {
    if (!(dep in cellValues)) {
      throw new Error(`Missing dependency: ${dep}`);
    }
  }

  // TODO: Implement a comprehensive formula parser and evaluator
  // This is a placeholder implementation
  const result = eval(this.expression.replace(/[A-Z]+[0-9]+/g, (match) => cellValues[match]));
  this.result = result;
  return result;
};

// Method to get dependencies
FormulaSchema.methods.getDependencies = function(this: IFormula): string[] {
  return this.dependencies;
};

// Method to check for circular references
FormulaSchema.methods.isCircular = function(this: IFormula, currentCell: string, visitedCells: Set<string>): boolean {
  if (this.dependencies.includes(currentCell)) {
    return true;
  }

  visitedCells.add(currentCell);

  for (const dep of this.dependencies) {
    if (visitedCells.has(dep)) {
      continue;
    }
    // TODO: Implement recursive check for circular references
    // This requires access to other formulas, which is not available in this context
    // Consider moving this logic to a service layer
  }

  return false;
};

// Helper function to extract dependencies from an expression
function extractDependencies(expression: string): string[] {
  const cellPattern = /[A-Z]+[0-9]+/g;
  return Array.from(new Set(expression.match(cellPattern) || []));
}

// Create and export the Formula model
export const Formula = mongoose.model<IFormula>('Formula', FormulaSchema);

// Human tasks (commented as requested)
/*
Human tasks:
1. Implement a comprehensive formula parser (Critical)
2. Add support for all Excel functions (Required)
3. Implement error handling for formula evaluation (Critical)
4. Optimize formula evaluation for large datasets (Required)
5. Implement caching mechanism for formula results (Optional)
*/