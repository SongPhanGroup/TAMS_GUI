// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect, useRef, useContext } from 'react'
// imprt thư viện của bảng
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

//import icon
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Trash, Edit, Search } from 'react-feather'

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
import { toDateString } from '../../../utility/Utils'
import { deleteCheckingDocumentVersion, detailCheckingDocumentVersion, getCheckingDocumentVersion } from '../../../api/checking_document_version'
import AddNewCheckingDocumentVersion from './modal/AddNewModal'
import EditCheckingDocumentVersion from './modal/EditModal'
import { getCourse } from '../../../api/course'
import { getCheckingDocument } from '../../../api/checking_document'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const CheckingDocumentVersion = () => {
    const ability = useContext(AbilityContext)
    const inputFile = useRef(null)
    // ** States
    const [loading, setLoading] = useState(true)
    const [modalAddNew, setModalAddNew] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [courseId, setCourseId] = useState()
    const [checkingDocumentId, setCheckingDocumentId] = useState()
    // const [filteredData, setFilteredData] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [dataCheckingDocumentVersion, setDataCheckingDocumentVersion] = useState([])
    const [totalCount, setTotalCount] = useState()
    const [dataEdit, setDataEdit] = useState()
    // const [infoDelete, setInfoDelete] = useState()
    const handleEditModal = (data) => {
        setDataEdit(data)
        setModalEdit(!modalEdit)
    }

    const [listCourse, setListCourse] = useState([])
    const [listCheckingDocument, setListCheckingDocument] = useState([])

    const getAllDataPromises = async () => {
        const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })
        const checkingDocumentPromise = getCheckingDocument({ params: { page: 1, perPage: 10, search: '' } })

        const promises = [coursePromise, checkingDocumentPromise]
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
        const checkingDocumentRes = responseData[1]
        results.map((res) => {
            if (res.status !== 'fulfilled') {
                setListCourse(null)
                setListCheckingDocument(null)
            }
        })
        const courses = courseRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.name}`
            }
        })
        const checkingDocuments = checkingDocumentRes?.data?.map((res) => {
            return {
                value: res.id,
                label: `${res.title}`
            }
        })
        setListCourse(courses)
        setListCheckingDocument(checkingDocuments)
    }

    const fetchCheckingDocumentVersion = () => {
        getCheckingDocumentVersion({
            params: {
                page: currentPage.toString(),
                perPage: perPage.toString(),
                search: searchValue || "",
                courseId,
                checkingDocumentId
            }
        }).then(res => {
            setDataCheckingDocumentVersion(res.data)
            setTotalCount(res?.pagination?.totalRecords)
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchCheckingDocumentVersion()
        getAllDataPromises()
    }, [currentPage, searchValue, perPage, courseId, checkingDocumentId])

    const handleAddModal = () => {
        setModalAddNew(!modalAddNew)
    }

    const handleDeleteCheckingDocumentVersion = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa phiên bản tài liệu kiểm tra này không?',
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
                            title: 'Xóa phiên bản tài liệu kiểm tra thành công!',
                            text: 'Yêu cầu đã được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa phiên bản tài liệu kiểm tra thất bại!',
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
                    text: 'Không xóa phiên bản tài liệu kiểm tra!',
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
            name: "Tên tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.fileName}</span>
        },
        {
            name: "Đợt kiểm tra",
            center: true,
            minWidth: "50px",
            selector: row => row.courseId
        },
        {
            name: "Kiểm tra tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => row.checkingDocumentId
        },
        {
            name: "Ngày kiểm tra",
            center: true,
            minWidth: "100px",
            cell: (row) => <span>{toDateString(row.createdAt)}</span>
        },
        {
            name: 'Mô tả',
            center: true,
            minWidth: '100px',
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
                            <div id="tooltip_edit" style={{ marginRight: '1rem' }} onClick={() => handleEditModal(row)}>
                                <Edit
                                    size={15}
                                    style={{ cursor: "pointer", stroke: '#09A863' }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_edit'>
                                    Sửa phiên bản tài liệu kiểm tra
                                </UncontrolledTooltip>
                            </div>}
                        {ability.can('delete', 'nguoidung') &&
                            <div id="tooltip_trash" onClick={() => handleDeleteCheckingDocumentVersion(row.id)}>
                                <Trash
                                    size={15}
                                    style={{ cursor: "pointer", stroke: "red" }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_trash'>
                                    Xóa tài liệu
                                </UncontrolledTooltip>
                            </div>}
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
    // ** Function to handle modalThemNND toggle
    // const handleModalThemNND = () => setModalThemNND(!modalThemNND)
    // const handleModalSuaNND = () => setModalSuaNND(!modalSuaNND)
    // const handleModalXoaNND = () => setModalXoaNND(!modalXoaNND)

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
            setCourseId(value.value)
        } else {
            setCourseId()
        }
    }

    const handleChangeCheckingDocument = (value) => {
        if (value) {
            setCheckingDocumentId(value.value)
        } else {
            setCheckingDocumentId()
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

    const subColumns = [
        {
            name: "STT",
            center: true,
            width: '100px',
            cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
        },
        {
            name: "Mã kết quả",
            center: true,
            width: '100px',
            selector: row => row.id
        },
        {
            name: "Loại kiểm tra",
            center: true,
            minWidth: "200px",
            selector: row => row.type_checking_id
        },
        {
            name: "Tổng số câu trùng",
            center: true,
            minWidth: "50px",
            selector: row => row.similarity_total
        }
    ]

    const ExpandedComponent = ({ data }) => {
        const [dataDetailById, setDataDetailById] = useState([])

        useEffect(() => {
            detailCheckingDocumentVersion(data?.id).then((result) => {
                const documentResult = result?.data?.documentResult
                if (Array.isArray(documentResult)) {
                    setDataDetailById(documentResult)
                } else {
                    console.error('Unexpected data format:', documentResult)
                }
            }).catch(error => {
                console.log(error)
            })
        }, [data?.id])

        return (
            <>
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
            </>
        )
    }

    // const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

    return (
        <Fragment>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={e => handleImportFile(e)} />
            <Card style={{ backgroundColor: 'white' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Danh sách phiên bản tài liệu kiểm tra</CardTitle>
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
                                style={{width: '300px'}}
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
                        <div className='d-flex align-items-center gap-2'>
                            <Select placeholder="Chọn khóa học" className='mb-50 select-custom' options={listCourse} isClearable onChange={(value) => handleChangeCourse(value)} />
                            <Select placeholder="Chọn KT tài liệu theo đợt" className='mb-50 select-custom' options={listCheckingDocument} isClearable onChange={(value) => handleChangeCheckingDocument(value)} />
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
                        data={dataCheckingDocumentVersion}
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
            <AddNewCheckingDocumentVersion open={modalAddNew} handleAddModal={handleAddModal} getData={fetchCheckingDocumentVersion} />
            {dataEdit && <EditCheckingDocumentVersion open={modalEdit} handleEditModal={handleEditModal} getData={fetchCheckingDocumentVersion} dataEdit={dataEdit} />}
        </Fragment >
    )
}

export default CheckingDocumentVersion