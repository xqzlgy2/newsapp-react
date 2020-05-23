import React from "react";
import {Badge, Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {IoMdShare} from "react-icons/io";
import {MdDelete} from "react-icons/md"
import {color_table} from "./ContentCard";
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    TwitterIcon,
    TwitterShareButton
} from "react-share";
import GuardianDefault from "./guardian.png";
import NYTimesDefault from "./Nytimes.jpg";
import {Link} from "react-router-dom";

class FavoriteCard extends React.Component {
    constructor(props) {
        super(props);
        let color = color_table.HEALTH;
        if (color_table[props.news.section] !== undefined) {
            color = color_table[props.news.section];
        }
        this.state = {
            showModal: false,
            color: color
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    getImage(image) {
        if (image !== "")
            return this.props.news.id.indexOf("http") === -1 ? image : "https://static01.nyt.com/" + image;
        else
            return this.props.news.id.indexOf("http") === -1 ? GuardianDefault : NYTimesDefault;
    }

    handleShow(event) {
        event.preventDefault();
        this.setState({showModal: true});
    }

    handleClose() {
        this.setState({showModal: false});
    }

    handleDelete(event) {
        event.preventDefault();
        localStorage.removeItem(this.props.news.id);
        this.props.parent.setState({favorite_news: this.props.parent.getNewsFromStorage()});
    }

    getColor() {
        if (this.state.color === "#ceda49" || this.state.color === "#f5c150")
            return "black";
        else
            return "white";
    }

    render() {
        return (
            <Col lg={3} md={12}>
                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className="share-title m-auto">{this.props.news.title}</div>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div style={{textAlign: "center"}}>Share via</div>
                        <Container>
                            <Row noGutters={true}>
                                <Col style={{textAlign: "center"}}>
                                    <FacebookShareButton
                                        url={this.props.news.webUrl}
                                    >
                                        <FacebookIcon size={50} round />
                                    </FacebookShareButton>
                                </Col>
                                <Col style={{textAlign: "center"}}>
                                    <TwitterShareButton
                                        url={this.props.news.webUrl}
                                        title={"News Share"}
                                    >
                                        <TwitterIcon size={50} round />
                                    </TwitterShareButton>
                                </Col>
                                <Col style={{textAlign: "center"}}>
                                    <EmailShareButton
                                        url={this.props.news.webUrl}
                                        subject={"News Share"}
                                    >
                                        <EmailIcon size={50} round />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>

                <Link to={"/detail?article=" + this.props.news.id + "&section=" + this.props.news.section}
                      style={{textDecoration: "none", color: "black"}}>
                    <Card className="content-card">
                        <div className="p-3">
                            <div style={{display: "inline-block", width: "85%"}}>
                                <div className="favorite-card-title">
                                    {this.props.news.title}
                                </div>
                            </div>
                            <div style={{display: "inline-block", width: "15%"}}>
                                <IoMdShare size={15} onClick={this.handleShow}/>
                                {this.props.showSource && <MdDelete size={15} onClick={this.handleDelete} />}
                            </div>
                            <Image src={this.getImage(this.props.news.image)} fluid/>
                            <div className="content-footer">
                                <div style={{display: "inline-block"}}>{this.props.news.date}</div>
                                {
                                    this.props.showSource &&
                                    <div className="badge-container">
                                        <Badge style={{
                                            backgroundColor: this.props.news.source ? "#152949" : "#dddddd",
                                            color: this.props.news.source ? "white" : "black",
                                            fontSize: "xx-small"
                                        }}>
                                            {this.props.news.source ? "GUARDIAN" : "NYTIMES"}
                                        </Badge>
                                    </div>
                                }
                                <div className="badge-container">
                                    <Badge style={{
                                        backgroundColor: this.state.color,
                                        color: this.getColor(),
                                        fontSize: "xx-small"
                                    }}>
                                        {this.props.news.section}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <br/>
                </Link>
            </Col>
        );
    }
}

function CardContainer(props) {
    return (
        <Container>
            <Row><Col><div className="favorite-title">Favorites</div></Col></Row>
            <Row>
                {props.favorite_news.map((news, idx) => <FavoriteCard parent={props.parent}
                                                                      key={idx}
                                                                      news={news}
                                                                      showSource={true}/>)}
            </Row>
        </Container>
    );
}

class FavoritePage extends React.Component {

    getNewsFromStorage() {
        let favorite_news = []
        for (let i = 0; i < localStorage.length; i++) {
            let news_key = localStorage.key(i);
            let news_obj = JSON.parse(localStorage.getItem(news_key));
            news_obj.id = news_key;
            favorite_news.push(news_obj);
        }
        return favorite_news;
    }

    constructor(props) {
        super(props);
        this.state = {
            favorite_news: this.getNewsFromStorage()
        };
    }

    render() {
        return (
            <div style={{padding: '1rem'}}>
                {
                    localStorage.length === 0 &&
                    <div style={{textAlign: "center", fontWeight: "bolder"}}>
                        You have no saved articles
                    </div>
                }
                {localStorage.length !== 0 && <CardContainer parent={this} favorite_news={this.state.favorite_news} />}
            </div>
        );
    }
}

export {FavoritePage, FavoriteCard};
