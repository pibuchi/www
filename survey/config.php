<?php
// 카페24 MySQL 연결 설정
$servername = "localhost";  // 또는 nfcouncil.co.kr
$username = "nfcouncil_ID"; // 실제 DB 사용자명으로 변경
$password = "your_password"; // 실제 비밀번호로 변경
$dbname = "nfcouncil_DB";   // 실제 DB명으로 변경

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("연결 실패: " . $e->getMessage());
}
?>