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
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get data from request
$data = json_decode(file_get_contents("php://input"));
$id = $data->id;
$available = $data->available;

// Prepare and bind
$stmt = $conn->prepare("UPDATE cars SET available = ? WHERE id = ?");
$stmt->bind_param("ii", $available, $id);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(["message" => "Car status updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating car status: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>
