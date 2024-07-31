// ** React Imports
// ** Reactstrap Imports
import {
    Col,
    FormFeedback,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Button,
    Form,
    UncontrolledTooltip,
    Card,
    CardHeader,
    CardTitle
} from "reactstrap"

// ** Third Party Components
import { AbilityContext } from '@src/utility/context/Can'

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { ChevronDown, Eye } from "react-feather"
import DataTable from "react-data-table-component"
import { forwardRef, Fragment, useContext } from "react"

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const ResultCheckingDocument = ({ open, handleResultModal, dataDetailById }) => {
    const ability = useContext(AbilityContext)

    // ** State
    // const [file, setFile] = useState()
    // const [listCourse, setListCourse] = useState([])

    // const getAllDataPromises = async () => {
    //     const coursePromise = getCourse({ params: { page: 1, perPage: 10, search: '' } })

    //     const promises = [coursePromise]
    //     const results = await Promise.allSettled(promises)
    //     const responseData = promises.reduce((acc, promise, index) => {
    //         if (results[index].status === 'fulfilled') {
    //             acc[index] = results[index].value
    //         } else {
    //             acc[index] = { error: results[index].reason }
    //         }
    //         return acc
    //     }, [])

    //     const courseRes = responseData[0]
    //     results.map((res) => {
    //         if (res.status !== 'fulfilled') {
    //             setListCourse(null)
    //         }
    //     })
    //     const courses = courseRes?.data?.map((res) => {
    //         return {
    //             value: res.id,
    //             label: `${res.name}`
    //         }
    //     })
    //     setListCourse(courses)
    // }

    // useEffect(() => {
    //     if (open) {
    //         getAllDataPromises()
    //     }
    // }, [open])

    const handleCloseModal = () => {
        handleResultModal()
    }

    console.log(dataDetailById)

    // const handleChangeFile = (event) => {
    //     const file = event.target.files[0]
    //     setFile(file)
    // }

    const firstColumns = [
        // {
        //     name: "STT",
        //     center: true,
        //     width: '100px',
        //     cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
        // },
        {
            name: "Tên tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.name}</span>
        },
        {
            name: "Tên tác giả",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.author}</span>
        },
        {
            name: "Lĩnh vực",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.majorId}</span>
        },
        {
            name: "Loại tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.documentType}</span>
        },
        {
            name: "Độ trùng lặp",
            center: true,
            minWidth: "100px",
            selector: row => row.percentage
        },
        {
            name: 'Tác vụ',
            minWidth: "100px",
            center: true,
            cell: () => {
                return (
                    <div className="column-action d-flex align-items-center">
                        {ability.can('update', 'nguoidung') &&
                            <div id="tooltip_detail" style={{ marginRight: '1rem' }}>
                                <Eye
                                    size={15}
                                    style={{ cursor: "pointer", stroke: '#09A863' }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_detail'>
                                    Chi tiết
                                </UncontrolledTooltip>
                            </div>}
                    </div>
                )
            }
        }
    ]

    const secondColumns = [
        // {
        //     name: "STT",
        //     center: true,
        //     width: '100px',
        //     cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
        // },
        {
            name: "Tên tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.name}</span>
        },
        {
            name: "Tên tác giả",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.author}</span>
        },
        {
            name: "Lĩnh vực",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.majorId}</span>
        },
        {
            name: "Loại tài liệu",
            center: true,
            minWidth: "200px",
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.documentType}</span>
        },
        {
            name: "Độ trùng lặp",
            center: true,
            minWidth: "100px",
            selector: row => row.percentage
        },
        {
            name: 'Tác vụ',
            minWidth: "100px",
            center: true,
            cell: () => {
                return (
                    <div className="column-action d-flex align-items-center">
                        {ability.can('update', 'nguoidung') &&
                            <div id="tooltip_detail" style={{ marginRight: '1rem' }}>
                                <Eye
                                    size={15}
                                    style={{ cursor: "pointer", stroke: '#09A863' }}
                                />
                                <UncontrolledTooltip placement='top' target='tooltip_detail'>
                                    Chi tiết
                                </UncontrolledTooltip>
                            </div>}
                    </div>
                )
            }
        }
    ]

    const ExpandedComponent = ({ data }) => {
        console.log(data)
        const subColumns = [
            // {
            //     name: "STT",
            //     center: true,
            //     width: '100px',
            //     cell: (row, index) => <span>{((currentPage - 1) * perPage) + index + 1}</span>
            // },
            {
                name: "Tên tài liệu",
                center: true,
                minWidth: "200px",
                selector: row => <span style={{
                    whiteSpace: 'break-spaces'
                }}>{row.name}</span>
            },
            {
                name: "Nội dung",
                center: true,
                minWidth: "100px",
                selector: row => row.content
            },
            {
                name: "Thứ tự trong VB kiểm tra",
                center: true,
                minWidth: "100px",
                selector: row => row.orderBySupervise
            },
            {
                name: "Thứ tự trong VB so sánh",
                center: true,
                minWidth: "100px",
                selector: row => row.orderByCompare
            }
        ]

        return (
            <Fragment>
                <Card style={{ backgroundColor: 'white' }}>
                    <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                        <CardTitle tag='h4'>Danh sách các câu trùng</CardTitle>
                    </CardHeader>
                    <Row className='justify-content-end mx-0'>
                        {/* <Col className='d-flex align-items-center justify-content-start mt-1 gap-2' md='12' sm='12' style={{ paddingRight: '20px' }}>
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
                        </Col> */}
                    </Row>
                    <div className='react-dataTable react-dataTable-selectable-rows' style={{ marginRight: '20px', marginLeft: '20px' }}>
                        <DataTable
                            noHeader
                            // pagination
                            columns={subColumns}
                            // paginationPerPage={perPage}
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10} />}
                            selectableRowsComponent={BootstrapCheckbox}
                            // data={searchValue.length ? filteredData.data : data.data}
                            data={[{name: 'Alo', content: '1111', orderByCompare: 'asc', orderBySupervise: '22'}]}
                            // paginationServer
                            // paginationTotalRows={totalCount}
                            // paginationComponentOptions={{
                            //     rowsPerPageText: 'Số hàng trên 1 trang:'
                            // }}
                            // onChangeRowsPerPage={handlePerRowsChange}
                            // onChangePage={handlePagination}
                        />
                    </div>
                </Card>
            </Fragment>
        )
    } 

    return (
        <Modal size="xl" isOpen={open} toggle={handleResultModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Kết quả kiểm tra tài liệu</h1>
                </div>
                <Row>
                    <h6>Kết quả trùng lặp so với CSDL mẫu: <span style={{ color: 'red' }}>85%</span></h6>
                </Row>
                <Row tag='form' className='gy-1 pt-75'>
                    <h6>Danh sách các tài liệu trùng lặp cao</h6>
                    <DataTable
                        noHeader
                        // pagination
                        columns={firstColumns}
                        // paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                        // data={searchValue.length ? filteredData.data : data.data}
                        data={[{ id: 1, name: 'Alo', courseId: 1, percentage: '85' }]}
                        // paginationServer
                        // paginationTotalRows={totalCount}
                        // paginationComponentOptions={{
                        //     rowsPerPageText: 'Số hàng trên 1 trang:'
                        // }}
                        // onChangeRowsPerPage={handlePerRowsChange}
                        // onChangePage={handlePagination}
                        // customStyles={customStyles}
                        expandableRows
                        expandableRowsComponent={(prev) => ExpandedComponent(prev)}
                        expandOnRowClicked
                    />
                </Row>
                <Row tag='form' className='gy-1 pt-75'>
                    <h6>Kết quả trùng lặp với các tài liệu cùng đợt kiểm tra</h6>
                    <DataTable
                        noHeader
                        // pagination
                        columns={secondColumns}
                        // paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                        // data={searchValue.length ? filteredData.data : data.data}
                        data={[{ id: 1, name: 'Alo', courseId: 1, percentage: '85' }]}
                        // paginationServer
                        // paginationTotalRows={totalCount}
                        // paginationComponentOptions={{
                        //     rowsPerPageText: 'Số hàng trên 1 trang:'
                        // }}
                        // onChangeRowsPerPage={handlePerRowsChange}
                        // onChangePage={handlePagination}
                        // customStyles={customStyles}
                        expandableRows
                        expandableRowsComponent={(prev) => ExpandedComponent(prev)}
                        expandOnRowClicked
                    />
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default ResultCheckingDocument