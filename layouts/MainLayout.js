import Header from '../components/Header';
import Product from '../components/Product';

export default function MainLayout({ children }) {
    return <div className='main-layout'>
        <main className='main'>
            <div>
                <Header />
                {children}
            </div>
            <div>
                <Product />
            </div>
        </main>
    </div>
}