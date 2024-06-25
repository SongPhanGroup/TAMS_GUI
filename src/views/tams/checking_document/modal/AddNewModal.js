// ** React Imports
import { useState, useRef } from "react"
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
import { postCheckingDocument } from "../../../../api/checking_document"
import { extractingFromFileUpload } from "../../../../api/checking_sentence"

const AddNewCheckingDocument = ({ open, handleAddModal, getData }) => {
    const AddNewCheckingDocumentSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu chọn file"),
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        course: yup.string().required("Yêu cầu nhập khóa học"),
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
        resolver: yupResolver(AddNewCheckingDocumentSchema)
    })

    // ** State
    const [file, setFile] = useState()
    const formRef = useRef()

    const handleCloseModal = () => {
        handleAddModal()
        reset()
    }

    const handleChangeFile = (event) => {
        setFile(event.target.files[0])
    }

    const onSubmit = (data, event) => {
        // Lấy nút submit đã được nhấn
        const submitter = event.nativeEvent.submitter
        const action = submitter.getAttribute('name')
        const formData = new FormData()
        formData.append("file", file)
        formData.append("description", data.description)
        formData.append("title", data.title)
        formData.append("course", data.course)
        if (action === 'add') {
            postCheckingDocument(formData).then(result => {
                if (!result.errors) {
                    Swal.fire({
                        title: "Thêm mới tài liệu thành công",
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
            })
        } else {
            extractingFromFileUpload(formData).then(result => {
                if (!result.errors) {
                    Swal.fire({
                        title: "Tách câu thành công",
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
            })
        }
    }

    return (
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm mới tài liệu</h1>
                    <p>Danh sách tài liệu</p>
                </div>
                <Form ref={formRef} tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='title'>
                            Tiêu đề
                        </Label>
                        <Controller
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
                    <Col xs={12}>
                        <Label className='form-label' for='course'>
                            Khóa học
                        </Label>
                        <Controller
                            name='course'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='course' placeholder='Nhập khóa học' invalid={errors.course && true} />
                            )}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
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
                                <Input {...field} id='file' type='file' placeholder='Chọn tài liệu' invalid={errors.file && true} onChange={handleChangeFile} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name='add' className='me-1' color='primary'>
                            Thêm
                        </Button>
                        <Button type='submit' name='extract' className='me-1' color='success'>
                            Tách câu
                        </Button>
                        <Button type='reset' color='secondary' outline onClick={handleCloseModal}>
                            Hủy
                        </Button>
                    </Col>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default AddNewCheckingDocument