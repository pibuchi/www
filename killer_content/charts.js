// ====== SVG Chart Helpers ======
const px = (n)=>`${n}`;

function mountSVG(target, w=600, h=220, preserveAspectRatio='none'){
  let el;
  if (typeof target === 'string') {
    el = document.getElementById(target);
  } else {
    el = target;
  }
  
  if (!el) {
    console.error('Target element not found:', target);
    return null;
  }
  
  el.innerHTML='';
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`); 
  svg.setAttribute('preserveAspectRatio',preserveAspectRatio);
  el.appendChild(svg); 
  return svg;
}

function axisX(svg, x0, y, w, labels){
  const g = document.createElementNS(svg.namespaceURI,'g'); 
  g.setAttribute('class','axis');
  const line = document.createElementNS(svg.namespaceURI,'line'); 
  line.setAttribute('x1',x0); line.setAttribute('y1',y); 
  line.setAttribute('x2',x0+w); line.setAttribute('y2',y); 
  line.setAttribute('stroke','#1e1e22'); 
  g.appendChild(line);
  
  // 각 라벨을 해당 막대의 중앙에 위치시키기 위해 수정
  const step = w/labels.length;
  labels.forEach((lb,i)=>{
    const t=document.createElementNS(svg.namespaceURI,'text'); 
    t.setAttribute('x',x0+i*step + step/2); t.setAttribute('y',y+14); 
    t.setAttribute('text-anchor','middle'); t.textContent=lb; 
    t.setAttribute('fill','#b7b7c7'); 
    t.setAttribute('font-size','12');
    t.setAttribute('font-weight','500');
    g.appendChild(t); 
  });
  svg.appendChild(g);
}

function axisY(svg, x, y0, h, ticks=[0,25,50,75,100]){
  const g = document.createElementNS(svg.namespaceURI,'g'); 
  g.setAttribute('class','axis');
  ticks.forEach(tk=>{ 
    const yy = y0 - (tk/100)*h; 
    const l=document.createElementNS(svg.namespaceURI,'line'); 
    l.setAttribute('x1',x); l.setAttribute('y1',yy); 
    l.setAttribute('x2',x+4); l.setAttribute('y2',yy); 
    l.setAttribute('stroke','#1e1e22'); 
    g.appendChild(l);
    
    const tx=document.createElementNS(svg.namespaceURI,'text'); 
    tx.setAttribute('x',x-8); tx.setAttribute('y',yy+4); 
    tx.setAttribute('text-anchor','end'); tx.textContent=tk; 
    tx.setAttribute('fill','#b7b7c7'); 
    tx.setAttribute('font-size','11');
    tx.setAttribute('font-weight','500');
    g.appendChild(tx);
    
    const grid=document.createElementNS(svg.namespaceURI,'line'); 
    grid.setAttribute('x1',x); grid.setAttribute('y1',yy); 
    grid.setAttribute('x2',x+500); grid.setAttribute('y2',yy); 
    grid.setAttribute('stroke','#1e1e22'); 
    grid.setAttribute('opacity','0.3'); 
    grid.setAttribute('stroke-width','0.5');
    svg.appendChild(grid);
  });
  svg.appendChild(g);
}

function drawLineChart(target, labels, datasets, unit=''){
  const w=600,h=220,pad={l:46,r:16,t:12,b:28};
  const svg = mountSVG(target,w,h);
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  const plotW=w-pad.l-pad.r, plotH=h-pad.t-pad.b;
  
  // 단위 정보 추가 (Y축 왼쪽)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', pad.l - 8);
    unitText.setAttribute('y', pad.t + 15);
    unitText.setAttribute('text-anchor', 'end');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  axisX(svg,pad.l,pad.t+plotH,plotW,labels); 
  axisY(svg,pad.l,pad.t,plotH);
  
  datasets.forEach(ds=>{
    const max=100; 
    const step=plotW/(labels.length-1);
    const points = ds.data.map((v,i)=>[pad.l+i*step, pad.t + plotH - (v/max)*plotH]);
    const path = document.createElementNS(svg.namespaceURI,'path');
    const d = points.map((p,i)=> (i? 'L':'M')+p[0]+','+p[1]).join(' ');
    path.setAttribute('d',d); path.setAttribute('fill','none'); 
    path.setAttribute('stroke',ds.color); path.setAttribute('stroke-width',ds.strokeWidth||2);
    svg.appendChild(path);
    
    points.forEach(p=>{ 
      const c=document.createElementNS(svg.namespaceURI,'circle'); 
      c.setAttribute('cx',p[0]); c.setAttribute('cy',p[1]); 
      c.setAttribute('r',2.2); c.setAttribute('fill',ds.color); 
      svg.appendChild(c); 
    });
  });
}

function drawBarChart(target, labels, values, color, unit=''){
  const w=600,h=220,pad={l:40,r:16,t:12,b:28};
  const svg = mountSVG(target,w,h); 
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  const plotW=w-pad.l-pad.r, plotH=h-pad.t-pad.b;
  
  // 단위 정보 추가 (Y축 왼쪽)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', pad.l - 8);
    unitText.setAttribute('y', pad.t + 15);
    unitText.setAttribute('text-anchor', 'end');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  axisX(svg,pad.l,pad.t+plotH,plotW,labels); 
  axisY(svg,pad.l,pad.t,plotH);
  
  const max=Math.max(...values)*1.1; 
  const bw=plotW/values.length*0.6; 
  const gap=plotW/values.length*0.4;
  
  values.forEach((v,i)=>{ 
    const x=pad.l + i*(bw+gap); 
    const bh=(v/max)*plotH; 
    const rect = document.createElementNS(svg.namespaceURI,'rect'); 
    rect.setAttribute('x',x); rect.setAttribute('y',pad.t+plotH-bh); 
    rect.setAttribute('width',bw); rect.setAttribute('height',bh); 
    rect.setAttribute('fill',color); 
    svg.appendChild(rect); 
    
    // 수치 라벨 추가
    if (v > 0) {
      const text = document.createElementNS(svg.namespaceURI, 'text');
      text.setAttribute('x', x + bw/2);
      text.setAttribute('y', pad.t + plotH - bh - 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', 'bold');
      text.textContent = v;
      svg.appendChild(text);
    }
  });
}

// 누적 막대형 차트와 총합 추이 라인을 함께 그리는 함수
function drawStackedBarWithLineChart(target, labels, datasets, totalData, totalColor='#ff6b6b', unit=''){
  const w=600,h=220,pad={l:60,r:40,t:30,b:40};
  const svg = mountSVG(target,w,h);
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  const plotW=w-pad.l-pad.r, plotH=h-pad.t-pad.b;
  
  // 단위 정보 추가 (Y축 왼쪽)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', pad.l - 8);
    unitText.setAttribute('y', pad.t + 15);
    unitText.setAttribute('text-anchor', 'end');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  // X축과 Y축 그리기
  axisX(svg,pad.l,pad.t+plotH,plotW,labels); 
  axisY(svg,pad.l,pad.t,plotH);
  
  // 데이터 정규화를 위한 최대값 계산
  const maxValue = Math.max(...totalData) * 1.1;
  
  // 막대 너비와 간격 계산 - 정확한 중앙 정렬을 위해 수정
  const barWidth = plotW/labels.length * 0.7;
  const barGap = plotW/labels.length * 0.3;
  const barStart = pad.l + (plotW/labels.length - barWidth) / 2;
  
  // 각 분기별로 누적 막대 그리기
  labels.forEach((label, i) => {
    let currentY = pad.t + plotH; // 막대 시작 Y 위치
    const barX = barStart + i * (plotW/labels.length);
    
    datasets.forEach((dataset, j) => {
      const value = dataset.data[i] || 0;
      const barHeight = (value / maxValue) * plotH;
      
      if (barHeight > 0) {
        const rect = document.createElementNS(svg.namespaceURI, 'rect');
        rect.setAttribute('x', barX);
        rect.setAttribute('y', currentY - barHeight);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', barHeight);
        rect.setAttribute('fill', dataset.color);
        rect.setAttribute('stroke', '#1e1e22');
        rect.setAttribute('stroke-width', '0.5');
        svg.appendChild(rect);
        
        // 수치 라벨 추가 (누적 막대용)
        if (value > 0) {
          const text = document.createElementNS(svg.namespaceURI, 'text');
          text.setAttribute('x', barX + barWidth/2);
          text.setAttribute('y', currentY - barHeight/2);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('fill', '#ffffff');
          text.setAttribute('font-size', '10');
          text.setAttribute('font-weight', 'bold');
          text.textContent = value;
          svg.appendChild(text);
        }
        
        currentY -= barHeight; // 다음 세그먼트를 위한 Y 위치 업데이트
      }
    });
  });
  
  // 총합 추이 라인 그리기 - 막대 중앙에 정확히 위치하도록 수정
  if (totalData && totalData.length > 0) {
    const step = plotW / labels.length;
    const points = totalData.map((v, i) => [
      barStart + i * (plotW/labels.length) + barWidth/2, 
      pad.t + plotH - (v / maxValue) * plotH
    ]);
    
    // 라인 그리기
    const path = document.createElementNS(svg.namespaceURI, 'path');
    const d = points.map((p, i) => (i ? 'L' : 'M') + p[0] + ',' + p[1]).join(' ');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', totalColor);
    path.setAttribute('stroke-width', 3);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
    
    // 포인트 그리기
    points.forEach(p => {
      const circle = document.createElementNS(svg.namespaceURI, 'circle');
      circle.setAttribute('cx', p[0]);
      circle.setAttribute('cy', p[1]);
      circle.setAttribute('r', 4);
      circle.setAttribute('fill', totalColor);
      circle.setAttribute('stroke', '#1e1e22');
      circle.setAttribute('stroke-width', '1');
      svg.appendChild(circle);
    });
  }
}

function drawDonutChart(target, labels, values, colors, unit=''){
  const w=600,h=220, cx=180, cy=110, r=70, sw=22;
  const svg=mountSVG(target,w,h);
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  // 단위 정보 추가 (차트 상단)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', cx);
    unitText.setAttribute('y', 20);
    unitText.setAttribute('text-anchor', 'middle');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  const sum=values.reduce((a,b)=>a+b,0); 
  let angle=-Math.PI/2;
  
  values.forEach((val,i)=>{
    const frac=val/sum; 
    const a2=angle+frac*2*Math.PI;
    const x1=cx+r*Math.cos(angle), y1=cy+r*Math.sin(angle);
    const x2=cx+r*Math.cos(a2), y2=cy+r*Math.sin(a2);
    const large= (a2-angle)>Math.PI?1:0;
    const path=document.createElementNS(svg.namespaceURI,'path');
    const d=[`M ${x1} ${y1}`,`A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`].join(' ');
    path.setAttribute('d',d); path.setAttribute('fill','none'); 
    path.setAttribute('stroke',colors[i]); path.setAttribute('stroke-width',sw); 
    path.setAttribute('stroke-linecap','butt'); 
    svg.appendChild(path);
    angle=a2;
  });
  
  // 간단한 범례
  labels.forEach((lb,i)=>{
    const y=30+i*18; 
    const rect=document.createElementNS(svg.namespaceURI,'rect'); 
    rect.setAttribute('x',330); rect.setAttribute('y',y-10); 
    rect.setAttribute('width',12); rect.setAttribute('height',12); 
    rect.setAttribute('fill',colors[i]); 
    svg.appendChild(rect);
    
    const t=document.createElementNS(svg.namespaceURI,'text'); 
    t.setAttribute('x',350); t.setAttribute('y',y); 
    t.textContent=`${lb} (${values[i]})`; 
    t.setAttribute('fill','#c7c7d7'); t.setAttribute('font-size','12'); 
    svg.appendChild(t); 
  });
}

function drawRadarChart(target, labels, values, color, unit=''){
  const w=600,h=240,cx=w/2,cy=h/2,r=80; 
  const svg=mountSVG(target,w,h,'xMidYMid meet');
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  // 단위 정보 추가 (차트 상단)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', cx);
    unitText.setAttribute('y', 20);
    unitText.setAttribute('text-anchor', 'middle');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  // grid
  for(let k=1;k<=4;k++){
    const rr=r*k/4; 
    const g=document.createElementNS(svg.namespaceURI,'polygon');
    const pts=labels.map((_,i)=>{ 
      const a=(-Math.PI/2)+i*(2*Math.PI/labels.length); 
      return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)]; 
    });
    g.setAttribute('points', pts.map(p=>p.join(',')).join(' ')); 
    g.setAttribute('fill','none'); 
    // 그리드 색상을 더 부드럽게 설정
    const opacity = 0.3 + (k/4) * 0.2;
    g.setAttribute('stroke',`rgba(31,31,38,${opacity})`); 
    g.setAttribute('stroke-width', k === 4 ? '1.5' : '1');
    svg.appendChild(g);
  }
  
  // axes labels
  labels.forEach((lb,i)=>{ 
    const a=(-Math.PI/2)+i*(2*Math.PI/labels.length); 
    const tx=cx+(r+25)*Math.cos(a); 
    const ty=cy+(r+25)*Math.sin(a); 
    const t=document.createElementNS(svg.namespaceURI,'text'); 
    t.setAttribute('x',tx); t.setAttribute('y',ty); 
    t.setAttribute('text-anchor','middle'); t.setAttribute('fill','#c9c9d9'); 
    t.setAttribute('font-size','11'); t.textContent=lb; 
    // 텍스트 위치 미세 조정
    if(Math.abs(Math.cos(a)) < 0.1) { // 수직에 가까운 경우
      t.setAttribute('text-anchor','middle');
    } else if(Math.cos(a) > 0) { // 오른쪽
      t.setAttribute('text-anchor','start');
      t.setAttribute('x', tx + 8);
    } else { // 왼쪽
      t.setAttribute('text-anchor','end');
      t.setAttribute('x', tx - 8);
    }
    svg.appendChild(t); 
  });
  
  // data polygon
  const pts=values.map((v,i)=>{ 
    const a=(-Math.PI/2)+i*(2*Math.PI/labels.length); 
    const rr=r*(v/100); 
    return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)]; 
  });
  const poly=document.createElementNS(svg.namespaceURI,'polygon'); 
  poly.setAttribute('points',pts.map(p=>p.join(',')).join(' ')); 
  poly.setAttribute('fill',color+'33'); poly.setAttribute('stroke',color); 
  poly.setAttribute('stroke-width','2'); 
  svg.appendChild(poly);
  
  // 수치 라벨 추가
  values.forEach((v,i)=>{
    const a=(-Math.PI/2)+i*(2*Math.PI/values.length);
    const rr=r*(v/100);
    const tx=cx+rr*Math.cos(a);
    const ty=cy+rr*Math.sin(a);
    
    const text = document.createElementNS(svg.namespaceURI, 'text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', color);
    text.setAttribute('font-size', '10');
    text.setAttribute('font-weight', 'bold');
    text.textContent = v;
    svg.appendChild(text);
  });
}

// color alpha helper (accepts hex or rgb(x,x,x))
function hexA(hexOrRgb, a){
  if(hexOrRgb.startsWith('#')){
    const c = hexOrRgb.substring(1); 
    const bigint = parseInt(c.length===3? c.split('').map(x=>x+x).join(''):c,16);
    const r=(bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255; 
    return `rgba(${r},${g},${b},${a})`;
  }
  if(hexOrRgb.startsWith('rgb')) return hexOrRgb.replace(')',','+a+')').replace('rgb','rgba');
  return hexOrRgb;
}

// 지역별 성장률 차트 (가로 막대)
function drawRegionalChart(target, labels, values, colors, unit=''){
  const w = 600, h = 220, pad = {l: 80, r: 16, t: 20, b: 40};
  const svg = mountSVG(target, w, h);
  
  if (!svg) {
    console.error('Failed to mount SVG for target:', target);
    return;
  }
  
  const plotW = w - pad.l - pad.r, plotH = h - pad.t - pad.b;
  const barHeight = plotH / labels.length * 0.6;
  const barSpacing = plotH / labels.length * 0.4;
  
  // 단위 정보 추가 (차트 상단)
  if (unit) {
    const unitText = document.createElementNS(svg.namespaceURI, 'text');
    unitText.setAttribute('x', w / 2);
    unitText.setAttribute('y', 15);
    unitText.setAttribute('text-anchor', 'middle');
    unitText.setAttribute('fill', '#b7b7c7');
    unitText.setAttribute('font-size', '10');
    unitText.setAttribute('font-weight', '500');
    unitText.textContent = unit;
    svg.appendChild(unitText);
  }
  
  // Y축 (지역명)
  labels.forEach((label, i) => {
    const y = pad.t + i * (plotH / labels.length) + plotH / labels.length / 2;
    
    const text = document.createElementNS(svg.namespaceURI, 'text');
    text.setAttribute('x', pad.l - 8);
    text.setAttribute('y', y + 4);
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('fill', '#c9c9d9');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', '500');
    text.textContent = label;
    svg.appendChild(text);
  });
  
  // X축 (성장률)
  const maxValue = Math.max(...values);
  const xTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue];
  
  xTicks.forEach(tick => {
    const x = pad.l + (tick / maxValue) * plotW;
    const y = pad.t + plotH;
    
    // 그리드 라인
    const gridLine = document.createElementNS(svg.namespaceURI, 'line');
    gridLine.setAttribute('x1', x);
    gridLine.setAttribute('y1', pad.t);
    gridLine.setAttribute('x2', x);
    gridLine.setAttribute('y2', pad.t + plotH);
    gridLine.setAttribute('stroke', '#1e1e22');
    gridLine.setAttribute('opacity', '0.3');
    svg.appendChild(gridLine);
    
    // X축 라벨
    const text = document.createElementNS(svg.namespaceURI, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y + 16);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#b7b7c7');
    text.setAttribute('font-size', '10');
    text.textContent = tick.toFixed(1);
    svg.appendChild(text);
  });
  
  // 막대 차트
  labels.forEach((label, i) => {
    const y = pad.t + i * (plotH / labels.length) + plotH / labels.length / 2 - barHeight / 2;
    const barWidth = (values[i] / maxValue) * plotW;
    
    // 막대
    const bar = document.createElementNS(svg.namespaceURI, 'rect');
    bar.setAttribute('x', pad.l);
    bar.setAttribute('y', y);
    bar.setAttribute('width', barWidth);
    bar.setAttribute('height', barHeight);
    bar.setAttribute('fill', colors[i]);
    bar.setAttribute('rx', '2');
    svg.appendChild(bar);
    
    // 수치 라벨
    const valueText = document.createElementNS(svg.namespaceURI, 'text');
    valueText.setAttribute('x', pad.l + barWidth + 8);
    valueText.setAttribute('y', y + barHeight / 2 + 4);
    valueText.setAttribute('text-anchor', 'start');
    valueText.setAttribute('fill', colors[i]);
    valueText.setAttribute('font-size', '11');
    valueText.setAttribute('font-weight', 'bold');
    valueText.textContent = values[i] + '%';
    svg.appendChild(valueText);
  });
}
