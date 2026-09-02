// ===== Calculator state =====

// Get the calculator display element.
const display = document.getElementById("display");

// Store the complete mathematical expression as the user types it.
let expression = "";


// ===== Display =====

// Show the current expression or answer on the calculator display.
function updateDisplay(value) {
  display.textContent = value === "" ? "0" : value;
}


// ===== Number input =====

// Add a number to the end of the expression.
function inputNumber(number) {
  expression += number;
  updateDisplay(expression);
}


// ===== Operator input =====

// Add an operator to the expression.
// Consecutive operators are replaced so the expression stays valid.
function inputOperator(nextOperator) {
  // Convert the multiplication symbol used by the UI to JavaScript-style "*".
  const operator = nextOperator;

  // If the expression is empty, do not allow an operator as the first character.
  if (expression === "") {
    return;
  }

  // Replace the previous operator if the user presses operators consecutively.
  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operator;
  } else {
    expression += operator;
  }

  // Show the complete expression before calculating.
  updateDisplay(expression);
}


// ===== Expression calculation =====

// Calculate a complete mathematical expression.
// This supports multiple operations and normal mathematical precedence.
function calculateExpression(input) {
  // Remove spaces from the expression.
  const cleanExpression = input.replace(/\s+/g, "");

  // Only allow numbers, decimal points and mathematical operators.
  if (!/^[0-9.+\-*/()]+$/.test(cleanExpression)) {
    return "Error";
  }

  try {
    // Tokenize the expression into numbers, operators and parentheses.
    const tokens = tokenize(cleanExpression);

    // Convert the expression to Reverse Polish Notation.
    const postfix = toPostfix(tokens);

    // Calculate the postfix expression.
    const result = evaluatePostfix(postfix);

    // Make sure the result is a real number.
    if (!Number.isFinite(result)) {
      return "Error";
    }

    // Remove unnecessary decimal zeros.
    return Number.isInteger(result) ? String(result) : String(Number(result.toFixed(10)));
  } catch (error) {
    // Return Error for invalid mathematical expressions.
    return "Error";
  }
}


// ===== Tokenizer =====

// Split an expression into numbers, operators and parentheses.
function tokenize(input) {
  const tokens = [];
  let number = "";

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Build a number, including decimal values.
    if (/[0-9.]/.test(char)) {
      number += char;
      continue;
    }

    // Add the completed number before adding an operator.
    if (number !== "") {
      if ((number.match(/\./g) || []).length > 1) {
        throw new Error("Invalid number");
      }

      tokens.push(Number(number));
      number = "";
    }

    // Add supported operators and parentheses.
    if (/[+\-*/()]/.test(char)) {
      tokens.push(char);
    } else {
      throw new Error("Invalid character");
    }
  }

  // Add the final number.
  if (number !== "") {
    if ((number.match(/\./g) || []).length > 1) {
      throw new Error("Invalid number");
    }

    tokens.push(Number(number));
  }

  return tokens;
}


// ===== Operator precedence =====

// Define the mathematical priority of each operator.
function precedence(operator) {
  if (operator === "+" || operator === "-") {
    return 1;
  }

  if (operator === "*" || operator === "/") {
    return 2;
  }

  return 0;
}


// ===== Infix to postfix conversion =====

// Convert the normal expression into a form that can be calculated safely.
function toPostfix(tokens) {
  const output = [];
  const operators = [];

  tokens.forEach((token) => {
    // Numbers go directly to the output.
    if (typeof token === "number") {
      output.push(token);
      return;
    }

    // Opening parentheses are placed on the operator stack.
    if (token === "(") {
      operators.push(token);
      return;
    }

    // Closing parentheses cause operators to be removed until "(".
    if (token === ")") {
      while (operators.length && operators[operators.length - 1] !== "(") {
        output.push(operators.pop());
      }

      if (operators.pop() !== "(") {
        throw new Error("Mismatched parentheses");
      }

      return;
    }

    // Move higher/equal precedence operators to the output.
    while (
      operators.length &&
      operators[operators.length - 1] !== "(" &&
      precedence(operators[operators.length - 1]) >= precedence(token)
    ) {
      output.push(operators.pop());
    }

    // Put the current operator on the stack.
    operators.push(token);
  });

  // Move remaining operators to the output.
  while (operators.length) {
    const operator = operators.pop();

    if (operator === "(" || operator === ")") {
      throw new Error("Mismatched parentheses");
    }

    output.push(operator);
  }

  return output;
}


// ===== Postfix evaluation =====

// Calculate the postfix expression.
function evaluatePostfix(tokens) {
  const values = [];

  tokens.forEach((token) => {
    // Store numbers on the value stack.
    if (typeof token === "number") {
      values.push(token);
      return;
    }

    // Two values are required for a binary operation.
    if (values.length < 2) {
      throw new Error("Invalid expression");
    }

    const b = values.pop();
    const a = values.pop();

    // Perform the selected operation.
    switch (token) {
      case "+":
        values.push(a + b);
        break;

      case "-":
        values.push(a - b);
        break;

      case "*":
        values.push(a * b);
        break;

      case "/":
        // Prevent division by zero.
        if (b === 0) {
          throw new Error("Division by zero");
        }

        values.push(a / b);
        break;

      default:
        throw new Error("Unknown operator");
    }
  });

  // A valid expression must leave exactly one result.
  if (values.length !== 1) {
    throw new Error("Invalid expression");
  }

  return values[0];
}


// ===== Equals button =====

// Calculate the complete expression when "=" is pressed.
function performEquals() {
  // Do nothing if there is no expression.
  if (expression === "") {
    return;
  }

  // Calculate everything that has been typed.
  const result = calculateExpression(expression);

  // Show the answer.
  updateDisplay(result);

  // Allow the answer to be used in another calculation.
  expression = result === "Error" ? "" : result;
}


// ===== Clear button =====

// Reset the calculator.
function resetCalculator() {
  expression = "";
  updateDisplay("0");
}


// ===== Mouse button events =====

// Add click events to all number buttons.
document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", () => {
    inputNumber(button.dataset.value);
  });
});

// Add click events to all operator buttons.
document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {
    inputOperator(button.dataset.operator);
  });
});

// Calculate the full expression when "=" is clicked.
document
  .querySelector('[data-action="equals"]')
  .addEventListener("click", performEquals);

// Clear the expression when CLEAR is clicked.
document
  .querySelector('[data-action="clear"]')
  .addEventListener("click", resetCalculator);


// ===== Keyboard support =====

// Allow the calculator to be controlled from the keyboard.
document.addEventListener("keydown", (event) => {
  // Number keys.
  if (/^[0-9]$/.test(event.key)) {
    inputNumber(event.key);
  }

  // Mathematical operators.
  if (["+", "-", "*", "/"].includes(event.key)) {
    inputOperator(event.key);
  }

  // Allow parentheses from the keyboard.
  if (event.key === "(" || event.key === ")") {
    // Only allow parentheses as part of an existing expression.
    if (expression !== "") {
      expression += event.key;
      updateDisplay(expression);
    }
  }

  // Enter or "=" calculates the complete expression.
  if (event.key === "Enter" || event.key === "=") {
    performEquals();
  }

  // Escape or C clears the calculator.
  if (event.key === "Escape" || event.key.toLowerCase() === "c") {
    resetCalculator();
  }

  // Backspace removes the last character.
  if (event.key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay(expression);
  }
});
