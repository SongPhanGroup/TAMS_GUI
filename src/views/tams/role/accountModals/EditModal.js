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
import { editUser } from "../../../../api/user"
import { useEffect, useState } from "react"
import { getOrganization } from "../../../../api/organization"
import { getRole } from "../../../../api/role"

const EditUser = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const EditUserSchema = yup.object().shape({
        fullName: yup.string().required("Đây là trường bắt buộc"),
        username: yup.string().required("Đây là trường bắt buộc"),
        password: yup.string().required("Đây là trường bắt buộc")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditUserSchema)
    })

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
        handleEditModal()
    }

    const onSubmit = data => {
        editUser(dataEdit?.id, {
            fullName: data.fullName,
            organizationId: data.organizationId.value,
            roleId: data.roleId.value,
            description: data.description,
            userName: data.username,
            password: data.password
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật người dùng thành công",
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
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật người dùng</h1>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col sm={6} xs={12}>
                        <Label className='form-label' for='fullName'>
                            Tên người dùng <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.fullName ?? ''}
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
                            Tên đăng nhập <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.userName ?? ''}
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
                            Mật khẩu <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={dataEdit?.password ?? ''}
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
                            Đơn vị <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={{ value: dataEdit?.organization?.id, label: dataEdit?.organization?.name }}
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
                            Vai trò <span style={{ color: 'red' }}>(*)</span>
                        </Label>
                        <Controller
                            defaultValue={{ value: dataEdit?.role?.id, label: dataEdit?.role?.name }}
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

export default EditUser