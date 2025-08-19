// 단계별 모듈 관리자
import { initItemSelection } from './item-selection.js';
import { initMarketAnalysis } from './market-analysis.js';
import { initCompetitionAnalysis } from './competition-analysis.js';
import { initTrendAnalysis } from './trend-analysis.js';
import { initTargetSelection } from './target-selection.js';
import { initPositioning } from './positioning.js';
import { initMarketingStrategy } from './marketing-strategy.js';
import { initImplementation } from './implementation.js';

export function initModules() {
    console.log('단계별 모듈 초기화 시작...');
    
    // 각 단계별 모듈 초기화
    initItemSelection();
    initMarketAnalysis();
    initCompetitionAnalysis();
    initTrendAnalysis();
    initTargetSelection();
    initPositioning();
    initMarketingStrategy();
    initImplementation();
    
    console.log('모든 단계별 모듈 초기화 완료');
}
