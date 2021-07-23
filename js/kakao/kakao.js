// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        kakaoPageInitialize();
    } catch (error) {
        console.error(error);
    }
});

// 토큰 정보 초기화
let kakao_access_token = ``;
let kakao_access_refresh_token = ``;

/* 페이지 이니시 */
async function kakaoPageInitialize() {
    // 사용할 노드, 응답 초기화
    let kakao_search_div = ``;
    let kakao_search_category = ``;
    let kakao_guide_message_text = ``;
    let kakao_search_category_a = ``;
    let kakao_search_category_div_text = ``;
    let kakao_confirm_button = ``;
    let response = null;

    // 접근요청 성공시까지 메뉴 숨기고 대기문구 노출
    kakao_search_div = document.querySelector('.kakao_search_div');
    kakao_search_category = document.querySelector('.kakao_search_category');
    kakao_search_category.setAttribute('class', 'before_initializing');
    kakao_guide_message_text = document.createTextNode('카카오 접근 권한을 요청하고 있습니다...');
    kakao_search_div.appendChild(kakao_guide_message_text);
    
    // 접근코드 요청
    response = await kakaoGetAccessCode();
    if (typeof(response) === 'string') {
        alert('[카카오 접근 코드 요청 에러] 잠시 후 다시 시도해 주세요');
        return;
    }

    // 성공 시 메뉴 노출, 대기문구 제거
    kakao_search_category.setAttribute('class', 'kakao_search_category');
    kakao_search_div.removeChild(kakao_guide_message_text);

    kakao_search_category = document.querySelector('.kakao_search_category');
    kakao_search_category_a = document.createElement('a');
    kakao_search_category_a.classList.add('index_link');
    kakao_search_category_a.setAttribute('href', response.headers['x-final-url']);
    kakao_search_category_a.setAttribute('target', '_target');
    kakao_search_category_div_text = document.createTextNode('여기를 클릭');

    kakao_search_category_a.appendChild(kakao_search_category_div_text);
    kakao_search_category.prepend(kakao_search_category_a);

    kakao_confirm_button = document.querySelector('.kakao_confirm_button');
    kakao_confirm_button.setAttribute('onclick', `javascript:kakaoGetAccessToken();`);
}

/* 카카오 인가코드 정보 요청 */
async function kakaoGetAccessCode() {
    try {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kauth.kakao.com`;
        let path = `/oauth/authorize`;
        let query = `?response_type=code&client_id=${KAKAO_APP_INWOO_REST_KEY}&redirect_uri=${KAKAO_APP_INWOO_REDIRECT_URI}&response_type=code&state=inwoo&prompt=login`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[카카오 인가코드 응답] ${response}`);

        return response;
    } catch (error) {
        alert(`[카카오 인가코드 요청 에러] 잠시 후 재시도해주세요`);
        console.error(`[카카오 인가코드 요청 에러] ${error}`);
    }
}

/* 카카오 토큰 정보 요청 */
async function kakaoGetAccessToken() {
    try {
        let kakao_access_code_input = ``;
        kakao_access_code_input = document.getElementById('kakao_access_code_input');
        if (kakao_access_code_input.value.length != 86) {
            alert('올바른 코드를 입력해 주세요');
        }

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
    let kakao_search_category = ``;
    let kakao_result_div = ``;
    let kakao_result_table = ``;
    let kakao_result_table_th = ``;
    let kakao_result_table_th_text = ``;
    let kakao_result_table_tr = ``;
    let kakao_result_table_td = ``;
    let kakao_result_table_td_text = ``;
    let kakao_result_table_td_a = ``;
    let kakao_token_columns = ['App ID', '회원번호', '만료시간'];
    let kakao_token_app_id = ``;
    let kakao_token_id = ``;
    let kakao_token_expire_time = ``;
    let kakao_app_user_columns = ['번호', '회원번호'];
    let kakao_app_user_elements = ``;

    kakao_menu_select = document.querySelector('.kakao_menu_select');
    kakao_search_category = document.querySelector('.kakao_search_category');
    kakao_result_div = document.querySelector('.kakao_result_div');

    switch (kakao_menu_select.value) {
        case '00': // 선택
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);
            break;
        case '01': // 토큰정보요청
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);

            kakaoGetTokenInfo().then(response => {
                kakao_token_app_id = response.data.app_id;
                kakao_token_id = response.data.id;
                kakao_token_expire_time = response.data.expires_in;

                kakao_result_table = document.createElement('table');
                kakao_result_table.classList.add('kakao_result_table');

                kakao_token_columns.forEach((kakao_token_column) => {
                    kakao_result_table_th = document.createElement('th');
                    kakao_result_table_th_text = document.createTextNode(kakao_token_column);
                    kakao_result_table_th.appendChild(kakao_result_table_th_text);
                    kakao_result_table.appendChild(kakao_result_table_th);
                });

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
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);

            kakaoRefreshToken().then(response => {
                kakao_access_token = response.data.access_token;
                alert('카카오 토큰이 성공적으로 갱신되었습니다.');
            }).catch(error => {
                alert(`[카카오 토큰갱신 에러] ${error}`);
            });
            break;
        case '03': // 사용자목록
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);

            kakaoGetAppUserList().then(response => {
                kakao_app_user_total_count = response.data.total_count;
                kakao_app_user_elements = response.data.elements;

                kakao_result_table = document.createElement('table');
                kakao_result_table.classList.add('kakao_result_table');

                kakao_app_user_columns.forEach((kakao_app_user_column) => {
                    kakao_result_table_th = document.createElement('th');
                    kakao_result_table_th_text = document.createTextNode(kakao_app_user_column);
                    kakao_result_table_th.appendChild(kakao_result_table_th_text);
                    kakao_result_table.appendChild(kakao_result_table_th);
                });

                kakao_app_user_elements.forEach((kakao_app_user_element, index) => {
                    kakao_result_table_tr = document.createElement('tr');

                    // 번호
                    kakao_result_table_td = document.createElement('td');
                    kakao_result_table_td_text = document.createTextNode(index + 1);
                    kakao_result_table_td.appendChild(kakao_result_table_td_text);
                    kakao_result_table_tr.appendChild(kakao_result_table_td);

                    // 회원번호 링크
                    kakao_result_table_td_a = document.createElement('a');
                    kakao_result_table_td_a.classList.add('index_link');
                    kakao_result_table_td_a.setAttribute('href', `javascript:kakaoGetAppUserDetailInfo('${kakao_app_user_element}')`);

                    // 회원번호
                    kakao_result_table_td = document.createElement('td');
                    kakao_result_table_td_text = document.createTextNode(kakao_app_user_element);
                    kakao_result_table_td_a.appendChild(kakao_result_table_td_text);
                    kakao_result_table_td.appendChild(kakao_result_table_td_a);
                    kakao_result_table_tr.appendChild(kakao_result_table_td);
                });

                kakao_result_table.appendChild(kakao_result_table_tr);

                kakao_result_div.appendChild(kakao_result_table);
            }).catch(error => {
                alert(`[카카오 앱 유저목록 조회 에러] ${error}`);
            });
            break;
        case '04': // 나에게 문자보내기
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);

            setSelfMessageMenu();
            break;
        case '05': // 언어 번역
            // 하위 태그 제거
            removeLowerTags(kakao_search_category, 'input', 0);
            removeLowerTags(kakao_search_category, 'button', 0);
            removeLowerTags(kakao_search_category, 'label', 0);
            removeLowerTags(kakao_result_div, 'table', 0);
            removeLowerTags(kakao_result_div, 'div', 0);

            setLanguageTranslateMenu();
            break;
    }
}

/* 카카오 토큰정보 요청 */
function kakaoGetTokenInfo() {
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
function kakaoRefreshToken() {
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

/* 카카오 앱 유저리스트 */
function kakaoGetAppUserList() {
    let response = null;

    return new Promise((resolve, reject) => {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kapi.kakao.com`;
        let path = `/v1/user/ids`;
        let query = `?limit=100`;
        let headers = {
            'Authorization': `KakaoAK ${KAKAO_APP_INWOO_ADMIN_KEY}`,
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
            reject('[카카오 앱 유저리스트 요청 에러]');
        }
    });
}

/* 카카오 앱 유저 상세정보 */
async function kakaoGetAppUserDetailInfo(user_id) {
    try {
        if (!user_id) {
            alert('상세정보를 조회할 수 없는 회원번호입니다');
            return;
        }

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kapi.kakao.com`;
        let path = `/v2/user/me`;
        let query = ``;
        let headers = {
            'Authorization': `KakaoAK ${KAKAO_APP_INWOO_ADMIN_KEY}`,
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        let data = new URLSearchParams();
        data.append('target_id_type', 'user_id');
        data.append('target_id', user_id);
        let method = `POST`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        //  console.log(`[카카오 유저 상세정보 응답] ${response}`);

        // 결과가 나타날 div
        let kakao_result_div = document.querySelector('div.kakao_result_div');

        // 하위 태그 제거
        removeLowerTags(kakao_result_div, 'table', 1);

        // 생성할 태그 초기화
        let kakao_result_detail_table_th = ``;
        let kakao_result_detail_table_th_text = ``;
        let kakao_result_detail_table_tr = ``;
        let kakao_result_detail_table_td = ``;
        let kakao_result_detail_table_td_text = ``;
        let kakao_result_detail_table_img = ``;

        // table 태그 생성
        kakao_result_detail_table = document.createElement('table');
        kakao_result_detail_table.classList.add('kakao_result_table'); // kakao_result_detail_table.setAttribute('class', 'kakao_result_detail_table');
        kakao_result_div.appendChild(kakao_result_detail_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['회원번호', `${KAKAO_APP_INWOO_NAME} 앱 가입일`, '닉네임', '프로필이미지', '이메일', '연령대', '생일', '성별'];
        th_tag_values.forEach((th_tag_value) => {
            kakao_result_detail_table_th = document.createElement('th');
            kakao_result_detail_table_th_text = document.createTextNode(th_tag_value);
            kakao_result_detail_table_th.appendChild(kakao_result_detail_table_th_text);
            kakao_result_detail_table.appendChild(kakao_result_detail_table_th);
        });

        // 응답 데이터를 결과테이블에 입력
        let object_data = response.data;

        let kakao_inwoo_app_user_id = object_data['id']
        let kakao_inwoo_connected_time = object_data['connected_at']
        let kakao_inwoo_app_account_info = object_data['kakao_account']
        let kakao_inwoo_app_account_profile = kakao_inwoo_app_account_info['profile']
        let kakao_inwoo_app_account_profile_nickname = kakao_inwoo_app_account_profile['nickname']
        let kakao_inwoo_app_account_profile_image_url = kakao_inwoo_app_account_profile['thumbnail_image_url']
        let kakao_inwoo_app_account_profile_email = kakao_inwoo_app_account_info['email']
        let kakao_inwoo_app_account_profile_age_range = kakao_inwoo_app_account_info['age_range']
        let kakao_inwoo_app_account_profile_birthday = kakao_inwoo_app_account_info['birthday']
        let kakao_inwoo_app_account_profile_gender = kakao_inwoo_app_account_info['gender']

        kakao_inwoo_connected_time = kakao_inwoo_connected_time.split('T')[0];

        // tr생성
        kakao_result_detail_table_tr = document.createElement('tr');

        // 테이블 내용 배열 생성, td태그 생성
        let td_tag_values = [kakao_inwoo_app_user_id, kakao_inwoo_connected_time, kakao_inwoo_app_account_profile_nickname, kakao_inwoo_app_account_profile_image_url, kakao_inwoo_app_account_profile_email, kakao_inwoo_app_account_profile_age_range, kakao_inwoo_app_account_profile_birthday, kakao_inwoo_app_account_profile_gender];
        td_tag_values.forEach((td_tag_value, index) => {
            kakao_result_detail_table_td = document.createElement('td');
            if (index === 3) {
                kakao_result_detail_table_img = document.createElement('img');
                kakao_result_detail_table_img.setAttribute('src', td_tag_value);
                kakao_result_detail_table_img.setAttribute('alt', '미확인');
                kakao_result_detail_table_td.appendChild(kakao_result_detail_table_img);
            } else {
                kakao_result_detail_table_td_text = document.createTextNode(td_tag_value);
                kakao_result_detail_table_td.appendChild(kakao_result_detail_table_td_text);
            }
            kakao_result_detail_table_tr.appendChild(kakao_result_detail_table_td);
        });

        // 테이블에 붙이기
        kakao_result_detail_table.appendChild(kakao_result_detail_table_tr);

    } catch (error) {
        console.error(`[카카오 유저 상세정보 에러] ${error}`);
    }
}

/* 카카오 나에게 문자보내기 메뉴세팅 */
function setSelfMessageMenu() {
    let kakao_search_category = ``;
    let kakao_send_message_input = ``;
    let kakao_send_message_button = ``;
    let kakao_send_message_button_text = ``;

    kakao_search_category = document.querySelector('.kakao_search_category');

    // 입력란 생성
    kakao_send_message_input = document.createElement('input');
    kakao_send_message_input.setAttribute('type', 'text');
    kakao_send_message_input.setAttribute('class', 'kakao_input');
    kakao_send_message_input.setAttribute('placeHolder', '전송할 내용');
    kakao_search_category.appendChild(kakao_send_message_input);

    // 입력버튼 생성
    kakao_send_message_button = document.createElement('button');
    kakao_send_message_button.setAttribute('id', 'kakao_send_message_button');
    kakao_send_message_button_text = document.createTextNode('확인');
    kakao_send_message_button.setAttribute('onclick', 'kakaoSendSelfMessage();')
    kakao_send_message_button.appendChild(kakao_send_message_button_text);
    kakao_search_category.appendChild(kakao_send_message_button);
}

/* 카카오 나에게문자보내기 */
async function kakaoSendSelfMessage() {
    try {
        let kakao_send_message_input = ``;
        let kakao_send_message_button = ``;

        kakao_send_message_input = document.querySelector('.kakao_input');
        kakao_send_message_button = document.getElementById('kakao_send_message_button');
        setEnableTags(kakao_send_message_button, false);

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://kapi.kakao.com`;
        let path = `/v2/api/talk/memo/default/send`;
        let query = ``;
        let headers = {
            'Authorization': `Bearer ${kakao_access_token}`
        };
        let data = new URLSearchParams();
        let template_object = {
            "object_type": "feed",
            "content": {
                "title": "카카오 나에게 문자보내기 테스트",
                "image_url": "https://miro.medium.com/max/325/1*Je4yF-xdHEluVvmS0qw8JQ.png",
                "image_width": 10,
                "image_height": 10,
                "description": kakao_send_message_input.value,
                "link": {
                    "web_url": KAKAO_APP_INWOO_REDIRECT_URI,
                    "mobile_web_url": KAKAO_APP_INWOO_REDIRECT_URI
                }
            },
            "social": {
                "like_count": 41,
                "comment_count": 36,
                "view_count": 260,
            },
            "button_title": "Visit NyamNyamee.Github"
        }
        data.append('template_object', JSON.stringify(template_object)); // 객체를 json형태의 문자열로 변환 후 데이터에 담음
        let method = `POST`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        // console.error(`[카카오 나에게 문자보내기 응답] ${error}`);

        if (response.data.result_code === 0) {
            kakao_send_message_input.value = ``;
            kakao_send_message_input.focus();
            kakao_send_message_input.setAttribute('placeHolder', '메시지 전송 성공!');
            setEnableTags(kakao_send_message_button, true);
        } else {
            alert(`메시지 전송에 실패했습니다. 응답코드: ${response.data.result_code}`);
        }
    } catch (error) {
        console.error(`[카카오 나에게 문자보내기 에러] ${error}`);
    }
}

/* 카카오 언어 번역 메뉴 세팅 */
function setLanguageTranslateMenu() {
    let kakao_search_category = ``;
    let kakao_menu_label = ``;
    let kakao_menu_label_text = ``;
    let kakao_menu_select = ``;
    let kakao_menu_option = ``;
    let kakao_menu_option_text = ``;
    let kakao_language_translate_input = ``;
    let kakao_language_translate_button = ``;
    let kakao_language_translate_button_text = ``;
    let kakao_language_translate_options = {
        '한글': 'kr',
        '영어': 'en',
        '일본어': 'jp',
        '중국어': 'cn',
        '베트남어': 'vi',
        '인도네시아어': 'id',
        '아랍어': 'ar',
        '뱅갈어': 'bn',
        '독일어': 'de',
        '스페인어': 'es',
        '프랑스어': 'fr',
        '힌디어': 'hi',
        '이탈리아어': 'it',
        '말레이시아어': 'ms',
        '네덜란드어': 'nl',
        '포르투갈어': 'pt',
        '러시아어': 'ru',
        '태국어': 'th',
        '터키어': 'tr'
    };
    let kakao_language_translate_exhange_a = ``;
    let kakao_language_translate_exhange_img = ``;

    kakao_search_category = document.querySelector('.kakao_search_category');

    // 인풋 라벨 생성
    kakao_menu_label = document.createElement('label');
    kakao_menu_label.setAttribute('for', 'kakao_translate_input_language');
    kakao_menu_label_text = document.createTextNode('입력 언어')
    kakao_menu_label.appendChild(kakao_menu_label_text);

    // 인풋 셀렉트박스 생성
    kakao_menu_select = document.createElement('select');
    kakao_menu_select.setAttribute('id', 'kakao_translate_input_language');
    kakao_menu_select.classList.add('kakao_menu_select');
    kakao_menu_select.setAttribute('onchange', `exceptCurrentOption();`);
    for (kakao_language_translate_option in kakao_language_translate_options) {
        kakao_menu_option = document.createElement('option');
        // 영어옵션 숨기기 (초기값 지정)
        if (kakao_language_translate_option === '영어') {
            setEnableTags(kakao_menu_option, false);
        }
        kakao_menu_option.setAttribute('value', kakao_language_translate_options[kakao_language_translate_option]);
        kakao_menu_option_text = document.createTextNode(kakao_language_translate_option);
        kakao_menu_option.appendChild(kakao_menu_option_text);
        kakao_menu_select.appendChild(kakao_menu_option);
    }
    kakao_menu_label.appendChild(kakao_menu_select);
    kakao_search_category.appendChild(kakao_menu_label);

    // 옵션 맞교환 링크, 이미지 생성
    kakao_language_translate_exhange_a = document.createElement('a');
    kakao_language_translate_exhange_a.setAttribute('href', 'javascript:exchangeOppositeOption();');
    kakao_language_translate_exhange_img = document.createElement('img');
    kakao_language_translate_exhange_img.classList.add('kakao_util_img');
    kakao_language_translate_exhange_img.setAttribute('src', '../../resources/image/exchangeIcon.png');
    kakao_language_translate_exhange_img.setAttribute('alt', '미확인');
    kakao_language_translate_exhange_a.appendChild(kakao_language_translate_exhange_img);
    // Todo. 2021-07-23 입출력 언어 맞교환 잘 안되서 일단 보류
    // kakao_search_category.appendChild(kakao_language_translate_exhange_a);

    // 아웃풋 라벨 생성
    kakao_menu_label = document.createElement('label');
    kakao_menu_label.setAttribute('for', 'kakao_translate_output_language');
    kakao_menu_label_text = document.createTextNode('출력 언어');
    kakao_menu_label.appendChild(kakao_menu_label_text);

    // 아웃풋 셀렉트박스 생성
    kakao_menu_select = document.createElement('select');
    kakao_menu_select.setAttribute('id', 'kakao_translate_output_language');
    kakao_menu_select.classList.add('kakao_menu_select');
    kakao_menu_select.setAttribute('onchange', `exceptCurrentOption();`);
    for (kakao_language_translate_option in kakao_language_translate_options) {
        kakao_menu_option = document.createElement('option');
        // 한글이면 숨기고 영어일때 선택되게 (초기값 지정)
        if (kakao_language_translate_option === '한글') {
            setEnableTags(kakao_menu_option, false);
        } else if (kakao_language_translate_option === '영어') {
            kakao_menu_option.setAttribute('selected', 'selected');
        }
        kakao_menu_option.setAttribute('value', kakao_language_translate_options[kakao_language_translate_option]);
        kakao_menu_option_text = document.createTextNode(kakao_language_translate_option);
        kakao_menu_option.appendChild(kakao_menu_option_text);
        kakao_menu_select.appendChild(kakao_menu_option);
    }
    kakao_menu_label.appendChild(kakao_menu_select);
    kakao_search_category.appendChild(kakao_menu_label);

    // 입력란 생성
    kakao_language_translate_input = document.createElement('input');
    kakao_language_translate_input.setAttribute('type', 'text');
    kakao_language_translate_input.setAttribute('class', 'kakao_input');
    kakao_language_translate_input.setAttribute('placeHolder', '번역할 내용');
    kakao_search_category.appendChild(kakao_language_translate_input);

    // 입력버튼 생성
    kakao_language_translate_button = document.createElement('button');
    kakao_language_translate_button.setAttribute('id', 'kakao_language_translate_button');
    kakao_language_translate_button_text = document.createTextNode('확인');
    kakao_language_translate_button.setAttribute('onclick', 'kakaoLanguageTranslate();')
    kakao_language_translate_button.appendChild(kakao_language_translate_button_text);
    kakao_search_category.appendChild(kakao_language_translate_button);
}

/* 카카오 언어번역 */
async function kakaoLanguageTranslate() {
    try {
        let kakao_menu_select = ``;
        let kakao_translate_input_language_select_value = ``;
        let kakao_translate_output_language_select_value = ``;
        let kakao_translate_input_language_input = ``;
        let kakao_translate_input_language_input_value = ``;
        let kakao_result_div = ``;
        let kakao_translate_output_language_result_div = ``;
        let kakao_translate_output_language_result_text = ``;
        let kakao_language_translate_button = ``;

        kakao_language_translate_button = document.getElementById('kakao_language_translate_button');
        setEnableTags(kakao_language_translate_button, false);

        // 셀렉트, 인풋 값 저장
        kakao_menu_select = document.getElementById('kakao_translate_input_language');
        kakao_translate_input_language_select_value = kakao_menu_select.value;
        kakao_menu_select = document.getElementById('kakao_translate_output_language');
        kakao_translate_output_language_select_value = kakao_menu_select.value;
        kakao_translate_input_language_input = document.querySelector('.kakao_input');
        kakao_translate_input_language_input_value = kakao_translate_input_language_input.value;

        // 유효성검사
        if (kakao_translate_input_language_select_value === kakao_translate_output_language_select_value) {
            alert('서로 다른 언어로만 번역할 수 있습니다');
            setEnableTags(kakao_language_translate_button, true);
            return;
        } else if (kakao_translate_input_language_input_value.trim().length === 0) {
            alert('공백은 입력할 수 없습니다');
            setEnableTags(kakao_language_translate_button, true);
            return;
        }

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://dapi.kakao.com`;
        let path = `/v2/translation/translate`;
        let query = ``;
        let headers = {
            'Authorization': `KakaoAK ${KAKAO_APP_INWOO_ADMIN_KEY}`,
            'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'
        };
        let data = new URLSearchParams();
        data.append('src_lang', kakao_translate_input_language_select_value);
        data.append('target_lang', kakao_translate_output_language_select_value);
        data.append('query', kakao_translate_input_language_input_value);
        let method = `POST`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        //  console.log(`[카카오 언어번역 응답] ${response}`);

        setEnableTags(kakao_language_translate_button, true);
        // 결과값 저장
        kakao_result_div = document.querySelector('.kakao_result_div');
        kakao_translate_output_language_result_div = kakao_result_div.querySelector('div');
        if(kakao_translate_output_language_result_div) {
            kakao_result_div.removeChild(kakao_translate_output_language_result_div);
        }
        kakao_translate_output_language_result_div = document.createElement('div');
        kakao_translate_output_language_result_text = document.createTextNode(`번역 결과: ${response.data.translated_text[0]}`);
        kakao_translate_output_language_result_div.append(kakao_translate_output_language_result_text);
        kakao_result_div.append(kakao_translate_output_language_result_div);
    } catch (error) {
        alert(`[카카오 언어번역 에러] ${response}`);
        console.error(`[카카오 언어번역 에러] ${response}`);
    }
}

/* 언어번역 입력언어 선택 시 출력언어 옵션에서 해당 제거 혹은 그 반대 */
function exceptCurrentOption() {
    let kakao_menu_input_select = document.getElementById('kakao_translate_input_language');
    let kakao_menu_input_select_value = ``;
    let kakao_menu_input_options = ``;
    let kakao_menu_output_select = document.getElementById('kakao_translate_output_language');
    let kakao_menu_output_select_value = ``;
    let kakao_menu_output_options = ``;

    kakao_menu_input_select_value = kakao_menu_input_select.value;
    kakao_menu_output_options = document.querySelectorAll('#kakao_translate_output_language > option');
    kakao_menu_output_options.forEach(kakao_menu_output_option => {
        if (kakao_menu_input_select_value === kakao_menu_output_option.value) {
            setEnableTags(kakao_menu_output_option, false);
        } else {
            setEnableTags(kakao_menu_output_option, true);
        }
    });

    kakao_menu_output_select_value = kakao_menu_output_select.value;
    kakao_menu_input_options = document.querySelectorAll('#kakao_translate_input_language > option');
    kakao_menu_input_options.forEach(kakao_menu_input_option => {
        if (kakao_menu_output_select_value === kakao_menu_input_option.value) {
            setEnableTags(kakao_menu_input_option, false);
        } else {
            setEnableTags(kakao_menu_input_option, true);
        }
    });
}

/* 언어번역 입출력 언어 반대로 교환 */
/* 잘 안되서 일단 보류 */
function exchangeOppositeOption() {
    let kakao_menu_input_select = document.getElementById('kakao_translate_input_language');
    let kakao_menu_input_select_value = ``;
    let kakao_menu_input_options = ``;
    let kakao_menu_output_select = document.getElementById('kakao_translate_output_language');
    let kakao_menu_output_select_value = ``;
    let kakao_menu_output_options = ``;

    let temp_value = ``;

    kakao_menu_input_select_value = kakao_menu_input_select.value;
    kakao_menu_input_options = document.querySelectorAll('#kakao_translate_input_language > option');

    kakao_menu_output_select_value = kakao_menu_output_select.value;
    kakao_menu_output_options = document.querySelectorAll('#kakao_translate_output_language > option');

    // 입력언어 옵션 반복하며 출력언어 선택옵션과 동일한 옵션 발견 시 해당 언어로 입력언어 변경
    kakao_menu_input_options.forEach(kakao_menu_input_option => {
        if (kakao_menu_input_option.value === kakao_menu_output_select_value) {
            kakao_menu_input_option.setAttribute('selected', 'selected');
        } else {
            kakao_menu_input_option.removeAttribute('selected');
        }
    });

    // 출력언어 옵션 반복하며 입력언어 선택옵션과 동일한 옵션 발견 시 해당 언어로 입력언어 변경
    kakao_menu_output_options.forEach(kakao_menu_output_option => {
        if (kakao_menu_output_option.value === kakao_menu_input_select_value) {
            kakao_menu_output_option.setAttribute('selected', 'selected');
        } else {
            kakao_menu_output_option.removeAttribute('selected');
        }
    });

    exceptCurrentOption();
}