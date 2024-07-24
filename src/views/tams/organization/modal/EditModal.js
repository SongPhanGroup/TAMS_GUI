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
import { editOrganization, getOrganization } from "../../../../api/organization"
import { useEffect, useState } from "react"

const EditOrganization = ({ open, handleEditModal, dataEdit, getData }) => {
    // ** States
    const EditOrganizationSchema = yup.object().shape({
        name: yup.string().required("Đây là trường bắt buộc")
    })

    // ** Hooks
    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(EditOrganizationSchema)
    })

    const handleCloseModal = () => {
        handleEditModal()
    }

    const [listOrganization, setListOrganization] = useState([])

    const getAllDataPromises = async () => {
        const organizationPromise = getOrganization({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [organizationPromise]
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
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListOrganization(null)
            }
        })
        const organizations = organizationRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListOrganization(organizations)
    }

    useEffect(() => {
        if (open) {
            getAllDataPromises()
        }
    }, [open])
    
    const onSubmit = data => {
        editOrganization(dataEdit?.id, {
            name: data.name,
            key: data.key,
            description: data.description
        }).then(result => {
            if (result.status === 'success') {
                Swal.fire({
                    title: "Cập nhật đơn vị thành công",
                    text: "Yêu cầu đã được phê duyệt!",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success"
                    }
                })
            } else {
                Swal.fire({
                    title: "Cập nhật đơn vị thất bại",
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
        <Modal isOpen={open} toggle={handleEditModal} className='modal-dialog-centered modal-md'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Cập nhật đơn vị</h1>
                </div>
                <Row tag='form' className='gy-1 pt-75' onSubmit={handleSubmit(onSubmit)}>
                    <Col xs={12}>
                        <Label className='form-label' for='name'>
                            Tên đơn vị <span style={{color: 'red'}}>(*)</span>
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
                                        placeholder='Nhập tên đơn vị'
                                        invalid={errors.name && true}
                                    />
                                )
                            }}
                        />
                        {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                    </Col>
                    <Col xs={12}>
                        <Label className='form-label' for='parentId'>
                            Đơn vị cấp trên
                        </Label>
                        <Controller
                            defaultValue={{value: dataEdit?.parent?.id, label: dataEdit?.parent?.name}}
                            control={control}
                            name='parentId'
                            render={({ field }) => {
                                return (
                                    <Select {...field} name='parentId' placeholder='Chọn đơn vị cấp trên' invalid={errors.course && true} options={listOrganization} value={field.value} onChange={selectedOption => field.onChange(selectedOption)} />
                                )
                            }}
                        />
                        {errors.parentId && <FormFeedback>{errors.parentId.message}</FormFeedback>}
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

export default EditOrganization