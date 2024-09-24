import {
    Table,
    Input,
    Card,
    CardTitle,
    Tag,
    Popconfirm,
    Switch,
    Collapse,
    Checkbox,
    Spin,
    Tooltip,
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
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Plus, X } from "react-feather"
import {
    AppstoreAddOutlined,
    DeleteOutlined,
    EditOutlined,
    LockOutlined,
    AppstoreOutlined,
    RightCircleOutlined,
    RightSquareOutlined,
    FileDoneOutlined,
    DownCircleOutlined,
    DownCircleFilled

} from "@ant-design/icons"
import { AbilityContext } from "@src/utility/context/Can"
//   import style from "../../../../../assets/scss/index.module.scss"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
//   import { toDateString, integerToRoman } from "../../../../../utility/Utils"
import AvatarGroup from "@components/avatar-group"
import Select from "react-select"
import * as yup from "yup"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import classnames from "classnames"
import AddNewCheckingDocumentVersion from "./AddNewVersionModal"
import { deleteCheckingDocumentVersion, downloadTemplateBaoCao, getCheckingDocumentVersion, getSimilarityReport } from "../../../../api/checking_document_version"
import { detailCheckingDocument } from "../../../../api/checking_document"
import EditCheckingDocumentVersion from "./EditVersionModal"
import { toDateTimeString } from "../../../../utility/Utils"

const VersionModal = ({ checkingDocumentSelected, onUpdate }) => {
    const [loadingData, setLoadingData] = useState(false)
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal)
    const [listPerGroup, setListPerGroup] = useState([])
    const [permissionView, setPermissionView] = useState([])
    const [listAllPer, setListAllPer] = useState([])
    const [data, setData] = useState([])
    const [listSubmit, setListSubmit] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [count, setCount] = useState()
    const [search, setSearch] = useState()
    const [isAdd, setIsAdd] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [checkingDocumentVersionSelected, setCheckingDocumentVersionSelected] = useState()
    const [loadingReports, setLoadingReports] = useState({}) // Tracks loading per record

    const getData = () => {
        setLoadingData(true)
        detailCheckingDocument(checkingDocumentSelected?.id)
            .then((res) => {
                const result = res?.data?.checkingDocumentVersion
                setData(result)
                setCount(result?.length)
            })
            .catch((err) => {
                console.log(err)
            }).finally(() => {
                setLoadingData(false)
            })
    }
    const handleModal = () => {
        setIsAdd(false)
        setIsEdit(false)
        setCheckingDocumentVersionSelected(null)
    }

    const handleEdit = (record) => {
        setCheckingDocumentVersionSelected(record)
        setIsEdit(true)
    }

    const handleResult = (record) => {
        navigate(`/tams/checking-document-result/${record?.id}`, { state: record })
    }

    const handleButtonClick2 = (record) => {
        navigate(`/tams/detailTD-checking-version-result/${record?.id}`, { state: record })
    }

    useEffect(() => {
        getData()
    }, [currentPage, rowsPerPage, search, checkingDocumentSelected])

    const handleDelete = (record) => {
        deleteCheckingDocumentVersion(record?.id)
            .then((res) => {
                // MySwal.fire({
                //     title: "Xóa thành công",

                //     icon: "success",
                //     customClass: {
                //         confirmButton: "btn btn-success",
                //     },
                // }).then((result) => {
                //     getData()
                // })
                getData()
            })
            .catch((err) => {
                console.log(err)
                MySwal.fire({
                    title: "Xóa thất bại",
                    text: "Có lỗi xảy ra!",
                    icon: "error",
                    customClass: {
                        confirmButton: "btn btn-danger",
                    },
                }).then((result) => {
                    getData()
                })
            })
    }

    const handleReport = (recordId) => {
        setLoadingReports((prev) => ({ ...prev, [recordId]: true }))
        getSimilarityReport({
            params: {
                checkingDocumentVersionId: Number(recordId)
            },
            responseType: 'blob'
        })
            .then(res => {
                downloadTemplateBaoCao(2, res)
            })
            .catch(error => {
                console.log(error)
            }).finally(() => {
                setLoadingReports((prev) => ({ ...prev, [recordId]: false }))
            })
    }

    const items = [
        {
            label: 'Báo cáo DS trùng lặp cao',
            key: '2',
            icon: <DownCircleOutlined />,
        },
        // {
        //     label: 'Báo cáo DS trùng lặp theo đợt',
        //     key: '1',
        //     icon: <DownCircleFilled />,
        // }
    ]

    const menuProps = (recordId) => ({
        items,
        onClick: () => handleReport(recordId),
    })

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
            title: "Tên tài liệu",
            dataIndex: "fileName",
            align: "left",
            width: 500,
        },
        {
            title: "Phiên bản",
            dataIndex: "version",
            align: "center",
            width: 100,
        },
        {
            title: "Trùng với DL mẫu (%)",
            dataIndex: "similarityTotal",
            align: "center",
            width: 100,
            render: (text, record, index) => {
                return (
                    <span>{record?.checkingResult?.find(item => item.typeCheckingId === 1)?.similarityTotal}</span>
                )
            }
        },
        {
            title: "Trùng với TL cùng đợt (%)",
            dataIndex: "similarityTotal",
            align: "center",
            width: 100,
            render: (text, record, index) => {
                return (
                    <span>{record?.checkingResult?.find(item => item.typeCheckingId === 2)?.similarityTotal}</span>
                )
            }
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            align: "left",
            width: 200,
        },
        {
            title: "Ngày kiểm tra",
            dataIndex: "createdAt",
            align: "center",
            width: 200,
            render: (text, record, index) => {
                return (
                    <span>{toDateTimeString(record?.createdAt)}</span>
                )
            }
        },
        {
            title: "Thao tác",
            width: 100,
            align: "center",
            render: (record) => {
                return (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip placement="top" title="Kết quả kiểm tra">
                            <AppstoreOutlined
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => {
                                    const recordStandard = { ...record, from: 'checking-document' }
                                    return handleResult(recordStandard)
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Kết quả chi tiết">

                            <RightSquareOutlined
                                id={`tooltip_detail2_${record._id}`}
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={() => {
                                    const recordStandard = { ...record, from: 'checking-document', title: checkingDocumentSelected?.title }
                                    return handleButtonClick2(recordStandard)
                                }}
                            />
                        </Tooltip>
                        <Tooltip placement="top" title="Xuất báo cáo">
                            <Dropdown menu={menuProps(record.id)}>
                                {
                                    loadingReports[record.id] ? <Spinner color="#fff" style={{ width: '14px', height: '14px' }} /> : <FileDoneOutlined style={{ cursor: 'pointer', color: '#09A863', marginRight: '1rem' }} />
                                }
                            </Dropdown>
                        </Tooltip>
                        <Tooltip placement="top" title="Chỉnh sửa">
                            <EditOutlined
                                style={{ color: "#09A863", cursor: "pointer", marginRight: '1rem' }}
                                onClick={(e) => handleEdit(record)}
                            />
                        </Tooltip>
                        <Popconfirm
                            title="Bạn chắc chắn xóa?"
                            onConfirm={() => handleDelete(record)}
                            cancelText="Hủy"
                            okText="Đồng ý"
                        >
                            <Tooltip placement="top" title="Xóa">
                                <DeleteOutlined
                                    style={{ color: "red", cursor: "pointer" }}
                                />
                            </Tooltip>
                        </Popconfirm>
                    </div>
                )
            },
        },
    ]

    return (
        <Card
            title={`Danh sách phiên bản kiểm tra`}
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
            <Row style={{ justifyContent: "space-between" }}>
                <Col sm="4" style={{ display: "flex", justifyContent: "flex-end" }}>
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
                <Col sm="7" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        onClick={(e) => setIsAdd(true)}
                        color="primary"
                        className="addBtn"
                        style={{
                            width: "100px",
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

            <AddNewCheckingDocumentVersion open={isAdd} handleModal={handleModal} getData={getData} rowsPerPage={rowsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} checkingDocumentSelected={checkingDocumentSelected} listSubmit={listSubmit} onUpdate={onUpdate} />
            {checkingDocumentVersionSelected && <EditCheckingDocumentVersion open={isEdit} handleModal={handleModal} getData={getData} rowsPerPage={rowsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} infoEditVersion={checkingDocumentVersionSelected} listSubmit={listSubmit} dataCheckingDocument={checkingDocumentSelected} onUpdate={onUpdate} />}
        </Card>
    )
}
export default VersionModal

