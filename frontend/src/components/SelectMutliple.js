import React from 'react';
import Select from 'react-select';

const SelectMutliple = ({ options, value, setValue, disabled }) => {

    //console.log('value SelectMutiple', value);

    const handleChange = (e) => {

        //console.log('e', e);
        const valuesSelected = e.map(x => ({id: x.value, value: x.label}));
        setValue(valuesSelected);
    }


    return (
        <div>
            <Select
                closeMenuOnSelect={true}
                placeholder='Select coleader(s)'
                value={value ? value : []}
                isMulti
                options={options ? options : []}
                onChange={handleChange}
                isDisabled={disabled}
            />
        </div>
    )
}

export default SelectMutliple;
