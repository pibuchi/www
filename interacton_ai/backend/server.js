const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// GPT API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Session storage for conversation context
const sessions = new Map();

// Initialize conversation context
function initializeContext(userPersona, productTitle, projectGoal) {
    const systemPrompt = `당신은 ProductAI라는 제품 디자인 전문 AI 어시스턴트입니다. 
    
사용자 정보:
- 역할: ${userPersona}
- 제품: ${productTitle}
- 목표: ${projectGoal}

당신의 역할:
1. 사용자의 역할과 경험 수준에 맞춰 적절한 수준의 설명과 가이드를 제공
2. 제품 디자인 프로세스의 각 단계를 체계적으로 안내
3. 사용자의 질문에 친근하고 전문적인 답변 제공
4. 한국어로 자연스럽게 대화하며, 이모지와 적절한 예시를 활용
5. 사용자가 막힐 때 도움을 주고, 다음 단계로 진행할 수 있도록 안내

대화 스타일:
- 친근하고 격려하는 톤
- 구체적이고 실용적인 조언
- 단계별 명확한 안내
- 적절한 이모지 사용
- 사용자의 수준에 맞는 전문 용어 사용

항상 한국어로 응답하고, 사용자의 진행 상황을 파악하여 적절한 다음 단계를 제안하세요.`;

    return [
        { role: 'system', content: systemPrompt },
        { role: 'assistant', content: '안녕하세요! 제품 디자인 프로젝트를 함께 진행할 ProductAI입니다. 😊\n\n어떤 도움이 필요하신가요?' }
    ];
}

// GPT API 호출 함수
async function callGPTAPI(messages) {
    try {
        const response = await axios.post(OPENAI_API_URL, {
            model: 'gpt-4',
            messages: messages,
            max_tokens: 1000,
            temperature: 0.7,
            presence_penalty: 0.1,
            frequency_penalty: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GPT API Error:', error.response?.data || error.message);
        throw new Error('AI 응답 생성 중 오류가 발생했습니다.');
    }
}

// API Routes

// 프로젝트 초기화
app.post('/api/initialize', (req, res) => {
    try {
        const { userPersona, productTitle, projectGoal } = req.body;
        
        if (!userPersona || !productTitle || !projectGoal) {
            return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
        }

        const sessionId = Date.now().toString();
        const context = initializeContext(userPersona, productTitle, projectGoal);
        
        sessions.set(sessionId, {
            context: context,
            userPersona: userPersona,
            productTitle: productTitle,
            projectGoal: projectGoal,
            currentStep: 1
        });

        res.json({ 
            sessionId: sessionId,
            message: context[context.length - 1].content
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 메시지 전송
app.post('/api/chat', async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        
        if (!sessionId || !message) {
            return res.status(400).json({ error: '세션 ID와 메시지가 필요합니다.' });
        }

        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
        }

        // 사용자 메시지 추가
        session.context.push({ role: 'user', content: message });

        // GPT API 호출
        const aiResponse = await callGPTAPI(session.context);

        // AI 응답 추가
        session.context.push({ role: 'assistant', content: aiResponse });

        res.json({ 
            message: aiResponse,
            currentStep: session.currentStep
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 진행 단계 업데이트
app.post('/api/update-step', (req, res) => {
    try {
        const { sessionId, step } = req.body;
        
        const session = sessions.get(sessionId);
        if (!session) {
            return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
        }

        session.currentStep = step;
        res.json({ currentStep: step });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 세션 정보 조회
app.get('/api/session/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = sessions.get(sessionId);
        
        if (!session) {
            return res.status(404).json({ error: '세션을 찾을 수 없습니다.' });
        }

        res.json({
            userPersona: session.userPersona,
            productTitle: session.productTitle,
            projectGoal: session.projectGoal,
            currentStep: session.currentStep
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`OpenAI API Key: ${OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
}); 
