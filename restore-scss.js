const fs = require('fs');
const path = require('path');

// SCSS 파일들이 있는 디렉토리
const scssDir = path.join(__dirname, 'src', 'scss', 'pages');

// 백업 파일로 복원하는 함수
function restoreFromBackup() {
  const files = fs.readdirSync(scssDir);
  let restoredCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.backup')) {
      const backupPath = path.join(scssDir, file);
      // .backup 확장자 제거하여 원본 파일명 생성
      const originalFile = file.replace('.backup', '');
      const originalPath = path.join(scssDir, originalFile);
      
      // 백업 파일 읽기
      const backupContent = fs.readFileSync(backupPath, 'utf8');
      
      // 원본 파일에 복원
      fs.writeFileSync(originalPath, backupContent, 'utf8');
      console.log(`✅ 복원 완료: ${originalFile}`);
      restoredCount++;
    }
  });
  
  if (restoredCount === 0) {
    console.log('⚠️  복원할 백업 파일이 없습니다.');
  } else {
    console.log(`\n✅ 총 ${restoredCount}개 파일 복원 완료!`);
  }
}

// 실행
restoreFromBackup();


