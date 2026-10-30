const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'js', 'projects.js'), 'utf8');

class Element {
  constructor() {
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.textContent = '';
    this.innerHTML = '';
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  addEventListener(name, callback) { this.listeners[name] = callback; }
  append(...items) { this.children.push(...items); }
  replaceChildren(...items) { this.children = items; this.textContent = ''; this.innerHTML = ''; }
  click() { this.listeners.click?.(); }
}

async function runWith(fetchResponse) {
  const elements = Object.fromEntries([
    '#project-filters', '#project-count', '#project-status', '#project-grid'
  ].map((selector) => [selector, new Element()]));
  const state = { projects: { status: 'idle', items: [], filter: '전체', error: '' } };
  const context = {
    document: {
      querySelector: (selector) => elements[selector],
      createElement: () => new Element()
    },
    STATE: state,
    fetch: fetchResponse,
    URL,
    Set,
    Error,
    Array,
    String
  };
  vm.runInNewContext(source, context);
  await new Promise(setImmediate);
  return { elements, state };
}

const repo = (name, language) => ({
  name, language, description: `${name} 설명`, html_url: `https://github.com/ChoiMari/${name}`,
  stargazers_count: 2
});

test('요청 대기 중에는 로딩 상태를 먼저 보여준다', () => {
  let finishRequest;
  const pending = new Promise((resolve) => { finishRequest = resolve; });
  const elements = Object.fromEntries([
    '#project-filters', '#project-count', '#project-status', '#project-grid'
  ].map((selector) => [selector, new Element()]));
  const state = { projects: { status: 'idle', items: [], filter: '전체', error: '' } };
  vm.runInNewContext(source, {
    document: { querySelector: (selector) => elements[selector], createElement: () => new Element() },
    STATE: state, fetch: () => pending, URL, Set, Error, Array, String
  });
  assert.equal(state.projects.status, 'loading');
  assert.match(elements['#project-status'].innerHTML, /불러오는 중입니다/);
  finishRequest({ ok: true, json: async () => [] });
});

test('성공 응답은 카드로 렌더링되고 언어 필터는 목록을 줄인다', async () => {
  const { elements, state } = await runWith(async () => ({
    ok: true, json: async () => [repo('one', 'JavaScript'), repo('two', 'HTML')]
  }));
  assert.equal(state.projects.status, 'success');
  assert.equal(elements['#project-grid'].children.length, 2);
  const jsButton = elements['#project-filters'].children.find((button) => button.textContent === 'JavaScript');
  jsButton.click();
  assert.equal(state.projects.filter, 'JavaScript');
  assert.equal(elements['#project-grid'].children.length, 1);
  assert.equal(elements['#project-count'].textContent, '1개 프로젝트');
});

test('빈 응답은 카드 대신 빈 상태를 보여준다', async () => {
  const { elements, state } = await runWith(async () => ({ ok: true, json: async () => [] }));
  assert.equal(state.projects.status, 'empty');
  assert.equal(elements['#project-status'].textContent, '표시할 프로젝트가 없습니다.');
  assert.equal(elements['#project-grid'].children.length, 0);
});

test('403 응답은 오류와 재시도 버튼을 보여주고 재요청할 수 있다', async () => {
  let calls = 0;
  const { elements, state } = await runWith(async () => {
    calls += 1;
    return calls === 1
      ? { ok: false, status: 403 }
      : { ok: true, json: async () => [repo('recovered', 'CSS')] };
  });
  assert.equal(state.projects.status, 'error');
  assert.match(elements['#project-status'].children[0].textContent, /프로젝트를 불러올 수 없습니다/);
  elements['#project-status'].children[1].click();
  await new Promise(setImmediate);
  assert.equal(calls, 2);
  assert.equal(state.projects.status, 'success');
  assert.equal(elements['#project-grid'].children.length, 1);
});

test('네트워크 실패는 오류 상태로 이동한다', async () => {
  const { elements, state } = await runWith(async () => { throw new Error('offline'); });
  assert.equal(state.projects.status, 'error');
  assert.match(elements['#project-status'].children[0].textContent, /네트워크 상태/);
});
