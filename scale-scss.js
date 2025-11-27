const fs = require('fs');
const path = require('path');

// 비주얼 파일 제외 목록
const excludeFiles = ['_visual.scss'];

// SCSS 파일들이 있는 디렉토리
const scssDir = path.join(__dirname, 'src', 'scss', 'pages');

// px 값을 85%로 변환하는 함수
function scaleValue(value) {
  // px 단위 값 추출
  const pxMatch = value.match(/(\d+\.?\d*)\s*px/);
  if (pxMatch) {
    const numValue = parseFloat(pxMatch[1]);
    const scaled = numValue * 0.85;
    // 소수점이 0이면 정수로, 아니면 소수점 2자리까지
    const result = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(2);
    return value.replace(/(\d+\.?\d*)\s*px/g, `${result}px`);
  }
  return value;
}

// SCSS 파일 처리 함수
function processScssFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  
  // 변환할 속성들
  const properties = [
    'font-size',
    'padding',
    'margin',
    'gap',
    'line-height',
    'width',
    'height',
    'max-width',
    'min-width',
    'max-height',
    'min-height',
    'top',
    'bottom',
    'left',
    'right',
    'border-radius',
    'border-width',
    'outline-width',
    'box-shadow', // shadow의 blur, spread 값도 조정
  ];
  
  // 각 속성에 대해 변환
  properties.forEach(prop => {
    // SCSS 속성 매칭 (예: font-size: 24px; 또는 padding: 20px 24px;)
    const regex = new RegExp(`(${prop.replace(/-/g, '\\-')}\\s*:\\s*)([^;]+)(;)`, 'gi');
    
    modified = modified.replace(regex, (match, prefix, value, suffix) => {
      // 여러 값이 있는 경우 (예: padding: 20px 24px)
      const values = value.split(/\s+/).map(v => scaleValue(v.trim())).join(' ');
      return prefix + values + suffix;
    });
  });
  
  // box-shadow 특별 처리 (여러 값이 있을 수 있음)
  modified = modified.replace(/box-shadow\s*:\s*([^;]+);/gi, (match, shadowValue) => {
    const parts = shadowValue.split(/\s+/).map(part => {
      // offset-x, offset-y는 그대로, blur, spread는 85%
      if (part.match(/\d+\.?\d*\s*px/)) {
        return scaleValue(part);
      }
      return part;
    });
    return `box-shadow: ${parts.join(' ')};`;
  });
  
  // 백업 파일 생성
  const backupPath = filePath + '.backup';
  fs.writeFileSync(backupPath, content, 'utf8');
  console.log(`백업 생성: ${backupPath}`);
  
  // 수정된 내용 저장
  fs.writeFileSync(filePath, modified, 'utf8');
  console.log(`변환 완료: ${path.basename(filePath)}`);
}

// 모든 SCSS 파일 처리
function processAllScssFiles() {
  const files = fs.readdirSync(scssDir);
  
  files.forEach(file => {
    if (file.endsWith('.scss') && !excludeFiles.includes(file)) {
      const filePath = path.join(scssDir, file);
      console.log(`\n처리 중: ${file}`);
      processScssFile(filePath);
    }
  });
  
  console.log('\n✅ 모든 파일 변환 완료!');
  console.log('백업 파일들은 .backup 확장자로 저장되었습니다.');
}

// 실행
processAllScssFiles();

