const TEMPLATE_COIN = 'template_coin';
const coin_name = localStorage.getItem(TEMPLATE_COIN);
const search_url = 'https://api.coingecko.com/api/v3/search?query=';
const get_coin_url = 'https://api.coingecko.com/api/v3/coins/';

async function load_page() {

    await fetch(search_url+coin_name).then((response) => response.json()).then(async (object) => {
        let coin_id = object.coins[0].id;
        await fetch(get_coin_url+coin_id).then((response) => response.json()).then((data) =>{
            let ticker = data.symbol.toUpperCase();
            let description = data.description.en;
            let rank = data.market_cap_rank;                    ;
            let image = data.image.large;
            let coin = data.name;
            let mcap = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.market_cap.usd);
            let fdv = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.fully_diluted_valuation.usd);
            let price = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.current_price.usd);
            let volume = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(data.market_data.total_volume.usd);
            let circulating_supply = new Intl.NumberFormat("en-GB").format(data.market_data.circulating_supply);
            let total_supply = new Intl.NumberFormat("en-GB").format(data.market_data.total_supply);

            let change;
            try {
                change = data.market_data.price_change_percentage_24h.toFixed(2);
            }
            catch(e) {
                change = 0;
            }

            let description_parsed = description.split(/\r?\n|\r|\n/g);
            if(description_parsed.length > 1) {
                var new_description = description_parsed[0] + '\n\n' + description_parsed[2];
            }
            else {
                var new_description = description_parsed[0];
            }
            document.getElementById('mcap_value').innerText = mcap;
            document.getElementById('fdv_value').innerText = fdv;
            document.getElementById('volume_value').innerText = volume;
            document.getElementById('circulating_supply_value').innerText = circulating_supply;
            document.getElementById('total_supply_value').innerText = total_supply;
            
            document.getElementById('about_h3').innerText = "About " + coin;
            document.getElementById('description_span').innerText = new_description;

            document.getElementById('coin_image').src = image;
            document.getElementById('name_h1').innerText = coin;
            document.getElementById('coin_ticker').innerText = ticker;

            document.getElementById('rank_text').innerText = "#" + rank + " by Market Cap";
            document.getElementById('coin_name_price').innerText = ticker + " Price";
            document.getElementById('price_h2').innerText = price;

            $('#chart').html("");
            var symbol = ticker + "USDT";
            var sc = '<script>var chart2 = new TradingView.widget({"autosize": true,"symbol": "BINANCE:'+symbol+'","interval": "60","timezone": "Etc/UTC","theme": "White","style": "1","locale": "en","toolbar_bg": "rgba(255, 255, 255, 1)","enable_publishing": false,"hideideas": true, "container_id": "chart", "theme": "dark"});<\/script>';
            $("#chart").append(sc);
        })
    })
}

async function setup_wallet_button() {
    let button = document.querySelector('.button__connect__wallet');
  
    button.addEventListener('click', async () => {
      if(window !== undefined && window.ethereum !== undefined) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          button.innerText = "Connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(38);
        }
        catch (err) {
          console.error(err.message)
        }
      }
    });
  
    if(window !== undefined && window.ethereum !== undefined) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        button.innerText = "Connected: " + accounts[0].substring(0, 6) + "..." + accounts[0].substring(38);
      }
    }
  }

load_page();
setup_wallet_button();