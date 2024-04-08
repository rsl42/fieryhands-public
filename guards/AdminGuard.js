import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Loader, Placeholder } from 'rsuite';


export { AdminGuard };

function AdminGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    let authRef = useRef(false);
    useEffect(() => {
        authRef.current = sessionStorage.getItem('auth');
        authCheck(router.asPath);

        const hideContent = () => setAuthorized(false);
        router.events.on('routeChangeStart', hideContent);

        router.events.on('routeChangeComplete', authCheck);

        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }
    }, [])

    function authCheck(url) {
        console.log('-----------guard worked-------------')
        if (authRef.current) {
            setAuthorized(true);
        } else {
            setAuthorized(false);
            router.push({
                pathname: '/admin',
            });
        }
    }

    return (authorized ? children : (
    <div>
        <Placeholder.Paragraph rows={22} />
        <Loader center content="Gözləyin..." />
    </div>
    ));
}