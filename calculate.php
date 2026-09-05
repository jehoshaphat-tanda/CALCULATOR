<?php // Open PHP tag to start executing script

header("Content-Type: application/json"); // Set response header to JSON format

// Only allow POST requests // Comment explaining request method restriction
if ($_SERVER["REQUEST_METHOD"] !== "POST") { // Check if HTTP method is not POST
    http_response_code(405); // Set HTTP response status code to 405 Method Not Allowed

    echo json_encode([ // Send JSON-encoded error response
        "success" => false, // Set success status to false
        "error" => "Only POST requests are allowed." // Provide error message string
    ]); 
    exit; // Stop execution of the script
} 
// Get JSON sent by JavaScript // Comment explaining source of raw request body
$input = file_get_contents("php://input"); // Read raw input stream from request body
$data = json_decode($input, true); // Decode JSON string into associative PHP array

$numbers = $data["numbers"] ?? null; // Get numbers array or default to null if missing
$operators = $data["operators"] ?? null; // Get operators array or default to null if missing

// Validate the received data // Comment explaining data type validation check
if (!is_array($numbers) || !is_array($operators)) { // Ensure both variables are valid arrays
    echo json_encode([ // Send JSON-encoded error response
        "success" => false, // Set success status to false
        "error" => "Invalid calculation data." // Provide error message string
    ]); 

    exit; // Stop execution of the script
} 

// There must be one more number than operators // Comment explaining binary operator math rule
if (count($numbers) !== count($operators) + 1) { // Validate count ratio between numbers and operators
    echo json_encode([ // Send JSON-encoded error response
        "success" => false, // Set success status to false
        "error" => "Invalid number/operator arrangement." // Provide error message string
    ]);

    exit; // Stop execution of the script
} // Close IF block for count check

// Validate numbers
foreach ($numbers as $number) { // Loop through each element in numbers array
    if (!is_numeric($number)) { // Check if value is not numeric
        echo json_encode([ // Send JSON-encoded error response
            "success" => false, // Set success status to false
            "error" => "Invalid number." // Provide error message string
        ]); 
        exit; // Stop execution of the script
    } 
} 

// Validate operators 
$allowedOperators = ["+", "-", "*", "/"]; // Define whitelist array of valid operators

foreach ($operators as $operator) { // Loop through each element in operators array
    if (!in_array($operator, $allowedOperators, true)) { // Strictly check if operator exists in allowed array
        echo json_encode([ // Send JSON-encoded error response
            "success" => false, // Set success status to false
            "error" => "Invalid operator." // Provide error message string
        ]); 

        exit; 
    } 
} 

// Convert numbers to floating-point values // Comment explaining type casting loop
for ($i = 0; $i < count($numbers); $i++) { // Iterate through numbers array indices
    $numbers[$i] = (float) $numbers[$i]; // Cast each element to float type
} // Close for loop for casting


/* 
 * First perform multiplication and division. // Explaining mathematical operation sequence
 * This gives multiplication/division higher precedence // Explaining operator precedence (BODMAS/PEMDAS)
 * than addition/subtraction. // Explaining priority over addition/subtraction
 */ 
$i = 0; // Initialize loop index counter to zero

while ($i < count($operators)) { // Loop while index is within operators length

    $operator = $operators[$i]; // Get current operator at index $i

    if ($operator === "*" || $operator === "/") { // Check if operator is multiplication or division

        $left = $numbers[$i]; // Get left operand from numbers array
        $right = $numbers[$i + 1]; // Get right operand from numbers array

        // Prevent division by zero // Comment explaining division by zero safety check
        if ($operator === "/" && $right == 0) { // Check for division operation with zero divisor
            echo json_encode([ // Send JSON-encoded error response
                "success" => false, // Set success status to false
                "error" => "Cannot divide by zero." // Provide error message string
            ]);

            exit; // Stop execution of the script
        }

        if ($operator === "*") { // Check if current operation is multiplication
            $result = $left * $right; // Multiply left and right operands
        } else { // Handle division case
            $result = $left / $right; // Divide left operand by right operand
        } 

        // Replace the two numbers with their result 
        $numbers[$i] = $result; // Update current index with computed result
        array_splice($numbers, $i + 1, 1); // Remove processed second operand from array

        // Remove the operator 
        array_splice($operators, $i, 1); // Remove processed operator from array

    } else { // Execute when operator is addition or subtraction
        $i++; // Increment index counter to move to next operator
    } 
} 


/* // Start multi-line comment block
 * Now perform addition and subtraction. // Explaining second phase of calculation
 */ 
$result = $numbers[0]; // Initialize final result with first remaining number

for ($i = 0; $i < count($operators); $i++) { // Iterate through remaining addition/subtraction operators

    $operator = $operators[$i]; // Get current operator
    $nextNumber = $numbers[$i + 1]; // Get next number to apply

    if ($operator === "+") { // Check if operator is addition
        $result += $nextNumber; // Add next number to running result
    } 

    if ($operator === "-") { // Check if operator is subtraction
        $result -= $nextNumber; // Subtract next number from running result
    } 
} 

// Return the result to JavaScript 
echo json_encode([ // Send JSON-encoded success response
    "success" => true, // Set success status to true
    "result" => $result // Pass calculated value
]); 
?> 
