// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Label,
    Input,
    Table,
    Modal,
    Button,
    CardBody,
    ModalBody,
    ModalHeader,
    ModalFooter,
    FormFeedback,
    UncontrolledTooltip,
    FormText
} from 'reactstrap'

// ** Third Party Components
import { Info } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
// ** Custom Components
import AvatarGroup from '@components/avatar-group'
import style from '../../../assets/scss/index.module.scss'
import { getPermission } from '../../../api/permission'
// ** API
import { getRole, editRole } from '../../../api/role'
// ** Vars
const RoleCards = ({ reload }) => {
    const dispatch = useDispatch()
    const MySwal = withReactContent(Swal)
    // ** States
    const [show, setShow] = useState(false)
    const [dataRole, setDataRole] = useState()
    const [roleSelected, setRoleSelected] = useState()
    const [modalType, setModalType] = useState('Edit')
    const [listPermissionSelected, setListPermissionSelected] = useState([])
    const [listAllPermissions, setListAllPermissions] = useState()
    const [listRoles, setListRoles] = useState([])
    // ** Hooks
    const {
        reset,
        control,
        setError,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({ defaultValues: { roleName: '' } })
    const getDataPermission = () => {
        getPermission({
            page: 1,
            perPage: 100
        }).then(res => {
            setListAllPermissions(res?.data)
        }).catch(err => {
            console.log(err)
        })
    }
    const getDataRole = () => {
        getRole({
            page: 1,
            perPage: 100
        }).then(res => {
            setListRoles(res?.data)
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        getDataPermission()
    }, [])
    // ** Life Cycle
    const setListRole = () => {
        getRole({
            page: 1,
            perPage: 100
        })
            .then(res => {
                if (res) {
                    const data = (res.data)?.map((role, index) => {
                        return {
                            id: role.id,
                            name: role.name,
                            totalUsers: role.totalUsers ?? 1,
                            title: role.name,
                            permission: role.tenChucnang ? JSON.parse(role.tenChucnang) : [],
                            users: [
                                {
                                    size: 'sm',
                                    title: 'Nguyễn Quốc Khánh',
                                    img: require('@src/assets/images/avatars/4.png').default
                                },
                                {
                                    size: 'sm',
                                    title: 'Nguyễn Quốc Đại',
                                    img: require('@src/assets/images/avatars/3.png').default
                                }
                            ]
                        }
                    })
                    setDataRole(data)
                    setShow(false)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        setListRole()
    }, [reload])

    // ** Handle events
    const onSubmit = () => {
        if (modalType === "Add") {
            return MySwal.fire({
                title: 'Thêm mới thành công',
                text: "Yêu cầu đã được phê duyệt!",
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-success'
                }
            }).then(function (result) {
                if (result.value) {
                    setShow(false)
                }
            })
        } else if (modalType === "Edit") {
            return MySwal.fire({
                title: 'Bạn có chắc chắn thiết lập các quyền này không?',
                text: "Kiểm tra kỹ trước khi thiết lập!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tiếp tục',
                cancelButtonText: 'Hủy',
                customClass: {
                    confirmButton: `btn btn-primary ${style.customBtn}`,
                    cancelButton: 'btn btn-outline-danger ml-1'
                },
                buttonsStyling: false
            }).then(async function (result) {
                if (result.value) {
                    const dataSubmit = {
                        roleId: roleSelected.id,
                        permission: JSON.stringify(listPermissionSelected)
                    }
                    // updateRole(dataSubmit).then((res) => {

                    // }).catch(err => {
                    //     console.log(err)
                    // })
                    const res = await editRole(dataSubmit)
                    if (res) {
                        MySwal.fire({
                            icon: 'success',
                            title: 'Thiết lập thành công!',
                            text: 'Yêu cầu thiết lập đã được cập nhật!',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        }).then(function (result) {
                            if (result.value) {
                                setListRole()
                            }
                        })
                    } else {
                        MySwal.fire({
                            icon: 'error',
                            title: 'Thiết lập thất bại!',
                            text: 'Yêu cầu thiết lập chưa được cập nhật!',
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        }).then(function (result) {
                            if (result.value) {
                                setShow(false)
                            }
                        })
                    }
                }
            })
        }
    }

    const onReset = () => {
        setShow(false)
        // reset({ roleName: '' })
    }

    const handleModalClosed = () => {
        setModalType('Edit')
        // setValue('roleName')
    }

    const _handleSelectAll = (e) => {
        let listPermitFormat = []
        if (e.target.checked) {
            listRoles.map(item => {
                listPermitFormat = listPermitFormat.concat(item.actions)
            })
        }
        setListPermissionSelected(listPermitFormat)
    }

    const _handleChangeLimitCheck = (e, act) => {
        const newData = [...listPermissionSelected]
        const index = newData.findIndex((item) => item.id === act.id)
        setListPermissionSelected([...newData])
    }

    const _handleCheckRoleAction = (e, act) => {
        if (e.target.checked) {
            setListPermissionSelected([
                ...listPermissionSelected,
                act
            ])
        } else {
            setListPermissionSelected(listPermissionSelected.filter(per => per.id !== act.id))
        }
    }

    const _renderRoleItem = (act, ind) => {
        const permissionData = listPermissionSelected?.find(lstPer => lstPer.id === act.id)
        return (
            <div className='form-check me-2' key={ind} style={{ minWidth: "6rem" }}>
                <Input type='checkbox' style={{ cursor: "pointer" }} className="action-cb" id={`${act.id}`}
                    checked={permissionData || false}
                    onChange={(e) => _handleCheckRoleAction(e, act)}
                />
                <Label className='form-check-label' style={{ cursor: "pointer", fontSize: "0.875rem" }} for={`${act.id}`} >
                    {act.desc}
                </Label>
            </div>
        )
    }

    return (
        <Fragment>
            <Row>
                {
                    dataRole?.map((role, index) => {
                        if (role.title !== 'ADMIN') {
                            return (
                                <Col key={index} xl={3} md={3} sm={6}>
                                    <Card style={{ marginBottom: "1rem", backgroundColor: 'white' }}>
                                        <CardBody style={{ padding: "1rem" }}>
                                            <div className='d-flex justify-content-between'>
                                                <span>{`Tổng cộng: ${role.totalUsers} nhân sự`}</span>
                                                <AvatarGroup data={role.users} />
                                            </div>
                                            <div className='d-flex justify-content-between align-items-end pt-25'>
                                                <div className='role-heading'>
                                                    <h4 className='fw-bolder'>{role.title}</h4>
                                                    <Link
                                                        to='/'
                                                        className='role-edit-modal'
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            setRoleSelected(role)
                                                            setListPermissionSelected(role.permission)
                                                            setModalType('Edit')
                                                            setShow(true)
                                                        }}>
                                                        <small className='fw-bolder'>Chỉnh sửa</small>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </Col>

                            )
                        }
                    })
                }
            </Row>
            <Modal
                isOpen={show}
                onClosed={handleModalClosed}
                toggle={() => setShow(!show)}
                className='modal-dialog-centered modal-lg'
            >
                <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
                    <h5 style={{ width: "100%" }}><h3 style={{ textAlign: "center", color: "#09a863" }}>{modalType === "Add" && "Thêm mới"} {modalType === "Edit" && "Chỉnh sửa"} quyền cho nhóm {roleSelected?.title}</h3>
                        {/* <p style={{ textAlign: "center" }}>Thiết lập cấp quyền cho nhóm {roleSelected?.title}</p> */}
                    </h5>
                </ModalHeader>
                <ModalBody className='px-3 pb-3' style={{ height: "480px", overflowY: "scroll" }}>
                    <Row tag='form'>
                        {
                            modalType === "Add" &&
                            <Col xs={12}>
                                <Label className='form-label' for='roleName'>
                                    Vai trò
                                </Label>
                                <Controller
                                    name='roleName'
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} id='roleName' placeholder='Enter role name' invalid={errors.roleName && true} />
                                    )}
                                />
                                {errors.roleName && <FormFeedback>Điền đúng thông tin vai trò</FormFeedback>}
                            </Col>
                        }
                        <Col xs={12}>
                            {/* <h4 className=''>Các quyền cho nhóm quản trị hệ thống</h4> */}
                            <Table className='table-flush-spacing' responsive>
                                <tbody>
                                    {/* <tr>
                                        <td className='text-nowrap fw-bolder'>
                                            <span className='me-50'>Quản trị hệ thống</span>
                                            <Info size={14} id='info-tooltip' />
                                            <UncontrolledTooltip placement='top' target='info-tooltip'>
                                                Cho phép truy cập tất cả
                                            </UncontrolledTooltip>
                                        </td>
                                        <td>
                                            <div className='form-check'>
                                                <Input type='checkbox' id='select-all' style={{ cursor: "pointer" }}
                                                    onChange={(e) => _handleSelectAll(e)}
                                                />
                                                <Label className='form-check-label' for='select-all' style={{ cursor: "pointer", fontSize: "0.875rem" }}>
                                                    Chọn tất cả
                                                </Label>
                                            </div>
                                        </td>
                                    </tr> */}
                                    {listRoles.map((role, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='text-nowrap fw-bolder'>{role.roleName}</td>
                                                <td>
                                                    <div className='d-flex' style={{ flexWrap: "wrap" }}>
                                                        {
                                                            role.actions && role.actions.length && role.actions.map((act, ind) => {
                                                                return _renderRoleItem(act, ind)
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter style={{ justifyContent: 'flex-start', padding: '3rem' }}>
                    <Button type='submit' color='primary' className='me-1' onClick={onSubmit}>
                        {modalType === "Add" ? "Thêm mới" : "Lưu thiết lập"}
                    </Button>
                    <Button type='reset' className="mr-2" outline onClick={onReset}>
                        Hủy
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    )
}

export default RoleCards
