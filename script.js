let expression = ""; // Declare variable to store the current expression string

const display = document.getElementById("display"); // Get the display element from the DOM by its ID
const equalsButton = document.querySelector('[data-action="equals"]'); // Get the equals button element using custom attribute query
const clearButton = document.querySelector('[data-action="clear"]'); // Get the clear button element using custom attribute query

// Update the calculator display. // Comment explaining function purpose
function updateDisplay(value) { // Define function to update text in the display element
    display.textContent = value; // Set the text content of the display to the provided value
} // Close updateDisplay function

// Add a number to the expression. // Comment explaining function purpose
function inputNumber(number) { // Define function to handle number button presses
    expression += number; // Append the clicked number to the current expression string
    updateDisplay(expression); // Render updated expression on the screen
} // Close inputNumber function

// Add an operator to the expression. // Comment explaining function purpose
function inputOperator(operator) { // Define function to handle operator button presses
    if (expression === "") { // Check if expression string is currently empty
        return; // Exit function early if no number has been entered yet
    } // Close empty expression check

    // Replace the previous operator if two operators are entered together. // Comment explaining operator replacement logic
    if (/[+\-*/]$/.test(expression)) { // Check if expression ends with an existing operator
        expression = expression.slice(0, -1) + operator; // Replace last character with the newly selected operator
    } else { // Case when preceding character is a number
        expression += operator; // Append operator directly to expression string
    } // Close operator check condition

    updateDisplay(expression.replace(/\*/g, "×").replace(/-/g, "−")); // Format operators to multiplication/subtraction symbols for display
} // Close inputOperator function

// Convert the expression into separate numbers and operators for PHP. // Comment explaining function purpose
function prepareCalculation(input) { // Define function to parse raw expression into structured data
    const tokens = input.match(/\d*\.?\d+|[+\-*/]/g); // Use regex to extract all numbers and operators into an array

    if (!tokens || tokens.join("") !== input) { // Validate that tokenized array matches entire input string completely
        throw new Error("Invalid expression"); // Throw error if string contains invalid characters or pattern
    } // Close validation check

    const numbers = []; // Initialize empty array to hold extracted numbers
    const operators = []; // Initialize empty array to hold extracted operators
    let expectingNumber = true; // Set flag tracking expected token type (starts expecting number)

    for (const token of tokens) { // Iterate over each matched token in array
        if (expectingNumber) { // Check if loop currently expects a number token
            if (!/^\d*\.?\d+$/.test(token)) { // Verify token is a valid numeric pattern
                throw new Error("Invalid expression"); // Throw error if non-number found when number expected
            } // Close token verification check
            numbers.push(Number(token)); // Convert numeric string to Number and push into numbers array
            expectingNumber = false; // Toggle flag to expect operator next
        } else { // Handle state when operator is expected
            if (!/^[+\-*/]$/.test(token)) { // Verify token is a valid arithmetic operator
                throw new Error("Invalid expression"); // Throw error if non-operator found when operator expected
            } // Close operator verification check
            operators.push(token); // Push valid operator string into operators array
            expectingNumber = true; // Toggle flag to expect number next
        } // Close expectingNumber conditional
    } // Close token iteration loop

    if (expectingNumber) { // Check if expression ended prematurely on an operator
        throw new Error("Expression cannot end with an operator"); // Throw error for trailing operator
    } // Close trailing operator check

    return { numbers, operators }; // Return object containing parsed numbers and operators arrays
} // Close prepareCalculation function

// Send the numbers and operators to PHP and receive the result. // Comment explaining async AJAX function purpose
async function performEquals() { // Define asynchronous function to handle equals calculation
    if (expression === "") { // Check if expression string is empty
        return; // Stop execution if nothing to calculate
    } // Close empty check

    try { // Begin try block for handling potential runtime errors
        const calculation = prepareCalculation(expression); // Parse expression into numbers and operators
        updateDisplay("Calculating..."); // Update UI display to show loading status

        const response = await fetch("calculate.php", { // Send asynchronous HTTP POST request to PHP script
            method: "POST", // Specify HTTP request method as POST
            headers: { // Set HTTP request headers
                "Content-Type": "application/json" // Set payload format header to JSON
            }, // Close headers object
            body: JSON.stringify(calculation) // Convert parsed calculation object to JSON string payload
        }); // Close fetch request call

        if (!response.ok) { // Check if HTTP status code indicates failure (not 2xx)
            throw new Error("Server error: " + response.status); // Throw error containing HTTP status code
        } // Close HTTP response check

        const data = await response.json(); // Parse incoming JSON response payload from PHP server

        if (!data.success) { // Check if backend script returned success: false
            throw new Error(data.error || "Calculation failed"); // Throw error with backend message or fallback
        } // Close success check

        expression = String(data.result); // Update current expression variable with string result
        updateDisplay(data.result); // Render calculated result to display UI
    } catch (error) { // Catch block for error handling
        console.error(error); // Log detailed error message to browser console
        expression = ""; // Reset expression string to empty state
        updateDisplay("Error"); // Display error message to UI
    } // Close try-catch block
} // Close performEquals function

// Clear the calculator. // Comment explaining function purpose
function resetCalculator() { // Define function to clear current state
    expression = ""; // Reset internal expression string variable to empty
    updateDisplay("0"); // Reset display UI to default zero state
} // Close resetCalculator function

// Number buttons. // Comment indicating event listeners for number inputs
document.querySelectorAll(".number").forEach(button => { // Find all number class buttons and iterate through them
    button.addEventListener("click", () => { // Attach click event handler to each number button
        inputNumber(button.dataset.value || button.textContent.trim()); // Call inputNumber with data-value or button text
    }); // Close click listener callback
}); // Close forEach loop for number buttons

// Operator buttons. // Comment indicating event listeners for operator inputs
document.querySelectorAll(".operator").forEach(button => { // Find all operator class buttons and iterate through them
    button.addEventListener("click", () => { // Attach click event handler to each operator button
        inputOperator(button.dataset.operator); // Call inputOperator with button's data-operator attribute value
    }); // Close click listener callback
}); // Close forEach loop for operator buttons

// Equals and clear buttons use data-action in the HTML. // Comment explaining explicit action button handling
if (equalsButton) { // Check if equals button element exists in DOM
    equalsButton.addEventListener("click", performEquals); // Attach click listener to trigger calculation
} // Close IF block for equalsButton check

if (clearButton) { // Check if clear button element exists in DOM
    clearButton.addEventListener("click", resetCalculator); // Attach click listener to trigger reset
} // Close IF block for clearButton check

// Keyboard support. // Comment explaining global keyboard event listener
document.addEventListener("keydown", event => { // Attach keydown listener to entire document window
    if (/^[0-9.]$/.test(event.key)) { // Check if pressed key is a digit or decimal point
        inputNumber(event.key); // Pass numeric key value to inputNumber function
    } else if (["+", "-", "*", "/"].includes(event.key)) { // Check if pressed key is a valid operator
        inputOperator(event.key); // Pass operator key value to inputOperator function
    } else if (event.key === "Enter" || event.key === "=") { // Check if key is Enter or Equals
        event.preventDefault(); // Prevent default browser actions (like form submissions)
        performEquals(); // Execute calculation function
    } else if (event.key === "Backspace") { // Check if key pressed is Backspace
        expression = expression.slice(0, -1); // Remove last character from expression string
        updateDisplay(expression ? expression.replace(/\*/g, "×").replace(/-/g, "−") : "0"); // Update display or default to 0 if empty
    } else if (event.key === "Escape") { // Check if key pressed is Escape
        resetCalculator(); // Clear calculator state
    } // Close keyboard input conditional tree
}); // Close keydown event listener callback