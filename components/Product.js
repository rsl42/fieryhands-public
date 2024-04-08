import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import API from '../api';
import { Loader, Whisper, Tooltip, ButtonToolbar, Button } from 'rsuite';
import { fileBaseUrl } from '../config/urls';
import ImageGallery from "react-image-gallery";
import Moment from 'react-moment';
import Swal from 'sweetalert2';
import shallowQueryChange from '../helpers/shallowQueryChange';

const Product = () => {
    const router = useRouter();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (router.query.productId) {
            getProductById(router.query.productId);
        } else {
          setSelectedProduct(null);
          setPhotos([]);
        }
    }, [router.query.productId]);

    const getProductById = (id) => {
      setIsLoading(true);
      API.Client.getAnnouncementById(id)
        .then(res => {
          console.log(res);
          if (res.success) {
            const data = res.payload;
            data.images = data.images.map(img => ({
              original: fileBaseUrl + img.original,
              thumbnail: fileBaseUrl + img.thumbnail,
              originalHeight: '400px',
              name: img.original
            }))
            setSelectedProduct(data);
            setPhotos(data?.images);
            setIsLoading(false);
          }
        })
    }

    const screenChange = (e) => {
      console.log(e);
      setPhotos(prev => {
        const newPh = prev;
        newPh = newPh.map(img => ({
          ...img,
          originalHeight: e ? '750px' : '400px'
        }))
        return newPh;
      })
    }

    const handleEvent = (isDelete) => {
      Swal.fire({
        title: 'Davam etmək üçün kodu daxil edin!',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonText: 'Bağla',
        confirmButtonText: 'Davam et',
        showLoaderOnConfirm: true,
        preConfirm: (hash) => {
          return API.Client.checkHash(selectedProduct?.id, hash)
            .then(res => {
              if (!res.success) {
                throw new Error(res.message)
              }
              return {...res, hash};
            })
            .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed && result?.value?.success) {
          if (isDelete) {
            Swal.fire({
              title: 'Zəhmət olmasa gözləyin...',
              allowOutsideClick: false,
              didOpen: () => {
                  Swal.showLoading();
              }
            });
            
            API.Client.deleteAnnouncement(result.value.hash, selectedProduct?.id)
              .then(res => {
                if (res?.success) {
                  Swal.fire({
                    title: `Uğurlu`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                  }).then(() => {
                    router.replace('/');
                  })
                }
              })
          } else {
            Swal.fire({
              title: `Uğurlu`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              router.replace({pathname: '/update', query: {data: JSON.stringify({...selectedProduct, hash: result.value.hash})}})
            })
          }
        }
      })
    }

    if (isLoading) return <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80vh'
    }}><Loader center content="Yüklənir..." /></div>

    if (!selectedProduct) return null;

    return (
        <div id='product'>
            {photos?.length && <ImageGallery
              items={photos}
              onScreenChange={screenChange}
            />}
            <div className='title_price'>
              <div className='title'>
                {selectedProduct?.title}
              </div>
              <div className='price'>
                ₼{selectedProduct?.price}
              </div>
            </div>
            <div className='desc'>
              {selectedProduct?.description}
            </div>
            <table className='other-data'>
              <tbody>
                <tr>
                  <td>Kateqoriya: </td>
                  <td>{selectedProduct?.category?.title}</td>
                </tr>
                <tr>
                  <td>Elanın sahibi: </td>
                  <td>{selectedProduct?.author}</td>
                </tr>
                <tr>
                  <td>Əlaqə telefonu: </td>
                  <td>
                  <Whisper trigger="hover" speaker={<Tooltip>Zəng et</Tooltip>}>
                    <a style={{color: 'black'}} href={'tel:' + selectedProduct?.phone}>{selectedProduct?.phone}</a>
                  </Whisper>
                  </td>
                </tr>
                <tr>
                  <td>{selectedProduct?.updateDate ? 'Yenilənmə' : 'Elan'} tarixi: </td>
                  <td>
                    <Moment format="DD.MM.YYYY">
                      {selectedProduct?.updateDate || selectedProduct?.createDate}
                    </Moment>
                  </td>
                </tr>
              </tbody>
            </table>
            <ButtonToolbar style={{textAlign: 'right'}}>
              <Button color="red" appearance="primary" onClick={() => handleEvent(true)}>
                Sil
              </Button>
              <Button color="orange" appearance="primary" onClick={() => handleEvent(false)}>
                Düzəliş et
              </Button>
            </ButtonToolbar>
        </div>
    )
}

export default Product;