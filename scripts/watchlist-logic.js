const LOCAL_STORAGE_COINS = 'saved_crypto';
let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));
const search_url = 'https://api.coingecko.com/api/v3/search?query=';

const get_coin_url = 'https://api.coingecko.com/api/v3/coins/';

setTimeout(function() {
    load_watchlist_data();
  }, 500);

async function load_watchlist_data() {
    if(array_object == null || array_object.length == 0){
        let footer_block = document.querySelector('footer');
        let message_div = document.createElement('div');
        message_div.classList.add("watchlist__message");
        message_div.style.maxWidth = "300 px";
        let message = "There is nothing in your watchlist yet. Try to add some cryptocurrencies to the watchlist by clicking on a 'Star' button";
        message_div.innerHTML = "<h1 class='header__message'>" + message + "</h1>";
        footer_block.insertAdjacentElement('beforebegin', message_div);
    }
    else
    {
        let table_body = document.getElementById('watchlist_table');
        table_body.style.display = "block";

        array_object.forEach(async coin_name => {
            await fetch(search_url+coin_name).then((response) => response.json()).then(async (object) => {
                let coin_id = object.coins[0].id;
                // console.log(coin_id);
                await fetch(get_coin_url+coin_id).then((response) => response.json()).then((data) =>{
                    console.log(data);
                    let rank = data.market_cap_rank;                    ;
                    console.log(rank);
                    let image = data.image.small;
                    let coin = data.name;
                    let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.market_cap.usd);
                    let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.current_price.usd);
                    let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.total_volume.usd);
                    let supply = new Intl.NumberFormat("en-GB").format(data.market_data.circulating_supply);
                    let change;
                    try {
                    change = data.market_data.price_change_percentage_24h;
                    }
                    catch(e) {
                    change = 0;
                    }

                    let positive = "+";
                    
                    let tableRow = "<tr><td class='star__column'><button class='star__button'>" + 
                    "<img class='star__image__inactive' src='../images/empty-star.svg' alt='buttonpng' border='0' /></button></td><td class='rank__column'>" +
                    rank + "</td>" + "<td><img class= 'image__column' src= " + image + "/>" + "<div class='coin__column'>" + 
                    coin + "</div>" + "</td>" + "<td class='mcap__column'>" + mcap + "</td>" + "<td class = 'price__column'>"+ price + "</td>" + 
                    "<td class='volume__column'>" + volume + "</td>"+ "<td class='supply__column'>" + supply + "</td>";
                
                    if(change < 0){
                    $("#cryptocurrencies_table").append(tableRow + "<td class='red__column'>"+ change + "%</td></tr>");
                    }
                    
                    else {
                    $("#cryptocurrencies_table").append(tableRow + "<td class='green__column'>"+ positive + change + "%</td></tr>");
                    };
                })
            })
        });
    }
}


