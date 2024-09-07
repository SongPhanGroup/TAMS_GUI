// ** React Imports
// ** Reactstrap Imports
import { useNavigate, useParams } from "react-router-dom"
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
    Spinner
} from "reactstrap"
import {
    Table,
    Spin
} from "antd"
import { useEffect, useState } from "react"
import { checkSentence } from "../../../../api/checking_sentence"

const SentenceModal = ({ open, sentence, handleModal }) => {
    const params = useParams()
    const navigate = useNavigate()
    const [loadingData, setLoadingData] = useState(false)
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [count, setCount] = useState()


    const getData = () => {
        setLoadingData(true)
        checkSentence(sentence).then(res => {
            setData(res?.finalResult)
            setCount(res?.finalResult.count)
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setLoadingData(false)
        })
    }

    useEffect(() => {
        if (open) {
            getData()
        }
    }, [open])

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
            title: "Câu",
            dataIndex: "text",
            width: 500,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record?.text}</span>
            ),
        },
        {
            title: "Văn bản",
            dataIndex: "title",
            width: 200,
            render: (text, record, index) => (
                <span style={{ whiteSpace: 'break-spaces' }}>{record?.title}</span>
            ),
        },
        {
            title: "Độ tương đồng",
            dataIndex: "similarity",
            align: "center",
            width: 50,
            render: (text, record, index) => (
                <span>{record?.similarity}</span>
            ),
        }
    ]
    return (
        <Modal isOpen={open} toggle={handleModal} className='modal-dialog-top' style={{ maxWidth: '60%' }}>
            <ModalHeader className='bg-transparent' toggle={handleModal}></ModalHeader>
            <ModalBody className='px-sm-3 mx-50 pb-2' style={{ paddingTop: 0 }}>
                <div className='text-center mb-1'>
                    <h2 className='mb-1'>Danh sách các câu tương đồng</h2>
                </div>
                <Row tag='table' className='gy-1 pt-75'>
                    {loadingData === true ? <Spin /> : <Table
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
                </Row>
            </ModalBody>
        </Modal>
    )
}

export default SentenceModal