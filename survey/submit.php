<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        // 체크박스 배열을 문자열로 변환
        $difficult_tasks = isset($_POST['difficult_tasks']) ? implode(',', $_POST['difficult_tasks']) : '';
        $ai_help_areas = isset($_POST['ai_help_areas']) ? implode(',', $_POST['ai_help_areas']) : '';
        
        // 기타 입력값 처리
        $job_field = $_POST['job_field'];
        if ($job_field == 'other' && !empty($_POST['job_field_other'])) {
            $job_field = $_POST['job_field_other'];
        }
        
        // 기타 어려운 업무 처리
        if (in_array('other', $_POST['difficult_tasks']) && !empty($_POST['difficult_tasks_other'])) {
            $difficult_tasks .= ',' . $_POST['difficult_tasks_other'];
        }
        
        // IP 주소 가져오기
        $ip_address = $_SERVER['REMOTE_ADDR'];
        
        // 데이터베이스에 저장
        $sql = "INSERT INTO survey_responses (
            job_field, ai_usage_frequency, difficult_tasks, detailed_difficulty, 
            ai_help_areas, important_features_1, important_features_2, 
            important_features_3, ideal_service, ip_address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $job_field,
            $_POST['ai_usage'],
            $difficult_tasks,
            $_POST['detailed_difficulty'],
            $ai_help_areas,
            $_POST['priority1'],
            $_POST['priority2'],
            $_POST['priority3'],
            $_POST['ideal_service'],
            $ip_address
        ]);
        
        // 성공 페이지로 리다이렉트
        header('Location: result.php?success=1');
        exit;
        
    } catch(PDOException $e) {
        header('Location: result.php?error=1');
        exit;
    }
} else {
    header('Location: index.html');
    exit;
}
?>