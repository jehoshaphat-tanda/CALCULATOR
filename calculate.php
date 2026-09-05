<?php

header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "error" => "Only POST requests are allowed."
    ]);

    exit;
}

// Get JSON sent by JavaScript
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$numbers = $data["numbers"] ?? null;
$operators = $data["operators"] ?? null;

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
    ]);

    exit;
}

// Validate numbers
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

// Convert numbers to floating-point values
for ($i = 0; $i < count($numbers); $i++) {
    $numbers[$i] = (float) $numbers[$i];
}


/*
 * First perform multiplication and division.
 * This gives multiplication/division higher precedence
 * than addition/subtraction.
 */
$i = 0;

while ($i < count($operators)) {

    $operator = $operators[$i];

    if ($operator === "*" || $operator === "/") {

        $left = $numbers[$i];
        $right = $numbers[$i + 1];

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

for ($i = 0; $i < count($operators); $i++) {

    $operator = $operators[$i];
    $nextNumber = $numbers[$i + 1];

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