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
import Flatpickr from "react-flatpickr"

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import Swal from 'sweetalert2'
import { convertDateString, toDateStringv2 } from "../../../../utility/Utils"
import { editCourse } from "../../../../api/course"
import { useState } from "react"
// import { editCourse } from "../../../../api/course"

const EditCourse = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const EditCourseSchema = yup.object().shape({
        name: yup.string().required("Đây là trường bắt buộc")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditCourseSchema)
    })

    const [picker, setPicker] = useState(new Date(dataEdit.date))

    const handleCloseModal = () => {
        handleEditModal()
    }

    const handleChangeDate = (date) => {
        setPicker(date[0])
        console.log(date)
    }

    const onSubmit = data => {
        editCourse(dataEdit?.id, {
            date: toDateStringv2(picker),
            name: data.name,
            description: data.description
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật tài liệu thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật tài liệu thất bại",
                    text: "Có lỗi xảy ra, vui lòng thử lại sau",
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
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật đợt kiểm tra</h1>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên đợt kiểm tra <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.name ?? ''}
                            control={control}
                            name='name'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='name'
                                        placeholder='Nhập tên đợt kiểm tra'
                                        invalid={errors.name && true}
                                    />
                                )
                            }}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='date'>
                            Thời gian <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            control={control}
                            name='date'
                            render={() => {
                                return (
                                    <Flatpickr
                                        className="form-control invoice-edit-input date-picker"
                                        options={{
                                            dateFormat: "d-m-Y", // format ngày giờ
                                            locale: {
                                                ...Vietnamese
                                            }
                                        }}
                                        placeholder="dd/mm/yyyy"
                                        onChange={handleChangeDate}
                                        defaultValue={convertDateString(dataEdit.date).toUTCString()}
                                    />

                                )
                            }}
                        />
                        {errors.date && <FormFeedback>{errors.date.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
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

export default EditCourse