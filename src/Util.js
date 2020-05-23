// Bing suggestion API key
const suggestionKey = 'Bing Auto suggestion Key';

// base URL for request news info
const baseUrl = 'http://localhost:5000';

const axios = require('axios');

// Tool class for network request
const Util = {

    getSuggestion: function(input) {

        const suggestConfig = {
            params: {
                q: input,
                cc: 'en-US',
                setLang: 'en'
            },
            headers: {
                'Ocp-Apim-Subscription-Key': suggestionKey
            }
        };

        return new Promise((resolve, reject) => {
            axios.get('https://api.cognitive.microsoft.com/bing/v7.0/suggestions', suggestConfig)
                .then(response => {
                    const suggestions = response.data.suggestionGroups[0].searchSuggestions;
                    const labels = suggestions.map(x => x.displayText);
                    resolve(labels);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    getHome: function(source) {
        let router = source ? '/guardian/home' : '/nytimes/home';
        return new Promise((resolve, reject) => {
            axios.get(baseUrl + router)
                .then(response => {
                    resolve(response.data.news_arr);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    getSectionNews: function(sectionName, source) {
        let router = source ? '/guardian/section' : '/nytimes/section';
        if (source && sectionName === 'sports')
            sectionName = 'sport';

        return new Promise((resolve, reject) => {
            axios.get(baseUrl + router, {
                params: {
                    sectionName: sectionName
                },
            })
                .then(response => {
                    resolve(response.data.news_arr);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    getNewsDetail: function(article) {
        let router = article.indexOf("http") === -1 ? '/guardian/detail' : '/nytimes/detail';

        return new Promise((resolve, reject) => {
            axios.get(baseUrl + router, {
                params: {
                    article: article
                },
            })
                .then(response => {
                    resolve(response.data.news_detail);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    getSearchResult: function(keyword, source) {
        let router = source ? '/guardian/search' : '/nytimes/search';

        return new Promise((resolve, reject) => {
            axios.get(baseUrl + router, {
                params: {
                    keyword: keyword
                },
            })
                .then(response => {
                    resolve(response.data.search_arr);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

};

export default Util
