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

import { statisticByTime } from '../../../api/document'
// const labels = ["Đơn vị 1", "Đơn vị 2", "Đơn vị 3", "Đơn vị 4", "Đơn vị 5", "Đơn vị 6", "Đơn vị 7", "Đơn vị 8", "Đơn vị 9", "Đơn vị 10", "Đơn vị 11", "Đơn vị 12"]
const labels = ["2018", "2019", "2020", "2021", "2022", "2023"]
const fakeData = [
    {
        count1: 10,
        count2: 8,
        month: "Tháng 1",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 12,
        count2: 10,
        month: "Tháng 2",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 8,
        count2: 10,
        month: "Tháng 3",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 4,
        count2: 10,
        month: "Tháng 4",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 7,
        count2: 9,
        month: "Tháng 5",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 8,
        count2: 6,
        month: "Tháng 6",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 10,
        count2: 6,
        month: "Tháng 7",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 9,
        count2: 12,
        month: "Tháng 8",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 5,
        count2: 7,
        month: "Tháng 9",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 5,
        count2: 12,
        month: "Tháng 10",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count1: 4,
        count2: 6,
        month: "Tháng 11",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 2,
        month: "Tháng 12",
        backgroundColor: "rgba(245,34,45,0.8)"
    }
]
export default function DocumentByTime() {
    const currentYear = new Date().getFullYear()
    const [filter, setFilter] = useState({
        startDate: dayjs(`${currentYear}-01-01`),
        endDate: dayjs(`${currentYear}-12-31`)
    })
    // const [dataChart, setDataChart] = useState()
    const title = "Tổng số tài liệu mẫu bổ sung vào hệ thống theo thời gian"
    const labelData = fakeData?.map(item => item.month)
    const data = fakeData?.map(item => item.count)
    const dataChart = {
        labels: labelData,
        datasets: [
            {
                label: "Luận văn",
                data: fakeData?.map(item => item.count1),
                backgroundColor: "rgba(245,34,45,0.8)"
            },
            {
                label: "Luận án",
                data: fakeData?.map(item => item.count2),
                backgroundColor: "rgba(34,150,245,1)"
            }
        ]
    }
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        // maintainAspectRatio: true,
        aspectRatio: 2, // Tỷ
        scales: {
            y: {
                min: 0, // Giá trị tối thiểu của trục y
                max: 20, // Giá trị tối đa của trục y
                ticks: {
                    beginAtZero: true, // Bắt đầu từ 0
                },
            },
        },
        legend: {
            display: true,
            position: 'bottom',
        },
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
            },
            // Thêm datalabels plugin để hiển thị nhãn dữ liệu
            datalabels: {
                anchor: 'end',  // Đặt vị trí nhãn dữ liệu ở cuối cột
                align: 'end',   // Căn chỉnh nhãn dữ liệu
                formatter: (value) => value, // Định dạng hiển thị của nhãn (ở đây là giá trị trực tiếp)
                color: '#000',  // Màu của nhãn dữ liệu
            }
        }
    }
    useEffect(() => {
        statisticByTime({
            params: {
                startDate: filter?.startDate,
                endDate: filter?.endDate
            }
        }).then((res) => {
            const data = res?.data ?? []
            // setDataChart({
            //     labels: data?.map(item => `Tháng ${item.month}`),
            //     datasets: [
            //         {

            //         }
            //     ]
            // })
        }).catch(() => {
            console.log("Error fetching data")
        })
    }, [filter])
    const handleChangeDates = (dates) => {
        console.log(dates, "dates")
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
                    <DatePicker.RangePicker
                        style={{
                            width: "70%",
                        }}
                        defaultValue={[filter?.startDate, filter?.endDate]}
                        format={"DD/MM/YYYY"}
                        allowClear={false}
                        onChange={handleChangeDates}
                    />
                </div>
                <Chart type='bar' data={dataChart} options={options} />
            </CardBody>
        </Card>
    )
}
