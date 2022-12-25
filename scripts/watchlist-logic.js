const LOCAL_STORAGE_COINS = 'saved_crypto';
let array_object = JSON.parse(localStorage.getItem(LOCAL_STORAGE_COINS));

async function load_search_data(coin_name) {
    const search_url = 'https://api.coingecko.com/api/v3/search?query='+coin_name;
    return await (await fetch(search_url).then((response) => response.json()));
}


if(array_object == null || array_object.length == 0){
    let header_block = document.querySelector('header');
    let message = "There is nothing in your watchlist yet. Try to add some cryptocurrencies to the watchlist by clicking on a 'Star' button";
    header_block.insertAdjacentHTML('afterend', "<h1 class='header__message'>" + message + "</h1>");
}
else
{
    array_object.forEach(coin_name => {
        let coin_data = load_search_data(coin_name);
        let coin_id = coin_data;
        console.log(coin_id);
    });
}


