import "./Style.css"
import React from "react";
import {BsBookmark, BsBookmarkFill} from "react-icons/bs"
import {Navbar, Nav} from "react-bootstrap";
import Select from "react-select";
import Switch from "react-switch";
import Util from "./Util";
import {Link, Redirect} from "react-router-dom";

// switch component for change news source
class Sourceswitch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {checked: true};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({checked});
        this.props.parent.getSwitchMessage(checked);
    }

    render() {
        return (
            <Switch className="mr-auto" onChange={this.handleChange} checked={this.state.checked}
                    onColor="#1b9bf6" checkedIcon={false} uncheckedIcon={false}/>
        );
    }
}

// search component with auto suggestion
class SearchSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [{value: "New York", label: "New York"}, {value: "Los Angeles", label: "Los Angeles"}],
            showRedirect: false,
            keyword: ""
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleInputChange(value) {
        Util.getSuggestion(value)
            .then(labels => {
                const options = labels.map(x => ({value: x, label: x}));
                this.setState({options: options});
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleSearch(option) {
        this.setState({showRedirect: true, keyword: option.value});
    }

    render() {
        return (
            <div>
                <Select placeholder="Enter keyword .."
                        onInputChange={this.handleInputChange}
                        onChange={this.handleSearch}
                        options={this.state.options}/>
                {this.state.showRedirect && <Redirect to={"/search?keyword=" + this.state.keyword} />}
            </div>
        );
    }
}

// Navbar at the top of the page
function Header(props) {
    return (
        <Navbar bg="gradient" variant="dark" expand="lg">
            <div className="select-container">
                <SearchSelect/>
            </div>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className="mr-auto" href="/home">Home</Nav.Link>
                    <Nav.Link className="mr-auto" href="/world">World</Nav.Link>
                    <Nav.Link className="mr-auto" href="/politics">Politics</Nav.Link>
                    <Nav.Link className="mr-auto" href="/business">Business</Nav.Link>
                    <Nav.Link className="mr-auto" href="/technology">Technology</Nav.Link>
                    <Nav.Link className="mr-auto" href="/sports">Sports</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    {!props.switchFilled &&
                        <Navbar.Text className="mr-auto">
                            <Link to="/favorite">
                                <BsBookmark color="white" size={23}/>
                            </Link>
                        </Navbar.Text>
                    }
                    {props.switchFilled &&
                        <Navbar.Text className="mr-auto">
                            <Link to="/favorite">
                                <BsBookmarkFill color="white" size={23}/>
                            </Link>
                        </Navbar.Text>
                    }
                    {props.showSwitch && <Navbar.Text className="mr-auto p-2 text-white">NYTimes</Navbar.Text>}
                    {props.showSwitch && <Navbar.Text><Sourceswitch parent={props.parent}/></Navbar.Text>}
                    {props.showSwitch && <Navbar.Text className="mr-auto p-2 text-white">Guardian</Navbar.Text>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header
