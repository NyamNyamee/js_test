// 페이지 로딩 시
document.addEventListener("DOMContentLoaded", function () {
    try {

    } catch (error) {
        console.error(error);
    }
});

/* 셀렉트박스 값 받아와서 검색결과 뿌려주기 */
async function getMusicNew100() {
    try {
        // 검색날짜 input값 받아오기, 유효성 검사
        let music_loacation_select = document.getElementById('music_loacation_select');
        let music_loacation_select_value = music_loacation_select.value;
        music_loacation_select_value = (music_loacation_select_value == '01') ? 'KPOP' : 'POP'

        // 결과가 나타날 div
        let music_result_div = document.querySelector('div.music_result_div');

        // table 태그를 찾아보고 있으면 해당 태그 제거
        let music_result_table = document.querySelector('table.music_result_table');
        if (music_result_table != null) {
            music_result_div.removeChild(music_result_table);
        }

        // 생성할 태그 초기화
        let music_result_table_th = ``;
        let music_result_table_th_text = ``;
        let music_result_table_tr = ``;
        let music_result_table_td = ``;
        let music_result_table_td_text = ``;

        // table 태그 생성
        music_result_table = document.createElement('table');
        music_result_table.classList.add('music_result_table');
        music_result_div.appendChild(music_result_table);
        
        // 테이블 컬럼명 배열 생성, th태그 생성
        let th_tag_values = ['번호', '곡명', '아티스트', '발매일', '장르', '앨범명'];
        th_tag_values.forEach((th_tag_value) => {
            music_result_table_th = document.createElement('th');
            music_result_table_th_text = document.createTextNode(th_tag_value);
            music_result_table_th.appendChild(music_result_table_th_text);
            music_result_table.appendChild(music_result_table_th);
        });

        // API 요청
        let host = `https://www.music-flo.com`;
        let path = `/api/meta/v1/track/${music_loacation_select_value}/new`;
        let query = `?page=1&size=100`;
        let header = ``;
        let data = ``;
        let method = `GET`;

        const response = await transmitAndReceive(host, path, query, header, data, method)

        // console.log(`[FLO Music 최신 100곡 정보 응답] `, response)

        // 응답 데이터를 결과테이블에 입력
        let list_data = response.data.data.list;
        list_data.forEach((element, index) => {
            let music_index = index + 1;
            let music_name = element.name;
            let music_album_title = element.album.title;
            let music_album_release_date =  element.album.releaseYmd;
            let music_album_genre = element.album.genreStyle;
            let music_artist = element.representationArtist.name;
            
            // tr생성
            music_result_table_tr = document.createElement('tr');

            // 테이블 내용 배열 생성, td태그 생성
            let td_tag_values = [music_index, music_name, music_artist, music_album_release_date, music_album_genre, music_album_title];
            td_tag_values.forEach((td_tag_value) => {
                music_result_table_td = document.createElement('td');
                music_result_table_td_text = document.createTextNode(td_tag_value);
                music_result_table_td.appendChild(music_result_table_td_text);
                music_result_table_tr.appendChild(music_result_table_td);
            });

            // 테이블에 붙이기
            music_result_table.appendChild(music_result_table_tr);
        });
    } catch (error) {
        console.error(`[FLO Music 최신 100곡 정보 박스오피스정보 에러] ${error}`);
    }
}
