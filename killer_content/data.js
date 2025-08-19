// ====== 데이터 ======
const trendLabels8 = ["23Q1","23Q2","23Q3","23Q4","24Q1","24Q2","24Q3","24Q4"];
const trendLabels12 = ["22Q1","22Q2","22Q3","22Q4","23Q1","23Q2","23Q3","23Q4","24Q1","24Q2","24Q3","24Q4"];

const trendSeries = {
  AI카메라: { data8:[38,44,52,59,66,71,78,84], data12:[12,16,22,30,38,44,52,59,66,71,78,84], color:'#7c5cff'},
  폴더블UX: { data8:[42,47,50,53,57,60,66,70], data12:[20,26,34,39,42,47,50,53,57,60,66,70], color:'#36d399'},
  친환경소재: { data8:[22,25,28,31,35,38,40,43], data12:[10,15,18,20,22,25,28,31,35,38,40,43], color:'#ffd166'},
  카메라모듈디자인: { data8:[18,22,26,28,30,32,35,37], data12:[9,12,16,17,18,22,26,28,30,32,35,37], color:'#ff6b6b'}
};

const brands = [
  {id:'Samsung', name:'Samsung', product:'Galaxy Z Fold/Flip 6', cmf:'Armor Aluminum · Satin Glass', usp:'폴더블 UX·AI 캡션·멀티윈도우', img:'https://images.unsplash.com/photo-1606744824163-985d376605aa?q=80&w=400&auto=format&fit=crop'},
  {id:'Apple', name:'Apple', product:'iPhone 16 Pro', cmf:'Titanium · Textured Glass', usp:'A.I. 보정·프로RAW 워크플로우', img:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=400&auto=format&fit=crop'},
  {id:'Xiaomi', name:'Xiaomi', product:'13/14 Ultra', cmf:'Vegan Leather · Metal', usp:'라이카 컬러·대형 센서', img:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=400&auto=format&fit=crop'}
];

const marketYears = ['2021','2022','2023','2024E','2025E'];

// 국내 시장 데이터 (단위: 조원)
const domesticMarketValues = [42, 41, 43, 44, 45];

// 글로벌 시장 데이터 (단위: 십억 달러)
const globalMarketValues = [510, 495, 505, 540, 580];

// 기존 호환성을 위한 변수
const marketValues = domesticMarketValues;

const segments = { labels:['플래그십','중가','보급형','폴더블','게이밍'], values:[24,32,35,3.8,5.2] };

// 지역별 성장률 데이터 (단위: %)
const regionalGrowthData = {
  labels: ['서울/경기', '부산/울산', '대구/경북', '인천/충청', '광주/전라'],
  values: [4.2, 3.8, 3.5, 3.6, 3.3],
  colors: ['#7c5cff', '#36d399', '#ffd166', '#ff6b6b', '#2dd4bf']
};

const personaDB = {
  P1:{ name:'P1 · 트렌드 민감 MZ', traits:[70,60,90,75,45], factors:[65,55,80,45,72],
      insight:{ trend:'P1은 \'AI 카메라\', \'폴더블 UX\'에 높은 반응. \'친환경 소재\'는 관심은 있으나 가격 민감 시 외면.',
                brand:'Galaxy Z 시리즈의 신기능에 FOMO 반응. iPhone의 촬영·편집 워크플로우 매력적이나 폐쇄성에 약간의 불만.',
                strategy:'CMF: Satin Glass + 미세 텍스처 메탈 프레임 · 메시지: "AI가 사진을 완성한다" · 채널: 숏폼 + 크리에이터 협업' } },
  P2:{ name:'P2 · 실용 중심 직장인', traits:[55,62,58,60,50], factors:[48,52,70,80,55],
      insight:{ trend:'P2는 안정성·배터리·내구 관련 키워드에 반응. 폴더블은 흥미는 있으나 실사용 편익 의문.',
                brand:'iPhone의 연동·AS 신뢰 높게 평가. 중가 안드로이드 가성비에도 반응.',
                strategy:'CMF: 스크래치 저항 코팅 · 메시지: "하루 종일 배터리, 3년 안심" · 채널: 리뷰·비교 콘텐츠' } },
  P3:{ name:'P3 · 친환경 가치 지향', traits:[40,58,64,68,92], factors:[44,50,68,60,78],
      insight:{ trend:'P3는 재활용 소재·탄소발자국 감축 메시지에 강하게 반응. AI 기능은 삶의 질 향상 맥락에서 수용.',
                brand:'친환경 소재·수리 용이성 브랜드 선호. 포장재·리퍼 프로그램 등 순환 전략 긍정.',
                strategy:'CMF: 재활용 알루미늄 + 무광 재활용 유리 · 메시지: "지속가능, 성능 타협 없음" · 채널: 브랜드 저널리즘' } }
};

const personaKeywordReaction = {
  P1:{'AI카메라':2,'폴더블UX':2,'친환경소재':1,'카메라모듈디자인':1},
  P2:{'AI카메라':1,'폴더블UX':0,'친환경소재':1,'카메라모듈디자인':1},
  P3:{'AI카메라':1,'폴더블UX':1,'친환경소재':2,'카메라모듈디자인':1}
};

const personaBrandReaction = { 
  P1:{Samsung:2, Apple:2, Xiaomi:1}, 
  P2:{Samsung:1, Apple:2, Xiaomi:1}, 
  P3:{Samsung:1, Apple:1, Xiaomi:2} 
};

const trendNotes = {
  'AI카메라':'사진·영상 촬영 후 AI 기반 보정/합성/캡션/검색까지 이어지는 워크플로우 고도화 트렌드입니다.',
  '폴더블UX':'멀티태스킹/앱 연속성/플렉스모드 등 폴더블 전용 상호작용 패턴이 성숙 단계로 진입하고 있습니다.',
  '친환경소재':'재활용 알루미늄/유리, 비건 레더 등 지속가능 소재 채택이 확대되는 트렌드입니다.',
  '카메라모듈디자인':'카메라 섬의 형태·대칭성·소재/마감 차별화로 브랜드 아이덴티티를 강화하는 흐름입니다.'
};

const interviewPools = {
  P1:[
    {id:'P1-01', meta:{age:'29', job:'마케터', city:'서울', type:'FGD'}, tags:['AI카메라','폴더블UX'], text:'폴더블은 화면을 펼쳤을 때 멀티태스킹이 확실히 좋아요. AI로 촬영 후 후보정까지 자동화되는 건 SNS 업로드에 시간 절약되고요.'},
    {id:'P1-02', meta:{age:'26', job:'프리랜서 포토', city:'부산', type:'IDI'}, tags:['AI카메라','카메라모듈디자인'], text:'저는 카메라섬 디자인이 깔끔한 게 좋아요. 야간에 인물 촬영할 때 AI 노이즈 억제가 체감됩니다.'},
    {id:'P1-03', meta:{age:'31', job:'UI 디자이너', city:'성남', type:'Intercept'}, tags:['친환경소재'], text:'친환경 소재는 좋지만 무게가 늘거나 가격이 오르면 고민됩니다.'},
    {id:'P1-04', meta:{age:'28', job:'크리에이터', city:'대구', type:'FGD'}, tags:['Samsung','Apple'], text:'갤럭시는 촬영 후 편집툴 연동이 좋아졌고, 아이폰은 색감 일관성이 강점이라 둘 다 씁니다.'}
  ],
  P2:[
    {id:'P2-01', meta:{age:'36', job:'영업', city:'서울', type:'IDI'}, tags:['배터리','내구'], text:'출장이 많아 배터리와 내구가 제일 중요합니다. 폴더블은 아직 조심스럽네요.'},
    {id:'P2-02', meta:{age:'33', job:'개발자', city:'수원', type:'FGD'}, tags:['Apple','A/S'], text:'아이폰은 AS와 생태계 연동이 편해서 계속 쓰게 됩니다.'},
    {id:'P2-03', meta:{age:'40', job:'기획', city:'인천', type:'Intercept'}, tags:['가성비','Xiaomi'], text:'사진 품질이 일정 수준 넘으면 가격이 결정적이에요. 샤오미 울트라는 가성비 좋아 보입니다.'}
  ],
  P3:[
    {id:'P3-01', meta:{age:'27', job:'연구원', city:'세종', type:'FGD'}, tags:['친환경소재','수리용이성'], text:'리사이클 소재와 수리 용이성 정보가 명확하면 선택에 큰 영향이 있습니다.'},
    {id:'P3-02', meta:{age:'34', job:'교사', city:'대전', type:'IDI'}, tags:['포장재','리퍼'], text:'불필요한 패키지 줄이고 리퍼 프로그램을 확대하면 브랜드 호감이 올라갈 거예요.'},
    {id:'P3-03', meta:{age:'30', job:'마케터', city:'광주', type:'Intercept'}, tags:['AI카메라'], text:'AI 기능도 결국 일상 효용이 있어야 해요. 사진 자동 보정이 시간 아껴주면 긍정적입니다.'}
  ]
};
