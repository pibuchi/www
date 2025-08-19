const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`요청: ${req.method} ${req.url}`);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>iknowyou.cloud - 작동 중</title>
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
            .warning { background: #ffc107; color: #000; padding: 15px; border-radius: 10px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌐 iknowyou.cloud - 서버 작동 중</h1>
            
            <div class="success">
                ✅ 서버가 정상적으로 실행되고 있습니다!
            </div>
            
            <div class="info">
                <p><strong>서버 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                <p><strong>요청 URL:</strong> ${req.url}</p>
                <p><strong>포트:</strong> 8080</p>
                <p><strong>파일:</strong> working-server.js</p>
            </div>
            
            <div class="warning">
                <h3>🔧 도메인 연결 테스트</h3>
                <p>이제 다음 URL들을 테스트해보세요:</p>
                <ul>
                    <li><strong>로컬:</strong> <a href="http://localhost:8080" style="color: #000;">http://localhost:8080</a></li>
                    <li><strong>DuckDNS:</strong> <a href="http://pibuchi.duckdns.org:8080" style="color: #000;">http://pibuchi.duckdns.org:8080</a></li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;
    
    res.end(html);
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 서버가 포트 8080에서 시작되었습니다!');
    console.log(`📱 로컬 접속: http://localhost:${PORT}`);
    console.log(`🌐 DuckDNS 접속: http://pibuchi.duckdns.org:${PORT}`);
    console.log('🛑 서버 종료: Ctrl+C');
});

process.on('SIGINT', () => {
    console.log('\n🛑 서버 종료 중...');
    server.close();
    process.exit(0);
}); 
