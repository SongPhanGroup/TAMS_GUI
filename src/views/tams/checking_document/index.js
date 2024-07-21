// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect, useContext } from 'react'
// imprt thư viện của bảng
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

//import icon
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Trash, Edit, Search, BarChart, CheckSquare } from 'react-feather'

//import css
import '@styles/react/libs/tables/react-dataTable-component.scss'

// import API

//import thư viện
// import { TemplateHandler } from "easy-template-x"
// import { saveFile } from '../../utils/util'
// import readXlsxFile from 'read-excel-file/web-worker'
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import { AbilityContext } from '@src/utility/context/Can'
import WaitingModal from '../../../views/ui-elements/waiting-modals'
import Select from 'react-select'
import Flatpickr from "react-flatpickr"
import { Vietnamese } from "flatpickr/dist/l10n/vn.js"
import "@styles/react/libs/flatpickr/flatpickr.scss"
// ** Reactstrap Import
import {
    Row,
    Col,
    Card,
    Input,
    Label,
    Button,
    CardTitle,
    CardHeader,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledButtonDropdown,
    UncontrolledDropdown,
    Badge,
    UncontrolledTooltip
} from 'reactstrap'
import { toDateTimeString } from '../../../utility/Utils'
import { deleteCheckingDocument, detailCheckingDocument, getCheckingDocument } from '../../../api/checking_document'
import AddNewCheckingDocument from './modal/AddNewModal'
import EditCheckingDocument from './modal/EditModal'
import { getCourse } from '../../../api/course'
import ResultCheckingDocument from './modal/ResultModal'
import { deleteCheckingDocumentVersion } from '../../../api/checking_document_version'
import AddNewCheckingDocumentVersion from './modalVersion/AddNewModal'
import EditCheckingDocumentVersion from './modalVersion/EditModal'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const CheckingDocument = () => {
    const ability = useContext(AbilityContext)
    // ** States
    const [loading, setLoading] = useState(true)
    const [modalAddNew, setModalAddNew] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalResult, setModalResult] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [courseId, setCourseId] = useState()
    // const [filteredData, setFilteredData] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [dataCheckingDocument, setDataCheckingDocument] = useState([])
    const [totalCount, setTotalCount] = useState()
    const [dataEdit, setDataEdit] = useState()

    // const [infoDelete, setInfoDelete] = useState()
    const handleEditModal = (data) => {
        setDataEdit(data)
        setModalEdit(!modalEdit)
    }

    const handleResultModal = (data) => {
        setDataEdit(data)
        setModalResult(!modalResult)
    }

    const [listCourse, setListCourse] = useState([])

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })

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

    const fetchCheckingDocument = () => {
        getCheckingDocument({
            params: {
                page: currentPage.toString(),
                pageSize: perPage.toString(),
                search: searchValue || "",
                courseId
            }
        }).then(res => {
            setDataCheckingDocument(res.data)
            setTotalCount(res?.pagination?.totalRecords)
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        getAllDataPromises()
    }, [])

    useEffect(() => {
        fetchCheckingDocument()
    }, [currentPage, searchValue, perPage, courseId])

    const handleAddModal = () => {
        setModalAddNew(!modalAddNew)
    }

    const handleDeleteCheckingDocument = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa tài liệu kiểm tra này không?',
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
                deleteCheckingDocument(data).then(result => {
                    if (result.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Xóa tài liệu kiểm tra thành công!',
                            text: 'Yêu cầu đã được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa tài liệu kiểm tra thất bại!',
                            text: 'Yêu cầu chưa được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                    fetchCheckingDocument()
                }).catch(error => {
                    console.log(error)
                })
            } else {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không xóa tài liệu kiểm tra!',
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
            center: true,
            width: '70px',
            cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
        },
        {
            name: "Tiêu đề",
            center: true,
            minWidth: "400px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.title}</span>
        },
        {
            name: "Đợt kiểm tra",
            center: true,
            minWidth: "50px",
            selector: row => <span>{row?.course?.name}</span>
        },
        {
            name: "Tác giả",
            center: true,
            minWidth: "100px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.author}</span>
        },
        {
            name: "Ngày kiểm tra",
            center: true,
            minWidth: "200px",
            cell: (row) => <span style={{ textAlign: 'center' }}>{toDateTimeString(row.createdAt)}</span>
        },
        {
            name: 'Mô tả',
            center: true,
            minWidth: '100px',
            selector: row => row.description
        },
        {
            name: 'Trùng lặp (%)',
            center: true,
            minWidth: '100px',
            selector: row => row.percentage
        },
        {
            name: 'Tác vụ',
            minWidth: "100px",
            center: true,
            cell: (row) => {
                return (
                    <div className="column-action d-flex align-items-center">
                        {ability.can('update', 'nguoidung') &&
                            <div id="tooltip_edit" style={{ marginRight: '1rem' }} onClick={() => handleEditModal(row)}>
                                <Edit
                                    size={15}
                                    style={{ cursor: "pointer", stroke: '#09A863' }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_edit'>
                                    Sửa tài liệu kiểm tra
                                </UncontrolledTooltip>
                            </div>}
                        {ability.can('delete', 'nguoidung') &&
                            <div id="tooltip_trash" style={{ marginRight: '1rem' }} onClick={() => handleDeleteCheckingDocument(row.id)}>
                                <Trash
                                    size={15}
                                    style={{ cursor: "pointer", stroke: "red" }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_trash'>
                                    Xóa tài liệu
                                </UncontrolledTooltip>
                            </div>}
                        <div id="tooltip_result" onClick={() => handleResultModal(row)}>
                            <CheckSquare
                                size={15}
                                style={{ cursor: "pointer", stroke: "blue" }}
                            />
                            <UncontrolledTooltip placement='top' target='tooltip_result'>
                                Kết quả kiểm tra
                            </UncontrolledTooltip>
                        </div>
                    </div>
                )
            }
        }
    ]

    const customStyles = {
        rows: {
            style: {
                minHeight: '50px',
                alignItems: 'center' // chiều cao tối thiểu của hàng
            }
        }
    }

    // const customStylesSelect = {
    //     option: (provided) => ({
    //         ...provided,
    //         height: 24, // Điều chỉnh chiều cao của mỗi tùy chọn
    //         display: 'flex',
    //         alignItems: 'center' // Căn giữa văn bản theo chiều dọc
    //     })
    // }

    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page)
    }
    const handlePerRowsChange = (perPage, page) => {
        setCurrentPage(page)
        setPerPage(perPage)
    }

    const handleChangeCourse = (value) => {
        if (value) {
            setCourseId(value?.value)
        } else {
            setCourseId()
        }
    }

    // ** Custom Pagination
    // const CustomPagination = () => (
    //     <ReactPaginate
    //         previousLabel=''
    //         nextLabel=''
    //         forcePage={currentPage}
    //         onPageChange={page => handlePagination(page)}
    //         // pageCount={searchValue.length ? Math.ceil(filteredData.totalCount / 7) : Math.ceil(data.totalCount / 7) || 1}
    //         pageCount={Math.ceil(data.totalCount / perPage) || 1}
    //         breakLabel='...'
    //         pageRangeDisplayed={2}
    //         marginPagesDisplayed={2}
    //         activeClassName='active'
    //         pageClassName='page-item'
    //         breakClassName='page-item'
    //         nextLinkClassName='page-link'
    //         pageLinkClassName='page-link'
    //         breakLinkClassName='page-link'
    //         previousLinkClassName='page-link'
    //         nextClassName='page-item next-item'
    //         previousClassName='page-item prev-item'
    //         containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    //     />
    // )

    const handleDeleteCheckingDocumentVersion = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa phiên bản kiểm tra này không?',
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
                deleteCheckingDocumentVersion(data).then(result => {
                    if (result.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Xóa phiên bản kiểm tra thành công!',
                            text: 'Yêu cầu đã được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa phiên bản kiểm tra thất bại!',
                            text: 'Yêu cầu chưa được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                    fetchCheckingDocumentVersion()
                }).catch(error => {
                    console.log(error)
                })
            } else {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không xóa phiên bản kiểm tra!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })
    }

    const ExpandedComponent = ({ data }) => {
        
        const [modalVersionAddNew, setModalVersionAddNew] = useState(false)
        const [modalVersionEdit, setModalVersionEdit] = useState(false)
        const [dataDetailById, setDataDetailById] = useState([])

        const handleAddModalVersion = () => {
            setModalVersionAddNew(!modalVersionAddNew)
        }

        const handleEditModalVersion = () => {
            setModalVersionEdit(!modalVersionEdit)
        }

        const fetchCheckingDocumentVersion = () => {
            detailCheckingDocument(data?.id).then((result) => {
                const checkingDocumentVersion = result?.data?.checkingDocumentVersion
                if (Array.isArray(checkingDocumentVersion)) {
                    setDataDetailById(checkingDocumentVersion)
                } else {
                    console.error('Unexpected data format:', checkingDocumentVersion)
                }
            }).catch(error => {
                console.log(error)
            })
        }

        useEffect(() => {
            fetchCheckingDocumentVersion()
        }, [data?.id])

        const subColumns = [
            {
                name: "STT",
                center: true,
                width: '100px',
                cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
            },
            {
                name: "Tên tài liệu",
                center: true,
                width: '500px',
                selector: row => <span style={{
                    whiteSpace: 'break-spaces'
                }}>{row.fileName}</span>
            },
            {
                name: "Phiên bản",
                center: true,
                minWidth: "50px",
                selector: row => row.version
            },
            {
                name: 'Mô tả',
                center: true,
                minWidth: '200px',
                selector: row => row.description
            },
            {
                name: 'Tác vụ',
                minWidth: "100px",
                center: true,
                cell: (row) => {
                    return (
                        <div className="column-action d-flex align-items-center">
                            {ability.can('update', 'nguoidung') &&
                                <div id="tooltip_edit" style={{ marginRight: '1rem' }} onClick={() => handleEditModalVersion(row)}>
                                    <Edit
                                        size={15}
                                        style={{ cursor: "pointer", stroke: '#09A863' }}
                                    />
                                    <UncontrolledTooltip placement='top' target='tooltip_edit'>
                                        Sửa phiên bản kiểm tra
                                    </UncontrolledTooltip>
                                </div>}
                            {ability.can('delete', 'nguoidung') &&
                                <div id="tooltip_trash" style={{ marginRight: '1rem' }} onClick={() => handleDeleteCheckingDocumentVersion(row)}>
                                    <Trash
                                        size={15}
                                        style={{ cursor: "pointer", stroke: "red" }}
                                    />
                                    <UncontrolledTooltip placement='top' target='tooltip_trash'>
                                        Xóa phiên bản
                                    </UncontrolledTooltip>
                                </div>}
                        </div>
                    )
                }
            }
        ]
        
        return (
            <Fragment>
                <Card style={{ backgroundColor: 'white' }}>
                    <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                        <CardTitle tag='h4'>Danh sách phiên bản kiểm tra</CardTitle>
                        <div className='d-flex mt-md-0 mt-1'>
                            {ability.can('add', 'nguoidung') &&
                                <Button className='ms-2' color='primary' onClick={handleAddModalVersion}>
                                    <Plus size={15} />
                                    <span className='align-middle ms-50'>Thêm mới</span>
                                </Button>}
                        </div>
                    </CardHeader>
                    <Row className='justify-content-end mx-0'>
                        <Col className='d-flex align-items-center justify-content-start mt-1 gap-2' md='12' sm='12' style={{ paddingRight: '20px' }}>
                            <div className='d-flex align-items-center'>
                                <Label className='' for='search-input' style={{ minWidth: '65px' }}>
                                    Tìm kiếm
                                </Label>
                                <Input
                                    style={{ width: '500px' }}
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
                            // pagination
                            columns={subColumns}
                            // paginationPerPage={perPage}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            selectableRowsComponent={BootstrapCheckbox}
                            // data={searchValue.length ? filteredData.data : data.data}
                            data={dataDetailById}
                            // paginationServer
                            // paginationTotalRows={totalCount}
                            // paginationComponentOptions={{
                            //     rowsPerPageText: 'Số hàng trên 1 trang:'
                            // }}
                            // onChangeRowsPerPage={handlePerRowsChange}
                            // onChangePage={handlePagination}
                            customStyles={customStyles}
                        />}
                    </div>
                </Card>
                <AddNewCheckingDocumentVersion open={modalVersionAddNew} handleAddModalVersion={handleAddModalVersion} getData={fetchCheckingDocumentVersion} />
                {dataDetailById && <EditCheckingDocumentVersion open={modalVersionEdit} handleEditModalVersion={handleEditModalVersion} getData={fetchCheckingDocumentVersion} dataDetailById={dataDetailById} />}
            </Fragment>
        )
    }

    return (
        <Fragment>
            <Card style={{ backgroundColor: 'white' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Danh sách tài liệu kiểm tra</CardTitle>
                    <div className='d-flex mt-md-0 mt-1'>
                        {/* <UncontrolledButtonDropdown>
                            <DropdownToggle color='secondary' caret outline>
                                <Share size={15} />
                                <span className='align-middle ms-50'>Tùy chọn</span>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='w-100'>
                                    <Printer size={15} />
                                    <span className='align-middle ms-50 ' onClick={onImportFileClick}>Nhập từ file excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileDocx(data)}>
                                    <FileText size={15} />
                                    <span className='align-middle ms-50'>Xuất file docx</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileExcel(data)}>
                                    <Grid size={15} />
                                    <span className='align-middle ms-50'> Xuất file Excel</span>
                                </DropdownItem>
                                <DropdownItem className='w-100' onClick={() => handleExportFileTemplate()}>
                                    <File size={15} />
                                    <span className='align-middle ms-50'>Tải file nhập mẫu</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown> */}
                        {ability.can('add', 'nguoidung') &&
                            <Button className='ms-2' color='primary' onClick={handleAddModal}>
                                <Plus size={15} />
                                <span className='align-middle ms-50'>Thêm mới</span>
                            </Button>}
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-start mt-1 gap-2' md='12' sm='12' style={{ paddingRight: '20px' }}>
                        <div className='d-flex align-items-center'>
                            <Label className='' for='search-input' style={{ minWidth: '65px' }}>
                                Tìm kiếm
                            </Label>
                            <Input
                                style={{ width: '500px' }}
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
                        <Select placeholder="Chọn đợt kiểm tra" className='mb-50 select-custom' options={listCourse} isClearable onChange={(value) => handleChangeCourse(value)} />
                        <div className='d-flex align-items-center'>
                            <Label className='' for='search-input' style={{ minWidth: '100px' }}>
                                Ngày kiểm tra
                            </Label>
                            <Flatpickr
                                style={{ padding: '0.35rem 1rem' }}
                                className="form-control invoice-edit-input date-picker mb-50"
                                options={{
                                    dateFormat: "d-m-Y", // format ngày giờ
                                    locale: {
                                        ...Vietnamese
                                    },
                                    defaultDate: new Date()
                                }}
                                placeholder="dd/mm/yyyy"
                            />
                        </div>
                    </Col>
                </Row>
                <div className='react-dataTable react-dataTable-selectable-rows' style={{ marginRight: '20px', marginLeft: '20px' }}>
                    {loading ? <WaitingModal /> : <DataTable
                        noHeader
                        pagination
                        columns={columns}
                        paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                        // data={searchValue.length ? filteredData.data : data.data}
                        data={dataCheckingDocument}
                        paginationServer
                        paginationTotalRows={totalCount}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Số hàng trên 1 trang:'
                        }}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePagination}
                        customStyles={customStyles}
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
                        expandOnRowClicked
                    />}
                </div>
            </Card >
            <AddNewCheckingDocument open={modalAddNew} handleAddModal={handleAddModal} getData={fetchCheckingDocument} />
            {dataEdit && <EditCheckingDocument open={modalEdit} handleEditModal={handleEditModal} getData={fetchCheckingDocument} dataEdit={dataEdit} />}
            {dataEdit && <ResultCheckingDocument open={modalResult} handleResultModal={handleResultModal} getData={fetchCheckingDocument} dataEdit={dataEdit} />}
        </Fragment >
    )
}

export default CheckingDocument