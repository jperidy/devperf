import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { updateComment } from '../actions/consultantActions';
import Loader from './Loader';
import Message from './Message';
//import { getAllMyConsultants } from '../actions/consultantActions';

const ConsultantComment = ({ comment, consultantId, setCommentUpdated }) => {

    const dispatch = useDispatch();

    const [commentText, setCommentText] = useState(comment);

    const consultantUpdateComment = useSelector(state => state.consultantUpdateComment);
    const { loading, error } = consultantUpdateComment;

    useEffect(() => {
        setCommentText(comment);
    }, [comment]);

    const submitHandler = () => {
        dispatch(updateComment(consultantId, commentText));
    };

    return (
        <div>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='textarea'>
                        <Form.Label><b>Comments</b></Form.Label>
                        <Form.Control
                            as="textarea"
                            style={{'minHeight': '15vh'}}
                            placeholder="Please enter a comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Submit
                </Button>
                </Form>
            )
            }
        </div>


    )
}

export default ConsultantComment; 
