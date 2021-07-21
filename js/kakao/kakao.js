// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        getAccessCode();
    } catch (error) {
        console.error(error);
    }
});

// 토큰 정보 초기화
let kakao_access_token = ``;
let kakao_access_refresh_token = ``;

/* 카카오 인가코드 정보 요청 */
async function getAccessCode() {
    try {
        // 사용할 노드 초기화
        let kakao_search_category = ``;
        let kakao_search_category_a = ``;
        let kakao_search_category_div_text = ``;
        let kakao_confirm_button = ``;

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kauth.kakao.com`;
        let path = `/oauth/authorize`;
        let query = `?response_type=code&client_id=${KAKAO_APP_INWOO_REST_KEY}&redirect_uri=${KAKAO_APP_INWOO_REDIRECT_URI}&response_type=code&state=inwoo&prompt=login`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[카카오 인가코드 응답] ${response}`);

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
        alert(`[카카오 인가코드 요청 에러] 잠시 후 재시도해주세요`);
        console.error(`[카카오 인가코드 요청 에러] ${error}`);
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

        kakao_access_token = response.data.access_token;
        kakao_access_refresh_token = response.data.refresh_token;

        // 토큰요청 성공 시 메인메뉴 셀렉트박스 생성, 옵션 변경 이벤트 발생 시 처리
        setMenuAndInput();
    } catch (error) {
        console.error(`[카카오 토큰 요청 에러] 잠시 후 재시도 해주세요`);
        alert(`[카카오 토큰 요청 에러] ${error}`);
    }
}

/* 토큰 요청 성공 시 메뉴 생성 */
function setMenuAndInput() {
    let object_kakao_main_menu = { '00': '선택', '01': '토큰정보', '02': '토큰갱신', '03': '사용자목록', '04': '나에게문자보내기', '05': '언어번역' };
    let kakao_search_category = ``;
    let kakao_index_link = ``;
    let kakao_input_label = ``;
    let kakao_menu_select = ``;
    let kakao_menu_select_option = ``;
    let kakao_menu_select_option_text = ``;

    kakao_search_category = document.querySelector('.kakao_search_category');
    kakao_index_link = document.querySelector('.kakao_search_category > a');
    kakao_input_label = document.querySelector('.kakao_search_category > label');

    // 셀렉트박스 생성
    kakao_menu_select = document.createElement('select');
    kakao_menu_select.classList.add('kakao_menu_select');
    for (kakao_main_menu in object_kakao_main_menu) {
        kakao_menu_select_option = document.createElement('option');
        kakao_menu_select_option.setAttribute('value', kakao_main_menu);
        kakao_menu_select_option_text = document.createTextNode(object_kakao_main_menu[kakao_main_menu]);

        kakao_menu_select_option.appendChild(kakao_menu_select_option_text);
        kakao_menu_select.appendChild(kakao_menu_select_option);
    }

    // 셀렉트박스 이벤트 지정
    kakao_menu_select.setAttribute('onchange', `javascript:changeMainMenu();`)

    // 다른거 지우고 셀렉트박스 부착
    kakao_search_category.removeChild(kakao_index_link);
    kakao_search_category.removeChild(kakao_input_label);
    kakao_search_category.appendChild(kakao_menu_select);
}

/* 메인 셀렉트박스 변경 이벤트 핸들러 */
function changeMainMenu() {
    let kakao_menu_select = ``;
    let kakao_result_div = ``;
    let kakao_result_table = ``;
    let kakao_result_table_th = ``;
    let kakao_result_table_th_text = ``;
    let kakao_result_table_tr = ``;
    let kakao_result_table_td = ``;
    let kakao_result_table_td_text = ``;
    let kakao_token_columns = ['App ID', '회원번호', '만료시간'];
    let kakao_token_app_id = ``;
    let kakao_token_id = ``;
    let kakao_token_expire_time = ``;

    kakao_menu_select = document.querySelector('.kakao_menu_select');
    kakao_result_div = document.querySelector('.kakao_result_div');
    kakao_result_table.classList.add('kakao_result_table');

    switch (kakao_menu_select.value) {
        case '00': // 선택

            break;
        case '01': // 토큰정보요청
            kakao_token_columns.forEach((kakao_token_column) => {
                kakao_result_table_th = document.createElement('th');
                kakao_result_table_th_text = document.createTextNode(kakao_token_column);
                kakao_result_table_th.appendChild(kakao_result_table_th_text);
                kakao_result_table.appendChild(kakao_result_table_th);
            });
            getKaKaoTokenInfo().then(response => {
                kakao_token_app_id = response.data.app_id;
                kakao_token_id = response.data.id;
                kakao_token_expire_time = response.data.expires_in;

                // Todo. 2021-07-21 기존 테이블 제거하고 새로 태이블 만들어야 함
                kakao_result_table = document.querySelector('.kakao_result_table');
                if (kakao_result_table) {
                    kakao_result_div.removeChild(kakao_result_table);
                } else {
                    kakao_result_table = document.createElement('table');
                    kakao_result_table.classList.add('kakao_result_table');
                }

                kakao_result_table_tr = document.createElement('tr');

                kakao_result_table_td = document.createElement('td');
                kakao_result_table_td_text = document.createTextNode(kakao_token_app_id);
                kakao_result_table_td.appendChild(kakao_result_table_td_text);
                kakao_result_table_tr.appendChild(kakao_result_table_td);

                kakao_result_table_td = document.createElement('td');
                kakao_result_table_td_text = document.createTextNode(kakao_token_id);
                kakao_result_table_td.appendChild(kakao_result_table_td_text);
                kakao_result_table_tr.appendChild(kakao_result_table_td);

                kakao_result_table_td = document.createElement('td');
                kakao_result_table_td_text = document.createTextNode(`${Math.round(kakao_token_expire_time / 60)}분 ${kakao_token_expire_time % 60}초`);
                kakao_result_table_td.appendChild(kakao_result_table_td_text);
                kakao_result_table_tr.appendChild(kakao_result_table_td);

                kakao_result_table.appendChild(kakao_result_table_tr);

                kakao_result_div.appendChild(kakao_result_table);
            }).catch((error) => {
                alert(`[카카오 토큰정보 에러] ${error}`);
            });
            break;
        case '02': // 토큰갱신
            refreshKakaoToken().then(response => {
                kakao_access_token = response.data.access_token;
                alert('카카오 토큰이 성공적으로 갱신되었습니다.');
            }).catch(error => {
                alert(`[카카오 토큰갱신 에러] ${error}`);
            });
            break;
        case '03': // 사용자목록

            break;
        case '04': // 나에게 문자보내기

            break;
        case '05': // 언어 번역

            break;
    }
}

/* 카카오 토큰정보 요청 */
function getKaKaoTokenInfo() {
    let response = null;

    return new Promise((resolve, reject) => {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kapi.kakao.com`;
        let path = `/v1/user/access_token_info`;
        let query = ``;
        let headers = {
            'Authorization': `Bearer ${kakao_access_token}`,
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        let data = ``;
        let method = `GET`;

        url = host + path + query;

        response = axios({
            url,
            method,
            headers
        });

        if (response) {
            resolve(response);
        } else {
            reject('[카카오 토큰정보 요청 에러]');
        }
    });
}

/* 카카오 토큰갱신 */
function refreshKakaoToken() {
    let response = null;

    return new Promise((resolve, reject) => {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kauth.kakao.com`;
        let path = `/oauth/token`;
        let query = ``;
        let headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        let data = new URLSearchParams();
        data.append('grant_type', 'refresh_token');
        data.append('client_id', KAKAO_APP_INWOO_REST_KEY);
        data.append('refresh_token', kakao_access_refresh_token);
        let method = `POST`;

        url = host + path + query;

        response = axios({
            url,
            data,
            method,
            headers
        });

        if (response) {
            resolve(response);
        } else {
            reject('[카카오 토큰갱신 요청 에러]');
        }
    });
}