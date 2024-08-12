<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

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
    die("Connection failed: " . $conn->connect_error);
}

// Get ID from request
$data = json_decode(file_get_contents("php://input"));
$id = $data->id;

// Prepare and bind
$stmt = $conn->prepare("DELETE FROM cars WHERE id = ?");
$stmt->bind_param("i", $id);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(["message" => "Car deleted successfully"]);
} else {
    echo json_encode(["error" => "Error deleting car: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>
