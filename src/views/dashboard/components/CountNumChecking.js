import React from 'react'
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

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    LineController,
    BarController
)

// const labels = ["Đơn vị 1", "Đơn vị 2", "Đơn vị 3", "Đơn vị 4", "Đơn vị 5", "Đơn vị 6", "Đơn vị 7", "Đơn vị 8", "Đơn vị 9", "Đơn vị 10", "Đơn vị 11", "Đơn vị 12"]
const labels = ["2018", "2019", "2020", "2021", "2022", "2023"]
const fakeData = [
    {
        count: 10,
        month: "Tháng 1",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 12,
        month: "Tháng 2",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 8,
        month: "Tháng 3",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 4,
        month: "Tháng 4",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 7,
        month: "Tháng 5",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 8,
        month: "Tháng 6",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 10,
        month: "Tháng 7",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 9,
        month: "Tháng 8",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 5,
        month: "Tháng 9",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 5,
        month: "Tháng 10",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 4,
        month: "Tháng 11",
        backgroundColor: "rgba(245,34,45,0.8)"
    },
    {
        count: 2,
        month: "Tháng 12",
        backgroundColor: "rgba(245,34,45,0.8)"
    }
]
export default function CountNumChecking() {
    const title = "Số lượt kiểm tra tài liệu theo thời gian"
    const labelData = fakeData?.map(item => item.month)
    const data = fakeData?.map(item => item.count)
    const dataChart = {
        labels: labelData,
        datasets: [
            {
                label: "Số lượt kiểm tra tài liệu",
                data: fakeData?.map(item => item.count),
                backgroundColor: "rgba(245,34,45,0.8)"
            }
        ]
    }
    console.log(dataChart)
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
                <Chart type='bar' data={dataChart} options={options} />
            </CardBody>
        </Card>
    )
}
