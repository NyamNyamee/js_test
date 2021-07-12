/* REST API 호출 - Axios */
document.addEventListener("DOMContentLoaded", function() {
    const KOFIC_KEY = 'ba4bcd991407f6c2f27ec9244f5f9df7';
    let targetDate = '20210705';

    async function getBoxOfficedInfo() {
        try{
            let host = 'http://www.kobis.or.kr';
            let path = '/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';
            let query = `?key=${KOFIC_KEY}&targetDt=${targetDate}`
            let header = ``;
            let data = ``;
            let method = 'GET';

            const response = transmitAndReceive(host, path, query, header, data, method)
            
            // console.log(response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }
});