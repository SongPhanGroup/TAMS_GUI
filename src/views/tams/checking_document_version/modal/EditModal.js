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
import { useEffect, useState } from "react"
import { editCheckingDocumentVersion } from "../../../../api/checking_document_version"
import { detailCheckingDocument, getCheckingDocument } from "../../../../api/checking_document"

const EditCheckingDocumentVersion = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const [dataDetail, setDataDetail] = useState()

    useEffect(() => {
        detailCheckingDocument(dataEdit?.id).then((result) => {
            setDataDetail(result)
        }).catch(error => {
            console.log(error)
        })
    }, [dataEdit?.id])
    console.log(dataDetail)

    const EditCheckingDocumentVersionSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu nhập file"),
        description: yup.string().required("Yêu cầu nhập mô tả")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCheckingDocumentVersionSchema)
    })

    const [file, setFile] = useState()
    const [listCheckingDocument, setListCheckingDocument] = useState([])

    const getAllDataPromises = async () => {
        const checkingDocumentPromise = getCheckingDocument({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [checkingDocumentPromise]
        const results = await Promise.allSettled(promises)
        const responseData = promises.reduce((acc, promise, index) => {
            if (results[index].status === 'fulfilled') {
                acc[index] = results[index].value
            } else {
                acc[index] = { error: results[index].reason }
            }
            return acc
        }, [])

        const checkingDocumentRes = responseData[0]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCheckingDocument(null)
            }
        })
        const checkingDocuments = checkingDocumentRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.title}`
            }
        })
        setListCheckingDocument(checkingDocuments)
    }

    const handleCloseModal = () => {
        handleEditModal()
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

    const handleChangeFile = (event) => {
        const file = event.target.files[0]
        setFile(file)
    }
    
    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('description', data.description)
        formData.append('checkingDocumentId', data.checkingDocument.value)
        editCheckingDocumentVersion(dataEdit?.id, formData).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật kiểm tra tài liệu thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật kiểm tra tài liệu thất bại",
                    text: "Vui lòng thử lại sau!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger"
                    }
                })
            }
            getData()
            handleCloseModal()
        }).catch(error => {
            console.log(error)
        })
    }
    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật tài liệu</h1>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    
                    <Col xs={12}>
                        <Label className='form-label' for='checkingDocument'>
                            Kiểm tra tài liệu
                        </Label>
                        <Controller
                            defaultValue={{value: dataEdit?.checkingDocument?.id, label: dataEdit?.checkingDocument?.title}}
                            name='checkingDocument'
                            control={control}
                            render={({ field }) => (
                                <Select {...field} id='checkingDocument' placeholder='Chọn kiểm tra tài liệu' invalid={errors.checkingDocument && true} options={listCheckingDocument} />
                            )}
                        />
                        {errors.checkingDocument && <FormFeedback>{errors.checkingDocument.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.description}
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.name}
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='file' type="file" placeholder='Chọn tài liệu' invalid={errors.file && true} onChange={handleChangeFile} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            Cập nhật
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

export default EditCheckingDocumentVersion