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
    Form
} from "reactstrap"

// ** Third Party Components

// ** Utils

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import { ChevronDown } from "react-feather"
import DataTable from "react-data-table-component"
import { forwardRef } from "react"

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef((props, ref) => (
    <div className='form-check'>
        <Input type='checkbox' ref={ref} {...props} />
    </div>
))

const ResultCheckingDocument = ({ open, handleResultModal, dataEdit }) => {

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

    console.log(dataEdit)

    // const handleChangeFile = (event) => {
    //     const file = event.target.files[0]
    //     setFile(file)
    // }

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
            selector: row => <span style={{
                whiteSpace: 'break-spaces'
            }}>{row.name}</span>
        },
        {
            name: "Đợt kiểm tra",
            center: true,
            minWidth: "50px",
            selector: row => row.courseId
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

    return (
        <Modal isOpen={open} toggle={handleResultModal} className='modal-dialog-centered modal-lg'>
            <ModalHeader className='bg-transparent' toggle={handleCloseModal}></ModalHeader>
            <ModalBody className='px-sm-5 mx-50 pb-5'>
                <div className='text-center mb-2'>
                    <h1 className='mb-1'>Kết quả kiểm tra tài liệu</h1>
                </div>
                <Row>
                    <h6>Kết quả trùng lặp so với CSDL mẫu: </h6>
                </Row>
                <Row tag='form' className='gy-1 pt-75'>
                    <DataTable
                        noHeader
                        // pagination
                        columns={subColumns}
                        // paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                    // data={searchValue.length ? filteredData.data : data.data}
                    // data={dataDetailById}
                    // paginationServer
                    // paginationTotalRows={totalCount}
                    // paginationComponentOptions={{
                    //     rowsPerPageText: 'Số hàng trên 1 trang:'
                    // }}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    // onChangePage={handlePagination}
                    // customStyles={customStyles}
                    />
                </Row>
                <Row tag='form' className='gy-1 pt-75'>
                    <DataTable
                        noHeader
                        // pagination
                        columns={subColumns}
                        // paginationPerPage={perPage}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10} />}
                        selectableRowsComponent={BootstrapCheckbox}
                    // data={searchValue.length ? filteredData.data : data.data}
                    // data={dataDetailById}
                    // paginationServer
                    // paginationTotalRows={totalCount}
                    // paginationComponentOptions={{
                    //     rowsPerPageText: 'Số hàng trên 1 trang:'
                    // }}
                    // onChangeRowsPerPage={handlePerRowsChange}
                    // onChangePage={handlePagination}
                    // customStyles={customStyles}
                    />
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default ResultCheckingDocument