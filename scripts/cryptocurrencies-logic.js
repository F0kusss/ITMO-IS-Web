var baseURL = "https://api.coingecko.com/api/v3";

const ITEMS_PER_PAGE = 100;
const PAGES_NUMBER = 5;

function load_table_page(page_number) {
  const table_element = document.getElementById('cryptocurrencies_table');
  table_element.innerHTML = "";
  var coinDataURL = "/coins/markets?vs_currency=usd&order=market_cap_desc%2C%20volume_desc%2C%20id_desc&per_page=" + ITEMS_PER_PAGE + "&page=" + page_number + "&sparkline=false&price_change_percentage=24h";
  fetch(baseURL + coinDataURL)
  .then(res =>{
    res.json().then(data =>{
      for(var i = 0; i < ITEMS_PER_PAGE; i++){
        let rank = ITEMS_PER_PAGE * (page_number - 1) + i + 1;
        let image = data[i].image;
        let coin = data[i].name;
        let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].market_cap);
        let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].current_price);
        let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data[i].total_volume);
        let supply = new Intl.NumberFormat("en-GB").format(data[i].circulating_supply.toFixed(0));
        let change;
        try {
          change = data[i].price_change_percentage_24h.toFixed(2);
        }
        catch(e) {
          change = 0;
        }

        let positive = "+";

        let tableRow = "<tr><td class='rank__column'>"+ rank + "</td>" + "<td><img class= 'image__column' src= " + image + "/>" + "<div class='coin__column'>" + 
        coin + "</div>" + "</td>" + "<td class='mcap__column'>" + mcap + "</td>" + "<td class = 'price__column'>"+ price + "</td>" + 
        "<td class='volume__column'>" + volume + "</td>"+ "<td class='supply__column'>" + supply + "</td>";
      
        if(change < 0){
          $("#cryptocurrencies_table").append(tableRow + "<td class='red__column'>"+ change + "%</td></tr>");
        }
        
        else {
          $("#cryptocurrencies_table").append(tableRow + "<td class='green__column'>"+ positive + change + "%</td></tr>");
        };
      }
    })
  })
  .catch(err =>{
    $("#cryptocurrencies_table").html(err);
  });
}

let current_page = 1;

function setup_pagination(wrapper) {
  wrapper.innerHTML = "";

  for(i = 1; i < PAGES_NUMBER + 1; i++) {
    let button = pagination_button(i);
    wrapper.appendChild(button);
  }
}

function pagination_button(page_number) {
  let button = document.createElement('button');
  button.innerText = page_number;

  if(current_page == page_number) button.classList.add('active');

  button.addEventListener('click', function () {
    current_page = page_number;
    load_table_page(current_page);

    let current_button = document.querySelector('.pagenumbers button.active');
    current_button.classList.remove('active');

    button.classList.add('active');
  })

  return button;
}

const pagination_element = document.getElementById('pagination');

load_table_page(current_page)
setup_pagination(pagination_element)
