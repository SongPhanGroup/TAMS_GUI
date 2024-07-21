// ** React Imports
import { useEffect, useState } from "react"
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
    Button,
    Form
} from "reactstrap"

// ** Third Party Components
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { postCheckingDocumentVersion } from "../../../../api/checking_document_version"
import { getCheckingDocument } from "../../../../api/checking_document"

const AddNewCheckingDocumentVersion = ({ open, handleAddModalVersion, getData }) => {
    const AddNewCheckingDocumentVersionSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu nhập file"),
        description: yup.string().required("Yêu cầu nhập mô tả")
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(AddNewCheckingDocumentVersionSchema)
    })

    // ** State
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

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

    const handleCloseModal = () => {
        handleAddModalVersion()
        reset()
    }

    const handleChangeFile = (event) => {
        const file = event.target.files[0]
        setFile(file)
    }

    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('description', data.description)
        formData.append('checkingDocumentId', data.checkingDocument.value)
        postCheckingDocumentVersion(formData).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Thêm mới kiểm tra tài liệu thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Thêm mới kiểm tra tài liệu thất bại",
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
        <Modal isOpen={open} toggle={handleAddModalVersion} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm mới tài liệu</h1>
                    <p>Danh sách tài liệu</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='checkingDocument'>
                            Kiểm tra tài liệu
                        </Label>
                        <Controller
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
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
                            )}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu
                        </Label>
                        <Controller
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='file' type='file' placeholder='Chọn tài liệu' invalid={errors.file && true} onChange={(event) => {
                                    handleChangeFile(event)
                                    field.onChange(event)
                                }} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name='add' className='me-1' color='primary'>
                            Thêm
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

export default AddNewCheckingDocumentVersion