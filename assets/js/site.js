/* 팽글 사이트 스크립트 — 언어 토글, 잠금화면 데모, 목표 데모, 꾸미기.
 * 의존성 없음. snail.js 가 먼저 로드되어 있어야 한다. */

const LANGUAGE_STORAGE_KEY = 'pangle-language';
const SUPPORTED_LANGUAGES = ['ko', 'en'];

/* 앱과 같은 보폭. PangleKit 의 걸음→거리 환산과 맞춘다(6,000걸음 = 4.3km). */
const METRES_PER_STEP = 0.72;

function readStoredLanguage() {
	try {
		return window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
	} catch (error) {
		return null;
	}
}

function writeStoredLanguage(language) {
	try {
		window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
	} catch (error) {
		/* 프라이빗 브라우징에서는 저장이 막힌다. 화면 전환만 하고 넘어간다. */
	}
}

function resolveInitialLanguage() {
	const requested = new URLSearchParams(window.location.search).get('lang');

	if (SUPPORTED_LANGUAGES.includes(requested)) {
		return requested;
	}

	const stored = readStoredLanguage();

	if (SUPPORTED_LANGUAGES.includes(stored)) {
		return stored;
	}

	const preferred = window.navigator.language || 'ko';

	return preferred.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

function applyLanguage(language) {
	const root = document.documentElement;

	root.dataset.lang = language;
	root.setAttribute('lang', language);

	const title = root.dataset[language === 'en' ? 'titleEn' : 'titleKo'];

	if (title) {
		document.title = title;
	}

	document.querySelectorAll('.lang-switch button').forEach((button) => {
		button.setAttribute('aria-pressed', String(button.dataset.lang === language));
	});

	document.querySelectorAll('[data-swap-ko]').forEach((element) => {
		const value = element.dataset[language === 'en' ? 'swapEn' : 'swapKo'];

		if (value) {
			element.textContent = value;
		}
	});
}

function setUpLanguageSwitch() {
	applyLanguage(resolveInitialLanguage());

	document.querySelectorAll('.lang-switch button').forEach((button) => {
		button.addEventListener('click', () => {
			const language = button.dataset.lang;

			applyLanguage(language);
			writeStoredLanguage(language);
		});
	});
}

function currentLanguage() {
	return document.documentElement.dataset.lang === 'en' ? 'en' : 'ko';
}

function formatSteps(value) {
	return Math.round(value).toLocaleString('en-US');
}

function formatDistance(steps) {
	return ((steps * METRES_PER_STEP) / 1000).toFixed(1);
}

/* 두 언어 문장을 한 요소에 심어두고 현재 언어로 그린다. 언어를 바꾸면
 * applyLanguage 가 같은 자리를 다시 채운다. */
function setBilingualText(element, korean, english) {
	if (!element) {
		return;
	}

	element.dataset.swapKo = korean;
	element.dataset.swapEn = english;
	element.textContent = currentLanguage() === 'en' ? english : korean;
}

/* 스프라이트를 data-* 로 선언한 자리를 모두 채운다. */
function renderDeclaredSprites() {
	document.querySelectorAll('[data-snail]').forEach((element) => {
		renderSnail(element, {
			pixelSize: element.dataset.px ? Number(element.dataset.px) : null,
			hasShell: element.dataset.shell !== 'off',
			walking: element.dataset.walk !== 'off',
			bodyIndex: element.dataset.bodyIndex
				? Number(element.dataset.bodyIndex)
				: SnailPalette.defaultBodyIndex,
			shellIndex: element.dataset.shellIndex
				? Number(element.dataset.shellIndex)
				: SnailPalette.defaultShellIndex,
		});
	});

	document.querySelectorAll('[data-icon-mark]').forEach((element) => {
		renderIconMark(element, {
			pixelSize: element.dataset.px ? Number(element.dataset.px) : null,
		});
	});

	document.querySelectorAll('[data-shell-mark]').forEach((element) => {
		renderShellMark(element, {
			pixelSize: element.dataset.px ? Number(element.dataset.px) : null,
			shellIndex: element.dataset.shellIndex
				? Number(element.dataset.shellIndex)
				: SnailPalette.defaultShellIndex,
		});
	});
}

/* 잠금화면 목업의 날짜 — 고정해두면 언젠가 지난 날짜가 된다. */
function setUpLockDate() {
	/* 잠금화면 목업은 히어로와 라이브 액티비티 섹션 두 곳에 있다. */
	const targets = document.querySelectorAll('[data-lock-date]');

	if (!targets.length) {
		return;
	}

	const today = new Date();

	targets.forEach((target) => {
		setBilingualText(
			target,
			today.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }),
			today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
		);
	});
}

/* 히어로의 잠금화면 데모.
 *
 * 앱의 규칙을 그대로 따른다 — 달팽이는 트랙 가운데에 고정되고 목표 마커가 다가온다.
 * 걸음이 목표에 닿으면 껍데기가 돌아오고 목표 마커는 사라진다.
 *
 * 걸음 수는 한 번에 30씩, 사람이 읽을 수 있는 속도로만 올린다. 프레임마다 1씩
 * 올리면 숫자가 흐르는 것처럼 보여 읽히지 않는다. */
const HERO_GOAL = 10000;
const HERO_START_STEPS = 6000;
const HERO_STEP_CHUNK = 30;
const HERO_TICK_MILLISECONDS = 220;
const HERO_HOLD_MILLISECONDS = 4200;

const HERO_STATUS = {
	walking: { ko: '걸어다니는 중', en: 'Crawling' },
	near: { ko: '거의 다 왔어요', en: 'Almost there' },
	done: { ko: '껍데기 탈환!', en: 'Shell reclaimed!' },
};

function setUpHeroDemo() {
	const stage = document.querySelector('[data-hero-demo]');

	if (!stage) {
		return;
	}

	const walker = stage.querySelector('[data-hero-walker]');
	const capsuleSnail = stage.querySelector('[data-hero-capsule]');
	const goalMark = stage.querySelector('[data-hero-goal]');
	const fill = stage.querySelector('[data-hero-fill]');
	const dust = stage.querySelector('[data-hero-dust]');
	const countTargets = stage.querySelectorAll('[data-hero-count]');
	const percentTargets = stage.querySelectorAll('[data-hero-percent]');
	const statusTargets = stage.querySelectorAll('[data-hero-status]');

	if (!walker || !goalMark || !fill) {
		return;
	}

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const ticksToGoal = Math.ceil((HERO_GOAL - HERO_START_STEPS) / HERO_STEP_CHUNK);
	let hasShell = false;
	let visible = true;
	let startedAt = null;
	let holdUntil = null;

	renderSnail(walker, { hasShell: false, walking: true });

	function paint(steps) {
		const achieved = steps >= HERO_GOAL;
		const progress = Math.min(1, steps / HERO_GOAL);
		const percent = Math.min(100, Math.round(progress * 100));
		let status = HERO_STATUS.walking;

		if (achieved) {
			status = HERO_STATUS.done;
		} else if (percent >= 85) {
			status = HERO_STATUS.near;
		}

		countTargets.forEach((element) => {
			element.textContent = formatSteps(steps);
		});
		percentTargets.forEach((element) => {
			element.textContent = `${percent}%`;
		});
		statusTargets.forEach((element) => {
			setBilingualText(element, status.ko, status.en);
		});

		/* 지나온 길은 길이가 아니라 밝기로 진행도를 나른다(WalkTrack 과 같은 식). */
		fill.style.opacity = (0.35 + progress * 0.65).toFixed(3);
		goalMark.style.left = `${(50 + (1 - progress) * 46).toFixed(2)}%`;

		/* 목표에 닿으면 달팽이가 껍데기를 되찾으므로, 바닥에 남은 목표 껍데기는
		   치운다. 앱도 달성 상태에서 마커를 그리지 않는다. */
		goalMark.hidden = achieved;

		if (achieved !== hasShell) {
			hasShell = achieved;
			setSnailShell(walker, achieved, !achieved);

			if (capsuleSnail) {
				setSnailShell(capsuleSnail, achieved, !achieved);
			}
		}

		if (dust) {
			dust.hidden = achieved;
		}
	}

	function tick(now) {
		if (!visible) {
			startedAt = null;
			window.requestAnimationFrame(tick);
			return;
		}

		if (holdUntil !== null) {
			if (now >= holdUntil) {
				holdUntil = null;
				startedAt = now;
				paint(HERO_START_STEPS);
			}

			window.requestAnimationFrame(tick);
			return;
		}

		if (startedAt === null) {
			startedAt = now;
		}

		const ticks = Math.min(ticksToGoal, Math.floor((now - startedAt) / HERO_TICK_MILLISECONDS));
		const steps = Math.min(HERO_GOAL, HERO_START_STEPS + ticks * HERO_STEP_CHUNK);

		paint(steps);

		if (ticks >= ticksToGoal) {
			holdUntil = now + HERO_HOLD_MILLISECONDS;
		}

		window.requestAnimationFrame(tick);
	}

	if (reduceMotion) {
		paint(8430);
		return;
	}

	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				visible = entry.isIntersecting;
			});
		}, { threshold: 0.15 });

		observer.observe(stage);
	}

	paint(HERO_START_STEPS);
	window.requestAnimationFrame(tick);
}

/* 목표 데모 — 목표를 바꾸면 남은 거리가 달라진다.
 * 선택지는 앱의 하루 목표 칩과 같다. */
const GOAL_DEMO_STEPS = 6300;
const GOAL_DEMO_CHOICES = [6000, 8000, 10000, 12000];

function setUpGoalDemo() {
	const stage = document.querySelector('[data-goal-demo]');

	if (!stage) {
		return;
	}

	const buttons = stage.querySelector('[data-goal-buttons]');
	const valueTarget = stage.querySelector('[data-goal-value]');
	const statusTarget = stage.querySelector('[data-goal-status]');
	const fill = stage.querySelector('[data-goal-fill]');
	const mark = stage.querySelector('[data-goal-mark]');
	const walker = stage.querySelector('.walker .snail');

	if (!buttons || !fill || !mark) {
		return;
	}

	let goal = 10000;
	let hasShell = false;

	function paint() {
		const progress = Math.min(1, GOAL_DEMO_STEPS / goal);
		const percent = Math.round(progress * 100);
		const achieved = GOAL_DEMO_STEPS >= goal;

		if (valueTarget) {
			valueTarget.textContent = formatSteps(goal);
		}

		setBilingualText(
			statusTarget,
			achieved ? `${percent}% · 껍데기 탈환!` : `${percent}% · 걸어다니는 중`,
			achieved ? `${percent}% · Shell reclaimed!` : `${percent}% · Crawling`
		);

		fill.style.opacity = (0.35 + progress * 0.65).toFixed(3);
		mark.style.left = `${(50 + (1 - progress) * 46).toFixed(2)}%`;
		mark.hidden = achieved;

		if (walker && achieved !== hasShell) {
			hasShell = achieved;
			setSnailShell(walker, achieved, !achieved);
		}
	}

	GOAL_DEMO_CHOICES.forEach((choice) => {
		const button = document.createElement('button');
		const steps = document.createElement('span');
		const distance = document.createElement('span');

		steps.className = 'steps';
		steps.textContent = formatSteps(choice);
		distance.className = 'distance';
		distance.textContent = `${formatDistance(choice)} km`;

		button.type = 'button';
		button.appendChild(steps);
		button.appendChild(distance);
		button.setAttribute('aria-pressed', String(choice === goal));
		button.addEventListener('click', () => {
			goal = choice;
			buttons.querySelectorAll('button').forEach((other) => {
				other.setAttribute('aria-pressed', String(other === button));
			});
			paint();
		});

		buttons.appendChild(button);
	});

	paint();
}

/* 꾸미기 — 앱의 '달팽이 꾸미기' 화면과 같은 구성.
 * 어두운 미리보기 상자, 6열 견본 격자 둘, PRO 배지가 붙은 레인보우 프리셋. */
function setUpDressUp() {
	const section = document.querySelector('[data-dressup]');

	if (!section) {
		return;
	}

	const preview = section.querySelector('[data-dress-preview]');
	const bodyGrid = section.querySelector('[data-dress-bodies]');
	const shellGrid = section.querySelector('[data-dress-shells]');
	const bodyName = section.querySelector('[data-dress-body-name]');
	const shellName = section.querySelector('[data-dress-shell-name]');

	if (!preview || !bodyGrid || !shellGrid) {
		return;
	}

	let bodyIndex = SnailPalette.defaultBodyIndex;
	let shellIndex = SnailPalette.defaultShellIndex;

	renderSnail(preview, {
		hasShell: true,
		walking: true,
		bodyIndex: bodyIndex,
		shellIndex: shellIndex,
	});

	function updateNames() {
		setBilingualText(
			bodyName,
			SnailPalette.names.ko[bodyIndex],
			SnailPalette.names.en[bodyIndex]
		);
		setBilingualText(
			shellName,
			SnailPalette.names.ko[shellIndex],
			SnailPalette.names.en[shellIndex]
		);
	}

	function markPressed(grid, index) {
		grid.querySelectorAll('button').forEach((button) => {
			button.setAttribute('aria-pressed', String(Number(button.dataset.index) === index));
		});
	}

	function buildSwatches(grid, presets, kind) {
		presets.forEach((preset, index) => {
			const button = document.createElement('button');
			const fill = document.createElement('span');
			const isRainbow = index === 0;
			const isPro = preset[preset.length - 1] === true;
			const koName = SnailPalette.names.ko[index];
			const enName = SnailPalette.names.en[index];

			button.type = 'button';
			button.dataset.index = String(index);
			button.setAttribute('aria-label', `${koName} / ${enName}`);
			button.title = `${koName} · ${enName}`;

			fill.className = 'fill';

			if (isRainbow) {
				const sweep = document.createElement('span');

				sweep.className = 'sweep';
				fill.classList.add('rainbow');
				fill.appendChild(sweep);
			} else {
				fill.style.background = preset[0];
			}

			/* PRO 프리셋은 잠긴 상태를 흐림으로 표현한다 — 앱과 같다. */
			if (isPro) {
				const badge = document.createElement('span');

				fill.classList.add('locked');
				badge.className = 'pro-badge';
				badge.textContent = 'PRO';
				button.appendChild(badge);
			}

			button.appendChild(fill);

			button.addEventListener('click', () => {
				if (kind === 'body') {
					bodyIndex = index;
				} else {
					shellIndex = index;
				}

				setSnailAppearance(preview, bodyIndex, shellIndex);
				markPressed(grid, index);
				updateNames();
			});

			grid.appendChild(button);
		});

		markPressed(grid, kind === 'body' ? bodyIndex : shellIndex);
	}

	buildSwatches(bodyGrid, SnailPalette.bodies, 'body');
	buildSwatches(shellGrid, SnailPalette.shells, 'shell');
	updateNames();
}

/* 주소 복사.
 *
 * mailto: 는 기본 메일 앱이 등록된 기기에서만 창이 열린다. 웹메일만 쓰는 사람에게는
 * 눌러도 아무 일이 없으므로, 주소를 누르면 클립보드에 복사하고 그 사실을 알린다. */
function copyWithSelection(value) {
	const field = document.createElement('textarea');

	field.value = value;
	field.setAttribute('readonly', 'readonly');
	field.style.position = 'fixed';
	field.style.top = '-1000px';
	document.body.appendChild(field);
	field.select();

	let copied = false;

	try {
		copied = document.execCommand('copy');
	} catch (error) {
		copied = false;
	}

	document.body.removeChild(field);

	return copied;
}

let toastElement = null;
let toastTimer = null;

function showToast(korean, english) {
	if (!toastElement) {
		toastElement = document.createElement('div');
		toastElement.className = 'toast';
		toastElement.setAttribute('role', 'status');
		toastElement.setAttribute('aria-live', 'polite');
		document.body.appendChild(toastElement);
	}

	setBilingualText(toastElement, korean, english);
	/* 다음 프레임에 클래스를 붙여야 방금 만든 요소도 전환이 걸린다. */
	window.requestAnimationFrame(() => {
		toastElement.classList.add('visible');
	});

	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => {
		toastElement.classList.remove('visible');
	}, 2400);
}

function setUpCopyButtons() {
	document.querySelectorAll('[data-copy]').forEach((button) => {
		button.addEventListener('click', async () => {
			const value = button.dataset.copy;
			let copied = false;

			try {
				await window.navigator.clipboard.writeText(value);
				copied = true;
			} catch (error) {
				copied = copyWithSelection(value);
			}

			if (copied) {
				showToast('이메일 주소를 복사했어요', 'Email address copied');
			} else {
				showToast('복사하지 못했어요. 주소를 직접 선택해 주세요.', 'Could not copy — please select the address.');
			}
		});
	});
}

document.addEventListener('DOMContentLoaded', () => {
	setUpLanguageSwitch();
	renderDeclaredSprites();
	setUpLockDate();
	setUpHeroDemo();
	setUpGoalDemo();
	setUpDressUp();
	setUpCopyButtons();
});
