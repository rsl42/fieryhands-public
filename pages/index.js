/* eslint-disable @next/next/no-img-element */

// TODO Infinite scroll 

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import MainLayout from "../layouts/MainLayout";
import shallowQueryChange from "../helpers/shallowQueryChange";
import API from "../api";

import AnnouncementList from "../components/AnnouncementsList";

export default function Home() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState([]);
    const [limit, setLimit] = useState(router.query.limit || 10);
    const [page, setPage] = useState(router.query.page || 1);

    useEffect(() => {
        if (router?.query?.page && router?.query?.limit) {
            getAllAnnouncements();
        } else {
            shallowQueryChange(router, "/", { page: 1, limit: 10 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router?.query?.page, router?.query?.limit]);

    const getAllAnnouncements = () => {
        API.Client.getAllAnnouncements({ page, limit }).then((res) => {
            if (res?.success) {
                setAnnouncements(res.payload);
            }
        });
    };

    const handleChangeLimit = (dataKey) => {
        setPage(1);
        setLimit(dataKey);
        shallowQueryChange(router, "/", { page, limit });
    };

    const handlePageChange = (page) => {
        setPage(page);
        shallowQueryChange(router, "/", { page, limit });
    };

    return (
        <MainLayout>
            <div className="home">
                <AnnouncementList data={announcements}/>
            </div>
        </MainLayout>
    );
}
