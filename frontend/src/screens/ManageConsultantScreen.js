import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteConsultant, getAllMyAdminConsultants, consultantImportInMass } from '../actions/consultantActions';
import { CONSULTANT_DELETE_RESET } from '../constants/consultantConstants';
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ImportExcelFile from '../components/ImportExcelFile';
import ReactExport from "react-export-excel";
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ManageConsultantScreen = ({ history, match }) => {

    const dispatch = useDispatch();

    const [pageSize, setPageSize] = useState(10000);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');

    const [exportExcel, setExportExcel] = useState('');

    const [importData, setImportData] = useState([]);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyAdminList = useSelector(state => state.consultantsMyAdminList);
    const { loading, error, consultantsMyAdmin, pages, page, count } = consultantsMyAdminList;

    const consultantDelete = useSelector(state => state.consultantDelete);
    const { success: successConsultantDelete } = consultantDelete;

    const consultantsMassImport = useSelector(state => state.consultantsMassImport);
    const { loading:loadingMassImport, error:errorMassImport, success:successMassImport } = consultantsMassImport;

    useEffect(() => {

        if (userInfo) {
            dispatch(getAllMyAdminConsultants(keyword, pageNumber, pageSize));
        } else {
            history.push('/login');
        }

    }, [dispatch, history, userInfo, pageNumber, pageSize, keyword, successMassImport]);

    useEffect(() => {
        if (consultantsMyAdmin) {
            const exportExcelData = consultantsMyAdmin.map((consultant) => ({
                'NAME': consultant.name,
                'EMAIL': consultant.email,
                'PRACTICE': consultant.practice,
                'MATRICULE': consultant.matricule,
                'VALUED': consultant.valued.substring(0,10),
                'ARRIVAL': consultant.arrival.substring(0,10),
                'LEAVING': consultant.leaving ? consultant.leaving.substring(0,10) : '',
                'PARTIAL_TIME': consultant.isPartialTime.value,
                'GRADE': consultant.grade,
                'IS_CDM': consultant.isCDM,
                'CDM_MATRICULE': consultant.cdmId && consultant.cdmId.matricule,
                'CDM_NAME': consultant.cdmId && consultant.cdmId.name
            }));
            setExportExcel(exportExcelData);
        }
    },[consultantsMyAdmin])

    useEffect(() => {
        if (successConsultantDelete) {
            dispatch(getAllMyAdminConsultants(keyword, pageNumber, pageSize));
            dispatch({ type: CONSULTANT_DELETE_RESET });
        }
    // eslint-disable-next-line
    }, [dispatch, successConsultantDelete]);


    useEffect(() => {
        if(importData.length > 0) {
            dispatch(consultantImportInMass(importData));
        }
    },[dispatch, importData]);

    const addConsultantHandler = () => {
        history.push('/admin/consultant/add');
    }

    const onClickEditHandler = (consultantId) => {
        history.push(`/editconsultant/${consultantId}`);
    };

    const onClickDeleteHandler = (consultant) => {
        if (window.confirm(`Are you sure to delete user: ${consultant.name} ?`)) {
            dispatch(deleteConsultant(consultant._id));
        }
    }

    return (
        <>
            {errorMassImport && <Message variant='danger'>{errorMassImport}</Message>}
            
            <DropDownTitleContainer title='Manage consultants' close={false}>
                <ListGroup.Item>
                    <Row>

                        <Col xs={6} md={2}>
                            <Button 
                                className="mb-3" 
                                onClick={() => addConsultantHandler()}
                            ><i className="fas fa-user-edit mr-2"></i>Add
                            </Button>
                        </Col>

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

                        <Col xs={6} md={2}>
                            <Form.Control
                                plaintext
                                readOnly
                                value={count ? `${count} consultants found` : '0 consultant found'} />
                        </Col>

                        <Col xs={6} md={2}>
                            {loadingMassImport ? (<Loader />) : (
                                <ImportExcelFile setImportData={setImportData} />
                            )}
                        </Col>

                        <Col xs={6} md={2}>
                            {exportExcel && (
                                <ExcelFile element={<Button variant='primary'><i className="fas fa-download"></i>  Download</Button>}>
                                    <ExcelSheet data={exportExcel} name="pxxsheet">
                                        <ExcelColumn label="NAME" value="NAME" />
                                        <ExcelColumn label="EMAIL" value="EMAIL" />
                                        <ExcelColumn label="PRACTICE" value="PRACTICE" />
                                        <ExcelColumn label="MATRICULE" value="MATRICULE" />
                                        <ExcelColumn label="VALUED" value="VALUED" />
                                        <ExcelColumn label="ARRIVAL" value="ARRIVAL" />
                                        <ExcelColumn label="LEAVING" value="LEAVING" />
                                        <ExcelColumn label="PARTIAL_TIME" value="PARTIAL_TIME" />
                                        <ExcelColumn label="GRADE" value="GRADE" />
                                        <ExcelColumn label="IS_CDM" value="IS_CDM" />
                                        <ExcelColumn label="CDM_MATRICULE" value="CDM_MATRICULE" />
                                        <ExcelColumn label="CDM_NAME" value="CDM_NAME" />
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
                                    {[5, 10, 15, 20, 50, 10000].map(x => (
                                        <option
                                            key={x}
                                            value={x}
                                        >{x === 10000 ? 'All (export)' : `${x} / page`}</option>
                                    ))}
                                </FormControl>
                            </InputGroup>
                        </Col>

                    </Row>

                    {consultantsMyAdmin && consultantsMyAdmin.length === 0 ? <Message variant='information'>You have not access to these information</Message> :
                        loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (


                            <Table responsive hover striped>
                                <thead>
                                    <tr className='table-primary'>
                                        <th className='align-middle text-light'>Consultant name</th>
                                        <th className='align-middle text-light'>Matricule</th>
                                        <th className='align-middle text-light'>Practice</th>
                                        <th className='align-middle text-light'>Valued</th>
                                        <th className='align-middle text-light'>Arrival</th>
                                        <th className='align-middle text-light'>Leaving</th>
                                        <th className='align-middle text-light'>Seniority</th>
                                        <th className='align-middle text-light'></th>
                                        <th className='align-middle text-light'></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {consultantsMyAdmin && consultantsMyAdmin.map((consultant) => (
                                        <tr key={consultant._id}>
                                            <td className='align-middle'>{consultant.name}</td>
                                            <td className='align-middle'>{consultant.matricule}</td>
                                            <td className='align-middle'>{consultant.practice}</td>
                                            <td className='align-middle'>{consultant.valued ? consultant.valued.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{consultant.arrival ? consultant.arrival.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{consultant.leaving ? consultant.leaving.substring(0, 10) : ''}</td>
                                            <td className='align-middle'>{
                                                consultant.valued ? ((new Date(Date.now()) - new Date(consultant.valued.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4) : 0
                                            } years</td>
                                            <td className='align-middle'>
                                                <Button
                                                    className='btn btn-primary p-1'
                                                    onClick={() => onClickEditHandler(consultant._id)}
                                                    size='sm'
                                                ><i className="fas fa-user-edit"></i>
                                                </Button>
                                            </td>
                                            <td className='align-middle'>
                                                <Button
                                                    className='btn btn-danger p-1'
                                                    onClick={() => onClickDeleteHandler(consultant)}
                                                    size='sm'
                                                ><i className="fas fa-user-times"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        )}

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
                                        dispatch(getAllMyAdminConsultants(keyword, x + 1, pageSize));
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
                </ListGroup.Item>
            </DropDownTitleContainer>
        </>
    )
}

export default ManageConsultantScreen;
