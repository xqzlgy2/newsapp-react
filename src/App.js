import React from 'react';
import Header from './Header';
import Home from './Home';
import DetailPage from "./DetailPage";
import {FavoritePage} from "./FavoritePage";
import "./Style.css"
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SearchPage from "./SearchPage";

class Wrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: true
        };
    }

    getSwitchMessage = (checked) => {
        this.setState({
            source: checked
        });
    };

    render() {
        return (
            <div>
                <Header parent={this}
                        showSwitch={this.props.type === "trending"}
                        switchFilled={this.props.type === "favorite"}
                />
                {this.props.type === "trending" && <Home source={this.state.source} section={this.props.section}/>}
                {this.props.type === "detail" && <DetailPage source={this.state.source} props={this.props.props}/>}
                {this.props.type === "favorite" && <FavoritePage/>}
                {this.props.type === "search" && <SearchPage source={this.state.source} props={this.props.props}/>}
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            source: true
        };
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path={'/'} render={() => <Wrapper type="trending" section="home" />} exact/>
                        <Route path={'/home'} render={() => <Wrapper type="trending" section="home" />}/>
                        <Route path={'/world'} render={() => <Wrapper type="trending" section="world" />}/>
                        <Route path={'/politics'} render={() => <Wrapper type="trending" section="politics" />}/>
                        <Route path={'/business'} render={() => <Wrapper type="trending" section="business" />}/>
                        <Route path={'/technology'} render={() => <Wrapper type="trending" section="technology" />}/>
                        <Route path={'/sports'} render={() => <Wrapper type="trending" section="sports" />}/>
                        <Route path={'/detail'} render={(props) => <Wrapper type="detail" props={props} />} />
                        <Route path={'/favorite'} render={() => <Wrapper type="favorite" />} />
                        <Route path={'/search'} render={(props) => <Wrapper type="search" props={props} />} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
