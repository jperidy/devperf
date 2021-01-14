import React from 'react';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const Tace = ({ tace }) => {

    return (

        <Col sm={12} md={6} lg={4} xl={3}>
            <Card className='my-3 p-3 rounded'>
                <Card.Header as="h5">{tace.month.firstDay.toString().substring(0, 7)}</Card.Header>
                <Card.Body>
                    <Card.Text as="div"><strong>{(Number(tace.totalTACE) * 100).toString().substring(0, 4)} %</strong> Tace</Card.Text>
                    <Card.Text as="div">{(Number(tace.totalLeaving) * 100).toString().substring(0, 4)} % Leaving</Card.Text>
                    <Card.Text as="div">{tace.totalETP && tace.totalETP.toString().substring(0, 4)} ETP</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Link to={`/pxxdetails/${tace.month._id}`}>View details</Link>
                </Card.Footer>
            </Card>
        </Col>

    )
}

export default Tace;
