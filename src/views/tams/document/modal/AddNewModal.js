// ** React Imports
import { useState, useEffect } from "react"
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

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import Swal from 'sweetalert2'
import { postDocument } from "../../../../api/document"
import { extractingFromFileUpload } from "../../../../api/sentence_doc"
import { getCourse } from "../../../../api/course"
import { Loader } from "react-feather"
import { getMajor } from "../../../../api/major"
import { getTypeChecking } from "../../../../api/type_checking"

const AddNewDocument = ({ open, handleAddModal, getData }) => {
    // ** States
    const AddNewDocumentSchema = yup.object().shape({
        file: yup.mixed().required("Yêu cầu chọn file"),
        title: yup.string().required("Yêu cầu nhập tiêu đề"),
        course: yup.object().required("Yêu cầu nhập khóa học"),
        author: yup.string().required("Yêu cầu nhập tác giả"),
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
        resolver: yupResolver(AddNewDocumentSchema)
    })

    // ** State
    const [file, setFile] = useState()
    const [listCourse, setListCourse] = useState([])
    const [loadingAdd, setLoadingAdd] = useState(false)
    const [loadingExtract, setLoadingExtract] = useState(false)

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })
        const majorPromise = getMajor({ params: { page: 1, perPage: 10, search: '' } })
        const typeCheckingPromise = getTypeChecking({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [coursePromise, majorPromise, typeCheckingPromise]
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

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])

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
        formData.append("courseId", data.course.value)
        formData.append("author", data.author)
        if (action === "add") {
            setLoadingAdd(true)
            postDocument(formData).then(result => {
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
            }).finally(() => {
                setLoadingAdd(false)
            })
        } else {
            setLoadingExtract(true)
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
            }).finally(() => {
                setLoadingExtract(false)
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
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
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
                                <Select {...field} id='course' placeholder='Chọn khóa học' invalid={errors.course && true} options={listCourse} />
                            )}
                        />
                        {errors.course && <FormFeedback>{errors.course.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='author'>
                            Tác giả
                        </Label>
                        <Controller
                            name='author'
                            control={control}
                            render={({ field }) => (
                                <Input {...field} id='author' placeholder='Nhập tác giả' invalid={errors.author && true} />
                            )}
                        />
                        {errors.author && <FormFeedback>{errors.author.message}</FormFeedback>}
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
                                <Input id='file' type='file' placeholder='Chọn tài liệu' invalid={errors.file && true} onChange={(event) => {
                                    handleChangeFile(event)
                                    field.onChange(event)
                                }} />
                            )}
                        />
                        {errors.file && <FormFeedback>{errors.file.message}</FormFeedback>}
                    </Col>  
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name="add" className='me-1' color='primary'>
                            {
                                loadingAdd === true ? <Loader color="#fff" size="16px" /> : 'Thêm'
                            }
                        </Button>
                        <Button type='submit' name="extract" className='me-1' color='success'>
                            {
                                loadingExtract === true ? <Loader color="#fff" size="16px" /> : 'Tách câu'
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

export default AddNewDocument