<?php

header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

<<<<<<< HEAD
    echo json_encode([
        "success" => false,
        "error" => "Only POST requests are allowed."
    ]);

    exit;
}

// Get JSON sent by JavaScript
$input = file_get_contents("php://input");
$data = json_decode($input, true);
=======
    echo json_encode([ // Send JSON-encoded error response
        "success" => false, // Set success status to false
        "error" => "Only POST requests are allowed." // Provide error message string
    ]); 
    exit; // Stop execution of the script
} 
// Get JSON sent by JavaScript // Comment explaining source of raw request body
$input = file_get_contents("php://input"); // Read raw input stream from request body
$data = json_decode($input, true); // Decode JSON string into associative PHP array
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8

$numbers = $data["numbers"] ?? null;
$operators = $data["operators"] ?? null;

<<<<<<< HEAD
// Validate the received data
if (!is_array($numbers) || !is_array($operators)) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid calculation data."
    ]);

    exit;
}

// There must be one more number than operators
if (count($numbers) !== count($operators) + 1) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid number/operator arrangement."
=======
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
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8
    ]);

    exit;
}

// Validate numbers
<<<<<<< HEAD
foreach ($numbers as $number) {
    if (!is_numeric($number)) {
        echo json_encode([
            "success" => false,
            "error" => "Invalid number."
        ]);

        exit;
    }
}

// Validate operators
$allowedOperators = ["+", "-", "*", "/"];

foreach ($operators as $operator) {
    if (!in_array($operator, $allowedOperators, true)) {
        echo json_encode([
            "success" => false,
            "error" => "Invalid operator."
        ]);

        exit;
    }
}
=======
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
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8

// Convert numbers to floating-point values
for ($i = 0; $i < count($numbers); $i++) {
    $numbers[$i] = (float) $numbers[$i];
}


<<<<<<< HEAD
/*
 * First perform multiplication and division.
 * This gives multiplication/division higher precedence
 * than addition/subtraction.
 */
$i = 0;
=======
/* 
 * First perform multiplication and division. // Explaining mathematical operation sequence
 * This gives multiplication/division higher precedence // Explaining operator precedence (BODMAS/PEMDAS)
 * than addition/subtraction. // Explaining priority over addition/subtraction
 */ 
$i = 0; // Initialize loop index counter to zero
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8

while ($i < count($operators)) {

    $operator = $operators[$i];

    if ($operator === "*" || $operator === "/") {

        $left = $numbers[$i];
        $right = $numbers[$i + 1];

<<<<<<< HEAD
        // Prevent division by zero
        if ($operator === "/" && $right == 0) {
            echo json_encode([
                "success" => false,
                "error" => "Cannot divide by zero."
            ]);

            exit;
        }

        if ($operator === "*") {
            $result = $left * $right;
        } else {
            $result = $left / $right;
        }

        // Replace the two numbers with their result
        $numbers[$i] = $result;
        array_splice($numbers, $i + 1, 1);

        // Remove the operator
        array_splice($operators, $i, 1);

    } else {
        $i++;
    }
}


/*
 * Now perform addition and subtraction.
 */
$result = $numbers[0];
=======
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
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8

for ($i = 0; $i < count($operators); $i++) {

    $operator = $operators[$i];
    $nextNumber = $numbers[$i + 1];

<<<<<<< HEAD
    if ($operator === "+") {
        $result += $nextNumber;
    }

    if ($operator === "-") {
        $result -= $nextNumber;
    }
}

// Return the result to JavaScript
echo json_encode([
    "success" => true,
    "result" => $result
]);
?>
=======
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
>>>>>>> dcef24f11be0e58eea3baaf3d0360c2558b65be8
