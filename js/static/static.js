/* 페이지 로드 시 */
document.addEventListener("DOMContentLoaded", function () {

});

/* 각 화면에서 공통으로 사용하는 html(header, nav, footer 등)을 include하기 위한 함수 */
// 방법1. XMLHttpRequest사용
// function includeHTML(callback) {
//     var tags, i, tag, file, xhr;
//     // 모든 태그 배열
//     tags = document.getElementsByTagName("*"); ; 
//     // 모든 태그 배열 루프
//     for (i = 0; i < tags.length; i++) {
//       tag = tags[i];
//       // include-html 속성이 달린 태그의 값 저장
//       file = tag.getAttribute("include-html"); 
//       // console.log(file);
//       // 값이 존재한다면
//       if (file) {
//         /* 리퀘스트객체 생성 */
//         xhr = new XMLHttpRequest();
//         xhr.onreadystatechange = function() {
//           // 정상적으로 요청에 성공했다면
//           if (this.readyState == 4) {
//             if (this.status == 200) {
//               // include-html 속성이 달린 태그에다가 응답내용을 붙임 
//               tag.innerHTML = this.responseText;
//             } 
//             if (this.status == 404) {
//               tag.innerHTML = "Page not found(404)";
//             }
//             // 태그에서 include-html 속성을 제거하고 재귀함수 호출
//             tag.removeAttribute("include-html");
//             includeHTML(callback);
//           }
//         };
//         xhr.open("GET", file, true);
//         xhr.send();
//         /*exit the function:*/
//         return;
//       }
//     }
//     setTimeout(function() {
//       callback;
//     }, 0);
// }

// 방법2. Axios사용(cdn 추가해야함)
async function includeHTML() {
  try {
    var tags, i, tag, file, xhr;
    // 모든 태그 배열
    tags = document.getElementsByTagName("*");;
    // 모든 태그 배열 루프
    for (i = 0; i < tags.length; i++) {
      tag = tags[i];
      // include-html 속성이 달린 태그의 값(staic 파일 경로) 저장
      file = tag.getAttribute("include-html");
      // console.log(file);
      // 값이 존재한다면
      if (file) {
        const host = ``;
        const path = file;
        const headers = ``;
        const data = ``;
        const query = ``;
        const url = host + path + query;

        // axios로 파일 비동기 요청
        const response = await axios.get(url);

        // 요청 성공 여부에 따라 처리
        if (response.request.readyState == 4 && response.request.status == 200) {
          tag.innerHTML = response.data;
        } else {
          tag.innerHTML = "Page not found (404)";
        }
      }
    }

    // 선택된 페이지의 nav 속성 세팅
    let list_index_link = document.querySelectorAll(".index_link");
    for (i = 0; i < list_index_link.length; i++) {
      if (list_index_link[i].innerText === document.title) {
        list_index_link[i].classList.add('selected_page');
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/* [Axios] rest api 요청 */
async function transmitAndReceive(host, path, query, headers, data, method, auth) {
  const url = host + path + query;
  let response = ``;
  let error_message = ``;
  
  try {
    if (method === "GET") {
      response = await axios({
        url,
        method,
        headers
      });
    }
    else if (method === "POST") {
      response = await axios({
        url,
        method,
        headers,
        data,
        auth
      });
    } else {
      throw new Error(`${method} 방식으로 요청할 수 없습니다.`)
    }

    console.log(`[Axios 송수신 응답]`, response);

    // 요청 성공 여부에 따라 처리
    if (response.request.readyState == 4 && response.request.status == 200) {
      return response;
    } else {
      return `[Axios 송수신 실패] ${response.request.status}`;
    }
  } catch (error) {
    error_message = `[Axios 송수신 에러] ${error}`;
    console.error(error_message);
    return error_message;
  }
}

/* (파라미터1) 하위에 있는 table태그를 (파라미터2)개 만큼만 남기고 모두 제거 */
function removeResultTables(category_result_div, amount_to_remain) {
  let category_result_tables = category_result_div.querySelectorAll('table');
  let category_result_tables_length = category_result_tables.length;

  if (category_result_tables_length > 0) {
    for (let i = amount_to_remain; i < category_result_tables_length; i++) {
      category_result_div.removeChild(category_result_tables[i]);
    }
  }
}

/* 전국 주소현황 */
const OBJECT_KOREA_ADDRESS = {
  '선택': ['선택'],
  '서울특별시': ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'],
  '부산광역시': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구광역시': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '인천광역시': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '광주광역시': ['동구', '서구', '남구', '북구', '광산구'],
  '대전광역시': ['동구', '중구', '서구', '유성구', '대덕구'],
  '울산광역시': ['중구', '남구', '동구', '북구', '울주군'],
  '세종특별자치시': ['전체'],
  '경기도': ['수원시', '고양시', '용인시', ' 성남시', '부천시', '화성시', '안산시', '남양주시', '안양시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광주시', '광명시', ' 군포시', '하남시', '오산시', '양주시', '이천시', '구리시', '안성시', '포천시', '의왕시', '양평군', '여주시', '동두천시', '가평군', '과천시', '연천군'],
  '강원도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
  '충청북도': ['청주시', '충주시', '제천군', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
  '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
  '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
  '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
  '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
  '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
  '제주특별자치도': ['제주시', '서귀포시']
}