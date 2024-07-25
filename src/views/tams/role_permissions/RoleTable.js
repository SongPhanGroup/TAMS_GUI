// ** React Imports
import React, { Fragment, useState, forwardRef, useEffect, useRef } from 'react'

// ** Table Data & Columns

// ** Third Party Components
import ReactPaginate from 'react-paginate'

import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus, adge, MoreVertical, Trash, Edit, Search } from 'react-feather'

import '@styles/react/libs/tables/react-dataTable-component.scss'

import { TemplateHandler } from "easy-template-x"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { getUser } from '../../../api/user'
// ** Reactstrap Imports
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
import WaitingModal from '../../../views/ui-elements/waiting-modals'
// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const NhomNguoiDung = ({ setReload, reload }) => {
    const inputFile = useRef(null)
    // ** States
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [modalEdit, setModalEdit] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [searchValue, setSearchValue] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [perPage, setPerPage] = useState(10)
    const [data, setData] = useState({
        data: [],
        totalCount: 0
    })
    const [info, setInfo] = useState()
    const handleEdit = (data) => {
        setInfo(data)
        setModalEdit(true)
    }
    const handleDelete = (data) => {
        setInfo(data)
        setModalDelete(true)
    }
    const columns = [
        {
            name: "STT",
            center: true,
            width: '70px',
            cell: (row, index) => ((currentPage * perPage) + index + 1)
        },
        {
            name: 'Tên Nhóm',
            width: '250px',
            sortable: row => row.tenNhom,
            cell: row => (
                <div className='d-flex align-items-center'>
                    <div className='user-info text-truncate ms-1'>
                        <span className='d-block fw-bold text-truncate'>{row.tenNhom}</span>
                    </div>
                </div>
            )
        },
        {
            name: 'Ghi chú',
            sortable: true,
            minWidth: '150px',
            selector: row => row.ghiChu
        },

        {
            name: 'Tác vụ',
            allowOverflow: true,
            width: '100px',
            center: true,
            cell: (row) => {
                return (
                    <div className="column-action d-flex align-items-center">
                        <div onClick={e => handleEdit(row)} id="tooltip_edit" style={{ marginRight: '1rem' }}>
                            <Edit
                                size={15}
                                style={{ cursor: "pointer", stroke: '#09a863' }}
                                className="mr-1"
                            />
                        </div>
                        <UncontrolledTooltip placement='top' target='tooltip_edit'>
                            Sửa thông tin nhóm người dùng              </UncontrolledTooltip>
                        <div onClick={e => handleDelete(row)} id="tooltip_trash" className='pl-1'>
                            <Trash
                                size={15}
                                style={{ cursor: "pointer", stroke: "red" }}
                                className="mr-1"
                            />
                            <UncontrolledTooltip placement='top' target='tooltip_trash'>
                                Xóa nhóm người dùng              </UncontrolledTooltip>
                        </div>
                    </div>
                )
            }
        }
    ]
    // ** Function to handle Modal toggle
    const handleModal = () => setModal(!modal)
    const handleModalEdit = () => setModalEdit(!modalEdit)
    const handleModalDelete = () => setModalDelete(!modalDelete)
    const fetchUser = () => {
        getUser({
            page: currentPage + 1,
            perPage
        }).then(res => {
            setData(res.result)
            setLoading(false)
        })
    }
    useEffect(() => {
        fetchUser()
    }, [currentPage, perPage])
    // ** Function to handle filte
    const handleFilter = (e) => {
        if (e === 'Enter') {
            searchListGroupUser({
                page: currentPage + 1,
                perPage,
                tenNhom: searchValue
            }).then(res => {
                setFilteredData(res.result)
            })
        }

    }
    const onImportFileClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click()
    }
    const handleImportFile = (e) => {
        const files = e.target.files[0]
        const MySwal = withReactContent(Swal)
        readXlsxFile(files).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            const temp = []
            rows.forEach(async (item, index) => {
                if (index > 5) {
                    const res = await createGroupUser({
                        tenNhom: item[1],
                        ghiChu: item[2]
                    })
                    if (res?.status) {
                        fetchUser()
                    } else {
                        MySwal.fire({
                            icon: "error",
                            title: "Có lỗi xảy ra",
                            text: "Vui lòng thử lại",
                            customClass: {
                                confirmButton: "btn btn-danger"
                            }
                        })
                    }
                }
            })
            MySwal.fire({
                icon: "success",
                title: 'Thành công',
                customClass: {
                    confirmButton: "btn btn-success"
                }
            })

        }).catch(error => {
            MySwal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: "File không đúng định dạng, vui lòng chọn file định dạng excel và nhập đúng các cột",
                customClass: {
                    confirmButton: "btn btn-danger"
                }
            })
        })

    }
    const handleExportFileExcel = async () => {
        const res = await exportGroupUser()
    }
    const handleExportFileTemplate = async () => {
        const res = await exportGroupUserTemplate()
    }
    // ** Function to handle Pagination
    const handlePagination = page => {
        setCurrentPage(page.selected)
    }
    const handlePerRowsChange = (perPage, page) => {
        setCurrentPage(page.selected)
        setPerPage(perPage)
    }
    // ** Custom Pagination
    const CustomPagination = () => (
        <ReactPaginate
            previousLabel=''
            nextLabel=''
            forcePage={currentPage}
            onPageChange={page => handlePagination(page)}
            breakLabel='...'
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName='active'
            pageClassName='page-item'
            breakClassName='page-item'
            nextLinkClassName='page-link'
            pageLinkClassName='page-link'
            breakLinkClassName='page-link'
            previousLinkClassName='page-link'
            nextClassName='page-item next-item'
            previousClassName='page-item prev-item'
            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
        />
    )


    // ** Converts table to CSV

    const handleExportFileDocx = async (data) => {
        const request = await fetch("/../../template/nhomnguoidung/dshoso.docx")
        const templateFile = await request.blob()
        const handler = new TemplateHandler()
        const docx = await handler.process(templateFile, data)
        saveFile("danhsachnhomnguoidung.docx", docx)
    }
    return (
        <Fragment>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={e => handleImportFile(e)} />
            <Card style={{ backgroundColor: 'white' }}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Danh sách vai trò</CardTitle>
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
                        <Button className='ms-2' color='primary' onClick={handleModal}>
                            <Plus size={15} />
                            <span className='align-middle ms-50'>Thêm mới</span>
                        </Button>
                    </div>
                </CardHeader>
                <Row className='justify-content-end mx-0'>
                    <Col className='d-flex align-items-center justify-content-end mt-1' md='6' sm='12' style={{ paddingRight: '20px' }}>
                        <Label className='me-1' for='search-input'>
                            Tìm kiếm
                        </Label>
                        <Input
                            className='dataTable-filter mb-50'
                            type='text'
                            bsSize='sm'
                            id='search-input'
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={e => handleFilter(e.key)}
                        />
                    </Col>
                </Row>
                <div className='react-dataTable react-dataTable-selectable-rows' style={{ marginRight: '20px', marginLeft: '20px' }}>
                    {loading ? <WaitingModal /> : <DataTable
                        noHeader
                        striped
                        className='react-dataTable'
                        columns={columns}
                        data={filteredData?.data ? filteredData.data : data?.data}
                        pagination
                        paginationServer
                        paginationTotalRows={filteredData?.data ? filteredData.totalCount : data?.totalCount}
                        paginationComponentOptions={{
                            rowsPerPageText: 'Số hàng trên 1 trang:'
                        }}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePagination}
                    />}
                </div>
            </Card>
            <AddNewModal
                open={modal}
                handleModal={handleModal}
                fetchUser={fetchUser}
                setReload={setReload}
                reload={reload} />
            {
                <EditModal open={modalEdit} handleModal={handleModalEdit} fetchUser={fetchUser} infoEdit={info} />
            }

        </Fragment>
    )
}

const AddNewModal = React.lazy(() => import("./modal/AddNewModal"))
const EditModal = React.lazy(() => import("./modal/EditModal"))

export default NhomNguoiDung
