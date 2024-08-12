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

// Delete rental record
$sql = "DELETE FROM rentals WHERE user_id = ? AND car_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id, $car_id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Rental cancelled successfully"]);
} else {
    echo json_encode(["error" => "Error cancelling rental: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
