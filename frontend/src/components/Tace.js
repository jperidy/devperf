import React from 'react';
import { useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

const Tace = ({ tace }) => {

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    return (

        <Col sm={12} md={6} lg={4} xl={3}>
            <Card className='my-3 p-3 rounded'>
                <Card.Header as="h5">{tace.month.firstDay.toString().substring(0, 7)}</Card.Header>
                <Card.Body>
                    <Card.Text as="div"><strong>{(Number(tace.totalTACE) * 100).toFixed(2)} %</strong> Tace</Card.Text>
                    <Card.Text as="div">{(Number(tace.totalLeaving) * 100).toFixed(2)} % Leaving</Card.Text>
                    <Card.Text as="div">{tace.totalETP && tace.totalETP.toFixed(2)} ETP</Card.Text>
                </Card.Body>
                <Card.Footer>
                    {userInfo.profil.dashboards.tace.map(x => x.mode === 'write').length > 0 && (
                        <Link to={`/pxxdetails/${tace.month._id}`}>View details</Link>
                    )}
                </Card.Footer>
            </Card>
        </Col>

    )
}

export default Tace;
