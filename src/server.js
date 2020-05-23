const express = require('express');
const app = express();
const port = 5000;

// read API keys from file
const fs = require("fs");
const API_keys = JSON.parse(fs.readFileSync('API-KEY.txt').toString());
const NYtimes_key = API_keys.NYtimes;
const Guardian_key = API_keys.Guardian;

// enable CORS
const cors = require('cors');
app.use(cors());

// routers
const axios = require('axios');

function getFormatDate(published_date) {
    return published_date.substr(0, published_date.indexOf("T"));
}

function getNYTimesImage(multimedia) {
    for (let media of multimedia) {
        if (parseInt(media.width) > 2000) {
            return media.url;
        }
    }
    return "";
}

function getGuardianImage(obj) {
    if (obj.blocks.main !== undefined) {
        let assets = obj.blocks.main.elements[0].assets;
        if (assets.length !== 0) {
            return assets[assets.length - 1].file;
        }
    }
    return "";
}

function handleGuardianResult(result) {
    let news_arr = [];
    for (let res_obj of result.data.response.results) {
        // number of news should not exceed limit
        if (news_arr.length >= 10) {
            break;
        }

        if (res_obj.webTitle === "" || res_obj.sectionId === "" ||
            res_obj.blocks.body[0].bodyTextSummary === "" || res_obj.webPublicationDate === "")
            continue;

        let news_obj = {
            webUrl: res_obj.webUrl, title: res_obj.webTitle,
            section: res_obj.sectionId.toUpperCase(),
            description: res_obj.blocks.body[0].bodyTextSummary,
            image: getGuardianImage(res_obj),
            date: getFormatDate(res_obj.webPublicationDate),
            detail: res_obj.id
        };

        news_arr.push(news_obj);
    }
    return news_arr;
}

function handleNYTimesResult(result) {
    let news_arr = [];
    for (let res_obj of result.data.results) {
        // number of news should not exceed limit
        if (news_arr.length >= 10) {
            break;
        }

        if (res_obj.title === "" || res_obj.section === "" ||
            res_obj.abstract === "" || res_obj.published_date === "")
            continue;

        let news_obj = {
            webUrl: res_obj.url,
            title: res_obj.title,
            section: res_obj.section.toUpperCase(),
            description: res_obj.abstract,
            image: getNYTimesImage(res_obj.multimedia),
            date: getFormatDate(res_obj.published_date),
            detail: res_obj.url
        };

        news_arr.push(news_obj);
    }
    return news_arr;
}

function handleGuardianDetail(result) {
    const content = result.data.response.content;

    return {
        title: content.webTitle,
        image: getGuardianImage(content),
        description: content.blocks.body[0].bodyTextSummary,
        date: getFormatDate(content.webPublicationDate),
        webUrl: content.webUrl
    };
}

function handleNYTimesDetail(result) {
    const docs = result.data.response.docs[0];

    return {
        title: docs.headline.main,
        image: getNYTimesImage(docs.multimedia),
        description: docs.abstract,
        date: getFormatDate(docs.pub_date),
        webUrl: docs.url
    };
}

function handleGuardianSearch(result) {
    let search_arr = [];
    for (let res_obj of result.data.response.results) {
        let news_obj = {
            title: res_obj.webTitle,
            image: getGuardianImage(res_obj),
            section: res_obj.sectionId.toUpperCase(),
            date: getFormatDate(res_obj.webPublicationDate),
            webUrl: res_obj.webUrl,
            id: res_obj.id
        }
        search_arr.push(news_obj);
    }
    return search_arr;
}

function handleNYTimesSearch(result) {
    let search_arr = [];
    for (let res_obj of result.data.response.docs) {
        let news_obj = {
            title: res_obj.headline.main,
            section: res_obj.news_desk.toUpperCase(),
            image: getNYTimesImage(res_obj.multimedia),
            date: getFormatDate(res_obj.pub_date),
            webUrl: res_obj.web_url,
            id: res_obj.web_url
        };
        search_arr.push(news_obj);
    }
    return search_arr;
}

app.get('/nytimes/home', (req, res) => {
    axios.get('https://api.nytimes.com/svc/topstories/v2/home.json', {
        params: {
            'api-key': NYtimes_key
        }
    })
        .then(result => {
            let news_arr = handleNYTimesResult(result);
            res.send({"news_arr": news_arr});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/nytimes/section', (req, res) => {
    let section = req.query.sectionName;
    axios.get('https://api.nytimes.com/svc/topstories/v2/' + section + '.json', {
        params: {
            'api-key': NYtimes_key
        }
    })
        .then(result => {
            let news_arr = handleNYTimesResult(result);
            res.send({"news_arr": news_arr});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/nytimes/detail', (req, res) => {
    let article = req.query.article;

    axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
            'fq': "web_url:(\""+ article + "\")",
            'api-key': NYtimes_key
        }
    })
        .then(result => {
            let news_detail = handleNYTimesDetail(result);
            news_detail.webUrl = article;
            res.send({"news_detail": news_detail});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/nytimes/search', (req, res) => {
    let keyword = req.query.keyword;

    axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
        params: {
            'q': keyword,
            'api-key': NYtimes_key
        }
    })
        .then(result => {
            let search_arr = handleNYTimesSearch(result);
            res.send({"search_arr": search_arr});
        })
        .catch(error => {
            res.send(error);
        })
})

app.get('/guardian/home', (req, res) => {
    axios.get('https://content.guardianapis.com/search', {
        params: {
            'api-key': Guardian_key,
            'section': '(sport|business|technology|politics)',
            'show-blocks': 'all'
        }
    })
        .then(result => {
            let news_arr = handleGuardianResult(result);
            res.send({"news_arr": news_arr});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/guardian/section', (req, res) => {
    let section = req.query.sectionName;

    axios.get('https://content.guardianapis.com/' + section, {
        params: {
            'api-key': Guardian_key,
            'show-blocks': 'all'
        }
    })
        .then(result => {
            let news_arr = handleGuardianResult(result);
            res.send({"news_arr": news_arr});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/guardian/detail', (req, res) => {
    let article = req.query.article;

    axios.get('https://content.guardianapis.com/' + article, {
        params: {
            'api-key': Guardian_key,
            'show-blocks': 'all'
        }
    })
        .then(result => {
            let news_detail = handleGuardianDetail(result);
            res.send({"news_detail": news_detail});
        })
        .catch(error => {
            res.send(error);
        })
});

app.get('/guardian/search', (req, res) => {
    let keyword = req.query.keyword;

    axios.get('https://content.guardianapis.com/search', {
        params: {
            'q': keyword,
            'api-key': Guardian_key,
            'show-blocks': 'all'
        }
    })
        .then(result => {
            let search_arr = handleGuardianSearch(result);
            res.send({"search_arr": search_arr});
        })
        .catch(error => {
            res.send(error);
        })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
