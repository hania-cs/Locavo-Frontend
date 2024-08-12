<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webserdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get data from request
$data = json_decode(file_get_contents("php://input"));

// Validate data
if (isset($data->name) && isset($data->price) && isset($data->description) && isset($data->available)) {
    $name = $data->name;
    $price = $data->price;
    $description = $data->description;
    $available = $data->available;

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO cars (name, price, description, available) VALUES (?, ?, ?, ?)");
    if ($stmt === false) {
        echo json_encode(["error" => "Prepare failed: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("sdsi", $name, $price, $description, $available);

    // Execute statement
    if ($stmt->execute()) {
        echo json_encode(["message" => "Car added successfully"]);
    } else {
        echo json_encode(["error" => "Execute failed: " . $stmt->error]);
    }

    // Close statement
    $stmt->close();
} else {
    echo json_encode(["error" => "Invalid input"]);
}

// Close connection
$conn->close();
?>
