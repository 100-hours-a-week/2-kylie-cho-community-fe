# 💬 커뮤니티 레이아웃 만들기

> 카카오 부트캠프 풀스택 3차 과제 (2)
> 카카오 부트캠프 풀스택 4차 과제 (2)

사용자가 자유롭게 게시글을 작성하고, 수정 및 삭제할 수 있는 게시판 시스템의 레이아웃 만들기 프로젝트입니다.

- 3차 과제 : 레이아웃 만들기
- 4차 과제 : 이벤트 처리 및 fetch API 적용

## 기능

1. 로그인 / 회원가입
2. 게시글 작성
3. 게시글 목록 조회
4. 게시글 상세 조회
5. 게시글 수정 및 삭제
6. 댓글 작성
7. 댓글 수정 및 삭제
8. 회원정보 수정
9. 비밀번호 수정
10. 로그아웃

## 기술 스택

- HTML
- CSS
- Vanila.js

## 실행 화면 - 3차 과제

<table>
  <tr>
    <td><img src="image/community-fe-login.png" width="300" /></td>
    <td><img src="image/community-fe-register.png" width="300" /></td>
    <td><img src="image/community-fe-post-list.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="image/community-fe-add-post.png" width="300" /></td>
    <td><img src="image/community-fe-post-detail.png" width="300" /></td>
    <td><img src="image/community-fe-update-post.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="image/community-fe-post-delete-modal.png" width="300" /></td>
    <td><img src="image/community-fe-update-password.png" width="300" /></td>
    <td></td>
  </tr>
</table>

## 회고 - 3차 과제

### 어려웠던 점
    - 리액트 같은 프레임워크 없이 작성하려고 하니 어려웠다.
    - 코드 가독성이 좋지 않고, 특히 css 파일에서 태그들을 구분하는 것이 엄청 헷갈렸다.
    - 헷갈리지 않기 위해 태그의 class 속성 이름을 최대한 명확하게 지어보려고 노력했다.
### 아쉬웠던 점
    - 로그인.회원가입 → input 태그와 button 태그의 너비가 맞지 않는다.
    - 게시글 수정 → 기존에 작성한 내용을 불러와야 한다.
    - 게시글 상세조회 → 레이아웃을 안 지켰다. (댓글 부분도 없음)
    - 프로필 아이콘 메뉴바 → 한번 더 클릭하면 사라져야 하는데 계속 남아있다.
    - 회원정보 수정 → 구현 안함
    - 중복이 많은 코드를 컴포넌트처럼 재사용할 수 없을까?

## 실행 화면 - 4차 과제
<table>
  <tr>
    <td><img src="image/login-page.png" width="300" /></td>
    <td><img src="image/signup-page.png" width="300" /></td>
    <td><img src="image/post-list-page.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="image/post-create-page.png" width="300" /></td>
    <td><img src="image/post-detail-page.png" width="300" /></td>
    <td><img src="image/post-update-page.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="image/info-update-before-page.png" width="300" /></td>
    <td><img src="image/info-update-after-page.png" width="300" /></td>
    <td><img src="image/password-update-page.png" width="300" /></td>
  </tr>
  <tr>
    <td><img src="image/menubar.png" width="300" /></td>
    <td><img src="image/comment-update.png" width="300" /></td>
    <td></td>
  </tr>
</table>

## 회고 - 4차 과제

### 어려웠던 점
- html, css, js 모두 1개의 파일만 사용해야 하는 줄 알고 그렇게 작성했다.<br>다른 분들의 과제 제출을 보고나서 파일을 여러 개로 나눠도 된다는 걸 뒤늦게 깨달았다…<br>파일을 하나씩만 사용해 작성하니 가독성이 현저히 떨어지고, 코드 작성 및 수정 시 매우 헷갈렸다.
- 레이아웃을 Figma 예시와 똑같이 만드는 것이 어려웠다.<br>Figma 레이아웃에 따라 코드를 작성하는 연습이 더 필요할 것 같다.
- 더미 데이터를 위해 JSONPlaceholder를 처음 사용해보았다.<br>js 파일 내에 더미 데이터를 직접 생성하는 것보다 훨씬 간편했다.<br>DB 연결 전, 이벤트 처리가 잘 작동하는지 확인하는 용도로 사용하기 아주 좋을 것 같다.
- 텍스트보다 이미지 관련 처리가 더 어렵게 느껴졌다.<br>버튼 클릭 시 파일 선택창이 뜨도록 하는 것과 기존 이미지를 불러오는 것은 처음 구현해보았다.

### 아쉬웠던 점
- 게시물이나 댓글 내용을 나타내는 방법으로 js 파일 내에 html 코드를 작성하는 방식을 택했다.<br>html, css, js 코드를 각각 분리하는 것이 더 좋다고 생각하기 때문에 js 파일 내 작성한 html 코드를 html 파일에서 표현할 수 있는 방법을 찾아보고 싶다.

### 트러블 슈팅

- 로그인 페이지에서 이메일/비밀번호 입력 창의 너비와 로그인 버튼의 너비가 맞지 않는 문제
    - css 작성 시 너비 관련 속성을 `input {}`이 아닌 `.tab input {}`에 선언해야 제대로 적용된다는 것을 깨달아 문제를 해결했다.