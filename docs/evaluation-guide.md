# 평가표 설명 가이드

이 문서는 평가표의 질문 15개와 보너스 1개를 **직접 시연하고 설명하기 위한 대본**이다. 각 질문의 판정 칸은 실제 시연 후 평가자가 표시한다. 코드 발췌는 이 저장소의 파일에서 가져왔으며, 줄 번호보다 파일명과 선택자·함수 이름으로 찾는 편이 수정에 안전하다.

## 먼저 알아둘 세 가지

- **HTML**은 콘텐츠의 의미와 순서를 정한다. `header`, `main`, `section` 같은 태그가 예다.
- **CSS**는 그 콘텐츠의 모양과 배치를 정한다. 화면 크기와 테마에 따라 다른 규칙을 적용할 수 있다.
- **JavaScript**는 클릭·입력·네트워크 응답을 받아 데이터를 바꾸고, 그 결과를 화면에 반영한다. 이 문서에서 말하는 **상태**는 지금 화면을 결정하는 값이다. **렌더링**은 그 값을 실제 DOM·속성·클래스로 표현하는 과정이다.

> 시연 환경: 최신 Chrome, 로컬 웹 서버 또는 GitHub Pages. GitHub API는 네트워크 및 공개 API 호출 제한의 영향을 받으므로 실패 시 오류·재시도와 배포 시 저장한 목록을 확인한다. 폼은 실제 메시지 전송이 아닌 입력 검증 데모다.

## 항목 1 — 실제 동작

<a id="item-1-1"></a>
### 1-1. 브라우저 창을 줄이면 모바일 레이아웃으로 바뀌는가?

- **확인·판정:** 개발자 도구의 기기 모드 또는 창 크기로 360px, 768px, 1024px 이상을 차례로 확인한다. 가로 넘침 없이 읽히고, 모바일에서 메뉴 버튼이 보이며, 프로젝트 카드 열 수가 공간에 맞게 바뀌면 통과한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 픽셀 너비가 다른 화면에 같은 고정 폭을 쓰면 작은 화면에서 내용이 잘린다. 반응형 웹은 화면의 사용 가능한 너비에 맞춰 배치 규칙을 바꾸는 방식이다. `meta viewport`가 없으면 모바일 브라우저가 가상의 넓은 화면으로 페이지를 축소해 보여줄 수 있다.
- **숙련:** HTML의 viewport 설정과 CSS의 좁은 화면 기본 규칙을 먼저 적용한다. `min-width: 768px`와 `min-width: 1024px`에서 넓은 화면의 간격·배치를 더한다. 프로젝트 카드에는 Grid의 `auto-fit`·`minmax()`를 사용해 남는 공간에 맞춰 열을 만든다.
- **고급(실무):** 브레이크포인트는 특정 기기명이 아니라 내용이 더 넓은 배치를 견딜 수 있는 지점이다. 텍스트 확대, 긴 저장소 이름, 키보드 탐색, 320px 안팎의 좁은 화면도 확인한다. 반응형은 배치뿐 아니라 터치 가능한 버튼 크기와 읽기 순서까지 포함한다.
- **코드 근거:** `index.html`의 `<meta name="viewport" content="width=device-width, initial-scale=1" />`, `css/style.css`의 모바일 기본 규칙·미디어 쿼리·`.project-grid`를 함께 찾는다. CSS 발췌는 아래 *실제 코드 발췌 모음* A를 본다.
- **말로 설명하기:** “작은 화면을 기본으로 한 열 배치를 만들고, 768px과 1024px부터 공간에 맞는 규칙을 더했습니다. 카드 열은 Grid가 너비에 따라 자동 조절합니다.”
- **추가 질문:** “왜 모바일 우선인가요?” → 좁은 화면에서 핵심 콘텐츠와 순서를 먼저 확보하고, 넓어질 때만 레이아웃을 확장하기 쉽기 때문이다.

<a id="item-1-2"></a>
### 1-2. 테마 버튼으로 다크·라이트가 바뀌고 새로고침 후에도 유지되는가?

- **확인·판정:** 테마 버튼을 누른 뒤 배경·글자·버튼 색이 바뀌는지 보고 새로고침한다. 선택한 테마가 유지되면 통과한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 버튼의 클릭은 이벤트다. `localStorage`는 같은 브라우저에서 새로고침해도 남는 작은 문자열 저장 공간이다. CSS 변수는 여러 요소가 같은 색 값을 참조하게 해 준다.
- **숙련:** 클릭 핸들러가 테마 상태를 변경하고, 렌더 함수가 루트 요소의 `data-theme`과 버튼의 접근성 속성을 갱신한다. 새로고침 시 저장된 값을 읽어 초기 상태를 결정한다. `[data-theme="dark"]`의 변수값이 전체 색에 적용된다.
- **고급(실무):** 저장 값이 예상 밖의 문자열일 수 있으므로 허용 값만 받아들이는 편이 안전하다. `localStorage` 접근이 제한된 환경도 고려할 수 있다. `aria-pressed`와 버튼 이름은 색 변화를 볼 수 없는 사용자에게 현재 상태와 다음 동작을 알려 준다. 초기 테마 적용 시 화면이 순간적으로 깜박이는지 살핀다.
- **코드 근거:** `js/state.js`, `js/ui.js`, `css/style.css`의 `[data-theme="dark"]`를 이어서 본다. 발췌 모음 B.
- **말로 설명하기:** “클릭으로 테마 상태를 바꾸고, 그 상태를 `data-theme` 속성과 저장소에 동시에 반영합니다. CSS 변수 덕분에 속성 하나로 사이트의 색을 전환합니다.”
- **추가 질문:** “새로고침 후 왜 남나요?” → 메모리 변수는 초기화되지만 `localStorage`의 문자열을 시작할 때 다시 읽기 때문이다.

<a id="item-1-3"></a>
### 1-3. 햄버거 메뉴·스크롤 애니메이션·맨 위로 버튼이 동작하는가?

- **확인·판정:** 모바일에서 메뉴를 열고 닫아 링크를 누른다. 스크롤해 섹션 노출 효과, 헤더 배경 변화, 맨 위로 버튼 표시를 본다. 버튼을 눌러 맨 위에 도달하면 통과한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** `classList`는 요소에 CSS 클래스 이름을 붙이거나 떼는 기능이다. 스크롤 위치는 화면을 얼마나 내렸는지 나타낸다. `IntersectionObserver`는 요소가 화면에 들어오는 때를 알려 준다.
- **숙련:** 메뉴 클릭 → 열림 상태와 클래스 변경 → CSS가 메뉴를 표시한다. 링크는 해당 섹션 ID로 이동하며 CSS의 부드러운 스크롤 규칙이 이동을 표현한다. 스크롤 이벤트는 헤더와 맨 위로 버튼을 갱신하고, 관찰자는 섹션의 노출 클래스를 붙인다.
- **고급(실무):** `aria-expanded`를 메뉴 표시와 동기화하고 메뉴 링크 선택 후 닫는다. 애니메이션을 줄이도록 설정한 사용자에게는 `prefers-reduced-motion`을 존중한다. 스크롤 이벤트에서 복잡한 DOM 계산을 반복하지 않도록 한다. `IntersectionObserver`는 매번 스크롤 위치를 직접 계산하는 것보다 선언적인 관찰 방식이다.
- **코드 근거:** `index.html`의 `.menu-toggle`, `.back-to-top`, `.reveal`; `js/ui.js`; `css/style.css`의 스크롤·모션 규칙. 발췌 모음 C.
- **말로 설명하기:** “메뉴 클릭과 스크롤은 각각 이벤트로 받고, 클래스와 ARIA 속성을 바꿔 화면에 반영합니다. 섹션 애니메이션은 Intersection Observer가 진입 시점을 알려 줍니다.”
- **추가 질문:** “맨 위 버튼은 언제 나타나나요?” → README와 `js/ui.js`에 적힌 스크롤 기준을 넘었을 때다.

<a id="item-1-4"></a>
### 1-4. GitHub API 데이터와 로딩·오류·빈 상태가 구분되는가?

- **확인·판정:** 정상 네트워크에서 Projects의 로딩 문구가 카드로 바뀌는지 본다. GitHub API 403을 모의해 오류·재시도 버튼과 저장 목록의 카드가 함께 나오는지 확인한다. 빈 데이터는 빈 응답을 모의해 확인한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** API는 다른 서비스의 데이터를 정해진 주소로 요청하는 창구다. `fetch()`는 요청이 끝나기를 기다리는 비동기 작업이다. 기다리는 동안에는 로딩을, 실패하면 오류를, 성공했지만 항목이 없으면 빈 상태를 보여줘야 사용자가 상황을 이해한다.
- **숙련:** 요청 시작 → `loading`; 응답과 JSON 변환 → `success` 또는 `empty`; 네트워크 오류나 비정상 HTTP 응답 → `error` 순서로 상태를 바꾼다. 오류 때는 `data/repos.json`을 추가로 읽어 저장된 카드도 표시한다. 매 상태 변경 후 렌더 함수가 문구·카드·재시도 버튼을 갱신한다.
- **고급(실무):** `fetch()`는 403·404 같은 HTTP 실패에서 자동으로 `catch`로 가지 않으므로 `response.ok`를 확인해야 한다. GitHub의 비인증 한도는 출발지 IP 기준이라 본인의 호출이 60회 미만이어도 403이 가능하다. 배포에서 인증된 요청으로 저장 목록을 갱신하지만 화면의 저장 목록은 배포 시점 데이터다. API 문자열은 `textContent`로 안전하게 출력한다.
- **코드 근거:** `js/projects.js`의 요청·상태·렌더 함수, `scripts/snapshot-repos.cjs`, `.github/workflows/pages.yml`, `index.html`의 `#project-status`·`#project-grid`. 발췌 모음 D.
- **말로 설명하기:** “API를 기다리는 동안 로딩, 정상 데이터는 카드, 빈 배열은 빈 상태로 표시합니다. 403이면 오류와 재시도 버튼을 보여 주면서 마지막 배포 목록의 카드도 표시합니다.”
- **추가 질문:** “내가 60회 호출하지 않았는데 왜 403인가요?” → 비인증 한도는 사용자 계정이 아니라 출발지 IP 단위라 같은 IP의 다른 요청과 합산된다. “403은 `catch`가 잡나요?” → `fetch`의 응답 자체는 도착하므로 `response.ok` 검사 뒤 직접 오류로 전환한다.

<a id="item-1-5"></a>
### 1-5. 필수값과 이메일 오류를 즉시 표시하는가?

- **확인·판정:** 이름·이메일·메시지를 비우고 제출한다. 잘못된 이메일을 입력하고 필드 근처의 오류를 본다. 올바른 값을 입력하고 제출하면 페이지 이동 없이 초록색 “제출 성공!” 메시지가 보이는지 확인한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 유효성 검사는 입력이 목적에 맞는지 확인하는 일이다. `required`는 필수값의 의미를 주고, `label for`와 입력의 `id`가 같으면 제목과 입력이 연결된다. 입력 오류는 해당 필드 바로 아래에 있어야 어떤 값을 고쳐야 하는지 알기 쉽다.
- **숙련:** `input` 이벤트마다 입력 상태를 검사하고 필드별 오류 메시지를 렌더링한다. `submit` 이벤트에서는 `preventDefault()`로 페이지 이동을 막고 전체 필드를 다시 검사한다. 모두 유효하면 `STATE.form.submitted`가 `true`가 되고, `renderForm()`이 “제출 성공!” 문구와 초록색 성공 스타일을 표시한다.
- **고급(실무):** 이메일 정규식은 형식의 기본 확인일 뿐 실제 주소의 존재를 보증하지 않는다. 실제 전송을 붙인다면 서버에서도 검증해야 한다. `aria-describedby`, `aria-live`, `aria-invalid`로 보조 기술에 오류를 전달한다. 현재 폼은 실제로 메시지를 보내지 않는다.
- **코드 근거:** `index.html`의 `#contact-form`, `label`, `aria-describedby`, `novalidate`; `js/contact.js`. 발췌 모음 E.
- **말로 설명하기:** “입력할 때마다 각 필드를 검사해 바로 아래에 오류를 보여줍니다. 제출 때도 전체 검사를 하고 기본 전송을 막은 다음, 유효한 경우에만 데모 완료 메시지를 표시합니다.”
- **추가 질문:** “왜 `novalidate`를 썼나요?” → 브라우저 기본 팝업 대신 같은 위치와 문구의 사용자 정의 오류 UI를 보여주기 위해서다.

## 항목 2 — 구조와 기초 개념

<a id="item-2-1"></a>
### 2-1. HTML·CSS·JavaScript 파일을 분리했고 역할을 설명할 수 있는가?

- **확인·판정:** `index.html`, `css/style.css`, `js/`의 파일들과 `images/`를 보여주고 각 역할을 설명한다. HTML의 외부 파일 연결이 실제로 작동하면 통과한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** HTML은 내용의 뼈대, CSS는 배치·색, JS는 동작을 맡는다. 한 파일에 전부 섞으면 내용 수정이 동작 수정에 영향을 주기 쉽다. `<link>`는 CSS를, `<script src>`는 JS를 연결한다.
- **숙련:** `index.html`은 섹션·폼·프로젝트 표시 영역을 정의한다. `css/style.css`는 토큰과 반응형 규칙을 담는다. `js/state.js`는 공유 상태, `ui.js`는 화면 공통 상호작용, `projects.js`는 API와 필터, `contact.js`는 폼을 맡는다. `images/`는 프로필 그림을 보관한다. `defer`는 HTML 분석을 막지 않고 스크립트를 문서 분석 뒤에 실행한다.
- **고급(실무):** 역할별 분리는 변경 범위를 줄이고 기능별 디버깅을 쉽게 한다. 여러 `defer` 스크립트가 공유 상태에 의존한다면 HTML의 로드 순서도 계약이 된다. 프레임워크나 번들러가 없어도 파일 책임과 명명은 명확해야 한다.
- **코드 근거:** `index.html`의 다음 연결이 기준이다.

  ```html
  <link rel="stylesheet" href="css/style.css" />
  <script src="js/state.js" defer></script>
  <script src="js/ui.js" defer></script>
  <script src="js/projects.js" defer></script>
  <script src="js/contact.js" defer></script>
  ```

  첫 줄은 모양을, 나머지는 상태·일반 UI·API·폼 동작을 각각 불러온다.
- **말로 설명하기:** “HTML은 의미와 콘텐츠, CSS는 표현, JS는 동작으로 나눴습니다. JS도 상태, 일반 UI, 프로젝트, 폼별로 역할을 나눠서 찾기 쉽게 했습니다.”
- **추가 질문:** “`defer`가 없으면?” → 스크립트가 HTML을 읽는 중간에 실행되어 아직 없는 요소를 찾거나 문서 표시를 지연할 수 있다.

<a id="item-2-2"></a>
### 2-2. `header`, `nav`, `main`, `section`, `footer`를 어떤 기준으로 골랐는가?

- **확인·판정:** 페이지에서 각 태그를 가리키며 역할을 말하고, 반복 가능한 독립 내용에 `article`을 쓴 위치를 설명한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 시맨틱 태그는 태그 이름 자체가 콘텐츠의 역할을 설명한다. `div`는 의미 없는 묶음이다. `header`는 머리말, `nav`는 이동 링크, `main`은 핵심 내용, `section`은 주제별 영역, `footer`는 바닥 정보를 뜻한다.
- **숙련:** 상단 브랜드와 메뉴는 `header`·`nav`, 핵심 포트폴리오는 하나의 `main`, About·Skills·Projects·Contact는 각자 제목이 있는 `section`이다. 기술 항목처럼 독립적으로 읽히는 반복 콘텐츠는 `article`이다. 섹션에 `aria-labelledby`를 연결해 제목을 명시했다.
- **고급(실무):** 의미 있는 구조는 스크린 리더의 랜드마크 탐색과 검색 엔진의 문서 이해를 돕는다. 태그는 겉모양이 아니라 콘텐츠 역할로 선택한다. `section`을 남발하거나 제목 없는 구획을 만들지 않는다. `nav`는 모든 링크 묶음이 아니라 주요 탐색 링크에 쓴다.
- **코드 근거:** `index.html`의 구조 발췌다.

  ```html
  <header class="site-header" id="top">
    <nav class="nav container" aria-label="주 메뉴">…</nav>
  </header>
  <main id="main">
    <section class="section projects reveal" id="projects" aria-labelledby="projects-title">…</section>
  </main>
  <footer class="site-footer">…</footer>
  ```

  메뉴는 탐색, Projects는 제목이 있는 주제 영역이다. `article.skill-item`은 Skills 안에서 개별 항목이다.
- **말로 설명하기:** “눈에 보이는 위치가 아니라 역할로 태그를 골랐습니다. 주요 이동은 `nav`, 페이지 핵심은 `main`, 제목이 있는 각 주제는 `section`입니다.”
- **추가 질문:** “`section`과 `div` 차이는?” → `section`은 제목이 있는 의미 단위이며, 단순한 스타일용 묶음은 `div`가 적절하다.

<a id="item-2-3"></a>
### 2-3. `:root` CSS 변수로 색·폰트 등을 관리하면 무슨 이점이 있는가?

- **확인·판정:** `:root`의 변수와 사용처를 보여주고 다크 테마에서 값이 어떻게 바뀌는지 설명한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** CSS 사용자 정의 속성은 `--이름: 값`으로 정의하고 `var(--이름)`으로 사용한다. 같은 색을 여러 곳에 직접 반복하는 대신 이름을 통해 공유한다.
- **숙련:** 기본 색·텍스트·배경·간격·폰트를 `:root`에 모아 쓰고, 다크 테마는 `[data-theme="dark"]`에서 같은 변수의 값만 다시 정의한다. 버튼·카드·본문은 변수 이름을 참조하므로 컴포넌트 규칙을 매번 고치지 않아도 테마가 바뀐다.
- **고급(실무):** 토큰 이름은 `--blue-600` 같은 값 중심보다 `--surface`, `--text`처럼 역할 중심이면 테마 변경에 유리하다. 대비가 낮아지는 조합을 시각·도구로 확인해야 한다. CSS 변수는 상속·계산 시점에 따라 동작하므로 범위를 너무 넓게 잡지 않는다.
- **코드 근거:** `css/style.css`의 `:root`, `[data-theme="dark"]`, `var(...)` 사용처. 발췌 모음 F.
- **말로 설명하기:** “공통 색을 변수로 두어서 여러 곳을 한 번에 바꿀 수 있습니다. 다크 모드는 같은 이름의 변수값만 다시 정의해 각 요소의 CSS를 중복 작성하지 않았습니다.”
- **추가 질문:** “일반 JS 변수와 같나요?” → 이름은 비슷하지만 CSS의 값이며, CSS 상속·우선순위·`var()` 규칙에 따라 결정된다.

<a id="item-2-4"></a>
### 2-4. 인라인 `onclick` 대신 `addEventListener`를 쓴 이유는?

- **확인·판정:** HTML 버튼에 `onclick`이 없는지, JS에서 `addEventListener`로 연결했는지 찾는다. 두 방식의 차이를 설명한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 이벤트는 사용자의 클릭·입력 같은 발생 사실이다. `onclick="..."`은 HTML 안에 실행 코드를 섞는다. `addEventListener('click', 함수)`는 JS에서 요소와 함수를 연결한다.
- **숙련:** HTML은 버튼의 목적과 접근성 정보를 갖고, `js/ui.js`가 테마·메뉴 클릭을 연결한다. `js/contact.js`는 `input`·`submit`, `projects.js`는 필터·재시도를 연결한다. 같은 요소에 서로 다른 리스너를 붙일 수도 있다.
- **고급(실무):** HTML과 동작의 책임을 분리하면 테스트·수정이 쉽고, 하나의 `onclick` 속성을 서로 덮어쓸 위험이 적다. 동적 생성 버튼은 생성 직후 리스너를 붙이거나 상위 요소에 이벤트 위임을 할 수 있다. 리스너가 불필요해진 뒤 정리해야 하는 긴 수명 UI도 있다.
- **코드 근거:** `index.html`의 `<button class="theme-toggle" type="button" …>`에는 인라인 핸들러가 없다. `js/ui.js`의 연결은 발췌 모음 G.
- **말로 설명하기:** “HTML에는 버튼의 의미만 두고 JS에서 이벤트를 연결했습니다. 그러면 구조와 동작이 분리되고 같은 요소에 여러 동작을 안전하게 연결할 수 있습니다.”
- **추가 질문:** “리스너는 언제 실행되나요?” → 등록할 때가 아니라 지정한 이벤트가 실제로 발생했을 때 콜백이 실행된다.

## 항목 3 — 코드 흐름과 기술 선택

<a id="item-3-1"></a>
### 3-1. 이벤트 → 상태 변경 → 화면 업데이트 흐름을 추적할 수 있는가?

- **확인·판정:** 테마·API·폼 중 하나를 골라 이벤트 발생부터 상태값, 렌더 함수, 최종 DOM·CSS 변화를 코드에서 짚는다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 화면은 현재 데이터의 결과다. “버튼이 눌렸다”는 이벤트, “다크 모드가 선택됐다”는 상태, “어두운 색이 보인다”는 렌더 결과다. 이 셋을 구분하면 어떤 단계에서 오류가 났는지 찾기 쉽다.
- **숙련:** 테마 버튼은 클릭 → `STATE.theme` 변경 → 테마 렌더 함수 → `data-theme`·버튼 속성 변경이다. 프로젝트는 API 완료 → `status`와 저장소 목록 변경 → 상태 문구·카드 렌더다. 폼은 입력 → 필드 유효성 변경 → 필드 근처 오류 갱신이다.
- **고급(실무):** 상태값을 바꾸는 곳과 DOM을 바꾸는 곳이 여기저기 흩어지면 화면 불일치가 생긴다. 한 상태의 주요 표시를 한 렌더 함수로 모으면 추적과 테스트가 쉽다. 상태와 DOM을 완전히 자동 동기화하는 프레임워크와 달리 여기서는 동기화 호출을 직접 관리해야 한다.
- **코드 근거:** `js/state.js`와 `js/ui.js`의 테마 경로, `js/projects.js`의 요청 경로, `js/contact.js`의 입력 경로. 발췌 모음 B·D·E.
- **말로 설명하기:** “예를 들어 테마 버튼을 누르면 이벤트 핸들러가 상태를 변경하고 렌더 함수가 HTML 속성을 바꿉니다. CSS가 그 속성을 보고 실제 색을 바꿉니다.”
- **추가 질문:** “상태 없이 바로 DOM만 바꾸면 안 되나요?” → 작은 기능은 가능하지만 현재 값을 여러 곳에서 알아야 할 때 기준값이 없어 불일치와 추적 어려움이 생긴다.

<a id="item-3-2"></a>
### 3-2. `async/await`와 `try/catch`로 성공과 실패를 어떻게 처리했는가?

- **확인·판정:** 정상 요청과 네트워크 차단 또는 403 모의 응답을 비교한다. `await`, `response.ok`, `catch` 위치와 UI 변화를 설명한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 네트워크 응답은 바로 오지 않는다. `async` 함수 안의 `await`는 그 비동기 결과를 기다려 다음 줄에서 사용할 수 있게 한다. `try/catch`는 도중에 생긴 예외를 잡아 오류 안내로 바꾼다.
- **숙련:** 요청 전에 로딩 상태로 렌더한다. `await fetch()` 뒤 `response.ok`를 검사하고, 성공 응답만 `await response.json()`으로 읽는다. 배열이 비었으면 빈 상태, 있으면 성공 상태다. 요청 실패·HTTP 실패·JSON 파싱 실패는 `catch`에서 오류 상태로 전환하고 저장 목록을 별도로 읽는다.
- **고급(실무):** `async`는 브라우저 전체를 멈추지 않는다. 저장 목록 조회도 실패하면 오류와 재시도만 남긴다. 배포 스크립트는 인증 토큰을 환경 변수로 받아 공개 데이터만 JSON으로 저장하며, 토큰을 사이트 파일에 넣지 않는다. 저장 목록의 갱신 주기는 배포 주기와 같다.
- **코드 근거:** `js/projects.js`의 API 함수와 상태 렌더. 발췌 모음 D.
- **말로 설명하기:** “`await`로 응답과 JSON을 순서대로 받고, `response.ok`로 403을 직접 검사합니다. `catch`에서는 오류와 재시도를 표시하고 배포에서 저장한 공개 목록을 추가로 불러옵니다.”
- **추가 질문:** “빈 배열은 실패인가요?” → 요청은 성공한 것이므로 오류가 아니라 별도의 빈 상태다.

<a id="item-3-3"></a>
### 3-3. `map()`·`filter()`로 GitHub 데이터를 카드로 만드는 과정을 설명할 수 있는가?

- **확인·판정:** 전체 필터와 특정 언어 필터를 비교한다. 저장소 배열 → 필터링 → 카드 변환 → 화면 삽입 순서를 코드에서 찾는다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 배열은 여러 저장소를 순서대로 담는다. `filter()`는 조건에 맞는 항목만 남긴 **새 배열**을 만들고, `map()`은 각 항목을 카드 데이터나 HTML로 바꾼 **새 배열**을 만든다. 원래 배열을 직접 지우지 않는다.
- **숙련:** API의 저장소 목록을 상태에 보관한다. 선택 언어가 전체가 아니면 `filter()`로 해당 언어만 남기고, `map()`으로 각 저장소의 제목·설명·언어·링크를 카드 표현으로 바꾼다. 필터 버튼을 누르면 원본 데이터에 다시 필터를 적용해 목록을 렌더한다.
- **고급(실무):** `filter()`를 이미 필터된 결과에 반복 적용하면 원본을 잃기 쉽다. 그래서 API 원본 배열을 유지한다. GitHub의 `language`는 `null`일 수 있고, 설명도 비어 있을 수 있어 기본 문구가 필요하다. 외부 문자열을 HTML 문자열에 넣을 때는 반드시 이스케이프하거나 `textContent`로 만든다.
- **코드 근거:** `js/projects.js`의 언어 필터 및 카드 생성. 발췌 모음 H.
- **말로 설명하기:** “원본 저장소 배열은 유지하고, 선택 언어로 `filter()`한 새 배열을 만듭니다. 이어 `map()`으로 각 항목을 카드로 변환해 화면에 넣습니다.”
- **추가 질문:** “`forEach()`와 `map()` 차이는?” → `forEach()`는 각 항목에 대해 동작을 실행하고, `map()`은 변환 결과를 담은 새 배열을 반환한다.

<a id="item-3-4"></a>
### 3-4. Flexbox와 Grid를 어디에 쓰고 왜 골랐는가?

- **확인·판정:** 내비게이션의 로고·링크·버튼 배치와 프로젝트 카드 배치를 확인하고 CSS의 `display: flex`, `display: grid` 위치를 보여준다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** Flexbox는 주로 한 방향의 항목을 가로 또는 세로로 나열하고 간격·정렬을 조절한다. Grid는 행과 열이 함께 있는 칸 구조를 만든다. 둘 다 반응형 배치에 쓸 수 있다.
- **숙련:** 내비게이션은 한 줄에서 로고와 메뉴를 양쪽으로 정렬해야 하므로 Flexbox가 간단하다. 프로젝트는 여러 카드가 열을 만들고 다음 행으로 넘어가므로 Grid의 `repeat(auto-fit, minmax(...))`가 적합하다.
- **고급(실무):** “Flex는 1차원, Grid는 2차원”은 선택 기준이지 절대 규칙은 아니다. 카드 내부처럼 한 방향 정렬이 필요한 곳에서는 Grid 카드 안에 Flex를 함께 쓸 수 있다. 최소 카드 폭을 너무 크게 잡으면 작은 화면에서 가로 넘침이 생긴다.
- **코드 근거:** `css/style.css`의 `.nav`, `.project-grid`. 발췌 모음 A.
- **말로 설명하기:** “헤더는 한 줄 정렬이라 Flexbox, 프로젝트 목록은 여러 행과 열의 카드 배치라 Grid를 썼습니다. Grid의 `auto-fit`과 `minmax()`가 열 수를 자동으로 조절합니다.”
- **추가 질문:** “둘 중 하나로 모두 만들 수 있나요?” → 가능하지만 이 배치에서는 각각이 의도를 더 짧고 분명하게 표현한다.

## 항목 4 — 설계 이유

<a id="item-4-1"></a>
### 4-1. 상태 객체를 따로 만든 이유와 일반 변수만 쓸 때의 차이는?

- **확인·판정:** 상태 객체의 테마·프로젝트·폼 관련 값을 가리키고 이를 읽거나 바꾸는 함수와 렌더 함수의 관계를 설명한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 상태 객체는 화면의 현재 상황을 여러 이름 있는 값으로 묶은 것이다. 예를 들어 테마, 요청 진행 상태, 선택 언어는 서로 다른 값이지만 모두 화면을 바꾼다. 일반 변수도 상태를 저장할 수 있지만 여기저기 흩어지면 한눈에 보기 어렵다.
- **숙련:** 공유 상태는 `js/state.js`에 두고 각 기능 파일이 자신의 값과 렌더 흐름을 맡는다. 테마와 API 상태, 폼 검증 결과는 각각 해당 렌더 함수를 거쳐 화면에 반영한다. 상태를 바꾸기만 하고 렌더를 빠뜨리면 실제 화면은 예전 값으로 남을 수 있음을 보여준다.
- **고급(실무):** 객체에 모았다는 사실만으로 자동 동기화되는 것은 아니다. 상태 변경의 진입점과 렌더 호출을 일관되게 해야 한다. 모든 값을 하나의 거대한 전역 객체에 넣으면 결합도가 높아질 수 있으므로 기능별 책임을 분명히 한다. UI에서 파생할 수 있는 값은 불필요하게 중복 저장하지 않는다.
- **코드 근거:** `js/state.js`의 상태 정의, `js/ui.js`·`projects.js`·`contact.js`의 소비 지점. 발췌 모음 I.
- **말로 설명하기:** “현재 화면을 결정하는 값을 상태 객체로 모아 읽기 쉽게 했습니다. 이벤트가 값을 바꾸고 해당 렌더 함수가 화면을 갱신하는 약속이 핵심입니다.”
- **추가 질문:** “그냥 `let theme`이면 안 되나요?” → 한 값만 있으면 가능하다. 여러 기능의 현재 상태와 전환을 함께 추적해야 할 때 객체가 더 명확하다.

<a id="item-4-2"></a>
### 4-2. 반응형 CSS를 모바일 우선으로 쓴 이유는?

- **확인·판정:** 미디어 쿼리 밖의 기본 규칙과 768px·1024px 이상 규칙을 비교한다. 작은 화면에서 콘텐츠 순서와 사용성을 확인한다. 판정: □ PASS □ FAIL / 실제 결과: __________
- **입문:** 모바일 우선은 먼저 좁은 화면의 기본 스타일을 쓰고, 화면이 커지면 `min-width` 조건으로 규칙을 추가하는 방법이다. 내용의 중요 순서를 작은 공간에서 먼저 결정한다.
- **숙련:** 기본 CSS에서 세로 흐름, 읽기 쉬운 여백, 메뉴 버튼을 제공한다. 768px 이상에서는 섹션 간격과 배치를 넓히고, 1024px 이상에서는 충분한 가로 공간을 활용한다. 카드 Grid의 열 수는 `auto-fit`으로 컨테이너 너비에 따라 바뀐다.
- **고급(실무):** 큰 화면을 축소만 하면 숨겨진 메뉴, 긴 문장, 터치 영역 문제가 생기기 쉽다. 모바일 우선도 실제 콘텐츠가 들어갔을 때 가로 넘침이 없는지 검증해야 한다. 브레이크포인트 사이의 769px 등 중간 크기도 확인한다.
- **코드 근거:** `css/style.css`의 기본 레이아웃과 `@media (min-width: 768px)`, `@media (min-width: 1024px)`. 발췌 모음 A.
- **말로 설명하기:** “모바일에서 필요한 콘텐츠와 읽는 순서를 먼저 잡고, 화면이 넓어질 때만 다열 배치를 추가했습니다. 그래서 좁은 화면에서 중요한 내용이 밀리거나 잘리지 않습니다.”
- **추가 질문:** “태블릿 규칙은 꼭 768px이어야 하나요?” → 이번 과제의 기준값이며, 일반적으로는 콘텐츠가 배치를 바꿀 필요가 생기는 지점으로 결정한다.

<a id="item-5"></a>
## 항목 5 — 보너스: 언어별 프로젝트 필터

- **확인·판정:** 전체, 특정 언어를 차례로 클릭한다. 선택된 버튼의 표시와 카드 수가 바뀌고, 결과가 없을 때 빈 상태가 보이면 보너스 시연 성공이다. 판정: □ 부여 □ 미부여 / 실제 결과: __________
- **입문:** GitHub 저장소마다 대표 언어가 있을 수 있다. 필터는 전체 데이터 중 원하는 언어의 프로젝트만 보여주는 기능이다.
- **숙련:** 사용 가능한 언어로 버튼을 만들고, 클릭 → 선택 언어 상태 변경 → `filter()` → 카드 렌더 순서로 동작한다. 전체를 누르면 원본 배열을 그대로 보여준다.
- **고급(실무):** 언어값이 없는 저장소 처리, 선택 상태의 `aria-pressed`, 필터 결과 수 알림, API 갱신 뒤 사라진 언어 선택을 어떻게 처리할지를 고려한다. 필터는 API를 매번 다시 요청하기보다 이미 받은 배열을 재사용한다.
- **코드 근거:** `index.html`의 `#project-filters`·`#project-count`, `js/projects.js`의 필터 버튼 생성과 `filter()` 사용. 발췌 모음 H.
- **말로 설명하기:** “GitHub 데이터를 한 번 받은 뒤 원본 배열을 보관하고, 버튼을 누를 때 선택 언어로 `filter()`한 결과만 다시 렌더합니다.”
- **추가 질문:** “언어가 없는 저장소는?” → `기타`로 표시하고 전체 보기와 `기타` 필터에서 볼 수 있다.

## 실제 코드 발췌 모음

아래 코드는 구현을 통합한 뒤 실제 파일에서 다시 대조한다. 각 발췌의 이름을 위 질문의 **코드 근거**에서 참조한다.

### A. 반응형·Flexbox·Grid (`css/style.css`)

```css
.nav { position: relative; display: flex; align-items: center; gap: 14px; min-height: 72px; }
.project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 15px; }

@media (min-width: 768px) {
  .menu-toggle { display: none; }
  .project-grid { gap: 18px; }
}
@media (min-width: 1024px) {
  .project-grid { gap: 20px; }
}
```

`auto-fit`은 들어갈 수 있는 열의 수를 자동 결정한다. `minmax(min(100%, 260px), 1fr)`는 카드의 최소 폭을 260px로 두되 컨테이너가 더 좁으면 100%까지 줄여 가로 넘침을 막는다. 브레이크포인트에서는 카드 간격만 넓힌다.

### B. 테마 상태와 렌더 (`js/state.js`, `js/ui.js`, `css/style.css`)

```js
// js/ui.js
const renderTheme = () => {
  document.documentElement.dataset.theme = STATE.theme;
  const isDark = STATE.theme === 'dark';
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
};

themeButton.addEventListener('click', () => {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
  renderTheme();
  try { localStorage.setItem('portfolio-theme', STATE.theme); } catch { /* 저장이 차단되어도 토글은 동작합니다. */ }
});
```

`renderTheme`은 상태를 HTML 속성과 버튼 정보에 반영한다. 초기화할 때 `localStorage.getItem('portfolio-theme')`을 읽고, `css/style.css`의 `:root[data-theme="dark"]`가 테마 변수를 덮어쓴다. 저장소 접근에 실패해도 기본 라이트 테마로 동작한다.

### C. 메뉴·스크롤·노출 (`js/ui.js`)

```js
const renderMenu = () => {
  navLinks.classList.toggle('active', STATE.menuOpen);
  menuButton.setAttribute('aria-expanded', String(STATE.menuOpen));
};
const renderScroll = () => {
  header.classList.toggle('scrolled', window.scrollY >= 60);
  topButton.classList.toggle('visible', window.scrollY >= 300);
};
menuButton.addEventListener('click', () => {
  STATE.menuOpen = !STATE.menuOpen;
  renderMenu();
});
```

메뉴는 클릭을 상태로 바꾼 뒤 표시 클래스와 접근성 속성에 반영한다. 스크롤 기준은 헤더 60px, 맨 위 버튼 300px이다. `css/style.css`의 `.site-header.scrolled`는 배경을 `var(--bg)`에서 `var(--surface-soft)`로 바꾼다. 같은 파일의 `IntersectionObserver`는 `{ threshold: 0.2 }`로 섹션 진입을 관찰하고 `visible` 클래스를 더한다.

### D. API 요청과 네 상태 (`js/projects.js`)

```js
projectState.status = 'loading';
renderProjects();
try {
  const response = await fetch(endpoint, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('프로젝트를 불러올 수 없습니다. GitHub 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.');
    }
    throw new Error(`프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('프로젝트를 불러올 수 없습니다. GitHub 응답 형식이 올바르지 않습니다.');
  projectState.items = data;
  projectState.filter = '전체';
  projectState.status = projectState.items.length ? 'success' : 'empty';
} catch (error) {
  projectState.status = 'error';
  projectState.error = error instanceof Error && error.message.startsWith('프로젝트를 불러올 수 없습니다.')
    ? error.message
    : '프로젝트를 불러올 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.';
  try {
    const snapshot = await fetch('data/repos.json');
    if (!snapshot.ok) throw new Error('저장된 목록을 읽을 수 없습니다.');
    const cachedRepos = await snapshot.json();
    if (!Array.isArray(cachedRepos)) throw new Error('저장된 목록의 형식이 올바르지 않습니다.');
    projectState.items = cachedRepos;
    projectState.filter = '전체';
    projectState.error += ' 마지막 배포에서 저장한 프로젝트를 표시합니다.';
  } catch {
    projectState.items = [];
  }
}
renderProjects();
```

이 발췌는 `loadProjects()`에서 주석을 뺀 실제 코드다. 첫 `fetch`가 라이브 GitHub 데이터이고 두 번째 `fetch`가 배포에 포함된 JSON이다. `renderProjects()`는 `loading`에 스피너, `error`에 메시지·재시도 버튼과 저장 카드, `empty`에 빈 문구, `success`에 라이브 카드를 표시한다. 저장 목록이 없으면 오류 메시지와 재시도만 보인다. `.github/workflows/pages.yml`은 배포 전에 `GITHUB_TOKEN`을 전달해 `node scripts/snapshot-repos.cjs`를 실행한다. 스크립트는 `name`, `html_url`, `description`, `language`, `stargazers_count`만 `data/repos.json`에 저장하며 토큰은 기록하지 않는다.

### E. 폼 입력과 제출 (`js/contact.js`)

```js
const validateField = (key) => {
  const value = fields[key].input.value.trim();
  if (!value) return '필수 입력 항목입니다.';
  if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 주소를 입력해 주세요.';
  return '';
};

feedback.textContent = STATE.form.submitted
  ? '제출 성공! 입력 내용을 확인했습니다. 이 데모 폼은 메시지를 실제로 전송하지 않습니다.'
  : '';
feedback.classList.toggle('is-success', STATE.form.submitted);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  Object.keys(fields).forEach((key) => { STATE.form.errors[key] = validateField(key); });
  STATE.form.submitted = Object.values(STATE.form.errors).every((message) => !message);
  renderForm();
});
```

`validateField`는 공백을 제거한 필수값과 기본 이메일 형식을 확인한다. 실제 파일의 `input` 리스너도 같은 함수를 호출한다. 중간 두 줄은 실제 `renderForm()` 안의 코드다. `preventDefault()`는 브라우저의 기본 제출·페이지 이동을 막고, 상태를 바꾼 뒤 `renderForm()`이 성공 안내를 갱신한다. 실패한 제출에서는 첫 오류 필드로 초점을 옮긴다.

### F. CSS 변수 (`css/style.css`)

```css
:root {
  --bg: #f7f5ef;
  --surface: #fffefb;
  --ink: #20251f;
  --font-body: "DM Sans", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
}
:root[data-theme="dark"] {
  --bg: #151914;
  --surface: #20261e;
  --ink: #f1f3e9;
}
body { color: var(--ink); background: var(--bg); font: 400 16px/1.7 var(--font-body); }
```

발췌는 원본의 핵심 속성만 뽑았다. `--bg`와 `--ink`의 이름은 “어디에 쓰는 색인가”를 말해 주며, 다크 테마에서는 값만 바뀐다.

### G. 이벤트 리스너 (`js/ui.js`)

```js
themeButton.addEventListener('click', () => {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
  renderTheme();
  try { localStorage.setItem('portfolio-theme', STATE.theme); } catch { /* 저장이 차단되어도 토글은 동작합니다. */ }
});
window.addEventListener('scroll', renderScroll, { passive: true });
```

등록된 클릭 콜백은 실제 클릭 시 실행된다. 스크롤 리스너는 `{ passive: true }`로 스크롤 기본 동작을 막지 않는다고 브라우저에 알려 준다.

### H. `filter()`·`map()` (`js/projects.js`)

```js
const { status: phase, items, filter, error } = projectState;
const languages = ['전체', ...new Set(items.map((repo) => repo.language || '기타'))];
const visible = filter === '전체'
  ? items
  : items.filter((repo) => (repo.language || '기타') === filter);

filters.replaceChildren(...languages.map(createFilter));
```

같은 파일의 `success` 분기에 다음 코드가 있다.

```js
grid.replaceChildren(...visible.map(createCard));
```

구조분해로 상태 속성을 읽고, 첫 `map()`은 언어 목록을, `filter()`는 현재 선택 언어의 저장소를, 마지막 `map()`은 카드 DOM 요소를 만든다. `createCard()`에서는 저장소 이름·설명을 `textContent`로 넣어 외부 문자열을 HTML 코드로 해석하지 않는다.

### I. 공유 상태 객체 (`js/state.js`)

```js
const STATE = {
  theme: 'light',
  menuOpen: false,
  projects: { status: 'idle', items: [], filter: '전체', error: '' },
  form: { errors: {}, submitted: false }
};
```

`theme`과 `menuOpen`은 일반 UI, `projects`는 API와 필터, `form`은 검증 상태를 표현한다. 단순한 전역 변수 여러 개보다 현재 화면의 입력값을 한곳에서 찾아 볼 수 있다. 상태 변경 후에는 각 기능 파일의 렌더 함수를 호출해야 한다.

## 시연 기록

| 시나리오 | 실행 환경·방법 | 실제 결과 | 판정 |
| --- | --- | --- | --- |
| 360px·768px·1024px 레이아웃 | Chrome 창 크기 변경 | __________ | □ PASS □ FAIL |
| 테마 전환 후 새로고침 | 버튼 클릭 → 새로고침 | 로컬 브라우저에서 테마 유지 관찰 | □ PASS □ FAIL |
| 메뉴·스크롤·맨 위 버튼 | 모바일 메뉴와 페이지 스크롤 | __________ | □ PASS □ FAIL |
| GitHub 로딩·성공 | 정상 네트워크와 `node --test tests/projects.test.cjs` | 로딩·성공 경로는 모의 응답 테스트 통과. 실제 GitHub 정상 응답은 호출 제한 해제 후 확인 필요 | □ PASS □ FAIL |
| GitHub 오류·저장 목록·재시도 | 403과 응답 복구 모의 | 403 시 저장 목록 카드와 오류·재시도, 재시도 복구는 모의 응답 테스트 통과. 배포 URL에서 별도 확인 | □ PASS □ FAIL |
| GitHub 빈 응답 | `node --test tests/projects.test.cjs` | 빈 배열 상태 모의 응답 테스트 통과 | □ PASS □ FAIL |
| 언어 필터 | 전체·특정 언어 선택 모의 | 라이브 목록과 저장 목록의 필터·카드 수 변경 모의 응답 테스트 통과. 배포 URL에서 별도 확인 | □ PASS □ FAIL |
| 폼 오류·정상 입력 | 빈 값·이메일 오류·정상 값 | 배포 URL에서 빈 값의 필드별 오류와 유효한 입력의 “제출 성공!” 메시지를 관찰. 페이지 주소 유지. `screenshots/contact-success.png`에 캡처 | □ PASS □ FAIL |

체크란은 실제 브라우저에서 확인한 사람만 채운다. 코드 읽기만으로 PASS를 주장하지 않는다.
