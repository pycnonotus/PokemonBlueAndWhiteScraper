/* eslint-disable no-unused-vars */
const fs = require('fs');
const puppeteer = require('puppeteer');
const urls = require('./pokemonsUrl.json');

function htmlToType(elment) {
    console.log("raw: " + elment);
    let types = elment.split('&nbsp;');
    let ret = [];
    for (let t of types) {
        let f = htmlToTypeHelper(t);
        console.log('f: ' + f);
        if (f !== '') {
            ret.push(f);

        }
    }




    return ret;

}

function htmlToTypeHelper(elment) {
    elment = elment.replace('<', '');
    elment = elment.replace('img', '');
    elment = elment.replace('src', '');
    elment = elment.replace('>', '');
    elment = elment.replace('"', '');
    elment = elment.replace('"', '');
    elment = elment.replace(' ', '');
    elment = elment.replace(' ', '');
    elment = elment.replace('=', '');
    console.log('sub: ' + elment);
    switch (elment) {
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%90%D7%A9.png':
            return 'fire';
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%A2%D7%9C-%D7%97%D7%95%D7%A9%D7%99.png':
            return 'psychic';
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%9E%D7%A2%D7%95%D7%A4%D7%A3.png':
            return 'flying';
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%97%D7%A9%D7%9E%D7%9C.png':
            return 'electric';
        case 'img src="https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%9E%D7%99%D7%9D.png':
            return 'water';
        case 'img src="https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%A7%D7%A8%D7%97.png':
            return 'ice';
        case 'http://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%9E%D7%AA%D7%9B%D7%AA.png':
            return 'steel';
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%A2%D7%A9%D7%91.png':
            return 'grass';
        case 'https://www.pocketmonsters.co.il/wp-content/uploads/2020/01/%D7%A4%D7%99%D7%94.png':
            return 'fairy';
        default:
            return elment;
    }
}



async function run() {

    const browser = await puppeteer.launch({
        headless: false // set true if don't want to see the browser
    });

    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 800
    });

    const links = urls["urls "].map(e => e); // idk why but somehow nodejs cry's over passing is directly from the json NODE PLZ FIX
    let pokemons = {
        "info": []
    };


    let i = 0;


    for await (const url of links) {

        await page.goto('https://' + url, {
            waitUntil: 'load'
        });

        let data = await page.evaluate((i) => {
            let thumbnail = document.querySelector('.single-post-thumb img').src; // big image
            let img = document.querySelector('#main-content .entry p img').src; // small image
            let selector = document.querySelectorAll('#main-content .entry  tbody');
            let name = selector[0].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML;
            let hebrewName = selector[0].querySelectorAll("tr")[1].querySelectorAll("td")[0].innerHTML;
            hebrewName = hebrewName.split("").reverse().join(""); // hebrewName is reversed 
            let type = selector[1].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML;
            let ev = selector[3].querySelectorAll("tr")[1].querySelectorAll("td")[0].innerHTML;
            let catchRate = selector[3].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML;
            let happiness = selector[3].querySelectorAll("tr")[1].querySelectorAll("td")[2].innerHTML;
            let baseStats = {
                hp: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[0].innerHTML,
                atk: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML,
                def: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[2].innerHTML,
                s_atk: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[3].innerHTML,
                s_def: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[4].innerHTML,
                spd: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[5].innerHTML,
                total: selector[5].querySelectorAll("tr")[1].querySelectorAll("td")[6].innerHTML,
            };
            return {
                "thumbnail": thumbnail,
                image: img,
                id: i + 1,
                "name": name,
                hebrewName: hebrewName,
                type: type,
                ev: ev,
                catchRate: catchRate,
                happiness: happiness,
                baseStats: baseStats
            };
        }, i);
        data.type = htmlToType(data.type);
        i++;
        console.log(data);
        pokemons.info.push(data);
    }
    console.log("done ");
    let pokemonJson = JSON.stringify(pokemons);
    fs.writeFile("output.json", pokemonJson, 'utf8', function (err) {
        if (err) {
            console.log("An error occurred while writing JSON Object to File.");
            return console.log(err);
        }

        console.log("JSON file has been saved.");
    });
}





run();
