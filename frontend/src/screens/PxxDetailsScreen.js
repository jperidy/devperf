import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import FormControl from 'react-bootstrap/FormControl';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Message from '../components/Message';
import DisplayChildren from '../components/DisplayChildren';
import ImportExcelFile from '../components/ImportExcelFile';
import { getAllPxx, pxxUpdateALine } from '../actions/pxxActions';
import ReactExport from "react-export-excel";
import FlowImportPxx from '../components/FlowImportPxx';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const PxxDetailsScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    const monthId = match.params.id ;

    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [exportExcel, setExportExcel] = useState('');

    const [importData, setImportData] = useState([]);

    const [progress, setProgress] = useState(0);
    const [massImport, setMassImport] = useState(false);
    const [errorImportMessage, setErrorImportMessage] = useState([]);
    const [messsagesImportSuccess, setMessagesImportSuccess] = useState(0);
    const [messsagesImportError, setMessagesImportError] = useState(0);
    const [totalToImport, setTotalToImport] = useState(0);

    const [showImportPxx, setShowImportPxx] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const pxxAllList = useSelector(state  => state.pxxAllList);
    const {loading, pxxs, pages, page, count} = pxxAllList;

    const pxxImportLine = useSelector(state  => state.pxxImportLine);
    const {loading: loadingImportLine, error: errorImportLine, success: successImportLine, updatedLine} = pxxImportLine;

    useEffect(() => {

        if (userInfo) {
            if (!massImport) {
                dispatch(getAllPxx(userInfo.consultantProfil.practice, monthId, keyword, pageSize, pageNumber));
            }
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, monthId, keyword, pageNumber, pageSize, massImport]);

    useEffect(() => {
        if (pxxs) {
            const exportExcelData = pxxs.map((pxx) => ({
                'CONSULTANT': pxx.name.name,
                'MATRICULE': pxx.name.matricule,
                'PRACTICE': pxx.name.practice,
                'CDM_MATRICULE': pxx.name.cdmId && pxx.name.cdmId.matricule,
                'CDM_NAME': pxx.name.cdmId && pxx.name.cdmId.name,
                'VALUED': pxx.name.valued ? pxx.name.valued.substring(0,10) : '',
                'ARRIVAL': pxx.name.arrival ? pxx.name.arrival.substring(0,10) : '',
                'LEAVING': pxx.name.leaving ? pxx.name.leaving.substring(0,10) : '',
                'MONTH': pxx.month.name,
                'PROD': pxx.prodDay,
                'NOT_PROD': pxx.notProdDay,
                'HOLIDAYS': pxx.leavingDay,
                'AVAILABLE': pxx.availableDay
            }));
            setExportExcel(exportExcelData);
        }
    }, [pxxs, setExportExcel]);


    const handlerImportAllPxx = () => {
        setProgress(0);
        setMassImport(true);
    };
    
    const handlerImportData = (lineToImport) => {
        const newImportData = importData.slice();
        for (let incr = 0 ; incr < newImportData.length; incr++){
            if(newImportData[incr].MATRICULE === lineToImport.MATRICULE){
                newImportData[incr].status = 'loading'
            }
        }
        setImportData(newImportData);
        dispatch(pxxUpdateALine(lineToImport));
    }

    useEffect(() => {
        if(massImport) {
            if(importData.length > 0 && importData[progress].status !== 'imported') {
                //sleep(1000);
                handlerImportData(importData[progress]);
            } else {
                if(progress < importData.length - 1){
                    setProgress(progress+1);
                }
            }
        }
    // eslint-disable-next-line
    },[massImport, progress]);

    useEffect(() => {
        if(successImportLine) {
            const newImportData = importData.slice();
            for (let incr = 0; incr < newImportData.length; incr++) {
                if (newImportData[incr].MATRICULE === updatedLine.updatedMatricule) {
                    newImportData[incr].status = 'imported'
                }
            }
            setImportData(newImportData);

            if (massImport){
                if (progress < importData.length - 1){
                    setProgress(progress+1);
                } else {
                    setMassImport(false);
                }
            }
        }
    // eslint-disable-next-line
    }, [successImportLine]);

    useEffect(() => {
        if(errorImportLine) {
            const newImportData = importData.slice();
            for (let incr = 0; incr < newImportData.length; incr++) {
                if (newImportData[incr].MATRICULE === errorImportLine.message.matricule) {
                    newImportData[incr].status = 'error';
                }
            }
            setImportData(newImportData);
            const newErrorMessage = errorImportMessage.slice();
            newErrorMessage.push({message: errorImportLine.message.display});
            //console.log(errorImportLine.message.display);
            setErrorImportMessage(newErrorMessage);

            if (massImport){
                if (progress < importData.length - 1){
                    setProgress(progress+1);
                } else {
                    setMassImport(false);
                    setProgress(0);
                }
            }
        }
    // eslint-disable-next-line
    }, [errorImportLine]);

    useEffect(() => {
        setMessagesImportSuccess(importData.filter(x => x.status === 'imported').length);
        setMessagesImportError(importData.filter(x => x.status === 'error').length);
        setTotalToImport(importData.length);
    },[importData, errorImportLine, successImportLine]);
    
    return (
        <div>
            <Meta />

            <FlowImportPxx 
                show={showImportPxx}
                onHide={() => setShowImportPxx(false)}
            />

            <Row>
                <Col className='text-left'>
                    <Button className='mb-3' onClick={() => history.go(-1)}>Go Back</Button>
                </Col>
                <Col className='text-right'>
                    <DisplayChildren access='updatePxxFromPxx'>
                        <Button variant='primary' onClick={() => setShowImportPxx(true)}>Update from Pxx folder</Button>
                    </DisplayChildren>
                </Col>

            </Row>




            <Row className='align-items-center pt-3'>
                <Col md={5}>
                    {`${messsagesImportSuccess} Pxx line imported / ${totalToImport} - ${messsagesImportError} lines with error`}
                </Col>

                <Col ws={6} md={2} className='text-right'>
                    {exportExcel && (
                        <ExcelFile element={<Button variant='primary'><i className="fas fa-download"></i>  Download</Button>}>
                            <ExcelSheet data={exportExcel} name="pxxsheet">
                                <ExcelColumn label="MATRICULE" value="MATRICULE" />
                                <ExcelColumn label="(PRACTICE)" value="PRACTICE" />
                                {/* <ExcelColumn label="VALUED" value="VALUED" />
                                <ExcelColumn label="ARRIVAL" value="ARRIVAL" />
                                <ExcelColumn label="LEAVING" value="LEAVING" /> */}
                                <ExcelColumn label="MONTH" value="MONTH" />
                                <ExcelColumn label="PROD" value="PROD" />
                                <ExcelColumn label="NOT_PROD" value="NOT_PROD" />
                                <ExcelColumn label="HOLIDAYS" value="HOLIDAYS" />
                                <ExcelColumn label="(AVAILABLE)" value="AVAILABLE" />
                                <ExcelColumn label="(CDM_MATRICULE)" value="CDM_MATRICULE" />
                                <ExcelColumn label="(CDM_NAME)" value="CDM_NAME" />
                            </ExcelSheet>
                        </ExcelFile>
                    )}
                </Col>

                <Col md={3} >
                    <DisplayChildren access='uploadPxx'>
                        {loadingImportLine ? (
                            <Loader />
                        ) : (
                                <ImportExcelFile setImportData={setImportData} sheets='1' />
                            )}
                    </DisplayChildren>
                </Col>

                
                <Col md={2} className='text-right'>
                    <Button
                        variant='primary'
                        //className='text-primary'
                        onClick={() => handlerImportAllPxx()}
                        disabled={!importData.length > 0}
                    ><i className="fas fa-upload"></i> {massImport ? <Loader /> : 'Import All Pxx'}</Button>
                </Col>
            </Row>
            <Row className='pt-3'>
                <Col>
                    <ProgressBar>
                        <ProgressBar animated={massImport} now={100* messsagesImportSuccess / totalToImport} variant='primary' />
                        <ProgressBar animated={massImport} now={100* messsagesImportError / totalToImport} variant='danger' />
                    </ProgressBar>
                </Col>
            </Row>

            <Row>
                <Col>
                    {errorImportMessage && errorImportMessage.map((x, incr) => (
                        <Message key={incr} variant='warning'>{x.message}</Message>
                    ))}
                </Col>
            </Row>

            <Row className='mt-3'>
                <Col xs={6} md={4}>
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

                <Col xs={6} md={4}>
                    <Form.Control
                        plaintext
                        readOnly
                        value={count ? `${count} consultants found` : '0 consultant found'} />
                </Col>     

                <Col xs={6} md={4}>
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
                        <th className='align-middle text-light text-center'>CDM</th>
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
                            <td className='align-middle'><b>{pxx.name.cdmId && pxx.name.cdmId.name}</b></td>
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
                    [0, 1, pages - 2, pages - 1].includes(x) ? (
                        <Pagination.Item
                            key={x + 1}
                            active={x + 1 === page}
                            onClick={() => {
                                dispatch(getAllPxx(userInfo.consultantProfil.practice, monthId, keyword, pageSize, x + 1));
                                setPageNumber(x + 1);
                            }}
                        >{x + 1}</Pagination.Item>
                    ) : (pages > 4 && x === 2) && (
                        <Pagination.Ellipsis key={x + 1} />
                    )

                ))}
                <Pagination.Next
                    onClick={() => setPageNumber(page + 1)}
                    disabled={page === pages}
                />
            </Pagination>

        </div>
    )
}

export default PxxDetailsScreen;
