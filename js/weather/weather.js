// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {
        let today = new Date();

        let yyyy = today.getFullYear(); // 연도
        let mm = today.getMonth() + 1; // 1월이 0임
        let dd = today.getDate(); // 오늘 일자

        // input type date의 맥스날짜를 (오늘-1)일 로 설정 
        // 월이 한자리수 일 때
        if (mm < 10) {
            mm = '0' + mm
        }
        // 일이 한자리수 일 때
        if (dd < 10) {
            dd = '0' + dd
        }

        // 그저께 날짜
        let day_before_yesterday = yyyy + '-' + mm + '-' + (dd - 2);

        // 날짜 input 태그의 기본값 설정, max 속성값 설정
        let weather_by_search_date_input = document.getElementById('weather_by_search_date_input')
        weather_by_search_date_input.value = day_before_yesterday;
        weather_by_search_date_input.setAttribute("max", day_before_yesterday);
    } catch (error) {
        console.error(error);
    }
});

/* input 값 받아와서 검색결과 뿌려주기 */
async function getPastWeatherInfo() {
    try {
        // 검색날짜 input값 받아오기, 유효성 검사
        let weather_by_search_date_input = document.getElementById('weather_by_search_date_input');
        let weather_by_search_date_input_value = weather_by_search_date_input.value.replaceAll('-', '');
        let weather_by_search_station_value = '108' // (임시)서울로 고정

        // yyyyMMdd 정규표현식
        // let regex = /^(20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;

        if (weather_by_search_date_input_value === null || weather_by_search_date_input_value === '' || parseInt(weather_by_search_date_input_value) < 19071001) {
            alert('1907.10.01 이후 날짜를 입력해 주세요');
            return;
        }

        // 결과가 나타날 div
        let weather_result_div = document.querySelector('div.weather_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let weather_result_table = document.querySelector('table.weather_result_table');
        if (weather_result_table != null) {
            weather_result_div.removeChild(weather_result_table);
        }

        // 생성할 태그 초기화
        let weather_result_table_th = ``;
        let weather_result_table_th_text = ``;
        let weather_result_table_tr = ``;
        let weather_result_table_td = ``;
        let weather_result_table_td_text = ``;

        // table 태그 생성
        weather_result_table = document.createElement('table');
        weather_result_table.classList.add('weather_result_table'); // weather_result_table.setAttribute('class', 'weather_result_table');
        weather_result_div.appendChild(weather_result_table);
        
        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['번호', '시각', '관측지점', '온도', '습도', '풍속', '강수량'];
        th_tag_values.forEach((th_tag_value) => {
            weather_result_table_th = document.createElement('th');
            weather_result_table_th_text = document.createTextNode(th_tag_value);
            weather_result_table_th.appendChild(weather_result_table_th_text);
            weather_result_table.appendChild(weather_result_table_th);
        });

        // API 요청
        let host = `http://cors-anywhere.herokuapp.com/http://apis.data.go.kr`; /* CORS 에러떄문에 클라이언트에서 API서버로 바로 요청보낼 수 없어서 중간에 프록시서버를 거쳐 요청하도록 변경 */
        let path = `/1360000/AsosHourlyInfoService/getWthrDataList`;
        let query = `?serviceKey=${DATA_GOV_KEY}&pageNo=1&numOfRows=100&dataType=JSON&dataCd=ASOS&dateCd=HR&startDt=${weather_by_search_date_input_value}&startHh=01&endDt=${parseInt(weather_by_search_date_input_value) + 1}&endHh=23&stnIds=${weather_by_search_station_value}`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[공공데이터포털] 지난 날씨정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.response.body.items.item;
        list_data.forEach((element, index) => {
            let weather_info_index = index + 1;
            let weather_date = element.tm;
            let weather_station_name = element.stnNm;
            let weather_temperature = element.ta;
            let weather_humidity = element.hm;
            let weather_wind_speed = element.ws;
            let weather_info_rainfall = (!element.rn) ? '0' : element.rn;

            // tr생성
            weather_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [weather_info_index, weather_date, weather_station_name, weather_temperature, weather_humidity, weather_wind_speed, weather_info_rainfall];
            td_tag_values.forEach((td_tag_value) => {
                weather_result_table_td = document.createElement('td');
                weather_result_table_td_text = document.createTextNode(td_tag_value);
                weather_result_table_td.appendChild(weather_result_table_td_text);
                weather_result_table_tr.appendChild(weather_result_table_td);
            });

            // 테이블에 붙이기
            weather_result_table.appendChild(weather_result_table_tr);
        });
    } catch (error) {
        console.error(`[공공데이터포털] 지난 날씨정보 에러] ${error}`);
    }
}
