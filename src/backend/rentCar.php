<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webserdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$input = json_decode(file_get_contents('php://input'), true);
$user_id = $input['user_id'];
$car_id = $input['car_id'];

// Check if the car is already rented
$checkSql = "SELECT * FROM rentals WHERE car_id = ? AND user_id = ?";
$stmt = $conn->prepare($checkSql);
$stmt->bind_param("ii", $car_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["error" => "Car is already rented"]);
    $stmt->close();
    $conn->close();
    exit;
}

// Insert new rental record
$sql = "INSERT INTO rentals (user_id, car_id) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $car_id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Car rented successfully"]);
} else {
    echo json_encode(["error" => "Error renting car: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
