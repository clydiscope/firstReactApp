import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Button, Breadcrumb, BreadcrumbItem, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import {LocalForm, Control, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import {baseUrl } from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';



const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({campsite}) {
    return( <div className="col-md-5 m-1">
        <FadeTransform
            in
            transformProps={{
                exitTransform: 'scale(0.5) translateY(-50%)'
            }}>
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
    
        </FadeTransform> 

    
    </div>
    );
}

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: '5',
            author: '',
            text: '',
            touched: {
                rating: false,
                author: false,
                text: false,
            },
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        console.log(values)
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text)
    }


    render() {
        return (
            <div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={this.handleSubmit} className="form-group">
                            <Control.select className="form-control" model=".rating" id="rating" name="rating" 
                            innerRef={input => this.rating = input}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Control.select>
                            <Control.text className="form-control" model=".author" id="author" name="author" 
                            innerRef={input => this.author = input}
                            validators={{
                                required,
                                minLength: minLength(2),
                                maxLength: maxLength(15)
                            }}></Control.text>
                            <Errors
                                className="text-danger"
                                model=".author"
                                show="touched"
                                component="div"
                                messages={{
                                    required: 'Required',
                                    minLength: 'Must be at least 2 characters',
                                    maxLength: 'Must be at 15 characters or less.'
                                }}
                            />
                            <Control.textarea className="form-control" rows="6" model=".text" id="text" name="text" innerRef={input => this.text = input}></Control.textarea>
                            <Button type="submit" value="submit" color="primary"> Submit </Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button outline onClick={this.toggleModal}><i className="fa fa-pencil fa-lg"/> Submit Comment</Button>
            </div>   
        )
    }
}

function RenderComments({comments, postComment, campsiteId}) {
    if(comments) {
        return(
            <div className="col-md-5 m-1">
                <h4> Comments </h4>
                <Stagger in>
                    {comments.map( (comment) => {
                        return(
                        <Fade in key={comment.id}>
                            <div key={comment.id}>
                                <p>{comment.text} <br />
                                -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))} 
                                </p>
                            </div> 
                        </Fade>
                        );
                    })
                    }
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment}/>

            </div>
        );
    } else {return( <div><CommentForm/></div> )}

}
    

function CampsiteInfo(props){
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }

    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        )
    }

    if(props.campsite){
        return(
        <div className="container">
            <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <h2>{props.campsite.name}</h2>
                    <hr />
                </div>
            </div>            
            <div className="row"> 
                <RenderCampsite campsite={props.campsite} /> 
                <RenderComments comments={props.comments} 
                                postComment={props.postComment}
                                campsiteId={props.campsite.id}/> 
            </div> 
        </div>    
        )} 
    else {
        return(<div className="row"> </div>)
    } 
}


export default CampsiteInfo;