import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const PxxComment = ({comment}) => {

    const [commentText, setCommentText] = useState(comment);

    useEffect(() => {
        setCommentText(comment);
    }, [comment]);

    return (
        <>
            Comments:
            <InputGroup>
                <FormControl
                    as="textarea"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
            </InputGroup>
        </>
    )
}

export default PxxComment; 
