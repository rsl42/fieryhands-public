import { List } from 'rsuite'

const AnnouncementList = ({ data }) => {
    return <List className='announcement-list' hover>
        {
            data.map(announcement => (
                <List.Item key={announcement.id} className="announcement-list__item">
                    <div className='announcement'>
                        <object data="/sample2.png" type="image/png" className="announcement__image">
                            <img src={'http://localhost:9000/static/' + announcement.images[0]} alt="" />
                        </object>
                        <div className='announcement__content'>
                            <div className='announcement__heading'>
                                <h3 className='announcement__title'>{ announcement.title }</h3>
                                <h4 className='announcement__price'>₼{ announcement.price }</h4>
                            </div>
                            <ul className='announcement__details'>
                                <li>Kateqoriya: <b>{announcement.category?.title}</b></li>
                                <li>Sahə: <b>123 kvm</b></li>
                            </ul>
                        </div>
                    </div>
                </List.Item>
            ))
        }
    </List>;
}

export default AnnouncementList