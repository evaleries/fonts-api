const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');

const base_url = 'https://www.1001freefonts.com';


// if (! fs.existsSync('response.html')) {
//     axios(base_url)
//         .then(response => {
//             fs.writeFileSync('response.html', response.data);
//         });
// }

// const $ = cheerio.load(fs.readFileSync('response.html'));
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// let recursiveRL = function () {
//     rl.question('Query: ', answer => {
//         if (answer == 'close') return rl.close();
//         console.log(eval(answer));
//         recursiveRL();
//     });
// }

// rl.on('close', () => process.exit());

// recursiveRL();

axios(base_url)
    .then(response => {
        const fonts = {
            fonts: [],
            length: 0
        };
        const $ = cheerio.load(response.data);
        const fontsList = $('ul.fontListingList').children();

        if (fontsList.length < 1) return console.log('no fonts were found');

        fontsList.each(function (i, v) {
            let fontNode = $(v).find('.fontDownloadButton');

            if (typeof fontNode == 'undefined') return console.log('undefined download button');
            
            let name = $(v).find('.fontPreviewTitle.responsiveMobileCenter').text();
            if (typeof name != 'undefined')
                name = name.replace('-', '').trim();

            let preview_image = $(v).find('.fontPreviewImageWrapperWrapper > div');
            if (preview_image.length > 0 && typeof preview_image.css('background') != 'undefined')
                preview_image = preview_image.css('background').match(/\((.*?)\)/)[1]

            let download_path = $(v).find('.fontDownloadButton').attr('onclick');
            if (typeof download_path != 'undefined')
                download_url = base_url + download_path.split("'")[1];

            if (download_url.length < 1 || name.trim().length < 1) return;

            fonts['fonts'].push({
                name,
                preview_image,
                download_url
            })
            fonts['length'] = i++;
        });

        console.log(fonts);
    }).catch(console.error);