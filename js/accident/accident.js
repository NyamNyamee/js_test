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
        let accident_result_table_td_img = ``;

        // table 태그 생성
        accident_result_table = document.createElement('table');
        accident_result_table.classList.add('accident_result_table');

        // 테이블 컬럼명 생성
        let th_tag_values = ['발생월일시', '주야구분', '발생요일', '사망자수', '부상자수', '사고유형 대분류', '사고유형 중분류', '사고유형', '법규의반내용', '도로형태', '가해차종', '피해차종'];
        th_tag_values.forEach((th_tag_value) => {
            accident_result_table_th = document.createElement('th');
            accident_result_table_th_text = document.createTextNode(th_tag_value);
            accident_result_table_th.appendChild(accident_result_table_th_text);
            accident_result_table.appendChild(accident_result_table_th);
        });

        
        getAccidentInfo(accident_search_year_input_value, accident_menu_select_value_sido, accident_menu_select_value_sigungu);

        // 결과 div에 부착
        accident_result_div.appendChild(accident_result_table);
    });

    // 검색버튼 부착
    accident_search_category.appendChild(accident_search_button);
}



/* 셀렉트박스 값 받아와서 검색결과 뿌려주기 */
async function getAccidentInfo(search_year, search_sido, search_sigungu) {
    try {
       // API 요청
       let host = `http://apis.data.go.kr`;
       let path = `/B552061/AccidentDeath/getRestTrafficAccidentDeath`;
       let query = `?serviceKey=${DATA_GOV_KEY}&type=json&searchYear=${search_year}&siDo=${search_sido}&guGun=${search_sigungu}&pageNo=1&numOfRows=100`;
       let header = ``;
       let data = ``;
       let method = `GET`;

       const response = await transmitAndReceive(host, path, query, header, data, method)

       console.log(`[공공데이터포털] 사망교통사고정보 응답 ${response}`);


        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.items.item;
        list_data.forEach((element, index) => {
            let music_index = index + 1;
            let music_name = element.name;
            let music_album_title = element.album.title;
            let music_album_release_date = element.album.releaseYmd;
            let music_album_genre = element.album.genreStyle;
            let music_album_image_url = element.album.imgList[0].url;
            let music_artist = element.representationArtist.name;

            // tr생성
            music_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [music_index, music_name, music_artist, music_album_release_date, music_album_genre, music_album_title, music_album_image_url];
            td_tag_values.forEach((td_tag_value, index) => {
                music_result_table_td = document.createElement('td');

                // 이미지 url일때와 아닐때 구분
                if (index === 6) {
                    music_result_table_td_img = document.createElement('img');
                    music_result_table_td_img.setAttribute('src', td_tag_value);
                    music_result_table_td_img.setAttribute('alt', '미확인');
                    music_result_table_td.appendChild(music_result_table_td_img);
                } else {
                    music_result_table_td_text = document.createTextNode(td_tag_value);
                    music_result_table_td.appendChild(music_result_table_td_text);
                }

                music_result_table_tr.appendChild(music_result_table_td);
            });

            // 테이블에 붙이기
            music_result_table.appendChild(music_result_table_tr);
        });
    } catch (error) {
        console.error(`[FLO Music 최신 100곡 정보 박스오피스정보 에러] ${error}`);
    }
}
