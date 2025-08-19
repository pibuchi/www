// ===== Persona Voice (의견) =====
function currentPersonaForVoice(){
  const sel = document.getElementById('voicePersonaSelect');
  const manual = sel ? sel.value : 'AUTO';
  if(manual && manual !== 'AUTO') return manual;
  const pTrendEl = document.getElementById('trendPersonaFilter');
  if(pTrendEl && pTrendEl.value && pTrendEl.value !== 'ALL') return pTrendEl.value;
  const pBrandEl = document.getElementById('brandPersonaFilter');
  if(pBrandEl && pBrandEl.value && pBrandEl.value !== 'ALL') return pBrandEl.value;
  return 'P1';
}

// ===== Persona Buzzwords (신조어) =====
function currentPersonaForBuzzwords(){
  // 주요 타겟 페르소나 분석의 선택값을 사용
  const sel = document.getElementById('personaSelect');
  return sel ? sel.value : 'P1';
}

function personaName(pid){ 
  return (personaDB[pid] && personaDB[pid].name) || pid; 
}

function topKeywordsFor(pid){
  const react = personaKeywordReaction[pid] || {}; 
  const fav=[], mid=[], low=[];
  Object.keys(react).forEach(k=>{ 
    const v=react[k]; 
    if(v===2) fav.push(k); 
    else if(v===1) mid.push(k); 
    else if(v===0) low.push(k); 
  });
  return {fav, mid, low};
}

function topBrandsFor(pid){
  const react = personaBrandReaction[pid] || {}; 
  const fav=[], low=[];
  Object.keys(react).forEach(k=>{ 
    const v=react[k]; 
    if(v===2) fav.push(k); 
    else if(v===0) low.push(k); 
  });
  return {fav, low};
}

function composeTrendOpinion(pid){
  const rangeEl = document.getElementById('trendRange');
  const range = rangeEl ? rangeEl.value : '8';
  const {fav, mid, low} = topKeywordsFor(pid);
  const showFav = fav.slice(0,2).join(', ') || '관심 키워드 없음';
  const showMid = mid.slice(0,2).join(', ');
  const showLow = low.slice(0,1).join(', ');
  var lines = [];
  lines.push('['+personaName(pid)+'] 최근 '+range+'분기 기준, 저는 '+showFav+' 쪽에 가장 끌려요.');
  if(showMid){ lines.push(showMid+'도 상황에 따라 고려하지만 핵심은 아니에요.'); }
  if(showLow){ lines.push(showLow+'는 아직 제게 매력도가 낮아요.'); }
  return lines.join(' ');
}

function composeBrandOpinion(pid){
  const tb = topBrandsFor(pid);
  const liked = brands.filter(b=>tb.fav.indexOf(b.id)>=0).map(b=>b.name+'('+b.product+')').join(', ');
  const disliked = brands.filter(b=>tb.low.indexOf(b.id)>=0).map(b=>b.name).join(', ');
  var lines = [];
  if(liked){ lines.push('['+personaName(pid)+'] 브랜드는 '+liked+'가 좋아요. USP나 CMF가 제 성향과 맞아요.'); }
  if(disliked){ lines.push('반대로 '+disliked+'는 지금 기준으론 덜 끌려요.'); }
  if(!liked && !disliked){ lines.push('['+personaName(pid)+'] 아직 뚜렷한 선호/비선호가 없어요. 더 비교해볼게요.'); }
  return lines.join(' ');
}

function setVoice(pid, text){
  var av = document.getElementById('voiceAvatar'); 
  if(av) av.textContent = pid;
  var out = document.getElementById('voiceOutput'); 
  if(out) out.innerHTML = '<small>'+personaName(pid)+'의 의견</small>'+text;
}

function speak(text){ 
  try{ 
    if(!('speechSynthesis' in window)) return; 
    window.speechSynthesis.cancel(); 
    var u=new SpeechSynthesisUtterance(text); 
    u.lang='ko-KR'; 
    window.speechSynthesis.speak(u);
  }catch(e){} 
}

function bindVoice(){
  var btnT = document.getElementById('btnGenTrendVoice');
  var btnB = document.getElementById('btnGenBrandVoice');
  var btnS = document.getElementById('btnVoiceSpeak');
  
  if(btnT){ 
    btnT.addEventListener('click', function(){ 
      var pid=currentPersonaForVoice(); 
      setVoice(pid, composeTrendOpinion(pid)); 
    }); 
  }
  
  if(btnB){ 
    btnB.addEventListener('click', function(){ 
      var pid=currentPersonaForVoice(); 
      setVoice(pid, composeBrandOpinion(pid)); 
    }); 
  }
  
  if(btnS){ 
    btnS.addEventListener('click', function(){ 
      var txt=(document.getElementById('voiceOutput')||{}).innerText||''; 
      if(txt) speak(txt); 
    }); 
  }
  
  var toggle = document.getElementById('premiumToggle');
  function syncVoiceDisabled(){ 
    var dis = !(toggle && toggle.checked); 
    ['voicePersonaSelect','btnGenTrendVoice','btnGenBrandVoice','btnVoiceSpeak'].forEach(function(id){ 
      var el=document.getElementById(id); 
      if(el) el.disabled=dis; 
    }); 
  }
  
  if(toggle){ 
    toggle.addEventListener('change', syncVoiceDisabled); 
  }
  syncVoiceDisabled();
}

// ===== Field Quotes (현장조사 스타일) =====
function pickPersonaForField(){
  const sel = document.getElementById('fieldPersonaSelect');
  if(sel && sel.value !== 'AUTO') return sel.value;
  const pTrendEl = document.getElementById('trendPersonaFilter');
  if(pTrendEl && pTrendEl.value !== 'ALL') return pTrendEl.value;
  const pBrandEl = document.getElementById('brandPersonaFilter');
  if(pBrandEl && pBrandEl.value !== 'ALL') return pBrandEl.value;
  return 'P1';
}

function renderFieldQuotes(){
  const pid = pickPersonaForField();
  const N = parseInt(document.getElementById('fieldCount').value,10) || 3;
  const includeCounter = document.getElementById('fieldCounter').checked;
  const pool = (interviewPools[pid]||[]).slice();
  
  // 간단 섞기
  pool.sort(()=>Math.random()-0.5);
  let sample = pool.slice(0,N);
  
  if(includeCounter && pool.length>N){
    // 반대 의견으로 보일 만한 태그가 다른 항목 하나 추가 시도
    const counter = pool.find(q=> !sample[0].tags.some(t=>q.tags.includes(t)) );
    if(counter) sample.push(counter);
  }
  
  const wrap = document.getElementById('fieldQuotes');
  wrap.innerHTML = '';
  
  sample.forEach((q,i)=>{
    const el = document.createElement('div'); 
    el.className='quote-item';
    const id = document.createElement('div'); 
    id.className='id'; 
    id.textContent = (i+1);
    const body = document.createElement('div'); 
    body.className='body';
    const meta = document.createElement('div'); 
    meta.className='meta'; 
    meta.textContent = `${personaName(pid)} · ${q.meta.age}세 · ${q.meta.job} · ${q.city||q.meta.city} · ${q.meta.type}`;
    const text = document.createElement('div'); 
    text.className='q'; 
    text.textContent = '"'+q.text+'"';
    const chips = document.createElement('div'); 
    chips.className='chips';
    
    (q.tags||[]).forEach(t=>{ 
      const c=document.createElement('span'); 
      c.className='chip'; 
      c.textContent=t; 
      chips.appendChild(c); 
    });
    
    body.appendChild(meta); 
    body.appendChild(text); 
    body.appendChild(chips);
    el.appendChild(id); 
    el.appendChild(body);
    wrap.appendChild(el); 
  });
  
  document.getElementById('fieldTheme').style.display='none';
}

function renderFieldTheme(){
  const pid = pickPersonaForField();
  const kw = topKeywordsFor(pid);
  const br = topBrandsFor(pid);
  const lines = [];
  
  if(kw.fav.length) lines.push(`핵심 관심 키워드: ${kw.fav.slice(0,3).join(', ')}`);
  if(br.fav.length) lines.push(`선호 브랜드: ${br.fav.join(', ')}`);
  if(kw.low.length) lines.push(`거부감/관심 낮음: ${kw.low.slice(0,2).join(', ')}`);
  if(br.low.length) lines.push(`비선호 브랜드: ${br.low.join(', ')}`);
  
  const txt = lines.length? lines.join(' · ') : '명확한 테마가 드러나지 않습니다. 샘플을 더 수집해 보세요.';
  const out = document.getElementById('fieldThemeText'); 
  out.textContent = txt;
  document.getElementById('fieldTheme').style.display='block';
}

function bindFieldUI(){
  const gen = document.getElementById('btnGenField'); 
  if(gen) gen.addEventListener('click', renderFieldQuotes);
  
  const th = document.getElementById('btnFieldTheme'); 
  if(th) th.addEventListener('click', renderFieldTheme);
  
  const sel1 = document.getElementById('fieldPersonaSelect'); 
  if(sel1) sel1.addEventListener('change', ()=>{ 
    document.getElementById('fieldQuotes').innerHTML=''; 
    document.getElementById('fieldTheme').style.display='none';
  });
  
  const sel2 = document.getElementById('fieldCount'); 
  if(sel2) sel2.addEventListener('change', ()=>{ 
    document.getElementById('fieldQuotes').innerHTML=''; 
    document.getElementById('fieldTheme').style.display='none';
  });
}

// 신조어 섹션 UI 바인딩 (더 이상 필요하지 않음 - 자동 동기화됨)
function bindBuzzwordUI(){
  // 이 함수는 더 이상 필요하지 않습니다.
  // 페르소나 선택은 주요 타겟 페르소나 분석에서만 이루어지고,
  // 신조어 분석은 자동으로 동기화됩니다.
}

// 초기화
function initPersona(){
  bindVoice();
  bindFieldUI();
  bindBuzzwordUI();
  
  // 초기 신조어 표시
  updatePersonaBuzzwords('P1');
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', initPersona);

// 페르소나별 신조어 데이터
const personaBuzzwords = {
  P1: {
    lifestyle: ['#YOLO', '#FOMO', '#인스타워시', '#트렌디'],
    purchase: ['#스냅딜', '#리뷰어', '#언박싱', '#핫딜']
  },
  P2: {
    lifestyle: ['#워라밸', '#성장', '#효율', '#안정'],
    purchase: ['#가성비', '#리뷰', '#비교', '#신중']
  },
  P3: {
    lifestyle: ['#그린', '#지속가능', '#순환', '#윤리'],
    purchase: ['#친환경', '#공정무역', '#로컬', '#재활용']
  }
}

// 신조어 툴팁 정보 반환
function getBuzzwordTooltip(tag, category) {
  const tooltips = {
    lifestyle: {
      '#YOLO': 'You Only Live Once - 인생은 한 번뿐이니 지금 당장 즐기자',
      '#FOMO': 'Fear Of Missing Out - 놓칠까봐 두려워하는 심리',
      '#인스타워시': 'Instagram Wish - 인스타그램에서 본 것을 사고 싶어하는 욕구',
      '#트렌디': 'Trendy - 최신 트렌드를 따르는 스타일',
      '#워라밸': 'Work-Life Balance - 일과 삶의 균형을 추구하는 가치관',
      '#성장': 'Growth - 지속적인 자기계발과 성장을 중시',
      '#효율': 'Efficiency - 시간과 비용 대비 최적의 결과를 추구',
      '#안정': 'Stability - 안전하고 예측 가능한 선택을 선호',
      '#그린': 'Green - 환경 친화적인 라이프스타일을 추구',
      '#지속가능': 'Sustainable - 장기적으로 지속 가능한 선택을 선호',
      '#순환': 'Circular - 자원의 순환적 활용을 중시',
      '#윤리': 'Ethical - 도덕적이고 윤리적인 가치를 중시'
    },
    purchase: {
      '#스냅딜': 'Snap Deal - 즉석에서 결정하는 구매 행동',
      '#리뷰어': 'Reviewer - 리뷰를 중시하는 구매 성향',
      '#언박싱': 'Unboxing - 제품 개봉 과정을 즐기는 행동',
      '#핫딜': 'Hot Deal - 핫한 할인 상품을 찾아 구매하는 행동',
      '#가성비': 'Cost Performance - 가격 대비 성능을 중시하는 구매 성향',
      '#비교': 'Comparison - 여러 제품을 비교 분석 후 구매',
      '#신중': 'Cautious - 신중하게 검토 후 구매 결정',
      '#친환경': 'Eco-friendly - 환경 친화적 제품을 선호',
      '#공정무역': 'Fair Trade - 공정무역 원칙을 따르는 제품 선호',
      '#로컬': 'Local - 지역 기반 제품을 우선 고려',
      '#재활용': 'Recycled - 재활용 소재나 제품을 선호'
    }
  };
  
  return tooltips[category]?.[tag] || `${tag} - 상세 정보를 확인하려면 클릭하세요`;
}

// 신조어 상세 정보 모달 표시
function showBuzzwordDetail(tag, category) {
  const modal = document.getElementById('buzzwordModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  
  if (!modal || !modalTitle || !modalContent) return;
  
  modalTitle.textContent = `${tag} 상세 분석`;
  
  const tooltip = getBuzzwordTooltip(tag, category);
  const analysis = getBuzzwordAnalysis(tag, category);
  
  modalContent.innerHTML = `
    <div class="buzzword-detail">
      <div class="detail-section">
        <h5>📖 의미</h5>
        <p>${tooltip}</p>
      </div>
      <div class="detail-section">
        <h5>🎯 마케팅 활용</h5>
        <p>${analysis.marketing}</p>
      </div>
      <div class="detail-section">
        <h5>📊 소비자 행동</h5>
        <p>${analysis.behavior}</p>
      </div>
      <div class="detail-section">
        <h5>💡 전략적 제안</h5>
        <p>${analysis.strategy}</p>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
}

// 신조어 모달 닫기
function closeBuzzwordModal() {
  const modal = document.getElementById('buzzwordModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// 신조어 분석 데이터 반환
function getBuzzwordAnalysis(tag, category) {
  const analysis = {
    '#YOLO': {
      marketing: '즉흥적이고 감성적인 마케팅 메시지, 한정판이나 특별한 경험 강조',
      behavior: '충동구매 성향, 감정적 의사결정, SNS 공유 욕구가 높음',
      strategy: 'FOMO 마케팅, 한정성, 독점성 강조, 감정적 브랜딩'
    },
    '#FOMO': {
      marketing: '한정시간 할인, 선착순 혜택, 독점적 경험 제공',
      behavior: '빠른 의사결정, 경쟁심 자극, 소셜 증명 중시',
      strategy: '실시간 알림, 소셜 증명, 경쟁 요소 도입'
    },
    '#인스타워시': {
      marketing: '시각적으로 매력적인 제품 이미지, 인플루언서 협업',
      behavior: 'SNS 트렌드 추종, 시각적 만족도 중시, 공유 욕구',
      strategy: '인스타그래머블 디자인, 해시태그 마케팅, UGC 활용'
    },
    '#트렌디': {
      marketing: '최신 트렌드 반영, 유명인/인플루언서 활용',
      behavior: '트렌드 민감, 브랜드 인지도 중시, 동료 압박',
      strategy: '트렌드 리더십, 빠른 제품 업데이트, 소셜 미디어 마케팅'
    },
    '#스냅딜': {
      marketing: '즉시 구매 유도, 간단한 구매 프로세스',
      behavior: '빠른 의사결정, 복잡한 정보보다는 직관적 선택',
      strategy: '원클릭 구매, 간소화된 UI/UX, 즉시 혜택 제공'
    },
    '#리뷰어': {
      marketing: '고객 리뷰 강조, 신뢰성 있는 정보 제공',
      behavior: '상세한 정보 수집, 비교 분석, 신중한 구매',
      strategy: '리뷰 시스템 구축, 상세 제품 정보, 비교 도구 제공'
    },
    '#언박싱': {
      marketing: '제품 개봉 경험 강조, 시각적 만족도 극대화',
      behavior: '제품 경험 중시, SNS 공유, 감정적 만족',
      strategy: '프리미엄 패키징, 개봉 경험 디자인, 공유 유도'
    },
    '#핫딜': {
      marketing: '한정시간 할인, 수량 한정, 긴급성 강조',
      behavior: '할인에 민감, 빠른 구매 결정, 경쟁심 자극',
      strategy: '플래시 세일, 카운트다운, 수량 한정 마케팅'
    }
  };
  
  return analysis[tag] || {
    marketing: '해당 신조어에 대한 마케팅 전략을 분석해보세요.',
    behavior: '소비자 행동 패턴을 관찰하고 분석해보세요.',
    strategy: '브랜드에 맞는 맞춤형 전략을 개발해보세요.'
  };
}



// 모달 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
  const modal = document.getElementById('buzzwordModal');
  if (modal && event.target === modal) {
    closeBuzzwordModal();
  }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeBuzzwordModal();
  }
});

// 신조어 업데이트 함수
function updatePersonaBuzzwords(personaId) {
  const buzzwords = personaBuzzwords[personaId];
  if (!buzzwords) return;
  
  // 라이프스타일 신조어 업데이트
  const lifestyleContainer = document.getElementById('lifestyleBuzzwords');
  if (lifestyleContainer) {
    lifestyleContainer.innerHTML = buzzwords.lifestyle.map(tag => 
      `<span class="buzzword-tag ${personaId.toLowerCase()}" data-tooltip="${getBuzzwordTooltip(tag, 'lifestyle')}" data-category="lifestyle" onclick="showBuzzwordDetail('${tag}', 'lifestyle')">${tag}</span>`
    ).join('');
  }
  
  // 구매 신조어 업데이트
  const purchaseContainer = document.getElementById('purchaseBuzzwords');
  if (purchaseContainer) {
    purchaseContainer.innerHTML = buzzwords.purchase.map(tag => 
      `<span class="buzzword-tag ${personaId.toLowerCase()}" data-tooltip="${getBuzzwordTooltip(tag, 'purchase')}" data-category="purchase" onclick="showBuzzwordDetail('${tag}', 'purchase')">${tag}</span>`
    ).join('');
  }
  

}
