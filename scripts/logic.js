var baseURL = "https://api.coingecko.com/api/v3";
var coinDataURL = "/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_desc%2C%20id_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
var url1 = baseURL + coinDataURL;


// 1st page, List of crypto
fetch(url1)
.then(res =>{
  res.json().then(data =>{
    for(var i=0; i<100; i++){
      let rank = data[i].market_cap_rank;
      let pic = data[i].image;
      let coin = data[i].name;
      let mktcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].market_cap);
      let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].current_price);
      let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].total_volume);
      let supply = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].circulating_supply);
      let change = data[i].price_change_percentage_24h.toFixed(2);
      let positive = "+";

      if(change < 0){
        $("#tableBody1").append("<tr><td>"+ rank + "</td>"+ "<td><img class= 'image' src= "+ pic +"/>"+ coin + "</td>"+
           "<td>"+ mktcap + "</td>"+ "<td>"+ price + "</td>"+ "<td>"+ volume + "</td>"+
           "<td>"+ supply + "</td>"+ "<td class='red'>"+ change +  "%</td></tr>");
      }
      if(change > 0){
        $("#tableBody1").append("<tr><td>"+ rank + "</td>"+ "<td><img class= 'image' src= "+ pic +"/>"+ " "+ coin + "</td>"+
           "<td>"+ mktcap + "</td>"+ "<td>"+ price + "</td>"+ "<td>"+ volume + "</td>"+
           "<td>"+ supply + "</td>"+ "<td class='green'>"+ positive + change +  "%</td></tr>");
      };
    }
  })
})

.catch(err =>{
  $("#tableBody1").html(err);
});
