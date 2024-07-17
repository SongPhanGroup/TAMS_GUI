// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect, useContext } from 'react'
// imprt thư viện của bảng
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'

//import icon
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, MoreVertical, Trash, Edit, Search, Divide, Command, MinusCircle } from 'react-feather'

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
import { deleteDocument, getDocument } from '../../../api/document'
import AddNewDocument from './modal/AddNewModal'
import EditDocument from './modal/EditModal'
import { toDateString } from '../../../utility/Utils'
import { extractingFromAllDoc, extractingFromDoc } from '../../../api/sentence_doc'
import { getCourse } from '../../../api/course'
import { getDocumentType } from '../../../api/document_type'
import { getMajor } from '../../../api/major'

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const Document = () => {
    const ability = useContext(AbilityContext)
    // ** States
    const [loading, setLoading] = useState(true)
    const [modalAddNew, setModalAddNew] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchValue, setSearchValue] = useState('')
    const [courseId, setCourseId] = useState()
    const [typeId, setTypeId] = useState()
    const [majorId, setMajorId] = useState()
    // const [filteredData, setFilteredData] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [data, setData] = useState([])
    const [totalCount, setTotalCount] = useState()
    const [dataEdit, setDataEdit] = useState()
    // const [infoDelete, setInfoDelete] = useState()
    const handleEditModal = (data) => {
        setDataEdit(data)
        setModalEdit(!modalEdit)
    }

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

    const fetchDocument = () => {
        getDocument({
            params: {
                page: currentPage,
                pageSize: perPage,
                search: searchValue || "",
                courseId,
                typeId,
                majorId
            }
        }).then(res => {
            setData(res?.data)
            setTotalCount(res?.pagination?.totalRecords)
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        fetchDocument()
        getAllDataPromises()
    }, [currentPage, searchValue, perPage, courseId, typeId, majorId])

    const handleAddModal = () => {
        setModalAddNew(!modalAddNew)
    }

    const handleDeleteDocument = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa tài liệu này không?',
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
                deleteDocument(data).then(result => {
                    if (result.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Xóa tài liệu thành công!',
                            text: 'Yêu cầu đã được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa tài liệu thất bại!',
                            text: 'Yêu cầu chưa được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-danger'
                            }
                        })
                    }
                    fetchDocument()
                }).catch(error => {
                    console.log(error)
                })
            } else {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không xóa tài liệu!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })
    }

    const handleExtractingFromDoc = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn tách câu trong tài liệu này không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tách câu',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                extractingFromDoc(data).then((result) => {
                    if (result?.status === 'success') {
                        Swal.fire({
                            title: `${result?.message}`,
                            text: "Yêu cầu đã được phê duyệt!",
                            icon: "success",
                            customClass: {
                                confirmButton: "btn btn-success"
                            }
                        })
                    } else {
                        Swal.fire({
                            title: `${result?.message}`,
                            text: "Yêu cầu chưa được phê duyệt!",
                            icon: "error",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        })
                    }
                }).catch(error => {
                    Swal.fire({
                        title: `${error}`,
                        text: "Yêu cầu chưa được phê duyệt!",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        }
                    })
                })
            } else {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không tách câu trong tài liệu!',
                    icon: 'error',
                    customClass: {
                        confirmButton: 'btn btn-success'
                    }
                })
            }
        })

    }

    const handleExtractingFromAllDoc = () => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn tách câu tất cả tài liệu không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Tách câu',
            cancelButtonText: 'Hủy',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                extractingFromAllDoc().then((result) => {
                    if (result?.status === 'success') {
                        Swal.fire({
                            title: `${result?.message}`,
                            text: "Yêu cầu đã được phê duyệt!",
                            icon: "success",
                            customClass: {
                                confirmButton: "btn btn-success"
                            }
                        })
                    } else {
                        Swal.fire({
                            title: `${result?.message}`,
                            text: "Yêu cầu chưa được phê duyệt!",
                            icon: "error",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        })
                    }
                }).catch(error => {
                    Swal.fire({
                        title: `${error}`,
                        text: "Yêu cầu chưa được phê duyệt!",
                        icon: "error",
                        customClass: {
                            confirmButton: "btn btn-danger"
                        }
                    })
                })
            } else {
                Swal.fire({
                    title: 'Hủy bỏ!',
                    text: 'Không tách câu tất cả tài liệu!',
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
            minWidth: "50px",
            selector: row => row.title
        },
        // {
        //     name: "Khóa học",
        //     center: true,
        //     minWidth: "50px",
        //     selector: row => row.course
        // },
        {
            name: "Tên tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => row.name
        },
        // {
        //     name: "Link",
        //     center: true,
        //     minWidth: "400px",
        //     selector: row => row.link
        // },
        {
            name: "Ngày tạo mới",
            center: true,
            minWidth: "50px",
            cell: (row) => <span>{toDateString(row.createdAt)}</span>
        },
        // {
        //     name: 'Mô tả',
        //     center: true,
        //     minWidth: '100px',
        //     selector: row => row.description
        // },
        {
            name: "Trạng thái",
            center: true,
            minWidth: "150px",
            cell: (row) => {
                if (row.status === 1) {
                    return <Badge color='light-success'>Đã xử lý</Badge>
                } else {
                    return <Badge color='light-danger'>Chưa được xử lý</Badge>
                }
            }
        },
        {
            name: 'Tác vụ',
            minWidth: "110px",
            center: true,
            cell: (row) => {
                return (
                    <div className="column-action d-flex align-items-center">
                        {ability.can('update', 'nguoidung') &&
                            <div id="tooltip_edit" onClick={() => handleEditModal(row)}>
                                <Edit
                                    size={15}
                                    style={{ cursor: "pointer", stroke: '#09A863' }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_edit'>
                                    Sửa tài liệu
                                </UncontrolledTooltip>
                            </div>}
                        {ability.can('delete', 'nguoidung') &&
                            <div id="tooltip_trash" style={{ marginRight: '1rem', marginLeft: '1rem' }} onClick={() => handleDeleteDocument(row.id)}>
                                <Trash
                                    size={15}
                                    style={{ cursor: "pointer", stroke: "red" }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_trash'>
                                    Xóa tài liệu
                                </UncontrolledTooltip>
                            </div>}
                        <div id="tooltip_extracting" onClick={() => handleExtractingFromDoc(row.id)}>
                            <Command
                                size={15}
                                style={{ cursor: "pointer", stroke: "blue" }}
                            />
                            <UncontrolledTooltip placement='top' target='tooltip_extracting'>
                                Tách câu từ tài liệu
                            </UncontrolledTooltip>
                        </div>
                    </div>
                )
            }
        }
    ]
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
            setCourseId(value?.value)
        } else {
            setCourseId()
        }
    }

    const handleChangeDocumentType = (value) => {
        if (value) {
            setTypeId(value?.value)
        } else {
            setTypeId()
        }
    }

    const handleChangeMajor = (value) => {
        if (value) {
            setMajorId(value?.value)
        } else {
            setMajorId()
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

    return (
        <Fragment>
            <Card style={{ backgroundColor: 'white' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Danh sách tài liệu</CardTitle>
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
                        <Button className='ms-2' color='warning' onClick={handleExtractingFromAllDoc}>
                            <MinusCircle size={15} />
                            <span className='align-middle ms-50'>Tách câu từ tất cả tài liệu</span>
                        </Button>
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-between mt-1' md='12' sm='12' style={{ padding: '0 20px' }}>
                        <div className='d-flex align-items-center gap-2'>
                            <Select placeholder="Chọn khóa học" className='mb-50 select-custom' options={listCourse} isClearable onChange={(value) => handleChangeCourse(value)} />
                            <Select placeholder="Chọn loại tài liệu" className='mb-50 select-custom' options={listDocumentType} isClearable onChange={(value) => handleChangeDocumentType(value)} />
                            <Select placeholder="Chọn chuyên ngành" className='mb-50 select-custom' options={listMajor} isClearable onChange={(value) => handleChangeMajor(value)} />
                        </div>
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
                        paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                        // data={searchValue.length ? filteredData.data : data.data}
                        data={data}
                        paginationServer
                        paginationTotalRows={totalCount}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Số hàng trên 1 trang:'
                        }}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePagination}
                    />}
                </div>
            </Card >
            <AddNewDocument open={modalAddNew} handleAddModal={handleAddModal} getData={fetchDocument} />
            {dataEdit && <EditDocument open={modalEdit} handleEditModal={handleEditModal} getData={fetchDocument} dataEdit={dataEdit} />}
        </Fragment >
    )
}

export default Document