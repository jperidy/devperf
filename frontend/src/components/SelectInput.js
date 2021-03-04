import React from 'react';
import Select from 'react-select';

const SelectInput = ({ options, value, setValue, disabled, multi }) => {

    //console.log('value SelectMutiple', value);

    const handleChange = (e) => {
        let valuesSelected = [];
        if(multi) {
            valuesSelected = e.map(x => ({id: x.value, value: x.label}));
        } else {
            valuesSelected = [{id: e.value, value: e.label}]
        }
        setValue(valuesSelected);
    }

    //console.log(value);

    return (
        <div>
            <Select
                closeMenuOnSelect={true}
                placeholder='Select...'
                value={value ? value : null}
                isMulti={multi}
                options={options ? options : []}
                onChange={handleChange}
                isDisabled={disabled}
            />
        </div>
    )
}

export default SelectInput;
