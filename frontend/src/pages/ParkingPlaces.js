import {useEffect, useState} from "react";
import {Col, message, Row, Table, Typography} from "antd";
import {parkingPlacesService} from "../services/parkingPlacesService";
import moment from "moment";

const PAGE_SIZE = 10;

export function ParkingPlaces() {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [parkingPlaces, setParkingPlaces] = useState([]);

  useEffect(() => {
    getParkingPlaces(currentPage)
  }, [currentPage])

  const columns = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Ocupado",
      dataIndex: "isOccupied",
      render: (_, row) => row.isOccupied ? "Sim" : "Não",
      filters: [
        {
          text: 'Sim',
          value: true,
        },
        {
          text: 'Não',
          value: false,
        }
      ],
      onFilter: (value, record) => record.isOccupied === value,
    },
    {
      title: "Cliente",
      dataIndex: "customer",
      render: (_, row) => row.customer?.name
    },
    { title: "Veículo", dataIndex: "vehicle" },
    { title: "Placa", dataIndex: "vehiclePlate" },
    {
      title: "Horário Entrada",
      dataIndex: "entranceTime",
      render: (_, row) => row.entranceTime ? moment(row.entranceTime).format("HH:mm") : null
    },
  ]

  async function getParkingPlaces(page) {
    try {
      setLoading(true)
      const { items, count } = await parkingPlacesService().getAllPaged(page, PAGE_SIZE);
      setParkingPlaces(items)
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
          <Typography.Title level={2}>Vagas</Typography.Title>
        </Col>
      </Row>

      <Table
        loading={loading}
        columns={columns}
        rowKey={record => record.id}
        pagination={{ current: currentPage, pageSize: PAGE_SIZE, total: count }}
        dataSource={parkingPlaces}
        onChange={handleChange}
      />
    </div>
  )
}