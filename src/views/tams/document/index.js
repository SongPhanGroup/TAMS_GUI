import { Table, Input, Card, CardTitle, Tag, Popconfirm, Switch, Select, Spin } from "antd"
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
} from "reactstrap"
import { Plus, X } from "react-feather"
import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons"
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
// import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { AbilityContext } from '@src/utility/context/Can'
import { deleteDocument, getDocument } from "../../../api/document"
import { toDateString, toDateTimeString } from "../../../utility/Utils"
import { getCourse } from "../../../api/course"
import { getDocumentType } from "../../../api/document_type"
import { getMajor } from "../../../api/major"
import { type } from "jquery"

const Document = () => {
    const [loadingData, setLoadingData] = useState(false)
    const ability = useContext(AbilityContext)
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [search, setSearch] = useState("")
    const [courseId, setCourseId] = useState()
    const [typeId, setTypeId] = useState()
    const [majorId, setMajorId] = useState()
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [info, setInfo] = useState()

    const [listCourse, setListCourse] = useState([])
    const [listDocumentType, setListDocumentType] = useState([])
    const [listMajor, setListMajor] = useState([])

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })
        const documentTypePromise = getDocumentType({ params: { page: 1, perPage: 10, search: '' } })
        const majorPromise = getMajor({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [coursePromise, documentTypePromise, majorPromise]
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
        const documentTypeRes = responseData[1]
        const majorRes = responseData[2]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCourse(null)
                setListDocumentType(null)
                setListMajor(null)
            }
        })
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const documentTypes = documentTypeRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const majors = majorRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        setListCourse(courses)
        setListDocumentType(documentTypes)
        setListMajor(majors)
    }

    const getData = (page, limit, search, courseId, typeId, majorId) => {
        setLoadingData(true)
        getDocument({
            params: {
                page,
                perPage: limit,
                ...(search && search !== "" && { search }),
                ...(courseId && { courseId }),
                ...(typeId && { typeId }),
                ...(majorId && { majorId })
            },
        })
            .then((res) => {
                setData(res?.data)
                setCount(res?.pagination?.totalRecords)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }
    useEffect(() => {
        getData(currentPage, rowsPerPage, search, courseId, typeId, majorId)
        getAllDataPromises()
    }, [currentPage, rowsPerPage, search, courseId, typeId, majorId])

    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setInfo(null)
        // handleReset()
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const handleEdit = (record) => {
        setInfo(record)
        setIsEdit(true)
    }

    const handleDelete = (key) => {
        deleteDocument(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa tài liệu thành công",
                    icon: "success",
                    customClass: {
                        confirmButton: "btn btn-success",
                    },
                }).then((result) => {
                    if (currentPage === 1) {
                        getData(1, rowsPerPage)
                    } else {
                        setCurrentPage(1)
                    }
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa tài liệu thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    const handleChangeCourse = (value) => {
        if (value) {
            setCourseId(value)
        } else {
            setCourseId()
        }
    }

    const handleChangeDocumentType = (value) => {
        if (value) {
            setTypeId(value)
        } else {
            setTypeId()
        }
    }

    const handleChangeMajor = (value) => {
        if (value) {
            setMajorId(value)
        } else {
            setMajorId()
        }
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => (
                <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
            ),
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            align: 'left',
            width: 500,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.title}</span>
            ),
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            align: 'left',
            width: 150,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.author}</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            align: 'center',
            width: 150,
            render: (text, record, index) => (
                <span>{toDateTimeString(record.createdAt)}</span>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: 'left',
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record.description}</span>
            ),
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {ability.can('update', 'LOAI_DON_VI') &&
                        <>
                            <EditOutlined
                                id={`tooltip_edit${record.ID}`}
                                style={{ color: "#09A863", cursor: 'pointer', marginRight: '1rem' }}
                                onClick={() => handleEdit(record)}
                            />
                            <UncontrolledTooltip placement="top" target={`tooltip_edit${record.ID}`}>
                                Chỉnh sửa
                            </UncontrolledTooltip>
                        </>}
                    {ability.can('delete', 'LOAI_DON_VI') &&
                        <Popconfirm
                            title="Bạn chắc chắn xóa?"
                            onConfirm={() => handleDelete(record.id)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            <DeleteOutlined style={{ color: "red", cursor: 'pointer' }} id={`tooltip_delete${record.ID}`} />
                            <UncontrolledTooltip placement="top" target={`tooltip_delete${record.ID}`}>
                                Xóa
                            </UncontrolledTooltip>
                        </Popconfirm>}
                </div>
            ),
        },
    ]

    return (
        <Card
            title="Danh sách tài liệu"
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
            <Row>
                <Col sm="10" style={{ display: "flex" }}>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Label
                            className=""
                            style={{
                                width: "100px",
                                fontSize: "14px",
                                height: "34px",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Tìm kiếm
                        </Label>
                        <Input
                            type="text"
                            placeholder="Tìm kiếm"
                            style={{ height: "34px" }}
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setSearch("")
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    setSearch(e.target.value)
                                    setCurrentPage(1)
                                }
                            }}
                        />
                    </Col>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Select
                            placeholder="Chọn đợt kiểm tra"
                            className='mb-50 select-custom'
                            options={listCourse}
                            allowClear
                            onChange={(value) => handleChangeCourse(value)}
                        />
                    </Col>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Select
                            placeholder="Chọn loại tài liệu"
                            className='mb-50 select-custom'
                            options={listDocumentType}
                            allowClear
                            onChange={(value) => handleChangeDocumentType(value)}
                        />
                    </Col>
                    <Col sm="3" className="mr-1" style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Select
                            placeholder="Chọn lĩnh vực"
                            className='mb-50 select-custom'
                            options={listMajor}
                            allowClear
                            onChange={(value) => handleChangeMajor(value)}
                        />
                    </Col>
                </Col>
                <Col sm="2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        onClick={(e) => setIsAdd(true)}
                        color="primary"
                        className="addBtn"
                        style={{
                            width: '100px',
                        }}
                    >
                        Thêm mới
                    </Button>
                </Col>
            </Row>
            {loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                columns={columns}
                dataSource={data}
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
            />}

            <AddNewModal
                open={isAdd}
                handleModal={handleModal}
                getData={getData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
            />
            {
                info && <EditModal
                    open={isEdit}
                    handleModal={handleModal}
                    getData={getData}
                    infoEdit={info}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                />
            }
        </Card>
    )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
export default Document 
