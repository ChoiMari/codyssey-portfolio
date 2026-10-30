// GitHub 저장소를 가져와 상태에 저장하고, 상태가 바뀔 때마다 화면을 다시 그린다.
(() => {
  const endpoint = 'https://api.github.com/users/ChoiMari/repos?per_page=100&sort=updated';
  const filters = document.querySelector('#project-filters');
  const count = document.querySelector('#project-count');
  const status = document.querySelector('#project-status');
  const grid = document.querySelector('#project-grid');

  if (!filters || !count || !status || !grid) return;

  const projectState = STATE.projects;

  function createFilter(label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(projectState.filter === label));
    button.addEventListener('click', () => {
      projectState.filter = label;
      renderProjects();
    });
    return button;
  }

  function createCard(repo) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const heading = document.createElement('h3');
    const link = document.createElement('a');
    const safeUrl = new URL(repo.html_url);
    link.href = safeUrl.protocol === 'https:' && safeUrl.hostname === 'github.com'
      ? safeUrl.href
      : 'https://github.com/ChoiMari';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name;
    heading.append(link);

    const description = document.createElement('p');
    description.className = 'project-description';
    description.textContent = repo.description || '설명이 등록되지 않은 저장소입니다.';

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const language = document.createElement('span');
    language.textContent = repo.language || '기타';
    const stars = document.createElement('span');
    stars.textContent = `★ ${repo.stargazers_count}`;
    meta.append(language, stars);

    card.append(heading, description, meta);
    return card;
  }

  // render는 '화면에 그린다'는 뜻이다. 이 함수는 API 요청을 보내지 않는다.
  // projectState에 이미 저장된 값을 읽고 프로젝트 영역의 HTML을 다시 만든다.
  function renderProjects() {
    // 객체에서 필요한 값을 꺼낸다. status는 아래에서 읽기 쉽게 phase라는 이름으로 부른다.
    const { status: phase, items, filter, error } = projectState;
    // items의 언어들을 모아 필터 버튼 이름을 만든다. Set은 중복 언어를 한 번만 남긴다.
    const languages = ['전체', ...new Set(items.map((repo) => repo.language || '기타'))];
    // '전체'면 모든 저장소를, 특정 언어를 골랐으면 조건에 맞는 저장소만 보여 준다.
    const visible = filter === '전체'
      ? items
      : items.filter((repo) => (repo.language || '기타') === filter);

    // 이전에 그려 둔 버튼·카드·상태 문구를 지우고 현재 상태에 맞게 다시 채운다.
    // map(createFilter)은 언어 이름 각각을 버튼 요소로 바꾼다.
    filters.replaceChildren(...languages.map(createFilter));
    grid.replaceChildren();
    status.replaceChildren();
    // 성공 상태이거나 저장된 목록이 있으면, 현재 필터에서 보이는 카드 수를 표시한다.
    count.textContent = (phase === 'success' || items.length) ? `${visible.length}개 프로젝트` : '';

    // 아래 if들은 상태별 화면의 갈림길이다. return은 현재 함수 실행을 여기서 끝낸다.
    if (phase === 'loading') {
      // 개발자가 직접 작성한 고정 마크업에만 innerHTML을 사용한다.
      // GitHub API 값은 createCard()에서 textContent로 출력한다.
      status.innerHTML = '<span class="project-spinner" aria-hidden="true"></span><span>GitHub 프로젝트를 불러오는 중입니다…</span>';
      return;
    }
    if (phase === 'error') {
      // 오류 문구와 '다시 시도' 버튼을 만든다. 버튼을 누르면 loadProjects()가 재실행된다.
      const message = document.createElement('p');
      message.textContent = error;
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'button button-outline';
      retry.textContent = '다시 시도';
      retry.addEventListener('click', loadProjects);
      status.append(message, retry);
      // 실시간 API는 실패했어도 저장해 둔 목록이 있다면 카드를 함께 보여 준다.
      if (visible.length) grid.replaceChildren(...visible.map(createCard));
      return;
    }
    if (phase === 'empty') {
      // API 요청은 성공했지만 저장소 배열에 항목이 없는 경우다.
      status.textContent = '표시할 프로젝트가 없습니다.';
      return;
    }
    if (phase === 'success' && visible.length === 0) {
      // 저장소는 있지만 선택한 언어에 맞는 저장소가 없는 경우다.
      status.textContent = '이 언어에 해당하는 프로젝트가 없습니다.';
      return;
    }
    if (phase === 'success') {
      // map(createCard)은 저장소 데이터 각각을 화면에 넣을 카드 요소로 바꾼다.
      grid.replaceChildren(...visible.map(createCard));
    }
  }

  // async: 이 함수 안에서 await를 사용할 수 있게 한다. 함수의 결과는 Promise가 된다.
  // 네트워크 응답을 기다리는 동안 브라우저의 다른 동작은 계속된다.
  async function loadProjects() {
    // 요청 중에 다시 시도 버튼 등을 눌러도 같은 요청을 겹쳐 보내지 않는다.
    if (projectState.status === 'loading') return;
    // 요청이 끝나기 전에는 로딩 문구를 보여 주고, 이전 오류 문구는 지운다.
    projectState.status = 'loading';
    projectState.error = '';
    renderProjects();

    // try 안에서 오류가 나면 아래 catch로 이동한다.
    try {
      // fetch()가 GitHub에 요청을 보낸다. await는 응답을 받을 때까지 이 함수의 다음 줄을 기다린다.
      // endpoint는 파일 맨 위에 적힌 GitHub API 주소다.
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      // 서버가 403이나 404를 보내도 fetch()가 자동으로 오류를 던지지는 않는다.
      // 따라서 응답이 성공 범위(200~299)인지 response.ok로 직접 검사한다.
      if (!response.ok) {
        if (response.status === 403) {
          // throw는 오류를 만들어 아래 catch로 흐름을 넘긴다.
          throw new Error('프로젝트를 불러올 수 없습니다. GitHub 요청 제한에 도달했습니다. 잠시 후 다시 시도해 주세요.');
        }
        throw new Error(`프로젝트를 불러올 수 없습니다. (HTTP ${response.status})`);
      }
      // 응답 본문을 자바스크립트 데이터로 변환한다. 이 작업도 비동기여서 await를 쓴다.
      const data = await response.json();
      // 저장소 목록은 배열이어야 한다. 다른 형식이면 정상 데이터로 사용하지 않는다.
      if (!Array.isArray(data)) throw new Error('프로젝트를 불러올 수 없습니다. GitHub 응답 형식이 올바르지 않습니다.');

      // 가져온 배열을 상태에 저장하고 필터를 '전체'로 되돌린다.
      projectState.items = data;
      projectState.filter = '전체';
      // 배열에 항목이 있으면 success, 비어 있으면 empty다. 빈 배열은 요청 실패가 아니다.
      projectState.status = projectState.items.length ? 'success' : 'empty';
    } catch (error) {
      // 네트워크 실패, 직접 throw한 HTTP 오류, JSON 변환 오류가 이곳으로 온다.
      projectState.status = 'error';
      // 우리가 만든 오류 문구는 그대로 쓰고, 그 밖의 오류는 이해하기 쉬운 안내로 바꾼다.
      projectState.error = error instanceof Error && error.message.startsWith('프로젝트를 불러올 수 없습니다.')
        ? error.message
        : '프로젝트를 불러올 수 없습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.';
      // GitHub Pages에는 배포 시 GitHub API에서 받아 둔 공개 저장소 목록을 함께 싣는다.
      // 인증 없는 브라우저 요청이 제한되어도 마지막 목록과 오류·재시도를 함께 보여준다.
      try {
        // GitHub API가 실패한 경우, 우리 사이트에 저장해 둔 JSON 파일을 한 번 더 요청한다.
        const snapshot = await fetch('data/repos.json');
        if (!snapshot.ok) throw new Error('저장된 목록을 읽을 수 없습니다.');
        const cachedRepos = await snapshot.json();
        if (!Array.isArray(cachedRepos)) throw new Error('저장된 목록의 형식이 올바르지 않습니다.');
        // 저장 목록이 있더라도 상태는 error로 남겨, 실시간 요청 실패를 숨기지 않는다.
        projectState.items = cachedRepos;
        projectState.filter = '전체';
        projectState.error += ' 마지막 배포에서 저장한 프로젝트를 표시합니다.';
      } catch {
        // 저장 목록까지 실패했다면 카드 없이 오류와 재시도 버튼만 보여 준다.
        projectState.items = [];
      }
    }
    // 최종 상태(success / empty / error)를 읽어 문구와 카드를 화면에 그린다.
    renderProjects();
  }

  // 페이지가 열릴 때 한 번 실행한다. 이후에는 '다시 시도' 버튼이 loadProjects를 다시 호출한다.
  renderProjects();
  loadProjects();
})();
