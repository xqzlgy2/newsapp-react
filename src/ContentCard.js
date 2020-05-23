import React from "react";
import {Card, Image, Container, Row, Col, Badge, Modal} from "react-bootstrap";
import {IoMdShare} from "react-icons/io"
import {FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, EmailShareButton, EmailIcon} from "react-share"
import {Link} from "react-router-dom";
import "./Style.css"

const color_table = {
    WORLD: "#7c56fb",
    POLITICS: "#459488",
    BUSINESS: "#4a98e9",
    TECHNOLOGY: "#ceda49",
    SPORTS: "#f5c150",
    SPORT: "#f5c150",
    HEALTH: "#6e757c",
};

class ContentCard extends React.Component {
    constructor(props) {
        super(props);

        let color = color_table.HEALTH;
        if (color_table[props.section] !== undefined) {
            color = color_table[props.section];
        }

        this.state = {
            color: color,
            showModal: false
        };

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow(event) {
        event.preventDefault();
        this.setState({showModal: true});
    }

    handleClose() {
        this.setState({showModal: false});
    }

    getColor() {
        if (this.state.color === "#ceda49" || this.state.color === "#f5c150")
            return "black";
        else
            return "white";
    }

    render() {
        return (
            <div style={{padding: '1rem'}}>

                <Modal show={this.state.showModal} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className="share-title m-auto">{this.props.title}</div>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div style={{textAlign: "center"}}>Share via</div>
                        <Container>
                            <Row noGutters={true}>
                                <Col style={{textAlign: "center"}}>
                                    <FacebookShareButton
                                        url={this.props.webUrl}
                                    >
                                        <FacebookIcon size={50} round />
                                    </FacebookShareButton>
                                </Col>
                                <Col style={{textAlign: "center"}}>
                                    <TwitterShareButton
                                        url={this.props.webUrl}
                                        title={"News Share"}
                                    >
                                        <TwitterIcon size={50} round />
                                    </TwitterShareButton>
                                </Col>
                                <Col style={{textAlign: "center"}}>
                                    <EmailShareButton
                                        url={this.props.webUrl}
                                        subject={"News Share"}
                                    >
                                        <EmailIcon size={50} round />
                                    </EmailShareButton>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                </Modal>

                <Link to={"/detail?article=" + this.props.detail + "&section=" + this.props.section}
                      style={{textDecoration: "none", color: "black"}}>
                    <Card className="m-auto p-3 content-card">
                        <Container style={{paddingLeft: 0, paddingRight: 0}}>
                            <Row>
                                <Col lg={3} md={12}>
                                    <Image src={this.props.image} thumbnail/>
                                </Col>
                                <Col lg={9} md={12}>
                                    <div className="content-title">
                                        {this.props.title}
                                        <IoMdShare size={20} onClick={this.handleShow}/>
                                    </div>
                                    <div className="content-text">
                                        {this.props.description}
                                    </div>
                                    <div className="content-footer">
                                        <div style={{display: "inline-block"}}>{this.props.date}</div>
                                        <div className="badge-container">
                                            <Badge style={{backgroundColor: this.state.color, color: this.getColor()}}>
                                                {this.props.section}
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Card>
                </Link>

            </div>
        );
    }
}

export {ContentCard, color_table};
