// 각 기능의 현재 값을 한곳에 모아 이벤트 → 상태 변경 → 화면 업데이트를 추적합니다.
const STATE = {
  theme: 'light',
  menuOpen: false,
  projects: { status: 'idle', items: [], filter: '전체', error: '' },
  form: { errors: {}, submitted: false }
};
