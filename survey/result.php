<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>설문 완료</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <div class="result-message">
            <?php if (isset($_GET['success'])): ?>
                <h1>✅ 설문이 성공적으로 제출되었습니다!</h1>
                <p>소중한 의견을 주셔서 감사합니다.<br>
                더 나은 디자인전략 AI 서비스 개발에 활용하겠습니다.</p>
            <?php elseif (isset($_GET['error'])): ?>
                <h1>❌ 오류가 발생했습니다</h1>
                <p>설문 제출 중 문제가 발생했습니다.<br>
                잠시 후 다시 시도해 주세요.</p>
                <a href="index.html" class="retry-btn">다시 시도하기</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>