
function BankApi(city, onSuccess, onError){
    var url = `https://vast-shore-74260.herokuapp.com/banks?city=${city}`
    console.log(url);
    var key = `api${city}`
    console.log(JSON.parse(localStorage.getItem(key)))
    let prevResponse = JSON.parse(localStorage.getItem(key));
    if(prevResponse && Number(prevResponse.timestamp) + 600000 >= Date.now()){
      if(prevResponse.result!=null){
        onSuccess(prevResponse.result)
      }else{
        onError(prevResponse.result)
      }
    }
    else{
      
      fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          let apiReponse = {result, timestamp: Date.now()}
          localStorage.setItem(key, JSON.stringify(apiReponse));
          onSuccess(result);
        },
        (error) => {
          onError(error)
        }
      )
    }
}
export default BankApi;
 