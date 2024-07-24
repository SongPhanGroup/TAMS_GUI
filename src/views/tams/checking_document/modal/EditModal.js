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
import { detailCheckingDocument, editCheckingDocument } from "../../../../api/checking_document"
import { getCourse } from "../../../../api/course"
import classNames from "classnames"

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
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        author: yup.string().required("Yêu cầu nhập tác giả"),
        course: yup.object().required("Yêu cầu nhập đợt kiểm tra").nullable()
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

    const [listCourse, setListCourse] = useState([])

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [coursePromise]
        const results = await Promise.allSettled(promises)
        const responseData = promises.reduce((acc, promise, index) => {
            if (results[index].status === 'fulfilled') {
                acc[index] = results[index].value
            } else {
                acc[index] = { error: results[index].reason }
            }
            return acc
        }, [])

        const courseRes = responseData[0]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCourse(null)
            }
        })
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListCourse(courses)
    }

    const handleCloseModal = () => {
        handleEditModal()
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

    const onSubmit = (data) => {
        editCheckingDocument(dataEdit?.id, {
            title: data.title,
            author: data.author,
            courseId: data.course.value,
            description: data.description
        }).then(result => {
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
                        <Label className='form-label' for='title'>
                            Tiêu đề <span style={{color: 'red'}}>(*)</span>
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
                            Đợt kiểm tra <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            id='react-select'
                            defaultValue={{ value: dataEdit?.course?.id, label: dataEdit?.course?.name }}
                            name='course'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    placeholder="Chọn đợt kiểm tra"
                                    classNamePrefix='select'
                                    name='clear'
                                    options={listCourse}
                                    isClearable
                                    className={classNames('react-select', { 'is-invalid': errors.course && true })}
                                    {...field}
                                />)}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='author'>
                            Tác giả <span style={{color: 'red'}}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.author}
                            name='author'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='author' placeholder='Nhập mô tả' invalid={errors.author && true} />
                            )}
                        />
                        {errors.author && <FormFeedback>{errors.author.message}</FormFeedback>}
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
                    {/* <Col xs={12}>
                        <Label className='form-label' for='file'>
                            Tài liệu
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.name}
                            name='file'
                            control={control}
                            render={({ field }) => (
                                <Input  {...field} id='file' placeholder='Chọn tài liệu' invalid={errors.file && true} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col> */}
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

export default EditCheckingDocument