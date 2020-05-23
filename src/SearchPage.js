import React from "react";
import queryString from "query-string";
import Util from "./Util";
import {Col, Container, Row} from "react-bootstrap";
import {FavoriteCard} from "./FavoritePage";
import BounceLoader from "react-spinners/BounceLoader";
import {css} from "@emotion/core";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class SearchPage extends React.Component{
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.props.location.search);
        this.state = {
            keyword: values.keyword,
            search_arr: [],
            loading: true
        };
    }

    componentDidMount() {
        Util.getSearchResult(this.state.keyword, this.props.source)
            .then(search_arr => {
                this.setState({search_arr: search_arr, loading: false});
            })
            .catch(error => {
                console.log(error);
                alert('Load detail failed.');
            })
    }

    render() {
        return (
            <div style={{padding: '1rem'}}>
                <div className="sweet-loading loader-container">
                    <BounceLoader
                        css={override}
                        size={40}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />
                    {this.state.loading && <div>Loading...</div>}
                </div>
                {
                    !this.state.loading &&
                    <Container>
                        <Row><Col><div className="favorite-title">Results</div></Col></Row>
                        <Row>
                            {this.state.search_arr.map((news, idx) => <FavoriteCard
                                key={idx}
                                news={news}
                                showSource={false}/>)}
                        </Row>
                    </Container>
                }
            </div>
        );
    }
}

export default SearchPage;
