// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        // 예방접종센터 지역명에 포커스
        let covid19_vaccine_center_by_search_address_input = document.getElementById('covid19_vaccine_center_by_search_address_input');
        covid19_vaccine_center_by_search_address_input.focus();
    } catch (error) {
        console.error(error);
    }
});

/* input 값 받아와서 검색결과 뿌려주기 */
async function getVaccineCenterInfo() {
    try {
        // 검색날짜 input값 받아오기, 유효성 검사
        let covid19_vaccine_center_by_search_address_input = document.getElementById('covid19_vaccine_center_by_search_address_input');
        let covid19_vaccine_center_by_search_address_input_value = covid19_vaccine_center_by_search_address_input.value;

        // 결과가 나타날 div
        let covid19_result_div = document.querySelector('div.covid19_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let covid19_result_table = document.querySelector('table.covid19_result_table');
        if (covid19_result_table != null) {
            covid19_result_div.removeChild(covid19_result_table);
        }

        // div 태그를 찾아보고 있으면 해당 태그 제거
        let covid19_issue_detail_div = document.querySelector('div.covid19_issue_detail_div');
        if (covid19_issue_detail_div != null) {
            covid19_result_div.removeChild(covid19_issue_detail_div);
        }

        // 생성할 태그 초기화
        let covid19_result_table_th = ``;
        let covid19_result_table_th_text = ``;
        let covid19_result_table_tr = ``;
        let covid19_result_table_td = ``;
        let covid19_result_table_td_text = ``;

        // table 태그 생성
        covid19_result_table = document.createElement('table');
        covid19_result_table.classList.add('covid19_result_table'); // covid19_result_table.setAttribute('class', 'covid19_result_table');
        covid19_result_div.appendChild(covid19_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['센터번호', '우편번호', '센터명', '시설명', '주소', '설립일자', '전화번호'];
        th_tag_values.forEach((th_tag_value) => {
            covid19_result_table_th = document.createElement('th');
            covid19_result_table_th_text = document.createTextNode(th_tag_value);
            covid19_result_table_th.appendChild(covid19_result_table_th_text);
            covid19_result_table.appendChild(covid19_result_table_th);
        });

        // API 요청
        let host = `https://api.odcloud.kr`;
        let path = `/api/15077586/v1/centers`;
        let query = `?serviceKey=${DATA_GOV_KEY}&perPage=1000`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[공공데이터포털] 코로나19 센터 정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.data;
        list_data.forEach(element => {
            let covid19_center_id = element.id;
            let covid19_center_zip_code = element.zipCode;
            let covid19_center_name = element.centerName;
            let covid19_center_facility_name = element.facilityName;
            let covid19_center_address = element.address;
            let covid19_center_created_date = element.createdAt;
            let covid19_center_phone_number = element.phoneNumber;

            covid19_center_created_date = covid19_center_created_date.split(' ')[0];

            if (covid19_center_address.includes(covid19_vaccine_center_by_search_address_input_value)) {
                // tr생성
                covid19_result_table_tr = document.createElement('tr');

                // 테이블 내용 배열 생성, td태그 생성
                let td_tag_values = [covid19_center_id, covid19_center_zip_code, covid19_center_name, covid19_center_facility_name, covid19_center_address, covid19_center_created_date, covid19_center_phone_number];
                td_tag_values.forEach((td_tag_value) => {
                    covid19_result_table_td = document.createElement('td');
                    covid19_result_table_td_text = document.createTextNode(td_tag_value);
                    covid19_result_table_td.appendChild(covid19_result_table_td_text);
                    covid19_result_table_tr.appendChild(covid19_result_table_td);
                });

                // 테이블에 붙이기
                covid19_result_table.appendChild(covid19_result_table_tr);
            }
        });

        // 일치하는 검색결과가 하나도 없어서 tr태그가 만들어지지 않았다면
        covid19_result_table_tr = document.querySelector('.covid19_result_table > tr');
        if (!covid19_result_table_tr){
            covid19_result_table_tr = document.createElement('tr');
            covid19_result_table_td = document.createElement('td');
            covid19_result_table_td.setAttribute('colspan', th_tag_values.length)
            covid19_result_table_td_text = document.createTextNode('정보 없음');
            covid19_result_table_td.appendChild(covid19_result_table_td_text);
            covid19_result_table_tr.appendChild(covid19_result_table_td);
            covid19_result_table.appendChild(covid19_result_table_tr);
            return;
        }
    } catch (error) {
        console.error(`[공공데이터포털] 코로나19 센터 정보 에러] ${error}`);
    }
}

/* input 값 받아와서 검색결과 뿌려주기 */
async function getNationalIssueInfo() {
    try {
        // 검색날짜 input값 받아오기, 유효성 검사
        let covid19_national_issue_by_search_nation_input = document.getElementById('covid19_national_issue_by_search_nation_input');
        let covid19_national_issue_by_search_nation_input_value = covid19_national_issue_by_search_nation_input.value.trim();

        if (covid19_national_issue_by_search_nation_input_value === null || covid19_national_issue_by_search_nation_input_value === '') {
            alert('국가명을 입력해주세요!');
            return;
        }

        // 결과가 나타날 div
        let covid19_result_div = document.querySelector('div.covid19_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let covid19_result_table = document.querySelector('table.covid19_result_table');
        if (covid19_result_table != null) {
            covid19_result_div.removeChild(covid19_result_table);
        }

        // div 태그를 찾아보고 있으면 해당 태그 제거
        let covid19_issue_detail_div = document.querySelector('div.covid19_issue_detail_div');
        if (covid19_issue_detail_div != null) {
            covid19_result_div.removeChild(covid19_issue_detail_div);
        }

        // 생성할 태그 초기화
        let covid19_result_table_th = ``;
        let covid19_result_table_th_text = ``;
        let covid19_result_table_tr = ``;
        let covid19_result_table_td = ``;
        let covid19_result_table_td_text = ``;

        // table 태그 생성
        covid19_result_table = document.createElement('table');
        covid19_result_table.classList.add('covid19_result_table'); // covid19_result_table.setAttribute('class', 'covid19_result_table');
        covid19_result_div.appendChild(covid19_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['번호', '작성일', '국가', '타이틀'];
        th_tag_values.forEach((th_tag_value) => {
            covid19_result_table_th = document.createElement('th');
            covid19_result_table_th_text = document.createTextNode(th_tag_value);
            covid19_result_table_th.appendChild(covid19_result_table_th_text);
            covid19_result_table.appendChild(covid19_result_table_th);
        });

        // API 요청
        let host = `http://apis.data.go.kr`;
        let path = `/1262000/CountryCovid19SafetyServiceNew/getCountrySafetyNewsListNew`;
        let query = `?serviceKey=${DATA_GOV_KEY}&numOfRows=100&pageNo=1&cond[country_nm::EQ]=${covid19_national_issue_by_search_nation_input_value}`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[공공데이터포털] 코로나19 국가별 이슈 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.data;
        // 데이터가 비어있으면
        if (list_data.length === 0){
            covid19_result_table_tr = document.createElement('tr');
            covid19_result_table_td = document.createElement('td');
            covid19_result_table_td.setAttribute('colspan', th_tag_values.length)
            covid19_result_table_td_text = document.createTextNode('정보 없음');
            covid19_result_table_td.appendChild(covid19_result_table_td_text);
            covid19_result_table_tr.appendChild(covid19_result_table_td);
            covid19_result_table.appendChild(covid19_result_table_tr);
            return;
        }
        // 데이터가 존재하면
        list_data.forEach((element, index) => {
            let covid19_issue_index = index + 1;
            let covid19_issue_written_date = element.wrt_dt;
            let covid19_issue_country_name = element.country_nm;
            let covid19_issue_title = element.title;
            let covid19_issue_content = element.txt_origin_cn;

            // tr생성
            covid19_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [covid19_issue_index, covid19_issue_written_date, covid19_issue_country_name, covid19_issue_title];
            td_tag_values.forEach((td_tag_value, index) => {
                covid19_result_table_td = document.createElement('td');
                covid19_result_table_td_text = document.createTextNode(td_tag_value);

                // 제목만 a태그로 감싸서 클릭 이벤트 부여
                if (index === 3) {
                    covid19_result_table_td_a = document.createElement('a');
                    covid19_result_table_td_a.setAttribute('href', `javascript:getNationalIssueDetail('${covid19_issue_content}');`);
                    covid19_result_table_td_a.classList.add('index_link');
                    covid19_result_table_td_a.appendChild(covid19_result_table_td_text);
                    covid19_result_table_td.appendChild(covid19_result_table_td_a);
                } else {
                    covid19_result_table_td.appendChild(covid19_result_table_td_text);
                }

                covid19_result_table_tr.appendChild(covid19_result_table_td);
            });
            // 테이블에 붙이기
            covid19_result_table.appendChild(covid19_result_table_tr);
        });
    } catch (error) {
        console.error(`[공공데이터포털] 코로나19 국가별 이슈 에러] ${error}`);
    }
}

/* 국가별 이슈 상세 내용 받아서 뿌려주기 */
function getNationalIssueDetail(covid19_issue_content) {
    let covid19_result_div = document.querySelector('div.covid19_result_div');

    // div 태그를 찾아보고 있으면 해당 태그 제거
    let covid19_issue_detail_div = document.querySelector('div.covid19_issue_detail_div');
    if (covid19_issue_detail_div != null) {
        covid19_result_div.removeChild(covid19_issue_detail_div);
    }

    covid19_issue_detail_div = document.createElement('div');
    covid19_issue_detail_div.classList.add('covid19_issue_detail_div');
    covid19_issue_content = document.createTextNode(covid19_issue_content.replaceAll('&nbsp;', '\n')); // \n해도 개행이 안됨. 이유를 모르겠음
    covid19_issue_detail_div.appendChild(covid19_issue_content);
    covid19_result_div.appendChild(covid19_issue_detail_div);
}