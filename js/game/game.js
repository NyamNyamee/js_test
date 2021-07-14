/* 페이지 로딩 시 */
document.addEventListener("DOMContentLoaded", function () {
    try {

    } catch (error) {
        console.error(error);
    }
});

/* 게임 메인메뉴 변경시 */
function selectGameMenu() {
    // 스팀메뉴
    let steam_content_object = { '선택': '00', '게임조회': '01' }
    let steam_content_key_array = Object.keys(steam_content_object);
    let steam_content_values_array = Object.values(steam_content_object);
    // 블리자드메뉴
    let blizzard_content_object = { '선택': '00', 'Diablo3': '01', 'StarCraft2': '02', 'HearthStone': '03', 'WOW': '04', 'WOW Classic': '05' }
    let blizzard_content_key_array = Object.keys(blizzard_content_object);
    let blizzard_content_values_array = Object.values(blizzard_content_object);

    // 선택한 메뉴의 옵션 값 저장
    let game_menu_select = document.getElementById('game_menu_select');
    game_menu_select_value = game_menu_select.value;

    //  라벨태그 찾기
    let game_input_label = document.querySelector('.game_input_label');

    //  메인메뉴 제외 라벨태그 하위 모든 메뉴 제거 
    let game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
    let game_content_select_length = game_content_select_array.length;
    if (game_content_select_length >= 1) {
        for (let i = 0; i < game_content_select_length; i++) {
            game_input_label.removeChild(game_content_select_array[i]);
        }
    }

    // 메인메뉴 제외 라밸태그 하위 모든 인풋, 버튼 제거
    let game_content_search_input_array = document.querySelectorAll('.game_content_search_input_text');
    if (game_content_search_input_array.length != 0) {
        game_content_search_input_array.forEach(game_content_search_input => {
            game_input_label.removeChild(game_content_search_input);
        });
    }
    let game_content_search_button_array = document.querySelectorAll('.game_content_search_button');
    if (game_content_search_button_array.length != 0) {
        game_content_search_button_array.forEach(game_content_search_button => {
            game_input_label.removeChild(game_content_search_button);
        });
    }

    // 새로 생성할 셀렉트, 옵션 태그들
    let game_content_select = ``;
    let game_content_option = ``;
    let game_content_option_text = ``;

    // 선택한 게임메뉴의 옵션 값
    let game_content_select_value = ``;

    // 검색 인풋란, 검색 버튼
    let game_content_search_input = ``;
    let game_content_search_button = ``;

    // 사용자가 고른 메인메뉴에 따라 처리
    switch (game_menu_select_value) {        
        // Steam
        case '01':
            // 셀렉트박스 생성, 속성, 이벤트 지정
            game_content_select = document.createElement('select');
            game_content_select.classList.add('game_content_select');
            game_content_select.addEventListener('change', () => {
                // 선택한 스팀 메뉴의 옵션 값 저장
                game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                game_content_select_value = game_content_select_array[0].value;
                // 사용자가 고른 스팀 메뉴에 따라 처리
                switch (game_content_select_value) {
                    case '00':
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null){
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        break;
                    case '01':
                        game_content_search_input = document.createElement('input');
                        game_content_search_input.setAttribute('type', 'text');
                        game_content_search_input.setAttribute('placeHolder', '미입력 시 전체');
                        game_content_search_input.classList.add('game_content_search_input_text');
                        game_input_label.appendChild(game_content_search_input);
                        game_content_search_input.focus();

                        game_content_search_button = document.createElement('button');
                        game_content_search_button.classList.add('game_content_search_button');
                        game_content_search_button.setAttribute('onclick', `game_search_button_handler('${game_menu_select_value}', '${game_content_select_value}')`)
                        game_content_search_button_text = document.createTextNode('검색');
                        game_content_search_button.appendChild(game_content_search_button_text);
                        game_input_label.appendChild(game_content_search_button);
                        break;
                }
            })

            // 스팀 메뉴 개수만큼 반복
            steam_content_key_array.forEach(steam_content_key => {
                game_content_option = document.createElement('option');
                game_content_option.setAttribute('value', steam_content_object[steam_content_key]);
                game_content_option_text = document.createTextNode(steam_content_key);

                game_content_option.appendChild(game_content_option_text);
                game_content_select.appendChild(game_content_option);
            });

            game_input_label.appendChild(game_content_select);
            break;
        // Blizzard
        case '02':
            // 셀렉트박스 생성, 속성, 이벤트 지정
            game_content_select = document.createElement('select');
            game_content_select.classList.add('game_content_select');
            game_content_select.addEventListener('change', () => {
                // 선택한 블리자드 메뉴의 옵션 값 저장
                game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                game_content_select_value = game_content_select_array[0].value;
                // 사용자가 고른 블리자드 메뉴에 따라 처리
                switch (game_content_select_value) {
                    case '01':
                        // 2021.07.14 Todo
                        
                        break;
                    case '02':
                        alert('서비스 준비중입니다.');
                        break;
                    case '03':
                        alert('서비스 준비중입니다.');
                        break;
                    case '04':
                        alert('서비스 준비중입니다.');
                        break;
                    case '05':
                        alert('서비스 준비중입니다.');
                        break;
                }
            })

            // 블리자드 메뉴 개수만큼 반복
            blizzard_content_key_array.forEach(blizzard_content_key => {
                game_content_option = document.createElement('option');
                game_content_option.setAttribute('value', blizzard_content_object[blizzard_content_key]);
                game_content_option_text = document.createTextNode(blizzard_content_key);

                game_content_option.appendChild(game_content_option_text);
                game_content_select.appendChild(game_content_option);
            });

            game_input_label.appendChild(game_content_select);
            break;
    }
}

// 검색버튼 클릭 핸들러
function game_search_button_handler(category_01, category_02) {
    let game_content_search_input = document.querySelector('.game_content_search_input_text');
    let game_content_search_input_value = game_content_search_input.value;

    switch(category_01){
        // steam
        case '01':
            switch(category_02){
                // 게임조회
                case '01':
                    getSteamGameInfo(game_content_search_input);
                    break;
            }
            break;
        // blizzard
        case '02':
            switch(category_02){
                // diablo3
                case '01':

                    break;
            }
            break;
    }
}

/* input 값 받아와서 검색결과 뿌려주기 */
async function getSteamGameInfo(game_content_search_input) {
    try {
        // 검색 값 저장
        let game_content_search_input_value = game_content_search_input.value;

        // 결과가 나타날 div
        let game_result_div = document.querySelector('div.game_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let game_result_table = document.querySelector('table.game_result_table');
        if (game_result_table != null) {
            game_result_div.removeChild(game_result_table);
        }

        // 생성할 태그 초기화
        let game_result_table_th = ``;
        let game_result_table_th_text = ``;
        let game_result_table_tr = ``;
        let game_result_table_td = ``;
        let game_result_table_td_text = ``;

        // table 태그 생성
        game_result_table = document.createElement('table');
        game_result_table.classList.add('game_result_table');
        game_result_div.appendChild(game_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['고유번호', '게임명'];
        th_tag_values.forEach((th_tag_value) => {
            game_result_table_th = document.createElement('th');
            game_result_table_th_text = document.createTextNode(th_tag_value);
            game_result_table_th.appendChild(game_result_table_th_text);
            game_result_table.appendChild(game_result_table_th);
        });

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/https://api.steampowered.com`;
        let path = `/ISteamApps/GetAppList/v1/`;
        let query = ``;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[Steam 게임조회 정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.applist.apps.app;
        list_data.forEach(element => {
            let game_id = element.appid;
            let game_name = element.name;

            if (game_name.includes(game_content_search_input_value)) {
                // tr생성
                game_result_table_tr = document.createElement('tr');

                // 테이블 내용 배열 생성, td태그 생성
                let td_tag_values = [game_id, game_name];
                td_tag_values.forEach((td_tag_value) => {
                    game_result_table_td = document.createElement('td');
                    game_result_table_td_text = document.createTextNode(td_tag_value);
                    game_result_table_td.appendChild(game_result_table_td_text);
                    game_result_table_tr.appendChild(game_result_table_td);
                });

                // 테이블에 붙이기
                game_result_table.appendChild(game_result_table_tr);
            }
        });

        // 일치하는 검색결과가 하나도 없어서 tr태그가 만들어지지 않았다면
        game_result_table_tr = document.querySelector('.game_result_table > tr');
        if (!game_result_table_tr){
            game_result_table_tr = document.createElement('tr');
            game_result_table_td = document.createElement('td');
            game_result_table_td.setAttribute('colspan', th_tag_values.length)
            game_result_table_td_text = document.createTextNode('정보 없음');
            game_result_table_td.appendChild(game_result_table_td_text);
            game_result_table_tr.appendChild(game_result_table_td);
            game_result_table.appendChild(game_result_table_tr);
            return;
        }
    } catch (error) {
        console.error(`[Steam 게임조회 정보 에러] ${error}`);
    }
}
