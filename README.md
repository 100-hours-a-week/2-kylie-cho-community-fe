# 💬 커뮤니티 레이아웃 만들기

> 카카오 부트캠프 풀스택 3차 과제 (2)

사용자가 자유롭게 게시글을 작성하고, 수정 및 삭제할 수 있는 게시판 시스템의 레이아웃 만들기 프로젝트입니다.

## 기능

1. 로그인 / 회원가입
2. 게시글 작성
3. 게시글 목록 조회
4. 게시글 상세 조회
5. 게시글 수정 및 삭제
6. 회원정보 수정
7. 비밀번호 수정
8. 로그아웃

## 기술 스택

- HTML
- CSS
- Vanila.js

## 실행 화면

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

## 회고

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