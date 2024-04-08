import React, { useCallback, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import { Button, Drawer } from "rsuite";
import Swal from "sweetalert2";
import { fileBaseUrl } from "../config/urls";
import Moment from "react-moment";
import API from "../api";

const ProductModal = ({ getAllAnnouncements, id, showModal, closeItem }) => {
  const [photos, setPhotos] = useState([]);
  const [data, setData] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [getProduct, id]);

  const getProduct = useCallback(() => {
    API.Admin.getAnnouncementById(id)
      .then(res => {
        if (res.success) {
          setData(res.payload);
          setPhotos(res?.payload?.images.map(img => ({
            original: fileBaseUrl + img?.original,
            thumbnail: fileBaseUrl + img?.thumbnail,
            originalHeight: isFullScreen ? '750px' : '500px'
          })))
        }
      })
  }, [id, isFullScreen])

  const preparePhotos = () => {
      setPhotos(data?.images.map(img => ({
        original: fileBaseUrl + img?.original,
        thumbnail: fileBaseUrl + img?.thumbnail,
        originalHeight: isFullScreen ? '750px' : '500px'
      })))
  };

  // useEffect(() => {
  //   if (photos.length) {
  //     console.log('hello')
  //     setPhotos(prev => {
  //       return prev.map(photo => ({...photo, originalHeight: isFullScreen ? '750px' : '500px'}))
  //     })
  //   }
  // }, [isFullScreen]);

  const screenChange = (e) => {
    console.log(e);
    setIsFullScreen(e);
    setPhotos(prev => {
      const newPh = prev;
      newPh = newPh.map(img => ({
        ...img,
        originalHeight: e ? '750px' : '500px'
      }))
      return newPh;
    })
  }

  const deleteAnnouncement = () => {
    Swal.fire({
      icon: 'question',
      title: 'Əminsiniz?',
      confirmButtonText: 'Bəli',
      cancelButtonText: 'Xeyr',
      showCancelButton: true,
    }).then(res => {
      if (res.isConfirmed) {
        Swal.fire({
          title: 'Zəhmət olmasa gözləyin...',
          allowOutsideClick: false,
          didOpen: () => {
              Swal.showLoading();
          }
        });
    
        // Shared.deleteAnnouncement(data)
        //   .then(res => {
        //     if (res.success) {
        //       getAllAnnouncements();
        //       setShowModal(false);
        //       Swal.close();
        //     }
        //   });
      }
    })
  }

  return (
    <>

      {data && (
        <Drawer
          size={"md"}
          placement={"right"}
          open={showModal}
          onClose={() => closeItem(false)}
        >
          <Drawer.Header>
            <Drawer.Title>Ətraflı məlumat</Drawer.Title>
            <Drawer.Actions>
              <Button onClick={() => closeItem(false)}>Bağla</Button>
              <Button onClick={() => deleteAnnouncement()} appearance="primary" color="red">Sil</Button>
              <Button onClick={() => closeItem(false)} appearance="primary">
                Təsdiqlə
              </Button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body>
            <div id="product">
              {photos?.length && <ImageGallery
                items={photos}
                onScreenChange={screenChange}
              />}
              <div className='title_price'>
                <div className='title'>
                  {data?.title}
                </div>
                <div className='price'>
                  ₼{data?.price}
                </div>
              </div>
              <div className='desc'>
                {data?.description}
              </div>
              <table className='other-data'>
                <tbody>
                  <tr>
                    <td>Kateqoriya: </td>
                    <td>{data?.category?.title}</td>
                  </tr>
                  <tr>
                    <td>Elanın sahibi: </td>
                    <td>{data?.author}</td>
                  </tr>
                  <tr>
                    <td>Əlaqə telefonu: </td>
                    <td>
                      <a style={{color: 'black'}} href={'tel:' + data?.phone}>{data?.phone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td>{data?.updateDate ? 'Yenilənmə' : 'Elan'} tarixi: </td>
                    <td>
                      <Moment format="DD.MM.YYYY">
                        {data?.updateDate || data?.createDate}
                      </Moment>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Drawer.Body>
        </Drawer>
      )}
    </>
  );
};

export default React.memo(ProductModal);
