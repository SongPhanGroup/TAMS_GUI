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

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { extractingFromDoc } from "../../../../api/checking_sentence"
import { useEffect, useState } from "react"
import { detailCheckingDocument } from "../../../../api/checking_document"

const EditCheckingDocument = ({ open, handleEditModal, dataEdit, getData }) => {
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

    const EditCheckingDocumentSchema = yup.object().shape({
        title: yup.string().typeError("Đây là trường bắt buộc"),
        course: yup.string().typeError("Đây là trường bắt buộc"),
        description: yup.string().typeError("Đây là trường bắt buộc")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCheckingDocumentSchema)
    })

    const handleCloseModal = () => {
        handleEditModal()
    }
    
    const onSubmit = () => {
        extractingFromDoc(dataEdit?.id).then(result => {
            if (!result.error) {
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
    return (
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật tài liệu</h1>
                    <p>Danh sách tài liệu</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='title'>
                            Tiêu đề
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.title}
                            control={control}
                            name='title'
                            render={({ field }) => {
                                return (
                                    <Input
                                        disabled
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
                            defaultValue={dataEdit?.course}
                            name='course'
                            control={control}
                            render={({ field }) => (
                                <Input disabled {...field} id='course' placeholder='Nhập khóa học' invalid={errors.course && true} />
                            )}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
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
                                <Input disabled {...field} id='description' placeholder='Nhập mô tả' invalid={errors.description && true} />
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
                                <Input disabled {...field} id='file' placeholder='Chọn tài liệu' invalid={errors.file && true} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
                            Tách câu
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

export default EditCheckingDocument