<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>개인정보 검색</title>
</head>
<body>
  <h2>이름으로 개인정보 검색</h2>
  <form method="get">
    <input type="text" name="keyword" placeholder="이름 입력">
    <input type="submit" value="검색">
  </form>

<?php
if (isset($_GET['keyword'])) {
    $conn = new mysqli('localhost', 'nfco', 'jinho6196**', 'nfco');
    if ($conn->connect_error) die("DB 연결 실패: " . $conn->connect_error);

    $keyword = $conn->real_escape_string($_GET['keyword']);
    $sql = "SELECT * FROM people WHERE name LIKE '%$keyword%'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "<h3>검색 결과:</h3>";
        echo "<ul>";
        while ($row = $result->fetch_assoc()) {
            echo "<li><strong>{$row['name']}</strong><br>";
            echo "📧 Email: {$row['email']}<br>";
            echo "📞 Phone: {$row['phone']}<br>";
            echo "🏠 Address: {$row['address']}</li><br>";
        }
        echo "</ul>";
    } else {
        echo "<p>검색 결과가 없습니다.</p>";
    }

    $conn->close();
}
?>
</body>
</html>
