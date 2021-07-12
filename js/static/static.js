/* 페이지 로드 시 */
document.addEventListener("DOMContentLoaded", function () {
  // 선택된 카테고리 속성 세팅. axios로 nav를 불러오기 전에 호출해버려서 실패
  let linked_index_list = document.querySelectorAll("a.linked_index");
  for (i = 0; i < linked_index_list.length; i++) {
    if (linked_index_list[i].innerText === document.title) {
      linked_index_list[i].classList.add('selected_page');
      break;
    }
  }
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
async function includeHTML(callback) {
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
  } catch (error) {
    console.error(error);
  }
}

/* [Axios] rest api 요청 */
async function transmitAndReceive(host, path, query, header, data, method) {
  try {
    const url = host + path + query;
    let response = "";

    if (method === "GET") {
      response = await axios.get(url);
    }
    else if (method === "POST") {
      response = await axios.post(url);
    } else {
      throw new Error(`${method} 방식으로 요청할 수 없습니다.`)
    }

    console.log(`[Axios 송수신 응답] ${response}`);

    // 요청 성공 여부에 따라 처리
    if (response.request.readyState == 4 && response.request.status == 200) {
      return response;
    } else {
      return `[Axios 송수신 실패] ${response.request.status}`;
    }
  } catch (error) {
    console.error(`[Axios 송수신 에러] ${error}`);
  }
}
