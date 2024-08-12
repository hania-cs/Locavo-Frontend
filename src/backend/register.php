<?php
// Display errors for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webserdb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "Connection failed: " . $conn->connect_error]));
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputEmail = $_POST['email'];
    $inputPassword = $_POST['password'];

    // Simple validation
    if (empty($inputEmail) || empty($inputPassword)) {
        echo json_encode(["success" => false, "error" => "Email and password are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("s", $inputEmail);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false, "error" => "Email already registered"]);
        $stmt->close();
        $conn->close();
        exit;
    }

    $stmt->close();

    // Insert user into the database with plain text password
    $stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    if (!$stmt) {
        echo json_encode(["success" => false, "error" => "Prepare failed: " . $conn->error]);
        exit;
    }
    $stmt->bind_param("ss", $inputEmail, $inputPassword);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Execute failed: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>
