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
        <title>iknowyou.cloud - 포트 8080</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🌐 iknowyou.cloud - 포트 8080</h1>
            
            <div class="success">
                ✅ 서버가 포트 8080에서 정상 실행 중입니다!
            </div>
            
            <div class="info">
                <p><strong>서버 시간:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                <p><strong>요청 URL:</strong> ${req.url}</p>
                <p><strong>포트:</strong> 8080</p>
            </div>
            
            <h2>📋 접속 정보</h2>
            <div class="info">
                <p><strong>로컬 접속:</strong> <a href="http://localhost:8080" style="color: white;">http://localhost:8080</a></p>
                <p><strong>DuckDNS 접속:</strong> <a href="http://pibuchi.duckdns.org:8080" style="color: white;">http://pibuchi.duckdns.org:8080</a></p>
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
