
import { Table, Tag, Row, Col, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Label } from "reactstrap"
import moment from "moment"
import { render } from "react-dom"
import { checkingTitle } from "../../../api/checking_document"

const TimKiemTraCuu = () => {
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [dataSource, setDataSource] = useState([])
    const [searchName, setName] = useState()


    const getData = () => {
        const splitSearch = searchName?.split(" ").join("+")
        checkingTitle({
            title: searchName
        }).then((res) => {
            setCount(res?.length)
            setDataSource(res)
        }).catch(err => {
            console.log(err)
        })
    }

    const columns = [
        {
            title: "STT",
            width: 30,
            align: "center",
            render: (value, record, index) => <span>{((currentPage - 1) * rowsPerPage) + index + 1}</span>,
        },
        {
            title: "Tên đề tài",
            dataIndex: "title",
            // render: (value) => {

            //     const array = value?.split(" ")

            //     if (Array.isArray(array)) {
            //         const newArray = array.map((item) => {
            //             if (searchName && searchName.toLowerCase().includes(item.toLowerCase())) {
            //                 return <span style={{ backgroundColor: "yellow" }}>{item}  </span>
            //             } else {
            //                 return <span>{item}  </span>
            //             }
            //         })
            //         return <p>{newArray}</p>
            //         // return value
            //     } else {
            //         return <p>{value}</p>
            //     }

            // }
        },
        {
            title: "Tác giả",
            dataIndex: "author",
        },
        {
            title: "Người hướng dẫn",
            dataIndex: "supervisor",
        },
        {
            title: "Thời gian công bố",
            dataIndex: "publishDate",
            align: "center",
            render: (value) => moment(value).format('DD/MM/YYYY'),
            width: "12%"
        },
        {
            title: "Mức độ trùng lặp (%)",
            dataIndex: "similarity",
            align: "center",
            render: (value) => Number(value) * 100,
        },
    ]


    useEffect(() => {
        if (searchName) {
            getData()
        }
    }, [rowsPerPage, currentPage, searchName])
    return (
        <Card>
            <CardHeader>
                <CardTitle tag="h4">Kiểm tra trùng lặp tên đề tài</CardTitle>
            </CardHeader>
            <CardBody style={{ minHeight: "700px" }} className="">

                <Row style={{ marginBottom: "30px", marginTop: "7px" }} gutter={15}>
                    <Col span={24} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "18px" }}>
                        <Input
                            style={{ width: "70%", padding: "15px", borderRadius: "30px" }}
                            type="text"
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setName("")
                                    setRowsPerpage(0)
                                    setDataSource([])
                                }
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    setName(e.target.value)
                                    setCurrentPage(1)
                                    setRowsPerpage(10)

                                }
                            }}
                            placeholder="Tìm kiếm"
                            prefix={<SearchOutlined onClick={(e) => {
                                setName(e.target.value)
                                setCurrentPage(1)
                                setRowsPerpage(10)

                            }} style={{ fontSize: "15px", padding: "4px", color: "#8c8c8c", cursor: "pointer" }} size={30} />} />
                    </Col>
                    <div style={{ textAlign: "center", margin: "0 auto", fontSize: "17px", fontWeight: "700" }}> DANH SÁCH ĐỀ TÀI CÓ TÊN TƯƠNG TỰ</div>
                </Row>
                {
                    dataSource.length > 0 ? <Table
                        columns={columns}
                        dataSource={dataSource}
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
                    /> : ""
                }
            </CardBody>


        </Card>
    )
}

export default TimKiemTraCuu
