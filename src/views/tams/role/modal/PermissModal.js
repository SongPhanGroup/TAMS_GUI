import React, { useState, Fragment, useEffect, useRef, useContext } from "react"
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
  CardHeader
} from "reactstrap"
import { Link } from "react-router-dom"
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Trash, Edit, Search, Divide, Command, MinusCircle, Lock } from 'react-feather'
import { AbilityContext } from "@src/utility/context/Can"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { toDateString, integerToRoman } from "../../../../utility/Utils"
import AvatarGroup from "@components/avatar-group"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import {
  getRole,
  deleteRole
} from "../../../../api/role"
import {
  getAllRolePer,
  updateRoleManyPer,
  deleteRolePer
} from "../../../../api/role_permission"
import { getPermission, getPermissionByRole } from "../../../../api/permission"

const listActions = [
  {
    id: "0",
    label: "Xem",
    value: "read"
  },
  {
    id: "1",
    label: "Thêm",
    value: "create"
  },
  {
    id: "2",
    label: "Sửa",
    value: "update"
  },
  {
    id: "3",
    label: "Xóa",
    value: "delete"
  },
  {
    id: "4",
    label: "Phê duyệt",
    value: "print"
  }
  //   {
  //     id: "5",
  //     label: "Tất cả",
  //     value: "all_each",
  //   },
]
const PermissModal = ({ roleSelected }) => {
  console.log(roleSelected)
  const ability = useContext(AbilityContext)
  const MySwal = withReactContent(Swal)
  const [listPerGroup, setListPerGroup] = useState([])
  const [permissionView, setPermissionView] = useState([])
  const [listAllPer, setListAllPer] = useState([])
  const [listPermissionSelected, setListPermissionSelected] = useState([])
  const [listSubmit, setListSubmit] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerpage] = useState(10)
  const [count, setCount] = useState()
  const [search, setSearch] = useState()
  const [isAdd, setIsAdd] = useState(false)
  const getData = () => {
    getPermissionByRole({
      params: {
        page: currentPage,
        limit: rowsPerPage,
        roleID: roleSelected?._id,
        ...(search && search !== "" && { search })
      }
    })
      .then((res) => {
        const { count, data } = res[0]
        setCount(count[0]?.count)
        setListPermissionSelected(data)
        const newArr = []
        const temp = data.map((item) => {
          const listActions = Array.from(new Set(item.actionContents))
          for (const u of listActions) {
            newArr.push({
              permissionID: item._id,
              roleID: roleSelected._id,
              actionContent: u,
              isActive: 1
            })
          }
        })
        setListSubmit(newArr)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const handleModal = () => {
    setIsAdd(false)
  }
  const getInfo = () => {
    getPermission({
      params: {
        page: 1,
        limit: 5000
      }
    })
      .then((res) => {
        const { count, data } = res[0]
        setListAllPer(data ?? [])
      })
      .catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    getInfo()
    getData()
  }, [roleSelected, currentPage, rowsPerPage, search])

  const _handleCheckRoleAction = (e, act, permission, role) => {
    setListSubmit((pre) => {
      const isChecked = listSubmit.find(
        (per) => per.permissionID === permission._id && per.roleID === role?._id && per.actionContent === act)
      if (isChecked) {
        if (act === "read") {
          return listSubmit.filter(
            (per) => !(per.permissionID === permission._id && per.roleID === role?._id)
          )
        }
        return listSubmit.filter(
          (per) => !(
            per.permissionID === permission._id &&
            per.roleID === role?._id &&
            per.actionContent === act
          )
        )
      } else {
        if (act !== "read") {
          const isChecked_ = listSubmit.find(
            (per) => per.permissionID === permission._id &&
              per.roleID === role?._id &&
              per.actionContent === act
          )
          if (isChecked_) {
            return listSubmit.filter(
              (per) => !(per.permissionID === permission._id && per.roleID === role?._id && per.actionContent === act))
          } else {
            const isRead = listSubmit.find(
              (per) => per.permissionID === permission._id &&
                per.roleID === role?._id &&
                per.actionContent === 'read'
            )
            if (isRead) {
              return [
                ...pre,
                {
                  permissionID: permission._id,
                  roleID: role._id,
                  actionContent: act,
                  isActive: 1
                }
              ]
            } else {
              return [
                ...pre,
                {
                  permissionID: permission._id,
                  roleID: role._id,
                  actionContent: "read",
                  isActive: 1
                },
                {
                  permissionID: permission._id,
                  roleID: role._id,
                  actionContent: act,
                  isActive: 1
                }
              ]
            }
          }
        }
        return [
          ...pre,
          {
            permissionID: permission._id,
            roleID: role._id,
            actionContent: act,
            isActive: 1
          }
        ]
      }
    })
  }
  const _renderRoleItem = (act, permission, role) => {
    // const permissionData = listPermissionSelected?.find(
    //   (lstPer) => lstPer.permissionID === permission._id &&
    //     lstPer.actionContent === act &&
    //     lstPer.roleID === role?._id
    // )
    // const isCheck = permission.actionContents?.find(x => x === act)
    const isCheck = listSubmit.find(x => x.permissionID === permission._id && x.actionContent === act)
    return (
      <Checkbox
        type="checkbox"
        style={{ cursor: "pointer" }}
        className="action-cb"
        id={`${permission._id}_${act}`}
        checked={isCheck || false}
        onChange={(e) => _handleCheckRoleAction(e, act, permission, role)}
      />
    )
  }
  const handleDelete = (record) => {
    const dataSubmit = {
      roleID: roleSelected?._id,
      permissionID: record?._id
    }
    deleteRolePer(dataSubmit)
      .then((res) => {
        MySwal.fire({
          title: "Xóa thành công",

          icon: "success",
          customClass: {
            confirmButton: "btn btn-success"
          }
        }).then((result) => {
          getData()
        })
      })
      .catch((err) => {
        console.log(err)
        MySwal.fire({
          title: "Xóa thất bại",
          text: "Có lỗi xảy ra!",
          icon: "error",
          customClass: {
            confirmButton: "btn btn-danger"
          }
        }).then((result) => {
          getData()
        })
      })
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: 30,
      align: "center",
      render: (text, record, index) => (
        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
      )
    },
    {
      title: "Mã quyền",
      dataIndex: "permissionCode",
      align: "left"
      // width: 250,
    },
    {
      title: "Tên quyền",
      dataIndex: "description",
      align: "left"
      // width: 250,
    },
    {
      title: "Xem",
      align: "center",
      render: (record) => {
        return _renderRoleItem('read', record, roleSelected)
      }
    },
    {
      title: "Thêm",
      align: "center",
      render: (record) => {
        return _renderRoleItem('create', record, roleSelected)
      }
    },
    {
      title: "Sửa",
      align: "center",
      render: (record) => {
        return _renderRoleItem('update', record, roleSelected)
      }
    },
    {
      title: "Xóa",
      align: "center",
      render: (record) => {
        return _renderRoleItem('delete', record, roleSelected)
      }
    },
    {
      title: "Phê duyệt",
      align: "center",
      render: (record) => {
        return _renderRoleItem('print', record, roleSelected)
      }
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      render: (record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Popconfirm
            title="Bạn chắc chắn xóa?"
            onConfirm={() => handleDelete(record)}
            cancelText="Hủy"
            okText="Đồng ý"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer" }}
            />
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleUpDateManyPer = () => {
    const arr = listSubmit.map((per, index) => {
      return {
        permissionID: per.permissionID,
        actionContent: per.actionContent
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
          getInfo()
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

  return (
    <Card
      style={{ backgroundColor: "white" }}
    >
      <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
        <CardTitle tag='h4'>{`Phân quyền cho vai trò: ${roleSelected?.name}`}</CardTitle>
        <div className='d-flex mt-md-0 mt-1'>
          {ability.can('add', 'nguoidung') &&
            <Button className='ms-2' color='primary' onClick={() => setIsAdd(true)}>
              <Plus size={15} />
              <span className='align-middle ms-50'>Thêm mới</span>
            </Button>}
        </div>
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
                  setSearch('')
                }
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }
              }}
            />
          </div>

        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={listPermissionSelected}
        bordered
        pagination={{
          current: currentPage,
          pageSize: rowsPerPage,
          defaultPageSize: rowsPerPage,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "30", '100'],
          total: count,
          locale: { items_per_page: "/ trang" },
          showTotal: (total, range) => <span>Tổng số: {total}</span>,
          onShowSizeChange: (current, pageSize) => {
            setCurrentPage(current)
            setRowsPerpage(pageSize)
          },
          onChange: (pageNumber) => {
            setCurrentPage(pageNumber)
          }
        }}
      />
      <div className="d-flex justify-content-center mb-1">
        <Button
          className="saveBtn"
          color="primary"
          onClick={() => {
            handleUpDateManyPer()
          }}
        >
          Lưu
        </Button>
      </div>
      <AddPerRoleModal open={isAdd} handleModal={handleModal} getData={getData} rowsPerPage={rowsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} roleSelected={roleSelected} listSubmit={listSubmit} />

    </Card>
  )
}

const AddPerRoleModal = React.lazy(() => import("./AddPerRoleModal"))
export default PermissModal
