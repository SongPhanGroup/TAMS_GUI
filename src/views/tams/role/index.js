import React, { useState, Fragment, useEffect, useRef, useContext, forwardRef } from "react"
import {
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Button,
  Row,
  Col,
  FormFeedback,
  UncontrolledTooltip,
  CardBody,
  Table,
  Input,
  Card,
  CardTitle,
  Badge,
  Switch,
  Collapse,
  CardHeader,
  Popover,
  PopoverBody,
  PopoverHeader
} from "reactstrap"
import { Link } from "react-router-dom"
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Trash, Edit, Search, Divide, Command, MinusCircle, Lock, X } from 'react-feather'
import WaitingModal from '../../../views/ui-elements/waiting-modals'

import { AbilityContext } from '@src/utility/context/Can'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString } from '../../../utility/Utils'
import AvatarGroup from "@components/avatar-group"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import {
  getRole,
  deleteRole,
  listAllRoleUserCount
} from "../../../api/role"
import {
  listAllUser,
  getListUserByRole
} from "../../../api/user"
import {
  getPerByRoleId,
  getAllRolePer,
  updateRoleManyPer
} from "../../../api/role_permission"
import { getPermission } from "../../../api/permission"
import ListPermission from './detail'
import PermissModal from './modal/PermissModal'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import dayjs from "dayjs"
// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className='form-check'>
    <Input type='checkbox' ref={ref} {...props} />
  </div>
))
const customStyles = {
  rows: {
    style: {
      minHeight: '50px',
      alignItems: 'center' // chiều cao tối thiểu của hàng
    }
  }
}
const ListRoles = () => {
  const ability = useContext(AbilityContext)
  const selected = useRef()
  const MySwal = withReactContent(Swal)
  const [data, setData] = useState([])
  const [count, setCount] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(100)
  const [search, setSearch] = useState("")
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isPer, setIsPer] = useState(false)
  const [isView, setIsView] = useState(false)
  const [listPerGroup, setListPerGroup] = useState([])
  const [permissionView, setPermissionView] = useState([])
  const [listAllPer, setListAllPer] = useState([])
  const [listPermissionSelected, setListPermissionSelected] = useState([])
  const [roleSelected, setRoleSelected] = useState()
  const [listAllRole, setListAllRole] = useState([])
  const [loading, setLoading] = useState(true)

  const getData = (page, limit, search) => {
    getRole({
      params: {
        page,
        pageSize: limit,
        ...(search && search !== "" && { search })
      }
    })
      .then((res) => {
        setData(res?.data)
        setCount(res?.pagination?.totalRecords)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const getInfo = () => {
    getAllRolePer({
      params: {
        page: 1,
        limit: 5000
      }
    })
      .then((res) => {
        // const { count, data } = res[0]
        setListPermissionSelected([])
      })
      .catch((err) => {
        console.log(err)
      })

    getPermission({
      params: {
        page: 1,
        pageSize: 500
      }
    })
      .then((res) => {
        setListAllPer(res?.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getInfo()
    getData(currentPage, rowsPerPage, search)
    getRole({
      params: {
        page: 1,
        pageSize: 100
      }
    })
      .then(res => {
        if (res) {
          const data_ = res?.data?.map((role, index) => {
            return {
              id: role.id,
              name: role.name,
              totalUsers: role.userCount ?? 1,
              title: role.name,
              // permission: role.tenChucnang ? JSON.parse(role.tenChucnang) : [],
              users: [
                {
                  size: 'sm',
                  title: 'Nguyễn Quốc Khánh'
                  //img: require('@src/assets/images/avatars/4.png').default
                },
                {
                  size: 'sm',
                  title: 'Nguyễn Quốc Đại'
                  //img: require('@src/assets/images/avatars/3.png').default
                }
              ]
            }
          })
          setListAllRole(data_)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [currentPage, rowsPerPage, search, roleSelected])

  const handleModal = () => {
    setIsAdd(false)
    setIsEdit(false)
    setIsPer(false)
    setIsView(false)
    setRoleSelected(null)
  }
  const CloseBtn = (
    <X className="cursor-pointer" size={15} onClick={handleModal} />
  )
  const handleEdit = (record) => {
    setRoleSelected(record)
    setIsEdit(true)
  }
  const handleViewUser = (role) => {
    setRoleSelected(role)
    setIsView(true)
  }
  const handleDelete = (key) => {
    deleteRole(key)
      .then((res) => {
        MySwal.fire({
          title: "Xóa vai trò thành công",
          icon: "success",
          customClass: {
            confirmButton: "btn btn-success"
          }
        }).then((result) => {
          if (currentPage === 1) {
            getData(1, rowsPerPage)
          } else {
            setCurrentPage(1)
          }
          handleModal()
        })
      })
      .catch((error) => {
        MySwal.fire({
          title: "Xóa thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger"
          }
        })
        console.log(error)
      })
  }

  const _handleSelectAll = (e) => {
    let listPermitFormat = []
    if (e.target.checked) {
      rolesArr.map((item) => {
        listPermitFormat = listPermitFormat.concat(item.actions)
      })
    }
    setListPermissionSelected(listPermitFormat)
  }

  const _handleCheckRoleAction = (e, act, permission, role) => {
    setListPermissionSelected((pre) => {
      const isChecked = listPermissionSelected.find(
        (per) => per.permissionID === permission._id &&
          per.roleID === role?._id &&
          per.actionContent === act.value
      )
      if (isChecked) {
        if (act.value === 'read') {
          return listPermissionSelected.filter(
            (per) => !(per.permissionID === permission._id &&
              per.roleID === role?._id)
          )
        }
        return listPermissionSelected.filter(
          (per) => !(per.permissionID === permission._id &&
            per.roleID === role?._id &&
            per.actionContent === act.value)
        )
      } else {
        if (act.value !== 'read') {
          const isChecked_ = listPermissionSelected.find(
            (per) => per.permissionID === permission._id &&
              per.roleID === role?._id &&
              per.actionContent === 'read'
          )
          if (isChecked_) {
            return [
              ...pre,
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: act.value,
                isActive: 1
              }
            ]
          } else {
            return [
              ...pre,
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: 'read',
                isActive: 1
              },
              {
                permissionID: permission._id,
                roleID: role._id,
                actionContent: act.value,
                isActive: 1
              }
            ]
          }
        }
        return [
          ...pre,
          {
            permissionID: permission._id,
            roleID: role._id,
            actionContent: act.value,
            isActive: 1
          }
        ]
      }
    })
  }

  const _renderRoleItem = (act, ind, permission, role) => {
    const permissionData = listPermissionSelected?.find(
      (lstPer) => lstPer.permissionID === permission._id &&
        lstPer.actionContent === act.value &&
        lstPer.roleID === role?._id
    )


    return (
      <div className="form-check me-2" key={ind} style={{ minWidth: "6rem" }}>
        <Input
          type="checkbox"
          style={{ cursor: "pointer", marginRight: "1rem" }}
          className="action-cb"
          id={`${permission._id}_${act.id}`}
          checked={permissionData || false}
          onChange={(e) => _handleCheckRoleAction(e, act, permission, role)}
        />
        <Label
          className="form-check-label"
          style={{ cursor: "pointer", fontSize: "0.875rem" }}
          for={`${permission._id}_${act.id}`}
        >
          {act.label}
        </Label>
      </div>
    )
  }
  const handlePer = (role) => {
    setRoleSelected(role)
    setIsPer(true)
  }
  const handleDeleteRole = (data) => {
    return Swal.fire({
      title: '',
      text: 'Bạn có muốn xóa vai trò này không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        deleteRole(data).then(result => {
          if (result.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Xóa vai trò thành công!',
              text: 'Yêu cầu đã được phê duyệt',
              customClass: {
                confirmButton: 'btn btn-success'
              }
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Xóa vai trò thất bại!',
              text: 'Yêu cầu chưa được phê duyệt',
              customClass: {
                confirmButton: 'btn btn-danger'
              }
            })
          }
          getData(1, rowsPerPage)
        }).catch(error => {
          console.log(error)
        })
      } else {
        Swal.fire({
          title: 'Hủy bỏ!',
          text: 'Không xóa vai trò!',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

  const columns = [
    {
      name: "STT",
      dataIndex: "stt",
      width: '70px',
      center: true,
      cell: (record, index) => (
        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
      )
    },
    {
      name: "Ngày tạo",
      dataIndex: "createdAt",
      minWidth: "50px",
      center: true,
      cell: (record, index) => (
        <span>{dayjs(record.createdAt).format('HH:mm DD/MM/YYYY')}</span>
      )
    },
    {
      name: "Tên vai trò",
      dataIndex: "name",
      minWidth: "50px",
      selector: row => row.name
      // align: 'center'
      // width: 250,
    },
    {
      name: "Ghi chú",
      dataIndex: "description",
      align: 'center',
      minWidth: '100px',
      selector: row => row.description
    },
    {
      name: "Tác vụ",
      minWidth: "110px",
      center: true,
      cell: (record) => (
        <div className="column-action d-flex align-items-center">
          {ability.can('update', 'PHAN_QUYEN_VAI_TRO') &&
            <div id={`tooltip_edit_${record._id}`}>
              <Edit
                size={15}
                style={{ cursor: "pointer", stroke: '#09A863' }}

                onClick={(e) => handleEdit(record)}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_edit_${record._id}`}
              >
                Chỉnh sửa
              </UncontrolledTooltip>
            </div>}
          {ability.can('delete', 'PHAN_QUYEN_VAI_TRO') &&
            <div
              style={{ marginRight: '1rem', marginLeft: '1rem' }}
              onClick={() => handleDeleteRole(record.id)}
              id={`tooltip_delete_${record._id}`}
            >
              <Trash
                size={15}
                style={{ cursor: "pointer", stroke: "red" }}
              />
              <UncontrolledTooltip placement="top" target={`tooltip_delete_${record._id}`}>
                Xóa
              </UncontrolledTooltip>
            </div>
            // <Popconfirm
            //   title="Bạn chắc chắn xóa?"
            //   onConfirm={() => handleDelete(record._id)}
            //   cancelText="Hủy"
            //   okText="Đồng ý"
            // >
            //   <Trash
            //     style={{ color: "red", cursor: "pointer" }}
            //     id={`tooltip_delete_${record._id}`}
            //   />
            //   <UncontrolledTooltip placement="top" target={`tooltip_delete_${record._id}`}>
            //     Xóa
            //   </UncontrolledTooltip>
            // </Popconfirm>
          }
        </div>
      )
    }
  ]

  const handleUpDateManyPer = () => {
    const listSelected = listPermissionSelected.filter(x => x.roleID === roleSelected._id)
    const arr = listSelected.map((per, index) => {
      if (per.roleID === roleSelected._id) {
        return {
          permissionID: per.permissionID,
          actionContent: per.actionContent
        }
      }
    })
    const dataSubmit = {
      roleID: roleSelected?._id,
      isActive: 1,
      arrContent: arr,
      actionTime: "2023-09-13T04:08:14.369Z"
    }
    updateRoleManyPer(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Chỉnh sửa thành công",

          icon: "success",
          customClass: {
            confirmButton: "btn btn-success"
          }
        }).then((result) => {
          if (currentPage === 1) {
            getData(1, rowsPerPage)
          } else {
            setCurrentPage(1)
          }
          handleModal()
        })
      })
      .catch((err) => {
        MySwal.fire({
          title: "Chỉnh sửa thất bại",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger"
          }
        })
      })
  }
  const showTotal = (count) => `Tổng số: ${count}`
  // ** Function to handle Pagination
  const handlePagination = page => {
    setCurrentPage(page)
  }
  const handlePerRowsChange = (perPage, page) => {
    setCurrentPage(page)
    setRowsPerpage(perPage)
  }
  return (
    <Fragment>
      <Card
        style={{ backgroundColor: "white" }}
      >
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start'>
          <CardTitle tag='h4'>Phân quyền vai trò người dùng</CardTitle>
          <div className='d-flex mt-md-0 mt-1'>
            {ability.can('add', 'nguoidung') &&
              <Button className='ms-2' color='primary' onClick={() => setIsAdd(true)}>
                <Plus size={15} />
                <span className='align-middle ms-50'>Thêm mới</span>
              </Button>}
          </div>
        </CardHeader>
        <Row style={{ margin: "0" }}>
          <Col md="12">
            <Row>
              {listAllRole?.map((role, index) => {
                if (role._id !== "6500e98851b67437e9184da1") {
                  return (
                    <Col key={index} xl={3} md={3} sm={6}>
                      <Card
                        style={{
                          marginBottom: "1rem",
                          backgroundColor: "white",
                          padding: '0px'
                        }}
                        className="role-card"
                      >
                        <CardBody style={{ padding: "1rem", border: "1px solid #f0f0f0", borderRadius: '8px' }}>
                          <div className="d-flex justify-content-between">
                            <span>{`Tổng cộng: ${role.totalUsers} nhân sự`}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-end pt-25">
                            <div className="role-heading">
                              <h4 className="fw-bolder">{role.name}</h4>
                              <Link
                                to="/"
                                className="role-edit-modal"
                                onClick={(e) => {
                                  e.preventDefault()
                                  // handleViewUser(role)
                                }}
                              >
                                <p className="fw-bolder">Chi tiết</p>
                              </Link>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  )
                }
              })}
            </Row>
          </Col>
        </Row>
      </Card>
      <Card
        style={{ backgroundColor: "white" }}
      >
        <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
          <CardTitle tag='h4'>Danh sách vai trò người dùng</CardTitle>
        </CardHeader>
        <Row className='justify-content-end mx-0'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='12' sm='12' style={{ padding: '0 20px' }}>
            <div className='d-flex align-items-center'>
              <Label className='me-1' for='search-input' style={{ minWidth: '80px' }}>
                Tìm kiếm
              </Label>
              <Input
                className='dataTable-filter mb-50'
                type='text'
                bsSize='sm'
                id='search-input'
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSearchValue('')
                  }
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setSearchValue(e.target.value)
                    setCurrentPage(1)
                  }
                }}
              />
            </div>
          </Col>
        </Row>
        <div className='react-dataTable react-dataTable-selectable-rows' style={{ marginRight: '20px', marginLeft: '20px' }}>
          {loading ? <WaitingModal /> : <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={rowsPerPage}
            className='react-dataTable'
            sortIcon={<ChevronDown size={10} />}
            selectableRowsComponent={BootstrapCheckbox}
            // data={searchValue.length ? filteredData.data : data.data}
            data={data}
            paginationServer
            paginationTotalRows={count}
            paginationComponentOptions={{
              rowsPerPageText: 'Số hàng trên 1 trang:'
            }}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePagination}
            customStyles={customStyles}
            expandableRows
            expandableRowsComponent={(row) => (
              <PermissModal
                roleSelected={row.data} />
            )}
            expandOnRowClicked
          />}
        </div>
        <AddNewModal
          open={isAdd}
          handleAddModal={handleModal}
          getData={getData}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />
        {roleSelected && <EditModal
          open={isEdit}
          handleEditModal={handleModal}
          getData={getData}
          dataEdit={roleSelected}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
        />}
      </Card>
    </Fragment >
  )
}
const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
const ListUsersModal = React.lazy(() => import("./modal/ListUsersModal"))
export default ListRoles
