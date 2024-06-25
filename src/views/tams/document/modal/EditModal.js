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
import { editDocument } from "../../../../api/document"

const EditDocument = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const EditDocumentSchema = yup.object().shape({
        title: yup.string().required("Đây là trường bắt buộc"),
        course: yup.string().required("Đây là trường bắt buộc"),
        description: yup.string().required("Đây là trường bắt buộc")
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
    
    const onSubmit = data => {
        editDocument(dataEdit?.id, {
            title: data.title,
            course: data.course,
            description: data.description
        }).then(result => {
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
                                <Input {...field} id='course' placeholder='NHập khóa học' invalid={errors.course && true} />
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

export default EditDocument