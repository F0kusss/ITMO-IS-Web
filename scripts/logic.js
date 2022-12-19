var baseURL = "https://api.coingecko.com/api/v3";
var coinDataURL = "/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_desc%2C%20id_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
var url1 = baseURL + coinDataURL;

fetch(url1)
.then(res =>{
  res.json().then(data =>{
    for(var i = 0; i < 100; i++){
      let rank = data[i].market_cap_rank;
      let image = data[i].image;
      let coin = data[i].name;
      let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].market_cap);
      let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].current_price);
      let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].total_volume);
      let supply = new Intl.NumberFormat("en-GB").format(data[i].circulating_supply.toFixed(0));
      let change = data[i].price_change_percentage_24h.toFixed(2);
      let positive = "+";

      let tableRow = "<tr><td class='rank__column'>"+ rank + "</td>" + "<td><img class= 'image__column' src= " + image + "/>" + "<div class='coin__column'>" + 
      coin + "</div>" + "</td>" + "<td class='mcap__column'>" + mcap + "</td>" + "<td class = 'price__column'>"+ price + "</td>" + 
      "<td class='volume__column'>" + volume + "</td>"+ "<td class='supply__column'>" + supply + "</td>";
     
      if(change < 0){
        $("#tableBody1").append(tableRow + "<td class='red__column'>"+ change + "%</td></tr>");
      }
      
      else {
        $("#tableBody1").append(tableRow + "<td class='green__column'>"+ positive + change + "%</td></tr>");
      };
    }
  })
})

.catch(err =>{
  $("#tableBody1").html(err);
});
