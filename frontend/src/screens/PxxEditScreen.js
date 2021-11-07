import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import PxxEditor from '../components/PxxEditor';
import DropDownTitleContainer from '../components/DropDownTitleContainer';
import ConsultantsTab from '../components/ConsultantsTab';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Loader from '../components/Loader';
import { getAllMyConsultants, updateComment, updateMyConsultant } from '../actions/consultantActions';
import { Container, FormControl, InputGroup } from 'react-bootstrap';
import { setConsultantFocus } from '../actions/consultantActions';
import ViewStaffs from '../components/ViewStaffs';
import ViewOldStaffs from '../components/ViewOldStaffs';
import SkillsDetails from '../components/SkillsDetails';
import DisplayChildren from '../components/DisplayChildren';
import XLSX from 'xlsx';

const PxxEditScreen = ({ history }) => {

    const dispatch = useDispatch();

    const [commentText, setCommentText] = useState('');
    const [trObjectives, setTrObjectives] = useState('');
    const [availabilityComment, setAvailabilityComment] = useState('');
    const [notProdComment, setNotProdComment] = useState('');
    const [cvLink, setCvLink] = useState('');

    const [editCv, setEditCv] = useState(false);

    const [delegateOption, setDelegationOption] = useState(false);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const consultantsMyList = useSelector(state => state.consultantsMyList);
    const { loading: loadingConsultantsMyList, error: errorConsultantsMyList, consultantsMy, focus } = consultantsMyList;


    const [searchDate, setSearchDate] = useState(new Date(Date.now()));

    useEffect(() => {

        if (!userInfo) {
            history.push('/login');
        }
    }, [history, userInfo]);


    useEffect(() => {
        // Effect to start loading my consultants and then to update every time focus change
        const option = delegateOption ? 'delegate' : '';
        dispatch(getAllMyConsultants(option));
    }, [dispatch, focus, delegateOption])

    useEffect(() => {
        if (consultantsMy) {
            setCommentText(consultantsMy[focus].comment);
            setTrObjectives(consultantsMy[focus].talentReviewObjectives);
            setNotProdComment(consultantsMy[focus].notProdComment);
            setAvailabilityComment(consultantsMy[focus].availabilityComment);
            setCvLink(consultantsMy[focus].linkedCV);
        }
    }, [consultantsMy, focus]);

    const navigationMonthHandler = (value) => {
        const navigationDate = new Date(searchDate);
        navigationDate.setMonth(navigationDate.getMonth() + value);
        setSearchDate(navigationDate);
    }

    const navigationConsultantHandler = (value) => {

        if (((focus + value) >= 0) && ((focus + value) < consultantsMy.length)) {
            dispatch(setConsultantFocus(focus + value));
        }
    }

    const updateCommentHandler = (consultantId, value) => {
        dispatch(updateComment(consultantId, value));
    }

    const handleUploadClick = () => {
        document.getElementById('fileToUpload').click();
    }

    const onSelectFileToUploadHandler = async (e) => {

        const getCell = (worksheet, row, col) => {
            return worksheet[XLSX.utils.encode_cell({r: row, c: col})];
        };

        const setCell = (worksheet, row, col, value) => {
            XLSX.utils.sheet_add_aoa(worksheet, [[value]], {origin: {r: row, c: col}});
        }

        const fileName = e.target.files[0].name;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' }); 
            const firstSheetName = workbook.SheetNames[0];
            const firstWorkSheet = workbook.Sheets[firstSheetName];
            
            const firstMonthCell = getCell(firstWorkSheet, 5, 9);
            const secondMonthCell = getCell(firstWorkSheet, 5, 13);
            const thirdMonthCell = getCell(firstWorkSheet, 5, 17);
            const fourthMonthCell = getCell(firstWorkSheet, 5, 21);
            const fifthMonthCell = getCell(firstWorkSheet, 5, 25);

            console.log(firstMonthCell);
            console.log(secondMonthCell);

            for (let line = 8 ; line < 100 ; line++) {
                const matriculeCell = getCell(firstWorkSheet, line, 4);
                if (matriculeCell && matriculeCell.v.toString().match(/[0-9]{2,6}/i)) {
                    
                    console.log(`line ${line} - matricule ${matriculeCell.v}`);
                    
                    // FirstMonth
                    const prodFirstMonth = 'to do';
                    const notProdFirstMonth = 'to do';
                    const holidaysFirstMonth = 'to do';
                    setCell(firstWorkSheet, line, 9, prodFirstMonth);
                    setCell(firstWorkSheet, line, 10, notProdFirstMonth);
                    setCell(firstWorkSheet, line, 11, holidaysFirstMonth);

                    // SecondMonth
                    const prodSecondMonth = 'to do';
                    const notProdSecondMonth = 'to do';
                    const holidaysSecondMonth = 'to do';
                    setCell(firstWorkSheet, line, 13, prodSecondMonth);
                    setCell(firstWorkSheet, line, 14, notProdSecondMonth);
                    setCell(firstWorkSheet, line, 15, holidaysSecondMonth);

                    // ThirdMonth
                    const prodThirdMonth = 'to do';
                    const notProdThirdMonth = 'to do';
                    const holidaysThirdMonth = 'to do';
                    setCell(firstWorkSheet, line, 17, prodThirdMonth);
                    setCell(firstWorkSheet, line, 18, notProdThirdMonth);
                    setCell(firstWorkSheet, line, 19, holidaysThirdMonth);

                    // FourthMonth
                    const prodFourthMonth = 'to do';
                    const notProdFourthMonth = 'to do';
                    const holidaysFourthMonth = 'to do';
                    setCell(firstWorkSheet, line, 21, prodFourthMonth);
                    setCell(firstWorkSheet, line, 22, notProdFourthMonth);
                    setCell(firstWorkSheet, line, 23, holidaysFourthMonth);

                    // FifthMonth
                    const prodFifthMonth = 'to do';
                    const notProdFifthMonth = 'to do';
                    const holidaysFifthMonth = 'to do';
                    setCell(firstWorkSheet, line, 25, prodFifthMonth);
                    setCell(firstWorkSheet, line, 26, notProdFifthMonth);
                    setCell(firstWorkSheet, line, 27, holidaysFifthMonth);

                    // Commentaire
                    const comment = 'to do'
                    setCell(firstWorkSheet, line, 33, comment);
                }
            }

            const wopts = { bookType: 'xlsb', bookSST: true, type: 'binary' };
            XLSX.writeFile(workbook, fileName, wopts);       
            //XLSX.writeFile(workbook, 'testImport.xlsb');       
        }
        reader.onerror = (ex) => {
            console.log(ex);
        };
        reader.readAsBinaryString(e.target.files[0]);

        //console.log(e.target.files);
    }

    return (

        <Container>
            <Meta />
            {loadingConsultantsMyList ? <Loader /> :
                errorConsultantsMyList ? <Message variant='danger'>{errorConsultantsMyList}</Message>
                    : !consultantsMy || consultantsMy.length === 0 ?
                        <Message variant='info'>You don't have consultant to edit yet</Message> : (
                            <div>
                                <div className='border-bottom p-3'>
                                    <Row>
                                        <Col className="text-center" xs={2}>
                                            <Button
                                                variant='primary'
                                                size='sm'
                                                onClick={() => navigationConsultantHandler(-1)}
                                                disabled={focus === 0}
                                            ><i className="fas fa-caret-left"></i>
                                            </Button>
                                        </Col>
                                        <Col className="text-center" xs={8}>
                                            <LinkContainer to={`/editconsultant/${consultantsMy[focus]._id}`}>
                                                <Nav.Link>
                                                    <h4>{consultantsMy[focus].name} <i>({consultantsMy[focus].matricule})</i></h4>
                                                </Nav.Link>
                                            </LinkContainer>
                                        </Col>
                                        <Col className="text-center" xs={2}>
                                            <Button
                                                variant='primary'
                                                size='sm'
                                                onClick={() => navigationConsultantHandler(1)}
                                                disabled={focus === consultantsMy.length - 1}
                                            ><i className="fas fa-caret-right"></i>
                                            </Button>
                                        </Col>
                                    </Row>

                                    <Row className='mt-3'>
                                        <Col xs={12} md={4}>
                                            <ListGroup>
                                            <ListGroup.Item>
                                                <Row className="my-3">
                                                    <Col className="text-left"><b>Arrival:</b> {consultantsMy[focus].arrival && consultantsMy[focus].arrival.substring(0, 10)}</Col>
                                                    <Col className="text-left"><b>Valued:</b> {consultantsMy[focus].valued && consultantsMy[focus].valued.substring(0, 10)}</Col>
                                                    <Col className="text-left"><b>Leaving:</b> {consultantsMy[focus].leaving && consultantsMy[focus].leaving.substring(0, 10)}</Col>
                                                </Row>
                                                <Row className="my-3">
                                                    <Col><b>Seniority:</b> {((new Date(Date.now()) - new Date(consultantsMy[focus].arrival.substring(0, 10))) / (1000 * 3600 * 24 * 365.25)).toString().substring(0, 4)} years</Col>
                                                </Row>

                                                <Row className="my-3">
                                                    <Col>
                                                        {!(consultantsMy[focus]._id === userInfo.consultantProfil._id) && (
                                                            <div>
                                                                <label htmlFor="comment"><strong>Staffing comment</strong></label>
                                                                <InputGroup>
                                                                    <FormControl
                                                                        as='textarea'
                                                                        size='sm'
                                                                        rows={7}
                                                                        id='comment'
                                                                        value={commentText}
                                                                        placeholder='Please enter a comment'
                                                                        onChange={(e) => {
                                                                            setCommentText(e.target.value);
                                                                            updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                                        }}
                                                                    ></FormControl>
                                                                </InputGroup>
                                                            </div>
                                                        )}

                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            </ListGroup>
                                        </Col>

                                        <Col xs={12} md={8}>
                                            <PxxEditor
                                                consultantsMy={consultantsMy}
                                                consultantFocus={focus}
                                                searchDate={searchDate}
                                                navigationMonthHandler={navigationMonthHandler}
                                            />
                                        </Col>
                                    </Row>
                                </div>

                                <div className='border-bottom p-3'>
                                    <Row>
                                    <Col xs={12} md={4}>
                                        <label htmlFor="annual-objectives"><strong>Annual objectives</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='annual-objectives'
                                                    value={trObjectives}
                                                    placeholder='Please complete with your CDM'
                                                    onChange={(e) => {
                                                        setTrObjectives(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            talentReviewObjectives: e.target.value,
                                                            notProdComment: notProdComment,
                                                            availabilityComment: availabilityComment,
                                                            linkedCV: cvLink
                                                        }))
                                                        //updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <label htmlFor="not-prod-comment"><strong>Not production justification</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='not-prod-comment'
                                                    value={notProdComment}
                                                    placeholder='Please justify not production time. For example:&#10;- 3d-june: inter-contrat&#10;- 1d/Week: business&#10;- etc.'
                                                    onChange={(e) => {
                                                        setNotProdComment(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            talentReviewObjectives: trObjectives,
                                                            notProdComment: e.target.value,
                                                            availabilityComment: availabilityComment,
                                                            linkedCV: cvLink
                                                        }));
                                                        //updateCommentHandler(consultantsMy[focus]._id, e.target.value)
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <label htmlFor="availability-comment"><strong>Availability comment</strong></label>
                                            <InputGroup>
                                                <FormControl
                                                    as='textarea'
                                                    size='sm'
                                                    rows={3}
                                                    id='availability-comment'
                                                    value={availabilityComment}
                                                    placeholder='Please share any information on your availability. For example: end of mission the 23th of October > 2d/5 available'
                                                    onChange={(e) => {
                                                        setAvailabilityComment(e.target.value);
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            talentReviewObjectives: trObjectives,
                                                            notProdComment: notProdComment,
                                                            availabilityComment: e.target.value,
                                                            linkedCV: cvLink
                                                        }));
                                                    }}
                                                ></FormControl>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </div>

                                <div className='border-bottom p-3'>
                                    <Row className='align-items-end'>
                                        <Col xs={10}>
                                            {editCv ? (
                                                <div>
                                                <label htmlFor="cv-link"><strong>CV from Waveplace</strong></label>
                                                <InputGroup>
                                                    <FormControl
                                                        type='text'
                                                        id='cv-link'
                                                        value={cvLink && cvLink}
                                                        onChange={(e) => setCvLink(e.target.value)}
                                                    ></FormControl>
                                                </InputGroup>
                                                </div>
                                            ) : (
                                                    <div>
                                                        <label><strong>CV from Waveplace</strong></label><br />
                                                        {cvLink ? <a href={cvLink} target="_blank" rel="noreferrer">{cvLink}</a> : <p>Please add the url to Waveplace</p>}
                                                    </div>
                                            )}
                                        </Col>
                                        <Col xs={2}>
                                            <Button block
                                                onClick={() => {
                                                    if (!editCv === false) {
                                                        dispatch(updateMyConsultant({
                                                            ...consultantsMy[focus], 
                                                            talentReviewObjectives: trObjectives,
                                                            notProdComment: notProdComment,
                                                            availabilityComment: availabilityComment,
                                                            linkedCV: cvLink
                                                        }));
                                                    }
                                                    setEditCv(!editCv);

                                                } }
                                            >{editCv ? 'Save' : 'Edit'}</Button>
                                        </Col>
                                    </Row>
                                </div>

                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewStaffings'>
                                            <DropDownTitleContainer title='Staffings on track' close={false}>
                                                <ViewStaffs
                                                    history={history}
                                                    consultantId={consultantsMy[focus]._id}
                                                />
                                            </DropDownTitleContainer>
                                        </DisplayChildren>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <DropDownTitleContainer title='Old staffings' close={true}>
                                            <ViewOldStaffs
                                                history={history}
                                                consultantId={consultantsMy[focus]._id}
                                            />
                                        </DropDownTitleContainer>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewSkills'>
                                            <SkillsDetails consultantId={consultantsMy[focus]._id} />
                                        </DisplayChildren>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <DisplayChildren access='viewOthersConsultants'>
                                            <DropDownTitleContainer title='Others consultants' close={false}>
                                                <Row>
                                                    <Col>
                                                        <Form.Group controlId='switch-only-available' className='mt-3'>
                                                            <Form.Check
                                                                type='switch'
                                                                id='switch-delegation'
                                                                label='View delegation'
                                                                checked={delegateOption}
                                                                onChange={(e) => { e.target.checked === true ? setDelegationOption(true) : setDelegationOption(false) }}
                                                            ></Form.Check>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className='text-right'>
                                                        <input
                                                            type='file'
                                                            id='fileToUpload'
                                                            onChange={(e) => onSelectFileToUploadHandler(e)}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <Button
                                                            className='btn btn-secondary mt-3'
                                                            size='sm'
                                                            onClick={() => handleUploadClick()}
                                                        ><i className="fas fa-file-download"></i>  Update Pxx</Button>
                                                    </Col>
                                                </Row>
                                                <ConsultantsTab
                                                    consultantsMy={consultantsMy}
                                                    history={history}
                                                    focusActive={true}
                                                />
                                            </DropDownTitleContainer>
                                        </DisplayChildren>
                                    </Col>
                                </Row>
                            </div>
                        )}
        </Container>
    )
}

export default PxxEditScreen;
