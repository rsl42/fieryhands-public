import { useState, useEffect } from 'react'
import { Affix } from 'rsuite'
import Navbar from './Navbar'
import Filter from './Filter'

const Header = () => {
    const [rendered, setRendered] = useState(false)

    useEffect(() => {
        setRendered(true)
    }, [])

    if (rendered) {
        return <>
            <Affix>
                <Navbar />
                <Filter />
            </Affix>
        </>
    }
    return
}

export default Header
