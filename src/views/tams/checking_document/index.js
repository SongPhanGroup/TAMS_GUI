import {
    Table,
    Input,
    Card,
    CardTitle,
    Tag,
    Popconfirm,
    Switch,
    Collapse,
    Select,
    Spin,
    Tooltip,
    DatePicker,
    Dropdown
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
    Spinner,
} from "reactstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
    AppstoreAddOutlined,
    AppstoreOutlined,
    DeleteOutlined,
    DownCircleFilled,
    DownCircleOutlined,
    EditOutlined,
    FileDoneOutlined,
    LockOutlined,
    RightSquareOutlined,
    UnlockOutlined,
} from "@ant-design/icons"
import { AbilityContext } from '@src/utility/context/Can'
// import style from "../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import AvatarGroup from "@components/avatar-group"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import { toDateStringv2, toDateTimeString } from "../../../utility/Utils"
import { deleteCheckingDocument, getCheckingDocument } from "../../../api/checking_document"
import VersionModal from "./modal/VersionModal"
import { PAGE_DEFAULT, PER_PAGE_DEFAULT } from "../../../utility/constant"
import { getCourse } from "../../../api/course"
import dayjs from "dayjs"
import { downloadTemplateBaoCao, getSimilarityReport, getSimilarityReportByCourse } from "../../../api/checking_document_version"
const { RangePicker } = DatePicker

const oneWeekAgo = new Date()
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

const CheckingDocument = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [loadingData, setLoadingData] = useState(false)
    const ability = useContext(AbilityContext)
    const selected = useRef()
    const MySwal = withReactContent(Swal)
    const [data, setData] = useState([])
    const [count, setCount] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [search, setSearch] = useState("")
    const [courseId, setCourseId] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
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
    const [listLockedCourseIds, setListLockedCourseIds] = useState([])
    const [listCourseId, setListCourseId] = useState([])
    const [loadingReports, setLoadingReports] = useState({}) // Tracks loading per record
    const [lastVersionCheckingDoc, setLastVersionCheckingDoc] = useState({
        // supervisedAt: '', similarityDoc: '', description: ''
    })

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

        const resLockedCourseIds = courseRes?.data?.filter(item => item.isActive !== 1)?.map(item => item.id)
        const courseIds = courseRes?.data?.filter(item => item.isActive === 1)?.map(item => item.id)
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        }).sort((a, b) => {
            if (a.value === 1) return -1 // Đưa phần tử có id = 1 lên đầu
            if (b.value === 1) return 1 // Đưa phần tử có id = 1 lên đầu
            return 0 // Giữ nguyên thứ tự của các phần tử còn lại
        })

        setListCourse(courses)
        setListLockedCourseIds(resLockedCourseIds)
        setListCourseId(courseIds)
    }

    // const getData = (page, limit, search, courseIds, startDate, endDate) => {
    //     setLoadingData(true)
    //     if (location?.state) {
    //         getCheckingDocument({
    //             params: {
    //                 page: currentPage,
    //                 limit: rowsPerPage,
    //                 ...(search && search !== "" && { search }),
    //                 courseIds: location?.state?.id,
    //                 ...(startDate && { startDate }),
    //                 ...(endDate && { endDate })
    //             }
    //         })
    //             .then((res) => {
    //                 // const result = res?.data?.map(((item, index) => {
    //                 //     return { ...item, _id: item.id, key: index }
    //                 // }))
    //                 const result = res?.data
    //                     ?.filter(item => listCourseId.includes(item.courseId)) // Lọc dựa trên courseId
    //                     .map((item, index) => {
    //                         return { ...item, _id: item.id, key: index }
    //                     })
    //                 setData(result)
    //                 setCount(res?.pagination?.totalRecords)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             }).finally(() => {
    //                 setLoadingData(false)
    //             })
    //     } else {
    //         getCheckingDocument({
    //             params: {
    //                 page,
    //                 limit,
    //                 ...(search && search !== "" && { search }),
    //                 ...(courseIds && { courseIds }),
    //                 ...(startDate && { startDate }),
    //                 ...(endDate && { endDate })
    //             }
    //         })
    //             .then((res) => {
    //                 // console.log(res)
    //                 // const result = res?.data?.map(((item, index) => {
    //                 //     return { ...item, _id: item.id, key: index }
    //                 // }))
    //                 const result = res?.data
    //                     ?.filter(item => listCourseId.includes(item.courseId)) // Lọc dựa trên courseId
    //                     .map((item, index) => {
    //                         return { ...item, _id: item.id, key: index }
    //                     })
    //                 setData(result)
    //                 setCount(res?.pagination?.totalRecords)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             }).finally(() => {
    //                 setLoadingData(false)
    //             })
    //     }
    // }

    const getData = (page, limit, search, courseIds, startDate, endDate) => {
        setLoadingData(true)

        // Prepare the parameters for the API call
        const params = {
            page,
            limit,
            ...(search && search !== "" && { search }),
            ...((courseIds || location?.state?.id) && { courseIds: courseIds || location.state.id }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate })
        }

        getCheckingDocument({ params })
            .then((res) => {
                const result = res?.data
                    ?.filter(item => listCourseId.includes(item.courseId)) // Filter based on courseId
                    .map((item, index) => {
                        return { ...item, _id: item.id, key: index }
                    })
                setData(result)
                setCount(res?.pagination?.totalRecords)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoadingData(false)
            })
    }


    useEffect(() => {
        if ((startDate && endDate) || (!startDate && !endDate)) {
            getData(currentPage, rowsPerPage, search, courseId, startDate, endDate)
        }
    }, [currentPage, rowsPerPage, search, courseId, startDate, endDate, listCourseId])

    useEffect(() => {
        getAllDataPromises()
    }, [])

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
    const handleEdit = (record) => {
        setCheckingDocumentSelected(record)
        setIsEdit(true)
    }
    const handleChangeCourse = (value) => {
        console.log(value)
        if (value) {
            setCourseId(value.join(','))
            setCurrentPage(1)
        } else {
            setCourseId()
        }
    }
    const handleChangeDate = (value) => {
        if (value) {
            setStartDate(toDateStringv2(value[0]))
            setEndDate(toDateStringv2(value[1]))
        } else {
            setStartDate()
            setEndDate()
        }
    }

    const handleViewUser = (role) => {
        setRoleSelected(role)
        setIsView(true)
    }
    const handleDelete = (key) => {
        deleteCheckingDocument(key)
            .then((res) => {
                // MySwal.fire({
                //     title: "Xóa kiểm tra tài liệu thành công",
                //     icon: "success",
                //     customClass: {
                //         confirmButton: "btn btn-success",
                //     },
                // }).then((result) => {
                //     if (currentPage === 1) {
                //         getData(1, rowsPerPage)
                //     } else {
                //         setCurrentPage(1)
                //     }
                //     handleModal()
                // })
                getData(1, rowsPerPage)
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

    const handleResult = (record) => {
        navigate(`/tams/checking-document-result/${record?.id}`, { state: record })
    }

    const handleButtonClick2 = (record) => {
        navigate(`/tams/detailTD-checking-version-result/${record?.id}`, { state: record })
    }

    const handleReport = (recordId, item) => {
        if (item && item.key === "2") {
            setLoadingReports((prev) => ({ ...prev, [recordId]: true }))
            getSimilarityReport({
                params: {
                    checkingDocumentVersionId: Number(recordId)
                },
                responseType: 'blob'
            })
                .then(res => {
                    downloadTemplateBaoCao(2, res, 'Bao_cao_DS_trung_lap_cao')
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    setLoadingReports((prev) => ({ ...prev, [recordId]: false }))
                })
        } else {
            setLoadingReports((prev) => ({ ...prev, [recordId]: true }))
            getSimilarityReportByCourse({
                params: {
                    checkingDocumentVersionId: Number(recordId)
                },
                responseType: 'blob'
            })
                .then(res => {
                    downloadTemplateBaoCao(4, res, 'Bao_cao_DS_trung_lap_theo_dot')
                })
                .catch(error => {
                    console.log(error)
                }).finally(() => {
                    setLoadingReports((prev) => ({ ...prev, [recordId]: false }))
                })
        }

    }

    const items = [
        {
            label: 'Báo cáo DS trùng lặp cao',
            key: '2',
            icon: <DownCircleOutlined />,
        },
        {
            label: 'Báo cáo DS trùng lặp theo đợt',
            key: '1',
            icon: <DownCircleFilled />,
        }
    ]

    const menuProps = (recordId) => ({
        items,
        onClick: (item) => handleReport(recordId, item),
    })

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            width: 30,
            align: "center",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                } else {
                    return (
                        <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>
                    )
                }
            },
        },
        {
            title: "Tiêu đề",
            dataIndex: "title",
            width: 500,
            align: "left",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record.title}</span>
                    )
                } else {
                    return (
                        <span>{record.title}</span>
                    )
                }
            },
        },
        {
            title: "Tác giả",
            dataIndex: "author",
            width: 220,
            align: "left",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record.author}</span>
                    )
                } else {
                    return (
                        <span>{record.author}</span>
                    )
                }
            },
        },
        {
            title: "Đợt kiểm tra",
            dataIndex: "course",
            width: 150,
            align: "left",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.course?.name}</span>
                    )
                } else {
                    return (
                        <span>{record?.course?.name}</span>
                    )
                }
            },
        },
        {
            title: "Trùng với DL mẫu (%)",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                // if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                //     return (
                //         <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}</span>
                //     )
                // } else {
                //     return (
                //         <span>{record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}</span>
                //     )
                // }
                const countVersion = (record.checkingDocumentVersion).length
                if (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) {
                    const similarityType1 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal || 0
                    const similarityType2 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal || 0

                    // setSupervisedAt(createdAt)

                    // Check the similarity and decide color style
                    if (lastVersionCheckingDoc.similarityDoc) {
                        return (
                            <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                                {lastVersionCheckingDoc.similarityDoc}
                            </span>
                        )
                    } else {
                        return (
                            <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                                {similarityType1}
                            </span>
                        )
                    }
                } else {
                    // Show spinner if no versions are available
                    return <span style={{ color: 'blue', fontWeight: '600' }}>Đang xử lý</span>
                }
            },
        },
        {
            title: "Trùng với TL cùng đợt (%)",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal}</span>
                    )
                } else {
                    return (
                        <span>{record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal}</span>
                    )
                }
            },
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: 'left',
            width: 200,
            render: (text, record, index) => {
                // if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                //     return (
                //         <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{record?.description}</span>
                //     )
                // } else {
                //     return (
                //         <span>{record?.description}</span>
                //     )
                // }
                const similarityType1 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal || 0
                const similarityType2 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal || 0

                // setSupervisedAt(createdAt)

                // Check the similarity and decide color style
                if (lastVersionCheckingDoc.description) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                            {record.description}
                        </span>
                    )
                } else {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                            {record?.description}
                        </span>
                    )
                }
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                if ((record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal) >= 30 || (record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal) >= 30) {
                    return (
                        <span style={{ whiteSpace: 'break-spaces', color: 'red', fontWeight: '600' }}>{toDateTimeString(record.createdAt)}</span>
                    )
                } else {
                    return (
                        <span>{toDateTimeString(record.createdAt)}</span>
                    )
                }
            },
        },
        {
            title: "Ngày kiểm tra",
            dataIndex: "supervisedAt",
            width: 120,
            align: "center",
            render: (text, record, index) => {
                const countVersion = (record.checkingDocumentVersion).length
                if (countVersion > 0) {
                    const similarityType1 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal || 0
                    const similarityType2 = record?.checkingDocumentVersion[0]?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal || 0

                    const createdAt = toDateTimeString(record?.checkingDocumentVersion[countVersion - 1]?.createdAt)
                    // setSupervisedAt(createdAt)

                    // Check the similarity and decide color style
                    if (lastVersionCheckingDoc.supervisedAt) {
                        return (
                            <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                                {lastVersionCheckingDoc.supervisedAt}
                            </span>
                        )
                    } else {
                        return (
                            <span style={{ whiteSpace: 'break-spaces', color: (similarityType1 >= 30 || similarityType2 >= 30) ? 'red' : 'inherit', fontWeight: (similarityType1 >= 30 || similarityType2 >= 30) ? '600' : 'normal' }}>
                                {createdAt}
                            </span>
                        )
                    }
                }
            },
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => {
                const dataVersion = record?.checkingDocumentVersion
                const recordLastVersion = dataVersion[dataVersion.length - 1]
                return (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip placement="top" title="Kết quả kiểm tra">
                            <AppstoreOutlined
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => {
                                    const recordStandard = { ...recordLastVersion, from: 'checking-document' }
                                    return handleResult(recordStandard)
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Kết quả chi tiết">

                            <RightSquareOutlined
                                id={`tooltip_detail2_${record._id}`}
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => {
                                    const recordStandard = { ...recordLastVersion, from: 'checking-document', title: record?.title }
                                    return handleButtonClick2(recordStandard)
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Xuất báo cáo">
                            <Dropdown menu={menuProps(recordLastVersion?.id)}>
                                {
                                    loadingReports[recordLastVersion?.id] ? <Spinner color="#fff" style={{ width: '14px', height: '14px' }} /> : <FileDoneOutlined style={{ cursor: 'pointer', color: '#09A863', marginRight: '1rem' }} />
                                }
                            </Dropdown>
                        </Tooltip>
                        {ability.can('update', 'KIEM_TRA_TRUNG_LAP_TUYET_DOI') &&
                            <>
                                <Tooltip placement="top" title="Chỉnh sửa" >
                                    <EditOutlined
                                        style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                        onClick={(e) => handleEdit(record)}
                                    />
                                </Tooltip>
                            </>}
                        {ability.can('delete', 'KIEM_TRA_TRUNG_LAP_TUYET_DOI') &&
                            <Popconfirm
                                title="Bạn chắc chắn xóa?"
                                onConfirm={() => handleDelete(record._id)}
                                cancelText="Hủy"
                                okText="Đồng ý"
                            >
                                <Tooltip placement="top" title="Xóa" >
                                    <DeleteOutlined
                                        style={{ color: "red", cursor: "pointer" }}
                                    />
                                </Tooltip>
                            </Popconfirm>}
                    </div>
                )
            }
        },
    ]

    const [expandedRowKeys, setExpandedRowKeys] = useState([])

    const onExpand = (expanded, record) => {
        setExpandedRowKeys(expanded ? [record.key] : [])
    }

    const currentYear = new Date().getFullYear()

    const handleChangeTime = (dates) => {
        if (dates) {
            setStartDate(dayjs(dates[0], 'YYYY-MM-DD'))
            setEndDate(dayjs(dates[1], 'YYYY-MM-DD'))
        } else {
            setStartDate(dayjs(`${currentYear}-01-01`))
            setEndDate(dayjs(`${currentYear}-12-31`))
        }
    }

    const [loadingUpdate, setLoadingUpdate] = useState(false)

    // Callback để cập nhật dữ liệu từ con
    const handleUpdateFromChild = async (updatedRecord) => {
        setLoadingUpdate(true)
        try {
            setLastVersionCheckingDoc(updatedRecord)
        } catch (error) {
            console.error("Error updating data", error)
        } finally {
            setLoadingUpdate(false)
        }
    }

    // Custom rendering for each option
    const renderOptionLabel = (option) => {
        if (listLockedCourseIds.includes(option.value)) {
            return (
                <span style={{ color: 'red', display: 'flex', justifyContent: 'space-between' }}>
                    {option.label}
                    <LockOutlined style={{ marginLeft: 5 }} /> {/* Add icon */}
                </span>
            )
        } else {
            return (
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {option.label}
                    <UnlockOutlined style={{ marginLeft: 5, color: '#09A863' }} /> {/* Add icon */}
                </span>
            )
        }
    }

    return (
        <Fragment>
            <Card
                title="Danh sách tài liệu kiểm tra"
                style={{ backgroundColor: "white", width: "100%", height: "100%" }}
            >
                <Row>
                    <Col md="12">
                        <Row>
                            <Col md="10" style={{ display: "flex", justifyContent: "flex-start" }}>
                                <Col
                                    sm="4"
                                    style={{ display: "flex", justifyContent: "flex-end", marginRight: "0.5rem" }}
                                >
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
                                <Col
                                    sm="4"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        marginRight: "0.5rem"
                                    }}
                                >
                                    <Label
                                        className=""
                                        style={{
                                            width: "120px",
                                            fontSize: "14px",
                                            height: "34px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Chọn đợt kiểm tra
                                    </Label>
                                    <Select
                                        defaultValue={location?.state?.id}
                                        mode="multiple"
                                        placeholder="Chọn đợt kiểm tra"
                                        className='mb-50 select-custom flex-1'
                                        options={listCourse.map((course) => ({
                                            value: course.value,
                                            label: renderOptionLabel(course)
                                        }))}
                                        allowClear
                                        onChange={(value) => handleChangeCourse(value)}
                                        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                                    />

                                </Col>
                                <Col
                                    sm="4"
                                    style={{ display: "flex", justifyContent: "flex-start" }}
                                >
                                    <Label
                                        className=""
                                        style={{
                                            width: "150px",
                                            fontSize: "14px",
                                            height: "34px",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        Ngày kiểm tra
                                    </Label>
                                    <RangePicker
                                        style={{
                                            width: "100%",
                                            height: '80%'
                                        }}
                                        // defaultValue={[dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)]}
                                        format={"DD-MM-YYYY"}
                                        allowClear={true}
                                        onChange={handleChangeTime}
                                    />
                                </Col>
                            </Col>
                            <Col md="2" style={{ display: "flex", justifyContent: "flex-end" }}>
                                {ability.can('create', 'KIEM_TRA_TRUNG_LAP_TUYET_DOI') &&
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
                                }
                            </Col>
                        </Row>
                        {loadingData === true ? <Spin style={{ position: 'relative', left: '50%' }} /> : <Table
                            columns={columns}
                            dataSource={data}
                            bordered
                            expandable={{
                                expandedRowRender: (record) => <VersionModal
                                    checkingDocumentSelected={record} onUpdate={handleUpdateFromChild} />,
                                rowExpandable: (record) => record.name !== 'Not Expandable',
                            }}
                            expandedRowKeys={expandedRowKeys}
                            onExpand={onExpand}
                            pagination={{
                                current: currentPage,
                                pageSize: rowsPerPage,
                                defaultPageSize: rowsPerPage,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "30"],
                                total: count,
                                locale: { items_per_page: "/ trang" },
                                showSizeChanger: true,
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
                            onUpdate={handleUpdateFromChild}
                            dataTable={data}
                            setData={setData}
                        />
                        {
                            <EditModal
                                open={isEdit}
                                handleModal={handleModal}
                                getData={getData}
                                infoEdit={checkingDocumentSelected}
                                currentPage={currentPage}
                                rowsPerPage={rowsPerPage}
                            />
                        }
                    </Col>
                </Row>
            </Card>
        </Fragment>
    )
}
const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))
export default CheckingDocument
