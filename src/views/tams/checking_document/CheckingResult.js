import {
    Table,
    Input,
    Card,
    Tag,
    Popconfirm,
    Switch,
    Collapse,
    Spin,
    Select
} from "antd"
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
    CardTitle,
} from "reactstrap"
import { Link, NavLink, useLocation, useParams } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    RightCircleOutlined,
} from "@ant-design/icons"
import { AbilityContext } from '@src/utility/context/Can'
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import AvatarGroup from "@components/avatar-group"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { toDateString, toDateTimeString } from "../../../utility/Utils"
// import {
//     getRole,
//     createRole,
//     updateRole,
//     deleteRole,
//     listAllRoleUserCount,
// } from "../../../../api/roles"
// import {
//     listAllUser,
//     getListUserByRole
// } from "../../../../api/users"
// import { getGroupPermission } from "../../../../api/permissionGroups"
// import {
//     getPerByRoleId,
//     getAllRolePer,
//     updateRoleManyPer,
// } from "../../../../api/rolePermissions"
// import { getPermission } from "../../../../api/permissions"
// import ListPermission from './detail'
import { deleteCheckingDocument, getCheckingDocument } from "../../../api/checking_document"
import ContentModal from "./modal/ContentModal"
import { getCheckingResult, getSimilarDocument, getTop3SimilarDocument } from "../../../api/checking_result"
import { getCourse } from "../../../api/course"
import { PAGE_DEFAULT, PER_PAGE_DEFAULT } from "../../../utility/constant"

const CheckingResult = () => {
    const [loadingData, setLoadingData] = useState(false)
    const [loadingData2, setLoadingData2] = useState(false)
    const ability = useContext(AbilityContext)
    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])
    const [count, setCount] = useState(0)
    const [count2, setCount2] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [courseId, setCourseId] = useState()
    const [search, setSearch] = useState("")
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isPer, setIsPer] = useState(false)
    const [isView, setIsView] = useState(false)
    const [listPerGroup, setListPerGroup] = useState([])
    const [permissionView, setPermissionView] = useState([])
    const [listAllPer, setListAllPer] = useState([])
    const [listPermissionSelected, setListPermissionSelected] = useState([])
    const [checkingDocumentSelected, setCheckingDocumentSelected] = useState()
    const [listAllRole, setListAllRole] = useState([])

    const [listCourse, setListCourse] = useState([])

    const location = useLocation()

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: PAGE_DEFAULT, perPage: PER_PAGE_DEFAULT, search: '' } })

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

    const params = useParams()
    const getData = () => {
        setLoadingData(true)
        getTop3SimilarDocument(Number(params?.id))
            .then((res) => {
                const result = res?.data?.map(((item, index) => {
                    return { ...item, _id: item.id, key: index }
                }))
                setData(result)
                setCount(res?.total)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }

    const getDataSameCourse = (courseId) => {
        setLoadingData2(true)
        getSimilarDocument(Number(params?.id), {
            params: {
                courseId
            }
        })
            .then((res) => {
                const result = res?.data?.map(((item, index) => {
                    return { ...item, _id: item.id, key: index }
                }))
                setData2(result)
                setCount2(res?.total)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData2(false)
            })
    }

    useEffect(() => {
        getDataSameCourse(courseId)
    }, [params?.id, courseId])

    useEffect(() => {
        getAllDataPromises()
        getData()
    }, [params?.id])

    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setIsPer(false)
        setIsView(false)
        setCheckingDocumentSelected(null)
    }
    const CloseBtn = (
        <X className="cursor-pointer" size={15} onClick={handleModal} />
    )
    const handleDetail = () => {
        setCheckingDocumentSelected(record)
        setIsEdit(true)
    }
    const handleViewUser = (role) => {
        setRoleSelected(role)
        setIsView(true)
    }
    const handleDelete = (key) => {
        deleteCheckingDocument(key)
            .then((res) => {
                MySwal.fire({
                    title: "Xóa kiểm tra tài liệu thành công",
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
                    handleModal()
                })
            })
            .catch((error) => {
                MySwal.fire({
                    title: "Xóa thất bại",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                })
                console.log(error)
            })
    }

    const rowClassName = (record) => {
        if (record.similarity > 15) {
            return 'highlighted-row'
        }
        return ''
    }

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ color: 'red', fontWeight: '600' }}>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                } else {
                    return (
                        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                }
            }
        },
        {
            title: "Tên tài liệu",
            dataIndex: "title",
            width: 500,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.title}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.title}</span>
                    )
                }
            }
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            width: 180,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.author}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.author}</span>
                    )
                }
            }
        },
        {
            title: "Lĩnh vực",
            dataIndex: "course",
            width: 150,
            align: "left",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.major}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.major}</span>
                    )
                }
            }
        },
        {
            title: "Loại tài liệu",
            dataIndex: "documentType",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.document?.documentType?.name}</span>
                    )
                } else {
                    return (
                        <span>{record?.document?.documentType?.name}</span>
                    )
                }
            }
        },
        {
            title: "Độ trùng lặp (%)",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if (record?.similarity > 15) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.similarity}</span>
                    )
                } else {
                    return (
                        <span>{record?.similarity}</span>
                    )
                }
            }
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {ability.can('update', 'PHAN_QUYEN_VAI_TRO') &&
                        <>

                            <RightCircleOutlined
                                id={`tooltip_detail_${record._id}`}
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={(e) => handleDetail(record)}
                            />
                            <UncontrolledTooltip placement="top" target={`tooltip_detail_${record._id}`}
                            >
                                Chi tiết
                            </UncontrolledTooltip>
                        </>}
                </div>
            ),
        },
    ]

    const handleChangeCourse = (value) => {
        if (value) {
            setCourseId(value)
        } else {
            setCourseId()
        }
    }

    return (
        <Fragment>
            <Card
                title="Kết quả kiểm tra tài liệu"
                style={{ backgroundColor: "white", width: "100%", height: "100%" }}
                extra={
                    <Col md="12" style={{ display: "flex", justifyContent: "flex-end" }}>
                        {ability.can('create', 'PHAN_QUYEN_VAI_TRO') &&
                            <Link to="/tams/checking-document">
                                <Button
                                    // onClick={(e) => setIsAdd(true)}
                                    color="primary"
                                    className=""
                                    style={{
                                        width: '100px',
                                        marginBottom: 0,
                                        padding: '8px 15px'
                                    }}
                                    outline
                                >
                                    Quay lại
                                </Button>
                            </Link>
                        }
                    </Col>
                }
            >

                <Row>
                    <Col md="12" style={{ textAlign: 'center' }}>
                        <h5>Kết quả trùng lặp so với CSDL mẫu: <span style={{ color: 'red' }}>{location?.state?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}%</span></h5>
                    </Col>
                    <Col md="12">
                        <h6>1. Danh sách các tài liệu trùng lặp cao</h6>
                        {loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                            columns={columns}
                            dataSource={data}
                            bordered
                            expandable={{
                                expandedRowRender: (record) => <ContentModal
                                    listSentenceByCheckingResult={record} />,
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                                // expandRowByClick: true
                            }}
                            pagination={{
                                defaultPageSize: 10,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "30"],
                                total: { count },
                                locale: { items_per_page: "/ trang" },
                                showSizeChanger: true,
                                showTotal: (total, range) => <span>Tổng số: {total}</span>,
                            }}
                            rowClassName={rowClassName}
                        />}
                    </Col>
                    <Col md="12">
                        <h6>2. Kết quả trùng lặp với các tài liệu cùng đợt kiểm tra</h6>
                        <Select options={listCourse} placeholder="Chọn đợt kiểm tra" className="mb-1" style={{ float: 'right', width: '200px' }} allowClear onChange={(value) => handleChangeCourse(value)} />
                        {loadingData2 === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                            columns={columns}
                            dataSource={data2}
                            bordered
                            expandable={{
                                expandedRowRender: (record) => <ContentModal
                                    listSentenceByCheckingResult={record} />,
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                                // expandRowByClick: true
                            }}
                            pagination={{
                                defaultPageSize: 10,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "30"],
                                total: { count2 },
                                locale: { items_per_page: "/ trang" },
                                showSizeChanger: true,
                                showTotal: (total, range) => <span>Tổng số: {total}</span>,
                            }}
                            rowClassName={rowClassName}
                        />}
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}
export default CheckingResult
