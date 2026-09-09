/* 팽글 픽셀 달팽이 — 앱의 스프라이트를 그대로 웹에 옮긴 것.
 *
 * 아트와 팔레트는 앱 소스가 원본이다.
 *   PangleKit/SnailSprite.swift  — 12×8 아트 4종과 7×6 껍데기 마크
 *   PangleKit/Palette.swift      — 몸 24색, 껍데기 24색, 프리셋 이름
 * 앱 쪽이 바뀌면 이 파일도 같이 고쳐야 한다.
 *
 * 문자 의미: s = 껍데기, S = 껍데기 하이라이트, b = 몸, d = 어두운 몸(더듬이·발),
 *            w = 눈, m = 아이콘 마크의 잉크, . = 빈 칸.
 */

const SnailArt = {
	columns: 12,
	rows: 8,
	shellA: [
		'..sss....d.d',
		'.sSSss...d.d',
		'sSSsss..bbbb',
		'sssssss.bbwb',
		'sssssssbbbbb',
		'.sssssbbbbbb',
		'bbbbbbbbbbb.',
		'dddddddddd..',
	],
	shellB: [
		'..sss.....d.',
		'.sSSss...d.d',
		'sSSsss...bbb',
		'sssssss..bwb',
		'sssssss.bbbb',
		'.ssssssbbbbb',
		'.bbbbbbbbbb.',
		'.dddddddddd.',
	],
	bareA: [
		'.........d.d',
		'.........d.d',
		'............',
		'...bbbb.bbbb',
		'..bbbbbbbbwb',
		'.bbbbbbbbbbb',
		'bbbbbbbbbbb.',
		'dddddddddd..',
	],
	bareB: [
		'..........d.',
		'.........d.d',
		'............',
		'...bbbb..bbb',
		'..bbbbbbbbbb',
		'..bbbbbbbbbb',
		'.bbbbbbbbbb.',
		'.dddddddddd.',
	],
	shellMark: [
		'..sss..',
		'.sSSss.',
		'sSSsss.',
		'sssssss',
		'sssssss',
		'.sssss.',
	],
	markColumns: 7,
	markRows: 6,

	/* 앱 아이콘의 마크 — 9×7 계단선 한 칸 굵기.
	 *
	 * 스프라이트에서 뽑은 그림이 아니라 손으로 그려온 시안을 격자째 실측해 옮긴
	 * 별개의 아트다. 원본은 앱 저장소의
	 * Design/icon-candidates/round10/make-round10.py 의 SHELL_DOWN 상수이고, 저기가
	 * 바뀌면 여기도 같이 고쳐야 한다.
	 *
	 * 1~3행이 껍데기(2칸 캡이 어깨로 계단), 3~6행이 몸(등 직선, 바닥 평평),
	 * 6~8열이 머리(목·주둥이·눈자루 하나). 0행은 비어 있다 — 껍데기 돔이 한 칸
	 * 내려앉고 바닥은 제자리라, 껍데기가 몸통 대비 낮게 앉는다. */
	iconMark: [
		'.........',
		'..mm.....',
		'.m..m....',
		'mm..mm.m.',
		'm....m.mm',
		'm.....mm.',
		'mmmmmmm..',
	],
	iconColumns: 9,
	iconRows: 7,
};

const SnailPalette = {
	rainbowToken: 'rainbow',
	/* Palette.rainbowPixels — 레인보우 껍데기를 칠할 때 쓰는 행 단위 램프. */
	rainbowPixels: ['#ff6b6b', '#ffa94d', '#ffd43b', '#8ce99a', '#4dabf7', '#b197fc'],
	/* [몸 색, 어두운 몸 색, PRO 여부] — Palette.bodyHexes 와 같은 순서. */
	bodies: [
		['#ff8a8a', '#c94b4b', true],
		['#f4f1ea', '#c2bbac', false],
		['#b7f0e0', '#4aa891', false],
		['#a9d3f5', '#4c82b5', false],
		['#d9ef9c', '#7d9c3c', false],
		['#f8e39b', '#c2a13c', false],
		['#f8c9ad', '#c07a55', false],
		['#f7b0b0', '#c25a5a', false],
		['#d8c8f5', '#7c66b8', false],
		['#f3bcd8', '#bd6d97', false],
		['#e6d5bd', '#a8906d', false],
		['#b9bcc4', '#5c6270', false],
		['#a5e4f0', '#3d91a4', false],
		['#a7dcb4', '#448558', false],
		['#cbcb94', '#848745', false],
		['#fbd5a5', '#c68c42', false],
		['#e9a489', '#af5e3c', false],
		['#f09a9a', '#b03b3b', false],
		['#f9b3e3', '#be5ca0', false],
		['#c3a8e8', '#6b4ba0', false],
		['#b6c4f2', '#5566b0', false],
		['#cbaf95', '#8a6b4c', false],
		['#aec0cc', '#51697a', false],
		['#cfa3b8', '#8e5570', false],
	],
	/* Palette.shellHexes 와 같은 순서. 0번은 그라디언트로 그리므로 색은 쓰이지 않는다. */
	shells: [
		['#8f8677', true],
		['#8f8677', false],
		['#2f7a68', false],
		['#2f5f8c', false],
		['#587028', false],
		['#9a7a1e', false],
		['#95502f', false],
		['#98362f', false],
		['#54408f', false],
		['#8c3f68', false],
		['#7a6141', false],
		['#3c4250', false],
		['#27717f', false],
		['#2a6b41', false],
		['#5b5f28', false],
		['#8f5a1b', false],
		['#84381f', false],
		['#852a2a', false],
		['#8c3573', false],
		['#4a2e7a', false],
		['#334680', false],
		['#5e4227', false],
		['#2f4654', false],
		['#6b2740', false],
	],
	names: {
		ko: [
			'레인보우', '화이트', '민트', '하늘', '라임', '버터', '복숭아', '코랄',
			'라벤더', '로즈', '샌드', '차콜', '아쿠아', '포레스트', '올리브', '살구',
			'벽돌', '체리', '버블검', '그레이프', '페리윙클', '코코아', '슬레이트', '자두',
		],
		en: [
			'Rainbow', 'White', 'Mint', 'Sky', 'Lime', 'Butter', 'Peach', 'Coral',
			'Lavender', 'Rose', 'Sand', 'Charcoal', 'Aqua', 'Forest', 'Olive', 'Apricot',
			'Brick', 'Cherry', 'Bubblegum', 'Grape', 'Periwinkle', 'Cocoa', 'Slate', 'Plum',
		],
	},
	/* SnailAppearance.default — 민트 몸에 화이트 껍데기. 앱 아이콘과 같은 조합. */
	defaultBodyIndex: 2,
	defaultShellIndex: 1,
};

const INK_CLASS = {
	m: 'ink-mark',
	b: 'ink-body',
	d: 'ink-dark',
	s: 'ink-shell',
	S: 'ink-highlight',
	w: 'ink-eye',
};

/* 아트 한 장을 픽셀 <i> 묶음으로 만든다. hasShell 이 false 면 껍데기 픽셀은 버린다. */
function buildFrame(art, hasShell) {
	const frame = document.createElement('span');
	frame.className = 'frame';

	art.forEach((line, row) => {
		for (let column = 0; column < line.length; column += 1) {
			const character = line[column];
			const inkClass = INK_CLASS[character];

			if (!inkClass) {
				continue;
			}

			if (!hasShell && (character === 's' || character === 'S')) {
				continue;
			}

			const pixel = document.createElement('i');
			pixel.className = inkClass;
			pixel.dataset.row = String(row);
			pixel.dataset.column = String(column);
			pixel.style.left = `calc(var(--px) * ${column})`;
			pixel.style.top = `calc(var(--px) * ${row})`;
			frame.appendChild(pixel);
		}
	});

	return frame;
}

/* 달팽이 하나를 그린다.
 *
 * options: { pixelSize, hasShell, walking, bodyIndex, shellIndex } */
function renderSnail(element, options) {
	const settings = Object.assign(
		{
			pixelSize: null,
			hasShell: true,
			walking: true,
			bodyIndex: SnailPalette.defaultBodyIndex,
			shellIndex: SnailPalette.defaultShellIndex,
		},
		options || {}
	);

	element.classList.add('snail');
	element.textContent = '';
	element.setAttribute('aria-hidden', 'true');

	if (settings.pixelSize) {
		element.style.setProperty('--px', `${settings.pixelSize}px`);
	}

	const frameA = buildFrame(
		settings.hasShell ? SnailArt.shellA : SnailArt.bareA,
		settings.hasShell
	);
	frameA.classList.add('frame-a');

	const frameB = buildFrame(
		settings.hasShell ? SnailArt.shellB : SnailArt.bareB,
		settings.hasShell
	);
	frameB.classList.add('frame-b');

	element.appendChild(frameA);
	element.appendChild(frameB);

	setSnailWalking(element, settings.walking);
	setSnailAppearance(element, settings.bodyIndex, settings.shellIndex);

	return element;
}

/* 껍데기 마크 — 목표 마커와 카드 표식에 쓰는 7×6 조각. */
function renderShellMark(element, options) {
	const settings = Object.assign(
		{ pixelSize: null, shellIndex: SnailPalette.defaultShellIndex },
		options || {}
	);

	element.classList.add('shell-mark');
	element.textContent = '';
	element.setAttribute('aria-hidden', 'true');

	if (settings.pixelSize) {
		element.style.setProperty('--px', `${settings.pixelSize}px`);
	}

	element.appendChild(buildFrame(SnailArt.shellMark, true));
	applyShellColor(element, settings.shellIndex);

	return element;
}

/* 앱 아이콘의 마크 — 헤더 워드마크와 App Store 배지, 마무리 단락에 쓴다.
 *
 * 껍데기 마크와 달리 색이 하나뿐이라 팔레트를 받지 않는다. 아이콘이 잉크 한 색으로
 * 그려진 그림이고, 여기서 몸 색을 따라가면 앱 아이콘과 다른 그림이 된다. */
function renderIconMark(element, options) {
	const settings = Object.assign({ pixelSize: null }, options || {});

	element.classList.add('icon-mark');
	element.textContent = '';
	element.setAttribute('aria-hidden', 'true');

	if (settings.pixelSize) {
		element.style.setProperty('--px', `${settings.pixelSize}px`);
	}

	element.appendChild(buildFrame(SnailArt.iconMark, true));

	return element;
}

function setSnailWalking(element, walking) {
	element.classList.toggle('walk', Boolean(walking));
}

/* 껍데기를 되찾았는지 여부는 몸 아트 자체가 다르므로 다시 그린다. */
function setSnailShell(element, hasShell, walking) {
	const bodyIndex = Number(element.dataset.bodyIndex ?? SnailPalette.defaultBodyIndex);
	const shellIndex = Number(element.dataset.shellIndex ?? SnailPalette.defaultShellIndex);

	renderSnail(element, {
		hasShell: hasShell,
		walking: walking,
		bodyIndex: bodyIndex,
		shellIndex: shellIndex,
	});
}

/* 껍데기 색을 칠한다.
 *
 * 레인보우는 한 색이 아니라 픽셀마다 다른 색이다. 앱의 SnailSprite / ShellMark 는
 * 램프를 대각선으로 훑는다 — rainbowPixels[(row + column) % count]. 전체를 한 색으로
 * 칠하고 hue-rotate 만 거는 것과는 다른 그림이 되므로 같은 식을 그대로 쓴다.
 * 하이라이트 픽셀은 껍데기 색과 무관하게 흰색이므로 색을 따로 얹지 않는다. */
function applyShellColor(element, shellIndex) {
	const shell = SnailPalette.shells[shellIndex] || SnailPalette.shells[SnailPalette.defaultShellIndex];
	const isRainbow = shellIndex === 0;
	const ramp = SnailPalette.rainbowPixels;

	element.dataset.shellIndex = String(shellIndex);
	element.classList.toggle('rainbow-shell', isRainbow);
	element.style.setProperty('--shell-color', isRainbow ? ramp[0] : shell[0]);

	element.querySelectorAll('.ink-shell').forEach((pixel) => {
		if (isRainbow) {
			const diagonal = Number(pixel.dataset.row) + Number(pixel.dataset.column);

			pixel.style.setProperty('--shell-color', ramp[diagonal % ramp.length]);
		} else {
			pixel.style.removeProperty('--shell-color');
		}
	});
}

function setSnailAppearance(element, bodyIndex, shellIndex) {
	const body = SnailPalette.bodies[bodyIndex] || SnailPalette.bodies[SnailPalette.defaultBodyIndex];
	const bodyIsRainbow = bodyIndex === 0;

	element.dataset.bodyIndex = String(bodyIndex);
	element.classList.toggle('rainbow-body', bodyIsRainbow);
	element.style.setProperty('--body-color', body[0]);
	element.style.setProperty('--dark-color', body[1]);
	applyShellColor(element, shellIndex);
}
