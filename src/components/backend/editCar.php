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

// Get data from request
$data = json_decode(file_get_contents("php://input"));
$id = $data->id;
$name = $data->name;
$price = $data->price;
$description = $data->description;
$available = $data->available;

// Prepare and bind
$stmt = $conn->prepare("UPDATE cars SET name = ?, price = ?, description = ?, available = ? WHERE id = ?");
$stmt->bind_param("sdsii", $name, $price, $description, $available, $id);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(["message" => "Car updated successfully"]);
} else {
    echo json_encode(["error" => "Error updating car: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>
