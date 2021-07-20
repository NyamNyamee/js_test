// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        getAccessCode();
    } catch (error) {
        console.error(error);
    }
});

let kakako_access_token = ``;
let kakako_access_refresh_token = ``;

/* 카카오 인가코드 정보 요청 */
async function getAccessCode() {
    try {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kauth.kakao.com`;
        let path = `/oauth/authorize`;
        let query = `?response_type=code&client_id=${KAKAO_APP_INWOO_REST_KEY}&redirect_uri=${KAKAO_APP_INWOO_REDIRECT_URI}&response_type=code&state=inwoo&prompt=login`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // 사용할 노드 초기화
        let kakao_search_category = ``;
        let kakao_search_category_a = ``;
        let kakao_search_category_div_text = ``;
        let kakao_confirm_button = ``;

        kakao_search_category = document.querySelector('.kakao_search_category');
        kakao_search_category_a = document.createElement('a');
        kakao_search_category_a.classList.add('index_link');
        kakao_search_category_a.setAttribute('href', response.headers['x-final-url']);
        kakao_search_category_a.setAttribute('target', '_target');
        kakao_search_category_div_text = document.createTextNode('여기를 클릭');

        kakao_search_category_a.appendChild(kakao_search_category_div_text);
        kakao_search_category.prepend(kakao_search_category_a);
        
        kakao_confirm_button = document.querySelector('.kakao_confirm_button');
        kakao_confirm_button.setAttribute('onclick', `javascript:getAccessToken();`);
    } catch (error) {
        console.error(`[카카오 인가코드 응답] ${error}`);
    }
}

/* 카카오 토큰 정보 요청 */
async function getAccessToken() {
    try {
        let kakao_access_code_input = ``;
        kakao_access_code_input = document.getElementById('kakao_access_code_input');

        // API 요청
        let host = `https://kauth.kakao.com`;
        let path = `/oauth/token`;
        let header = {};
        let query = ``;
        let data = new URLSearchParams();
        data.append('grant_type', 'authorization_code');
        data.append('client_id', KAKAO_APP_INWOO_REST_KEY);
        data.append('redirect_uri', KAKAO_APP_INWOO_REDIRECT_URI);
        data.append('code', kakao_access_code_input.value);
        let method = `POST`;
        let auth = {};

        const response = await transmitAndReceive(host, path, query, header, data, method, auth);

        // console.log(`[카카오 토큰요청 응답] ${response}`);

        kakako_access_token = response.data.access_token;
        kakako_access_refresh_token = response.data.refresh_token;

        // 2021.07.20 Todo
        // 토큰요청 성공 시 메인메뉴 셀렉트박스 생성, 옵션 변경 이벤트 발생 시 처리
    } catch (error) {
        console.error(`[카카오 토큰요청 에러] ${error}`);
        alert(`[카카오 토큰요청 에러] ${error}`);
    }
}