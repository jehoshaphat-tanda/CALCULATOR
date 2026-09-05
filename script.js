let expression = "";

const display = document.getElementById("display");
const equalsButton = document.querySelector('[data-action="equals"]');
const clearButton = document.querySelector('[data-action="clear"]');

// Update the calculator display.
function updateDisplay(value) {
    display.textContent = value;
}

// Add a number to the expression.
function inputNumber(number) {
    expression += number;
    updateDisplay(expression);
}

// Add an operator to the expression.
function inputOperator(operator) {
    if (expression === "") {
        return;
    }

    // Replace the previous operator if two operators are entered together.
    if (/[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1) + operator;
    } else {
        expression += operator;
    }

    updateDisplay(expression.replace(/\*/g, "×").replace(/-/g, "−"));
}

// Convert the expression into separate numbers and operators for PHP.
function prepareCalculation(input) {
    const tokens = input.match(/\d*\.?\d+|[+\-*/]/g);

    if (!tokens || tokens.join("") !== input) {
        throw new Error("Invalid expression");
    }

    const numbers = [];
    const operators = [];
    let expectingNumber = true;

    for (const token of tokens) {
        if (expectingNumber) {
            if (!/^\d*\.?\d+$/.test(token)) {
                throw new Error("Invalid expression");
            }
            numbers.push(Number(token));
            expectingNumber = false;
        } else {
            if (!/^[+\-*/]$/.test(token)) {
                throw new Error("Invalid expression");
            }
            operators.push(token);
            expectingNumber = true;
        }
    }

    if (expectingNumber) {
        throw new Error("Expression cannot end with an operator");
    }

    return { numbers, operators };
}

// Send the numbers and operators to PHP and receive the result.
async function performEquals() {
    if (expression === "") {
        return;
    }

    try {
        const calculation = prepareCalculation(expression);
        updateDisplay("Calculating...");

        const response = await fetch("calculate.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(calculation)
        });

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Calculation failed");
        }

        expression = String(data.result);
        updateDisplay(data.result);
    } catch (error) {
        console.error(error);
        expression = "";
        updateDisplay("Error");
    }
}

// Clear the calculator.
function resetCalculator() {
    expression = "";
    updateDisplay("0");
}

// Number buttons.
document.querySelectorAll(".number").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.value || button.textContent.trim());
    });
});

// Operator buttons.
document.querySelectorAll(".operator").forEach(button => {
    button.addEventListener("click", () => {
        inputOperator(button.dataset.operator);
    });
});

// Equals and clear buttons use data-action in the HTML.
if (equalsButton) {
    equalsButton.addEventListener("click", performEquals);
}

if (clearButton) {
    clearButton.addEventListener("click", resetCalculator);
}

// Keyboard support.
document.addEventListener("keydown", event => {
    if (/^[0-9.]$/.test(event.key)) {
        inputNumber(event.key);
    } else if (["+", "-", "*", "/"].includes(event.key)) {
        inputOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        performEquals();
    } else if (event.key === "Backspace") {
        expression = expression.slice(0, -1);
        updateDisplay(expression ? expression.replace(/\*/g, "×").replace(/-/g, "−") : "0");
    } else if (event.key === "Escape") {
        resetCalculator();
    }
});
