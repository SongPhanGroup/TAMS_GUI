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
import { getOrganization } from "../../../../api/organization"
import { getRole } from "../../../../api/role"
import { postUser } from "../../../../api/user"

const AddNewUser = ({ open, handleAddModal, getData }) => {
    // ** States
    const AddNewUserSchema = yup.object().shape({
        fullName: yup.string().required("Yêu cầu nhập tên người dùng"),
        username: yup.string().required("Yêu cầu nhập tên đăng nhập"),
        password: yup.string().required("Yêu cầu nhập mật khẩu"),
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
        resolver: yupResolver(AddNewUserSchema)
    })

    // ** State
    const [listOrganization, setListOrganization] = useState([])
    const [listRole, setListRole] = useState([])

    const getAllDataPromises = async () => {
        const organizationPromise = getOrganization({ params: { page: 1, perPage: 10, search: '' } })
        const rolePromise = getRole({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [organizationPromise, rolePromise]
        const results = await Promise.allSettled(promises)
        const responseData = promises.reduce((acc, promise, index) => {
            if (results[index].status === 'fulfilled') {
                acc[index] = results[index].value
            } else {
                acc[index] = { error: results[index].reason }
            }
            return acc
        }, [])

        const organizationRes = responseData[0]
        const roleRes = responseData[1]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListOrganization(null)
                setListRole(null)
            }
        })
        const organizations = organizationRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const roles = roleRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListOrganization(organizations)
        setListRole(roles)
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

    const onSubmit = (data) => {
        // Lấy nút submit đã được nhấn
        postUser({
            fullName: data.fullName,
            description: data.description,
            organizationId: data.organizationId.value,
            roleId: data.roleId.value,
            userName: data.username,
            password: data.password
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Thêm mới người dùng thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật người dùng thất bại",
                    text: "Có lỗi xảy ra, vui lòng thử lại sau!",
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
        <Modal isOpen={open} toggle={handleAddModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Thêm mới người dùng</h1>
                    <p>Danh sách người dùng</p>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='fullName'>
                            Tên người dùng
                        </Label>
                        <Controller
                            control={control}
                            name='fullName'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='fullName'
                                        placeholder='Nhập tên người dùng'
                                        invalid={errors.fullName && true}
                                    />
                                )
                            }}
                        />
                        {errors.fullName && <FormFeedback>{errors.fullName.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='username'>
                            Tên đăng nhập
                        </Label>
                        <Controller
                            control={control}
                            name='username'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='username'
                                        placeholder='Nhập tên đăng nhập'
                                        invalid={errors.username && true}
                                    />
                                )
                            }}
                        />
                        {errors.username && <FormFeedback>{errors.username.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='password'>
                            Mật khẩu
                        </Label>
                        <Controller
                            control={control}
                            name='password'
                            render={({ field }) => {
                                return (
                                    <Input
                                        {...field}
                                        id='password'
                                        placeholder='Nhập mật khẩu'
                                        invalid={errors.password && true}
                                    />
                                )
                            }}
                        />
                        {errors.password && <FormFeedback>{errors.password.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='organizationId'>
                            Đơn vị
                        </Label>
                        <Controller
                            control={control}
                            name='organizationId'
                            render={({ field }) => {
                                return (
                                    <Select {...field} name='organizationId' placeholder='Chọn đơn vị' invalid={errors.course && true} options={listOrganization} value={field.value} onChange={selectedOption => field.onChange(selectedOption)} />
                                )
                            }}
                        />
                        {errors.organizationId && <FormFeedback>{errors.organizationId.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='roleId'>
                            Vai trò
                        </Label>
                        <Controller
                            control={control}
                            name='roleId'
                            render={({ field }) => {
                                return (
                                    <Select {...field} name='roleId' placeholder='Chọn vai trò' invalid={errors.course && true} options={listRole} value={field.value} onChange={selectedOption => field.onChange(selectedOption)} />
                                )
                            }}
                        />
                        {errors.roleId && <FormFeedback>{errors.roleId.message}</FormFeedback>}
                    </Col>
                    <Col sm={6} xs={12}>
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
                    <Col xs={12} className='text-center mt-2 pt-50'>
                        <Button type='submit' name="add" className='me-1' color='primary'>
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

export default AddNewUser