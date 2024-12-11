
import { Table, Tag, Row, Col, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Label } from "reactstrap"
import moment from "moment"
import { listAllscienceResearch } from "../../../../api/scienceResearch"
import { render } from "react-dom"
import { changeAlias } from "../../../../utility/utils/formatText"

const TimKiemTraCuu = () => {
    const [count, setCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [dataSource, setDataSource] = useState([])
    const [searchName, setName] = useState()


    const getData = () => {
        const splitSearch = searchName?.split(" ").join("+")

        listAllscienceResearch({
            params: {
                page: currentPage,
                limit: rowsPerPage,
                ...(splitSearch && splitSearch !== "" && { name: splitSearch }),
            }
        }).then((res) => {

            setCount(res.count)
            setDataSource(res.data)

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
            dataIndex: "name",
            render: (value) => {

                const array = value?.split(" ")

                if (Array.isArray(array)) {
                    const newArray = array.map((item) => {
                        // if (searchName && changeAlias(searchName).includes(changeAlias(item))) {
                        if (searchName && searchName.toLowerCase().includes(item.toLowerCase())) {

                            // return `<p style={{backgroundColor:"yellow"}}>${item}</p>`
                            return <span style={{ backgroundColor: "yellow" }}>{item}  </span>

                        } else {
                            return <span>{item}  </span>
                        }

                    })
                    return <p>{newArray}</p>
                    // return value
                } else {
                    return <p>{value}</p>
                }

            }
        },
        {
            title: "Mã đề tài",
            dataIndex: "code",
            align: "center",
        },
        {
            title: "Chủ nhiệm đề tài",
            dataIndex: "leader",
            align: "center",
            width: "10%",
            render: (value) => {
                if (Array.isArray(value)) {
                    return value[0]?.l_Name ? value[0]?.l_Name : value[0]?.staff_Name ? value[0]?.staff_Name : ""
                } else return ""
            }

        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "timeStart",
            align: "center",
            render: (value) => moment(value).format('DD/MM/YYYY'),
            width: "12%"
        },
        {
            title: "Cấp quản lý",
            align: "center",
            dataIndex: "topicLevel",
            render: (value) => (value?.levelName ? value?.levelName : ""),
            width: "10%"
        },
        {
            title: "Trạng thái",
            align: "center",
            dataIndex: "statusTopicType",
            render: (value) => <Tag color={value?.statusCode === "HUY" ? "red" : "green"} >{<div>{value?.statusName.split('/')[2]} </div>}</Tag>,
            // render: (value) =>  <Tag color={value?.statusCode === "HUY" ? "red" : "green"} >{value?.statusName.split('/').map((item) => <div>{item}</div>)}</Tag>,     
            width: "10%"
        },

        {
            title: "Mô tả",
            // align: "center",
            dataIndex: "description",
            width: "20%"
        },
    ]


    useEffect(() => {
        getData()
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
