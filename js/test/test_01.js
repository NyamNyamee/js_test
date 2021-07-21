/* 
    비동기, 화살표 함수 테스트 01  
    3초후에 1+2의 결과값을 출력하고, 아래 코드로 넘어가서 text를 출력하길 기대하지만, setTimeout함수는 비동기함수라서, 이 함수가 끝날때까지 아래 코드들이 기다릴 필요가 없다.
*/
// let function_01 = function (a, b) {
//     setTimeout(
//         () => {
//             console.log(a + b);
//         }, 3000);
// }
// function_01(1, 2);
// console.log('text');


/*
    이벤트 버블링, 이벤트 캡쳐, 위임, 전파방지
*/
// document.addEventListener("DOMContentLoaded", function() {
//     function logEvent(event) {
// 	    console.log(event.currentTarget.className);
//     }

//     // 이벤트 버블링
//     var divs = document.querySelectorAll('div');
//     divs.forEach(function(div) {
// 	    div.addEventListener('click', logEvent);
//     });

//     // 이벤트 캡쳐
//     var divs = document.querySelectorAll('div');
//     divs.forEach(function(div) {
// 	div.addEventListener('click', logEvent, {
// 		capture: true // default 값은 false입니다.
//     	});
//     });

//     // 이벤트 전파해제
//     var divs = document.querySelectorAll('div');
//     divs.forEach(function(div) {
// 	    div.addEventListener('click', function(event) {
//             console.log(event.currentTarget.className);
//             event.stopPropagation();
//         });
//     });

//     // 이벤트 위임
//     var itemList = document.querySelector('.itemList');
//     itemList.addEventListener('click', logEvent);
// });


/*
    변수 선언 방식 var(function scope), let(block scope), const(block scope)
    var는 함수 블록 내에서 선언한 변수를 블록 밖에서도 사용할 수 있지만, 함수 외부에서는 사용 불가
    let,const는 함수 블록 내에서 선언한 변수를 블록 밖에서 사용 불가
*/
// var a = 100;
// function print() {
//     var a = 10;
//     console.log(a);
// }
// print(); // 10

// var a = 10;
// for (var a = 0; a < 5; a++) {
//     console.log(a); // 0 1 2 3 4
// }
// console.log(`최종 a: ${a}`); // 5

// var a = 10;
// for (let a = 0; a < 5; a++) {
//     console.log(a); // 0 1 2 3 4
// }
// console.log(`최종 a: ${a}`); // 10

// var foo = 123; // 전역 변수
// console.log(foo); // 123
// {
//   var foo = 456; // 전역 변수
// }
// console.log(foo); // 456

// let foo = 123; // 전역 변수
// {
//   let foo = 456; // 지역 변수
//   let bar = 456; // 지역 변수
// }
// console.log(foo); // 123
// console.log(bar); // ReferenceError: bar is not defined


/*
    호이스팅 예제) 아래 3줄 실행 시, 실제로 그 아래 4줄처럼 실행된다. var는 호이스팅되지만 let은 안됨
 */
// console.log("Hello, World");
// var varVariable = "one";
// let letVariable = "two";

// var varVariable;
// console.log("Hello, World");
// varVariable = "one";
// let letVariable = "two";


/*
    setTimeout, setInterval 테스트
 */
// function func1() {
//     for (let i = 0; i < 3; i++) {
//         setTimeout(() => {
//             console.log(i);
//         }, 2000);
//     }
// }
// // func1();

// function func2() {
//     var i = 0;
//     var stop = setInterval(() => {
//         console.log(i);
//         i++;
//     }, 2000);
// }

// func2();


/*
    switch case 테스트
 */
// let i = 1;

// switch (i) {
//     case 1:
//         console.log('1: ', i);
//         break;
//     case 2:
//         console.log('2: ', i);
//     case 3:
//         console.log('3: ', i);
//     default:
//         console.log('없음');
// }


/*
    ES6 `백틱` 테스트
 */
// let str = '01';
// let str2 = '02';
// let num = `${str + str2}`;
// console.log(num);


/*
    가변인자 테스트
 */
// function sum() {
//     let res = 0;
//     console.log(arguments);
//     console.log(typeof(arguments));
//     for (let i = 0; i < arguments.length; i++) {
//         res += arguments[i];
//     }
//     return res;
// }
// console.log(sum(2, 3, 4, 5));

// let obj_01 = { '0': 2, '1': 3, '2': 4, '3': 5 };
// for(obj in obj_01){
//     console.log(obj);
//     console.log(obj_01[obj]);
//     console.log('---')
// }

/*
    정규표현식 테스트
*/
// let reg_ex = /\S#\d/; // 공백이 아님, #포함, 숫자
// let test_text = '루피#3363';
// let test_result = reg_ex.test(test_text);
// let match_result = test_text.split(reg_ex);
// console.log(test_result, match_result);

/*
    Promise 테스트
 */
let var01 = 0;
let var02 = 0;
let var03 = 0;
function getData() {
    return new Promise((resolve, rejcet) => { // 상태: Pending
        setTimeout(() => {
            var01 = 3; // 비동기 처리 로직이라고 가정
            if (var01 === 3) {
                resolve(var01); // 성공 값 리턴 // 상태: Fulfilled
            } else {
                rejcet(`실패1 ${new Error('첫번째  비동기error')}`); // 에러 값 리턴. catch에서 잡음 // 상태: Rejected
            }
        }, 3000);
        // var01 += var02; // 에러 시 catch에서 잡음
    });
}

function getData2(response) {
    console.log(`첫번째 응답 ${response}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var02 = response + 4; // 비동기 처리 로직이라고 가정
            if (var02 === 6) {
                resolve(var02); // 성공 값 리턴 // 상태: Fulfilled
            } else {
                reject(`실패2 ${new Error('두번째 비동기 error')}`); // 에러 값 리턴. catch에서 잡음 // 상태: Rejected
            }
        }, 3000);
    });
}

function getData3(response) {
    console.log(`두번째 응답 ${response}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var03 = response + 3; // 비동기 처리 로직이라고 가정
            if (var03 === 9) {
                resolve(var02); // 성공 값 리턴 // 상태: Fulfilled
            } else {
                reject(`실패3 ${new Error('세번째 비동기 error')}`); // 에러 값 리턴. catch에서 잡음 // 상태: Rejected
            }
        }, 3000);
    });
}

function catchRejected(error) {
    console.log(`[에러] ${error}`);
}

getData().then(getData2).catch(catchRejected).then(getData3); // getData, getData2에 대해 검사해서 중간에 예외 발생 시점에 종료하고 getData3실행
getData().then(getData2).then(getData3).catch(catchRejected); // getData, getData2, getData3에 대해 검사해서 중간에 예외 발생 시점에 종료