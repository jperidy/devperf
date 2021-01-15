import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Loader from '../components/Loader';
import { getAllPxx } from '../actions/pxxActions';
import ReactExport from "react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const PxxDetailsScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    const monthId = match.params.id ;

    const [pageSize, setPageSize] = useState(10000);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [exportExcel, setExportExcel] = useState('');

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxAllList = useSelector(state  => state.pxxAllList);
    const {loading, pxxs, pages, page, count} = pxxAllList;

    

    useEffect(() => {

        if (userInfo && (userInfo.adminLevel === 0)) {
            dispatch(getAllPxx(userInfo.consultantProfil.practice, monthId, keyword, pageSize, pageNumber));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, monthId, keyword, pageNumber, pageSize]);

    useEffect(() => {
        if (pxxs) {
            const exportExcelData = pxxs.map((pxx) => ({
                'CONSULTANT': pxx.name.name,
                'MATRICULE': pxx.name.matricule,
                'PRACTICE': pxx.name.practice,
                'VALUED': pxx.name.valued.substring(0,10),
                'ARRIVAL': pxx.name.arrival.substring(0,10),
                'LEAVING': pxx.name.leaving ? pxx.name.leaving.substring(0,10) : '',
                'MONTH': pxx.month.name,
                'PROD': pxx.prodDay,
                'NOT PROD': pxx.notProdDay,
                'HOLIDAYS': pxx.leavingDay,
                'AVAILABLE': pxx.availableDay
            }));
            setExportExcel(exportExcelData);
        }
    }, [pxxs, setExportExcel]);
    
    return (
        <>

            <Button className='mb-3' onClick={() => history.go(-1)}>
                Go Back
            </Button>

            <Row>
                <Col xs={6} md={2}>
                    <InputGroup>
                        <FormControl
                            type='text'
                            className="mb-3"
                            placeholder='Search name'
                            value={keyword && keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        ></FormControl>
                    </InputGroup>
                </Col>

                <Col xs={6} md={6}>
                    <Form.Control
                        plaintext
                        readOnly
                        value={count ? `${count} consultants found` : '0 consultant found'} />
                </Col>

                <Col md={2}>
                    {exportExcel && (
                        <ExcelFile element={<Button variant='primary'><i className="fas fa-download"></i>  Download</Button>}>
                            <ExcelSheet data={exportExcel} name="pxxsheet">
                                <ExcelColumn label="MATRICULE" value="MATRICULE" />
                                <ExcelColumn label="PRACTICE" value="PRACTICE" />
                                <ExcelColumn label="VALUED" value="VALUED" />
                                <ExcelColumn label="ARRIVAL" value="ARRIVAL" />
                                <ExcelColumn label="LEAVING" value="LEAVING" />
                                <ExcelColumn label="MONTH" value="MONTH" />
                                <ExcelColumn label="PROD" value="PROD" />
                                <ExcelColumn label="NOT PROD" value="NOT PROD" />
                                <ExcelColumn label="HOLIDAYS" value="HOLIDAYS" />
                                <ExcelColumn label="AVAILABLE" value="AVAILABLE" />
                            </ExcelSheet>
                        </ExcelFile>
                    )}
                </Col>

                <Col xs={6} md={2}>
                    <InputGroup>
                        <FormControl
                            as='select'
                            id='number-c'
                            className="mb-3"
                            value={pageSize && pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                        >
                            {['All', 5, 10, 15, 20, 50].map(x => (
                                <option
                                    key={x}
                                    value={(x === 'All' ? 10000 : x)}
                                >{(x === 'All' ? 'All (export)' : `${x} / page`)}</option>
                            ))}
                        </FormControl>
                    </InputGroup>
                </Col>

            </Row>

            {loading && <Loader />}

            <Table responsive hover striped>
                <thead>
                    <tr className='table-primary'>
                        <th className='align-middle text-light'>User name</th>
                        <th className='align-middle text-light'>Matricule</th>
                        <th className='align-middle text-light text-center'>Practice</th>
                        <th className='align-middle text-light text-center'>Month</th>
                        <th className='align-middle text-light text-center'>Arrival</th>
                        <th className='align-middle text-light text-center'>Leaving</th>
                        <th className='align-middle text-light text-center'>PROD</th>
                        <th className='align-middle text-light text-center'>NOT PROD</th>
                        <th className='align-middle text-light text-center'>HOLIDAYS</th>
                        <th className='align-middle text-light text-center'>AVAILABLE</th>
                    </tr>
                </thead>

                <tbody>
                    {pxxs && pxxs.map((pxx) => (
                        <tr key={pxx._id}>
                            <td className='align-middle'><b>{pxx.name.name && pxx.name.name}</b></td>
                            <td className='align-middle'><b>{pxx.name.matricule && pxx.name.matricule}</b></td>
                            <td className='align-middle'>{pxx.name.practice && pxx.name.practice}</td>
                            <td className='align-middle text-center'>{pxx.month.name && pxx.month.name}</td>
                            <td className='align-middle text-center'>{pxx.name.arrival && pxx.name.arrival.toString().substring(0,10)}</td>
                            <td className='align-middle text-center'>{pxx.name.leaving ? pxx.name.leaving.toString().substring(0,10) : '-'}</td>
                            <td className='align-middle text-center'>{pxx.prodDay && pxx.prodDay}</td>
                            <td className='align-middle text-center'>{pxx.notProdDay && pxx.notProdDay}</td>
                            <td className='align-middle text-center'>{pxx.leavingDay && pxx.leavingDay}</td>
                            <td className='align-middle text-center'>{pxx.availableDay && pxx.availableDay}</td>
                            
                        </tr>
                    ))} 
                </tbody>
            </Table>

            <Pagination>
                <Pagination.Prev
                    onClick={() => setPageNumber(page - 1)}
                    disabled={page === 1}
                />
                {[...Array(pages).keys()].map(x => (

                    <Pagination.Item
                        key={x + 1}
                        active={x + 1 === page}
                        onClick={() => {
                            dispatch(getAllPxx(userInfo.consultantProfil.practice, monthId, keyword, pageSize, x + 1));
                            setPageNumber(x + 1);
                        }}
                    >{x + 1}</Pagination.Item>

                ))}
                <Pagination.Next
                    onClick={() => setPageNumber(page + 1)}
                    disabled={page === pages}
                />
            </Pagination>
        </>
    )
}

export default PxxDetailsScreen;
