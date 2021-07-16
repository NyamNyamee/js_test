/* 페이지 로딩 시 */
document.addEventListener("DOMContentLoaded", function () {
    try {
        // 메뉴에 포커스
        let game_menu_select = document.getElementById('game_menu_select');
        game_menu_select.focus();
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
    // 블리자드_디아블로3 메뉴
    let blizzard_diablo3_object = { '선택': '00', '프로필조회': '01' }
    let blizzard_diablo3_key_array = Object.keys(blizzard_diablo3_object);
    let blizzard_diablo3_values_array = Object.values(blizzard_diablo3_object);

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

    // 결과가 나타날 div
    let game_result_div = document.querySelector('div.game_result_div');

    // game_result_div 아래 table 태그들을 찾아보고 있으면 전부 제거
    removeResultTables(game_result_div, 0);

    // 새로 생성할 셀렉트, 옵션 태그들
    let game_content_select = ``;
    let game_content_option = ``;
    let game_content_option_text = ``;

    // 선택한 게임메뉴의 옵션 값
    let game_content_select_value_1 = ``;

    // 선택한 게임메뉴2의 옵션 값
    let game_content_select_value_2 = ``;

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
                game_content_select_value_1 = game_content_select_array[0].value;
                // 사용자가 고른 스팀 메뉴에 따라 처리
                switch (game_content_select_value_1) {
                    case '00':
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0); break;
                    // Steam_게임조회
                    case '01':
                        game_content_search_input = document.createElement('input');
                        game_content_search_input.setAttribute('type', 'text');
                        game_content_search_input.setAttribute('placeHolder', '미입력 시 전체');
                        game_content_search_input.classList.add('game_content_search_input_text');
                        game_input_label.appendChild(game_content_search_input);
                        game_content_search_input.focus();

                        game_content_search_button = document.createElement('button');
                        game_content_search_button.classList.add('game_content_search_button');
                        game_content_search_button.setAttribute('onclick', `game_search_button_handler('${game_menu_select_value}', '${game_content_select_value_1}');`)
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
                game_content_select_value_1 = game_content_select_array[0].value;
                // 사용자가 고른 블리자드 메뉴에 따라 처리
                switch (game_content_select_value_1) {
                    case '00':
                        //  메인메뉴, 블리자드 메뉴 제외 라벨태그 하위 모든 메뉴 제거 
                        game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                        game_content_select_length = game_content_select_array.length;
                        if (game_content_select_length >= 2) {
                            for (let i = 1; i < game_content_select_length; i++) {
                                game_input_label.removeChild(game_content_select_array[i]);
                            }
                        }
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0); break;
                    // Blizzard_daiblo3
                    case '01':
                        game_content_select = document.createElement('select');
                        game_content_select.classList.add('game_content_select');
                        game_content_select.addEventListener('change', () => {
                            // 선택한 블리자드_디아블로 메뉴의 옵션 값 저장
                            game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                            game_content_select_value_2 = game_content_select_array[1].value;

                            // 사용자가 고른 블리자드 메뉴에 따라 처리
                            switch (game_content_select_value_2) {
                                case '00':
                                    game_content_search_input = document.querySelector('.game_content_search_input_text');
                                    game_content_search_button = document.querySelector('.game_content_search_button');
                                    if (game_content_search_input != null || game_content_search_button != null) {
                                        game_input_label.removeChild(game_content_search_input);
                                        game_input_label.removeChild(game_content_search_button);
                                    }
                                    removeResultTables(game_result_div, 0);
                                    break;
                                // Blizzard_diablo3_프로필조회
                                case '01':
                                    game_content_search_input = document.createElement('input');
                                    game_content_search_input.setAttribute('type', 'text');
                                    game_content_search_input.setAttribute('placeHolder', '배틀태그#고유번호 형식으로 입력해주세요');
                                    game_content_search_input.classList.add('game_content_search_input_text');
                                    game_input_label.appendChild(game_content_search_input);
                                    game_content_search_input.focus();

                                    game_content_search_button = document.createElement('button');
                                    game_content_search_button.classList.add('game_content_search_button');
                                    game_content_search_button.setAttribute('onclick', `game_search_button_handler('${game_menu_select_value}', '${game_content_select_value_1}', '${game_content_select_value_2}');`)
                                    game_content_search_button_text = document.createTextNode('검색');
                                    game_content_search_button.appendChild(game_content_search_button_text);
                                    game_input_label.appendChild(game_content_search_button);
                            }
                        });
                        // 블리자드 메뉴 개수만큼 반복
                        blizzard_diablo3_key_array.forEach(blizzard_diablo3_key => {
                            game_content_option = document.createElement('option');
                            game_content_option.setAttribute('value', blizzard_diablo3_object[blizzard_diablo3_key]);
                            game_content_option_text = document.createTextNode(blizzard_diablo3_key);

                            game_content_option.appendChild(game_content_option_text);
                            game_content_select.appendChild(game_content_option);
                        });

                        game_input_label.appendChild(game_content_select);
                        break;
                    case '02':
                        alert('서비스 준비중입니다.');
                        //  메인메뉴, 블리자드 메뉴 제외 라벨태그 하위 모든 메뉴 제거 
                        game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                        game_content_select_length = game_content_select_array.length;
                        if (game_content_select_length >= 2) {
                            for (let i = 1; i < game_content_select_length; i++) {
                                game_input_label.removeChild(game_content_select_array[i]);
                            }
                        }
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0);
                        break;
                    case '03':
                        alert('서비스 준비중입니다.');//  메인메뉴, 블리자드 메뉴 제외 라벨태그 하위 모든 메뉴 제거 
                        game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                        game_content_select_length = game_content_select_array.length;
                        if (game_content_select_length >= 2) {
                            for (let i = 1; i < game_content_select_length; i++) {
                                game_input_label.removeChild(game_content_select_array[i]);
                            }
                        }
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0);
                        break;
                    case '04':
                        alert('서비스 준비중입니다.');//  메인메뉴, 블리자드 메뉴 제외 라벨태그 하위 모든 메뉴 제거 
                        game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                        game_content_select_length = game_content_select_array.length;
                        if (game_content_select_length >= 2) {
                            for (let i = 1; i < game_content_select_length; i++) {
                                game_input_label.removeChild(game_content_select_array[i]);
                            }
                        }
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0);
                        break;
                    case '05':
                        alert('서비스 준비중입니다.');//  메인메뉴, 블리자드 메뉴 제외 라벨태그 하위 모든 메뉴 제거 
                        game_content_select_array = game_input_label.querySelectorAll('select.game_content_select');
                        game_content_select_length = game_content_select_array.length;
                        if (game_content_select_length >= 2) {
                            for (let i = 1; i < game_content_select_length; i++) {
                                game_input_label.removeChild(game_content_select_array[i]);
                            }
                        }
                        game_content_search_input = document.querySelector('.game_content_search_input_text');
                        game_content_search_button = document.querySelector('.game_content_search_button');
                        if (game_content_search_input != null || game_content_search_button != null) {
                            game_input_label.removeChild(game_content_search_input);
                            game_input_label.removeChild(game_content_search_button);
                        }
                        removeResultTables(game_result_div, 0);
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

// 검색버튼 클릭 이벤트 핸들러 (기변인자 활용)
function game_search_button_handler() {
    // 검색 input값
    let game_content_search_input = document.querySelector('.game_content_search_input_text');

    switch (arguments[0]) {
        // steam
        case '01':
            switch (arguments[1]) {
                // 게임조회
                case '01':
                    getSteamGameInfo(game_content_search_input);
                    break;
            }
            break;
        // blizzard
        case '02':
            switch (arguments[1]) {
                // diablo3
                case '01':
                    switch (arguments[2]) {
                        // 프로필조회
                        case '01':
                            getBlizzardDiablo3Profile(game_content_search_input);
                            break;
                    }
                    break;
            }
            break;
    }
}

/* Steam_게임조회 */
async function getSteamGameInfo(game_content_search_input) {
    try {
        // 검색 값 저장
        let game_content_search_input_value = game_content_search_input.value;

        // 결과가 나타날 div
        let game_result_div = document.querySelector('div.game_result_div');

        // game_result_div 하위 테이블 모두 제거
        removeResultTables(game_result_div, 0);

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
        let headers = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

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
        if (!game_result_table_tr) {
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


/* Blizzard_Diablo3_프로필정보 */
async function getBlizzardDiablo3Profile(game_content_search_input) {
    // 블라지드 토큰
    let blizzard_access_token = ``;
    // 사용자가 입력한 값(배틀태그)
    let game_content_search_input_value = game_content_search_input.value;
    // 배틀태그 유효성검사 (중간에 '#' 포함되어있어야함, # 앞뒤로 공백이면 안됨)
    let reg_ex = /\S#\d/; // 공백이 아님, #포함, 숫자
    let test_result = reg_ex.test(game_content_search_input_value);
    if (!test_result) {
        alert('닉네임#숫자 형식의 배틀태그로 검색해 주세요');
        return;
    }

    // 실제 요청할 url에서는 #을 %23으로 대체해야 함(인코딩문제?)
    game_content_search_input_value = game_content_search_input_value.replace('#', '%23');

    // 블리자드 토큰 요청
    try {
        // API 요청
        let host = `https://${BLIZZARD_REGION}.battle.net`;
        let path = `/oauth/token`;
        let query = ``;
        let headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        };
        let data = new FormData();
        data.append('grant_type', 'client_credentials');
        data.append('client_id', BLIZZARD_CLIENT_ID);
        data.append('client_secret', BLIZZARD_CLIENT_SECRET);
        let method = `POST`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        // console.log(`[Blizzard Diablo3 토큰요청 응답] `, response)
        // 응답이 객체가 아닌 문자열(에러메시지)이라면 알림창 띄우고 리턴
        if (typeof (response) === 'string') {
            alert(response);
            return;
        }

        blizzard_access_token = response.data.access_token;
    } catch (error) {
        console.log(`[Blizzard Diablo3 토큰요청 에러] `, error)
        return;
    }

    // 토큰과 배틀태그로 프로필조회
    try {
        // 결과가 나타날 div
        let game_result_div = document.querySelector('div.game_result_div');

        // 테이블 모두 제거
        removeResultTables(game_result_div, 0);

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
        let th_tag_values = ['정복자레벨 일반/하드코어', '길드명', '몬스터킬수 일반/엘리트/하드코어'];
        th_tag_values.forEach((th_tag_value) => {
            game_result_table_th = document.createElement('th');
            game_result_table_th_text = document.createTextNode(th_tag_value);
            game_result_table_th.appendChild(game_result_table_th_text);
            game_result_table.appendChild(game_result_table_th);
        });

        // API 요청
        let host = `https://${BLIZZARD_REGION}.api.blizzard.com`;
        let path = `/d3/profile/${game_content_search_input_value}/`;
        let query = `?locale=${BLIZZARD_LOCALE}&access_token=${blizzard_access_token}`;
        let headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        };
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        // console.log(`[Blizzard Diablo3 프로필조회 응답] `, response)

        // 응답이 객체가 아닌 문자열(에러메시지)이라면 알림창 띄우고 리턴
        if (typeof (response) === 'string') {
            alert(response);
            return;
        }

        // 응답 데이터를 결과테이블에 입력
        let object_data = response.data;

        let game_diablo3_paragon_level = object_data.paragonLevel;
        let game_diablo3_paragon_level_hardcore = object_data.paragonLevelHardcore;
        let game_diablo3_guild_name = object_data.guildName;
        let game_diablo3_kills_object = object_data.kills;
        let game_diablo3_heroes_array = object_data.heroes;

        let game_diablo3_kills_array = Object.values(game_diablo3_kills_object);

        // tr생성
        game_result_table_tr = document.createElement('tr');

        // 테이블 내용 배열 생성, td태그 생성
        let td_tag_values = [`${game_diablo3_paragon_level} / ${game_diablo3_paragon_level_hardcore}`, game_diablo3_guild_name, game_diablo3_kills_array.join(' / ')];
        td_tag_values.forEach((td_tag_value) => {
            game_result_table_td = document.createElement('td');
            game_result_table_td_text = document.createTextNode(td_tag_value);
            game_result_table_td.appendChild(game_result_table_td_text);
            game_result_table_tr.appendChild(game_result_table_td);
        });

        // 테이블에 붙이기
        game_result_table.appendChild(game_result_table_tr);

        // 영웅테이블에 필요한 태그 초기화
        let game_result_hero_table_th = ``;
        let game_result_hero_table_th_text = ``;
        let game_result_hero_table_tr = ``;
        let game_result_hero_table_td = ``;
        let game_result_hero_table_td_text = ``;
        let game_result_hero_table_td_a = ``;

        // table 태그 생성
        game_result_hero_table = document.createElement('table');
        game_result_hero_table.classList.add('game_result_hero_table');
        game_result_div.appendChild(game_result_hero_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let hero_th_tag_values = ['클래스', '레벨', '닉네임'];
        hero_th_tag_values.forEach((th_tag_value) => {
            game_result_hero_table_th = document.createElement('th');
            game_result_hero_table_th_text = document.createTextNode(th_tag_value);
            game_result_hero_table_th.appendChild(game_result_hero_table_th_text);
            game_result_hero_table.appendChild(game_result_hero_table_th);
        });

        // 응답 데이터를 결과테이블에 입력
        game_diablo3_heroes_array.forEach(element => {
            let hero_id = element.id;
            let hero_name = element.name;
            let hero_class = element.class;
            let hero_level = element.level;

            // tr생성
            game_result_hero_table_tr = document.createElement('tr');

            // 테이블 내용 생성, 테이블에 붙이기
            let td_tag_values = [hero_class, hero_level, hero_name];
            td_tag_values.forEach((td_tag_value, index) => {
                game_result_hero_table_td = document.createElement('td');
                game_result_hero_table_td_text = document.createTextNode(td_tag_value);

                // 제목만 a태그로 감싸서 클릭 이벤트 부여
                if (index / 2 == 1) {
                    game_result_hero_table_td_a = document.createElement('a');
                    game_result_hero_table_td_a.setAttribute('href', `javascript:getHeroDetailInfo('${game_content_search_input_value}', ${hero_id}, '${blizzard_access_token}');`);
                    game_result_hero_table_td_a.classList.add('index_link');
                    game_result_hero_table_td_a.appendChild(game_result_hero_table_td_text);
                    game_result_hero_table_td.appendChild(game_result_hero_table_td_a);
                } else {
                    game_result_hero_table_td.appendChild(game_result_hero_table_td_text);
                }

                game_result_hero_table_tr.appendChild(game_result_hero_table_td);
                game_result_hero_table.appendChild(game_result_hero_table_tr);
            });

            // 테이블에 붙이기
            game_result_div.appendChild(game_result_hero_table);
        });
    } catch (error) {
        console.error(`[Blizzard Diablo3 프로필조회 에러] ${error}`);
    }
}

// Blizzard_Diablo3_영웅상세정보
async function getHeroDetailInfo(game_content_search_input_value, hero_id, blizzard_access_token) {
    // 배틀태그의 #을 %23으로 대체
    game_content_search_input_value = game_content_search_input_value.replace('#', '%23');
    try {
        // 결과가 나타날 div
        let game_result_div = document.querySelector('div.game_result_div');

        // 테이블 두개남기고 모두 제거
        removeResultTables(game_result_div, 2);

        // 생성할 태그 초기화
        let game_result_hero_detail_table = ``;
        let game_result_hero_detail_table_th = ``;
        let game_result_hero_detail_table_th_text = ``;
        let game_result_hero_detail_table_tr = ``;
        let game_result_hero_detail_table_td = ``;
        let game_result_hero_detail_table_td_text = ``;
        let game_result_hero_detail_table_td_img = ``;

        // API 요청
        let host = `https://${BLIZZARD_REGION}.api.blizzard.com`;
        let path = `/d3/profile/${game_content_search_input_value}/hero/${hero_id}`;
        let query = `?locale=${BLIZZARD_LOCALE}&access_token=${blizzard_access_token}`;
        let headers = {
            'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8;'
        };
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, headers, data, method)

        // console.log(`[Blizzard Diablo3 영웅상세정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_active_skills_data = response.data.skills.active;
        let list_passive_skills_data = response.data.skills.passive;
        let object_stats_data = response.data.stats;
        let object_items_data = response.data.items;

        let object_stats_keys_data_array = Object.keys(object_stats_data);
        let object_stats_values_data_array = Object.values(object_stats_data);

        // 아이콘 접두, 접미사 (url, 확장자)
        let icon_url_prefix_skill = 'http://media.blizzard.com/d3/icons/skills/64/';
        let icon_url_suffix_skill = '.png';
        let icon_url_prefix_item = 'http://media.blizzard.com/d3/icons/items/large/';
        let icon_url_suffix_item = '.png';

        // stat 테이블
        // table 태그 생성
        game_result_hero_detail_table = document.createElement('table');
        game_result_hero_detail_table.classList.add('game_result_hero_detail_stat_table');

        //  테이블 컬럼명 배열: th태그 생성
        object_stats_keys_data_array.forEach((object_stats_key) => {
            game_result_hero_detail_table_th = document.createElement('th');
            game_result_hero_detail_table_th_text = document.createTextNode(object_stats_key);
            game_result_hero_detail_table_th.appendChild(game_result_hero_detail_table_th_text);
            game_result_hero_detail_table.appendChild(game_result_hero_detail_table_th);
        });

        // tr생성
        game_result_hero_detail_table_tr = document.createElement('tr');

        // 테이블 내용 배열: td태그 생성
        object_stats_values_data_array.forEach((object_stats_value) => {
            game_result_hero_detail_table_td = document.createElement('td');
            game_result_hero_detail_table_td_text = document.createTextNode(object_stats_value);
            game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_text);
            game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
        });

        // 테이블에 붙이기
        game_result_hero_detail_table.appendChild(game_result_hero_detail_table_tr);

        // div에 붙이기
        game_result_div.appendChild(game_result_hero_detail_table);

        // active_skill 테이블
        // table 태그 생성
        game_result_hero_detail_table = document.createElement('table');
        game_result_hero_detail_table.classList.add('game_result_hero_detail_skill_table');

        // 테이블 컬럼명 배열 생성, th태그 생성
        let hero_active_skill_th_tag_values = ['스킬명(한글)', '레벨', '아이콘'];
        hero_active_skill_th_tag_values.forEach((hero_active_skill_th_tag_value) => {
            game_result_hero_detail_table_th = document.createElement('th');
            game_result_hero_detail_table_th_text = document.createTextNode(hero_active_skill_th_tag_value);
            game_result_hero_detail_table_th.appendChild(game_result_hero_detail_table_th_text);
            game_result_hero_detail_table.appendChild(game_result_hero_detail_table_th);
        });

        // 응답 데이터를 결과테이블에 입력
        list_active_skills_data.forEach(element => {
            let hero_active_skill_slug = element.skill.slug;
            let hero_active_skill_name = element.skill.name;
            let hero_active_skill_level = element.skill.level;
            let hero_active_skill_icon = element.skill.icon;
            let hero_active_skill_description = element.skill.description;

            hero_active_skill_slug = `${hero_active_skill_slug} (${hero_active_skill_name})`;
            // tr생성
            game_result_hero_detail_table_tr = document.createElement('tr');

            // 테이블 내용 생성, 테이블에 붙이기
            let hero_active_skill_td_tag_values = [hero_active_skill_slug, hero_active_skill_level, hero_active_skill_icon];
            hero_active_skill_td_tag_values.forEach((hero_active_skill_td_tag_value, index) => {
                game_result_hero_detail_table_td = document.createElement('td');
                // 데이터가 아이콘일때, 아닐 때 구분
                if (index === 2) {
                    hero_active_skill_td_tag_value = icon_url_prefix_skill + hero_active_skill_td_tag_value + icon_url_suffix_skill;
                    game_result_hero_detail_table_td_img = document.createElement('img');
                    game_result_hero_detail_table_td_img.setAttribute('src', hero_active_skill_td_tag_value);
                    game_result_hero_detail_table_td_img.setAttribute('alt', '미확인');
                    game_result_hero_detail_table_td_img.setAttribute('title', hero_active_skill_description);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_img);
                } else {
                    game_result_hero_detail_table_td_text = document.createTextNode(hero_active_skill_td_tag_value);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_text);
                }
                game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
                game_result_hero_detail_table.appendChild(game_result_hero_detail_table_tr);
            });

            // 테이블에 붙이기
            game_result_div.appendChild(game_result_hero_detail_table);
        });

        // div에 붙이기
        game_result_div.appendChild(game_result_hero_detail_table);

        // passive_skill 테이블
        // table 태그 생성
        game_result_hero_detail_table = document.createElement('table');
        game_result_hero_detail_table.classList.add('game_result_hero_detail_skill_table');

        // 테이블 컬럼명 배열 생성, th태그 생성
        let hero_passive_skill_th_tag_values = ['스킬명 (한글)', '레벨', '아이콘'];
        hero_passive_skill_th_tag_values.forEach((hero_passive_skill_th_tag_value) => {
            game_result_hero_detail_table_th = document.createElement('th');
            game_result_hero_detail_table_th_text = document.createTextNode(hero_passive_skill_th_tag_value);
            game_result_hero_detail_table_th.appendChild(game_result_hero_detail_table_th_text);
            game_result_hero_detail_table.appendChild(game_result_hero_detail_table_th);
        });

        // 응답 데이터를 결과테이블에 입력
        list_passive_skills_data.forEach(element => {
            let hero_passive_skill_slug = element.skill.slug;
            let hero_passive_skill_name = element.skill.name;
            let hero_passive_skill_level = element.skill.level;
            let hero_passive_skill_icon = element.skill.icon;
            let hero_passive_skill_description = element.skill.description;

            hero_passive_skill_slug = `${hero_passive_skill_slug} (${hero_passive_skill_name})`;

            // tr생성
            game_result_hero_detail_table_tr = document.createElement('tr');

            // 테이블 내용 생성, 테이블에 붙이기
            let hero_passive_skill_td_tag_values = [hero_passive_skill_slug, hero_passive_skill_level, hero_passive_skill_icon];
            hero_passive_skill_td_tag_values.forEach((hero_passive_skill_td_tag_value, index) => {
                game_result_hero_detail_table_td = document.createElement('td');
                // 데이터가 아이콘일때, 아닐 때 구분
                if (index === 2) {
                    hero_passive_skill_td_tag_value = icon_url_prefix_skill + hero_passive_skill_td_tag_value + icon_url_suffix_skill;
                    game_result_hero_detail_table_td_img = document.createElement('img');
                    game_result_hero_detail_table_td_img.setAttribute('src', hero_passive_skill_td_tag_value);
                    game_result_hero_detail_table_td_img.setAttribute('alt', '미확인');
                    game_result_hero_detail_table_td_img.setAttribute('title', hero_passive_skill_description);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_img);
                } else {
                    game_result_hero_detail_table_td_text = document.createTextNode(hero_passive_skill_td_tag_value);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_text);
                }
                game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
                game_result_hero_detail_table.appendChild(game_result_hero_detail_table_tr);
            });

            // 테이블에 붙이기
            game_result_div.appendChild(game_result_hero_detail_table);
        });

        // div에 붙이기
        game_result_div.appendChild(game_result_hero_detail_table);

        // item 테이블
        // table 태그 생성
        game_result_hero_detail_table = document.createElement('table');
        game_result_hero_detail_table.classList.add('game_result_hero_detail_item_table');

        // 보여줄 데이터 초기화
        let hero_item_name = ``;
        let hero_item_icon = ``;
        let hero_item_color = ``;

        for (object_item_data in object_items_data) {
            // head일 때
            if (object_item_data === 'head') {
                hero_item_name = object_items_data[object_item_data].name;
                hero_item_icon = object_items_data[object_item_data].icon;
                hero_item_color = object_items_data[object_item_data].displayColor;

                hero_item_icon = icon_url_prefix_item + hero_item_icon + icon_url_suffix_item;

                game_result_hero_detail_table_tr = document.createElement('tr');
                game_result_hero_detail_table_td = document.createElement('td');
                game_result_hero_detail_table_td_img = document.createElement('img');

                game_result_hero_detail_table_td_img.setAttribute('src', hero_item_icon);
                game_result_hero_detail_table_td_img.setAttribute('alt', '미확인');
                game_result_hero_detail_table_td_img.setAttribute('title', hero_item_name);

                game_result_hero_detail_table_td.classList.add(`item_grade_color_${hero_item_color}`);
                game_result_hero_detail_table_td.setAttribute('colspan', 3);
                game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_img);
                game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
                game_result_hero_detail_table.appendChild(game_result_hero_detail_table_tr);
            } else {
                hero_item_name = object_items_data[object_item_data].name;
                hero_item_icon = object_items_data[object_item_data].icon;
                hero_item_color = object_items_data[object_item_data].displayColor;

                hero_item_icon = icon_url_prefix_item + hero_item_icon + icon_url_suffix_item;

                if (object_item_data === 'neck' || object_item_data === 'legs' || object_item_data === 'bracers'  || object_item_data === 'rightFinger') {
                    game_result_hero_detail_table_tr = document.createElement('tr');
                    game_result_hero_detail_table_td = document.createElement('td');
                    game_result_hero_detail_table_td_img = document.createElement('img');
    
                    game_result_hero_detail_table_td_img.setAttribute('src', hero_item_icon);
                    game_result_hero_detail_table_td_img.setAttribute('alt', '미확인');
                    game_result_hero_detail_table_td_img.setAttribute('title', hero_item_name);
    
                    game_result_hero_detail_table_td.classList.add(`item_grade_color_${hero_item_color}`);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_img);
                    game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
                    game_result_hero_detail_table.appendChild(game_result_hero_detail_table_tr);
                } else {
                    game_result_hero_detail_table_td = document.createElement('td');
                    game_result_hero_detail_table_td_img = document.createElement('img');
    
                    game_result_hero_detail_table_td_img.setAttribute('src', hero_item_icon);
                    game_result_hero_detail_table_td_img.setAttribute('alt', '미확인');
                    game_result_hero_detail_table_td_img.setAttribute('title', hero_item_name);
    
                    game_result_hero_detail_table_td.classList.add(`item_grade_color_${hero_item_color}`);
                    game_result_hero_detail_table_td.appendChild(game_result_hero_detail_table_td_img);
                    game_result_hero_detail_table_tr.appendChild(game_result_hero_detail_table_td);
                }
            }
        }

        // div에 붙이기
        game_result_div.appendChild(game_result_hero_detail_table);

        // Todo. 2021-07-16

        // 테이블로 화면 이동
        game_result_hero_detail_table.scrollIntoView();
    } catch (error) {
        console.log(`[Blizzard Diablo3 영웅상세정보 에러] ${error}`);
        return;
    }
}