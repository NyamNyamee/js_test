// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        // 메뉴에 포커스
        let accident_search_year_input = document.getElementById('accident_search_year_input');
        accident_search_year_input.focus();

        validation();
    } catch (error) {
        console.error(error);
    }
});

/* input값 유효성검사 */
function validation() {
    try {
        // 검색 연도
        let accident_search_year_input = document.getElementById('accident_search_year_input');
        let accident_search_year_input_value = accident_search_year_input.value;
        let reg_ex = /^(19|20)\d{2}$/; // 연도 정규식
        let test_result = ``;
        let validation_message_small = ``;
        let validation_message_small_text = ``;
        let accident_menu_select = ``;
        let accident_menu_select_option = ``;
        let accident_menu_select_option_text = ``;
        let accident_search_button = ``;
        let accident_search_category = document.querySelector('.accident_search_category');

        // 키 입력 리스너
        accident_search_year_input.addEventListener('keyup', () => {
            // small 태그 존재 시 텍스트 지움, 없으면 생성
            validation_message_small = document.querySelector('small');
            if (validation_message_small != null) {
                validation_message_small.innerHTML = '';
            } else {
                validation_message_small = document.createElement('small');
            }

            // input 값 가져와서 유효성검사
            accident_search_year_input = document.getElementById('accident_search_year_input');
            accident_search_year_input_value = accident_search_year_input.value;
            test_result = reg_ex.test(accident_search_year_input_value);

            // 검사 결과에 따라 처리
            if (test_result) {
                validation_message_small_text = document.createTextNode(``);
                accident_menu_select = document.querySelector('.accident_menu_select');
                if (accident_menu_select != null) {
                    return;
                }

                // 시도
                accident_menu_select = document.createElement('select');
                accident_menu_select.classList.add('accident_menu_select');
                for (korea_address in OBJECT_KOREA_ADDRESS) {
                    accident_menu_select_option = document.createElement('option');
                    accident_menu_select_option.setAttribute('value', korea_address);
                    accident_menu_select_option_text = document.createTextNode(korea_address);
                    accident_menu_select_option.appendChild(accident_menu_select_option_text);
                    accident_menu_select.appendChild(accident_menu_select_option);
                }

                // 시군구 핸들러
                accident_menu_select.setAttribute('onchange', `javascript:selectSigungu();`)
                accident_search_category.appendChild(accident_menu_select);
            } else {
                validation_message_small_text = document.createTextNode('적절한 연도를 입력하세요');
                validation_message_small.setAttribute('class', 'validation_failure_input');
                accident_menu_select_array = document.querySelectorAll('.accident_menu_select');
                if (accident_menu_select_array.length > 0) {
                    for (let i = 0; i < accident_menu_select_array.length; i++) {
                        accident_search_category.removeChild(accident_menu_select_array[i]);
                    }
                }
                // 검색버튼
                accident_search_button = document.querySelector('.accident_search_button');
                if (accident_search_button) {
                    accident_search_category.removeChild(accident_search_button);
                }
            }
            validation_message_small.appendChild(validation_message_small_text);
            document.querySelector('.accident_input_label').appendChild(validation_message_small);
        });
    } catch (error) {
        console.error(error);
    }
}

/* 시도 셀렉트박스 이벤트 핸들러 */
function selectSigungu() {
    let accident_search_year_input = ``;
    let accident_search_year_input_value = ``;
    let accident_menu_select = ``;
    let accident_menu_select_value_sido = ``;
    let accident_menu_select_value_sigungu = ``;
    let accident_menu_select_option = ``;
    let accident_menu_select_option_text = ``;
    let accident_search_button = ``;
    let accident_search_button_text = ``;
    let accident_search_category = document.querySelector('.accident_search_category');
    let response = ``;

    // 선택한 시도값 저장
    accident_menu_select = document.querySelector('.accident_menu_select');
    accident_menu_select_value_sido = accident_menu_select.value;

    // 시군구 셀렉트박스 생성
    accident_menu_select_array = document.querySelectorAll('.accident_menu_select');
    if (accident_menu_select_array.length > 1) {
        accident_search_category.removeChild(accident_menu_select_array[1]);
    }
    accident_menu_select = document.createElement('select');
    accident_menu_select.classList.add('accident_menu_select');

    for (i in OBJECT_KOREA_ADDRESS[accident_menu_select_value_sido]) {
        accident_menu_select_option = document.createElement('option');
        accident_menu_select_option.setAttribute('value', OBJECT_KOREA_ADDRESS[accident_menu_select_value_sido][i]);
        accident_menu_select_option_text = document.createTextNode(OBJECT_KOREA_ADDRESS[accident_menu_select_value_sido][i]);

        accident_menu_select_option.appendChild(accident_menu_select_option_text);
        accident_menu_select.appendChild(accident_menu_select_option);
    }

    accident_search_category.appendChild(accident_menu_select);

    // 검색버튼 생성
    accident_search_button = document.querySelector('.accident_search_button');
    if (accident_search_button) {
        accident_search_category.removeChild(accident_search_button);
    }
    accident_search_button = document.createElement('button');
    accident_search_button.classList.add('accident_search_button');
    accident_search_button_text = document.createTextNode('검색');
    accident_search_button.appendChild(accident_search_button_text);

    // 검색버튼 핸들러
    accident_search_button.addEventListener('click', () => {
        // 검색 연도
        accident_search_year_input = document.getElementById('accident_search_year_input');
        accident_search_year_input_value = accident_search_year_input.value;

        // 시도, 시군구
        accident_menu_select_array = document.querySelectorAll('.accident_menu_select');
        if (accident_menu_select_array.length > 1) {
            accident_menu_select_value_sido = accident_menu_select_array[0].value;
            accident_menu_select_value_sigungu = accident_menu_select_array[1].value;
        }
        // api요청
        getAccidentInfo(accident_search_year_input_value, accident_menu_select_value_sido, accident_menu_select_value_sigungu);
    });

    // 검색버튼 부착
    accident_search_category.appendChild(accident_search_button);
}



/* 셀렉트박스 값 받아와서 검색결과 뿌려주기 */
async function getAccidentInfo(search_year, search_sido, search_sigungu) {
    let sido_code = ``;
    let sigungu_code = ``;
    sido_code = transfer_search_string_to_code(1, search_sido, ``);
    sigungu_code = transfer_search_string_to_code(2, search_sigungu, sido_code);

    try {
        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/http://apis.data.go.kr`;
        let path = `/B552061/AccidentDeath/getRestTrafficAccidentDeath`;
        let query = `?serviceKey=${DATA_GOV_KEY}&type=json&searchYear=${search_year}&siDo=${sido_code}&guGun=${sigungu_code}&pageNo=1&numOfRows=100`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        response = await transmitAndReceive(host, path, query, header, data, method)

        //    console.log(`[공공데이터포털 사망교통사고정보 응답] ${response}`);

        // 결과가 나타날 div
        let accident_result_div = document.querySelector('div.accident_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let accident_result_table = document.querySelector('table.accident_result_table');
        if (accident_result_table != null) {
            accident_result_div.removeChild(accident_result_table);
        }

        // 생성할 태그 초기화
        let accident_result_table_th = ``;
        let accident_result_table_th_text = ``;
        let accident_result_table_tr = ``;
        let accident_result_table_td = ``;
        let accident_result_table_td_text = ``;

        // table 태그 생성
        accident_result_table = document.createElement('table');
        accident_result_table.classList.add('accident_result_table');

        // 테이블 컬럼명 생성
        let th_tag_values = ['발생월일시', '주야구분', '발생요일', '사망자수', '부상자수', '사고유형 대분류', '사고유형 중분류', '사고유형', '법규위반내용', '도로형태', '가해차종', '피해차종'];
        th_tag_values.forEach((th_tag_value) => {
            accident_result_table_th = document.createElement('th');
            accident_result_table_th_text = document.createTextNode(th_tag_value);
            accident_result_table_th.appendChild(accident_result_table_th_text);
            accident_result_table.appendChild(accident_result_table_th);
        });

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.items.item;
        list_data.forEach((element, index) => {
            let accident_occurrence_date = element['occrrnc_dt'];
            let accident_day_night_code = transfer_search_code_to_string(1, element['dght_cd']);
            let accident_day_code = transfer_search_code_to_string(2, element['occrrnc_day_cd']);
            let accident_death_count = element['dth_dnv_cnt'];
            let accident_injury_count = element['injpsn_cnt'];
            let accident_type_classification_level_code = transfer_search_code_to_string(3, element['acc_ty_lclas_cd']);
            let accident_type_multiple_classification_level_code = transfer_search_code_to_string(4, element['acc_ty_mlsfc_cd']);
            let accident_type_code = transfer_search_code_to_string(5, element['acc_ty_cd']);
            let accident_assailant_violation_law_code = transfer_search_code_to_string(6, element['aslt_vtr_cd'].trim());
            let accident_road_type_code = transfer_search_code_to_string(7, element['road_frm_cd']);
            let accident_assailant_vehicle_code = transfer_search_code_to_string(8, element['wrngdo_isrty_vhcty_lclas_cd']);
            let accident_victim_vehicle_code = transfer_search_code_to_string(8, element['dmge_isrty_vhcty_lclas_cd']);

            // tr생성
            accident_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [accident_occurrence_date, accident_day_night_code, accident_day_code, accident_death_count, accident_injury_count, accident_type_classification_level_code, accident_type_multiple_classification_level_code,
                accident_type_code, accident_assailant_violation_law_code, accident_road_type_code, accident_assailant_vehicle_code, accident_victim_vehicle_code];

            td_tag_values.forEach((td_tag_value, index) => {
                accident_result_table_td = document.createElement('td');
                accident_result_table_td_text = document.createTextNode(td_tag_value);
                accident_result_table_td.appendChild(accident_result_table_td_text);
                accident_result_table_tr.appendChild(accident_result_table_td);
            });

            // 테이블에 붙이기
            accident_result_table.appendChild(accident_result_table_tr);
        });

        // 결과 div에 부착
        accident_result_div.appendChild(accident_result_table);
    } catch (error) {
        console.error(`[공공데이터포털 사망교통사고정보 에러] ${error}`);
    }
}

/* 주소를 코드로 변경 */
function transfer_search_string_to_code(response_column, response_value, sido_code) {
    let sigungu_code = ``;
    // 시도 일때
    if (response_column === 1) {
        switch (response_value) {
            case '서울특별시':
                sido_code = 1100;
                break;
            case '부산광역시':
                sido_code = 1200;
                break;
            case '대구광역시':
                sido_code = 2200;
                break;
            case '인천광역시':
                sido_code = 2300;
                break;
            case '광주광역시':
                sido_code = 2400;
                break;
            case '대전광역시':
                sido_code = 2500;
                break;
            case '울산광역시':
                sido_code = 2600;
                break;
            case '세종특별자치시':
                sido_code = 2700;
                break;
            case '경기도':
                sido_code = 1300;
                break;
            case '강원도':
                sido_code = 1400;
                break;
            case '충청북도':
                sido_code = 1500;
                break;
            case '충청남도':
                sido_code = 1600;
                break;
            case '전라북도':
                sido_code = 1700;
                break;
            case '전라남도':
                sido_code = 1800;
                break;
            case '경상북도':
                sido_code = 1900;
                break;
            case '경상남도':
                sido_code = 2000;
                break;
            case '제주특별자치도':
                sido_code = 2100;
                break;
            default:
                throw new RuntimeError('적절한 시도명이 아닙니다.');
        }
        return sido_code;
    }

    // 시군구 일때
    else if (response_column === 2) {
        // 서울
        if (sido_code === 1100) {
            switch (response_value) {
                case '강남구':
                    sigungu_code = 1116;
                    break;
                case '강동구':
                    sigungu_code = 1117;
                    break;
                case '강북구':
                    sigungu_code = 1124;
                    break;
                case '강서구':
                    sigungu_code = 1111;
                    break;
                case '관악구':
                    sigungu_code = 1115;
                    break;
                case '광진구':
                    sigungu_code = 1123;
                    break;
                case '구로구':
                    sigungu_code = 1112;
                    break;
                case '금천구':
                    sigungu_code = 1125;
                    break;
                case '노원구':
                    sigungu_code = 1122;
                    break;
                case '도봉구':
                    sigungu_code = 1107;
                    break;
                case '동대문구':
                    sigungu_code = 1105;
                    break;
                case '동작구':
                    sigungu_code = 1114;
                    break;
                case '마포구':
                    sigungu_code = 1110;
                    break;
                case '서대문구':
                    sigungu_code = 1109;
                    break;
                case '서초구':
                    sigungu_code = 1119;
                    break;
                case '성동구':
                    sigungu_code = 1104;
                    break;
                case '성북구':
                    sigungu_code = 1106;
                    break;
                case '송파구':
                    sigungu_code = 1118;
                    break;
                case '양천구':
                    sigungu_code = 1120;
                    break;
                case '영등포구':
                    sigungu_code = 1113;
                    break;
                case '용산구':
                    sigungu_code = 1103;
                    break;
                case '은평구':
                    sigungu_code = 1108;
                    break;
                case '종로구':
                    sigungu_code = 1101;
                    break;
                case '중구':
                    sigungu_code = 1102;
                    break;
                case '중랑구':
                    sigungu_code = 1121;
                    break;
            }
        }
        // 부산
        else if (sido_code === 1200) {
            switch (response_value) {
                case '강서구':
                    sigungu_code = 1212;
                    break;
                case '금정구':
                    sigungu_code = 1211;
                    break;
                case '기장군':
                    sigungu_code = 1216;
                    break;
                case '남구':
                    sigungu_code = 1207;
                    break;
                case '동구':
                    sigungu_code = 1203;
                    break;
                case '동래구':
                    sigungu_code = 1206;
                    break;
                case '북구':
                    sigungu_code = 1208;
                    break;
                case '사상구':
                    sigungu_code = 1215;
                    break;
                case '사하구':
                    sigungu_code = 1210;
                    break;
                case '서구':
                    sigungu_code = 1202;
                    break;
                case '수영구':
                    sigungu_code = 1214;
                    break;
                case '연제구':
                    sigungu_code = 1213;
                    break;
                case '영도구':
                    sigungu_code = 1204;
                    break;
                case '중구':
                    sigungu_code = 1201;
                    break;
                case '부산진구':
                    sigungu_code = 1205;
                    break;
                case '해운대':
                    sigungu_code = 1209;
                    break;
            }
        }
        // 대구
        else if (sido_code === 2200) {
            switch (response_value) {
                case '남구':
                    sigungu_code = 2204;
                    break;
                case '달서구':
                    sigungu_code = 2207;
                    break;
                case '달성군':
                    sigungu_code = 2208;
                    break;
                case '동구':
                    sigungu_code = 2202;
                    break;
                case '북구':
                    sigungu_code = 2205;
                    break;
                case '서구':
                    sigungu_code = 2203;
                    break;
                case '수성구':
                    sigungu_code = 2206;
                    break;
                case '중구':
                    sigungu_code = 2201;
                    break;
            }
        }
        // 인천광역시
        else if (sido_code === 2300) {
            switch (response_value) {
                case '강화군':
                    sigungu_code = 2309;
                    break;
                case '계양구':
                    sigungu_code = 2308;
                    break;
                case '미추홀구':
                    sigungu_code = 2303;
                    break;
                case '남동구':
                    sigungu_code = 2305;
                    break;
                case '동구':
                    sigungu_code = 2302;
                    break;
                case '부평구':
                    sigungu_code = 2304;
                    break;
                case '서구':
                    sigungu_code = 2306;
                    break;
                case '연수구':
                    sigungu_code = 2307;
                    break;
                case '옹진군':
                    sigungu_code = 2310;
                    break;
                case '중구':
                    sigungu_code = 2301;
                    break;
            }
        }
        // 광주광역시
        else if (sido_code === 2400) {
            switch (response_value) {
                case '광산구':
                    sigungu_code = 2404;
                    break;
                case '남구':
                    sigungu_code = 2405;
                    break;
                case '동구':
                    sigungu_code = 2401;
                    break;
                case '북구':
                    sigungu_code = 2403;
                    break;
                case '서구':
                    sigungu_code = 2402;
                    break;
            }
        }
        // 대전광역시
        else if (sido_code === 2500) {
            switch (response_value) {
                case '대덕구':
                    sigungu_code = 2505;
                    break;
                case '동구':
                    sigungu_code = 2501;
                    break;
                case '서구':
                    sigungu_code = 2503;
                    break;
                case '유성구':
                    sigungu_code = 2504;
                    break;
                case '중구':
                    sigungu_code = 2502;
                    break;
            }
        }
        // 울산광역시
        else if (sido_code === 2600) {
            switch (response_value) {
                case '남구':
                    sigungu_code = 2602;
                    break;
                case '동구':
                    sigungu_code = 2603;
                    break;
                case '북구':
                    sigungu_code = 2604;
                    break;
                case '울주군':
                    sigungu_code = 2605;
                    break;
                case '중구':
                    sigungu_code = 2601;
                    break;
            }
        }
        // 세종특별자치시
        else if (sido_code === 2700) {
            switch (response_value) {
                case '전체':
                    sigungu_code = 2701;
                    break;
            }
        }
        // 경기도
        else if (sido_code === 1300) {
            switch (response_value) {
                case '가평군':
                    sigungu_code = 1322;
                    break;
                case '고양시':
                    sigungu_code = 1318;
                    break;
                case '과천시':
                    sigungu_code = 1332;
                    break;
                case '광명시':
                    sigungu_code = 1309;
                    break;
                case '광주시':
                    sigungu_code = 1319;
                    break;
                case '구리시':
                    sigungu_code = 1310;
                    break;
                case '군포':
                    sigungu_code = 1333;
                    break;
                case '김포시':
                    sigungu_code = 1327;
                    break;
                case '남양주시':
                    sigungu_code = 1334;
                    break;
                case '동두천시':
                    sigungu_code = 1330;
                    break;
                case '부천시':
                    sigungu_code = 1306;
                    break;
                case '성남시':
                    sigungu_code = 1303;
                    break;
                case '수원시':
                    sigungu_code = 1302;
                    break;
                case '시흥시':
                    sigungu_code = 1316;
                    break;
                case '안산시':
                    sigungu_code = 1307;
                    break;
                case '안성시':
                    sigungu_code = 1326;
                    break;
                case '양평시':
                    sigungu_code = 1323;
                    break;
                case '여주시':
                    sigungu_code = 1313;
                    break;
                case '연천군':
                    sigungu_code = 1320;
                    break;
                case '오산시':
                    sigungu_code = 1335;
                    break;
                case '용인시':
                    sigungu_code = 1325;
                    break;
                case '의왕시':
                    sigungu_code = 1336;
                    break;
                case '의정부시':
                    sigungu_code = 1304;
                    break;
                case '이천시':
                    sigungu_code = 1324;
                    break;
                case '파주시':
                    sigungu_code = 1317;
                    break;
                case '평택시':
                    sigungu_code = 1308;
                    break;
                case '포천시':
                    sigungu_code = 1321;
                    break;
                case '하남시':
                    sigungu_code = 1337;
                    break;
                case '화성시':
                    sigungu_code = 1315;
                    break;
            }
        }
        // 강원도
        else if (sido_code === 1400) {
            switch (response_value) {
                case '강릉시':
                    sigungu_code = 1404;
                    break;
                case '고성시':
                    sigungu_code = 1422;
                    break;
                case '동해시':
                    sigungu_code = 1403;
                    break;
                case '삼척시':
                    sigungu_code = 1407;
                    break;
                case '속초시':
                    sigungu_code = 1405;
                    break;
                case '양구군':
                    sigungu_code = 1420;
                    break;
                case '양양군':
                    sigungu_code = 1423;
                    break;
                case '영월군':
                    sigungu_code = 1415;
                    break;
                case '원주시':
                    sigungu_code = 1402;
                    break;
                case '인제군':
                    sigungu_code = 1421;
                    break;
                case '정선군':
                    sigungu_code = 1417;
                    break;
                case '철원군':
                    sigungu_code = 1418;
                    break;
                case '춘천시':
                    sigungu_code = 1401;
                    break;
                case '태백시':
                    sigungu_code = 1406;
                    break;
                case '평창시':
                    sigungu_code = 1416;
                    break;
                case '홍천군':
                    sigungu_code = 1412;
                    break;
                case '화천군':
                    sigungu_code = 1419;
                    break;
                case '횡성군':
                    sigungu_code = 1413;
                    break;
            }
        }
        // 충청북도
        else if (sido_code === 1500) {
            switch (response_value) {
                case '괴산군':
                    sigungu_code = 1516;
                    break;
                case '단양군':
                    sigungu_code = 1520;
                    break;
                case '보은군':
                    sigungu_code = 1512;
                    break;
                case '영동군':
                    sigungu_code = 1514;
                    break;
                case '옥천군':
                    sigungu_code = 1513;
                    break;
                case '음성군':
                    sigungu_code = 1517;
                    break;
                case '제천군':
                    sigungu_code = 1503;
                    break;
                case '증평군':
                    sigungu_code = 1521;
                    break;
                case '진천군':
                    sigungu_code = 1515;
                    break;
                case '청원군':
                    sigungu_code = 1511;
                    break;
                case '청주시':
                    sigungu_code = 1501;
                    break;
                case '충주시':
                    sigungu_code = 1502;
                    break;
            }
        }
        // 충청남도
        else if (sido_code === 1600) {
            switch (response_value) {
                case '계룡시':
                    sigungu_code = 1624;
                    break;
                case '공주시':
                    sigungu_code = 1605;
                    break;
                case '금산군':
                    sigungu_code = 1611;
                    break;
                case '논산시':
                    sigungu_code = 1615;
                    break;
                case '당진시':
                    sigungu_code = 1623;
                    break;
                case '보령시':
                    sigungu_code = 1604;
                    break;
                case '부여군':
                    sigungu_code = 1616;
                    break;
                case '서산시':
                    sigungu_code = 1606;
                    break;
                case '서천군':
                    sigungu_code = 1617;
                    break;
                case '아산시':
                    sigungu_code = 1603;
                    break;
                case '연기군':
                    sigungu_code = 1613;
                    break;
                case '예산군':
                    sigungu_code = 1621;
                    break;
                case '천안시':
                    sigungu_code = 1602;
                    break;
                case '청양군':
                    sigungu_code = 1619;
                    break;
                case '태안군':
                    sigungu_code = 1612;
                    break;
                case '홍성군':
                    sigungu_code = 1620;
                    break;
            }
        }
        // 전라북도
        else if (sido_code === 1700) {
            switch (response_value) {
                case '고창군':
                    sigungu_code = 1719;
                    break;
                case '군산시':
                    sigungu_code = 1702;
                    break;
                case '김제시':
                    sigungu_code = 1706;
                    break;
                case '남원시':
                    sigungu_code = 1705;
                    break;
                case '무주군':
                    sigungu_code = 1713;
                    break;
                case '부안군':
                    sigungu_code = 1720;
                    break;
                case '순창군':
                    sigungu_code = 1717;
                    break;
                case '완주군':
                    sigungu_code = 1711;
                    break;
                case '익산시':
                    sigungu_code = 1723;
                    break;
                case '임실군':
                    sigungu_code = 1715;
                    break;
                case '장수군':
                    sigungu_code = 1714;
                    break;
                case '전주시':
                    sigungu_code = 1701;
                    break;
                case '정읍시':
                    sigungu_code = 1704;
                    break;
                case '진안군':
                    sigungu_code = 1712;
                    break;
            }
        }
        // 전라남도
        else if (sido_code === 1800) {
            switch (response_value) {
                case '강진군':
                    sigungu_code = 1822;
                    break;
                case '고흥군':
                    sigungu_code = 1818;
                    break;
                case '곡성군':
                    sigungu_code = 1813;
                    break;
                case '광양시':
                    sigungu_code = 1808;
                    break;
                case '구례군':
                    sigungu_code = 1814;
                    break;
                case '나주시':
                    sigungu_code = 1806;
                    break;
                case '담양군':
                    sigungu_code = 18012;
                    break;
                case '목포시':
                    sigungu_code = 1802;
                    break;
                case '무안군':
                    sigungu_code = 1825;
                    break;
                case '보성군':
                    sigungu_code = 1819;
                    break;
                case '순천시':
                    sigungu_code = 1804;
                    break;
                case '신안군':
                    sigungu_code = 1832;
                    break;
                case '여수시':
                    sigungu_code = 1803;
                    break;
                case '영광군':
                    sigungu_code = 1828;
                    break;
                case '영암군':
                    sigungu_code = 1824;
                    break;
                case '완도군':
                    sigungu_code = 1830;
                    break;
                case '장성군':
                    sigungu_code = 1829;
                    break;
                case '장흥군':
                    sigungu_code = 1821;
                    break;
                case '진도군':
                    sigungu_code = 1831;
                    break;
                case '함평군':
                    sigungu_code = 1827;
                    break;
                case '해남군':
                    sigungu_code = 1823;
                    break;
                case '화순군':
                    sigungu_code = 1820;
                    break;
            }
        }
        // 경상북도
        else if (sido_code === 1900) {
            switch (response_value) {
                case '경산군':
                    sigungu_code = 1935;
                    break;
                case '경주시':
                    sigungu_code = 1903;
                    break;
                case '고령군':
                    sigungu_code = 1923;
                    break;
                case '구미시':
                    sigungu_code = 1906;
                    break;
                case '군위군':
                    sigungu_code = 1912;
                    break;
                case '김천시':
                    sigungu_code = 1904;
                    break;
                case '문경시':
                    sigungu_code = 1909;
                    break;
                case '봉화군':
                    sigungu_code = 1932;
                    break;
                case '상주시':
                    sigungu_code = 1910;
                    break;
                case '성주군':
                    sigungu_code = 1924;
                    break;
                case '안동시':
                    sigungu_code = 1905;
                    break;
                case '영덕군':
                    sigungu_code = 1917;
                    break;
                case '영양군':
                    sigungu_code = 1916;
                    break;
                case '영주시':
                    sigungu_code = 1907;
                    break;
                case '영천시':
                    sigungu_code = 1908;
                    break;
                case '예천군':
                    sigungu_code = 1930;
                    break;
                case '울릉군':
                    sigungu_code = 1934;
                    break;
                case '울진군':
                    sigungu_code = 1933;
                    break;
                case '의성군':
                    sigungu_code = 1913;
                    break;
                case '청도군':
                    sigungu_code = 1922;
                    break;
                case '청송군':
                    sigungu_code = 1915;
                    break;
                case '칠곡군':
                    sigungu_code = 1925;
                    break;
                case '포항시':
                    sigungu_code = 1902;
                    break;
            }
        }
        // 경상남도
        else if (sido_code === 2000) {
            switch (response_value) {
                case '거제시':
                    sigungu_code = 2010;
                    break;
                case '거창군':
                    sigungu_code = 2028;
                    break;
                case '고성군':
                    sigungu_code = 2022;
                    break;
                case '김해시':
                    sigungu_code = 2008;
                    break;
                case '남해군':
                    sigungu_code = 2024;
                    break;
                case '마산시':
                    sigungu_code = 2001;
                    break;
                case '밀양시':
                    sigungu_code = 2009;
                    break;
                case '사천시':
                    sigungu_code = 2023;
                    break;
                case '산청군':
                    sigungu_code = 2026;
                    break;
                case '양산시':
                    sigungu_code = 2016;
                    break;
                case '의령군':
                    sigungu_code = 2012;
                    break;
                case '진주시':
                    sigungu_code = 2003;
                    break;
                case '진해시':
                    sigungu_code = 2005;
                    break;
                case '창녕군':
                    sigungu_code = 2014;
                    break;
                case '창원시':
                    sigungu_code = 2004;
                    break;
                case '통영시':
                    sigungu_code = 2006;
                    break;
                case '하동군':
                    sigungu_code = 2025;
                    break;
                case '함안군':
                    sigungu_code = 2013;
                    break;
                case '함양군':
                    sigungu_code = 2027;
                    break;
                case '합천군':
                    sigungu_code = 2029;
                    break;
            }
        }
        // 제주특별자치도
        else if (sido_code === 2100) {
            switch (response_value) {
                case '제주시':
                    sigungu_code = 2101;
                    break;
                case '서귀포시':
                    sigungu_code = 2102;
                    break;
            }
        }
        return sigungu_code;
    }
}

/* 받은 코드를 문자열로 리턴 */
function transfer_search_code_to_string(response_column, response_value) {
    let return_value = ``;
    // 주야코드
    if (response_column === 1) {
        if (response_value === '1')
            return_value = '주간';
        else if (response_value === '2')
            return_value = '야간';
    }

    // 요일코드
    else if (response_column === 2) {
        if (response_value === '1') return_value = '일';
        else if (response_value === '2') return_value = '월';
        else if (response_value === '3') return_value = '화';
        else if (response_value === '4') return_value = '수';
        else if (response_value === '5') return_value = '목';
        else if (response_value === '6') return_value = '금';
        else if (response_value === '7') return_value = '토';
    }


    // 사고유형 대분류
    else if (response_column === 3) {
        if (response_value === '01')
            return_value = '차대사람';
        else if (response_value === '02')
            return_value = '차대차';
        else if (response_value === '03')
            return_value = '차량단독';
        else if (response_value === '04')
            return_value = '철길건널목';
        else if (response_value === '99')
            return_value = '기타';
    }


    // 사고유형 중분류
    else if (response_column === 4) {
        if (response_value === '11')
            return_value = '횡단중';
        else if (response_value === '12')
            return_value = '차도통행중';
        else if (response_value === '13')
            return_value = '길가장자리통행중';
        else if (response_value === '14')
            return_value = '보도통행중';
        else if (response_value === '15')
            return_value = '기타';
        else if (response_value === '21')
            return_value = '정면충돌';
        else if (response_value === '22')
            return_value = '측면충돌';
        else if (response_value === '23')
            return_value = '추돌';
        else if (response_value === '24')
            return_value = '기타';
        else if (response_value === '26')
            return_value = '후진중충돌';
        else if (response_value === '31')
            return_value = '공작물충돌';
        else if (response_value === '32')
            return_value = '도로이탈';
        else if (response_value === '33')
            return_value = '주/정차차량충돌';
        else if (response_value === '34')
            return_value = '전도전복';
        else if (response_value === '35')
            return_value = '기타';
        else if (response_value === '36')
            return_value = '운전자부재';
        else if (response_value === '38')
            return_value = '전도';
        else if (response_value === '39')
            return_value = '전복';
        else if (response_value === '41')
            return_value = '철길건널목';
        else if (response_value === 'Z2')
            return_value = '차단기돌파';
        else if (response_value === 'Z3')
            return_value = '경보기무시';
        else if (response_value === 'Z4')
            return_value = '직전진행';
        else if (response_value === 'Z5')
            return_value = '기타';
        else if (response_value === 'Z6')
            return_value = '기타';
    }


    // 사고유형
    else if (response_column === 5) {
        if (response_value === '01')
            return_value = '횡단중';
        else if (response_value === '02')
            return_value = '차도통행중';
        else if (response_value === '03')
            return_value = '길가장자리통행중';
        else if (response_value === '04')
            return_value = '보도통행중';
        else if (response_value === '05')
            return_value = '기타';
        else if (response_value === '21')
            return_value = '정면충돌';
        else if (response_value === '22')
            return_value = '측면충돌';
        else if (response_value === '23')
            return_value = '추돌';
        else if (response_value === 'Z1')
            return_value = '진행중추돌';
        else if (response_value === 'Z2')
            return_value = '주정차중충돌';
        else if (response_value === '25')
            return_value = '기타';
        else if (response_value === '26')
            return_value = '후진중충돌';
        else if (response_value === '32')
            return_value = '공작물충돌';
        else if (response_value === '34')
            return_value = '도로이탈추락';
        else if (response_value === '35')
            return_value = '도로이탈기타';
        else if (response_value === '33')
            return_value = '주/정차차량충돌';
        else if (response_value === '31')
            return_value = '전도전복';
        else if (response_value === '37')
            return_value = '기타';
        else if (response_value === '36')
            return_value = '운전자부재';
        else if (response_value === '38')
            return_value = '전도';
        else if (response_value === '39')
            return_value = '전복';
        else if (response_value === '41')
            return_value = '철길건널목';
        else if (response_value === 'Z4')
            return_value = '차단기돌파';
        else if (response_value === 'Z5')
            return_value = '경보기무시';
        else if (response_value === 'Z6')
            return_value = '직전진행';
        else if (response_value === 'Z7')
            return_value = '기타';
        else if (response_value === 'Z8')
            return_value = '기타';
    }

    // 가해자법규위반
    else if (response_column === 6) {
        if (response_value === '01')
            return_value = '과속';
        else if (response_value === '02')
            return_value = '중앙성침범';
        else if (response_value === '03')
            return_value = '신호위반';
        else if (response_value === '04')
            return_value = '안전거리미확보';
        else if (response_value === '05')
            return_value = '안전운전의무불이행';
        else if (response_value === '06')
            return_value = '교차로통행방법위반';
        else if (response_value === '07')
            return_value = '보행자보호의무위반';
        else if (response_value === '99')
            return_value = '기타';
    }

    // 도로형태
    else if (response_column === 7) {
        if (response_value === '01')
            return_value = '터널안';
        else if (response_value === '02')
            return_value = '교량위';
        else if (response_value === '03')
            return_value = '고가도로위';
        else if (response_value === '04')
            return_value = '지하차도(도로)내';
        else if (response_value === '05')
            return_value = '기타단일로';
        else if (response_value === 'Z1')
            return_value = '횡단보도상';
        else if (response_value === 'Z2')
            return_value = '횡단보도부근';
        else if (response_value === '06')
            return_value = '교차로내';
        else if (response_value === '07')
            return_value = '교차로횡단보도내';
        else if (response_value === '08')
            return_value = '교차로부근';
        else if (response_value === '10')
            return_value = '철길건널목';
        else if (response_value === '98')
            return_value = '기타';
        else if (response_value === '99')
            return_value = '불명';
        else if (response_value === 'Z3')
            return_value = '기타/불명';
    }

    // 차종
    else if (response_column === 8) {
        if (response_value === '01')
            return_value = '승용차';
        else if (response_value === '02')
            return_value = '승합차';
        else if (response_value === '03')
            return_value = '화물차';
        else if (response_value === '04')
            return_value = '특수차';
        else if (response_value === '05')
            return_value = '이륜차';
        else if (response_value === '06')
            return_value = '사륜오토바이(ATV)';
        else if (response_value === '07')
            return_value = '원동기장치자전거';
        else if (response_value === '08')
            return_value = '자전거';
        else if (response_value === '09')
            return_value = '개인형이동수단(PM)';
        else if (response_value === '10')
            return_value = '건설기계';
        else if (response_value === '11')
            return_value = '농기계';
        else if (response_value === '12')
            return_value = '보행자';
        else if (response_value === '98')
            return_value = '기타';
        else if (response_value === '99')
            return_value = '불명';
        else if (response_value === 'Z1')
            return_value = '열차';
        else if (response_value === 'ZL')
            return_value = '기타';
    }

    return return_value;
}