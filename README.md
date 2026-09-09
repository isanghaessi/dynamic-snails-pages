# pangle-pages

iOS 앱 **팽글**(Pangle)의 공개 웹사이트. GitHub Pages 에서 정적으로 서비스한다.
<https://pangle.kro.kr>

| 경로 | 역할 |
|---|---|
| `/` | 랜딩 페이지 |
| `/privacy/` | 개인정보처리방침 |
| `/support/` | 지원 · FAQ |

세 페이지 모두 한국어·영어 두 언어를 담고 있고, 상단 토글로 바꾼다.

## 구조

```
index.html            랜딩
privacy/index.html    개인정보처리방침
support/index.html    지원 · FAQ
404.html              없는 주소
assets/css/site.css   디자인 토큰과 레이아웃
assets/css/fonts.css  Galmuri11 @font-face 선언
assets/js/snail.js    픽셀 달팽이 스프라이트와 팔레트
assets/js/site.js     언어 토글과 페이지 안의 데모
assets/fonts/         Galmuri11 서브셋 (OFL 1.1, 라이선스 원문 동봉)
assets/img/           아이콘 파생 이미지와 OG 이미지
assets/img/app/       실제 앱 화면
CNAME                 pangle.kro.kr
.nojekyll             Jekyll 처리 없이 파일 그대로 서비스
```

의존성도 빌드 단계도 없다. 파일을 그대로 올리면 그게 사이트다.

## 로컬에서 보기

절대 경로(`/assets/...`)를 쓰므로 루트에서 서버를 띄워야 한다.
`file://` 로 열면 CSS 가 붙지 않는다.

```bash
python3 -m http.server 8899
```

## 배포

`main` 브랜치의 루트를 GitHub Pages 가 그대로 서비스한다. push 하면 배포된다.
커스텀 도메인은 `CNAME` 파일이 정한다.

## 라이선스

번들된 Galmuri11 은 SIL Open Font License 1.1 이며, 라이선스 원문을
`assets/fonts/Galmuri-OFL.txt` 로 함께 배포한다.
