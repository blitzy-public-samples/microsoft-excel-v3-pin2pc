import BigNumber from 'bignumber.js';

// Assuming CellValue is a type that can be a number or a string representation of a number
type CellValue = number | string;

/**
 * Adds two or more numbers with high precision.
 * @param values An array of CellValue to be added.
 * @returns The sum of the input values as a number.
 */
export function add(values: CellValue[]): number {
    return values.reduce((sum, value) => {
        const bigNumValue = new BigNumber(value);
        return sum.plus(bigNumValue);
    }, new BigNumber(0)).toNumber();
}

/**
 * Subtracts two or more numbers with high precision.
 * @param values An array of CellValue to be subtracted.
 * @returns The result of the subtraction as a number.
 */
export function subtract(values: CellValue[]): number {
    if (values.length === 0) return 0;
    const [first, ...rest] = values;
    return rest.reduce((diff, value) => {
        const bigNumValue = new BigNumber(value);
        return diff.minus(bigNumValue);
    }, new BigNumber(first)).toNumber();
}

/**
 * Multiplies two or more numbers with high precision.
 * @param values An array of CellValue to be multiplied.
 * @returns The product of the input values as a number.
 */
export function multiply(values: CellValue[]): number {
    return values.reduce((product, value) => {
        const bigNumValue = new BigNumber(value);
        return product.times(bigNumValue);
    }, new BigNumber(1)).toNumber();
}

/**
 * Divides two numbers with high precision.
 * @param dividend The number to be divided.
 * @param divisor The number to divide by.
 * @returns The result of the division as a number.
 * @throws Error if the divisor is zero.
 */
export function divide(dividend: CellValue, divisor: CellValue): number {
    const bigNumDividend = new BigNumber(dividend);
    const bigNumDivisor = new BigNumber(divisor);

    if (bigNumDivisor.isZero()) {
        throw new Error('Division by zero is not allowed');
    }

    return bigNumDividend.dividedBy(bigNumDivisor).toNumber();
}

/**
 * Raises a number to the power of another with high precision.
 * @param base The base number.
 * @param exponent The exponent.
 * @returns The result of the exponentiation as a number.
 */
export function power(base: CellValue, exponent: CellValue): number {
    const bigNumBase = new BigNumber(base);
    const bigNumExponent = new BigNumber(exponent);
    return bigNumBase.pow(bigNumExponent).toNumber();
}

/**
 * Rounds a number to a specified number of decimal places.
 * @param value The number to be rounded.
 * @param decimalPlaces The number of decimal places to round to.
 * @returns The rounded number.
 */
export function round(value: CellValue, decimalPlaces: number): number {
    const bigNumValue = new BigNumber(value);
    return bigNumValue.decimalPlaces(decimalPlaces).toNumber();
}

/**
 * Calculates the sum of an array of numbers.
 * @param values An array of CellValue to be summed.
 * @returns The sum of all input values as a number.
 */
export function sum(values: CellValue[]): number {
    return add(values);
}

/**
 * Calculates the average of an array of numbers.
 * @param values An array of CellValue to be averaged.
 * @returns The average of all input values as a number.
 */
export function average(values: CellValue[]): number {
    if (values.length === 0) return 0;
    const total = sum(values);
    return divide(total, values.length);
}

// Human tasks (commented):
/**
 * TODO: Human tasks
 * 1. Review and validate the mathematical operations to ensure they meet all requirements for precision and performance in the Excel-like application (Required)
 * 2. Consider adding more advanced mathematical functions like logarithms, trigonometric functions, etc. (Optional)
 * 3. Implement error handling for edge cases (e.g., division by zero, overflow) (Required)
 */