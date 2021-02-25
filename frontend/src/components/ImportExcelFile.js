import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import * as XLSX from 'xlsx';

const ImportExcelFile = ({setImportData}) => {

    const [fileName, setFileName] = useState('');

    const readFileHandler = async (e) => {

        //const [importData, setImportData] = useState([]);

        let file = e.target.files[0];

        let reader = new FileReader();
        reader.onload = function (e) {

            let data = e.target.result;
            let workBook = XLSX.read(data, { type: 'binary' });

            const jsonData = []
            for (let incr = 0; incr < workBook.SheetNames.length; incr++) {
                const wsName = workBook.SheetNames[incr];
                const ws = workBook.Sheets[wsName];
                jsonData.push(XLSX.utils.sheet_to_json(ws));
            }
            setImportData(jsonData);
            setFileName(file.name);
        };
        reader.readAsBinaryString(file);
    }

    return (
        <Form>
            <Form.File
                id="importData"
                custom
            >
                <Form.File.Label data-browse="Upload">{fileName ? fileName : '  ...  '}</Form.File.Label>
                <Form.File.Input onChange={(e) => readFileHandler(e)} />
            </Form.File>
        </Form>
    )
}

export default ImportExcelFile
