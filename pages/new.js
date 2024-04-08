import MainLayout from "../layouts/MainLayout";
import { Form, ButtonToolbar, Button, InputGroup, Cascader, Uploader, Schema, MaskedInput } from 'rsuite';
import CameraRetroIcon from '@rsuite/icons/legacy/CameraRetro';
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { pickerLocale, uploaderLocale } from "../helpers/localizationOptions";
import Swal from "sweetalert2";
import API from "../api";
import { useLocation } from "react-router-dom";

const NewAd = () => {
    const router = useRouter();
    const formRef = useRef();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (router.query.data) {
            const data = JSON.parse(router.query.data);
            data.images = data.images.map((img, i) => ({
                name: img.name,
                fileKey: i,
                url: img.original
            }))
            setFormData({
                title: data.title,
                description: data.description,
                price: data?.price,
                categoryId: data?.categoryId,
                images: data.images,
                author: data.author,
                email: data.email,
                phone: data.phone,
                isUpdate: true,
                id: data?.id,
                hash: data?.hash
            })
        }
    }, [router]);

    const defaultFormValue = {
        title: '',
        description: '',
        price: 0,
        categoryId: '',
        images: [],
        author: '',
        email: '',
        phone: 0
    }
    function mockTreeData(options) {
        const { limits, labels, getRowData } = options;
        const depth = limits.length;
      
        const data = [];
        const mock = (list, parentValue, layer = 0) => {
          const length = limits[layer];
          Array.from({ length }).forEach((_, index) => {
            const value = parentValue ? parentValue + '-' + (index + 1) : index + 1 + '';
            const children = [];
            const label = Array.isArray(labels) ? labels[layer] : labels;
            let row = {
              label: typeof label === 'function' ? label(layer, value, faker) : label + ' ' + value,
              value
            };
      
            if (getRowData) {
              row = {
                ...row,
                ...getRowData(layer, value)
              };
            }
      
            list.push(row);
      
            if (layer < depth - 1) {
              row.children = children;
              mock(children, value, layer + 1);
            }
          });
        };
      
        mock(data);
      
        return data;
      }

    const treeData = useMemo(() => mockTreeData({ limits: [2, 3, 3], labels: ['Provincial', 'County', 'Town'] }), []);

    const model = Schema.Model({
        title: Schema.Types.StringType()
            .isRequired('Başlıq mütləqdir!')
            .minLength(5, 'Minimum 5 simvol olmalıdır!'),
        description: Schema.Types.StringType()
        .isRequired('Açıqlama mütləqdir!'),
        price: Schema.Types.NumberType()
            .isRequired('Qiymət mütləqdir!'),
        categoryId: Schema.Types.StringType()
        .isRequired('Kateqoriya mütləqdir'),
        images: Schema.Types.ArrayType()
            .isRequired('Ən azı 1 şəkil yüklənməlidir!'),
        author: Schema.Types.StringType()
            .isRequired('Elan sahibi mütləqdir!'),
        email: Schema.Types.StringType()
            .isEmail('Düzgün daxil edin!'),
        phone: Schema.Types.NumberType()
            .isRequired('Nömrə mütləqdir!')

    })

    const handleChange = (e) => {
        setFormData(e);
    }

    const submitForm = () => {

        if (!!formRef.current.check()) {
            Swal.fire({
                title: 'Zəhmət olmasa gözləyin...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            if (!formData?.isUpdate) {
                API.Shared.upload(formData.images)
                .then(res => {
                    console.log(res);
                    if (res.success) {
                        const imgs = res.payload?.map(img => img.name);
                        const body = {
                            ...formData,
                            images: imgs,
                            price: parseFloat(formData.price),
                            categoryId: 1,
                            phone: formData.phone,
                        }
                        API.Client.addAnnouncement(body).then(res => {
                            console.log(res);
                            Swal.fire({
                                icon: 'success',
                                title: 'Elanınız təsdiq üçün göndərildi!',
                                html: `
                                    <div style="text-align:center">
                                        Elanınız təsdiqləndikdən sonra görə biləcəksiniz.</br>
                                        Elanı silmək və ya düzəliş etmək üçün aşağıdakı kodu itirməyin!</br></br>
                                        <strong>${res?.payload?.hash}</strong>
                                    </div>
                                `,
                                showConfirmButton: true,
                                confirmButtonText: 'Əsas səhifəyə qayıt',
                                confirmButtonColor: 'green',
                                showCancelButton: false,
                                allowOutsideClick: false
                            }).then(res => {
                                if (res.isConfirmed) {
                                    router.push('/');
                                }
                            })
                        })
                    }
                })
            } else {
                const changedImages = formData?.images?.filter(img => img?.blobFile);
                if (changedImages?.length) {
                    API.Shared.upload(changedImages)
                        .then(res => {
                            if (res.success) {
                                const imgs = res.payload?.map(img => img.name);
                                const initialImgs = formData.images?.filter(img => !img?.blobFile)?.map(img => img.name);
                                updateAnn([...imgs, ...initialImgs])
                            }
                        })
                } else {
                    updateAnn(formData?.images)
                }

            }

        }
    }

    const updateAnn = (imgs) => {
        const body = {
            ...formData,
            images: imgs,
            price: parseFloat(formData.price),
            categoryId: 1,
            phone: parseFloat(formData.phone),
        }
        delete body.isUpdate;
        delete body.id;
        API.Client.updateAnnouncement(body, formData?.id).then(res => {
            console.log(res);
            Swal.fire({
                icon: 'success',
                title: 'Elanınız təsdiq üçün göndərildi!',
                html: `
                    <div style="text-align:center">
                        Elanınız təsdiqləndikdən sonra görə biləcəksiniz.</br>
                        Elanı silmək və ya düzəliş etmək üçün aşağıdakı kodu itirməyin!</br></br>
                        <strong>${res?.payload?.hash}</strong>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: 'Əsas səhifəyə qayıt',
                confirmButtonColor: 'green',
                showCancelButton: false,
                allowOutsideClick: false
            }).then(res => {
                if (res.isConfirmed) {
                    router.push('/');
                }
            })
        })
    }

    const resetForm = () => {
        setFormData(defaultFormValue);
    }
  return (
    <MainLayout>
        <div className="new-ad">
            <Form 
                fluid
                onChange={(e) => handleChange(e)}
                ref={formRef}
                formValue={formData}
                model={model}
                checkTrigger="blur"
            >
                <Form.Group controlId="title">
                    <Form.ControlLabel>Başlıq</Form.ControlLabel>
                    <Form.Control name="title" />
                </Form.Group>
            
                <Form.Group controlId="description">
                    <Form.ControlLabel>Açıqlama</Form.ControlLabel>
                    <Form.Control name="description" />
                </Form.Group>

                <Form.Group controlId={"price"}>
                    <Form.ControlLabel>Qiymət</Form.ControlLabel>
                    <InputGroup>
                        <InputGroup.Addon>₼</InputGroup.Addon>
                        <Form.Control
                            name="price"
                            placeholder=""
                            type="number"
                        />                
                    </InputGroup>
                </Form.Group>

                <Form.Group controlId="categoryId">
                    <Form.ControlLabel>Kateqoriya:</Form.ControlLabel>
                    <Form.Control
                        placeholder='Kateqoriya seçin...' 
                        name="categoryId" 
                        accepter={Cascader} 
                        data={treeData} 
                        labelKey='label'
                        valueKey='value'
                        locale={pickerLocale}
                    />
                </Form.Group>

                <Form.Group controlId="images">
                    <Form.ControlLabel>Şəkillər:</Form.ControlLabel>
                    <Form.Control
                        name="images"
                        accepter={Uploader}
                        action="#"
                        locale={uploaderLocale}
                        multiple
                        listType="picture"
                        fileList={formData.images}
                        accept="image/*"
                    >
                        <button>
                        <CameraRetroIcon />
                        </button>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="author">
                    <Form.ControlLabel>Elanın sahibi</Form.ControlLabel>
                    <Form.Control name="author" />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.ControlLabel>E-poçt</Form.ControlLabel>
                    <Form.Control name="email" />
                </Form.Group>

                <Form.Group controlId="phone">
                    <Form.ControlLabel>Nömrə</Form.ControlLabel>
                    <Form.Control type="number" placeholder="0501112233" name="phone" />
                </Form.Group>

                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary" onClick={submitForm}>Təsdiqlə</Button>
                        <Button appearance="default" onClick={resetForm}>Reset</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
        </div>
    </MainLayout>
  );
};

export default NewAd;
