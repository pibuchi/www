const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`요청: ${req.method} ${req.url}`);
    
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'OK', 
            message: '서버가 정상 작동 중입니다',
            timestamp: new Date().toISOString(),
            port: 3000
        }));
        return;
    }
    
    if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'OK', 
            service: 'API Server',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    if (req.url === '/ai/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'OK', 
            service: 'AI Server',
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    // 기본 HTML 응답
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>iknowyou.cloud - 서버 테스트</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                color: white;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
            }
            .success { background: #28a745; padding: 15px; border-radius: 10px; margin: 15px 0; }
            .info { background: #17a2b8; padding: 15px; border-radius: 10px; margin: 15px 0; }
            button {
                background: #007bff;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 5px;
                transition: background 0.3s;
            }
            button:hover { background: #0056b3; }
            .test-results { margin-top: 20px; }
            .result-item {
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                background: rgba(0,0,0,0.3);
            }
            .result-success { background: rgba(40, 167, 69, 0.3); }
            .result-error { background: rgba(220, 53, 69, 0.3); }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌐 iknowyou.cloud 서버 테스트</h1>
            
            <div class="success">
                ✅ 서버가 포트 3000에서 정상 실행 중입니다!
            </div>
            
            <div class="info">
                <p><strong>서버 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                <p><strong>요청 URL:</strong> ${req.url}</p>
                <p><strong>요청 메서드:</strong> ${req.method}</p>
                <p><strong>포트:</strong> 3000</p>
            </div>
            
            <h2>🔧 API 테스트</h2>
            <button onclick="testHealth()">헬스체크 테스트</button>
            <button onclick="testAPI()">API 서버 테스트</button>
            <button onclick="testAI()">AI 서버 테스트</button>
            <button onclick="testAll()">전체 테스트</button>
            
            <div id="test-results" class="test-results"></div>
            
            <h2>📋 접속 정보</h2>
            <div class="info">
                <p><strong>로컬 접속:</strong> <a href="http://localhost:3000" style="color: white;">http://localhost:3000</a></p>
                <p><strong>DuckDNS 접속:</strong> <a href="http://pibuchi.duckdns.org:3000" style="color: white;">http://pibuchi.duckdns.org:3000</a></p>
                <p><strong>헬스체크:</strong> <a href="/health" style="color: white;">/health</a></p>
                <p><strong>API 헬스체크:</strong> <a href="/api/health" style="color: white;">/api/health</a></p>
                <p><strong>AI 헬스체크:</strong> <a href="/ai/health" style="color: white;">/ai/health</a></p>
            </div>
        </div>
        
        <script>
            async function testHealth() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<div class="result-item">🔄 헬스체크 테스트 중...</div>';
                
                try {
                    const response = await fetch('/health');
                    const data = await response.json();
                    results.innerHTML = \`
                        <div class="result-item result-success">
                            ✅ 헬스체크 성공!<br>
                            상태: \${data.status}<br>
                            메시지: \${data.message}<br>
                            시간: \${new Date(data.timestamp).toLocaleString('ko-KR')}
                        </div>
                    \`;
                } catch (error) {
                    results.innerHTML = \`<div class="result-item result-error">❌ 헬스체크 실패: \${error.message}</div>\`;
                }
            }
            
            async function testAPI() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<div class="result-item">🔄 API 서버 테스트 중...</div>';
                
                try {
                    const response = await fetch('/api/health');
                    const data = await response.json();
                    results.innerHTML = \`
                        <div class="result-item result-success">
                            ✅ API 서버 테스트 성공!<br>
                            서비스: \${data.service}<br>
                            상태: \${data.status}<br>
                            시간: \${new Date(data.timestamp).toLocaleString('ko-KR')}
                        </div>
                    \`;
                } catch (error) {
                    results.innerHTML = \`<div class="result-item result-error">❌ API 서버 테스트 실패: \${error.message}</div>\`;
                }
            }
            
            async function testAI() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<div class="result-item">🔄 AI 서버 테스트 중...</div>';
                
                try {
                    const response = await fetch('/ai/health');
                    const data = await response.json();
                    results.innerHTML = \`
                        <div class="result-item result-success">
                            ✅ AI 서버 테스트 성공!<br>
                            서비스: \${data.service}<br>
                            상태: \${data.status}<br>
                            시간: \${new Date(data.timestamp).toLocaleString('ko-KR')}
                        </div>
                    \`;
                } catch (error) {
                    results.innerHTML = \`<div class="result-item result-error">❌ AI 서버 테스트 실패: \${error.message}</div>\`;
                }
            }
            
            async function testAll() {
                const results = document.getElementById('test-results');
                results.innerHTML = '<div class="result-item">🔄 전체 테스트 중...</div>';
                
                let resultsHTML = '';
                
                // 헬스체크
                try {
                    const healthResponse = await fetch('/health');
                    const healthData = await healthResponse.json();
                    resultsHTML += \`<div class="result-item result-success">✅ 헬스체크: \${healthData.status}</div>\`;
                } catch (error) {
                    resultsHTML += \`<div class="result-item result-error">❌ 헬스체크: \${error.message}</div>\`;
                }
                
                // API 서버
                try {
                    const apiResponse = await fetch('/api/health');
                    const apiData = await apiResponse.json();
                    resultsHTML += \`<div class="result-item result-success">✅ API 서버: \${apiData.status}</div>\`;
                } catch (error) {
                    resultsHTML += \`<div class="result-item result-error">❌ API 서버: \${error.message}</div>\`;
                }
                
                // AI 서버
                try {
                    const aiResponse = await fetch('/ai/health');
                    const aiData = await aiResponse.json();
                    resultsHTML += \`<div class="result-item result-success">✅ AI 서버: \${aiData.status}</div>\`;
                } catch (error) {
                    resultsHTML += \`<div class="result-item result-error">❌ AI 서버: \${error.message}</div>\`;
                }
                
                results.innerHTML = resultsHTML;
            }
            
            // 페이지 로드 시 자동 테스트
            window.onload = function() {
                setTimeout(() => {
                    testHealth();
                }, 1000);
            };
        </script>
    </body>
    </html>
    `;
    
    res.end(html);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 서버가 시작되었습니다!');
    console.log(`📱 로컬 접속: http://localhost:${PORT}`);
    console.log(`🌐 DuckDNS 접속: http://pibuchi.duckdns.org:${PORT}`);
    console.log(`🔧 헬스체크: http://localhost:${PORT}/health`);
    console.log('🛑 서버 종료: Ctrl+C');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
        console.error('다른 포트를 사용하거나 기존 프로세스를 종료하세요.');
    } else {
        console.error('❌ 서버 오류:', error.message);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n🛑 서버 종료 중...');
    server.close(() => {
        console.log('✅ 서버가 안전하게 종료되었습니다.');
        process.exit(0);
    });
}); 
