import {css} from "@emotion/core";
import React from "react";
import Util from "./Util";
import BounceLoader from "react-spinners/BounceLoader";
import {ContentCard} from "./ContentCard";
import GuardianDefault from "./guardian.png";
import NYTimesDefault from "./Nytimes.jpg";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news_arr: [],
            loading: true
        };
    }

    getNews(sectionName, source) {
        let resultPromise = null;

        if (sectionName === 'home')
            resultPromise = Util.getHome(source);
        else
            resultPromise = Util.getSectionNews(sectionName, source);

        resultPromise
            .then(news_arr => {
                this.setState({news_arr: news_arr, loading: false});
            })
            .catch(error => {
                console.log(error);
                alert('Load content failed.');
            })
    }

    componentDidMount() {
        this.getNews(this.props.section, this.props.source);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({loading: true});
        this.getNews(this.props.section, nextProps.source);
    }

    render() {
        return (
            <div>
                <div className="sweet-loading loader-container">
                    <BounceLoader
                        css={override}
                        size={40}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />
                    {this.state.loading && <div>Loading...</div>}
                </div>

                {!this.state.loading && this.state.news_arr.map((news, idx) =>
                    <ContentCard key={idx}
                                 detail={news.detail}
                                 webUrl={news.webUrl}
                                 title={news.title}
                                 section={news.section}
                                 description={news.description}
                                 image={news.image === "" ?
                                     this.props.source ? GuardianDefault: NYTimesDefault
                                     : news.image}
                                 date={news.date}/>
                )}
            </div>
        );
    }
}

export default Home;
