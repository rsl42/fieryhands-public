import { useState } from 'react'
import { Input, InputGroup, IconButton, SelectPicker } from "rsuite";
import SearchIcon from '@rsuite/icons/Search';
import FunnelIcon from '@rsuite/icons/Funnel';

const Filter = () => {
    const [filterExtended, setFilterExtended] = useState(false)

    const listItems = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
        item => ({ label: item, value: item })
    );

    return <div className="filter">
        <div className="filter__first-line">
            <InputGroup inside>
                <Input placeholder="Axtar..."/>
                <InputGroup.Button>
                    <SearchIcon />
                </InputGroup.Button>
            </InputGroup>
            <IconButton
                appearance="primary"
                size="md"
                icon={<FunnelIcon />}
                onClick={() => setFilterExtended(!filterExtended)}
            />
        </div>
        {
            filterExtended && 
                <div className='filter__additional'>
                    <SelectPicker data={listItems} />
                    <SelectPicker data={listItems} />
                    <SelectPicker data={listItems} />
                    <SelectPicker data={listItems} />
                </div>
        }
    </div>;
};  

export default Filter;
