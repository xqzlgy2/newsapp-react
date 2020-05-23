import React from "react";
import queryString from "query-string";
import Util from "./Util";
import BounceLoader from "react-spinners/BounceLoader";
import "./Style.css"
import {css} from "@emotion/core";
import {Card, Image} from "react-bootstrap";
import {BsBookmark, BsBookmarkFill} from "react-icons/bs"
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import ReactTooltip from "react-tooltip";
import NYTimesDefault from "./Nytimes.jpg"
import GuardianDefault from "./guardian.png"
import commentBox from 'commentbox.io';
import {ToastContainer, toast, Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class DetailCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDesc: false,
            descStyle: {
                display: "none"
            },
            isSaved: localStorage.getItem(this.props.id) !== null
        };
        this.descRef = React.createRef();

        this.showMore = this.showMore.bind(this);
        this.showLess = this.showLess.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUnsave = this.handleUnsave.bind(this);
    }

    getImage(image) {
        if (image !== "")
            return this.props.id.indexOf("http") === -1 ? image : "https://static01.nyt.com/" + image;
        else
            return this.props.id.indexOf("http") === -1 ? GuardianDefault : NYTimesDefault;
    }

    getSplitPoint(description) {
        let start = 0;
        for (let i = 0; i < 4; i++) {
            start = description.indexOf(".", start);
            if (start === -1)
                return start;
            start += 1;
        }
        return start;
    }

    getShortDescription(description) {
        // get first four sentences in description
        let pos = this.getSplitPoint(description);
        return pos === -1 ? description : description.substr(0, pos);
    }

    getRemainDescription(description) {
        // get rest sentences in description
        let pos = this.getSplitPoint(description);
        return pos === -1 ? "" : description.substr(pos, description.length);
    }

    showMore() {
        this.setState({showDesc: true, descStyle: {display: "inline"}});
    }

    showLess() {
        this.setState({showDesc: false, descStyle: {display: "none"}});
    }

    toastConfig() {
        return {
            transition: Zoom,
            className: "btn-light"
        }
    }

    handleSave() {
        toast('Saving ' + this.props.detail.title, this.toastConfig());
        let news_obj = {
            "title": this.props.detail.title,
            "image": this.props.detail.image,
            "date": this.props.detail.date,
            "section": this.props.section,
            "source": this.props.source,
            "webUrl": this.props.detail.webUrl,
        };
        localStorage.setItem(this.props.id, JSON.stringify(news_obj))
        this.setState({isSaved: true});
    }

    handleUnsave() {
        toast('Removing ' + this.props.detail.title, this.toastConfig());
        localStorage.removeItem(this.props.id);
        this.setState({isSaved: false});
    }

    componentDidMount() {
        this.removeCommentBox = commentBox("5658774752722944-proj");
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.showDesc && this.state.showDesc)
            this.descRef.current.scrollIntoView({behavior: "smooth"});
    }

    render() {
        return (
            <div style={{padding: '1rem'}}>
                <Card className="m-auto p-3 content-card">
                    <div className="detail-title">
                        {this.props.detail.title}
                    </div>
                    <div className="m-1">
                        <div className="detail-date">{this.props.detail.date}</div>
                        <div className="detail-tools">
                            <FacebookShareButton
                                data-tip="Facebook"
                                url={this.props.detail.webUrl}
                            >
                                <FacebookIcon size={23} round />
                            </FacebookShareButton>
                            <TwitterShareButton
                                data-tip="Twitter"
                                url={this.props.detail.webUrl}
                                title={"News Share"}
                            >
                                <TwitterIcon size={23} round />
                            </TwitterShareButton>
                            <EmailShareButton
                                data-tip="Email"
                                url={this.props.detail.webUrl}
                                subject={"News Share"}
                            >
                                <EmailIcon size={23} round />
                            </EmailShareButton>
                            <div style={{float: "right", marginRight: "0.5rem"}}>
                                {!this.state.isSaved &&  <BsBookmark data-tip="Bookmark"
                                                                     color="red"
                                                                     size={23}
                                                                     onClick={this.handleSave} />}
                                {this.state.isSaved &&  <BsBookmarkFill data-tip="Bookmark"
                                                                        color="red"
                                                                        size={23}
                                                                        onClick={this.handleUnsave}/>}
                            </div>
                            <ReactTooltip place="top" type="dark" effect="solid"/>
                        </div>
                        <Image className="m-1" src={this.getImage(this.props.detail.image)} fluid/>
                        <div ref={this.descRef}>{this.getShortDescription(this.props.detail.description)}</div>
                        {!this.state.showDesc && <MdKeyboardArrowDown
                            size={32}
                            style={{float: "right"}}
                            onClick={this.showMore} />}
                        <div style={this.state.descStyle}>
                            <br/>
                            <div>{this.getRemainDescription(this.props.detail.description)}</div>
                        </div>
                        {this.state.showDesc && <MdKeyboardArrowUp
                            size={32}
                            style={{float: "right"}}
                            onClick={this.showLess} />}
                    </div>
                </Card>
                <div className="commentbox m-2" id={this.props.id}/>
            </div>
        );
    }
}

class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        const values = queryString.parse(this.props.props.location.search);
        this.state = {
            article: values.article,
            section: values.section,
            news_detail: {},
            loading: true
        };
    }

    componentDidMount() {
        Util.getNewsDetail(this.state.article)
            .then(news_detail => {
                this.setState({news_detail: news_detail, loading: false});
            })
            .catch(error => {
                console.log(error);
                alert('Load detail failed.');
            })
    }

    render() {
        return (
            <div>
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <div className="sweet-loading loader-container">
                    <BounceLoader
                        css={override}
                        size={40}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />
                    {this.state.loading && <div>Loading...</div>}
                </div>
                {!this.state.loading && <DetailCard detail={this.state.news_detail}
                                                    source={this.props.source}
                                                    id={this.state.article}
                                                    section={this.state.section}/>}
            </div>
        );
    }
}

export default DetailPage;
