// ** React Imports
import { useEffect, useState } from 'react'
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
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup'
import classnames from 'classnames'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { useRef } from 'react'
import Swal from 'sweetalert2'

const EditCheckingSentence = ({ open, handleEditModal, getData }) => {
    // ** States
    const EditCheckingSentenceSchema = yup.object().shape({
        file: yup.string().required("Bắt buộc"),
        title: yup.string().required("Đây là trường bắt buộc"),
        course: yup.object().required("Đây là trường bắt buộc"),
        description: yup.object().required("Đây là trường bắt buộc")
    })

    // ** Hooks
    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCheckingSentenceSchema)
    })

    const handleCloseModal = () => {
        handleEditModal()
    }

    const [listEquipmentUnit, setListEquipmentUnit] = useState([])
    const [listEquipmentType, setListEquipmentType] = useState([])
    const [listOrganization, setListOrganization] = useState([])
    
    const onSubmit = data => {
        addEquipment({
            code: data.code,
            name: data.name,
            equipment_UnitId: data.equipment_UnitId.value,
            equipment_TypeId: data.equipment_TypeId.value,
            organization_Id: data.organization_Id.value,
            quality: data.quality,
            yearUse: data.yearUse
        }).then(result => {
            if (!result.error) {
                Swal.fire({
                    title: "Thêm mới tài liệu thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    }
                }).then((result) => {
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
            <ModalHeader className='bg-transparent' toggle={handleEditModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật tài liệu</h1>
                    <p>Danh sách tài liệu</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col md={6} xs={12}>
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
                                        placeholder='John'
                                        invalid={errors.title && true}
                                    />
                                )
                            }}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='course'>
                            Khóa học
                        </Label>
                        <Controller
                            name='course'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='course' placeholder='Doe' invalid={errors.course && true} />
                            )}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='description'>
                            Mô tả
                        </Label>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='description' placeholder='Doe' invalid={errors.description && true} />
                            )}
                        />
                        {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                    </Col>
                    <Col md={6} xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu
                        </Label>
                        <Controller
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='file' type='file' placeholder='Doe' invalid={errors.file && true} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' className='me-1' color='primary'>
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

export default EditCheckingSentence