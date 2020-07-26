/* eslint-disable no-unused-vars */
const fs = require('fs');
const puppeteer = require('puppeteer');
const urls = require('./pokemonsUrl.json');

async function run() {

    const browser = await puppeteer.launch({
        headless: true // set true if don't want to see the browser
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

        let data = await page.evaluate(() => {
            let thumbnail = document.querySelector('.single-post-thumb img').src; // big image
            let img = document.querySelector('#main-content .entry p img').src; // small image
            // let selector = document.querySelectorAll('#main-content .entry p img tbody');
            //  let name = selector[0].querySelectorAll("tr")[1].querySelectorAll("td")[0].innerHTML;


            return {
                "thumbnail": thumbnail,
                image: img,
                //"id": id,
                //"name": name
            };
        });



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
