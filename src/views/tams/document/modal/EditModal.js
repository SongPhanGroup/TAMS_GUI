// ** React Imports
// ** Reactstrap Imports
import {
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button
} from "reactstrap"

// ** Third Party Components
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { detailDocument, editDocument } from "../../../../api/document"
import { useEffect, useState } from "react"
import { Loader } from "react-feather"
import { getMajor } from "../../../../api/major"
import { getDocumentType } from "../../../../api/document_type"
import classNames from "classnames"

const EditDocument = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const EditDocumentSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu chọn file"),
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        source: yup.string().required("Yêu cầu nhập nguồn tài liệu"),
        documentType: yup.object().required("Yêu cầu chọn loại tài liệu").nullable(),
        major: yup.object().required("Yêu cầu chọn chuyên ngành").nullable(),
        author: yup.string().required("Yêu cầu nhập tác giả"),
        coAuthor: yup.string().required("Yêu cầu nhập đồng tác giả"),
        supervisor: yup.string().required("Yêu cầu nhập người giám sát")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditDocumentSchema)
    })

    const handleCloseModal = () => {
        handleEditModal()
    }

    const [listDocumentType, setListDocumentType] = useState([])
    const [listMajor, setListMajor] = useState([])
    const [loadingEdit, setLoadingEdit] = useState()
    // const [dataDetail, setDataDetail] = useState()

    const getAllDataPromises = async () => {
        const majorPromise = getMajor({ params: { page: 1, perPage: 10, search: '' } })
        const documentTypePromise = getDocumentType({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [documentTypePromise, majorPromise]
        const results = await Promise.allSettled(promises)
        const responseData = promises.reduce((acc, promise, index) => {
            if (results[index].status === 'fulfilled') {
                acc[index] = results[index].value
            } else {
                acc[index] = { error: results[index].reason }
            }
            return acc
        }, [])

        const documentTypeRes = responseData[0]
        const majorRes = responseData[1]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListDocumentType(null)
                setListMajor(null)
            }
        })
        const documentTypes = documentTypeRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const majors = majorRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListDocumentType(documentTypes)
        setListMajor(majors)
    }

    console.log(dataEdit)
    const getDataDetail = () => {
        detailDocument(dataEdit?.id).then((res) => {
            console.log(res)
        })
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
        getDataDetail()
    }, [open])

    const onSubmit = data => {
        setLoadingEdit(true)
        const formData = new FormData()
        formData.append("description", data.description)
        formData.append("title", data.title)
        formData.append("source", data.source)
        formData.append("courseId", data.course.value)
        formData.append("majorId", data.major.value)
        formData.append("typeId", 0)
        formData.append("author", data.author)
        formData.append("coAuthor", data.coAuthor)
        formData.append("supervisor", data.supervisor)
        editDocument(dataEdit?.id, formData).then(result => {
            if (!result.error) {
                Swal.fire({
                    title: "Cập nhật tài liệu thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                }).then(() => {
                    handleCloseModal()
                })
            }
            getData()
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingEdit(false)
        })
    }

    console.log(listMajor.find(major => major.value === dataEdit?.majorId))
    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật tài liệu</h1>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col sm={12} xs={12}>
                        <Label className='form-label' for='title'>
                            Tiêu đề <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.title ?? ''}
                            control={control}
                            name='title'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='title'
                                        placeholder='Nhập tiêu đề'
                                        invalid={errors.title && true}
                                    />
                                )
                            }}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='author'>
                            Tác giả <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.author ?? ''}
                            control={control}
                            name='author'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='author'
                                        placeholder='Nhập tác giả'
                                        invalid={errors.author && true}
                                    />
                                )
                            }}
                        />
                        {errors.author && <FormFeedback>{errors.author.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='coAuthor'>
                            Đồng tác giả <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.coAuthor ?? ''}
                            control={control}
                            name='coAuthor'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='coAuthor'
                                        placeholder='Nhập đồng tác giả'
                                        invalid={errors.coAuthor && true}
                                    />
                                )
                            }}
                        />
                        {errors.coAuthor && <FormFeedback>{errors.coAuthor.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='supervisor'>
                            Người hướng dẫn <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.supervisor ?? ''}
                            control={control}
                            name='supervisor'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='supervisor'
                                        placeholder='Nhập người hướng dẫn'
                                        invalid={errors.supervisor && true}
                                    />
                                )
                            }}
                        />
                        {errors.supervisor && <FormFeedback>{errors.supervisor.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='source'>
                            Nguồn tài liệu <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.source ?? ''}
                            control={control}
                            name='source'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='source'
                                        placeholder='Nhập tiêu đề'
                                        invalid={errors.source && true}
                                    />
                                )
                            }}
                        />
                        {errors.source && <FormFeedback>{errors.source.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='documentType'>
                            Loại tài liệu <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            id='react-select'
                            defaultValue={{ value: dataEdit?.documentType?.id, label: dataEdit?.documentType?.name }}
                            name='documentType'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn loại tài liệu"
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listDocumentType}
                                    isClearable
                                    className={classNames('react-select', { 'is-invalid': errors.documentType && true })}
                                    {...field}
                                />)}
                        />
                        {errors.documentType && <FormFeedback>{errors.documentType.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='major'>
                            Lĩnh vực <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            id='react-select'
                            defaultValue={{ value: dataEdit?.major?.id, label: dataEdit?.major?.name }}
                            name='major'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn lĩnh vực"
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listMajor}
                                    isClearable
                                    className={classNames('react-select', { 'is-invalid': errors.major && true })}
                                    {...field}
                                />)}
                        />
                        {errors.major && <FormFeedback>{errors.major.message}</FormFeedback>}
                    </Col>
                    <Col sm={12} xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.description ?? ''}
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                    </Col>
                    <Col sm={12} xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.fileName ?? ''}
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} disabled placeholder='Chọn tài liệu' invalid={errors.file && true} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            {
                                loadingEdit === true ? <Loader color="#fff" size="16px" /> : 'Cập nhật'
                            }
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={handleCloseModal}>
                            Hủy
                        </Button>
                    </Col>
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default EditDocument