import {useEffect, useState} from "react";
import {Col, message, Row, Table, Typography} from "antd";
import moment from "moment";
import {parkingLogsService} from "../services/parkingLogsService";
import {formatToBrazilianCurrency} from "../utils/currency-utils";

const PAGE_SIZE = 10;

export function ParkingLogs() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [parkingLogs, setParkingLogs] = useState([]);

  useEffect(() => {
    getParkingLogs(currentPage)
  }, [currentPage])

  const columns = [
    {
      title: "Vaga",
      dataIndex: "parkingPlaceId"
    },
    {
      title: "Entrada",
      dataIndex: "entranceTime",
      render: (_, row) => row.entranceTime ? moment(row.entranceTime).format("DD/MM/YYYY - HH:mm") : null
    },
    {
      title: "Saída",
      dataIndex: "exitTime",
      render: (_, row) => row.exitTime ? moment(row.exitTime).format("DD/MM/YYYY - HH:mm") : null
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      render: (_, row) => row.customer?.name
    },
    {title: "Veículo", dataIndex: "vehicle"},
    {title: "Placa", dataIndex: "vehiclePlate"},
    {
      title: "Convênio",
      dataIndex: "partner",
      render: (_, row) => row.partner?.name
    },
    {
      title: "Valor de desconto",
      dataIndex: "discountValue",
      render: (_, row) => row.discountValue && formatToBrazilianCurrency(row.discountValue)
    },
    {
      title: "Valor total",
      dataIndex: "totalValue",
      render: (_, row) => row.totalValue && formatToBrazilianCurrency(row.totalValue)
    },
  ]

  async function getParkingLogs(page) {
    try {
      setLoading(true)
      const {items, count} = await parkingLogsService().getAllPaged(page, PAGE_SIZE);
      setParkingLogs(items)
      setCount(count)
    } catch {
      message.error("Falha ao obter lista de vagas de estacionamento");
    } finally {
      setLoading(false)
    }
  }

  function handleChange(pagination) {
    setPage(pagination.current);
  }

  return (
    <div>
      <Row align={"top"} justify={"space-between"}>
        <Col>
          <Typography.Title level={2}>Relatório de vagas</Typography.Title>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{current: currentPage, pageSize: PAGE_SIZE, total: count}}
        dataSource={parkingLogs}
        onChange={handleChange}
      />
    </div>
  )
}