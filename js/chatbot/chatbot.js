/* 페이지 로딩 시 */
document.addEventListener("DOMContentLoaded", function () {
    try {

    } catch (error) {
        console.error(error);
    }
});

// 사용 노드 초기화
let chatbot_br = ``;
let chatbot_result_div = ``;
let chatbot_result_div_01 = ``;
let chatbot_result_div_02 = ``;
let chatbot_menu_div = ``;
let chatbot_menu_select = ``;
let chatbot_menu_option = ``;
let chatbot_menu_span = ``;
let chatbot_menu_label = ``;
let chatbot_menu_input = ``;
let chatbot_menu_button = ``;
let chatbot_menu_text = ``;

/* 메인메뉴 변경 시 하위메뉴 세팅 */
function setSelectedMenu() {
    try {
        chatbot_menu_div = document.querySelector('.chatbot_search_category');
        chatbot_menu_select = document.getElementById('chatbot_menu_select');
        chatbot_result_div = document.querySelector('.chatbot_result_div');

        switch (chatbot_menu_select.value) {
            // 선택
            case '00':
                removeLowerTags(chatbot_menu_div, 'span', 0);
                removeLowerTags(chatbot_result_div, 'div', 0);
                break;
            // 심심이
            case '01':
                removeLowerTags(chatbot_menu_div, 'span', 0);
                removeLowerTags(chatbot_result_div, 'div', 0);
                // 입력메뉴를 묶기 위한 span
                chatbot_menu_span = document.createElement('span');
                chatbot_menu_span.classList.add('chatbot_detail_menu');

                // 셀렉트박스 라벨
                chatbot_menu_label = document.createElement('label');
                chatbot_menu_label.setAttribute('for', 'chatbot_simsimi_language_select');
                chatbot_menu_text = document.createTextNode('언어 ');
                chatbot_menu_label.appendChild(chatbot_menu_text);

                // 셀렉트박스
                chatbot_menu_select = document.createElement('select');
                chatbot_menu_select.setAttribute('id', 'chatbot_simsimi_language_select');

                // 옵션
                chatbot_menu_option = document.createElement('option');
                chatbot_menu_option.setAttribute('value', '01');
                chatbot_menu_text = document.createTextNode('한국어');
                chatbot_menu_option.appendChild(chatbot_menu_text);
                chatbot_menu_select.appendChild(chatbot_menu_option);

                // 옵션
                chatbot_menu_option = document.createElement('option');
                chatbot_menu_option.setAttribute('value', '02');
                chatbot_menu_text = document.createTextNode('English');
                chatbot_menu_option.appendChild(chatbot_menu_text);
                chatbot_menu_select.appendChild(chatbot_menu_option);

                // 부착
                chatbot_menu_label.appendChild(chatbot_menu_select);
                chatbot_menu_span.appendChild(chatbot_menu_label);

                // 줄바꿈
                chatbot_br = document.createElement('br');
                chatbot_menu_span.appendChild(chatbot_br);

                // 문자 입력칸
                chatbot_menu_input = document.createElement('textarea');
                chatbot_menu_input.classList.add('chatbot_menu_input');
                chatbot_menu_span.appendChild(chatbot_menu_input);

                // 입력버튼
                chatbot_menu_button = document.createElement('button');
                chatbot_menu_button.classList.add('chatbot_confirm_button');
                chatbot_menu_button.setAttribute('onclick', 'chatbot_simimi_request();');
                chatbot_menu_text = document.createTextNode('Send');
                chatbot_menu_button.appendChild(chatbot_menu_text);
                chatbot_menu_span.appendChild(chatbot_menu_button);

                // span태그로 묶기
                chatbot_menu_div.appendChild(chatbot_menu_span);
                break;
            // other
            case '02':
                removeLowerTags(chatbot_menu_div, 'span', 0);
                removeLowerTags(chatbot_result_div, 'div', 0);
                alert('서비스 준비중입니다.');
                break;
        }
    } catch (error) {
        console.error(`[챗봇 메인메뉴 변경 시 하위메뉴 세팅 에러] ${error}`);
    }
}

/* 심심이 챗봇 응답 요청 */
async function chatbot_simimi_request() {
    try {
        let chatbot_simsimi_language_type = ``;
        let chatbot_simsimi_input_text = ``;
        let chatbot_simsimi_input_text_node = ``;
        let chatbot_simsimi_response_status = ``;
        let chatbot_simsimi_response_lang = ``;
        let chatbot_simsimi_response_text = ``;

        chatbot_menu_select = document.getElementById('chatbot_simsimi_language_select');
        chatbot_menu_input = document.querySelector('textarea.chatbot_menu_input');
        chatbot_result_div = document.querySelector('.chatbot_result_div');

        switch (chatbot_menu_select.value) {
            // 한국어
            case '01':
                chatbot_simsimi_language_type = 'ko';
                break;
            // English
            case '02':
                chatbot_simsimi_language_type = 'en';
                break;
        }

        chatbot_simsimi_input_text = `나: ${chatbot_menu_input.value}`;

        chatbot_result_div_01 = document.createElement('div');
        chatbot_result_div_01.classList.add('chatbot_request_text');
        chatbot_simsimi_input_text_node = document.createTextNode(chatbot_simsimi_input_text);
        chatbot_result_div_01.appendChild(chatbot_simsimi_input_text_node);
        chatbot_result_div.appendChild(chatbot_result_div_01);

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://wsapi.simsimi.com`;
        let path = `/${SIMSIMI_VERSION}/talk`;
        let query = ``;
        let headers = {
            'Content-type': 'application/json; charset=utf-8',
            'x-api-key': SIMSIMI_DEMO_APP_KEY
        };
        // let data = '{"utext": "' + chatbot_simsimi_input_text + '", "lang": "' + chatbot_simsimi_language_type + '"}';
        let data = `{"utext": "${chatbot_simsimi_input_text}", "lang": "${chatbot_simsimi_language_type}"}`;

        let method = `POST`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        console.log(`[챗봇-심심이 응답] ${response}`);

        chatbot_simsimi_response_status = response.data.status;
        chatbot_simsimi_response_lang = response.data.lang;
        chatbot_simsimi_response_text = `심심이: ${response.data.atext}`;

        chatbot_result_div_02 = document.createElement('div');
        chatbot_result_div_02.classList.add('chatbot_response_text');
        chatbot_simsimi_input_text = document.createTextNode(chatbot_simsimi_response_text);
        chatbot_result_div_02.appendChild(chatbot_simsimi_input_text);
        chatbot_result_div.appendChild(chatbot_result_div_02);
    } catch (error) {
        console.error(error);
    }
}