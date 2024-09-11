import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import {
    Row,
    Col,
    Card,
    Button,
    CardBody,
    CardText,
    Progress,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    UncontrolledDropdown,
    CardTitle,
    CardHeader
} from 'reactstrap'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { DatePicker } from "antd"

import dayjs from "dayjs"
import { getCheckingDocumentStatisticByTime } from '../../../api/checking_document_statistic'
import { toDateString, toDateStringv2 } from '../../../utility/Utils'

const { RangePicker } = DatePicker
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController,
    ChartDataLabels
)

// const labels = ["Đơn vị 1", "Đơn vị 2", "Đơn vị 3", "Đơn vị 4", "Đơn vị 5", "Đơn vị 6", "Đơn vị 7", "Đơn vị 8", "Đơn vị 9", "Đơn vị 10", "Đơn vị 11", "Đơn vị 12"]
// const labels = ["2018", "2019", "2020", "2021", "2022", "2023"]

export default function CountNumChecking() {
    const [data, setData] = useState([])
    const [start_date, setStartDate] = useState(toDateStringv2(new Date(new Date().getFullYear(), 0, 1)))
    const [end_date, setEndDate] = useState(toDateStringv2(new Date(new Date().getFullYear(), 11, 31)))

    useEffect(() => {
        if (start_date && end_date) {
            getCheckingDocumentStatisticByTime({
                params: {
                    startDate: start_date,
                    endDate: end_date
                }
            }).then(res => {
                setData(res.data)
            })
        }
    }, [start_date, end_date])

    const title = "Số lượt kiểm tra tài liệu theo thời gian"
    const labelData = data?.map(item => `Tháng ${item.month}`)
    const dataChart = {
        labels: labelData,
        datasets: [
            {
                label: "Số lượt kiểm tra tài liệu",
                data: data?.map(item => item.count),
                backgroundColor: "rgba(245,34,45,0.8)"
            }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2, // Tỷ lệ khung hình
        scales: {
            y: {
                min: 0, // Giá trị tối thiểu của trục y
                max: 20, // Giá trị tối đa của trục y
                ticks: {
                    beginAtZero: true, // Bắt đầu từ 0
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            tooltip: {
                enabled: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: 'black', // Màu chữ của số liệu
                font: {
                    weight: 'bold',
                    size: 14,
                },
                formatter: (value) => value, // Hiển thị giá trị thực
            },
        },
    }

    const currentYear = new Date().getFullYear()

    const handleChangeTime = (date, dateString) => {
        if (!dateString[0] && !dateString[1]) {
            setStartDate(toDateStringv2(new Date(new Date().getFullYear(), 0, 1)))
            setEndDate(toDateStringv2(new Date(new Date().getFullYear(), 11, 31)))
        } else {
            setStartDate(toDateStringv2(dateString[0]))
            setEndDate(toDateStringv2(dateString[1]))
        }
    }

    return (
        <Card style={{ position: "relative", width: "100%" }}>
            <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
                <div>
                    <CardTitle className='mb-75' tag='h4'>
                        {title}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardBody>
                <div className="d-flex col col-4" style={{ justifyContent: "flex-start", marginRight: "1rem", alignItems: "center" }}>
                    <span style={{ marginRight: "1rem" }}>Thời gian</span>
                    <RangePicker
                        style={{
                            width: "70%",
                        }}
                        // defaultValue={[dayjs(`${currentYear}-01-01`), dayjs(`${currentYear}-12-31`)]}
                        format={"DD/MM/YYYY"}
                        allowClear={true}
                        onChange={handleChangeTime} 
                    />
                </div>
                <Chart type='bar' data={dataChart} options={options} />
            </CardBody>
        </Card>
    )
}
