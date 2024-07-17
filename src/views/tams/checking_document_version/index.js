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

    const fetchCheckingDocumentVersion = () => {
        getCheckingDocumentVersion({
            params: {
                page: currentPage.toString(),
                perPage: perPage.toString(),
                search: searchValue || ""
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
    }, [currentPage, searchValue, perPage])

    const handleAddModal = () => {
        setModalAddNew(!modalAddNew)
    }

    const handleDeleteCheckingDocumentVersion = (data) => {
        return Swal.fire({
            title: '',
            text: 'Bạn có muốn xóa kiểm tra tài liệu này không?',
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
                            title: 'Xóa kiểm tra tài liệu thành công!',
                            text: 'Yêu cầu đã được phê duyệt',
                            customClass: {
                                confirmButton: 'btn btn-success'
                            }
                        })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Xóa kiểm tra tài liệu thất bại!',
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
                    text: 'Không xóa kiểm tra tài liệu!',
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
            minWidth: "50px",
            selector: row => row.title
        },
        {
            name: "Khóa học",
            center: true,
            minWidth: "50px"
            // selector: row => <span>{JSON.parse(row.course.name)}</span>
        },
        {
            name: "Tác giả",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.author}</span>
        },
        {
            name: "Ngày kiểm tra",
            center: true,
            minWidth: "100px",
            cell: (row) => <span>{toDateString(row.createdAt)}</span>
        },
        {
            name: "Ngôn ngữ",
            center: true,
            minWidth: "100px",
            cell: (row) => row.language
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
                                    Sửa kiểm tra tài liệu
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
            name: "Mã tài liệu",
            center: true,
            width: '100px',
            selector: row => row.id
        },
        {
            name: "Tên tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => row.name
        },
        {
            name: "Khóa học",
            center: true,
            minWidth: "50px"
            // selector: row => row.course
        },
        {
            name: "Tên tác giả",
            center: true,
            minWidth: "200px"
            // selector: row => <span style={{
            //     whiteSpace: 'break-spaces'
            // }}>{row.name}</span>
        },
        {
            name: "Phần trăm trùng",
            center: true,
            minWidth: "50px",
            selector: row => row.percentage
        }
    ]

    const ExpandedComponent = ({data}) => {
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
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-between mt-1' md='12' sm='12' style={{ paddingRight: '20px' }}>
                        <div className='d-flex align-items-center'>
                            <Label className='me-1' for='search-input'>
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