// const KOFIC_KEY = 'ba4bcd991407f6c2f27ec9244f5f9df7';

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

        // 어제 날짜
        let yesterday = yyyy + '-' + mm + '-' + (dd - 1);

        // 날짜 input 태그의 기본값 설정, max 속성값 설정
        let input_movie_box_office_by_search_date = document.getElementById('input_movie_box_office_by_search_date')
        input_movie_box_office_by_search_date.value = yesterday;
        input_movie_box_office_by_search_date.setAttribute("max", yesterday);

        // 제목 input 태그에 포커스
        let input_movie_list_result_by_movie_name = document.getElementById('input_movie_list_result_by_movie_name')
        input_movie_list_result_by_movie_name.focus();
    } catch (error) {
        console.error(error);
    }
});

/* 날짜 input값 가져와서 박스오피스 리스트 뿌려주기 */
async function getBoxOfficeInfo() {
    try {
        // 검색날짜 input값 받아오기, 유효성 검사
        let input_movie_box_office_by_search_date = document.getElementById('input_movie_box_office_by_search_date');
        let input_movie_box_office_by_search_date_value = input_movie_box_office_by_search_date.value.replaceAll('-', '');

        // yyyyMMdd 정규표현식
        // let regex = /^(20)\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/;
    
        if (input_movie_box_office_by_search_date_value === null || input_movie_box_office_by_search_date_value === '' || parseInt(input_movie_box_office_by_search_date_value) < 20031111) {
            alert('2003.11.11 이후 날짜를 입력해 주세요');
            return;
        }

        // 결과가 나타날 div
        let movie_result_div = document.querySelector('div.movie_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_table = document.querySelector('table.movie_result_table');
        if (movie_result_table != null) {
            movie_result_div.removeChild(movie_result_table);
        }

        // detail_table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_detail_table = document.querySelector('table.movie_result_detail_table');
        if (movie_result_detail_table != null) {
            movie_result_div.removeChild(movie_result_detail_table);
        }

        // 생성할 태그 초기화
        let movie_result_table_th = ``;
        let movie_result_table_th_text = ``;
        let movie_result_table_tr = ``;
        let movie_result_table_td = ``;
        let movie_result_table_td_text = ``;

        // table 태그 생성
        movie_result_table = document.createElement('table');
        movie_result_table.classList.add('movie_result_table'); // movie_result_table.setAttribute('class', 'movie_result_table');
        movie_result_div.appendChild(movie_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['순위', '제목', '개봉일', '누적 관객수', '해당일자 상영횟수'];
        th_tag_values.forEach((th_tag_value) => {
            movie_result_table_th = document.createElement('th');
            movie_result_table_th_text = document.createTextNode(th_tag_value);
            movie_result_table_th.appendChild(movie_result_table_th_text);
            movie_result_table.appendChild(movie_result_table_th);
        });

        // API 요청
        let host = `http://www.kobis.or.kr`;
        let path = `/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json`;
        let query = `?key=${KOFIC_KEY}&targetDt=${input_movie_box_office_by_search_date_value}`
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        console.log(`[한국영화진흥위원회 KOFIC 박스오피스정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.boxOfficeResult.dailyBoxOfficeList;
        // 데이터가 비어있으면
        if (list_data.length === 0) {
            movie_result_table_tr = document.createElement('tr');
            movie_result_table_td = document.createElement('td');
            movie_result_table_td.setAttribute('colspan', th_tag_values.length)
            movie_result_table_td_text = document.createTextNode('정보 없음');
            movie_result_table_td.appendChild(movie_result_table_td_text);
            movie_result_table_tr.appendChild(movie_result_table_td);
            movie_result_table.appendChild(movie_result_table_tr);
            return;
        }
        // 데이터가 존재하면
        list_data.forEach(element => {
            let movie_rank = element.rank;
            let movie_name = element.movieNm; 
            let movie_open_date = element.openDt;
            let movie_audience_account = element.audiAcc;
            let movie_show_count = element.showCnt;
            
            // tr생성
            movie_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [movie_rank, movie_name, movie_open_date, movie_audience_account, movie_show_count];
            td_tag_values.forEach((td_tag_value) => {
                movie_result_table_td = document.createElement('td');
                movie_result_table_td_text = document.createTextNode(td_tag_value);
                movie_result_table_td.appendChild(movie_result_table_td_text);
                movie_result_table_tr.appendChild(movie_result_table_td);
            });

            // 테이블에 붙이기
            movie_result_table.appendChild(movie_result_table_tr);
        });
    } catch (error) {
        console.error(`[한국영화진흥위원회 KOFIC 박스오피스정보 에러] ${error}`);
    }
}


/* 제목 input값 가져와서 영화 리스트 뿌려주기 */
async function getMovieInfo() {
    try {
        // 검색제목 input값 받아오기, 유효성 검사
        let input_movie_list_result_by_movie_name = document.getElementById('input_movie_list_result_by_movie_name');
        let input_movie_list_result_by_movie_name_value = input_movie_list_result_by_movie_name.value.trim();
    
        if (input_movie_list_result_by_movie_name_value === null || input_movie_list_result_by_movie_name_value === '') {
            alert('공백은 입력할 수 없습니다');
            return;
        }

        // 결과가 나타날 div
        let movie_result_div = document.querySelector('div.movie_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_table = document.querySelector('table.movie_result_table');
        if (movie_result_table != null) {
            movie_result_div.removeChild(movie_result_table);
        }

        // detail_table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_detail_table = document.querySelector('table.movie_result_detail_table');
        if (movie_result_detail_table != null) {
            movie_result_div.removeChild(movie_result_detail_table);
        }

        // 생성할 태그 초기화
        let movie_result_table_th = ``;
        let movie_result_table_th_text = ``;
        let movie_result_table_tr = ``;
        let movie_result_table_td = ``;
        let movie_result_table_td_text = ``;
        let movie_result_table_td_a = ``;

        // table 태그 생성
        movie_result_table = document.createElement('table');
        movie_result_table.classList.add('movie_result_table'); // movie_result_table.setAttribute('class', 'movie_result_table');
        movie_result_div.appendChild(movie_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['번호', '제작연도', '개봉일', '장르', '제작국가', '감독', '제목(국문)'];
        th_tag_values.forEach((th_tag_value) => {
            movie_result_table_th = document.createElement('th');
            movie_result_table_th_text = document.createTextNode(th_tag_value);
            movie_result_table_th.appendChild(movie_result_table_th_text);
            movie_result_table.appendChild(movie_result_table_th);
        });

        // API 요청
        let host = `http://www.kobis.or.kr`;
        let path = `/kobisopenapi/webservice/rest/movie/searchMovieList.json`;
        let query = `?key=${KOFIC_KEY}&movieNm=${input_movie_list_result_by_movie_name_value}`
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        console.log(`[한국영화진흥위원회 KOFIC 영화제목검색 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.movieListResult.movieList;
        // 데이터가 비어있으면
        if (list_data.length === 0) {
            movie_result_table_tr = document.createElement('tr');
            movie_result_table_td = document.createElement('td');
            movie_result_table_td.setAttribute('colspan', th_tag_values.length)
            movie_result_table_td_text = document.createTextNode('정보 없음');
            movie_result_table_td.appendChild(movie_result_table_td_text);
            movie_result_table_tr.appendChild(movie_result_table_td);
            movie_result_table.appendChild(movie_result_table_tr);
            return;
        }
        // 데이터가 존재하면
        list_data.forEach((element, index) => {
            let movie_index = index + 1;
            let movie_code = element.movieCd;
            let movie_name = element.movieNm;
            let movie_prod_year = element.prdtYear;
            let movie_open_date = element.openDt;
            let movie_genre = element.genreAlt;
            let movie_prod_nation = element.repNationNm;
            let list_movie_director = element.directors;
            let movie_director = Array.isArray(list_movie_director) && list_movie_director.length === 0 ? 'unknown' : list_movie_director[0]['peopleNm'];

            // tr생성
            movie_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그, a태그 생성
            let td_tag_values = [movie_index, movie_prod_year, movie_open_date, movie_genre, movie_prod_nation, movie_director, movie_name];
            td_tag_values.forEach((td_tag_value, index) => {
                movie_result_table_td = document.createElement('td');
                movie_result_table_td_text = document.createTextNode(td_tag_value);

                // 제목만 a태그로 감싸서 클릭 이벤트 부여
                if (index === 6) {
                    movie_result_table_td_a = document.createElement('a');
                    movie_result_table_td_a.setAttribute('href', `javascript:getMovieDetailInfo(${movie_code});`);
                    movie_result_table_td_a.classList.add('index_link');
                    movie_result_table_td_a.appendChild(movie_result_table_td_text);
                    movie_result_table_td.appendChild(movie_result_table_td_a);
                } else {
                    movie_result_table_td.appendChild(movie_result_table_td_text);
                }

                movie_result_table_tr.appendChild(movie_result_table_td);
            });

            // 테이블에 붙이기
            movie_result_table.appendChild(movie_result_table_tr);
        });
    } catch (error) {
        console.error(`[한국영화진흥위원회 KOFIC 영화제목검색 에러] ${error}`);
    }
}

/* 클릭한 영화의 영화코드 가져와서 영화 상세정보 뿌려주기 */
async function getMovieDetailInfo(movie_code) {
    try {
        if (!movie_code) {
            alert('상세정보를 조회할 수 없는 영화입니다');
            return;
        }

        // 결과가 나타날 div
        let movie_result_div = document.querySelector('div.movie_result_div');

        // detail_table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_detail_table = document.querySelector('table.movie_result_detail_table');
        if (movie_result_detail_table != null) {
            movie_result_div.removeChild(movie_result_detail_table);
        }

        // 생성할 태그 초기화
        let movie_result_detail_table_th = ``;
        let movie_result_detail_table_th_text = ``;
        let movie_result_detail_table_tr = ``;
        let movie_result_detail_table_td = ``;
        let movie_result_detail_table_td_text = ``;

        // table 태그 생성
        movie_result_detail_table = document.createElement('table');
        movie_result_detail_table.classList.add('movie_result_detail_table'); // movie_result_detail_table.setAttribute('class', 'movie_result_detail_table');
        movie_result_div.appendChild(movie_result_detail_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['러닝타임(분)', '제작연도', '개봉일', '제목(국문)', '제목(영문)'];
        th_tag_values.forEach((th_tag_value) => {
            movie_result_detail_table_th = document.createElement('th');
            movie_result_detail_table_th_text = document.createTextNode(th_tag_value);
            movie_result_detail_table_th.appendChild(movie_result_detail_table_th_text);
            movie_result_detail_table.appendChild(movie_result_detail_table_th);
        });

        // API 요청
        let host = `http://www.kobis.or.kr`;
        let path = `/kobisopenapi/webservice/rest/movie/searchMovieInfo.json`;
        let query = `?key=${KOFIC_KEY}&movieCd=${movie_code}`
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        console.log(`[한국영화진흥위원회 KOFIC 영화상세정보검색 응답] `, response)


        // 응답 데이터를 결과테이블에 입력
        let object_data = response.data.movieInfoResult.movieInfo;

        let detail_movie_name_kor = object_data.movieNm;
        let detail_movie_movie_name_eng = object_data.movieNmEn;
        let detail_movie_movie_show_time = object_data.showTm;
        let detail_movie_movie_prod_year = object_data.prdtYear;
        let detail_movie_movie_open_date = object_data.openDt;

        // tr생성
        movie_result_detail_table_tr = document.createElement('tr');

        // 테이블 내용 배열 생성, td태그 생성
        let td_tag_values = [detail_movie_movie_show_time, detail_movie_movie_prod_year, detail_movie_movie_open_date, detail_movie_name_kor, detail_movie_movie_name_eng];
        td_tag_values.forEach((td_tag_value) => {
            movie_result_detail_table_td = document.createElement('td');
            movie_result_detail_table_td_text = document.createTextNode(td_tag_value);
            movie_result_detail_table_td.appendChild(movie_result_detail_table_td_text);
            movie_result_detail_table_tr.appendChild(movie_result_detail_table_td);
        });

        // 테이블에 붙이기
        movie_result_detail_table.appendChild(movie_result_detail_table_tr);
        
    } catch (error) {
        console.error(`[한국영화진흥위원회 KOFIC 영화상세정보검색 에러] ${error}`);
    }
}

/* 클릭한 영화의 영화코드 가져와서 영화 상세정보 뿌려주기 */
async function getMoviePersonInfo() {
    try {
        // 검색제목 input값 받아오기, 유효성 검사
        let input_movie_person_by_person_name = document.getElementById('input_movie_person_by_person_name');
        let input_movie_person_by_person_name_value = input_movie_person_by_person_name.value.trim();

        if (input_movie_person_by_person_name_value === null || input_movie_person_by_person_name_value === '') {
            alert('공백은 입력할 수 없습니다');
            return;
        }

        // 결과가 나타날 div
        let movie_result_div = document.querySelector('div.movie_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_table = document.querySelector('table.movie_result_table');
        if (movie_result_table != null) {
            movie_result_div.removeChild(movie_result_table);
        }

        // detail_table 태그를 찾아보고 있으면 해당 태그 제거
        let movie_result_detail_table = document.querySelector('table.movie_result_detail_table');
        if (movie_result_detail_table != null) {
            movie_result_div.removeChild(movie_result_detail_table);
        }

        // 생성할 태그 초기화
        let movie_result_table_th = ``;
        let movie_result_table_th_text = ``;
        let movie_result_table_tr = ``;
        let movie_result_table_td = ``;
        let movie_result_table_td_text = ``;

        // table 태그 생성
        movie_result_table = document.createElement('table');
        movie_result_table.classList.add('movie_result_table'); // movie_result_table.setAttribute('class', 'movie_result_table');
        movie_result_div.appendChild(movie_result_table);

        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['번호', '이름', '이름(영문)', '역할', '필모그래피'];
        th_tag_values.forEach((th_tag_value) => {
            movie_result_table_th = document.createElement('th');
            movie_result_table_th_text = document.createTextNode(th_tag_value);
            movie_result_table_th.appendChild(movie_result_table_th_text);
            movie_result_table.appendChild(movie_result_table_th);
        });

        // API 요청
        let host = `http://www.kobis.or.kr`;
        let path = `/kobisopenapi/webservice/rest/people/searchPeopleList.json`;
        let query = `?key=${KOFIC_KEY}&peopleNm=${input_movie_person_by_person_name_value}`
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        console.log(`[한국영화진흥위원회 KOFIC 영화인검색정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.peopleListResult.peopleList;
        // 데이터가 비어있으면
        if (list_data.length === 0) {
            movie_result_table_tr = document.createElement('tr');
            movie_result_table_td = document.createElement('td');
            movie_result_table_td.setAttribute('colspan', th_tag_values.length)
            movie_result_table_td_text = document.createTextNode('정보 없음');
            movie_result_table_td.appendChild(movie_result_table_td_text);
            movie_result_table_tr.appendChild(movie_result_table_td);
            movie_result_table.appendChild(movie_result_table_tr);
            return;
        }
        // 데이터가 존재하면
        list_data.forEach((element, index) => {
            let movie_index = index + 1;
            let movie_people_name_kor = element.peopleNm;
            let movie_people_name_eng = element.peopleNmEn; 
            let movie_people_role_name = element.repRoleNm;
            let movie_people_filmography_names = element.filmoNames;
            
            // tr생성
            movie_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [movie_index, movie_people_name_kor, movie_people_name_eng, movie_people_role_name, movie_people_filmography_names];
            td_tag_values.forEach((td_tag_value, index) => {
                movie_result_table_td = document.createElement('td');  
                if (index / 4 == 1){
                    movie_result_table_td.setAttribute('width', '1200px');
                }
                movie_result_table_td_text = document.createTextNode(td_tag_value.toString().replaceAll('|', ' | '));
                movie_result_table_td.appendChild(movie_result_table_td_text);
                movie_result_table_tr.appendChild(movie_result_table_td);
            });

            // 테이블에 붙이기
            movie_result_table.appendChild(movie_result_table_tr);
        });
        
    } catch (error) {
        console.error(`[한국영화진흥위원회 KOFIC 영화인검색정보 에러] ${error}`);
    }
}
