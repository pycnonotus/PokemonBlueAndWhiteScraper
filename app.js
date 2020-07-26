/* eslint-disable no-unused-vars */
const fs = require('fs');
const puppeteer = require('puppeteer');
const urls = require('./pokemonsUrl.json');

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
            let hebrewName = selector[0].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML;
            let type = selector[2].querySelectorAll("tr")[1].querySelectorAll("td")[1].innerHTML;
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
                id: i,
                "name": name,
                hebrewName: hebrewName,
                type: type,
                ev: ev,
                catchRate: catchRate,
                happiness: happiness,
                baseStats: baseStats
            };
        }, i);

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
