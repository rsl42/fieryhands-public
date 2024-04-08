import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { Table, Pagination, Button } from "rsuite";
import { paginationLocale } from "../../helpers/localizationOptions";
import ProductModal from "../../components/ProductModal";
import shallowQueryChange from "../../helpers/shallowQueryChange";
import { useRouter } from "next/router";
import { useCallback } from "react";
import API from "../../api";

export default function Products() {
  const [data, setData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const { Column, HeaderCell, Cell } = Table;
  const router = useRouter();

  const getAllAnnouncements = useCallback(() => {
    API.Admin.getAllAnnouncements({page, limit})
      .then(res => {
        console.log(res)
        if (res?.success) {
          setData(res)
        }
      });
  }, [page, limit]);

  useEffect(() => {
    getAllAnnouncements();
  }, [getAllAnnouncements]);

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
    shallowQueryChange(router, '/admin/products', {page, limit});
  };

  const handlePageChange = (page) => {
    setPage(page);
    shallowQueryChange(router, '/admin/products', {page, limit});
  }

  const showItem = (pr) => {
    setShowModal(true);
    setSelectedId(pr.id);
  }

  const closeItem = () => {
    setShowModal(false);
    setSelectedId(null);
  }

  return (
    <AdminLayout>
      <Table
        autoHeight={true}
        data={data?.payload}
        loading={!data?.payload?.length}
        wordWrap="keep-all"
      >
        <Column width={60} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column width={150}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="title" />
        </Column>
        <Column width={80} fixed="right">
          <HeaderCell>...</HeaderCell>

          <Cell>
            {(rowData) => (
              <span>
              <Button appearance="primary" onClick={() => showItem(rowData)}>
                Bax
              </Button>
              </span>
            )}
          </Cell>
        </Column>
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          locale={paginationLocale}
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="md"
          layout={["total", "-", "limit", "|", "pager"]}
          total={data.totalCount}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={handlePageChange}
          onChangeLimit={handleChangeLimit}
        />
      </div>
      <ProductModal id={selectedId} showModal={showModal} closeItem={closeItem} getAllAnnouncements={getAllAnnouncements}/>
    </AdminLayout>
  );
}
