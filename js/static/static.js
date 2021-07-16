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
async function transmitAndReceive(host, path, query, headers, data, method) {
  try {
    const url = host + path + query;
    let response = ``;
    let error_message = ``;

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
        data,
        method,
        auth: {
          username: data.get('client_id'),
          password: data.get('client_secret')
        },
        headers
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